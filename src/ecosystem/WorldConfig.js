/**
 * WORLD CONFIGURATION SYSTEM
 * ==========================
 * Defines the parameters for generating the game world.
 * Decouples "Modes" from "Map Generation".
 */
class WorldConfig {
    constructor(params = {}) {
        // 1. DIMENSIONS
        // Grid size can be larger than screen (scrollable in future) or restricted
        this.cols = params.cols || 20;
        this.rows = params.rows || 20;
        this.resolution = params.resolution || 20;

        // 2. LAYERS (Vertical Stratification)
        // defined as ratio (0.0 - 1.0) or absolute rows? Using Ratio for flexibility.
        this.atmosphereDepth = typeof params.atmosphereDepth !== 'undefined' ? params.atmosphereDepth : 0.10;
        this.sedimentDepth = typeof params.sedimentDepth !== 'undefined' ? params.sedimentDepth : 0.10;

        // 3. VENTS (Resource Sources)
        // Array of vent definitions. If empty, uses default noise-based generation.
        // { x: col, y: row, width: 1, intensity: 1.0 }
        this.vents = params.vents || [];

        // 4. BOUNDARIES & WALLS
        // If true, everything outside valid zones is "VOID" (Black Wall)
        this.restrictToVents = params.restrictToVents || false; // For Single Vent Mode
        this.wallColor = params.wallColor || [0, 0, 0]; // RGB array

        // 5. VIEWPORT (Camera)
        // Optional offset for rendering
        this.renderOffset = params.renderOffset || { x: 0, y: 0 };
    }

    // Helper to calculate row indices
    getAtmosphereRow() {
        return Math.floor(this.rows * this.atmosphereDepth);
    }

    getSedimentRow() {
        return Math.floor(this.rows * (1 - this.sedimentDepth));
    }
}
