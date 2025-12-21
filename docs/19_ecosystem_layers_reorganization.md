# Plan: Reorganización con 3 Capas Ecosistémicas + Temperatura

## Objetivo
Reorganizar código reflejando las 3 capas del ecosistema primordial (Aire, Agua, Tierra/Sedimento) y añadir sistema de temperatura.

---

## Parte 1: Estructura de Capas Ecosistémicas

### Concepto: 3 Capas del Océano Primordial

```
┌─────────────────────────────────┐
│  AIRE (Atmosphere)              │  ← CO₂, UV, Temperatura
│  - Atmósfera reductora          │
│  - 10-100× CO₂ moderno          │
└─────────────────────────────────┘
         ↓ Interfaz
┌─────────────────────────────────┐
│  AGUA (Water Column)            │  ← Luz, O₂, Nutrientes
│  - Océano primordial            │
│  - Gradiente de luz             │
│  - Gradiente térmico            │
│  - Células LUCA                 │
└─────────────────────────────────┘
         ↓ Interfaz
┌─────────────────────────────────┐
│  TIERRA (Sediment/Vents)        │  ← N₂, P, H₂, Calor
│  - Sedimento rico en nutrientes │
│  - Vents hidrotermales          │
│  - Quimiosíntesis               │
└─────────────────────────────────┘
```

---

## Parte 2: Estructura de Código Propuesta

### Nueva Organización

```
src/
├── core/
│   ├── Entity.js
│   └── Sketch.js
│
├── ecosystem/                      # NUEVA - Refleja capas
│   ├── layers/
│   │   ├── AtmosphereLayer.js     # AIRE - CO₂, UV, clima
│   │   ├── WaterLayer.js          # AGUA - Luz, O₂, temperatura
│   │   └── SedimentLayer.js       # TIERRA - N₂, P, H₂, vents
│   │
│   ├── grids/
│   │   ├── ResourceGrids.js       # Light, O₂, N₂, P, CO₂
│   │   ├── PhysicalGrids.js       # Temp, pH, UV, pressure
│   │   └── ChemicalGrids.js       # H₂, Fe²⁺, S²⁻ (futuro)
│   │
│   └── Environment.js             # Manager principal
│
├── cellular_systems/              # Renombrado de "metabolism"
│   ├── MetabolicCosts.js
│   ├── ResourceConsumption.js
│   ├── ColorSystem.js
│   ├── MembraneSystem.js
│   └── FlagellaCosts.js
│
├── dna/
│   ├── DNAFactory.js
│   └── DNAMutator.js
│
├── reproduction/
│   └── ReproductionSystem.js
│
├── utils/
│   ├── Constants.js
│   └── GeneticDistance.js
│
└── visualization/
    ├── CellRenderer.js
    ├── DevelopmentMonitor.js
    ├── MutationRateTracker.js
    └── SpeciesNotifier.js
```

---

## Parte 3: Implementación de Capas

### 1. AtmosphereLayer.js (AIRE)

**Responsabilidades:**
- CO₂ atmosférico
- UV radiation
- Temperatura del aire
- Clima (futuro: lluvia, viento)

```javascript
/**
 * ATMOSPHERE LAYER - Primordial reducing atmosphere
 * 
 * Characteristics (4.0-3.5 Ga):
 * - CO₂: 10-100× PAL (Present Atmospheric Level)
 * - O₂: <10⁻⁵ PAL (traces)
 * - CH₄, NH₃, H₂ present
 * - No ozone layer → High UV
 */
class AtmosphereLayer {
    constructor(cols, rows, resolution) {
        this.cols = cols;
        this.rows = rows;
        this.resolution = resolution;
        
        // Atmospheric grids
        this.co2Grid = [];
        this.uvGrid = [];
        this.airTempGrid = [];
    }
    
    initializeGrids() {
        for (let i = 0; i < this.cols; i++) {
            this.co2Grid[i] = [];
            this.uvGrid[i] = [];
            this.airTempGrid[i] = [];
            
            for (let j = 0; j < this.rows; j++) {
                // CO₂ - High, uniform in atmosphere
                let co2Noise = noise(i * 0.08, j * 0.08);
                this.co2Grid[i][j] = map(co2Noise, 0, 1, 
                    GameConstants.CO2_GRID_MIN, 
                    GameConstants.CO2_GRID_MAX);
                
                // UV - Decreases with water depth
                let uvIntensity = GameConstants.UV_SURFACE_INTENSITY * 
                    exp(-GameConstants.UV_DECAY_RATE * j);
                this.uvGrid[i][j] = uvIntensity;
                
                // Air temperature - Warm primordial climate
                this.airTempGrid[i][j] = random(40, 50);  // 40-50°C
            }
        }
    }
    
    // Interface with water layer
    getUVAtSurface(x) {
        let i = floor(x / this.resolution);
        return this.uvGrid[i][0];  // Surface row
    }
    
    getCO2AtSurface(x) {
        let i = floor(x / this.resolution);
        return this.co2Grid[i][0];
    }
}
```

