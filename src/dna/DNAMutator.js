/**
 * DNA MUTATOR - Evolutionary Mutation System
 * ==========================================
 * 
 * Implements biologically-realistic mutation mechanics with environmental pressure.
 * Based on research about LUCA (Last Universal Common Ancestor) and early cellular evolution.
 * 
 * SCIENTIFIC BASIS:
 * ----------------
 * 1. LUCA Mutation Rates (Poole et al. 1998, Forterre 2015):
 *    - Primordial cells: 10^-5 to 10^-4 mutations per base per generation
 *    - Modern cells: 10^-9 to 10^-10 mutations per base per generation
 *    - Reason: Primitive DNA repair systems, hostile environment, small genomes
 * 
 * 2. Evolutionary Pressure (Drake 1991):
 *    - Stable environments favor LOW mutation rates (preserve adaptations)
 *    - Chaotic environments favor HIGH mutation rates (explore strategies)
 *    - This creates directional selection on mutation rate itself
 * 
 * 3. Metabolic Divergence (Weiss et al. 2016):
 *    - LUCA likely had primitive fermentation-like metabolism
 *    - Specialization into distinct metabolic types was gradual
 *    - Cross-metabolism transitions are extremely rare (high mortality)
 * 
 * IMPLEMENTATION:
 * --------------
 * - Mutation rate range: 0.01 (modern) to 0.30 (primordial)
 * - Environmental stability (0-1) creates pressure on mutation rate
 * - Metabolic divergence: 1% chance LUCA → Fermentation/Chemosynthesis
 * - Cross-transitions: 0.001% chance with 80% mortality
 * 
 * REFERENCES:
 * ----------
 * - Poole, A. M., et al. (1998). The path from the RNA world. J. Mol. Evol.
 * - Forterre, P. (2015). The universal tree of life. Front. Microbiol.
 * - Weiss, M. C., et al. (2016). The physiology and habitat of LUCA. Nat. Microbiol.
 * - Drake, J. W. (1991). A constant rate of spontaneous mutation. PNAS.
 */
