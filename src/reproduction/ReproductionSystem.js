/**
 * REPRODUCTION SYSTEM - Binary Fission with Resource Constraints
 * ==============================================================
 * 
 * Implements cell division with realistic resource requirements.
 * 
 * SCIENTIFIC BASIS:
 * ----------------
 * 1. Phosphorus Limitation (Elser et al. 2007):
 *    - Phosphorus is THE limiting nutrient for cell division
 *    - Required for DNA/RNA synthesis (phosphate backbone)
 *    - Scarcity in primordial oceans controlled population growth
 *    - Modern cells: ~2-3% dry weight is phosphorus
 * 
 * 2. Binary Fission (Margolin 2005):
 *    - Simplest form of cell division
 *    - Resources split 50/50 between parent and offspring
 *    - DNA replication requires phosphorus + energy
 *    - Flagella construction costs additional resources
 * 
 * 3. Metabolic Requirements (Lane & Martin 2010):
 *    - LUCA had lower nitrogen requirements (primitive metabolism)
 *    - Energy threshold prevents division under stress
 *    - Oxygen needed for basic cellular functions
 * 
 * IMPLEMENTATION:
 * --------------
 * - Resource thresholds: 75% for most, 60% for phosphorus
 * - LUCA exception: Only 30% nitrogen (inefficient use)
 * - 50/50 resource split (binary fission)
 * - Mutation with environmental pressure
 * - Flagella construction costs
 * 
 * REFERENCES:
 * ----------
 * - Elser, J. J., et al. (2007). Global analysis of nitrogen and phosphorus limitation. Ecol. Lett.
 * - Margolin, W. (2005). FtsZ and the division of prokaryotic cells. Nat. Rev. Microbiol.
 * - Lane, N. & Martin, W. F. (2010). The origin of membrane bioenergetics. Cell.
 */
class ReproductionSystem {
    static canReproduce(entity) {
        // 0. Cooldown Check (Cell Cycle)
        if (entity.reproductionCooldown > 0) return false;

        let reproductionThreshold = entity.maxResources * GameConstants.REPRODUCTION_THRESHOLD;

        // LUCA needs less nitrogen to reproduce (doesn't use it efficiently)
        let nitrogenRequired = entity.dna.metabolismType === 'luca'
            ? entity.maxResources * GameConstants.LUCA_NITROGEN_THRESHOLD
            : reproductionThreshold;

        // PHOSPHORUS is CRITICAL for reproduction (DNA/RNA replication)
        let phosphorusRequired = entity.maxResources * GameConstants.REPRODUCTION_PHOSPHORUS_THRESHOLD;

        // Check Oxygen ONLY if NOT LUCA (Anaerobic)
        let oxygenCheck = true;
        if (entity.dna.metabolismType !== 'luca') {
            oxygenCheck = entity.oxygen > reproductionThreshold;
        }

        // STRUCTURAL INTEGRITY CHECK (CHECKPOINT G2/M)
        // ============================================
        // SCIENTIFIC BASIS:
        // 1. G2 Checkpoint (Eukaryotes) / SOS Response (Bacteria):
        //    Cells possess mechanisms to inhibit division if DNA is damaged.
        //    Proceeding with mitosis while damaged causes genomic instability (lethal).
        //    Ref: "Cell Cycle Checkpoints", Hartwell & Weinert (1989).
        // 
        // 2. SulA Protein (E. coli):
        //    In bacteria, the SOS response induces SulA, which inhibits FtsZ ring formation,
        //    physically preventing division until repair is complete.
        //
        // IMPLEMENTATION:
        // Block reproduction if Structural Damage > 20% (Simulating active Checkpoint).
        if (entity.structuralDamage > 20) {
            return false;
        }

        // Use mode-specific reproduction chance if defined, otherwise global
        let mode = GameConstants.getCurrentMode();
        let chance = mode.REPRODUCTION_CHANCE_MULTIPLIER
            ? GameConstants.REPRODUCTION_CHANCE * mode.REPRODUCTION_CHANCE_MULTIPLIER
            : GameConstants.REPRODUCTION_CHANCE;

        // Calculate estimated cost of building organelles for the offspring
        // We assume offspring is similar to parent for this check
        let constructionCost = this.estimateConstructionCost(entity.dna);

        return entity.energy > (reproductionThreshold + constructionCost.energy) &&
            oxygenCheck &&
            entity.nitrogen > (nitrogenRequired + constructionCost.nitrogen) &&
            entity.phosphorus > (phosphorusRequired + constructionCost.phosphorus) &&
            random(1) < chance;
    }