---

### 2. WaterLayer.js (AGUA)

**Responsabilidades:**
- Luz (gradiente vertical)
- O₂ (trazas, fotólisis UV)
- Temperatura (50-70°C)
- Columna de agua donde viven células

```javascript
/**
 * WATER LAYER - Primordial ocean column
 * 
 * Characteristics:
 * - Warm (50-70°C average)
 * - Nearly anoxic (O₂ <1% modern)
 * - Light gradient (surface → depth)
 * - Main habitat for LUCA
 */
class WaterLayer {
    constructor(cols, rows, resolution) {
        this.cols = cols;
        this.rows = rows;
        this.resolution = resolution;
        
        // Water column grids
        this.lightGrid = [];
        this.oxygenGrid = [];
        this.waterTempGrid = [];
    }
    
    initializeGrids() {
        for (let i = 0; i < this.cols; i++) {
            this.lightGrid[i] = [];
            this.oxygenGrid[i] = [];
            this.waterTempGrid[i] = [];
            
            for (let j = 0; j < this.rows; j++) {
                let depthRatio = j / this.rows;
                
                // LIGHT - Exponential decay with depth
                let lightIntensity = 100 * exp(-4 * depthRatio);
                let variation = noise(i * 0.1, j * 0.1) * 0.2;
                this.lightGrid[i][j] = lightIntensity * (1 + variation);
                
                // OXYGEN - Traces (UV photolysis)
                let oxygenNoise = noise(i * 0.15 + 1000, j * 0.15 + 1000);
                this.oxygenGrid[i][j] = map(oxygenNoise, 0, 1, 
                    GameConstants.OXYGEN_GRID_MIN, 
                    GameConstants.OXYGEN_GRID_MAX);
                
                // TEMPERATURE - Increases with depth (vents below)
                // Surface: 50-60°C, Deep: 60-70°C
                let baseTemp = 50 + (20 * depthRatio);
                let tempVariation = noise(i * 0.05, j * 0.05) * 5;
                this.waterTempGrid[i][j] = baseTemp + tempVariation;
            }
        }
    }
    
    // Interface with sediment layer
    getTemperatureAtBottom(x) {
        let i = floor(x / this.resolution);
        return this.waterTempGrid[i][this.rows - 1];
    }
}
```

---

### 3. SedimentLayer.js (TIERRA)

**Responsabilidades:**
- N₂ (compuestos nitrogenados)
- P (fósforo, crítico para DNA)
- H₂ (vents hidrotermales)
- Temperatura alta (70-80°C en vents)

