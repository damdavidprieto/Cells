/**
 * DNA FACTORY - LUCA Genome Generator
 * ===================================
 * 
 * Creates initial DNA for LUCA (Last Universal Common Ancestor) cells.
 * 
 * SCIENTIFIC BASIS:
 * ----------------
 * 1. LUCA Characteristics (Weiss et al. 2016):
 *    - Small genome (~500-1000 genes vs. 4000+ in modern E. coli)
 *    - High mutation rate (10^-5 to 10^-4 per base)
 *    - Primitive metabolism (likely chemolithoautotrophic)
 *    - No complex organelles (only ribosomes)
 * 
 * 2. Genetic Variability (Koonin & Wolf 2008):
 *    - Early populations had high genetic diversity
 *    - Horizontal gene transfer was common
 *    - Variability levels affect evolution speed
 * 
 * IMPLEMENTATION:
 * --------------
 * - Configurable variability (NONE/MEDIUM/HIGH)
 * - High mutation rate (0.15-0.25)
 * - Primitive metabolism type ('luca')
 * - Only ribosomes present (universal organelle)
 * 
 * REFERENCES:
 * ----------
 * - Weiss, M. C., et al. (2016). The physiology and habitat of LUCA. Nat. Microbiol.
 * - Koonin, E. V. & Wolf, Y. I. (2008). Genomics of bacteria and archaea. Nucleic Acids Res.
 */
class DNAFactory {
    static createLUCA() {
        // Get variability configuration based on selected level
        const level = GameConstants.LUCA_VARIABILITY_LEVEL;
        const config = GameConstants.LUCA_VARIABILITY[level];

        return {
            // Locomotion - EVOLUTIONARY TRAIT
            flagellaLevel: 0,  // All LUCA start without flagella (pure concept)
            maxForce: 0.1,

            // Visual traits - with configurable variability
            size: random(config.size[0], config.size[1]),
            color: [
                random(config.color[0][0], config.color[1][0]),
                random(config.color[0][1], config.color[1][1]),
                random(config.color[0][2], config.color[1][2])
            ],

            // EVOLUTIONARY TRAITS (functional) - with configurable variability
            // High mutation rate reflects primitive DNA repair systems
            mutationRate: random(config.mutationRate[0], config.mutationRate[1]),
            metabolicEfficiency: random(config.metabolicEfficiency[0], config.metabolicEfficiency[1]),
            storageCapacity: random(config.storageCapacity[0], config.storageCapacity[1]),

            // DNA Repair System - primitive in LUCA (evolves with UV pressure)
            // Low efficiency = more UV damage, high efficiency = better repair but metabolic cost
            dnaRepairEfficiency: random(0.3, 0.7),  // Primitive repair (vs modern 0.9-1.0)

            // SOD (Superoxide Dismutase) - Oxygen tolerance system
            // Protects against O₂ toxicity (superoxide radicals)
            // Low efficiency = more oxidative damage, high efficiency = better protection but energy cost
            sodEfficiency: random(0.3, 0.7),  // Primitive SOD (LUCA had basic O₂ defense)

            // METABOLISM & ORGANELLES
            metabolismType: 'luca', // 'luca', 'fermentation', 'chemosynthesis'
            organelles: {
                ribosomes: true, // All cells have ribosomes (universal)
                hydrogenosomes: false, // Enables fermentation
                chemosynthetic_enzymes: false // Enables chemosynthesis
            },

            // EVOLUTIONARY TRACKING
            generation: 0, // Track evolutionary lineage
            evolutionaryEra: 'primordial', // 'primordial' (>0.15), 'transition' (0.08-0.15), 'modern' (<0.08)
            speciesId: null // Will be calculated based on genetic traits
        };
    }
}
