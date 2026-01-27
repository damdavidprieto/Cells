/**
 * ScenarioTests.js
 * ================
 * Verifies that scenarios load and correctly override global constants.
 */
class ScenarioTests {
    static async testScenarioLoading() {
        // Ensure ScenarioManager exists
        TestManager.assert(window.ScenarioManager, "ScenarioManager should be globally available");
        TestManager.assert(window.ScenarioLibrary, "ScenarioLibrary should be globally available");
    }

    static async testPhysicsOverride() {
        // 1. Snapshot current physics
        const originalGravity = GameConstants.PHYSICS.GLOBAL_GRAVITY;

        // 2. Define a Mock Scenario with Physics Override
        const mockScenario = new ScenarioDefinition({
            id: 'TEST_PHYSICS',
            name: 'Test Physics',
            description: 'Unit Test',
            physics: {
                gravity: 9.99, // Distinct test value
                viscosityWater: 0.5
            }
        });

        // 3. Apply via Manager
        ScenarioManager._configurePhysics(mockScenario);

        // 4. Verify Constants Updated
        TestManager.assertEqual(GameConstants.PHYSICS.GLOBAL_GRAVITY, 9.99, "Gravity should be updated by scenario");
        TestManager.assertEqual(GameConstants.PHYSICS.VISCOSITY_WATER, 0.5, "Viscosity should be updated by scenario");

        // 5. Restore (Cleanup)
        GameConstants.PHYSICS.GLOBAL_GRAVITY = originalGravity;
        console.log("Restored original gravity:", originalGravity);
    }

    static async testEcosystemOverride() {
        // 1. Snapshot
        const originalTemp = GameConstants.ECOSYSTEM_INIT.TEMP_VENT;

        // 2. Mock Scenario
        const mockScenario = new ScenarioDefinition({
            id: 'TEST_ECO',
            ecosystem: {
                tempVent: 999
            }
        });

        // 3. Apply
        ScenarioManager._configureEcosystem(mockScenario);

        // 4. Assert
        TestManager.assertEqual(GameConstants.ECOSYSTEM_INIT.TEMP_VENT, 999, "Vent Temp should be overridden");

        // 5. Restore
        GameConstants.ECOSYSTEM_INIT.TEMP_VENT = originalTemp;
    }
}