```javascript
/**
 * SEDIMENT LAYER - Ocean floor with hydrothermal vents
 * 
 * Characteristics:
 * - Rich in nutrients (N₂, P)
 * - Hydrothermal vents (70-80°C)
 * - H₂ production (electron donor)
 * - Alkaline pH (9-11)
 * - Habitat for chemosynthesis
 */
class SedimentLayer {
    constructor(cols, rows, resolution) {
        this.cols = cols;
        this.rows = rows;
        this.resolution = resolution;
        
        // Sediment grids
        this.nitrogenGrid = [];
        this.phosphorusGrid = [];
        this.hydrogenGrid = [];      // H₂ from vents
        this.sedimentTempGrid = [];
    }
    
    initializeGrids() {
        for (let i = 0; i < this.cols; i++) {
            this.nitrogenGrid[i] = [];
            this.phosphorusGrid[i] = [];
            this.hydrogenGrid[i] = [];
            this.sedimentTempGrid[i] = [];
            
            for (let j = 0; j < this.rows; j++) {
                let depthRatio = j / this.rows;
                
                // NITROGEN - Concentrated in sediment
                let nitrogenIntensity = 100 * exp(-4 * (1 - depthRatio));
                let nitrogenVariation = noise(i * 0.12, j * 0.12) * 0.3;
                this.nitrogenGrid[i][j] = nitrogenIntensity * (1 + nitrogenVariation);
                
                // PHOSPHORUS - Very concentrated in sediment
                let phosphorusIntensity = 80 * exp(-6 * (1 - depthRatio));
                let phosphorusVariation = noise(i * 0.08, j * 0.08) * 0.4;
                this.phosphorusGrid[i][j] = phosphorusIntensity * (1 + phosphorusVariation);
                
                // H₂ - High in sediment (vents)
                let h2Intensity = 100 * exp(-4 * (1 - depthRatio));
                this.hydrogenGrid[i][j] = h2Intensity;
                
                // TEMPERATURE - Hot vents (70-80°C)
                let baseTemp = 70 + (10 * depthRatio);
                let tempVariation = noise(i * 0.05, j * 0.05) * 5;
                this.sedimentTempGrid[i][j] = baseTemp + tempVariation;
            }
        }
    }
    
    // Regenerate H₂ in vents (continuous production)
    regenerateHydrogen() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = floor(this.rows * 0.9); j < this.rows; j++) {
                // Bottom 10% = vents
                this.hydrogenGrid[i][j] += 0.5;  // Continuous H₂ production
                this.hydrogenGrid[i][j] = min(this.hydrogenGrid[i][j], 100);
            }
        }
    }
}
```

---

### 4. Environment.js (Manager)

**Responsabilidades:**
- Coordinar las 3 capas
- Proporcionar interfaz unificada
- Manejar interacciones entre capas

```javascript
/**
 * ENVIRONMENT - Primordial ocean ecosystem manager
 * Coordinates 3 layers: Atmosphere, Water, Sediment
 */
class Environment {
    constructor() {
        this.resolution = 60;
        this.cols = ceil(width / this.resolution);
        this.rows = ceil(height / this.resolution);
        
        // Initialize 3 ecosystem layers
        this.atmosphere = new AtmosphereLayer(this.cols, this.rows, this.resolution);
        this.water = new WaterLayer(this.cols, this.rows, this.resolution);
        this.sediment = new SedimentLayer(this.cols, this.rows, this.resolution);
        
        // Physical zones
        this.sedimentDepth = 0.10;
        this.sedimentRow = floor(this.rows * (1 - this.sedimentDepth));
        
        // Environmental stability
        this.currentStability = 0.5;
        
        this.initGrids();
    }
    
    initGrids() {
        this.atmosphere.initializeGrids();
        this.water.initializeGrids();
        this.sediment.initializeGrids();
    }
    
    update() {
        // Regenerate resources
        this.regeneratePhosphorus();
        this.sediment.regenerateHydrogen();  // Vents produce H₂
    }
    
    // Unified interface for cells
    getTemperature(x, y) {
        let j = floor(y / this.resolution);
        
        if (j < this.sedimentRow) {
            // Water column
            return this.water.getTemperature(x, y);
        } else {
            // Sediment (vents)
            return this.sediment.getTemperature(x, y);
        }
    }
    
    getUVLevel(x, y) {
        return this.atmosphere.getUV(x, y);
    }
    
    // ... other unified methods
}
```

---

## Parte 4: Plan de Migración

### Fase 1: Crear Estructura de Carpetas

```bash
# Crear carpetas principales
mkdir src/core
mkdir src/ecosystem
mkdir src/ecosystem/layers
mkdir src/ecosystem/grids
mkdir src/cellular_systems

# Mover archivos core
mv src/Entity.js src/core/
mv src/Sketch.js src/core/

# Mover archivos cellular systems
mv src/metabolism/* src/cellular_systems/
rmdir src/metabolism
```

### Fase 2: Crear Archivos de Capas

