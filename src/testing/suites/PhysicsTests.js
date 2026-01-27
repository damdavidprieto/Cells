/**
 * PhysicsTests.js
 * ===============
 * Verifies integrity of the Physics configuration.
 */
class PhysicsTests {
    static async testPhysicsConstantsExist() {
        TestManager.assert(GameConstants.PHYSICS, "GameConstants.PHYSICS should exist");
        TestManager.assert(typeof GameConstants.PHYSICS.GLOBAL_GRAVITY === 'number', "Gravity should be a number");
        TestManager.assert(typeof GameConstants.PHYSICS.BROWNIAN_STRENGTH === 'number', "Brownian Strength should be a number");
    }

    static async testViscosityRanges() {
        const p = GameConstants.PHYSICS;
        TestManager.assert(p.VISCOSITY_WATER > 0 && p.VISCOSITY_WATER <= 1, "Water viscosity should be 0-1");
        TestManager.assert(p.VISCOSITY_SEDIMENT > 0 && p.VISCOSITY_SEDIMENT <= 1, "Sediment viscosity should be 0-1");

        // Sediment should generally be thicker (lower multiplier, or higher drag? In this engine, viscosity is a multiplier (0.9 < 1.0), so lower is "thicker/slower")
        // Wait, normally viscosity 0.9 means velocity *= 0.9.
        // So Lower Number = Higher Friction/Viscosity.
        TestManager.assert(p.VISCOSITY_SEDIMENT < p.VISCOSITY_WATER, "Sediment should be more viscous (lower multiplier) than water");
    }
}
