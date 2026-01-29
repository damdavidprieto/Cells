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
    constructor() {
        this._diagnosticDone = false;
    }

    update(environment) {
        this.diffuseFromAtmosphere(environment);
        this.diffuseFromOcean(environment);
        this.enhanceVentFlux(environment);
    }

    diffuseFromAtmosphere(environment) {
        if (!this._diagnosticDone) {
            this._diagnosticDone = true;
            console.log('RESERVOIR SYSTEM INITIALIZED');
        }

        let atmosphereBottomRow = environment.atmosphereRow;
        let waterSurfaceRow = atmosphereBottomRow;

        for (let i = 0; i < environment.cols; i++) {
            let atmosphereO2 = GameConstants.ATMOSPHERIC_O2;
            if (GameConstants.SCENARIO === 'PRESSURE_OXYGEN') {
                atmosphereO2 = environment.maxOxygenEvent || 40.0;
            }

            let waterO2 = environment.oxygenGrid[i][waterSurfaceRow];
            let o2Gradient = atmosphereO2 - waterO2;
            let o2Flux = GameConstants.ATMOSPHERE_O2_DIFFUSION * o2Gradient;

            environment.oxygenGrid[i][waterSurfaceRow] += o2Flux;
            environment.oxygenGrid[i][waterSurfaceRow] = max(environment.oxygenGrid[i][waterSurfaceRow], 0);

            let atmosphereN2 = GameConstants.ATMOSPHERIC_N2;
            let waterN2 = environment.nitrogenGrid[i][waterSurfaceRow];
            let n2Gradient = atmosphereN2 - waterN2;
            let n2Flux = GameConstants.ATMOSPHERE_N2_DIFFUSION * n2Gradient;

            environment.nitrogenGrid[i][waterSurfaceRow] += n2Flux;
            environment.nitrogenGrid[i][waterSurfaceRow] = max(environment.nitrogenGrid[i][waterSurfaceRow], 0);

            let atmosphereCO2 = GameConstants.ATMOSPHERIC_CO2;
            let waterCO2 = environment.co2Grid[i][waterSurfaceRow];
            let co2Gradient = atmosphereCO2 - waterCO2;
            let co2Flux = GameConstants.ATMOSPHERE_CO2_DIFFUSION * co2Gradient;

            environment.co2Grid[i][waterSurfaceRow] += co2Flux;
            environment.co2Grid[i][waterSurfaceRow] = max(environment.co2Grid[i][waterSurfaceRow], 0);
        }
    }

    diffuseFromOcean(environment) {
        let waterStartRow = environment.atmosphereRow;
        let waterEndRow = environment.sedimentRow;

        for (let j = waterStartRow; j < waterEndRow; j++) {
            let leftCol = 0;
            let oceanP = GameConstants.OCEANIC_PHOSPHORUS;
            let gridP = environment.phosphorusGrid[leftCol][j];
            environment.phosphorusGrid[leftCol][j] += GameConstants.OCEAN_PHOSPHORUS_DIFFUSION * (oceanP - gridP);
            environment.phosphorusGrid[leftCol][j] = max(environment.phosphorusGrid[leftCol][j], 0);

            let oceanN = GameConstants.OCEANIC_NITROGEN;
            let gridN = environment.nitrogenGrid[leftCol][j];
            environment.nitrogenGrid[leftCol][j] += GameConstants.OCEAN_NITROGEN_DIFFUSION * (oceanN - gridN);
            environment.nitrogenGrid[leftCol][j] = max(environment.nitrogenGrid[leftCol][j], 0);

            let oceanFe2 = GameConstants.OCEANIC_FE2;
            let gridFe2 = environment.fe2Grid[leftCol][j];
            environment.fe2Grid[leftCol][j] += GameConstants.OCEAN_FE2_DIFFUSION * (oceanFe2 - gridFe2);
            environment.fe2Grid[leftCol][j] = max(environment.fe2Grid[leftCol][j], 0);

            let oceanO2 = GameConstants.OCEANIC_O2;
            let gridO2 = environment.oxygenGrid[leftCol][j];
            environment.oxygenGrid[leftCol][j] += GameConstants.OCEAN_O2_DIFFUSION * (oceanO2 - gridO2);
            environment.oxygenGrid[leftCol][j] = max(environment.oxygenGrid[leftCol][j], 0);

            let rightCol = environment.cols - 1;
            environment.phosphorusGrid[rightCol][j] += GameConstants.OCEAN_PHOSPHORUS_DIFFUSION * (oceanP - environment.phosphorusGrid[rightCol][j]);
            environment.phosphorusGrid[rightCol][j] = max(environment.phosphorusGrid[rightCol][j], 0);

            environment.nitrogenGrid[rightCol][j] += GameConstants.OCEAN_NITROGEN_DIFFUSION * (oceanN - environment.nitrogenGrid[rightCol][j]);
            environment.nitrogenGrid[rightCol][j] = max(environment.nitrogenGrid[rightCol][j], 0);

            environment.fe2Grid[rightCol][j] += GameConstants.OCEAN_FE2_DIFFUSION * (oceanFe2 - environment.fe2Grid[rightCol][j]);
            environment.fe2Grid[rightCol][j] = max(environment.fe2Grid[rightCol][j], 0);

            environment.oxygenGrid[rightCol][j] += GameConstants.OCEAN_O2_DIFFUSION * (oceanO2 - environment.oxygenGrid[rightCol][j]);
            environment.oxygenGrid[rightCol][j] = max(environment.oxygenGrid[rightCol][j], 0);
        }
    }

    enhanceVentFlux(environment) {
        let sedimentStartRow = environment.sedimentRow;
        for (let i = 0; i < environment.cols; i++) {
            for (let j = sedimentStartRow; j < environment.rows; j++) {
                environment.fe2Grid[i][j] += GameConstants.VENT_FE2_FLUX;
                environment.fe2Grid[i][j] = min(environment.fe2Grid[i][j], GameConstants.FE2_GRID_MAX);

                environment.phosphorusGrid[i][j] += GameConstants.VENT_PHOSPHORUS_FLUX;
                environment.phosphorusGrid[i][j] = min(environment.phosphorusGrid[i][j], 100);
            }
        }
    }
}
