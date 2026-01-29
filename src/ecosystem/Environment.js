/**
 * ENVIRONMENT - Primordial Ocean Simulation (Modularized Facade)
 * ============================================================
 * 
 * Orchestrates specialized components:
 * - StratificationManager: Boundaries and layers.
 * - GridSystem: Resource storage.
 * - DynamicsManager: Physics and chemistry simulation.
 * - EnvironmentRenderer: Visualization.
 * - StatsManager: Analytics and stability.
 */
class Environment {
    constructor(config = null) {
        this.config = config || WorldPresets.DEFAULT;
        this.resolution = this.config.resolution;
        this.cols = this.config.cols > 0 ? this.config.cols : ceil(width / this.resolution);
        this.rows = this.config.rows > 0 ? this.config.rows : ceil(height / this.resolution);

        // SYNC CONFIG: Ensure sub-systems (like VentFactory) see the resolved dimensions
        this.config.cols = this.cols;
        this.config.rows = this.rows;

        // Core Components
        this.stratification = new StratificationManager(this.config, this.rows, this.cols);
        this.grids = new GridSystem(this.cols, this.rows);
        this.dynamics = new DynamicsManager(this.config);
        this.renderer = new EnvironmentRenderer(this.resolution);
        this.stats = new StatsManager(this.grids, this.stratification);

        // Legacy Properties (for backward compatibility)
        this.fluxMultipliers = {
            h2: 1.0, co2: 1.0, nitrogen: 1.0, phosphorus: 1.0,
            light: 1.0, temperature: 1.0, oxygen: 1.0, ph: 1.0
        };

        // Stability System (Delegated to StatsManager)
        this.currentStability = 0.5;

        // Grid Proxies (Direct access for performance/compatibility)
        this.lightGrid = this.grids.lightGrid;
        this.oxygenGrid = this.grids.oxygenGrid;
        this.nitrogenGrid = this.grids.nitrogenGrid;
        this.phosphorusGrid = this.grids.phosphorusGrid;
        this.uvRadiationGrid = this.grids.uvRadiationGrid;
        this.co2Grid = this.grids.co2Grid;
        this.h2Grid = this.grids.h2Grid;
        this.fe2Grid = this.grids.fe2Grid;
        this.ch4Grid = this.grids.ch4Grid;
        this.h2sGrid = this.grids.h2sGrid;
        this.nh3Grid = this.grids.nh3Grid;
        this.temperatureGrid = this.grids.temperatureGrid;

        // Stratification Proxies
        this.atmosphereRow = this.stratification.atmosphereRow;
        this.sedimentRow = this.stratification.sedimentRow;
        this.waterStartCol = this.stratification.waterStartCol;
        this.waterEndCol = this.stratification.waterEndCol;
        this.waterStartRow = this.stratification.waterStartRow;
        this.waterEndRow = this.stratification.waterEndRow;

        // System Proxies
        this.ventSystem = this.dynamics.ventManager;

        // SANITIZE (Restricted modes)
        if (this.config.restrictToVents) {
            this.grids.sanitize(this.stratification);
        }

        console.log(`[Environment] Initialized Modular Facade: ${this.cols}x${this.rows}`);
    }

    update() {
        // Delegate to DynamicsManager
        this.dynamics.update(this);

        // Maintain State if requested
        if (GameConstants.EXECUTION_MODE === 'SINGLE_VENT_MODE' && GameConstants.SINGLE_VENT_MODE.MAINTAIN_STATE) {
            this.maintainBaseline();
        }
    }

    show() {
        // Delegate to EnvironmentRenderer
        this.renderer.render(this.grids, this.stratification, this.config);
    }

    maintainBaseline() {
        this.dynamics.maintainBaseline(this.grids, this.stratification, this.fluxMultipliers);
    }

    // --- Chemical / Physical Getters ---
    getTemperature(x, y) { return this.grids.get('temperatureGrid', x, y, this.resolution); }
    getUVLevel(x, y) { return this.grids.get('uvRadiationGrid', x, y, this.resolution); }
    getOxygenLevel(x, y) { return this.grids.get('oxygenGrid', x, y, this.resolution); }
    getPH(x, y) { return this.ventSystem ? this.ventSystem.getPHAt(x, y, this) : 8.1; }
    getRedox(x, y) { return this.ventSystem ? this.ventSystem.getRedoxAt(x, y, this) : 0; }
    getTraceElementLevel(x, y, symbol) { return this.ventSystem ? this.ventSystem.getTraceElementLevelAt(x, y, symbol) : 0; }

    // --- Resource Consumption API ---
    consumeLight(x, y, amount) { return this.grids.consume('lightGrid', x, y, this.resolution, amount); }
    consumeOxygen(x, y, amount) { return this.grids.consume('oxygenGrid', x, y, this.resolution, amount); }
    consumeNitrogen(x, y, amount) { return this.grids.consume('nitrogenGrid', x, y, this.resolution, amount); }
    consumePhosphorus(x, y, amount) { return this.grids.consume('phosphorusGrid', x, y, this.resolution, amount); }
    consumeCO2(x, y, amount) { return this.grids.consume('co2Grid', x, y, this.resolution, amount); }
    consumeH2(x, y, amount) { return this.grids.consume('h2Grid', x, y, this.resolution, amount); }
    consumeCH4(x, y, amount) { return this.grids.consume('ch4Grid', x, y, this.resolution, amount); }
    consumeH2S(x, y, amount) { return this.grids.consume('h2sGrid', x, y, this.resolution, amount); }
    consumeNH3(x, y, amount) { return this.grids.consume('nh3Grid', x, y, this.resolution, amount); }

    // --- Production API ---
    produceCO2(x, y, amount) {
        this.grids.add('co2Grid', x, y, this.resolution, amount);
        // Cap (Proxy)
        let col = Math.floor(x / this.resolution);
        let row = Math.floor(y / this.resolution);
        if (this.grids.co2Grid[col]) {
            this.grids.co2Grid[col][row] = Math.min(this.grids.co2Grid[col][row], GameConstants.CO2_MAX_ACCUMULATION);
        }
    }

    produceCH4(x, y, amount) {
        this.grids.add('ch4Grid', x, y, this.resolution, amount);
        let col = Math.floor(x / this.resolution);
        let row = Math.floor(y / this.resolution);
        if (this.grids.ch4Grid[col]) {
            this.grids.ch4Grid[col][row] = Math.min(this.grids.ch4Grid[col][row], GameConstants.CH4_MAX_ACCUMULATION);
        }
    }

    recyclePhosphorus(x, y, amount) {
        if (this.dynamics.regeneration.phosphorusRegen) {
            this.dynamics.regeneration.phosphorusRegen.reciclarFosforo(this, x, y, amount);
        }
    }

    // --- Boundary Queries ---
    isInSediment(y) { return this.stratification.isInSediment(Math.floor(y / this.resolution)); }
    getViscosity(y) { return this.stratification.getViscosity(Math.floor(y / this.resolution)); }
    isValidCellPosition(y) { return this.stratification.isInWater(0, Math.floor(y / this.resolution)); }

    // --- Evolutionary Stats ---
    calculateEnvironmentalStability(cells, deathCount) {
        this.currentStability = this.stats.calculateStability(cells, deathCount);
        return this.currentStability;
    }

    /**
     * Camera Utility: Get the point of interest for the viewport
     */
    getViewportTarget() {
        if (this.ventSystem && this.ventSystem.vents.length > 0) {
            const v = this.ventSystem.vents[0];
            return { x: v.pos.x, y: v.pos.y };
        }
        return null; // World center fallback in Sketch
    }
}
