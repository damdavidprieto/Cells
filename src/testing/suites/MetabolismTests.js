/**
 * MetabolismTests.js
 * =================
 * Verifies that cells correctly adapt to and utilize new hydrothermal resources.
 */
class MetabolismTests {
    static async testPHStress() {
        const mockEnv = {
            getPH: (x, y) => 10.0, // High alkalinity
            getRedox: () => 0,
            getTemperature: () => 20
        };

        const cell = {
            pos: { x: 0, y: 0 },
            dna: {
                pHOptimum: 8.0,
                pHTolerance: 0.5,
                redoxOptimum: 0,
                redoxTolerance: 100,
                metabolicEfficiency: 1.0
            }
        };

        const costs = new MetabolicCosts();
        // Base cost calculation should include stress
        // (Simplified check: verify if stress factors are applied in logic)
        const costWithStress = costs.calculateMetabolismCosts(cell, mockEnv, { name: 'fermentation', efficiency: 1.0 });

        TestManager.assert(costWithStress > 0.05, `Energy cost should be increased due to pH stress. Got ${costWithStress}`);
    }

    static async testMethanogenesis() {
        let methaneProduced = 0;
        const mockEnv = {
            produceCH4: (x, y, amount) => { methaneProduced = amount; },
            getPH: () => 8.0,
            getRedox: () => 0,
            getTemperature: () => 20,
            consumeH2: () => 1.0,
            consumeCO2: () => 1.0,
            resolution: 10,
            h2Grid: [[1.0]],
            co2Grid: [[1.0]]
        };

        const cell = {
            pos: { x: 0, y: 0 },
            dna: {
                pHOptimum: 8.0, pHTolerance: 2.0,
                redoxOptimum: 0, redoxTolerance: 100,
                metabolisms: {
                    methanogenesis: {
                        enabled: true, efficiency: 1.0, producesCH4: 0.5,
                        substrates: { H2: 0.6, CO2: 0.2 }, energyYield: 3.5
                    }
                }
            }
        };

        const costs = new MetabolicCosts();
        costs.calculateMetabolismCosts(cell, mockEnv, cell.dna.metabolisms.methanogenesis, 'methanogenesis');

        TestManager.assertEqual(methaneProduced, 0.5, "Methanogenesis should produce methane into the environment");
    }
}

// Register suite
TestManager.register(MetabolismTests);
