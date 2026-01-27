/**
 * CHEMICAL GRIDS - Atmospheric Chemicals Initialization
 * ======================================================
 * 
 * Handles initialization of atmospheric chemical grids:
 * - CO₂ (primordial reducing atmosphere, 10-100× PAL)
 * - H₂ (hydrothermal vents, electron donor for LUCA)
 */
class ChemicalGrids {
    /**
     * Initialize CO₂ grid (primordial atmosphere)
     * High concentration: 10-100× modern levels
     */
    static initializeCO2(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                // CO₂ = HIGH (primordial atmosphere, 10-100x PAL)
                // Reducing atmosphere before photosynthesis
                let co2Noise = noise(i * 0.08 + 4000, j * 0.08 + 4000);
                grid[i][j] = map(co2Noise, 0, 1,
                    GameConstants.CO2_GRID_MIN,
                    GameConstants.CO2_GRID_MAX);
            }
        }
        return grid;
    }

    /**
     * Initialize H₂ grid (hydrothermal vents)
     * Exponential gradient: low in water, very high in vents
     * Primary electron donor for LUCA's Wood-Ljungdahl pathway
     */
    static initializeH2(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;

                // H₂ = HIGH in sediment (hydrothermal vents)
                // SCIENTIFIC BASIS: Martin & Russell 2007 - Alkaline vents produce H₂
                // H₂ is primary electron donor for LUCA's Wood-Ljungdahl pathway
                // Exponential gradient: low in water, very high in vents
                let h2Intensity = GameConstants.ECOSYSTEM_INIT.H2_VENT_INTENSITY *
                    exp(-GameConstants.ECOSYSTEM_INIT.H2_DECAY_RATE * (1 - depthRatio));
                let h2Variation = noise(i * 0.1 + 5000, j * 0.1 + 5000) * 0.3;
                grid[i][j] = h2Intensity * (1 + h2Variation);
            }
        }
        return grid;
    }

    /**
     * Initialize Fe²⁺ grid (ferrous iron - Archean ocean)
     * 
     * SCIENTIFIC BASIS - Archean Ocean Chemistry:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * CONTEXT:
     * - Archean oceans (4.0-2.5 Ga) were ANOXIC and rich in dissolved Fe²⁺
     * - Fe²⁺ concentration: 10-100 μM (vs. <0.001 μM modern oceans)
     * - Source: Weathering of basaltic rocks + hydrothermal vents
     * - Sink: Oxidation by O₂ → Fe³⁺ (precipitates as Fe(OH)₃)
     * 
     * GRADIENT:
     * - Deep ocean: HIGH Fe²⁺ (reduced, anoxic)
     * - Surface: LOW Fe²⁺ (oxidized by UV-produced O₂)
     * - Inverse of O₂ gradient
     * 
     * EVIDENCE:
     * - Banded Iron Formations (BIF) - geological record
     * - Alternating Fe-rich and Fe-poor layers
     * - Indicates episodic Fe²⁺ oxidation events
     * 
     * REFERENCES:
     * - Holland, H. D. (2006). The oxygenation of the atmosphere and oceans.
     * - Lyons, T. W., et al. (2014). The rise of oxygen in Earth's early ocean.
     * 
     * IMPLEMENTATION:
     * Exponential gradient: low in surface, very high in deep ocean
     * ═══════════════════════════════════════════════════════════════════
     */
    static initializeFe2(cols, rows, resolution) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                let depthRatio = j / rows;

                // Fe²⁺ = HIGH in deep ocean (anoxic, reduced)
                // Exponential gradient: low in surface, very high in depth
                // Inverse of light (similar to H₂, N₂, P)
                let fe2Intensity = GameConstants.ECOSYSTEM_INIT.FE2_VENT_INTENSITY *
                    exp(-GameConstants.ECOSYSTEM_INIT.FE2_DECAY_RATE * (1 - depthRatio));
                let fe2Variation = noise(i * 0.12 + 6000, j * 0.12 + 6000) * 0.4;
                grid[i][j] = fe2Intensity * (1 + fe2Variation);

                // Ensure minimum values
                grid[i][j] = max(grid[i][j], GameConstants.FE2_GRID_MIN);
            }
        }
        return grid;
    }
}
