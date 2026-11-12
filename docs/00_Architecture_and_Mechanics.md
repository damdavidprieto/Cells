# Cells Simulation - Architecture & Mechanics

Complete documentation of all systems, mechanics, and code structure.

---

## 📁 Project Structure

```
Cells/
│
├── 📄 index.html                    # Entry point
├── 📄 style.css                     # UI styles
│
├── 📂 src/
│   ├── 📂 utils/
│   │   └── Constants.js             # Game configuration
│   │
│   ├── 📂 dna/
│   │   ├── DNAFactory.js            # LUCA DNA creation
│   │   ├── DNAMutator.js            # Mutation & evolution
│   │   └── GeneticDistance.js       # Genetic similarity
│   │
│   ├── 📂 metabolism/
│   │   ├── MetabolicCosts.js        # Metabolism-specific costs
│   │   ├── ResourceConsumption.js   # Resource intake
│   │   ├── FlagellaCosts.js         # Locomotion costs
│   │   ├── MembraneSystem.js        # Size effects
│   │   └── ColorSystem.js           # Pigment mechanics
│   │
│   ├── 📂 reproduction/
│   │   └── ReproductionSystem.js    # Cell division
│   │
│   ├── 📂 visualization/
│   │   ├── CellRenderer.js          # Cell rendering
│   │   ├── MutationRateTracker.js   # Evolution graph
│   │   └── SpeciesNotifier.js       # Species alerts
│   │
│   ├── 📄 Entity.js                 # Cell class
│   ├── 📄 Environment.js            # World & resources
│   └── 📄 Sketch.js                 # Main loop
│
└── 📂 docs/
    ├── LUCA_mutationRate.md         # Scientific basis
    ├── LUCA_implementation_plan.md  # Implementation plan
    └── 📂 traits/
        ├── 04_mutationRate.md
        └── 05_metabolicEfficiency.md
```

---

## 🎮 Core Mechanics

### 1. **Evolutionary System**

#### Mutation Rate Evolution
- **Initial**: LUCA starts with high mutation rate (0.15-0.25)
- **Pressure**: Environmental stability influences mutation rate
  - Stable environment → pressure toward low mutation (0.03)
  - Chaotic environment → pressure toward high mutation (0.15)
- **Evolution**: Cells gradually evolve from primordial to modern
- **Eras**:
  - Primordial (>0.15): LUCA-like, high exploration
  - Transition (0.08-0.15): Evolving repair systems
  - Modern (<0.08): Optimized, low mutation

**Files**: `DNAMutator.js`, `Environment.js`

---

#### Metabolic Divergence
- **Trigger**: 1% chance per LUCA reproduction
- **Types**:
  - **Fermentation**: Anaerobic, purple color
  - **Chemosynthesis**: Uses nitrogen, green color
- **Irreversibility**: Cross-metabolism transitions are extremely rare (0.001%) with 80% mortality

**Files**: `DNAMutator.js`

---

### 2. **Metabolism System**

#### Species Types

##### 🔵 LUCA (Primordial)
```javascript
{
  color: [200, 200, 220],          // Gray
  metabolismType: 'luca',
  organelles: { ribosomes: true }, // Universal
  efficiency: 2.0x,                // Very inefficient
  consumes: ['energy'],
  mutationRate: 0.15-0.25          // High
}
```

##### 🟣 Fermentation (Anaerobic)
```javascript
{
  color: [180, 100, 150],          // Purple
  metabolismType: 'fermentation',
  organelles: { 
    ribosomes: true,
    hydrogenosomes: true           // Specialized
  },
  efficiency: 1.5x,                // Medium
  consumes: ['energy'],
  stress: {
    highOxygen: +50%               // Oxygen toxicity
  }
}
```

##### 🟢 Chemosynthesis (Chemical)
```javascript
{
  color: [150, 200, 100],          // Green
  metabolismType: 'chemosynthesis',
  organelles: {
    ribosomes: true,
    chemosynthetic_enzymes: true   // Specialized
  },
  efficiency: 1.0x,                // High
  consumes: ['energy', 'nitrogen'],
  stress: {
    outsideSediment: +30%          // Prefers deep zones
  }
}
```

**Files**: `MetabolicCosts.js`, `ResourceConsumption.js`, `DNAMutator.js`

---

#### Environmental Stress
- **Fermentation**: +50% cost in high oxygen (>70)
- **Chemosynthesis**: +30% cost outside sediment
- **LUCA**: No specific stress

**Files**: `MetabolicCosts.js`

---

### 3. **Resource System**