class DNAMutator {
    static mutate(parentDNA, environmentalStability = 0.5) {
        let mr = parentDNA.mutationRate;
        const sizeConfig = GameConstants.SIZE_EVOLUTION[GameConstants.SIZE_EVOLUTION_LEVEL];
        const colorConfig = GameConstants.COLOR_EVOLUTION[GameConstants.COLOR_EVOLUTION_LEVEL];

        let childDNA = {
            // Locomotion - EVOLUTIONARY TRAIT
            flagellaLevel: constrain(
                parentDNA.flagellaLevel + random(-GameConstants.FLAGELLA_MUTATION_RANGE * mr, GameConstants.FLAGELLA_MUTATION_RANGE * mr),
                0, GameConstants.FLAGELLA_MAX_LEVEL
            ),
            maxForce: parentDNA.maxForce,

            // Visual traits - SIZE and COLOR with configurable mutation
            size: parentDNA.size + random(-sizeConfig.mutationRange * mr, sizeConfig.mutationRange * mr) * 10,
            color: [
                constrain(parentDNA.color[0] + random(-colorConfig.mutationRange * mr, colorConfig.mutationRange * mr) * 10, 0, 255),
                constrain(parentDNA.color[1] + random(-colorConfig.mutationRange * mr, colorConfig.mutationRange * mr) * 10, 0, 255),
                constrain(parentDNA.color[2] + random(-colorConfig.mutationRange * mr, colorConfig.mutationRange * mr) * 10, 0, 255)
            ],

            // FUNCTIONAL TRAITS (mutate!)
            // EVOLUTIONARY PRESSURE: Apply environmental stability to mutation rate
            mutationRate: this.mutateMutationRate(parentDNA.mutationRate, environmentalStability),
            metabolicEfficiency: constrain(
                parentDNA.metabolicEfficiency + random(-GameConstants.EFFICIENCY_MUTATION_RANGE * mr, GameConstants.EFFICIENCY_MUTATION_RANGE * mr) * 10,
                GameConstants.EFFICIENCY_MIN, GameConstants.EFFICIENCY_MAX
            ),
            storageCapacity: constrain(
                parentDNA.storageCapacity + random(-GameConstants.STORAGE_MUTATION_RANGE * mr, GameConstants.STORAGE_MUTATION_RANGE * mr) * 10,
                GameConstants.STORAGE_MIN, GameConstants.STORAGE_MAX
            ),

            // DNA Repair Efficiency (evolves with UV pressure)
            dnaRepairEfficiency: constrain(
                parentDNA.dnaRepairEfficiency + random(-GameConstants.DNA_REPAIR_MUTATION_RANGE * mr, GameConstants.DNA_REPAIR_MUTATION_RANGE * mr),
                GameConstants.DNA_REPAIR_MAX
            ),

            // SOD Efficiency (Oxygen Tolerance) - BUG FIX: Now inherited!
            sodEfficiency: constrain(
                parentDNA.sodEfficiency + random(-0.1 * mr, 0.1 * mr),
                0.1, 1.0 // Min 0.1 to avoid complete lack of protection
            ),

            // THERMAL ADAPTATION - Temperature niche specialization
            // Cells evolve optimal temperature and tolerance for their environment
            thermalOptimum: constrain(
                parentDNA.thermalOptimum + random(-GameConstants.THERMAL_OPTIMUM_MUTATION_RANGE * mr, GameConstants.THERMAL_OPTIMUM_MUTATION_RANGE * mr),
                GameConstants.TEMPERATURE_MIN,
                GameConstants.TEMPERATURE_MAX
            ),
            thermalTolerance: constrain(
                parentDNA.thermalTolerance + random(-GameConstants.THERMAL_TOLERANCE_MUTATION_RANGE * mr, GameConstants.THERMAL_TOLERANCE_MUTATION_RANGE * mr),
                3,  // Minimum tolerance (very specialized)
                20  // Maximum tolerance (generalist)
            ),

            // METABOLISM & ORGANELLES - INHERIT FROM PARENT
            metabolismType: parentDNA.metabolismType,
            organelles: {
                ribosomes: true,
                hydrogenosomes: parentDNA.organelles.hydrogenosomes,
                chemosynthetic_enzymes: parentDNA.organelles.chemosynthetic_enzymes
            },

            // MULTI-METABOLISM SYSTEM - Deep copy from parent
            // Each metabolism pathway is inherited with its efficiency and enabled state
            metabolisms: this.copyMetabolisms(parentDNA.metabolisms),

            generation: parentDNA.generation + 1,
            evolutionaryEra: parentDNA.evolutionaryEra  // Will be updated below
        };

        // Constrain visual DNA
        childDNA.size = constrain(childDNA.size, GameConstants.SIZE_MIN, GameConstants.SIZE_MAX);

        // Update evolutionary era based on mutation rate
        childDNA.evolutionaryEra = this.getEvolutionaryEra(childDNA.mutationRate);

        // Apply metabolic divergence
        this.applyMetabolicDivergence(parentDNA, childDNA);

        return childDNA;
    }

    /**
     * Deep copy metabolisms object
     * Ensures all metabolism pathways are properly inherited
     */
    static copyMetabolisms(parentMetabolisms) {
        if (!parentMetabolisms) {
            // Fallback: create default LUCA metabolisms if missing
            return DNAFactory.createLUCA().metabolisms;
        }

        let metabolismsCopy = {};
        for (let [name, data] of Object.entries(parentMetabolisms)) {
            metabolismsCopy[name] = {
                enabled: data.enabled,
                efficiency: data.efficiency,
                substrates: { ...data.substrates },  // Shallow copy is enough for substrates
                energyYield: data.energyYield,
                requiresO2: data.requiresO2,
                requiresLight: data.requiresLight
            };

            // Copy optional fields if present
            if (data.minLightLevel !== undefined) {
                metabolismsCopy[name].minLightLevel = data.minLightLevel;
            }
            if (data.producesO2 !== undefined) {
                metabolismsCopy[name].producesO2 = data.producesO2;
            }
            if (data.geochemicalBonus !== undefined) {
                metabolismsCopy[name].geochemicalBonus = data.geochemicalBonus;
            }
        }

        return metabolismsCopy;
    }

