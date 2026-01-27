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
            },
            COLD_SEEP: {
                id: 'COLD_SEEP',
                name: 'Cold Seep (Methane)',
                chemicals: { h2: 0.1, ch4: 2.0 }, // High Methane (Future use)
                temperature: 10,
                color: [100, 100, 150]
            }
        };
    }

    static get(typeId) {
        return this.Definitions[typeId] || this.Definitions.ALKALINE;
    }
}
