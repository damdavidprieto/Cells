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

        // Get color-specific configuration
        const colorLevel = GameConstants.LUCA_INITIAL_COLOR_LEVEL || 'MEDIUM';
        const colorConfig = GameConstants.LUCA_VARIABILITY[colorLevel];

        return {
            // Locomotion - EVOLUTIONARY TRAIT
            flagellaLevel: 0,  // All LUCA start without flagella (pure concept)
            maxForce: 0.1,

            // Visual traits - with configurable variability
            size: random(config.size[0], config.size[1]),
            color: [
                random(colorConfig.color[0][0], colorConfig.color[1][0]),
                random(colorConfig.color[0][1], colorConfig.color[1][1]),
                random(colorConfig.color[0][2], colorConfig.color[1][2])
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

            // THERMAL ADAPTATION SYSTEM
            // LUCA lived in warm primordial ocean (50-80°C) near hydrothermal vents
            // Scientific evidence (Martin & Russell 2007, Weiss et al. 2016):
            // - LUCA was moderately thermophilic (~60°C)
            // - Not extremophile, but adapted to warm ocean
            // - Intermediate between surface (50°C) and vents (80°C)
            thermalOptimum: random(58, 62),      // Optimal ~60°C (moderate thermophile)
            thermalTolerance: random(8, 12),     // Temperature tolerance range (±10°C avg)

            // MULTI-METABOLISM SYSTEM (Phase 1)
            // Cells can have multiple metabolic pathways with individual efficiencies
            // LUCA starts with Wood-Ljungdahl only, others evolve gradually
            metabolisms: {
                // 1. LUCA (Wood-Ljungdahl Pathway)
                // Primary metabolism: H₂ + CO₂ → Acetyl-CoA
                // SCIENTIFIC BASIS: Weiss et al. (2016), Martin & Russell (2007)
                // Lane (2015) - ~0.5 ATP/acetyl-CoA (primitive, inefficient metabolism)
                luca: {
                    enabled: true,              // ✅ LUCA starts with this
                    efficiency: random(0.7, 0.9), // 70-90% efficiency
                    substrates: { H2: 0.4, CO2: 0.2 },
                    energyYield: 1.5,           // Reduced from 2.5 - primitive metabolism
                    requiresO2: false,
                    requiresLight: false,
                    geochemicalBonus: true      // Bonus in sediment (vents)
                },

                // 2. FERMENTATION (Anaerobic glycolysis)
                // Uses internal energy stores → CO₂ + ATP
                fermentation: {
                    enabled: false,             // Evolves later
                    efficiency: 0.0,
                    substrates: { energy: 1.0 },  // Uses stored energy
                    energyYield: 2.0,
                    requiresO2: false,
                    requiresLight: false
                },

                // 3. ANOXIGENIC PHOTOSYNTHESIS (Purple/Green bacteria)
                // H₂ + CO₂ + light → carbohydrates + H₂O
                // Uses H₂ as electron donor (instead of H₂S)
                anoxigenicPhotosynthesis: {
                    enabled: false,
                    efficiency: 0.0,
                    substrates: { H2: 0.3, CO2: 0.2, light: 50 },
                    energyYield: 6.0,
                    requiresO2: false,
                    requiresLight: true,
                    minLightLevel: 30
                },

                // 4. OXYGENIC PHOTOSYNTHESIS (Cyanobacteria)
                // CO₂ + H₂O + light → glucose + O₂
                // ⚠️ PRODUCES O₂ - Changes atmosphere!
                oxigenicPhotosynthesis: {
                    enabled: false,
                    efficiency: 0.0,
                    substrates: { CO2: 0.6, light: 80 },
                    energyYield: 12.0,
                    requiresO2: false,
                    requiresLight: true,
                    minLightLevel: 50,
                    producesO2: 0.6             // Produces oxygen!
                },

                // 5. AEROBIC RESPIRATION (Electron transport chain)
                // Energy + O₂ → CO₂ + H₂O + 36 ATP
                // Most efficient metabolism
                aerobicRespiration: {
                    enabled: false,
                    efficiency: 0.0,
                    substrates: { energy: 1.0, O2: 0.6 },
                    energyYield: 36.0,          // Very efficient!
                    requiresO2: true,
                    requiresLight: false
                }
            },

            // Legacy compatibility (deprecated)
            metabolismType: 'luca',

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
