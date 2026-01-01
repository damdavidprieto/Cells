/**
 * RESERVOIR SYSTEM - Infinite Resource Pools
 * ===========================================
 * 
 * Simulates infinite reservoirs of atmosphere and ocean beyond the visible grid.
 * Solves the "closed ecosystem" problem where resources deplete faster than they regenerate.
 * 
 * SCIENTIFIC BASIS - Why Infinite Reservoirs?
 * ═══════════════════════════════════════════════════════════════════
 * 
 * The visible grid (800×600 pixels) represents a tiny fraction of Earth's ocean:
 * - Grid scale: ~10-100 km² (compressed for gameplay)
 * - Real ocean: 361 million km² (3.6 × 10⁸ km²)
 * - Ratio: Grid is ~0.00001% of total ocean
 * 
 * In reality, LUCA had access to:
 * 1. ATMOSPHERE: ~10²¹ liters of gas (N₂, CO₂, traces of O₂)
 * 2. OCEAN: ~1.4 × 10²¹ liters of water with dissolved nutrients
 * 3. CRUST: Continuous input from hydrothermal vents and weathering
 * 
 * The grid is a "window" into a much larger ecosystem.
 * Resources flow IN from surrounding atmosphere/ocean (infinite pools).
 * 
 * IMPLEMENTATION STRATEGY:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. ATMOSPHERIC LAYER (Top 10%):
 *    - Infinite pool of O₂, N₂, CO₂
 *    - Diffusion from atmosphere → water surface (gradient-driven)
 *    - Cells cannot live here (gas phase)
 * 
 * 2. OCEANIC BOUNDARIES (Left/Right edges):
 *    - Infinite pool of P, N, Fe²⁺ (dissolved nutrients)
 *    - Lateral diffusion from ocean → grid edges
 *    - Simulates currents bringing nutrients
 * 
 * 3. SEDIMENT ENHANCEMENT (Bottom 10%):
 *    - Enhanced vent flux (H₂, Fe²⁺, P)
 *    - Simulates continuous hydrothermal activity
 *    - TODO: Future tectonic plate mechanics (episodic events)
 * 
 * DIFFUSION MECHANICS (Fick's Law):
 * ═══════════════════════════════════════════════════════════════════
 * 
 * J = -D × (C_reservoir - C_grid) / Δx
 * 
 * Where:
 * - J = Flux (amount transferred per frame)
 * - D = Diffusion coefficient (tuned for gameplay)
 * - C_reservoir = Concentration in infinite pool (constant)
 * - C_grid = Concentration in grid cell (variable)
 * - Δx = Distance (1 grid cell)
 * 
 * Simplified:
 * flux = DIFFUSION_RATE × (reservoir - grid)
 * 
 * If grid < reservoir: flux is positive (resources flow IN)
 * If grid > reservoir: flux is negative (resources flow OUT)
 * 
 * REFERENCES:
 * ═══════════════════════════════════════════════════════════════════
 * - Fick, A. (1855). On liquid diffusion. Phil. Mag.
 * - Broecker, W. S. (1974). Chemical Oceanography. Harcourt.
 * - Martin, W. & Russell, M. J. (2007). On the origin of biochemistry.
 */