    /**
     * Calculate mutation rate with evolutionary pressure
     * 
     * BIOLOGICAL PRINCIPLE:
     * Mutation rate itself is subject to natural selection (Drake 1991).
     * - Stable environments: Low mutation preserves successful adaptations
     * - Unstable environments: High mutation explores new strategies
     * 
     * This creates a "mutation rate evolution" where cells adapt their
     * mutation rate to environmental conditions.
     * 
     * @param {number} parentMutationRate - Current mutation rate (0.01-0.30)
     * @param {number} environmentalStability - Stability index (0=chaotic, 1=stable)
     * @returns {number} New mutation rate with applied pressure
     */
    static mutateMutationRate(parentMutationRate, environmentalStability) {
        if (!GameConstants.ENVIRONMENTAL_STABILITY_ENABLED) {
            // No pressure - random mutation only (neutral evolution)
            return constrain(
                parentMutationRate + random(-GameConstants.MUTATION_RATE_CHANGE, GameConstants.MUTATION_RATE_CHANGE),
                GameConstants.MUTATION_RATE_MIN, GameConstants.MUTATION_RATE_MAX
            );
        }

        // Calculate evolutionary pressure based on environmental stability
        let pressure = this.calculateMutationPressure(environmentalStability, parentMutationRate);

        // Apply random mutation (genetic drift) + directional pressure (selection)
        let newMutationRate = parentMutationRate +
            random(-GameConstants.MUTATION_RATE_CHANGE, GameConstants.MUTATION_RATE_CHANGE) +  // Drift
            pressure;  // Selection

        return constrain(
            newMutationRate,
            GameConstants.MUTATION_RATE_MIN,  // Modern cells (10^-9)
            GameConstants.MUTATION_RATE_MAX   // Primordial cells (10^-4)
        );
    }

    /**
     * Calculate evolutionary pressure on mutation rate
     * 
     * BIOLOGICAL MODEL:
     * Based on the "error threshold" theory (Eigen 1971) and empirical observations
     * that mutation rates evolve to match environmental variability.
     * 
     * - Stable environments (0.8-1.0): Pressure toward LOW mutation
     *   → Preserves successful adaptations (exploitation)
     *   → Target: 0.03 (similar to modern E. coli: 10^-9 per base)
     * 
     * - Chaotic environments (0.0-0.2): Pressure toward HIGH mutation
     *   → Explores new strategies (exploration)
     *   → Target: 0.15 (similar to LUCA estimates: 10^-5 per base)
     * 
     * @param {number} environmentalStability - Stability index (0-1)
     * @param {number} currentMutationRate - Current mutation rate
     * @returns {number} Directional pressure on mutation rate
     */
    static calculateMutationPressure(environmentalStability, currentMutationRate) {
        // Target mutation rate based on stability
        // Linear interpolation between primordial and modern rates
        let targetMutationRate = map(
            environmentalStability,
            0, 1,           // Environment range
            0.15, 0.03      // LUCA (10^-5) → Modern (10^-9)
        );

        // Calculate pressure as fraction of distance to target
        // Strength parameter controls how quickly cells adapt
        let pressure = (targetMutationRate - currentMutationRate) * GameConstants.STABILITY_PRESSURE_STRENGTH;

        // Constrain pressure to prevent unrealistic jumps
        return constrain(
            pressure,
            GameConstants.STABILITY_MUTATION_PRESSURE_MIN,  // Max increase per generation
            GameConstants.STABILITY_MUTATION_PRESSURE_MAX   // Max decrease per generation
        );
    }

    // Determine evolutionary era based on mutation rate
    static getEvolutionaryEra(mutationRate) {
        if (mutationRate > 0.15) {
            return 'primordial';  // LUCA-like (4.0-3.5 Ga)
        } else if (mutationRate > 0.08) {
            return 'transition';  // Evolving repair systems (3.5-2.5 Ga)
        } else {
            return 'modern';      // Optimized cells (2.5 Ga-present)
        }
    }

    static applyMetabolicDivergence(parentDNA, childDNA) {
        // === CONTINUOUS METABOLIC EVOLUTION ===
        // Instead of hard switching (mutation), we drift efficiencies of all latent pathways.
        // This allows gradual evolution: LUCA -> (LUCA+primitive Fermentation) -> Fermentation

        this.mutateMetabolicEfficiencies(childDNA);

        // Update Dominant Metabolism Label
        // The cell is classified by its most efficient pathway
        let bestType = 'luca';
        let bestEff = childDNA.metabolisms.luca ? childDNA.metabolisms.luca.efficiency : 0;

        for (let [type, data] of Object.entries(childDNA.metabolisms)) {
            if (data.efficiency > bestEff) {
                bestEff = data.efficiency;
                bestType = type;
            }
        }
        childDNA.metabolismType = bestType;

        // NEW: Recalculate Phenotypic Color based on metabolic mix
        // The color now reflects the cell's "metabolic cocktail"
        childDNA.color = ColorSystem.calculatePhenotypicColor(childDNA);
    }

