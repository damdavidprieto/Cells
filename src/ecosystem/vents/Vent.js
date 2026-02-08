/**
 * Vent.js
 * =======
 * Represents an individual hydrothermal or volcanic vent.
 * Environment-aware: Behaves differently if it's in the Ocean, on Land, or in the Air.
 */
class Vent {
    constructor(config) {
        this.id = config.id || `vent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.x = config.x; // Grid Column
        this.y = config.y; // Pixel Y
        this.width = config.width || 3;

        // Internal pixel position for proximity calculations
        const res = (config.config && config.config.resolution) ? config.config.resolution : 60;
        this.pos = { x: this.x * res, y: this.y };
        this.type = config.type; // From VentTypes
        this.intensity = config.intensity || 1.0;

        // Environment State
        this.context = config.context || 'SUBMARINE'; // Defaults to SUBMARINE for vents
        this.forceContext = config.forceContext || !!config.context; // Lock context if explicitly provided

        // Bounding Box (for cell movement restriction)
        // IMPORTANT: Use this.pos.x (pixels) not this.x (grid column index)
        const pixelWidth = this.width * res;
        this.bounds = {
            left: this.pos.x - (pixelWidth / 2),
            right: this.pos.x + (pixelWidth / 2),
            top: this.y - (pixelWidth / 2),
            bottom: this.y + (pixelWidth / 2)
        };

        // DEBUG: Log vent creation
        console.log(`[Vent] Created ${this.id}:`, {
            context: this.context,
            forceContext: this.forceContext,
            gridX: this.x,
            pixelX: this.pos.x,
            y: this.y,
            type: this.type.id,
            bounds: this.bounds
        });

        // Lifecycle System
        this.lifecycle = new VentLifecycle(this.type.lifecycle || {});

        // Plume Calculator
        this.plumeCalculator = new VentPlumeCalculator(this);

        // Visual Plume (particles)
        this.plume = new VentPlume(this);
    }

    /**
     * Update vent behavior based on surroundings
     */
    update(env) {
        // Update lifecycle
        this.lifecycle.update();

        // Only inject chemicals if active
        if (this.lifecycle.isActive()) {
            this._detectContext(env);
            this._injectChemicals(env);
            this._applyThermalEffects(env);
        }

        // Update visual plume
        this.plume.update();
    }

    /**
     * Detects where the vent is located (Ocean vs Land vs Air)
     */
    _detectContext(env) {
        // Skip detection if context was explicitly set in configuration
        if (this.forceContext) {
            console.log(`[Vent] ${this.id} context locked to ${this.context}`);
            return;
        }

        const gridY = Math.floor(this.y / env.resolution);

        if (env.stratification.isInWater(this.x, gridY)) {
            this.context = 'SUBMARINE';
        } else if (env.stratification.isInSediment(gridY)) {
            // It's in sediment. Is there water above it?
            if (gridY > 0 && env.stratification.isInWater(this.x, gridY - 1)) {
                this.context = 'SUBMARINE'; // Still submarine if it's the source point
            } else {
                this.context = 'SUBAERIAL'; // On dry land
            }
        } else {
            this.context = 'SUBMARINE'; // Default to submarine instead of atmospheric to avoid generic circles
        }
    }

    /**
     * Check if a point (in pixels) is within this vent's bounds
     */
    containsPoint(x, y) {
        return x >= this.bounds.left &&
            x <= this.bounds.right &&
            y >= this.bounds.top &&
            y <= this.bounds.bottom;
    }

    _injectChemicals(env) {
        // Get plume cells
        const plumeCells = this.plumeCalculator.calculatePlume(env);

        // Inject each chemical type
        const chemicals = ['h2', 'co2', 'fe2', 'ch4', 'h2s', 'nh3'];

        for (let chemical of chemicals) {
            const baseFlux = VentChemistry.getChemicalFlux(this, chemical, env);
            if (baseFlux <= 0) continue;

            const gridName = chemical + 'Grid';
            const grid = env[gridName];
            if (!grid) continue;

            const maxAccumulation = VentChemistry.getMaxAccumulation(chemical);

            // Inject with gradient
            for (let cell of plumeCells) {
                const amount = baseFlux * cell.decay;
                this._addChemical(grid, cell.x, cell.y, amount, maxAccumulation);
            }
        }
    }

    _addChemical(grid, x, y, amount, max) {
        if (!grid[x]) return;
        grid[x][y] += amount;
        if (max) grid[x][y] = Math.min(grid[x][y], max);
    }

    _applyThermalEffects(env) {
        if (!env.temperatureGrid) return;

        const radius = Math.floor(this.width / 2);
        const startX = Math.floor(Math.max(0, this.x - radius));
        const endX = Math.floor(Math.min(env.cols - 1, this.x + radius));
        const targetY = Math.floor(this.y / env.resolution);

        // Validación: Prevenir NaN que causa crash
        if (isNaN(startX) || isNaN(endX) || isNaN(targetY)) {
            console.error('[Vent] Invalid coordinates:', { startX, endX, targetY, x: this.x, y: this.y, cols: env.cols, resolution: env.resolution });
            return;
        }

        for (let i = startX; i <= endX; i++) {
            // Heat source: ensures minimum temperature
            if (env.temperatureGrid && env.temperatureGrid[i]) {
                env.temperatureGrid[i][targetY] = Math.max(env.temperatureGrid[i][targetY] || 0, this.type.temperature);

                // Subaerial vents (land) also conduct heat downwards into sediment
                if (this.context === 'SUBAERIAL' && targetY + 1 < env.rows) {
                    if (env.temperatureGrid[i][targetY + 1] !== undefined) {
                        env.temperatureGrid[i][targetY + 1] = Math.max(env.temperatureGrid[i][targetY + 1], this.type.temperature * 0.8);
                    }
                }
            }
        }
    }

    /**
     * Render this vent (delegated to VentRenderer)
     */
    render(env) {
        // Rendering is handled by VentRenderer in VentManager
        // This method exists for compatibility
    }

    /**
     * Get current chemical outputs for monitoring
     */
    getCurrentH2Output() {
        return VentChemistry.getChemicalFlux(this, 'h2', window.environment || {});
    }

    getCurrentCO2Output() {
        return VentChemistry.getChemicalFlux(this, 'co2', window.environment || {});
    }

    getCurrentFe2Output() {
        return VentChemistry.getChemicalFlux(this, 'fe2', window.environment || {});
    }

    getCurrentCH4Output() {
        return VentChemistry.getChemicalFlux(this, 'ch4', window.environment || {});
    }

    getCurrentH2SOutput() {
        return VentChemistry.getChemicalFlux(this, 'h2s', window.environment || {});
    }

    getCurrentNH3Output() {
        return VentChemistry.getChemicalFlux(this, 'nh3', window.environment || {});
    }

    /**
     * Get visual intensity for rendering (0-1)
     */
    getVisualIntensity() {
        const lifecycleMultiplier = this.lifecycle ? this.lifecycle.getIntensityMultiplier() : 1.0;
        return this.intensity * lifecycleMultiplier;
    }

    /**
     * Set intensity and invalidate plume cache
     */
    setIntensity(newIntensity) {
        this.intensity = Math.max(0, Math.min(3.0, newIntensity));
        this.plumeCalculator.invalidateCache();
    }
}