class ReservoirSystem {
    /**
     * Diffuse resources from atmospheric reservoir into water surface
     * 
     * PROCESS: Gas-liquid interface diffusion
     * - Atmosphere has infinite O₂, N₂, CO₂
     * - Concentration gradient drives diffusion into water
     * - Only affects top row of water (below atmosphere layer)
     * 
     * SCIENTIFIC ACCURACY:
     * - Archean atmosphere: N₂ (70-80%), CO₂ (10-20%), O₂ (<0.001%)
     * - Gas solubility: CO₂ > O₂ > N₂ (Henry's Law)
     * - Diffusion rate: CO₂ fastest, N₂ slowest
     */
    static diffuseFromAtmosphere(environment) {
        // ONE-TIME STARTUP DIAGNOSTIC
        if (!this._diagnosticDone) {
            this._diagnosticDone = true;
            console.log('═══════════════════════════════════════════');
            console.log('🔍 RESERVOIR SYSTEM STARTUP DIAGNOSTIC');
            console.log('═══════════════════════════════════════════');
            console.log('Constants loaded:');
            console.log('  ATMOSPHERIC_O2:', typeof GameConstants.ATMOSPHERIC_O2, '=', GameConstants.ATMOSPHERIC_O2);
            console.log('  ATMOSPHERIC_N2:', typeof GameConstants.ATMOSPHERIC_N2, '=', GameConstants.ATMOSPHERIC_N2);
            console.log('  OCEANIC_PHOSPHORUS:', typeof GameConstants.OCEANIC_PHOSPHORUS, '=', GameConstants.OCEANIC_PHOSPHORUS);
            console.log('  ATMOSPHERE_O2_DIFFUSION:', typeof GameConstants.ATMOSPHERE_O2_DIFFUSION, '=', GameConstants.ATMOSPHERE_O2_DIFFUSION);
            console.log('  OCEAN_PHOSPHORUS_DIFFUSION:', typeof GameConstants.OCEAN_PHOSPHORUS_DIFFUSION, '=', GameConstants.OCEAN_PHOSPHORUS_DIFFUSION);
            console.log('Environment:');
            console.log('  waterStartRow:', environment.waterStartRow);
            console.log('  waterEndRow:', environment.waterEndRow);
            console.log('  atmosphereRow:', environment.atmosphereRow);
            console.log('  sedimentRow:', environment.sedimentRow);
            console.log('═══════════════════════════════════════════');
        }

        // Atmospheric layer is top 10% of grid
        let atmosphereBottomRow = environment.atmosphereRow;

        // Water surface is first row below atmosphere
        let waterSurfaceRow = atmosphereBottomRow;

        // Diffuse across entire width of grid
        for (let i = 0; i < environment.cols; i++) {

            // ===== OXYGEN DIFFUSION =====
            // Atmosphere → Water surface
            let atmosphereO2 = GameConstants.ATMOSPHERIC_O2;  // Default: Infinite (constant) trace

            // SCENARIO OVERRIDE: Great Oxidation Event
            // Atmosphere also becomes oxygenated, preventing it from acting as a sink (vacuum)
            if (GameConstants.SCENARIO === 'PRESSURE_OXYGEN') {
                atmosphereO2 = environment.maxOxygenEvent || 40.0;
            }

            let waterO2 = environment.oxygenGrid[i][waterSurfaceRow];
            let o2Gradient = atmosphereO2 - waterO2;
            let o2Flux = GameConstants.ATMOSPHERE_O2_DIFFUSION * o2Gradient;

            environment.oxygenGrid[i][waterSurfaceRow] += o2Flux;
            environment.oxygenGrid[i][waterSurfaceRow] = max(
                environment.oxygenGrid[i][waterSurfaceRow],
                0
            );

            // ===== NITROGEN DIFFUSION =====
            // Atmosphere → Water surface
            let atmosphereN2 = GameConstants.ATMOSPHERIC_N2;  // Infinite (constant)
            let waterN2 = environment.nitrogenGrid[i][waterSurfaceRow];
            let n2Gradient = atmosphereN2 - waterN2;
            let n2Flux = GameConstants.ATMOSPHERE_N2_DIFFUSION * n2Gradient;

            environment.nitrogenGrid[i][waterSurfaceRow] += n2Flux;
            environment.nitrogenGrid[i][waterSurfaceRow] = max(
                environment.nitrogenGrid[i][waterSurfaceRow],
                0
            );

            // ===== CO₂ DIFFUSION =====
            // Atmosphere → Water surface
            let atmosphereCO2 = GameConstants.ATMOSPHERIC_CO2;  // Infinite (constant)
            let waterCO2 = environment.co2Grid[i][waterSurfaceRow];
            let co2Gradient = atmosphereCO2 - waterCO2;
            let co2Flux = GameConstants.ATMOSPHERE_CO2_DIFFUSION * co2Gradient;

            environment.co2Grid[i][waterSurfaceRow] += co2Flux;
            environment.co2Grid[i][waterSurfaceRow] = max(
                environment.co2Grid[i][waterSurfaceRow],
                0
            );
        }
    }

