/**
 * Organelle - Base Component Class
 * ================================
 * Base class for all cell organelles. 
 * Provides interface for costs, effects, and lifecycle management.
 */
class Organelle {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Get the energy cost to maintain this organelle per frame
     * @returns {number} Energy cost
     */
    getMaintenanceCost() {
        return 0;
    }

    /**
     * Get the resource cost to construct this organelle
     * @returns {Object} { energy, phosphorus, nitrogen }
     */
    getConstructionCost() {
        return { energy: 0, phosphorus: 0, nitrogen: 0 };
    }

    /**
     * Apply continuous effects to the entity (called every frame)
     * @param {Entity} entity - The cell demanding the effect
     * @param {Environment} environment - The context
     */
    update(entity, environment) {
        // Override in subclasses
    }

    /**
     * Called when organelle is added to an entity (e.g., initialization)
     * @param {Entity} entity 
     */
    onAdd(entity) {
        // one-time setup
    }
}

// Export for node/browser compatibility checking
if (typeof module !== 'undefined') module.exports = Organelle;
