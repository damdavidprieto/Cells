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
    /**
     * Initialize UV radiation grid
     * Exponential decay (3× faster than light, no ozone layer)
     * Primordial Earth: 10-100× higher UV than modern
     */
    static initializeUV(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                // UV RADIATION = Exponential decay (3x faster than light, no ozone layer)
                // Primordial Earth had 10-100x higher UV than modern
                let uvIntensity = GameConstants.UV_SURFACE_INTENSITY *
                    exp(-GameConstants.UV_DECAY_RATE * j);
                grid[i][j] = uvIntensity;
            }
        }
        return grid;
    }

    /**
     * Initialize temperature grid (FUTURE)
     * Gradient: 50-60°C surface, 70-80°C vents
     */
    static initializeTemperature(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;

                // TEMPERATURE = Increases with depth (vents)
                // Surface: 50-60°C, Vents: 70-80°C
                let baseTemp = 50 + (30 * depthRatio);
                let tempVariation = noise(i * 0.05 + 6000, j * 0.05 + 6000) * 5;
                grid[i][j] = baseTemp + tempVariation;
            }
        }
        return grid;
    }

    /**
     * Initialize pH grid (FUTURE)
     * Gradient: pH 6-7 ocean, pH 9-11 vents (alkaline)
     */
    static initializePH(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;

                // pH = Increases with depth (alkaline vents)
                // Ocean: pH 6-7, Vents: pH 9-11
                let basePH = 6 + (4 * depthRatio);
                let pHVariation = noise(i * 0.08 + 7000, j * 0.08 + 7000) * 0.5;
                grid[i][j] = basePH + pHVariation;
            }
        }
        return grid;
    }
}
