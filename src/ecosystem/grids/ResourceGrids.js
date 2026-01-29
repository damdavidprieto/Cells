/**
 * RESOURCE GRIDS - Biological Resources Initialization
 * ====================================================
 * 
 * Handles initialization of biological resource grids:
 * - Light (sunlight, exponential decay with depth)
 * - Oxygen (traces from UV photolysis)
 * - Nitrogen (concentrated in sediment)
 * - Phosphorus (very concentrated in sediment, limiting resource)
 */
class ResourceGrids {
    initializeLight(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let lightIntensity = GameConstants.ECOSYSTEM_INIT.LIGHT_SURFACE_INTENSITY *
                    exp(-GameConstants.ECOSYSTEM_INIT.LIGHT_DECAY_RATE * depthRatio);
                let variation = noise(i * 0.1, j * 0.1) * 0.2;
                grid[i][j] = lightIntensity * (1 + variation);
            }
        }
        return grid;
    }

    initializeOxygen(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let oxygenNoise = noise(i * 0.15 + 1000, j * 0.15 + 1000);
                grid[i][j] = map(oxygenNoise, 0, 1,
                    GameConstants.OXYGEN_GRID_MIN,
                    GameConstants.OXYGEN_GRID_MAX);
            }
        }
        return grid;
    }

    initializeNitrogen(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let nitrogenIntensity = 100 * exp(-4 * (1 - depthRatio));
                let nitrogenVariation = noise(i * 0.12 + 2000, j * 0.12 + 2000) * 0.3;
                let finalVal = nitrogenIntensity * (1 + nitrogenVariation);
                grid[i][j] = Math.max(finalVal, GameConstants.OCEANIC_NITROGEN || 50);
            }
        }
        return grid;
    }

    initializePhosphorus(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let phosphorusIntensity = GameConstants.ECOSYSTEM_INIT.PHOSPHORUS_VENT_INTENSITY *
                    exp(-GameConstants.ECOSYSTEM_INIT.PHOSPHORUS_DECAY_RATE * (1 - depthRatio));
                let phosphorusVariation = noise(i * 0.08 + 3000, j * 0.08 + 3000) * 0.4;
                let finalVal = phosphorusIntensity * (1 + phosphorusVariation);
                grid[i][j] = Math.max(finalVal, GameConstants.OCEANIC_PHOSPHORUS || 50);
            }
        }
        return grid;
    }
}
