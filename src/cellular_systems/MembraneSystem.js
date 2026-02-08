// Membrane System - Handles size-based mechanics
class MembraneSystem {
    calculateStorageCapacity(baseStorage, size) {
        const level = GameConstants.SIZE_EVOLUTION_LEVEL;
        const config = GameConstants.SIZE_EVOLUTION[level];

        if (level === 'NONE') return baseStorage;

        // Larger cells have more storage (cubic relationship: volume)
        let sizeRatio = size / GameConstants.SIZE_REFERENCE;
        let storageBonus = Math.pow(sizeRatio, 3) * config.storageMultiplier;

        return baseStorage * storageBonus;
    }

    calculateMetabolicCost(baseCost, size) {
        const level = GameConstants.SIZE_EVOLUTION_LEVEL;
        const config = GameConstants.SIZE_EVOLUTION[level];

        if (level === 'NONE') return baseCost;

        // Larger cells cost more (Kleiber's Law: Mass^0.75)
        let sizeRatio = size / GameConstants.SIZE_REFERENCE;
        let costMultiplier = Math.pow(sizeRatio, 0.75) * config.metabolicMultiplier;

        return baseCost * costMultiplier;
    }

    calculateMovementPenalty(size) {
        const level = GameConstants.SIZE_EVOLUTION_LEVEL;
        const config = GameConstants.SIZE_EVOLUTION[level];

        if (level === 'NONE') return 1.0;

        // Larger cells move slower (more mass to push)
        let sizeRatio = size / GameConstants.SIZE_REFERENCE;
        let penalty = config.movementPenalty / sizeRatio;

        return Math.max(penalty, 0.3); // Minimum 30% of base speed
    }

    /**
     * Perform Passive Diffusion (Osmosis and Natural PMF)
     * 
     * SCIENTIFIC BASIS:
     * - LUCA membranes were permeable to small non-polar molecules (H2, CO2)
     * - Nutrients flow DOWN the concentration gradient
     * - Natural PMF: Alkaline vents (pH 10) vs Acidic Ocean (pH 6) create a 
     *   NATURAL proton gradient that LUCA could tap into via ATP-synthase.
     */
    performPassiveDiffusion(entity, environment) {
        let gridX = Math.floor(entity.pos.x / environment.resolution);
        let gridY = Math.floor(entity.pos.y / environment.resolution);

        if (gridX < 0 || gridX >= environment.cols || gridY < 0 || gridY >= environment.rows) return;

        // 1. DYNAMIC PERMEABILITY (Affects "Leakage")
        // Structural damage makes the membrane more "holey"
        let damageFactor = entity.structuralDamage / GameConstants.MAX_STRUCTURAL_DAMAGE;
        let effectivePermeability = GameConstants.MEMBRANE_PERMEABILITY * (1.0 + damageFactor);
        let leakRate = GameConstants.MEMBRANE_LEAK_RATE * (1.0 + damageFactor * 2.0);

        // 2. NATURAL QUIMIOSMOSIS (PMF)
        // Harnessing the environmental pH gradient (Russell & Martin Hypothesis)
        // Uses PMF_CONVERSION capability if available
        let extPH = environment.getPH(entity.pos.x, entity.pos.y);
        let intrinsicPH = 8.5; // Hypothetical internal pH of LUCA
        let phGradient = extPH - intrinsicPH;

        let atpSynthase = entity.capabilities.PMF_CONVERSION;
        if (atpSynthase && phGradient > 0) {
            let pmfEnergy = atpSynthase.calculatePMFYield(phGradient);
            entity.energy += pmfEnergy;
            entity.pmfEnergyFrame = pmfEnergy; // For logging
        }

        // 3. HYDROGEN (H2) DIFFUSION
        let envH2 = environment.h2Grid[gridX][gridY];
        let cellEnergyConc = entity.energy / 5.0; // Approximation
        let gradientH2 = envH2 - cellEnergyConc;

        // Apply Hydrogenase bonus via HYDROGEN_PROCESSING capability
        let hydrogenase = entity.capabilities.HYDROGEN_PROCESSING;
        let h2Bonus = hydrogenase ? hydrogenase.getMetabolicBonus() : 1.0;

        let diffusionH2 = gradientH2 * effectivePermeability * h2Bonus;

        if (diffusionH2 > 0) {
            let roomLeft = entity.maxResources - entity.energy;
            if (roomLeft > 0) {
                let taken = Math.min(diffusionH2, envH2, roomLeft);
                environment.h2Grid[gridX][gridY] -= taken;
                entity.energy += taken;
            }
        } else {
            // Efflux / Leakage
            entity.energy += (diffusionH2 - leakRate); // Adds leak overhead
        }

        // 4. CO2 DIFFUSION (Passive Exchange)
        let envCO2 = environment.co2Grid[gridX][gridY];
        // CO2 is small and non-polar, crosses easily
        if (envCO2 > 0) {
            let co2Diff = (envCO2 - 50) * GameConstants.MEMBRANE_CO2_DIFFUSION; // 50 is base internal
            if (co2Diff > 0) {
                // Cell absorbs CO2 passively (needed for Wood-Ljungdahl)
                entity.energy += co2Diff * 0.1; // Small metabolic boost from carbon capture
            }
        }

        // 5. PHOSPHORUS & NITROGEN (Slow ionic diffusion)
        let envP = environment.phosphorusGrid[gridX][gridY];
        if (envP > entity.phosphorus) {
            let pDiff = (envP - entity.phosphorus) * effectivePermeability * 0.1;
            entity.phosphorus += Math.min(pDiff, envP, entity.maxResources - entity.phosphorus);
        }

        let envN = environment.nitrogenGrid[gridX][gridY];
        if (envN > entity.nitrogen) {
            let nDiff = (envN - entity.nitrogen) * effectivePermeability * 0.1;
            entity.nitrogen += Math.min(nDiff, envN, entity.maxResources - entity.nitrogen);
        }

        // 6. RESOURCE LOSS (ENTROPIC LEAK)
        // Passive loss into the dilute ocean
        if (!environment.isInSediment(entity.pos.y)) {
            entity.nitrogen -= leakRate * 0.5;
            entity.phosphorus -= leakRate * 0.1;
        }
    }
}
