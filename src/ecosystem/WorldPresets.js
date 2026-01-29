/**
 * WORLD PRESETS
 * =============
 * Standard configurations for different game modes.
 */
class WorldPresets {
    static get DEFAULT() {
        // Standard wide ocean
        return new WorldConfig({
            // Dimensions calculated dynamically in Sketch usually, but defaults here:
            cols: 0, // Will be overridden by screen width
            rows: 0,
            resolution: 60,
            atmosphereDepth: 0.10,
            sedimentDepth: 0.10,
            restrictToVents: false,
            vents: [] // Natural distribution
        });
    }

    static get SINGLE_VENT() {
        // The "Laboratory" Mode: One single column of water in the void
        return new WorldConfig({
            resolution: 60,
            rows: 1,
            atmosphereDepth: 0.0, // No atmosphere (Deep Sea)
            sedimentDepth: 1,     // Force single bottom row as sediment source
            // Better: We handle strict row override in Environment or improve Config
            // For now let's use standard logic, we'll calculate specific row count in factory
            restrictToVents: true,
            wallColor: [0, 0, 0],
            vents: [
                // Central Vent
                {
                    // Position calculated at runtime or hardcoded? 
                    // We'll define it as "CENTER"
                    type: 'CENTER',
                    subType: 'ALKALINE', // Explicitly Lost City type (LUCA Origin)
                    width: 1 // 1 Column width
                }
            ]
        });
    }
}