    /**
     * Mutate efficiencies of ALL metabolic pathways
     * Allows latent genes to evolve until they cross the threshold
     */
    static mutateMetabolicEfficiencies(dna) {
        let mr = dna.mutationRate;

        for (let [name, data] of Object.entries(dna.metabolisms)) {
            // Apply drift: +/- small amount (e.g. 0.02)
            // Evolution can push improved efficiency OR degradation (atrophy)
            let drift = random(-GameConstants.METABOLIC_DRIFT_RANGE * mr, GameConstants.METABOLIC_DRIFT_RANGE * mr);

            // LUCA pathway is robust (harder to break completely)
            // Others can drift to 0 (gene loss)
            let minEff = name === 'luca' ? 0.1 : 0.0;

            data.efficiency = constrain(data.efficiency + drift, minEff, GameConstants.EFFICIENCY_MAX);

            // AUTO-ENABLE/DISABLE BASED ON THRESHOLD (Phenotypic Expression)
            // If efficiency > threshold, the gene is expressed (organelle is built)
            // If efficiency < threshold, the gene is latent (silenced)
            if (name === 'luca') {
                data.enabled = true; // LUCA always enabled as fallback
            } else {
                data.enabled = data.efficiency > GameConstants.ORGANELLE_EFFICIENCY_THRESHOLD;
            }
        }
    }

    /**
     * Apply UV-induced mutation
     * Extra mutation in random trait due to imperfect DNA repair
     * 
     * BIOLOGICAL PRINCIPLE:
     * UV damage causes thymine dimers and DNA breaks.
     * Imperfect repair (low dnaRepairEfficiency) causes mutations.
     */
    static applyUVMutation(childDNA) {
        // Apply extra mutation to one random trait
        let traits = ['size', 'color', 'metabolicEfficiency', 'storageCapacity', 'dnaRepairEfficiency', 'sodEfficiency', 'thermalOptimum', 'thermalTolerance'];
        let randomTrait = random(traits);

        switch (randomTrait) {
            case 'size':
                childDNA.size += random(-5, 5);
                childDNA.size = constrain(childDNA.size, GameConstants.SIZE_MIN, GameConstants.SIZE_MAX);
                break;

            case 'color':
                let channel = floor(random(3));
                childDNA.color[channel] = constrain(
                    childDNA.color[channel] + random(-30, 30), 0, 255
                );
                break;

            case 'metabolicEfficiency':
                childDNA.metabolicEfficiency += random(-0.15, 0.15);
                childDNA.metabolicEfficiency = constrain(
                    childDNA.metabolicEfficiency,
                    GameConstants.EFFICIENCY_MIN,
                    GameConstants.EFFICIENCY_MAX
                );
                break;

            case 'storageCapacity':
                childDNA.storageCapacity += random(-15, 15);
                childDNA.storageCapacity = constrain(
                    childDNA.storageCapacity,
                    GameConstants.STORAGE_MIN,
                    GameConstants.STORAGE_MAX
                );
                break;

            case 'dnaRepairEfficiency':
                childDNA.dnaRepairEfficiency += random(-0.1, 0.1);
                childDNA.dnaRepairEfficiency = constrain(
                    childDNA.dnaRepairEfficiency,
                    GameConstants.DNA_REPAIR_MIN,
                    GameConstants.DNA_REPAIR_MAX
                );
                break;

            case 'sodEfficiency':
                childDNA.sodEfficiency += random(-0.1, 0.1);
                childDNA.sodEfficiency = constrain(childDNA.sodEfficiency, 0.1, 1.0);
                break;

            case 'thermalOptimum':
                childDNA.thermalOptimum += random(-5, 5);
                childDNA.thermalOptimum = constrain(
                    childDNA.thermalOptimum,
                    GameConstants.TEMPERATURE_MIN,
                    GameConstants.TEMPERATURE_MAX
                );
                break;

            case 'thermalTolerance':
                childDNA.thermalTolerance += random(-2, 2);
                childDNA.thermalTolerance = constrain(childDNA.thermalTolerance, 3, 20);
                break;
        }

        return childDNA;
    }
}