    static reproduce(parent, environmentalStability = 0.5) {
        // Split ALL resources
        parent.energy *= 0.5;
        parent.oxygen *= 0.5;
        parent.nitrogen *= 0.5;
        parent.phosphorus *= 0.5;

        // Create child with mutations (pass environmental stability for evolutionary pressure)
        let childDNA = DNAMutator.mutate(parent.dna, environmentalStability);

        // Apply UV-induced mutation if pending
        if (parent.uvMutationPending) {
            childDNA = DNAMutator.applyUVMutation(childDNA);
            parent.uvMutationPending = false;  // Reset flag
        }

        // Check for lethal mutation
        if (childDNA._lethal) {
            return null; // Cell dies during failed transition
        }

        // Create child entity
        let child = new Entity(parent.pos.x, parent.pos.y, childDNA);

        // Validate child position (ensure in water zone, not atmosphere or sediment)
        if (typeof environment !== 'undefined' && !environment.isValidCellPosition(child.pos.y)) {
            // Reposition to nearest valid water row
            let waterStartY = environment.waterStartRow * environment.resolution;
            let waterEndY = environment.waterEndRow * environment.resolution;
            child.pos.y = constrain(child.pos.y, waterStartY, waterEndY - 1);
        }

        // RESOURCE INHERITANCE FIX (Conservation of Mass)
        // Child inherits exactly what the parent lost (the other 50%)
        // The Entity constructor gives default start values, so we MUST overwrite them
        child.energy = parent.energy;
        child.oxygen = parent.oxygen;
        child.nitrogen = parent.nitrogen;
        child.phosphorus = parent.phosphorus;

        // Apply construction costs for flagella
        this.applyConstructionCosts(parent, child);

        // SET REPRODUCTION COOLDOWN (Gestation Period)
        // Both parent and child must wait before dividing again
        let cooldown = GameConstants.REPRODUCTION_COOLDOWN;
        parent.reproductionCooldown = cooldown;
        child.reproductionCooldown = cooldown;

        // LOG REPRODUCTION (DatabaseLogger)
        if (window.databaseLogger) {
            window.databaseLogger.logCellEvent(
                frameCount,
                'reproduction',
                parent.id || 'unknown', // Parent ID
                {
                    child_id: child.id || 'unknown',
                    parent_energy: parent.energy,
                    child_energy: child.energy,
                    generation: childDNA.generation,
                    metabolism: parent.dna.metabolismType
                }
            );
        }

        return child;
    }

    static applyConstructionCosts(parent, child) {
        // 1. Calculate cost of ALL organelles (Ribosomes, Flagella, etc.)
        // We iterate over the CHILD's organelles because that's what is being built.
        let totalEnergyCost = 0;
        let totalPhosphorusCost = 0;
        let totalNitrogenCost = 0;

        for (let organelle of child.organelles) {
            // Flagella cost is dynamic based on previous level, but for simplicity
            // and robustness, we treat "mitosis" as building a new set from scratch
            // (or from the pool of resources we just inherited).

            // For Flagella, we use the specific cost function if it exists, otherwise standard
            let cost = null;
            if (organelle instanceof Flagellum) {
                // Determine target level (child's level)
                cost = organelle.getConstructionCost(child.dna.flagellaLevel);
            } else {
                cost = organelle.getConstructionCost();
            }

            if (cost) {
                totalEnergyCost += cost.energy || 0;
                totalPhosphorusCost += cost.phosphorus || 0;
                totalNitrogenCost += cost.nitrogen || 0;
            }
        }

        // 2. Deduct from CHILD resources
        // The child "pays" for its body using the materials (Energy/Matter) it inherited.
        // If it runs out, it starts very weak or dies (natural selection).
        child.energy -= totalEnergyCost;
        child.phosphorus -= totalPhosphorusCost;
        child.nitrogen -= totalNitrogenCost;

        // Log the cost for debugging
        if (window.databaseLogger) {
            // We can log this as a separate event or just know it happens
        }
    }

    // Helper for canReproduce (Optional: strict checking)
    static estimateConstructionCost(dna) {
        let e = 0, p = 0, n = 0;

        // Ribosomes
        if (dna.organelles.ribosomes) {
            let cost = new Ribosome().getConstructionCost();
            e += cost.energy; p += cost.phosphorus; n += cost.nitrogen;
        }
        // Hydrogenosomes
        if (dna.organelles.hydrogenosomes) {
            let cost = new Hydrogenosome().getConstructionCost();
            e += cost.energy; p += cost.phosphorus; n += cost.nitrogen;
        }
        // Chemosynthetic Enzymes
        if (dna.organelles.chemosynthetic_enzymes) {
            let cost = new ChemosyntheticEnzymes().getConstructionCost();
            e += cost.energy; p += cost.phosphorus; n += cost.nitrogen;
        }
        // Flagella
        if (dna.flagellaLevel > 0) {
            let cost = new Flagellum().getConstructionCost(dna.flagellaLevel);
            e += cost.energy; p += cost.phosphorus; n += cost.nitrogen;
        }

        return { energy: e, phosphorus: p, nitrogen: n };
    }
}