#### Resource Types
| Resource       | Location                    | Regeneration   | Purpose                |
| -------------- | --------------------------- | -------------- | ---------------------- |
| **Light**      | Surface (exponential decay) | Constant       | Energy for all cells   |
| **Oxygen**     | Random distribution         | None (limited) | Respiration            |
| **Nitrogen**   | Sediment (bottom 10%)       | Slow           | Chemosynthesis fuel    |
| **Phosphorus** | Deep sediment               | Very slow      | DNA/RNA (reproduction) |

**Files**: `Environment.js`

---

#### Consumption Mechanics
```javascript
// Per metabolism type per frame:
LUCA:
  energy:     2.0 × efficiency × lightAbsorption
  oxygen:     0.5
  phosphorus: 0.3

Fermentation:
  energy:     1.5 × efficiency × lightAbsorption
  oxygen:     0.3
  phosphorus: 0.4

Chemosynthesis:
  energy:     1.0 × efficiency × lightAbsorption
  nitrogen:   0.8 × efficiency
  oxygen:     0.3
  phosphorus: 0.5
```

**Files**: `ResourceConsumption.js`

---

### 4. **Color & Pigment System**

#### Light Absorption
- **Dark cells**: Absorb more light (1.3x multiplier)
- **Light cells**: Absorb less light (0.8x multiplier)
- **Calculation**: Based on RGB brightness

#### Pigment Cost
- **Complex colors**: Higher energy cost (up to 0.03/frame)
- **Simple colors**: Lower cost
- **Trade-off**: Better absorption vs. maintenance cost

#### Photoprotection
- **Dark pigments**: Better protection from radiation (1.2x)
- **Light pigments**: Less protection (1.0x)

**Files**: `ColorSystem.js`

---

### 5. **Size & Membrane System**

#### Storage Capacity
```javascript
capacity = baseCapacity × (size / 15)^1.5
```
- Larger cells store more resources
- Non-linear scaling

#### Metabolic Cost
```javascript
cost = baseCost × (size / 15)^1.3
```
- Larger cells cost more to maintain
- Economies of scale exist but limited

#### Movement Penalty
```javascript
speed = baseSpeed × (15 / size)^0.7
```
- Larger cells move slower
- Viscosity effects

**Files**: `MembraneSystem.js`

---

### 6. **Locomotion System**

#### Flagella Levels
- **Level 0**: Brownian motion (0.1 speed)
- **Level 1-6**: Active locomotion (progressive speed)

#### Costs
```javascript
// Per frame:
maintenance = 0.03 × flagellaLevel

// Per movement:
movementCost = 0.02 × velocity × flagellaLevel

// Construction (one-time):
energyCost = 10 × (newLevel - oldLevel)
phosphorusCost = 0.2 × (newLevel - oldLevel)
```

**Files**: `FlagellaCosts.js`

---

### 7. **Reproduction System**

#### Requirements
```javascript
canReproduce = 
  energy > 75% maxResources &&
  oxygen > 75% maxResources &&
  nitrogen > threshold &&      // 30% for LUCA, 75% for others
  phosphorus > 60% maxResources &&
  random < 0.5%                // 0.5% chance per frame
```

#### Process
1. Split all resources 50/50
2. Mutate child DNA (with environmental stability)
3. Check for lethal mutations
4. Apply construction costs (flagella)
5. Create new entity

**Files**: `ReproductionSystem.js`

---

### 8. **Environmental Stability System**

#### Calculation
```javascript
stability = 
  populationStability × 0.3 +    // Population variance
  resourceStability × 0.2 +      // Resource distribution
  mortalityStability × 0.5       // Death rate
```

#### Effects
- **High stability (0.8-1.0)**: Pressure toward low mutation
- **Low stability (0.0-0.2)**: Pressure toward high mutation
- **Updates**: Every 100 frames

**Files**: `Environment.js`

---

## 🔄 Game Loop (60 FPS)

```javascript
function draw() {
  // 1. Environment
  environment.update()           // Regenerate resources
  environment.show()             // Render background
  
  // 2. Stability (every 100 frames)
  if (frameCount % 100 === 0) {
    environment.calculateEnvironmentalStability(cells, deaths)
  }
  
  // 3. For each cell:
  for (cell of cells) {
    cell.applyForce(brownian)    // Random movement
    cell.eat(environment)         // Consume resources
    cell.update(environment)      // Apply costs, check death
    cell.show()                   // Render
    
    // Reproduction
    child = cell.reproduce(stability)
    if (child && !child._lethal) {
      cells.push(child)
    }
    
    // Death
    if (cell.isDead) {
      cells.remove(cell)
      deathCount++
    }
  }
  
  // 4. Tracking
  mutationTracker.update(cells)
  speciesNotifier.checkForNewSpecies(cells)
  
  // 5. UI
  updateStats()
  mutationTracker.render()
  speciesNotifier.render()
}
```

