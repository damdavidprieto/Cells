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

    /**
     * Perform Passive Diffusion (Osmosis)
     * 
     * SCIENTIFIC BASIS:
     * - LUCA membranes were permeable to small non-polar molecules (H2, CO2)
     * - Nutrients flow DOWN the concentration gradient
     * - In Vents (High Ext, Low Int): FREE ENERGY influx
     * - In Ocean (Low Ext, High Int): LEAKAGE (Efflux)
     */
    static performPassiveDiffusion(entity, environment) {
        let gridX = Math.floor(entity.pos.x / environment.resolution);
        let gridY = Math.floor(entity.pos.y / environment.resolution);

        if (gridX >= 0 && gridX < environment.cols && gridY >= 0 && gridY < environment.rows) {

            // 1. HYDROGEN (H2) DIFFUSION
            // Small molecule, passes easily through primitive membranes
            let envH2 = environment.h2Grid[gridX][gridY];
            // Normalize cellular H2 (energy) to compare with grid concentration
            // This is an abstraction: Cell Energy vs Environmental H2
            let cellEnergyConc = entity.energy / 5.0; // Approximation of internal concentration

            let gradientH2 = envH2 - cellEnergyConc;

            // Diffusion: Rate * Gradient
            let diffusionAmount = gradientH2 * GameConstants.MEMBRANE_PERMEABILITY;

            if (diffusionAmount > 0) {
                // INFLUX: Absorb from environment
                // Cap at available environment resources
                let taken = Math.min(diffusionAmount, envH2);
                environment.h2Grid[gridX][gridY] -= taken;
                entity.energy += taken;
            } else {
                // EFFLUX: Leak into environment (Cost of leaky membrane)
                // entity.energy loses, environment gains (optional, usually negligible for env)
                entity.energy += diffusionAmount; // diffusionAmount is negative here
            }

            // 2. PHOSPHORUS DIFFUSION
            // Only if dissolved P is high (vents)
            let envP = environment.phosphorusGrid[gridX][gridY];
            let cellP = entity.phosphorus;

            // P gradient check (simplified)
            if (envP > cellP) {
                let pDiff = (envP - cellP) * GameConstants.MEMBRANE_PERMEABILITY * 0.1; // Slower than H2
                let takenP = Math.min(pDiff, envP);
                if (takenP > 0) {
                    environment.phosphorusGrid[gridX][gridY] -= takenP;
                    entity.phosphorus += takenP;
                }
            }

            // 3. NITROGEN DIFFUSION (MISSING LINK FIXED)
            // Ammonia (NH4+) diffusion from environment
            let envN = environment.nitrogenGrid[gridX][gridY];
            let cellN = entity.nitrogen;

            if (envN > cellN) {
                let nDiff = (envN - cellN) * GameConstants.MEMBRANE_PERMEABILITY * 0.1; // Similar to P
                let takenN = Math.min(nDiff, envN);
                if (takenN > 0) {
                    environment.nitrogenGrid[gridX][gridY] -= takenN;
                    entity.nitrogen += takenN;
                }
            }
        }
    }
}