```bash
# Crear archivos de capas ecosistémicas
touch src/ecosystem/layers/AtmosphereLayer.js
touch src/ecosystem/layers/WaterLayer.js
touch src/ecosystem/layers/SedimentLayer.js

# Mover Environment
mv src/Environment.js src/ecosystem/
```

### Fase 3: Actualizar index.html

```html
<!-- Core -->
<script src="src/core/Entity.js"></script>
<script src="src/core/Sketch.js"></script>

<!-- Ecosystem Layers -->
<script src="src/ecosystem/layers/AtmosphereLayer.js"></script>
<script src="src/ecosystem/layers/WaterLayer.js"></script>
<script src="src/ecosystem/layers/SedimentLayer.js"></script>
<script src="src/ecosystem/Environment.js"></script>

<!-- Cellular Systems -->
<script src="src/cellular_systems/MetabolicCosts.js"></script>
<script src="src/cellular_systems/ResourceConsumption.js"></script>
<script src="src/cellular_systems/ColorSystem.js"></script>
<script src="src/cellular_systems/MembraneSystem.js"></script>
<script src="src/cellular_systems/FlagellaCosts.js"></script>

<!-- DNA -->
<script src="src/dna/DNAFactory.js"></script>
<script src="src/dna/DNAMutator.js"></script>

<!-- Reproduction -->
<script src="src/reproduction/ReproductionSystem.js"></script>

<!-- Utils -->
<script src="src/utils/Constants.js"></script>
<script src="src/utils/GeneticDistance.js"></script>

<!-- Visualization -->
<script src="src/visualization/CellRenderer.js"></script>
<script src="src/visualization/MutationRateTracker.js"></script>
<script src="src/visualization/SpeciesNotifier.js"></script>
<script src="src/visualization/DevelopmentMonitor.js"></script>
```

---

## Parte 5: Sistema de Temperatura Integrado

### Añadir a cada capa:

**AtmosphereLayer:**
- `airTempGrid` - Temperatura del aire (40-50°C)

**WaterLayer:**
- `waterTempGrid` - Temperatura del agua (50-70°C)

**SedimentLayer:**
- `sedimentTempGrid` - Temperatura de vents (70-80°C)

**Environment (unificado):**
```javascript
getTemperature(x, y) {
    let j = floor(y / this.resolution);
    
    if (j < this.sedimentRow) {
        return this.water.getTemperature(x, y);
    } else {
        return this.sediment.getTemperature(x, y);
    }
}
```

---

## Parte 6: Ventajas de esta Estructura

### 1. **Modularidad por Capa Ecosistémica**
- Cada capa es independiente
- Fácil añadir mecánicas específicas (ej: viento en atmósfera)

### 2. **Escalabilidad**
- Futuro: Añadir `layers/IceLayer.js` (glaciaciones)
- Futuro: Añadir `layers/CrustLayer.js` (corteza terrestre)

### 3. **Claridad Científica**
- Estructura refleja realidad geológica
- Fácil documentar cada capa

### 4. **Desarrollo Iterativo**
- Tocar cada capa independientemente
- Ejemplo: Mejorar solo atmósfera sin afectar agua

---

## Resumen de Tareas

### Prioridad 1: Reorganización Básica
- [ ] Crear carpetas `core/`, `ecosystem/`, `cellular_systems/`
- [ ] Mover Entity.js y Sketch.js a `core/`
- [ ] Renombrar `metabolism/` → `cellular_systems/`
- [ ] Mover Environment.js a `ecosystem/`
- [ ] Actualizar imports en index.html
- [ ] Verificar que funciona

### Prioridad 2: Crear Capas Ecosistémicas
- [ ] Crear `AtmosphereLayer.js`
- [ ] Crear `WaterLayer.js`
- [ ] Crear `SedimentLayer.js`
- [ ] Refactorizar Environment para usar capas
- [ ] Probar integración

### Prioridad 3: Sistema de Temperatura
- [ ] Añadir `temperatureGrid` a cada capa
- [ ] Implementar gradiente térmico
- [ ] Añadir traits `thermalOptimum` y `thermalTolerance`
- [ ] Implementar estrés térmico
- [ ] Probar adaptación evolutiva

---

*Plan de reorganización con 3 capas ecosistémicas + temperatura - Diciembre 2025*
