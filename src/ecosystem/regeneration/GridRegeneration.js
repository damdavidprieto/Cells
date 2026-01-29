/**
 * GRID REGENERATION - Resource Regeneration Logic
 * ================================================
 * 
 * Handles regeneration of resources over time:
 * - Light (constant regeneration from sunlight)
 * - Nitrogen (slow regeneration in sediment)
 * - Phosphorus (very slow regeneration in sediment)
 * - H₂ (continuous production in vents)
 * - O₂ (photolysis UV in surface) - NEW
 */
class GridRegeneration {
    constructor() {
        this.oxygenRegen = new OxygenRegeneration();
    }

    update(environment) {
        this.regenerateLight(environment);
        this.regenerateNitrogen(environment);
        this.regeneratePhosphorus(environment);
        this.regenerateOxygen(environment);
        this.regenerateH2(environment);
    }

    regenerateLight(environment) {
        let startCol = 0;
        let endCol = environment.cols;

        if (environment.config && environment.config.restrictToVents) {
            startCol = environment.waterStartCol;
            endCol = environment.waterEndCol;
        }

        for (let i = startCol; i < endCol; i++) {
            for (let j = 0; j < environment.rows; j++) {
                let depthRatio = j / environment.rows;
                let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.light : 1.0;
                let maxLight = (100 * fluxMult) * exp(-4 * depthRatio);

                if (environment.lightGrid[i][j] < maxLight) {
                    environment.lightGrid[i][j] += 0.5 * fluxMult;
                }
            }
        }
    }

    regenerateOxygen(environment) {
        this.oxygenRegen.regenerate(environment);

        let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.oxygen : 1.0;

        if (fluxMult !== 1.0) {
            let startCol = 0;
            let endCol = environment.cols;

            if (environment.config && environment.config.restrictToVents) {
                startCol = environment.waterStartCol;
                endCol = environment.waterEndCol;
            }

            for (let i = startCol; i < endCol; i++) {
                for (let j = 0; j < environment.rows; j++) {
                    let extra = 0.05 * (fluxMult - 1.0);
                    if (extra !== 0) {
                        environment.oxygenGrid[i][j] += extra;
                        environment.oxygenGrid[i][j] = Math.max(0, min(environment.oxygenGrid[i][j], 100));
                    }
                }
            }
        }
    }

    regenerateNitrogen(environment) {
        let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.nitrogen : 1.0;

        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {
                if (j >= environment.sedimentRow) {
                    if (environment.config && environment.config.restrictToVents) {
                        if (i < environment.waterStartCol || i >= environment.waterEndCol) {
                            environment.nitrogenGrid[i][j] = 0;
                            continue;
                        }
                    }
                    environment.nitrogenGrid[i][j] += GameConstants.VENT_NITROGEN_FLUX * fluxMult;
                    environment.nitrogenGrid[i][j] = min(environment.nitrogenGrid[i][j], GameConstants.NITROGEN_GRID_MAX);
                }
            }
        }
    }

    regeneratePhosphorus(environment) {
        // PhosphorusRegeneration is still used as static or I should normalize it too.
        // Assuming I'll normalize it next.
        if (typeof PhosphorusRegeneration !== 'undefined') {
            if (!this.phosphorusRegen) this.phosphorusRegen = new PhosphorusRegeneration();
            this.phosphorusRegen.regenerate(environment);
        }

        let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.phosphorus : 1.0;
        if (fluxMult !== 1.0) {
            for (let i = 0; i < environment.cols; i++) {
                for (let j = 0; j < environment.rows; j++) {
                    if (j >= environment.sedimentRow) {
                        let extra = GameConstants.VENT_PHOSPHORUS_FLUX * (fluxMult - 1.0);
                        if (extra !== 0) {
                            environment.phosphorusGrid[i][j] += extra;
                            environment.phosphorusGrid[i][j] = Math.max(0, min(environment.phosphorusGrid[i][j], GameConstants.PHOSPHORUS_GRID_MAX));
                        }
                    }
                }
            }
        }
    }

    regenerateH2(environment) {
        let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.h2 : 1.0;
        let isSingleVent = GameConstants.EXECUTION_MODE === 'SINGLE_VENT_MODE';
        let centerCol = Math.floor(environment.cols / 2);
        let ventRadius = 0;

        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {
                if (j >= environment.sedimentRow) {
                    if (isSingleVent && Math.abs(i - centerCol) > ventRadius) {
                        environment.h2Grid[i][j] = 0;
                        continue;
                    }
                    environment.h2Grid[i][j] += GameConstants.H2_VENT_PRODUCTION * fluxMult;
                    environment.h2Grid[i][j] = min(environment.h2Grid[i][j], GameConstants.H2_MAX_ACCUMULATION);
                }
            }
        }
    }
}
