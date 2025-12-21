// Game Constants
const GameConstants = {
    // ===== EXECUTION MODE =====
    // DEVELOPMENT: Accelerated simulation (2x speed), debug monitor visible, logs enabled
    // PRODUCTION: Normal speed, clean UI, no debug logs
    EXECUTION_MODE: 'DEVELOPMENT',  // Options: 'DEVELOPMENT', 'PRODUCTION'

    // Mode-specific settings
    DEVELOPMENT: {
        SIMULATION_SPEED: 2.0,        // 2x speed for faster testing
        SHOW_DEBUG_MONITOR: true,     // Show development monitor panel
        LOG_UV_DAMAGE: true,          // Log UV damage events
        LOG_MUTATIONS: true,          // Log mutation events
        LOG_DEATHS: true,             // Log death events
        LOG_REPRODUCTIONS: false,     // Too frequent, disable by default
        LOG_METABOLIC_DIVERGENCE: true // Log LUCA → Fermentation/Chemosynthesis
    },

    PRODUCTION: {
        SIMULATION_SPEED: 1.0,        // Normal speed
        SHOW_DEBUG_MONITOR: false,    // Hide monitor
        LOG_UV_DAMAGE: false,
        LOG_MUTATIONS: false,
        LOG_DEATHS: false,
        LOG_REPRODUCTIONS: false,
        LOG_METABOLIC_DIVERGENCE: false
    },

    // Helper method to get current mode settings
    getCurrentMode() {
        return this[this.EXECUTION_MODE];
    },

    // ===== LUCA VARIABILITY CONFIGURATION =====
    // Controls initial genetic diversity in LUCA population
    // NONE: Pure ancestor (all identical) - slowest evolution
    // MEDIUM: Balanced variability - realistic evolution speed
    // HIGH: High variability - fast evolution for development/testing
    // DEVELOPMENT MODE: High variability for fast testing
    LUCA_VARIABILITY_LEVEL: 'HIGH', // Options: 'NONE', 'MEDIUM', 'HIGH'

    // Variability ranges per level
    // SCIENTIFICALLY CALIBRATED based on LUCA_mutationRate.md research
    // LUCA (4.0 Ga) had mutation rate ~10^-5 to 10^-4 per base per generation
    // Equivalent in simulation: 0.15-0.25 (vs modern cells: 0.01-0.05)
    LUCA_VARIABILITY: {
        NONE: {
            mutationRate: [0.20, 0.20],           // Pure LUCA - high mutation (primitive repair systems)
            metabolicEfficiency: [1.0, 1.0],      // Identical
            storageCapacity: [130, 130],          // Identical
            size: [11.5, 11.5],                   // Identical
            color: [[200, 200, 220], [200, 200, 220]]  // Identical gray
        },
        MEDIUM: {
            mutationRate: [0.15, 0.25],           // Scientifically validated LUCA range
            metabolicEfficiency: [0.9, 1.1],      // ±10% variation
            storageCapacity: [120, 140],          // ±7.7% variation
            size: [10, 13],                       // ±13% variation
            color: [[190, 190, 210], [210, 210, 230]]  // Subtle gray variation
        },
        HIGH: {
            mutationRate: [0.10, 0.30],           // Maximum variability for testing
            metabolicEfficiency: [0.7, 1.3],      // ±30% variation (full original range)
            storageCapacity: [100, 150],          // ±20% variation (full original range)
            size: [8, 15],                        // ±30% variation (full original range)
            color: [[100, 200, 200], [200, 255, 255]]  // Wide color variation
        }
    },

    // ===== SIZE EVOLUTION CONFIGURATION =====
    // Controls how size affects storage, costs, and movement
    // NONE: Size is cosmetic only (LUCA mode)
    // MEDIUM: Balanced size trade-offs (realistic)
    // HIGH: Strong size effects (development mode)
    // DEVELOPMENT MODE: Balanced size effects
    SIZE_EVOLUTION_LEVEL: 'MEDIUM', // Options: 'NONE', 'MEDIUM', 'HIGH'

    SIZE_EVOLUTION: {
        NONE: {
            storageMultiplier: 1.0,      // No effect
            metabolicMultiplier: 1.0,    // No effect
            movementPenalty: 1.0,        // No effect
            mutationRange: 0             // Size doesn't mutate
        },
        MEDIUM: {
            storageMultiplier: 1.5,      // +50% storage for large cells
            metabolicMultiplier: 1.3,    // +30% cost for large cells
            movementPenalty: 0.7,        // -30% speed for large cells
            mutationRange: 2             // Normal mutation
        },
        HIGH: {
            storageMultiplier: 2.0,      // +100% storage for large cells
            metabolicMultiplier: 1.6,    // +60% cost for large cells
            movementPenalty: 0.5,        // -50% speed for large cells
            mutationRange: 3             // High mutation
        }
    },

    // Size constants
    SIZE_MIN: 5,
    SIZE_MAX: 40,
    SIZE_REFERENCE: 15,  // Reference size for calculations

    // ===== SPEED MULTIPLIER (Visibility) =====
    // Multiplies all movement speeds to make evolution more visible
    // 1.0 = Normal (realistic but slow)
    // 2.0 = User mode (visible evolution)
    // 4.0 = Dev mode (very visible, fast testing)
    // DEVELOPMENT MODE: 4x speed for high visibility
    SPEED_MULTIPLIER: 4.0,  // Options: 1.0 (normal), 2.0 (user), 4.0 (dev)

    // ===== COLOR EVOLUTION CONFIGURATION =====
    // Controls how color affects light absorption and photoprotection
    // NONE: Color is cosmetic only (fixed by metabolism)
    // MEDIUM: Balanced color effects (realistic)
    // HIGH: Strong color effects (development mode)
    COLOR_EVOLUTION_LEVEL: 'MEDIUM', // Options: 'NONE', 'MEDIUM', 'HIGH'

    COLOR_EVOLUTION: {
        NONE: {
            lightAbsorptionMultiplier: 1.0,    // No effect
            photoprotectionMultiplier: 1.0,    // No effect
            pigmentCost: 0,                    // No cost
            mutationRange: 0,                  // Color doesn't mutate (fixed by metabolism)
            allowVariation: false              // No variation within metabolism type
        },
        MEDIUM: {
            lightAbsorptionMultiplier: 1.3,    // +30% absorption for dark cells
            photoprotectionMultiplier: 1.2,    // +20% protection for dark cells
            pigmentCost: 0.01,                 // Small energy cost for pigments
            mutationRange: 20,                 // Normal mutation
            allowVariation: true               // Allow color variation
        },
        HIGH: {
            lightAbsorptionMultiplier: 1.8,    // +80% absorption for dark cells
            photoprotectionMultiplier: 1.5,    // +50% protection for dark cells
            pigmentCost: 0.03,                 // Higher energy cost
            mutationRange: 40,                 // High mutation
            allowVariation: true               // Allow color variation
        }
    },

    // Flagella
    FLAGELLA_MAINTENANCE_COST: 0.03,
    FLAGELLA_MOVEMENT_COST: 0.02,
    FLAGELLA_CONSTRUCTION_COST_ENERGY: 10,
    FLAGELLA_CONSTRUCTION_COST_PHOSPHORUS: 0.2,
    FLAGELLA_MAX_LEVEL: 6,
    FLAGELLA_MUTATION_RANGE: 0.3,
    BROWNIAN_SPEED: 0.1,

    // Metabolism
    LUCA_MULTIPLIER: 2.0,
    FERMENTATION_MULTIPLIER: 1.5,
    CHEMOSYNTHESIS_MULTIPLIER: 1.0,
    BASE_METABOLIC_COST: 0.05,
    OXYGEN_COST: 0.02,

    // Reproduction
    REPRODUCTION_THRESHOLD: 0.75,
    REPRODUCTION_PHOSPHORUS_THRESHOLD: 0.6,
    REPRODUCTION_CHANCE: 0.005,
    LUCA_NITROGEN_THRESHOLD: 0.3,

    // Mutation
    SIZE_MUTATION_RANGE: 2,
    COLOR_MUTATION_RANGE: 20,
    EFFICIENCY_MUTATION_RANGE: 0.1,
    STORAGE_MUTATION_RANGE: 10,
    MUTATION_RATE_CHANGE: 0.02,

    // Mutation Limits
    MUTATION_RATE_MIN: 0.01,
    MUTATION_RATE_MAX: 0.3,
    EFFICIENCY_MIN: 0.5,
    EFFICIENCY_MAX: 1.5,
    STORAGE_MIN: 100,
    STORAGE_MAX: 300,
    SIZE_MIN: 5,
    SIZE_MAX: 40,

    // Divergence
    LUCA_DIVERGENCE_CHANCE: 0.01,
    CROSS_METABOLISM_CHANCE: 0.00001,
    CROSS_METABOLISM_MORTALITY: 0.8,

    // ===== ENVIRONMENTAL STABILITY SYSTEM =====
    // Controls evolutionary pressure on mutation rates
    // Stable environments favor low mutation (preserve adaptations)
    // Chaotic environments favor high mutation (explore new strategies)
    ENVIRONMENTAL_STABILITY_ENABLED: true,
    STABILITY_CALCULATION_INTERVAL: 100,      // Calculate every 100 frames
    STABILITY_HISTORY_LENGTH: 50,             // Track last 50 population samples
    STABILITY_MUTATION_PRESSURE_MIN: -0.01,   // Max pressure to increase mutation
    STABILITY_MUTATION_PRESSURE_MAX: 0.02,    // Max pressure to decrease mutation
    STABILITY_PRESSURE_STRENGTH: 0.1,         // How strongly stability affects mutation

    // ===== UV RADIATION SYSTEM =====
    // Simulates primordial Earth without ozone layer (4.0-3.5 Ga)
    // UV intensity 10-100x higher than modern, creates pressure for photoprotection
    UV_RADIATION_ENABLED: true,
    UV_SURFACE_INTENSITY: 100,                // Maximum UV at surface
    UV_DECAY_RATE: 0.15,                      // Exponential decay (3x faster than light)
    UV_DAMAGE_CHANCE_MAX: 0.01,               // 1% max damage probability per frame
    UV_REPAIR_COST_MAX: 2.0,                  // Maximum energy cost for repair
    UV_LETHAL_THRESHOLD: 80,                  // Effective UV level for potential death
    UV_LETHAL_CHANCE: 0.001,                  // 0.1% death chance if above threshold
    UV_MUTATION_CHANCE: 0.3,                  // 30% of damage events cause mutations

    // DNA Repair System (new trait)
    DNA_REPAIR_MIN: 0.1,                      // Minimum repair efficiency (primitive)
    DNA_REPAIR_MAX: 1.0,                      // Maximum repair efficiency (modern)
    DNA_REPAIR_MUTATION_RANGE: 0.05,          // Mutation range for repair efficiency
    DNA_REPAIR_COST_MULTIPLIER: 0.1,          // Metabolic cost per repair efficiency unit

    // ===== INITIAL RESOURCES (LUCA ERA: 4.0-3.5 Ga) =====
    // Scientifically calibrated for pre-photosynthesis primordial ocean
    INITIAL_ENERGY: 100,
    INITIAL_OXYGEN: 10,           // Reduced from 100 - LUCA lived in nearly anoxic conditions
    INITIAL_NITROGEN: 50,
    INITIAL_PHOSPHORUS: 30,
    INITIAL_CO2: 90,              // NEW - High CO₂ in primordial atmosphere

    // O₂ Grid Range (trazas por fotólisis UV)
    OXYGEN_GRID_MIN: 5,           // Minimum O₂ (traces from UV photolysis)
    OXYGEN_GRID_MAX: 20,          // Maximum O₂ (still very low, <1% modern levels)

    // CO₂ Grid Range (atmósfera reductora)
    CO2_GRID_MIN: 80,             // Minimum CO₂ (reducing atmosphere)
    CO2_GRID_MAX: 100,            // Maximum CO₂ (10-100x modern PAL)
    CO2_MAX_ACCUMULATION: 150,    // Cap for CO₂ accumulation

    // H₂ Grid Range (vents hidrotermales - LUCA metabolism)
    // SCIENTIFIC BASIS: Martin & Russell 2007 - Alkaline hydrothermal vents
    // H₂ is the primary electron donor for LUCA's Wood-Ljungdahl pathway
    H2_GRID_MIN: 10,              // Minimum H₂ in water column
    H2_GRID_MAX: 100,             // Maximum H₂ in vents (high concentration)
    H2_VENT_PRODUCTION: 0.5,      // Continuous H₂ production in vents
    H2_MAX_ACCUMULATION: 120,     // Cap for H₂ accumulation in vents

    // Fe²⁺ Grid Range (hierro ferroso - océano Arcaico)
    // SCIENTIFIC BASIS: Holland 2006, Lyons et al. 2014
    // Archean oceans were rich in dissolved Fe²⁺ (ferrous iron)
    // Fe²⁺ + O₂ → Fe³⁺ (MAJOR O₂ sink, maintains O₂ at trace levels)
    // Evidence: Banded Iron Formations (BIF) - geological record
    FE2_GRID_MIN: 50,             // Minimum Fe²⁺ in surface (oxidized)
    FE2_GRID_MAX: 200,            // Maximum Fe²⁺ in deep ocean (reduced)
    FE2_OXIDATION_RATE: 0.015,    // O₂ consumption rate by Fe²⁺ oxidation
    FE2_DEPLETION_THRESHOLD: 10,  // Below this, oxidation slows (Fe²⁺ depleted)

    // Oxygen Tolerance (SOD - Superoxide Dismutase)
    // SCIENTIFIC BASIS: Fridovich 1995, Imlay 2013, Raymond 2006
    // SOD is ancestral enzyme (present in LUCA) that protects against O₂ toxicity
    // 2O₂⁻ + 2H⁺ → H₂O₂ + O₂ (converts toxic superoxide to less toxic peroxide)
    OXYGEN_SAFE_THRESHOLD: 10,       // O₂ level below which damage is negligible (~0.5% PAL)
    OXYGEN_TOXIC_THRESHOLD: 20,      // O₂ level above which damage is severe (~1% PAL)
    OXIDATIVE_DAMAGE_RATE: 0.05,     // Damage per unit of excess O₂ (1-2% O₂ → O₂⁻)
    SOD_MAINTENANCE_COST: 0.05,      // Energy cost per frame to maintain SOD (~1% basal metabolism, reduced from 0.1)

    // Development Logging System
    DEVELOPMENT_LOGGING: {
        enabled: true,  // Set to true to enable logging (WARNING: generates downloads)
        circuits: ['death', 'reproduction'],  // Or ['all'] for everything
        max_log_size_mb: 10,
        max_cells_logged: 50,
        sampling_rate: 10  // Log every N frames
    }
};