    /**
     * Diffuse resources from oceanic reservoir into grid edges
     * 
     * PROCESS: Lateral diffusion from global ocean
     * - Ocean has infinite P, N, Fe²⁺ (dissolved nutrients)
     * - Concentration gradient drives diffusion into grid
     * - Affects left and right edges of grid
     * - Simulates ocean currents bringing nutrients
     * 
     * SCIENTIFIC ACCURACY:
     * - Archean ocean: Rich in Fe²⁺ (ferrous iron)
     * - Phosphorus: Limited but available (weathering)
     * - Nitrogen: Moderate (atmospheric fixation)
     */
    static diffuseFromOcean(environment) {
        // Debug tracking
        let totalPAdded = 0;
        let totalNAdded = 0;
        let totalFe2Added = 0;
        let totalO2Added = 0;

        // Diffuse into left and right edges
        // Only in water zone (not atmosphere or sediment)
        let waterStartRow = environment.atmosphereRow;
        let waterEndRow = environment.sedimentRow;

        for (let j = waterStartRow; j < waterEndRow; j++) {

            // ===== LEFT EDGE DIFFUSION =====
            let leftCol = 0;

            // Phosphorus
            let oceanP = GameConstants.OCEANIC_PHOSPHORUS;  // Infinite
            let gridP = environment.phosphorusGrid[leftCol][j];
            let pGradient = oceanP - gridP;
            let pFlux = GameConstants.OCEAN_PHOSPHORUS_DIFFUSION * pGradient;
            totalPAdded += pFlux;
            environment.phosphorusGrid[leftCol][j] += pFlux;
            environment.phosphorusGrid[leftCol][j] = max(
                environment.phosphorusGrid[leftCol][j],
                0
            );

            // Nitrogen
            let oceanN = GameConstants.OCEANIC_NITROGEN;  // Infinite
            let gridN = environment.nitrogenGrid[leftCol][j];
            let nGradient = oceanN - gridN;
            let nFlux = GameConstants.OCEAN_NITROGEN_DIFFUSION * nGradient;
            totalNAdded += nFlux;
            environment.nitrogenGrid[leftCol][j] += nFlux;
            environment.nitrogenGrid[leftCol][j] = max(
                environment.nitrogenGrid[leftCol][j],
                0
            );

            // Fe²⁺ (Ferrous Iron)
            let oceanFe2 = GameConstants.OCEANIC_FE2;  // Infinite
            let gridFe2 = environment.fe2Grid[leftCol][j];
            let fe2Gradient = oceanFe2 - gridFe2;
            let fe2Flux = GameConstants.OCEAN_FE2_DIFFUSION * fe2Gradient;
            totalFe2Added += fe2Flux;
            environment.fe2Grid[leftCol][j] += fe2Flux;
            environment.fe2Grid[leftCol][j] = max(
                environment.fe2Grid[leftCol][j],
                0
            );

            // Oxygen (traces)
            let oceanO2 = GameConstants.OCEANIC_O2;  // Infinite (traces)
            let gridO2 = environment.oxygenGrid[leftCol][j];
            let o2Gradient = oceanO2 - gridO2;
            let o2Flux = GameConstants.OCEAN_O2_DIFFUSION * o2Gradient;
            totalO2Added += o2Flux;
            environment.oxygenGrid[leftCol][j] += o2Flux;
            environment.oxygenGrid[leftCol][j] = max(
                environment.oxygenGrid[leftCol][j],
                0
            );

            // ===== RIGHT EDGE DIFFUSION =====
            let rightCol = environment.cols - 1;

            // Phosphorus
            gridP = environment.phosphorusGrid[rightCol][j];
            pGradient = oceanP - gridP;
            pFlux = GameConstants.OCEAN_PHOSPHORUS_DIFFUSION * pGradient;
            environment.phosphorusGrid[rightCol][j] += pFlux;
            environment.phosphorusGrid[rightCol][j] = max(
                environment.phosphorusGrid[rightCol][j],
                0
            );

            // Nitrogen
            gridN = environment.nitrogenGrid[rightCol][j];
            nGradient = oceanN - gridN;
            nFlux = GameConstants.OCEAN_NITROGEN_DIFFUSION * nGradient;
            totalNAdded += nFlux;
            environment.nitrogenGrid[rightCol][j] += nFlux;
            environment.nitrogenGrid[rightCol][j] = max(
                environment.nitrogenGrid[rightCol][j],
                0
            );

            // Fe²⁺
            gridFe2 = environment.fe2Grid[rightCol][j];
            fe2Gradient = oceanFe2 - gridFe2;
            fe2Flux = GameConstants.OCEAN_FE2_DIFFUSION * fe2Gradient;
            totalFe2Added += fe2Flux;
            environment.fe2Grid[rightCol][j] += fe2Flux;
            environment.fe2Grid[rightCol][j] = max(
                environment.fe2Grid[rightCol][j],
                0
            );

            // Oxygen
            gridO2 = environment.oxygenGrid[rightCol][j];
            o2Gradient = oceanO2 - gridO2;
            o2Flux = GameConstants.OCEAN_O2_DIFFUSION * o2Gradient;
            totalO2Added += o2Flux;
            environment.oxygenGrid[rightCol][j] += o2Flux;
            environment.oxygenGrid[rightCol][j] = max(
                environment.oxygenGrid[rightCol][j],
                0
            );
        }
    }

