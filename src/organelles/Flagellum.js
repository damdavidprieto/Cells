/**
 * Flagellum Organelle
 * ===================
 * Provides motility. Cost scales with complexity level.
 */
class Flagellum extends Organelle {
    constructor(level = 0) {
        super('flagellum', 'Flagellum');
        this.level = level;
    }

    getMaintenanceCost() {
        // Refactored from FlagellaCosts.js
        return this.level * GameConstants.FLAGELLA_MAINTENANCE_COST;
    }

    getConstructionCost(targetLevel) {
        // Cost to upgrade TO this level
        // Use logic similar to FlagellaCosts.calculateConstructionCost
        return {
            energy: targetLevel * GameConstants.FLAGELLA_CONSTRUCTION_COST_ENERGY,
            phosphorus: targetLevel * GameConstants.FLAGELLA_CONSTRUCTION_COST_PHOSPHORUS,
            nitrogen: 0
        };
    }

    applyEffect(entity) {
        // Updates entity's max speed based on flagella level
        if (this.level > 0) {
            // Speed logic is handled in Entity.move() but we could expose a modifier here
            // Currently Entity.js uses dna.flagellaLevel directly
        }
    }

    getMovementCost(velocity) {
        if (this.level === 0) return 0;
        return velocity.mag() * GameConstants.FLAGELLA_MOVEMENT_COST * this.level;
    }
}
