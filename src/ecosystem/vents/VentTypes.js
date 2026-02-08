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
                    fe2: 5.0,
                    ch4: 0.3,
                    h2s: 0.0,
                    nh3: 0.2
                },
                temperature: 70,
                ph: 10,
                redox: -400,
                traceElements: { Ni: 0.5, Mg: 1.0 },
                color: [100, 200, 255], // Clearly bluish as requested
                albedo: 0.75,          // High reflection
                glow: 0,
                minerals: [
                    { name: 'Calcita', color: [255, 240, 180], desc: "Carbonato de calcio (Crema/Ivory)." },
                    { name: 'Brucita', color: [150, 255, 240], desc: "Hidróxido de magnesio (Cian pálido)." }
                ],
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
                    h2s: 1.5,
                    ch4: 0.1,
                    nh3: 0.1
                },
                temperature: 350,
                ph: 3.5,
                redox: -200,
                traceElements: { Fe: 2.0, Cu: 0.8, Zn: 0.5 },
                color: [30, 40, 80], // Deep oceanic navy blue
                albedo: 0.15,
                glow: 15.0,
                minerals: [
                    { name: 'Pirita', color: [255, 215, 0], desc: "Sulfuro de hierro (Dorado metálico)." },
                    { name: 'Calcopirita', color: [184, 134, 11], desc: "Sulfuro de cobre (Latón)." }
                ],
                lifecycle: {
                    defaultPhase: 'ACTIVE',
                    activityCycle: { active: 1500, dormant: 500, total: 2000 },
                    maxAge: 80000
                },
                plume: {
                    decayRate: 0.18,
                    buoyancy: 1.2
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
                ph: 6.5,
                redox: -100,
                color: [140, 180, 255], // Distinct Sky Blue
                albedo: 0.5,
                glow: 0,
                minerals: [
                    { name: 'Sílice', color: [255, 255, 255], desc: "Óxido de silicio (Blanco puro)." },
                    { name: 'Anhidrita', color: [200, 230, 255], desc: "Sulfato de calcio (Celeste)." }
                ],
                lifecycle: {
                    defaultPhase: 'ACTIVE',
                    activityCycle: null,
                    maxAge: 150000
                },
                plume: {
                    decayRate: 0.25,
                    buoyancy: 0.5
                }
            },
            COLD_SEEP: {
                id: 'COLD_SEEP',
                name: 'Cold Seep (Methane)',
                chemicals: {
                    h2: 0.1,
                    ch4: 2.0,
                    co2: 0.3,
                    h2s: 0.5,
                    fe2: 0.2,
                    nh3: 0.2
                },
                temperature: 10,
                ph: 7.0,
                redox: -300,
                color: [50, 100, 200], // Strong Indigo Blue
                albedo: 0.35,
                glow: 0,
                minerals: [
                    { name: 'Clatratos', color: [150, 240, 255], desc: "Hielo de metano cristalino." },
                    { name: 'Baritina', color: [230, 230, 250], desc: "Sulfato de bario (Lavanda/Gris)." }
                ],
                lifecycle: {
                    defaultPhase: 'ACTIVE',
                    activityCycle: null,
                    maxAge: 200000
                },
                plume: {
                    decayRate: 0.20,
                    buoyancy: 0.3
                }
            }
        };
    }

    static get(typeId) {
        return this.Definitions[typeId] || this.Definitions.ALKALINE;
    }
}
