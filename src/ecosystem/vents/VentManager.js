/**
 * VentManager.js
 * ==============
 * Orchestrates the Vent System.
 * - Manages active vents
 * - Injects chemicals into Environment grids
 * - Handles geological events
 * - Renders vents visually
 * - Logs activity to database
 */
class VentManager {
    constructor() {
        this.vents = [];
        this.factory = new VentFactory();
        this.eventSystem = new VentEventSystem();
        this.renderer = new VentRenderer();
        this.logger = null; // Initialized when database is available
    }

    initialize(config) {
        this.vents = this.factory.createVents(config);
        console.log(`[VentManager] Initialized ${this.vents.length} vents.`);

        // Initialize logger if database available
        if (window.databaseManager && GameConstants.DATABASE_LOGGING?.enabled) {
            this.logger = new VentActivityLogger(window.databaseManager);
            console.log('[VentManager] Activity logging enabled');
        }
    }

    update(env) {
        // 1. Geological events
        this.eventSystem.update(this, env);

        // 2. Update individual vents
        for (let vent of this.vents) {
            vent.update(env);
        }

        // 3. Calculate mixing zones
        this._calculateMixingZones(env);

        // 4. Log activity (periodic)
        if (this.logger && frameCount % 60 === 0) {
            this.vents.forEach(v => this.logger.logVentActivity(v, env));
        }
    }

    render(env) {
        this.renderer.render(this.vents, env);
    }

    /**
     * Calculate and apply mixing zone reactions
     */
    _calculateMixingZones(env) {
        for (let i = 0; i < this.vents.length; i++) {
            for (let j = i + 1; j < this.vents.length; j++) {
                const vent1 = this.vents[i];
                const vent2 = this.vents[j];

                const distance = Math.sqrt(
                    Math.pow(vent1.x - vent2.x, 2) +
                    Math.pow(vent1.y - vent2.y, 2)
                );

                const mixingRadius = (vent1.width + vent2.width) * 2;

                if (distance < mixingRadius) {
                    // Get overlapping cells
                    const mixingCells = this._getMixingCells(vent1, vent2, env);

                    // Apply chemical reactions
                    VentChemistry.calculateMixingReactions(vent1, vent2, mixingCells, env);
                }
            }
        }
    }

    _getMixingCells(vent1, vent2, env) {
        const cells = [];
        const midX = Math.floor((vent1.x + vent2.x) / 2);
        const midY = Math.floor((vent1.y + vent2.y) / (2 * env.resolution));
        const radius = 2;

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const x = midX + dx;
                const y = midY + dy;

                if (x >= 0 && x < env.cols && y >= 0 && y < env.rows) {
                    cells.push({ x, y });
                }
            }
        }

        return cells;
    }

    /**
     * Get data for all vents (for UI/Inspector)
     */
    getVentData() {
        return this.vents.map(v => ({
            id: v.id,
            type: v.type.name,
            typeId: v.type.id,
            position: { x: v.x, y: v.y },
            context: v.context,
            intensity: v.intensity,
            lifecycle: v.lifecycle ? v.lifecycle.getState() : null,
            output: {
                h2: v.getCurrentH2Output(),
                co2: v.getCurrentCO2Output(),
                fe2: v.getCurrentFe2Output(),
                temperature: v.type.temperature
            },
            ph: v.type.ph,
            redox: v.type.redox
        }));
    }

    /**
     * Get vent by ID
     */
    getVentById(id) {
        return this.vents.find(v => v.id === id);
    }

    /**
     * Add a new vent at runtime
     */
    addVent(ventConfig) {
        const vent = this.factory.createVent({
            ...ventConfig,
            config: window.environment?.config || {}
        });

        this.vents.push(vent);
        console.log(`[VentManager] Added new ${vent.type.id} vent at (${vent.x}, ${vent.y})`);

        return vent;
    }

    /**
     * Remove a vent by ID
     */
    removeVent(id) {
        const index = this.vents.findIndex(v => v.id === id);
        if (index !== -1) {
            const removed = this.vents.splice(index, 1)[0];
            console.log(`[VentManager] Removed vent ${id}`);
            return removed;
        }
        return null;
    }

    getRecentEvents(count = 10) {
        return this.eventSystem.getRecentEvents(count);
    }

    /**
     * Get trace element concentration at a point (Efficiency: Proximity Probe)
     * This avoids creating a grid for every single transition metal.
     */
    getTraceElementLevelAt(x, y, symbol) {
        let totalConcentration = 0;

        for (let vent of this.vents) {
            if (vent.type.traceElements && vent.type.traceElements[symbol]) {
                const d = dist(x, y, vent.pos.x, vent.pos.y);
                const maxDist = 400 * vent.intensity; // Area of influence

                if (d < maxDist) {
                    // Quadratic decay for chemical concentration
                    const intensity = vent.type.traceElements[symbol] * vent.intensity;
                    const falloff = 1.0 - (d / maxDist);
                    totalConcentration += intensity * (falloff * falloff);
                }
            }
        }

        return totalConcentration;
    }

    /**
     * Get localized pH based on proximity to vents
     */
    getPHAt(x, y, env) {
        let avgPH = 8.1; // Default ocean pH (alkaline)
        let totalWeight = 1;

        for (let vent of this.vents) {
            const d = dist(x, y, vent.pos.x, vent.pos.y);
            const influence = (vent.width * 5) * vent.intensity;

            if (d < influence) {
                const weight = (1.0 - (d / influence)) * 5;
                avgPH = (avgPH * totalWeight + vent.type.ph * weight) / (totalWeight + weight);
                totalWeight += weight;
            }
        }
        return avgPH;
    }

    /**
     * Get localized Redox potential based on proximity to vents
     */
    getRedoxAt(x, y, env) {
        let avgRedox = 0; // Seawater redox
        let totalWeight = 1;

        for (let vent of this.vents) {
            const d = dist(x, y, vent.pos.x, vent.pos.y);
            const influence = (vent.width * 8) * vent.intensity;

            if (d < influence) {
                const weight = (1.0 - (d / influence)) * 5;
                avgRedox = (avgRedox * totalWeight + vent.type.redox * weight) / (totalWeight + weight);
                totalWeight += weight;
            }
        }
        return avgRedox;
    }

    /**
     * Toggle rendering features
     */
    toggleLabels() {
        this.renderer.toggleLabels();
    }

    togglePlumes() {
        this.renderer.togglePlumes();
    }
}
