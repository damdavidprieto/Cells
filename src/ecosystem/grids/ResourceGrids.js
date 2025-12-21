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
    /**
     * Initialize light grid (sunlight)
     * Exponential decay with depth (no ozone layer)
     */
    static initializeLight(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                // LIGHT = SUNLIGHT (exponential decay with depth)
                let depthRatio = j / rows;
                let lightIntensity = 100 * exp(-4 * depthRatio);
                let variation = noise(i * 0.1, j * 0.1) * 0.2;
                grid[i][j] = lightIntensity * (1 + variation);
            }
        }
        return grid;
    }

    /**
     * Initialize oxygen grid (traces from UV photolysis)
     * LUCA era: <1% modern O₂ levels
     */
    static initializeOxygen(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                // OXYGEN = TRACES (fotólisis UV, pre-fotosíntesis)
                // LUCA lived in nearly anoxic conditions (<1% modern O₂)
                let oxygenNoise = noise(i * 0.15 + 1000, j * 0.15 + 1000);
                grid[i][j] = map(oxygenNoise, 0, 1,
                    GameConstants.OXYGEN_GRID_MIN,
                    GameConstants.OXYGEN_GRID_MAX);
            }
        }
        return grid;
    }

    /**
     * Initialize nitrogen grid (concentrated in sediment)
     * Inverse gradient of light
     */
    static initializeNitrogen(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;

                // NITROGEN = Concentrated in SEDIMENT (inverse of light)
                // High at bottom, exponentially decreases upward
                let nitrogenIntensity = 100 * exp(-4 * (1 - depthRatio)); // Inverse of light
                let nitrogenVariation = noise(i * 0.12 + 2000, j * 0.12 + 2000) * 0.3;
                grid[i][j] = nitrogenIntensity * (1 + nitrogenVariation);
            }
        }
        return grid;
    }

    /**
     * Initialize phosphorus grid (very concentrated in sediment)
     * Steeper gradient than nitrogen - limiting resource
     */
    static initializePhosphorus(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;

                // PHOSPHORUS = VERY concentrated in SEDIMENT (even more than nitrogen)
                // Critical for DNA/RNA, extremely limited resource
                let phosphorusIntensity = 80 * exp(-6 * (1 - depthRatio)); // Steeper gradient than nitrogen
                let phosphorusVariation = noise(i * 0.08 + 3000, j * 0.08 + 3000) * 0.4;
                grid[i][j] = phosphorusIntensity * (1 + phosphorusVariation);
            }
        }
        return grid;
    }
}
