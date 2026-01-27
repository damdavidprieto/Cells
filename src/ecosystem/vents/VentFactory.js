/**
 * VentFactory.js
 * ==============
 * Responsible for creating Vent instances from configuration.
 */
class VentFactory {
    /**
     * Creates a list of active vents based on WorldConfig.
     * @param {Object} config - The scenario world configuration
     * @returns {Array} List of vent objects
     */
    static createVents(config) {
        const activeVents = [];
        if (!config.vents) return activeVents;

        config.vents.forEach(v => {
            let x = v.x;
            let y = v.y; // Can be null, resolved later by Manager

            // Handle CENTER positioning
            if (v.type === 'CENTER' || v.positionMode === 'CENTER') {
                x = Math.floor(config.cols / 2);
                // SubType handling for "Center" vents
                const typeId = v.subType || 'ALKALINE';
                const typeDef = VentTypes.get(typeId);

                activeVents.push({
                    x: x,
                    y: y,
                    width: v.width || GameConstants.VENTS.DEFAULT_WIDTH,
                    type: typeDef,
                    intensity: v.intensity || GameConstants.VENTS.DEFAULT_INTENSITY
                });
            } else {
                // Explicit positioning
                const typeDef = VentTypes.get(v.type);
                activeVents.push({
                    x: x,
                    y: y,
                    width: v.width || GameConstants.VENTS.DEFAULT_WIDTH,
                    type: typeDef,
                    intensity: v.intensity || GameConstants.VENTS.DEFAULT_INTENSITY
                });
            }
        });

        return activeVents;
    }
}
