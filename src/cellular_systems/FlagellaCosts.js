// Flagella Costs - Calculates all costs related to flagella
class FlagellaCosts {
    static calculateMaintenance(flagellaLevel) {
        return flagellaLevel * GameConstants.FLAGELLA_MAINTENANCE_COST;
    }

    static calculateMovementCost(velocity, flagellaLevel) {
        if (flagellaLevel === 0) return 0;
        return velocity.mag() * GameConstants.FLAGELLA_MOVEMENT_COST * flagellaLevel;
    }

    static calculateConstructionCost(parentLevel, childLevel) {
        if (childLevel <= parentLevel) {
            return { energy: 0, phosphorus: 0 };
        }

        let levelDiff = childLevel - parentLevel;
        return {
            energy: levelDiff * GameConstants.FLAGELLA_CONSTRUCTION_COST_ENERGY,
            phosphorus: levelDiff * GameConstants.FLAGELLA_CONSTRUCTION_COST_PHOSPHORUS
        };
    }
}