    /**
     * Enhance hydrothermal vent flux in sediment zone
     * 
     * PROCESS: Continuous resource production from vents
     * - Simulates alkaline hydrothermal vents (Lost City type)
     * - Produces H₂, Fe²⁺, P continuously
     * - Represents ongoing tectonic/volcanic activity
     * 
     * TODO - FUTURE ENHANCEMENT: Tectonic Plate Mechanics
     * ═══════════════════════════════════════════════════════════════════
     * 
     * Current implementation: Constant flux (simple, stable)
     * 
     * Future enhancement: Episodic tectonic events
     * - Simulate plate movement cycles (slow build-up, rapid release)
     * - "Tectonic events" every N frames (e.g., 1000-5000 frames)
     * - During event: Massive resource pulse (10-100× normal flux)
     * - Between events: Reduced flux (0.1-0.5× normal)
     * 
     * Benefits of tectonic mechanics:
     * - More realistic (vents are episodic, not constant)
     * - Creates temporal variability (evolutionary pressure)
     * - Boom-bust cycles (population dynamics)
     * - Spatial heterogeneity (some vents active, others dormant)
     * 
     * Implementation approach:
     * 1. Add tectonic cycle counter to Environment
     * 2. Track "active vents" (spatial pattern)
     * 3. Trigger events based on cycle phase
     * 4. Visualize active vents (glow effect)
     * 
     * Scientific basis:
     * - Kelley et al. (2005). Lost City hydrothermal field.
     * - Sleep et al. (2011). H₂-rich fluids from serpentinization.
     * - Martin et al. (2008). Hydrothermal vents and origin of life.
     * 
     * For now: Keep it simple with constant flux.
     * ═══════════════════════════════════════════════════════════════════
     */
    static enhanceVentFlux(environment) {
        // Debug tracking
        let totalFe2Added = 0;
        let totalPAdded = 0;

        // Sediment zone (bottom 10%)
        let sedimentStartRow = environment.sedimentRow;

        for (let i = 0; i < environment.cols; i++) {
            for (let j = sedimentStartRow; j < environment.rows; j++) {

                // H₂ production (already implemented in GridRegeneration)
                // No change needed - already at 2.0/frame

                // Fe²⁺ production (NEW - enhanced flux)
                totalFe2Added += GameConstants.VENT_FE2_FLUX;
                environment.fe2Grid[i][j] += GameConstants.VENT_FE2_FLUX;
                environment.fe2Grid[i][j] = min(
                    environment.fe2Grid[i][j],
                    GameConstants.FE2_GRID_MAX
                );

                // Phosphorus production (NEW - enhanced flux)
                totalPAdded += GameConstants.VENT_PHOSPHORUS_FLUX;
                environment.phosphorusGrid[i][j] += GameConstants.VENT_PHOSPHORUS_FLUX;
                environment.phosphorusGrid[i][j] = min(
                    environment.phosphorusGrid[i][j],
                    100  // Cap to prevent excessive accumulation
                );
            }
        }
    }
}
