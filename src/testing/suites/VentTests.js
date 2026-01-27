/**
 * VentTests.js
 * ============
 * Verifies VentFactory and VentManager integration.
 */
class VentTests {
    static async testVentCreation() {
        // Setup Logic
        const mockConfig = {
            cols: 100,
            rows: 100,
            vents: [
                { type: 'ALKALINE', x: 50, y: 99, width: 3, intensity: 1.0 }
            ]
        };

        // Execution
        const vents = VentFactory.createVents(mockConfig);

        // Verification
        TestManager.assert(vents.length === 1, "Should create exactly 1 vent");
        TestManager.assertEqual(vents[0].type.id, 'ALKALINE', "Vent type should match config");
        TestManager.assertEqual(vents[0].x, 50, "Vent X position should verify");
    }

    static async testVentInjection() {
        // Setup Environment Mock
        const mockEnv = {
            cols: 20, rows: 20,
            sedimentRow: 15,
            h2Grid: Array(20).fill().map(() => Array(20).fill(0)),
            co2Grid: Array(20).fill().map(() => Array(20).fill(0)),
            fe2Grid: Array(20).fill().map(() => Array(20).fill(0)),
            temperatureGrid: Array(20).fill().map(() => Array(20).fill(50))
        };

        // Setup Manager
        const manager = new VentManager();
        const mockConfig = {
            vents: [{ type: 'BLACK_SMOKER', x: 10, width: 3, intensity: 1.0 }] // Black smokers emit high FE2
        };
        manager.initialize(mockConfig);

        // Act
        manager.update(mockEnv);

        // Assert (Center of vent is x=10, y=15 (sedimentRow))
        // Black Smoker Fe2 Flux = 1.0 (Base) * 2.0 (Type) * 1.0 (Intensity) = 2.0
        const fe2Val = mockEnv.fe2Grid[10][15];
        TestManager.assert(fe2Val > 0, `Fe2 should be injected. Got ${fe2Val}`);
        TestManager.assert(fe2Val >= 2.0, `Fe2 flux should match calculation. Got ${fe2Val}`);
    }
}
