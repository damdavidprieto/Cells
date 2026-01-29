/**
 * PHYSICAL GRIDS - Physical Parameters Initialization
 * ===================================================
 * 
 * Handles initialization of physical parameter grids:
 * - UV Radiation (no ozone layer, 10-100× modern levels)
 * - Temperature (future)
 * - pH (future)
 */
class PhysicalGrids {
    initializeUV(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let uvIntensity = GameConstants.UV_SURFACE_INTENSITY *
                    exp(-GameConstants.UV_DECAY_RATE * j);
                grid[i][j] = uvIntensity;
            }
        }
        return grid;
    }

    initializeTemperature(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let range = GameConstants.ECOSYSTEM_INIT.TEMP_VENT - GameConstants.ECOSYSTEM_INIT.TEMP_SURFACE;
                let baseTemp = GameConstants.ECOSYSTEM_INIT.TEMP_SURFACE + (range * depthRatio);
                let tempVariation = noise(i * 0.05 + 6000, j * 0.05 + 6000) * GameConstants.ECOSYSTEM_INIT.TEMP_GRADIENT_NOISE;
                grid[i][j] = baseTemp + tempVariation;
            }
        }
        return grid;
    }

    initializePH(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let range = GameConstants.ECOSYSTEM_INIT.PH_VENT - GameConstants.ECOSYSTEM_INIT.PH_SURFACE;
                let basePH = GameConstants.ECOSYSTEM_INIT.PH_SURFACE + (range * depthRatio);
                let pHVariation = noise(i * 0.08 + 7000, j * 0.08 + 7000) * GameConstants.ECOSYSTEM_INIT.PH_NOISE;
                grid[i][j] = basePH + pHVariation;
            }
        }
        return grid;
    }
}
