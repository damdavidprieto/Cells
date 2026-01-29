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
            resolution: 10,
            sedimentRow: 9,
            vents: [
                { type: 'ALKALINE', x: 50, y: 99, width: 3, intensity: 1.0 }
            ]
        };

        // Execution
        const factory = new VentFactory();
        const vents = factory.createVents(mockConfig);

        // Verification
        TestManager.assert(vents.length === 1, "Should create exactly 1 vent");
        TestManager.assertEqual(vents[0].type.id, 'ALKALINE', "Vent type should match config");
        TestManager.assertEqual(vents[0].x, 50, "Vent X position should verify");
    }

    static async testVentInjection() {
        // Setup Environment Mock
        const mockEnv = {
            cols: 20,
            rows: 20,
            resolution: 10,
            sedimentRow: 15,
            h2Grid: Array(20).fill().map(() => Array(20).fill(0)),
            co2Grid: Array(20).fill().map(() => Array(20).fill(0)),
            fe2Grid: Array(20).fill().map(() => Array(20).fill(0)),
            temperatureGrid: Array(20).fill().map(() => Array(20).fill(50)),
            fluxMultipliers: { h2: 1.0, co2: 1.0 },
            stratification: {
                isInWater: () => true,
                isInSediment: (y) => y >= 15
            }
        };

        // Setup Manager
        const manager = new VentManager();
        const mockConfig = {
            cols: 20,
            rows: 20,
            resolution: 10,
            sedimentRow: 15,
            vents: [{ type: 'BLACK_SMOKER', x: 10, width: 3, intensity: 1.0 }] // Black smokers emit high FE2
        };
        manager.initialize(mockConfig);

        // Act
        manager.update(mockEnv);

        // Assert (Center of vent is x=10, y=15)
        const fe2Val = mockEnv.fe2Grid[10][15];
        TestManager.assert(fe2Val > 0, `Fe2 should be injected. Got ${fe2Val}`);
    }

    static async testChemicalDiversity() {
        const mockEnv = this._createMockEnv();
        const manager = new VentManager();
        const config = {
            vents: [{ type: 'ALKALINE', x: 5, width: 2, intensity: 1.0 }]
        };
        manager.initialize(config);

        // Act
        manager.update(mockEnv);

        // Assert new chemicals
        TestManager.assert(mockEnv.ch4Grid[5][15] > 0, "CH4 should be injected by Alkaline vent");
        TestManager.assert(mockEnv.nh3Grid[5][15] > 0, "NH3 should be injected by Alkaline vent");
        TestManager.assertEqual(mockEnv.h2sGrid[5][15], 0, "H2S should NOT be injected by Alkaline vent");
    }

    static async testVentLifecycleTransitions() {
        const vent = new Vent({
            x: 10, y: 100, type: VentTypes.get('ALKALINE'),
            intensity: 1.0
        });

        // Initial state
        TestManager.assertEqual(vent.lifecycle.phase, 'ACTIVE', "Initial phase should be ACTIVE");

        // Force Waning
        vent.lifecycle.phase = 'WANING';
        const intensity1 = vent.getVisualIntensity();

        // Force Dormant
        vent.lifecycle.phase = 'DORMANT';
        TestManager.assertEqual(vent.lifecycle.isActive(), false, "Dormant vent should not be active");
        TestManager.assertEqual(vent.getVisualIntensity(), 0, "Dormant intensity should be 0");
    }

    static async testGeologicalEvents() {
        const manager = new VentManager();
        manager.initialize({ vents: [] });

        const event = { type: 'EARTHQUAKE', name: 'Test Quake' };
        manager.eventSystem.triggerEvent(event, manager, this._createMockEnv());

        TestManager.assert(manager.vents.length > 0, "Earthquake should have created a new vent");
    }

    static _createMockEnv() {
        return {
            cols: 20, rows: 20, resolution: 10,
            h2Grid: Array(20).fill().map(() => Array(20).fill(0)),
            co2Grid: Array(20).fill().map(() => Array(20).fill(0)),
            fe2Grid: Array(20).fill().map(() => Array(20).fill(0)),
            ch4Grid: Array(20).fill().map(() => Array(20).fill(0)),
            h2sGrid: Array(20).fill().map(() => Array(20).fill(0)),
            nh3Grid: Array(20).fill().map(() => Array(20).fill(0)),
            temperatureGrid: Array(20).fill().map(() => Array(20).fill(20)),
            stratification: { isInWater: () => true, isInSediment: (y) => y >= 15 },
            getPH: () => 8.1,
            getRedox: () => 0
        };
    }
}

// Register suite
TestManager.register(VentTests);
