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
        let reproductionThreshold = entity.maxResources * GameConstants.REPRODUCTION_THRESHOLD;

        // LUCA needs less nitrogen to reproduce (doesn't use it efficiently)
        let nitrogenRequired = entity.dna.metabolismType === 'luca'
            ? entity.maxResources * GameConstants.LUCA_NITROGEN_THRESHOLD
            : reproductionThreshold;

        // PHOSPHORUS is CRITICAL for reproduction (DNA/RNA replication)
        let phosphorusRequired = entity.maxResources * GameConstants.REPRODUCTION_PHOSPHORUS_THRESHOLD;

        return entity.energy > reproductionThreshold &&
            entity.oxygen > reproductionThreshold &&
            entity.nitrogen > nitrogenRequired &&
            entity.phosphorus > phosphorusRequired &&
            random(1) < GameConstants.REPRODUCTION_CHANCE;
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

        // Apply construction costs for flagella
        this.applyConstructionCosts(parent, child);

        // LOG REPRODUCTION (development mode)
        if (typeof developmentMonitor !== 'undefined' && GameConstants.getCurrentMode().LOG_REPRODUCTIONS) {
            developmentMonitor.log('reproductions',
                `${parent.dna.metabolismType} → gen ${childDNA.generation}`,
                {
                    metabolism: parent.dna.metabolismType,
                    generation: childDNA.generation
                }
            );
        }

        return child;
    }

    static applyConstructionCosts(parent, child) {
        let costs = FlagellaCosts.calculateConstructionCost(
            parent.dna.flagellaLevel,
            child.dna.flagellaLevel
        );

        child.energy -= costs.energy;
        child.phosphorus -= costs.phosphorus;
    }
}