**Files**: `Sketch.js`

---

## 📊 DNA Traits

### Evolutionary Traits (Mutable)
| Trait                   | Range     | Effect                 |
| ----------------------- | --------- | ---------------------- |
| **mutationRate**        | 0.01-0.30 | Mutation frequency     |
| **metabolicEfficiency** | 0.5-1.5   | Resource usage         |
| **storageCapacity**     | 100-300   | Max resources          |
| **size**                | 5-40      | Storage, cost, speed   |
| **color**               | RGB       | Light absorption, cost |
| **flagellaLevel**       | 0-6       | Movement speed         |

### Fixed Traits (Inherited)
| Trait               | Values                             | Effect           |
| ------------------- | ---------------------------------- | ---------------- |
| **metabolismType**  | luca, fermentation, chemosynthesis | Species type     |
| **organelles**      | ribosomes, hydrogenosomes, enzymes | Capabilities     |
| **generation**      | 0-∞                                | Lineage tracking |
| **evolutionaryEra** | primordial, transition, modern     | Classification   |

**Files**: `DNAFactory.js`, `DNAMutator.js`

---

## 🎨 Visualization Systems

### Mutation Rate Tracker
- **Location**: Top-right corner
- **Shows**:
  - Temporal graph (last 200 points)
  - Average, min, max mutation rates
  - Reference lines (LUCA, Transition, Modern)
  - Era distribution bar
- **Updates**: Every frame

**Files**: `MutationRateTracker.js`

---

### Species Notifier
- **Location**: Center-bottom
- **Triggers**: First appearance of new metabolism type
- **Shows**:
  - Species name
  - Generation number
  - Color-coded panel
  - Glow effect
- **Duration**: 5 seconds with fade

**Files**: `SpeciesNotifier.js`

---

## 🔧 Configuration (Constants.js)

### LUCA Configuration
```javascript
LUCA_VARIABILITY_LEVEL: 'HIGH'  // NONE, MEDIUM, HIGH

LUCA_VARIABILITY: {
  HIGH: {
    mutationRate: [0.10, 0.30],
    metabolicEfficiency: [0.7, 1.3],
    storageCapacity: [100, 150],
    size: [8, 15],
    color: [[100,200,200], [200,255,255]]
  }
}
```

### Evolution Parameters
```javascript
ENVIRONMENTAL_STABILITY_ENABLED: true
STABILITY_CALCULATION_INTERVAL: 100
STABILITY_PRESSURE_STRENGTH: 0.1

LUCA_DIVERGENCE_CHANCE: 0.01        // 1%
CROSS_METABOLISM_CHANCE: 0.00001    // 0.001%
CROSS_METABOLISM_MORTALITY: 0.8     // 80%
```

### Metabolism Multipliers
```javascript
LUCA_MULTIPLIER: 2.0
FERMENTATION_MULTIPLIER: 1.5
CHEMOSYNTHESIS_MULTIPLIER: 1.0
```

---

## 🧪 Scientific Basis

Based on research documented in `LUCA_mutationRate.md`:

- **LUCA mutation rate**: 10⁻⁵ to 10⁻⁴ per base per generation
- **Simulation equivalent**: 0.15-0.25
- **Reasoning**: Primitive DNA repair systems, hostile environment, small genome

**References**:
- Poole et al. (1998) - RNA world
- Forterre (2015) - Universal tree of life
- Weiss et al. (2016) - LUCA physiology

---

## 📈 Expected Evolution Timeline

| Generation | Mutation Rate | Diversity | Events              |
| ---------- | ------------- | --------- | ------------------- |
| 0-10       | 0.18-0.20     | Very High | Chaotic exploration |
| 10-50      | 0.12-0.15     | High      | Lineage emergence   |
| 50-200     | 0.08-0.10     | Medium    | Specialization      |
| 200+       | 0.04-0.06     | Low       | Optimization        |

**First divergence**: Expected at 30s-2min (real time)

---

## 🎯 Key Design Decisions

1. **Metabolism as species**: Simpler than genetic distance
2. **Environmental stability**: Creates evolutionary pressure
3. **Resource scarcity**: Phosphorus limits reproduction
4. **Size trade-offs**: Storage vs. cost vs. speed
5. **Color mechanics**: Light absorption vs. pigment cost
6. **Rare transitions**: Prevents unrealistic species switching
7. **Visual feedback**: Mutation tracker + species notifications

---

*Last updated: 2025-12-19*
