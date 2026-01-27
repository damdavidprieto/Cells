/**
 * VentManager.js
 * ==============
 * Orchestrates the Vent System.
 * - Manages active vents
 * - Injects chemicals into Environment grids
 * - centralizes flux parameters via GameConstants.VENTS
 */
class VentManager {
    constructor() {
        this.vents = [];
    }

    initialize(config) {
        this.vents = VentFactory.createVents(config);
        console.log(`[VentManager] Initialized ${this.vents.length} vents.`);
    }

    /**
     * Main Update Loop
     * @param {Environment} env - Reference to the environment
     */
    update(env) {
        // Global Multipliers (from Environment or GameConstants)
        const globalMult = GameConstants.VENTS.GLOBAL_FLUX_MULTIPLIER || 1.0;
        const h2Mult = (env.fluxMultipliers ? env.fluxMultipliers.h2 : 1.0) * globalMult;
        const co2Mult = (env.fluxMultipliers ? env.fluxMultipliers.co2 : 1.0) * globalMult;

        for (let vent of this.vents) {
            this._processVent(vent, env, h2Mult, co2Mult);
        }
    }

    _processVent(vent, env, h2Mult, co2Mult) {
        // Resolve Y (Sediment line)
        const targetY = vent.y !== null && vent.y !== undefined ? vent.y : env.sedimentRow;

        // Calculate Bounds
        let radius = Math.floor(vent.width / 2);
        let startX = vent.x - radius;
        let endX = vent.x + radius + (vent.width % 2 === 0 ? -1 : 0);

        // Clamp
        startX = Math.max(0, startX);
        endX = Math.min(env.cols - 1, endX);

        // Inject
        for (let i = startX; i <= endX; i++) {
            if (targetY >= 0 && targetY < env.rows) {
                // H2 Injection
                if (vent.type.chemicals.h2) {
                    const baseFlux = GameConstants.VENTS.H2_BASE_FLUX;
                    let amount = baseFlux * vent.type.chemicals.h2 * vent.intensity * h2Mult;
                    env.h2Grid[i][targetY] += amount;
                    env.h2Grid[i][targetY] = Math.min(env.h2Grid[i][targetY], GameConstants.H2_MAX_ACCUMULATION || 500);
                }

                // CO2 Injection
                if (vent.type.chemicals.co2) {
                    const baseFlux = GameConstants.VENTS.CO2_BASE_FLUX;
                    let amount = baseFlux * vent.type.chemicals.co2 * vent.intensity * co2Mult;
                    env.co2Grid[i][targetY] += amount;
                    env.co2Grid[i][targetY] = Math.min(env.co2Grid[i][targetY], GameConstants.CO2_MAX_ACCUMULATION || 500);
                }

                // Fe2 Injection
                if (vent.type.chemicals.fe2) {
                    const baseFlux = GameConstants.VENTS.FE2_BASE_FLUX;
                    let amount = baseFlux * vent.type.chemicals.fe2 * vent.intensity;
                    if (env.fe2Grid[i][targetY] !== undefined) {
                        env.fe2Grid[i][targetY] += amount;
                    }
                }

                // Temperature Injection
                if (env.temperatureGrid) {
                    // Force temp at source
                    env.temperatureGrid[i][targetY] = Math.max(env.temperatureGrid[i][targetY], vent.type.temperature);
                }
            }
        }
    }
}
