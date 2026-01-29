/**
 * Component: DynamicsManager
 * Orchestrates physical and chemical changes in the environment.
 */
class DynamicsManager {
    constructor(config) {
        this.config = config;
        this.ventManager = new VentManager();
        this.ventManager.initialize(config);

        // Normalized Sub-systems (Instances)
        this.regeneration = new GridRegeneration();
        this.reservoirs = new ReservoirSystem();
        this.diffusion = new DiffusionSystem();
        this.oxygenSinks = new OxygenRegeneration(); // For iron oxidation
    }

    update(env) {
        // 1. Specialized Sources (Vents)
        this.ventManager.update(env);

        // 2. Global Regeneration
        this.regeneration.update(env);

        // 3. Sinks (Iron oxidation)
        if (!env.progressiveOxygenEnabled) {
            this.oxygenSinks.oxidarHierro(env);
        }

        // 4. Reservoir Diffusion
        this.reservoirs.update(env);

        // 5. Internal Diffusion
        this.diffusion.update(env);
    }

    applyEnvironmentalDecay(gridSystem, stratification) {
        const decay = GameConstants.ENVIRONMENTAL_DECAY || 0.999;

        for (let i = stratification.waterStartCol; i < stratification.waterEndCol; i++) {
            for (let j = stratification.waterStartRow; j < stratification.waterEndRow; j++) {
                if (j < 0 || j >= stratification.rows) continue;

                gridSystem.h2Grid[i][j] *= decay;
                gridSystem.co2Grid[i][j] *= decay;
            }
        }
    }

    maintainBaseline(gridSystem, stratification, multipliers) {
        const base = GameConstants.LUCA_ENVIRONMENT;
        const mult = multipliers || {};

        for (let i = stratification.waterStartCol; i < stratification.waterEndCol; i++) {
            for (let j = stratification.waterStartRow; j < stratification.waterEndRow; j++) {
                if (j < 0 || j >= stratification.rows) continue;

                gridSystem.h2Grid[i][j] = base.H2 * (mult.h2 || 1.0);
                gridSystem.co2Grid[i][j] = base.CO2 * (mult.co2 || 1.0);
                gridSystem.phosphorusGrid[i][j] = base.PHOSPHORUS * (mult.phosphorus || 1.0);
                gridSystem.nitrogenGrid[i][j] = base.NITROGEN * (mult.nitrogen || 1.0);
                gridSystem.oxygenGrid[i][j] = base.OXYGEN * (mult.oxygen || 1.0);

                gridSystem.temperatureGrid[i][j] = base.TEMPERATURE * (mult.temperature || 1.0);
                gridSystem.lightGrid[i][j] = (base.LIGHT || 0) * (mult.light || 1.0);
            }
        }
    }
}
