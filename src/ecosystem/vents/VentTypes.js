/**
 * VentTypes.js
 * ============
 * Defines the static properties of different hydrothermal vent types.
 * Pure data module.
 */
class VentTypes {
    static get Definitions() {
        return {
            ALKALINE: {
                id: 'ALKALINE',
                name: 'Alkaline Vent (Lost City)',
                chemicals: {
                    h2: 1.0,
                    co2: 0.5,
                    fe2: 0.1,
                    ch4: 0.3,      // Methane (methanogenesis)
                    h2s: 0.0,      // No sulfide (alkaline)
                    nh3: 0.2       // Ammonia (nitrogen source)
                },
                temperature: 70, // Moderate heat
                ph: 10,          // Highly alkaline
                redox: -400,     // Reducing environment (mV)
                traceElements: { Ni: 0.5, Mg: 1.0 }, // Trace metals for enzymes
                color: [200, 255, 200], // Pale Green
                lifecycle: {
                    defaultPhase: 'ACTIVE',
                    activityCycle: { active: 2000, dormant: 800, total: 2800 },
                    maxAge: 100000
                },
                plume: {
                    decayRate: 0.12,
                    buoyancy: 0.9
                }
            },
            BLACK_SMOKER: {
                id: 'BLACK_SMOKER',
                name: 'Black Smoker',
                chemicals: {
                    h2: 0.5,
                    co2: 0.8,
                    fe2: 2.0,
                    h2s: 1.5,      // High sulfide
                    ch4: 0.1,
                    nh3: 0.1
                },
                temperature: 300, // Extreme heat
                ph: 3.5,         // Acidic
                redox: -200,     // Moderately reducing
                traceElements: { Fe: 2.0, Cu: 0.8, Zn: 0.5 },
                color: [50, 50, 50], // Dark Grey
                lifecycle: {
                    defaultPhase: 'ACTIVE',
                    activityCycle: { active: 1500, dormant: 500, total: 2000 },
                    maxAge: 80000
                },
                plume: {
                    decayRate: 0.18,
                    buoyancy: 1.2  // Strong buoyancy
                }
            },
            DIFFUSE: {
                id: 'DIFFUSE',
                name: 'Diffuse Flow',
                chemicals: {
                    h2: 0.2,
                    co2: 0.2,
                    fe2: 0.3,
                    ch4: 0.1,
                    h2s: 0.2,
                    nh3: 0.1
                },
                temperature: 40,
                ph: 6.5,         // Near neutral
                redox: -100,
                color: [200, 200, 255], // Faint Blue
                lifecycle: {
                    defaultPhase: 'ACTIVE',
                    activityCycle: null, // Continuous
                    maxAge: 150000
                },
                plume: {
                    decayRate: 0.25,  // Faster decay (diffuse)
                    buoyancy: 0.5
                }
            },
            COLD_SEEP: {
                id: 'COLD_SEEP',
                name: 'Cold Seep (Methane)',
                chemicals: {
                    h2: 0.1,
                    ch4: 2.0,      // Very high methane
                    co2: 0.3,
                    h2s: 0.5,
                    fe2: 0.2,
                    nh3: 0.2
                },
                temperature: 10,
                ph: 7.0,         // Neutral
                redox: -300,     // Highly reducing
                color: [100, 100, 150],
                lifecycle: {
                    defaultPhase: 'ACTIVE',
                    activityCycle: null, // Continuous
                    maxAge: 200000
                },
                plume: {
                    decayRate: 0.20,
                    buoyancy: 0.3  // Low buoyancy (cold)
                }
            }
        };
    }

    static get(typeId) {
        return this.Definitions[typeId] || this.Definitions.ALKALINE;
    }
}
