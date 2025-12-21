// Membrane System - Handles size-based mechanics
class MembraneSystem {
    static calculateStorageCapacity(baseStorage, size) {
        const level = GameConstants.SIZE_EVOLUTION_LEVEL;
        const config = GameConstants.SIZE_EVOLUTION[level];

        if (level === 'NONE') return baseStorage;

        // Larger cells have more storage (cubic relationship: volume)
        let sizeRatio = size / GameConstants.SIZE_REFERENCE;
        let storageBonus = Math.pow(sizeRatio, 3) * config.storageMultiplier;

        return baseStorage * storageBonus;
    }

    static calculateMetabolicCost(baseCost, size) {
        const level = GameConstants.SIZE_EVOLUTION_LEVEL;
        const config = GameConstants.SIZE_EVOLUTION[level];

        if (level === 'NONE') return baseCost;

        // Larger cells cost more (Kleiber's Law: Mass^0.75)
        let sizeRatio = size / GameConstants.SIZE_REFERENCE;
        let costMultiplier = Math.pow(sizeRatio, 0.75) * config.metabolicMultiplier;

        return baseCost * costMultiplier;
    }

    static calculateMovementPenalty(size) {
        const level = GameConstants.SIZE_EVOLUTION_LEVEL;
        const config = GameConstants.SIZE_EVOLUTION[level];

        if (level === 'NONE') return 1.0;

        // Larger cells move slower (more mass to push)
        let sizeRatio = size / GameConstants.SIZE_REFERENCE;
        let penalty = config.movementPenalty / sizeRatio;

        return Math.max(penalty, 0.3); // Minimum 30% of base speed
    }
}
