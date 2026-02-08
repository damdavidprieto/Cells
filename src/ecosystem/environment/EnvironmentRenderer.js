/**
 * Component: EnvironmentRenderer
 * Handles all visual representation of the environment.
 */
class EnvironmentRenderer {
    constructor(resolution) {
        this.resolution = resolution;
    }

    render(grids, stratification, config) {
        // 1. BACKGROUND (Pure Black)
        this.drawBackground();

        // 2. VENTS (Always render)
        if (window.environment?.ventSystem) {
            window.environment.ventSystem.render(window.environment);
        }

        // Simplification: In Lab Mode, we don't draw anything else (mist, grids, boundaries)
    }

    drawBackground() {
        // Instead of pure black, use a very deep "Archaean Teal"
        // based on the water color system if available
        const vcs = window.ventColorSystem;
        if (vcs) {
            // Get color at a representative depth (e.g. 500p) with average chemicals
            const avgChemicals = { fe2: 5.0 }; // Typical for this scenario
            const baseTint = vcs.getAmbientColor(500, avgChemicals);

            // Ensure background is visible even if ambient tint is very dark
            // REVISED: Higher minimum and boost factor for visibility
            const minBrightness = 30;
            background(
                Math.max(minBrightness, baseTint[0] * 0.65),
                Math.max(minBrightness, baseTint[1] * 0.65),
                Math.max(minBrightness, baseTint[2] * 0.65)
            );
        } else {
            background(0);
        }
    }
}
