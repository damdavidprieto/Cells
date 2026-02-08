
// Game Constants
const GameConstants = {
    // DEBUG FLAGS
    DEBUG_DISABLE_PIGMENTS: false, // Forces all cells to gray [200,200,200] to test rendering

    // ===== EXECUTION MODE =====
    // DEVELOPMENT: Accelerated simulation (2x speed), debug monitor visible, logs enabled
    // PRODUCTION: Normal speed, clean UI, no debug logs
    // SINGLE_CELL_MODE: Analysis mode with 1 cell in ideal conditions
    // SINGLE_VENT_MODE: Manual control of a single vent with phantom mitosis
    EXECUTION_MODE: 'DEVELOPMENT',  // Default to development for coding sessions
    SCENARIO: 'STANDARD',          // Default to full grid ocean

    // Mode-specific settings
    DEVELOPMENT: {
        SIMULATION_SPEED: 2.0,        // 2x speed for faster testing
        SHOW_DEBUG_MONITOR: true,     // Show development monitor panel
        LOG_UV_DAMAGE: true,          // Log UV damage events
        LOG_MUTATIONS: true,          // Log mutation events
        LOG_DEATHS: true,             // Log death events
        LOG_REPRODUCTIONS: true,      // Log reproduction (vital for lineage tracing)
        LOG_METABOLIC_DIVERGENCE: true, // Log LUCA → Fermentation/Chemosynthesis
        REPRODUCTION_CHANCE_MULTIPLIER: 2.0 // 2x faster reproduction (reduced from 5x to prevent explosion)
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

    SINGLE_CELL_MODE: {
        FPS: 120,                     // Doubled FPS limit (MAX SPEED)
        PHYSICS_STEPS: 5,             // HYPER-SPEED: 5 logic updates per frame (Total speed: 120*5 = 600 ticks/sec)
        LOG_VERBOSITY: 2,
        INITIAL_POPULATION: 1, // Start with exactly 1 cell
        REPRODUCTION_ENABLED: true, // User requested mitosis enabled
        FORCE_IDEAL_CONDITIONS: false, // User requested "normal vents" (full environment)
        LOG_DEATHS: true,
        LOG_REPRODUCTIONS: true,
        LOG_METABOLIC_DIVERGENCE: true,
        // Special flags
        LOG_EVERY_FRAME: true         // High frequency logging for deep analysis
    },

    SINGLE_VENT_MODE: {
        FPS: 60,                      // Normal visual speed for monitoring
        PHYSICS_STEPS: 1,             // Normal physics for accurate manual control
        LOG_VERBOSITY: 2,
        INITIAL_POPULATION: 1,        // Start with exactly 1 cell
        FORCE_IDEAL_CONDITIONS: false,// Rely on dynamic vent control
        PHANTOM_MITOSIS: true,        // Enable phantom mitosis (log & discard offspring)
        MAINTAIN_STATE: true,         // CUSTOM: Maintain baseline conditions (Laboratory)
        LOG_DEATHS: true,
        LOG_REPRODUCTIONS: true,
        LOG_METABOLIC_DIVERGENCE: true,
        LOG_EVERY_FRAME: true
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

    // NEW: Independent control for initial color (Cosmetic vs Genetic)
    // MEDIUM = Gray/Realistic (Recommended)
    // HIGH = Cyan/Green (Development)
    LUCA_INITIAL_COLOR_LEVEL: 'MEDIUM', // Options: 'NONE', 'MEDIUM', 'HIGH'

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
            color: [[100, 100, 120], [140, 140, 160]]  // Solid Gray-Slate (Darker for visibility)
        },
        HIGH: {
            mutationRate: [0.10, 0.30],           // Maximum variability for testing
            metabolicEfficiency: [0.7, 1.3],      // ±30% variation (full original range)
            storageCapacity: [100, 150],          // ±20% variation (full original range)
            size: [8, 15],                        // ±30% variation (full original range)
            color: [[100, 100, 120], [140, 140, 160]]  // FORCE GRAY (Override Cyan/Green to prevent glitches)
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
    // Legacy multipliers removed - now handled by multi-pathway metabolism system
    BASE_METABOLIC_COST: 0.08,  // Increased from 0.05 for thermodynamic rigor
    OXYGEN_COST: 0.02,          // Cost of oxygen toxicity management

    // Reproduction
    // SCIENTIFIC BASIS: LUCA had primitive metabolism, needed lower threshold
    // Weiss et al. (2016) - LUCA reproduced rapidly to compensate high mortality
    REPRODUCTION_THRESHOLD: 0.40,           // Reduced from 0.60 to 0.40 - Survival Mode
    REPRODUCTION_PHOSPHORUS_THRESHOLD: 0.40, // Reduced from 0.5 to 0.40
    REPRODUCTION_CHANCE: 0.01,              // Increased from 0.005 - faster reproduction (~20-30 min cycle)
    // Cooldown in frames (Cell Cycle Time)
    // Prevents "popcorn" explosions even with infinite resources.
    // 300 frames @ 60fps = 5 seconds minimum between divisions.
    REPRODUCTION_COOLDOWN: 300,
    LUCA_NITROGEN_THRESHOLD: 0.3,

    // Mutation
    SIZE_MUTATION_RANGE: 2,
    COLOR_MUTATION_RANGE: 20,
    EFFICIENCY_MUTATION_RANGE: 0.1,
    STORAGE_MUTATION_RANGE: 10,
    MUTATION_RATE_CHANGE: 0.02,
    PH_OPTIMUM_MUTATION_RANGE: 0.5,
    REDOX_OPTIMUM_MUTATION_RANGE: 20,

    // Mutation Limits
    MUTATION_RATE_MIN: 0.01,
    MUTATION_RATE_MAX: 0.3,
    EFFICIENCY_MIN: 0.5,
    // --- Resources ---
    INITIAL_ENERGY: 500,
    INITIAL_OXYGEN: 0,      // REALISM: LUCA starts anaerobic
    INITIAL_NITROGEN: 50,
    INITIAL_PHOSPHORUS: 50,

    // Divergence & Progressive Evolution
    LUCA_DIVERGENCE_CHANCE: 0.01,
    CROSS_METABOLISM_CHANCE: 0.00001,
    CROSS_METABOLISM_MORTALITY: 0.8,

    // NEW: Continuous Evolution Thresholds
    // Efficiency required to express the phenotype (build the organelle)
    // 0.20 = 20% efficiency needed (Minimal Viable Pathway - Realistic
    // --- Organelles ---
    ORGANELLE_EFFICIENCY_THRESHOLD: 1.0,

    // Flagella (Movement)
    FLAGELLA_MOVEMENT_COST: 0.1,        // Cost per unit of distance moved
    FLAGELLA_MAINTENANCE_COST: 0.05,    // Passive cost per frame per level
    FLAGELLA_CONSTRUCTION_COST_ENERGY: 30,
    FLAGELLA_CONSTRUCTION_COST_PHOSPHORUS: 5,

    // Range of efficiency drift per mutation event (Continuous Evolution)
    // Decreased from 0.02 to 0.005 to simulate geological timescales
    METABOLIC_DRIFT_RANGE: 0.005,


    // ===== EVOLUTIONARY PATHWAYS (DEBUG) =====
    // Set to FALSE to disable specific evolutionary branches
    ENABLE_CHEMOSYNTHESIS: true,   // If false, cells cannot evolve Chemosynthesis
    ENABLE_PHOTOSYNTHESIS: true,   // If false, cells cannot evolve Photosynthesis (Anox/Ox)
    ENABLE_FERMENTATION: true,     // If false, cells cannot evolve Fermentation
    ENABLE_METHANOGENESIS: true,   // H2 + CO2 -> CH4
    ENABLE_METHANOTROPHY: true,    // CH4 + O2 -> CO2
    ENABLE_SULFUR_OXIDATION: true, // H2S + O2 -> Energy

    // ===== VISUAL DEBUGGING =====
    ENABLE_DNA_COLOR_TINT: true,    // If false, removes the random DNA color variation (30% mix)
    ENABLE_METABOLIC_COLOR: true,   // If false, ignores metabolism color and uses pure Gray
    ENABLE_VISUAL_MODIFIERS: true,   // If false, disables Health/Efficiency brightness scaling


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

    // INITIAL RESOURCES (LUCA ERA: 4.0-3.5 Ga)
    // Scientifically calibrated for pre-photosynthesis primordial ocean
    // Reduced to force a "foraging phase" before first mitosis (delayed reproduction)


    // O₂ Grid Range (trazas por fotólisis UV)

    // O₂ Grid Range (trazas mínimas por fotólisis UV)
    OXYGEN_GRID_MIN: 0,           // Strict anoxia
    OXYGEN_GRID_MAX: 1,           // Trace levels only

    // CO₂ Grid Range (atmósfera reductora)
    CO2_GRID_MIN: 80,             // Minimum CO₂ (reducing atmosphere)
    CO2_GRID_MAX: 100,            // Maximum CO₂ (10-100x modern PAL)
    CO2_MAX_ACCUMULATION: 150,    // Cap for CO₂ accumulation

    // H₂ Grid Range (vents hidrotermales - LUCA metabolism)
    // SCIENTIFIC BASIS: Martin & Russell 2007 - Alkaline hydrothermal vents
    // H₂ is the primary electron donor for LUCA's Wood-Ljungdahl pathway
    // SCIENTIFIC BASIS: Lost City Hydrothermal Field (Martin et al. 2008)
    // - H₂ flux is massive: 1-15 mmol/kg fluid.
    // - Supports dense biofilms (billions of cells/cm²).
    // - 5.0 was too low (starvation). 20.0 allows a small, realistic biofilm colony (~15 cells).
    H2_VENT_PRODUCTION: 20.0,      // Continuous H₂ production (Increased to support colony > 4)
    H2_MAX_ACCUMULATION: 250,     // Cap for H₂ accumulation (Increased from 120)

    // N Grid Range (Nitrógeno)
    // SCIENTIFIC BASIS: Ammonia (NH4+) in vents
    VENT_NITROGEN_FLUX: 0.5,       // Continuous Flux
    OCEANIC_NITROGEN: 50,          // Baseline
    NITROGEN_GRID_MAX: 200,        // Max
    CH4_MAX_ACCUMULATION: 100,
    H2S_MAX_ACCUMULATION: 100,
    NH3_MAX_ACCUMULATION: 100,

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
    // OXYGEN & OXIDATIVE STRESS
    OXYGEN_SAFE_THRESHOLD: 10,    // Levels below this are safe (microaerophilic)
    OXIDATIVE_DAMAGE_RATE: 0.01,  // Reduced from 0.05 to 0.01 (Survival Mode)
    SOD_MAINTENANCE_COST: 0.1,    // Energy per frame per SOD unit (protein turnover)
    DEBUG_OXYGEN_DAMAGE: true,    // Enable detailed logging of O2 damage mechanics (Sentinel Cell 0)

    // REPAIR & REGENERATION SYSTEM
    // SCIENTIFIC BASIS:
    // 1. Maintenance Energy Model (Pirt, 1965):
    //    Cells must spend energy ('m') to maintain integrity before growth.
    //    Under stress (Antibiotics/ROS), 'm' increases exponentially.
    //    Ref: "The maintenance energy of bacteria in growing cultures" (Proc. R. Soc. B)
    // 2. Enzymatic Rate Limits (Michaelis-Menten):
    //    Repair enzymes (RecA, UvrABCD) are finite. Repair cannot be instant.
    MAX_STRUCTURAL_DAMAGE: 100,      // Death at >100% damage (Lysis)
    REPAIR_ENERGY_COST: 0.5,         // Reduced from 2.0 (Bankruptcy) to 0.5 (Affordable maintenance)
    BASE_REPAIR_SPEED: 0.2,          // Increased from 0.05 to 0.2 (Robust Repair)

    // UV RADIATION
    UV_RADIATION_ENABLED: true,   // Enable UV mechanics
    // Chemotaxis (New Mechanic - Biased Random Walk)
    // SCIENTIFIC BASIS: Primitive gradient sensing (Run-and-Tumble precursor)
    CHEMOTAXIS_STRENGTH: 0.5,        // Strength of bias towards nutrient (H2)
    MEMBRANE_SENSITIVITY: 0.1,       // Minimum concentration diff to react
    MEMBRANE_PERMEABILITY: 0.15,     // Increased from 0.1 - higher diffusion in vents (steep gradients)
    MEMBRANE_LEAK_RATE: 0.02,        // Base rate of energy/resource leakage
    PMF_ENERGY_YIELD: 0.05,          // Energy gained per pH unit of gradient (Natural PMF)
    MEMBRANE_CO2_DIFFUSION: 0.1,    // Rate of passive CO2 exchange

    // Temperature System
    // SCIENTIFIC BASIS: LUCA lived in warm primordial ocean (50-80°C)
    // Hydrothermal vents (70-80°C) vs surface water (50-60°C)
    TEMPERATURE_ENABLED: true,
    TEMPERATURE_MIN: 50,                     // Minimum temperature (°C) - surface
    TEMPERATURE_MAX: 80,                     // Maximum temperature (°C) - vents
    THERMAL_OPTIMUM_MUTATION_RANGE: 3,       // Mutation range for thermalOptimum (±°C)
    THERMAL_TOLERANCE_MUTATION_RANGE: 1,     // Mutation range for thermalTolerance (±°C)
    THERMAL_STRESS_MULTIPLIER: 0.005,         // Metabolic cost increase per °C deviation (0.5% per degree)

    // ===== RESERVOIR SYSTEM - Infinite Resource Pools =====
    // Simulates atmosphere and ocean beyond visible grid
    // Solves "closed ecosystem" problem (resources deplete too fast)

    // Atmospheric Reservoir (Archean Era: 4.0-3.5 Ga)
    // Top 10% of grid = atmosphere (gas phase, cells cannot live here)
    ATMOSPHERIC_O2: 0.1,              // Traces of O₂ from UV photolysis (<0.001% PAL)
    ATMOSPHERIC_N2: 1000,             // Abundant N₂ (70-80% of atmosphere)
    ATMOSPHERIC_CO2: 500,             // High CO₂ (10-20%, greenhouse gas)

    // Oceanic Reservoir (Global ocean beyond grid edges)
    // Left/Right edges connect to infinite ocean
    OCEANIC_PHOSPHORUS: 30,           // Limited but available (weathering)
    OCEANIC_NITROGEN: 50,             // Moderate (atmospheric fixation)
    OCEANIC_FE2: 100,                 // High Fe²⁺ (ferrous iron, Archean ocean)
    OCEANIC_O2: 5,                    // Traces (pre-photosynthesis)

    // Diffusion Rates (% of gradient transferred per frame)
    // Based on Fick's Law: J = -D × (C_reservoir - C_grid)
    ATMOSPHERE_O2_DIFFUSION: 0.05,    // 5% of gradient (slow, low solubility)
    ATMOSPHERE_N2_DIFFUSION: 0.03,    // 3% of gradient (slowest, very low solubility)
    ATMOSPHERE_CO2_DIFFUSION: 0.08,   // 8% of gradient (fastest, high solubility)
    OCEAN_PHOSPHORUS_DIFFUSION: 0.02, // 2% of gradient (slow, ionic diffusion)
    OCEAN_NITROGEN_DIFFUSION: 0.04,   // 4% of gradient (moderate)
    OCEAN_FE2_DIFFUSION: 0.03,        // 3% of gradient (moderate, ionic)
    OCEAN_O2_DIFFUSION: 0.04,         // 4% of gradient (moderate)

    // Vent Flux Enhancement (Sediment zone)
    // Simulates continuous hydrothermal activity
    VENT_FE2_FLUX: 2.0,               // Fe²⁺ production rate (ferrous iron)

    // P Grid Range (Fósforo)
    // SCIENTIFIC BASIS: Planavsky et al. 2010
    // Phosphate was limited but locally available in vents
    VENT_PHOSPHORUS_FLUX: 0.5,     // Continuous reduced P flux (Was 0.006 - bottleneck fixed)
    OCEANIC_PHOSPHORUS: 50,        // Baseline (Was 30 - allow starting cells to live)
    PHOSPHORUS_GRID_MAX: 200,      // Max accumulation (Was 80)

    // ===== ECOSYSTEM INITIALIZATION CONFIGURATION =====
    // Centralized control for grid generation (gradients, intensities)
    ECOSYSTEM_INIT: {
        // Light (Sunlight)
        LIGHT_SURFACE_INTENSITY: 100,
        LIGHT_DECAY_RATE: 4,

        // Vents & Chemicals
        H2_VENT_INTENSITY: 100,
        H2_DECAY_RATE: 4,
        PHOSPHORUS_VENT_INTENSITY: 80,
        PHOSPHORUS_DECAY_RATE: 6,
        FE2_VENT_INTENSITY: 200,
        FE2_DECAY_RATE: 3,

        // Temperature
        TEMP_SURFACE: 50,
        TEMP_VENT: 80, // Target max temp (Base + Range)
        TEMP_GRADIENT_NOISE: 5,

        // pH
        PH_SURFACE: 6,
        PH_VENT: 10,   // Target max pH (Base + Range)
        PH_NOISE: 0.5
    },

    // ===== VENT SYSTEM CONFIGURATION =====
    // Hydrothermal vent parameters
    VENTS: {
        H2_BASE_FLUX: 5.0,
        CO2_BASE_FLUX: 2.0,
        FE2_BASE_FLUX: 1.0,
        CH4_BASE_FLUX: 1.5,
        H2S_BASE_FLUX: 2.0,
        NH3_BASE_FLUX: 1.0,
        GLOBAL_FLUX_MULTIPLIER: 1.0,

        // Plume Configuration
        DEFAULT_PLUME_RADIUS: 5,
        DEFAULT_PLUME_HEIGHT: 20,
        DEFAULT_DECAY_RATE: 0.15,

        // Vent Type Defaults
        DEFAULT_WIDTH: 3,
        DEFAULT_INTENSITY: 1.0
    },

    // ===== LUCA ENVIRONMENT BASELINES (Single Vent Mode) =====
    // Martin & Russell (2007) - Alkaline Hydrothermal Vents
    LUCA_ENVIRONMENT: {
        H2: 150,           // High H2 concentration
        CO2: 100,          // Reduced CO2 (Bicarbonate/Carbonate at high pH)
        CH4: 50,           // Methane present
        H2S: 20,           // Low sulfide in alkaline chimneys
        NH3: 30,           // Reduced nitrogen
        TEMPERATURE: 70,    // 70°C optimum for survival (compromise)
        PH: 10,            // Alkaline (Lost City type)
        PHOSPHORUS: 80,    // Steady phosphorus supply
        NITROGEN: 50,      // Steady nitrogen (Ammonia/N2)
        OXYGEN: 0,         // Anoxic environment
        LIGHT: 0,          // Deep ocean
        UV: 0              // No UV at depth
    },

    // ===== PHYSICS ENGINE CONFIGURATION =====
    // Global mechanics affecting all entities
    PHYSICS: {
        GLOBAL_GRAVITY: 0.05,       // Downward force (New mechanic)
        BROWNIAN_STRENGTH: 0.1,     // "Temperature" random movement intensity

        // Fluid Resistance (Friction)
        VISCOSITY_WATER: 0.95,      // Standard drag
        VISCOSITY_SEDIMENT: 0.60,   // High drag (mud)
        VISCOSITY_AIR: 0.99,        // Low drag

        // Costs
        COLLISION_ENERGY_COST: 0.5,
        MOVEMENT_COST_MULTIPLIER: 1.0
    },

    // ===== DIFFUSION SYSTEM CONFIGURATION =====
    // Controls how resources spread across the grid
    DIFFUSION: {
        ENABLED: true,
        ITERATIONS: 1,                 // Diffusion steps per frame (higher = faster but heavier)

        // Diffusion Coefficients (0.0 - 1.0)
        // Rate at which resource spreads to neighbors per step
        RATES: {
            ATMOSPHERE: 0.25,          // Fast mixing in gas
            WATER: 0.1,                // Moderate diffusion in liquid
            SEDIMENT: 0.005            // Very slow diffusion in solid
        },

        // Interface Transfer Rates (Boundary Crossing)
        INTERFACES: {
            AIR_WATER: 0.05,           // Gas exchange (slow)
            WATER_SEDIMENT: 0.01       // Leaching/Seeping (very slow)
        }
    },

    // ===== DATABASE LOGGING SYSTEM (IndexedDB) =====
    // New logging system using IndexedDB (no backend, no network)
    // Only active in DEVELOPMENT mode
    DATABASE_LOGGING: {
        enabled: true,                // Enable IndexedDB logging
        log_cell_events: true,        // Log cell births, deaths, state changes
        log_mutations: true,          // Log all mutations
        log_frame_stats: true,        // Log population stats per frame
        log_env_stats: true,          // Log environment stats (diffusion)
        frame_stats_interval: 10,     // Log stats every N frames
        env_stats_interval: 60,       // Log environment stats every 60 frames (1 sec)
    },

    // ===== RESOURCE GOVERNANCE SYSTEM =====
    // Prevents simulation collapse due to population explosions or lag
    GOVERNANCE: {
        DEV_POPULATION_CAP: 500,      // Hard limit for development (safety brake)
        PROD_POPULATION_CAP: 2000,    // Higher limit for production
        MIN_FPS_THRESHOLD: 30,        // Stop reproduction if FPS drops below this
        FPS_CHECK_INTERVAL: 60        // Check average FPS every 60 frames
    },

    // Legacy localStorage-based logging system removed
    // Now using DatabaseLogger (IndexedDB) - see DATABASE_LOGGING above
};
