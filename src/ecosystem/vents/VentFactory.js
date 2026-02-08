/**
 * VentFactory.js
 * ==============
 * Responsible for creating Vent instances from configuration.
 */
class VentFactory {
    createVents(config) {
        const activeVents = [];
        if (!config.vents) return activeVents;

        config.vents.forEach(v => {
            const vent = this.createVent({
                ...v,
                config: config // Pass full config for resolution/sedimentRow
            });
            activeVents.push(vent);
        });

        return activeVents;
    }

    /**
     * Create a single vent from configuration
     */
    createVent(ventConfig) {
        const config = ventConfig.config || {};

        let x = ventConfig.x;

        // Default Y to sediment row if not provided (Hydrothermal vent)
        // Calculate sediment row if not explicitly provided in config
        let sedimentRow = config.sedimentRow;
        if (sedimentRow === undefined && config.rows !== undefined) {
            const sDepth = config.sedimentDepth !== undefined ? config.sedimentDepth : 0.1;
            sedimentRow = Math.floor(config.rows * (1 - sDepth));
        }

        // For LAB scenarios (restrictToVents), place vent at mid-height for better visibility
        let defaultRow = sedimentRow || 0;
        if (config.restrictToVents && config.rows) {
            defaultRow = Math.floor(config.rows / 2); // Mid-height
        }

        let y = ventConfig.y !== undefined ? ventConfig.y :
            (defaultRow * (config.resolution || 10));

        if (ventConfig.type === 'CENTER' || ventConfig.positionMode === 'CENTER') {
            // Horizontal midpoint (Column index) - Ensure it's an integer
            const worldCols = config.cols || 100;
            const vWidth = ventConfig.width || 3;
            x = Math.floor((worldCols / 2) - (vWidth / 2));
        }

        const typeId = ventConfig.subType || ventConfig.type || 'ALKALINE';
        const typeDef = VentTypes.get(typeId);

        // DEBUG: Log vent factory config
        console.log('[VentFactory] Creating vent:', {
            x, y,
            context: ventConfig.context,
            forceContext: ventConfig.forceContext,
            type: typeId
        });

        return new Vent({
            id: ventConfig.id, // Optional: preserve ID if provided
            x: x,
            y: y,
            width: ventConfig.width || GameConstants.VENTS?.DEFAULT_WIDTH || 3,
            type: typeDef,
            intensity: ventConfig.intensity || GameConstants.VENTS?.DEFAULT_INTENSITY || 1.0,
            context: ventConfig.context || 'SUBMARINE', // Force context if specified
            forceContext: ventConfig.forceContext !== undefined ? ventConfig.forceContext : !!ventConfig.context,
            config: config // Pass config for resolution access
        });
    }
}
