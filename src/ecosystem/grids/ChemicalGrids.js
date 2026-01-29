/**
 * CHEMICAL GRIDS - Atmospheric Chemicals Initialization
 * ======================================================
 * 
 * Handles initialization of atmospheric chemical grids:
 * - CO₂ (primordial reducing atmosphere, 10-100× PAL)
 * - H₂ (hydrothermal vents, electron donor for LUCA)
 */
class ChemicalGrids {
    initializeCO2(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let co2Noise = noise(i * 0.08 + 4000, j * 0.08 + 4000);
                grid[i][j] = map(co2Noise, 0, 1,
                    GameConstants.CO2_GRID_MIN,
                    GameConstants.CO2_GRID_MAX);
            }
        }
        return grid;
    }

    initializeH2(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let h2Intensity = GameConstants.ECOSYSTEM_INIT.H2_VENT_INTENSITY *
                    exp(-GameConstants.ECOSYSTEM_INIT.H2_DECAY_RATE * (1 - depthRatio));
                let h2Variation = noise(i * 0.1 + 5000, j * 0.1 + 5000) * 0.3;
                grid[i][j] = h2Intensity * (1 + h2Variation);
            }
        }
        return grid;
    }

    initializeFe2(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let fe2Intensity = (GameConstants.ECOSYSTEM_INIT?.FE2_VENT_INTENSITY || 1.0) *
                    exp(-(GameConstants.ECOSYSTEM_INIT?.FE2_DECAY_RATE || 0.1) * (1 - depthRatio));
                let fe2Variation = noise(i * 0.12 + 6000, j * 0.12 + 6000) * 0.4;
                grid[i][j] = fe2Intensity * (1 + fe2Variation);
                grid[i][j] = max(grid[i][j], GameConstants.FE2_GRID_MIN || 0);
            }
        }
        return grid;
    }

    initializeCH4(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let ch4Intensity = 5.0 * exp(-0.15 * (1 - depthRatio)); // Base intensity
                let ch4Variation = noise(i * 0.08 + 7000, j * 0.08 + 7000) * 0.5;
                grid[i][j] = ch4Intensity * (1 + ch4Variation);
            }
        }
        return grid;
    }

    initializeH2S(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let h2sIntensity = 8.0 * exp(-0.2 * (1 - depthRatio));
                let h2sVariation = noise(i * 0.15 + 8000, j * 0.15 + 8000) * 0.6;
                grid[i][j] = h2sIntensity * (1 + h2sVariation);
            }
        }
        return grid;
    }

    initializeNH3(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;
                let nh3Intensity = 3.0 * exp(-0.1 * (1 - depthRatio));
                let nh3Variation = noise(i * 0.1 + 9000, j * 0.1 + 9000) * 0.4;
                grid[i][j] = nh3Intensity * (1 + nh3Variation);
            }
        }
        return grid;
    }
}
