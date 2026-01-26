/**
 * VENT SYSTEM
 * ===========
 * Manages hydrothermal vents, their types, locations, and chemical emissions.
 * Decouples vent logic from the main Environment grid loops.
 */
class VentSystem {
    constructor() {
        this.vents = []; // Active vent instances
    }

    // Vent Types Definitions
    static get Types() {
        return {
            ALKALINE: {
                id: 'ALKALINE',
                name: 'Alkaline Vent (Lost City)',
                chemicals: { h2: 1.0, co2: 0.5, fe2: 0.1 },
                temperature: 70, // Moderate heat
                color: [200, 255, 200] // Pale Green
            },
            BLACK_SMOKER: {
                id: 'BLACK_SMOKER',
                name: 'Black Smoker',
                chemicals: { h2: 0.5, co2: 0.8, fe2: 2.0, h2s: 1.0 }, // High Iron/Sulfur
                temperature: 300, // Extreme heat
                color: [50, 50, 50] // Dark Grey
            },
            DIFFUSE: {
                id: 'DIFFUSE',
                name: 'Diffuse Flow',
                chemicals: { h2: 0.2, co2: 0.2 },
                temperature: 40,
                color: [200, 200, 255] // Faint Blue
            }
        };
    }

    /**
     * Initialize vents based on WorldConfig
     * @param {WorldConfig} config 
     */
    initialize(config) {
        this.vents = [];
        if (!config.vents) return;

        config.vents.forEach(v => {
            // Determine position
            let x = v.x;
            let y = v.y; // Usually calculated relative to sediment line if not provided

            // Auto-center if requested (for Single Vent Mode)
            if (v.type === 'CENTER') {
                const typeDef = VentSystem.Types[v.subType] || VentSystem.Types.ALKALINE;

                // Calculate center column
                x = Math.floor(config.cols / 2);

                // Add to list
                this.vents.push({
                    x: x,
                    y: null, // Will be resolved to sedimentRow in update if null
                    width: v.width || 1,
                    type: typeDef,
                    intensity: v.intensity || 1.0
                });
            } else {
                // Explicit coordinates
                const typeDef = VentSystem.Types[v.type] || VentSystem.Types.ALKALINE;
                this.vents.push({
                    x: v.x,
                    y: v.y,
                    width: v.width || 1,
                    type: typeDef,
                    intensity: v.intensity || 1.0
                });
            }
        });

        console.log(`[VentSystem] Initialized ${this.vents.length} vents.`);
    }

    /**
     * Update loop: Inject chemicals into the Environment
     * @param {Environment} env 
     */
    update(env) {
        // Flux Multipliers (Global)
        const h2Mult = env.fluxMultipliers ? env.fluxMultipliers.h2 : 1.0;
        const co2Mult = env.fluxMultipliers ? env.fluxMultipliers.co2 : 1.0;

        // Iterate through all active vents
        for (let vent of this.vents) {
            // Resolve Y position if dynamic (always at sediment surface)
            const targetY = vent.y !== null ? vent.y : env.sedimentRow;

            // Calculate emission zone
            let radius = Math.floor(vent.width / 2);
            let startX = vent.x - radius;
            let endX = vent.x + radius + (vent.width % 2 === 0 ? -1 : 0); // Correct for even widths

            // Clamp bounds
            startX = Math.max(0, startX);
            endX = Math.min(env.cols - 1, endX);

            // Inject Chemicals
            for (let i = startX; i <= endX; i++) {
                // Ensure we are inside grid
                if (targetY >= 0 && targetY < env.rows) {
                    // H2 Injection
                    if (vent.type.chemicals.h2) {
                        // Base emission * Intensity * Global Multiplier
                        let amount = 5.0 * vent.type.chemicals.h2 * vent.intensity * h2Mult;
                        env.h2Grid[i][targetY] += amount;
                        // Cap?
                        env.h2Grid[i][targetY] = Math.min(env.h2Grid[i][targetY], 500);
                    }

                    // CO2 Injection
                    if (vent.type.chemicals.co2) {
                        let amount = 2.0 * vent.type.chemicals.co2 * vent.intensity * co2Mult;
                        env.co2Grid[i][targetY] += amount;
                        env.co2Grid[i][targetY] = Math.min(env.co2Grid[i][targetY], 500);
                    }

                    // Fe2 Injection
                    if (vent.type.chemicals.fe2) {
                        let amount = 1.0 * vent.type.chemicals.fe2 * vent.intensity;
                        if (env.fe2Grid[i][targetY] !== undefined) {
                            env.fe2Grid[i][targetY] += amount;
                        }
                    }

                    // Thermal Injection
                    if (env.temperatureGrid) {
                        env.temperatureGrid[i][targetY] = Math.max(env.temperatureGrid[i][targetY], vent.type.temperature);
                    }
                }
            }
        }
    }
}
