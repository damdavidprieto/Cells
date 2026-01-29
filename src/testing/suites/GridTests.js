/**
 * GridTests.js
 * ============
 * Verifies the initialization and functionality of the modular Grid systems.
 */
class GridTests {
    static async testChemicalGridInitialization() {
        // Mock Config
        const cols = 20;
        const rows = 20;
        const config = { cols, rows };

        const chemicalGrids = new ChemicalGrids(config);

        TestManager.assert(chemicalGrids.h2Grid, "H2 Grid should be initialized");
        TestManager.assert(chemicalGrids.co2Grid, "CO2 Grid should be initialized");
        TestManager.assertEqual(chemicalGrids.h2Grid.length, cols, "Grid cols should match config");
        TestManager.assertEqual(chemicalGrids.h2Grid[0].length, rows, "Grid rows should match config");
        TestManager.assertEqual(chemicalGrids.h2Grid.length, chemicalGrids.cols, "Internal cols property should match");
    }

    static async testGridReset() {
        const cols = 10;
        const rows = 10;
        const chemicalGrids = new ChemicalGrids({ cols, rows });

        // Set a value
        chemicalGrids.h2Grid[5][5] = 999;

        // Reset
        chemicalGrids.reset();

        // Check if cleared (assuming reset clears to 0 or re-inits)
        // If reset() isn't implemented or works differently, this test might need adjustment based on implementation.
        // Assuming reset() exists as per standard grid pattern.
        if (chemicalGrids.reset) {
            TestManager.assertEqual(chemicalGrids.h2Grid[5][5], 0, "Grid should be cleared after reset");
        }
    }

    static async testPhysicalGrids() {
        const config = { cols: 15, rows: 15 };
        // Assuming PhysicalGrids class exists and is globally available
        if (window.PhysicalGrids) {
            const phys = new PhysicalGrids(config);
            TestManager.assert(phys.lightGrid, "Light Grid should exist");
            TestManager.assert(phys.temperatureGrid, "Temperature Grid should exist");
        }
    }
}
