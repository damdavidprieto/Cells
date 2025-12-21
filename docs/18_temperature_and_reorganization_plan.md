# Plan: Sistema de Temperatura y Reorganización de Código

## Parte 1: Sistema de Temperatura

### Objetivo
Implementar gradiente térmico realista para LUCA (vents hidrotermales 70-80°C, superficie 50-60°C) con adaptación evolutiva.

---

### Fase 1: Grid de Temperatura en Environment

#### Cambios en `Environment.js`

**1. Añadir temperatureGrid:**
```javascript
constructor() {
    // ... existing grids
    this.temperatureGrid = [];  // Temperature gradient (°C)
}
```

**2. Inicializar gradiente térmico:**
```javascript
initGrids() {
    for (let i = 0; i < this.cols; i++) {
        this.temperatureGrid[i] = [];
        
        for (let j = 0; j < this.rows; j++) {
            // TEMPERATURE = Increases with depth (hydrothermal vents)
            // Surface: 50-60°C (warm primordial ocean)
            // Vents (sediment): 70-80°C (hydrothermal activity)
            let depthRatio = j / this.rows;
            let baseTemp = 50 + (30 * depthRatio);  // 50°C → 80°C
            let variation = noise(i * 0.05 + 5000, j * 0.05 + 5000) * 5;
            this.temperatureGrid[i][j] = baseTemp + variation;
        }
    }
}
```

**3. Método de consulta:**
```javascript
getTemperature(x, y) {
    let i = floor(x / this.resolution);
    let j = floor(y / this.resolution);
    if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
        return this.temperatureGrid[i][j];
    }
    return 60;  // Default mid-range
}
```

---

### Fase 2: Trait de Adaptación Térmica

#### Cambios en `DNAFactory.js`

**Añadir traits térmicos a LUCA:**
```javascript
createLUCA() {
    return {
        // ... existing traits
        
        // THERMAL ADAPTATION (new)
        thermalOptimum: random(55, 75),      // Optimal temperature (°C)
        thermalTolerance: random(8, 15),     // Temperature tolerance range (±°C)
        
        // ... rest of traits
    };
}
```

**Justificación científica:**
- LUCA vivió en vents (50-80°C)
- Rango amplio inicial (55-75°C ± 8-15°C)
- Permite adaptación a superficie (50-60°C) o vents (70-80°C)

---

### Fase 3: Mutación de Traits Térmicos

#### Cambios en `DNAMutator.js`

**Añadir mutación térmica:**
```javascript
mutate(parentDNA, environmentalStability) {
    return {
        // ... existing mutations
        
        // THERMAL ADAPTATION
        thermalOptimum: constrain(
            parentDNA.thermalOptimum + random(-2 * mr, 2 * mr),
            40,   // Min: psychrophiles (cold-adapted)
            90    // Max: hyperthermophiles (extreme heat)
        ),
        
        thermalTolerance: constrain(
            parentDNA.thermalTolerance + random(-1 * mr, 1 * mr),
            3,    // Min: stenothermal (narrow range)
            20    // Max: eurythermal (wide range)
        ),
        
        // ... rest of mutations
    };
}
```

---

### Fase 4: Estrés Térmico en Metabolismo

#### Cambios en `MetabolicCosts.js`

**Añadir cálculo de estrés térmico:**
```javascript
static getEnvironmentalStress(entity, environment) {
    let stress = 1.0;
    
    // ... existing stress (oxygen, sediment)
    
    // THERMAL STRESS (new)
    let temp = environment.getTemperature(entity.pos.x, entity.pos.y);
    let tempDiff = abs(temp - entity.dna.thermalOptimum);
    
    if (tempDiff > entity.dna.thermalTolerance) {
        // Outside tolerance: exponential stress
        let excessTemp = tempDiff - entity.dna.thermalTolerance;
        let thermalStress = 1.0 + (excessTemp / 10) * 0.5;
        stress *= thermalStress;
    }
    
    return stress;
}
```

**Efecto:**
- Células fuera de rango térmico → Mayor costo metabólico
- Estrés exponencial si excede tolerancia
- Presión selectiva para adaptación térmica

---

### Fase 5: Constantes de Temperatura

#### Cambios en `Constants.js`

**Añadir constantes térmicas:**
```javascript
// ===== TEMPERATURE SYSTEM =====
// Primordial ocean with hydrothermal vents (4.0-3.5 Ga)
TEMPERATURE_ENABLED: true,
TEMPERATURE_SURFACE_MIN: 50,      // Surface minimum (°C)
TEMPERATURE_SURFACE_MAX: 60,      // Surface maximum (°C)
TEMPERATURE_VENT_MIN: 70,         // Vent minimum (°C)
TEMPERATURE_VENT_MAX: 80,         // Vent maximum (°C)

// Thermal adaptation ranges
THERMAL_OPTIMUM_MIN: 40,          // Psychrophiles (cold-adapted)
THERMAL_OPTIMUM_MAX: 90,          // Hyperthermophiles (extreme heat)
THERMAL_TOLERANCE_MIN: 3,         // Stenothermal (narrow)
THERMAL_TOLERANCE_MAX: 20,        // Eurythermal (wide)
THERMAL_MUTATION_RANGE: 2.0,      // Mutation range for optimum
```

---

### Fase 6: Visualización (Opcional)

**Mostrar temperatura en monitor:**
```javascript
// Sketch.js - updateStats()
let avgTemp = 0;
for (let entity of entities) {
    avgTemp += environment.getTemperature(entity.pos.x, entity.pos.y);
}
avgTemp /= entities.length;

// Display in UI
document.getElementById('avg-temp').innerText = avgTemp.toFixed(1) + '°C';
```

**Grid de temperatura (opcional):**
```javascript
// Environment.js - show()
// Draw temperature gradient (red = hot, blue = cold)
for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
        let temp = this.temperatureGrid[i][j];
        let hue = map(temp, 50, 80, 240, 0);  // Blue → Red
        fill(hue, 100, 50, 50);
        rect(i * this.resolution, j * this.resolution, 
             this.resolution, this.resolution);
    }
}
```

---

## Parte 2: Reorganización de Código

### Estructura Actual
```
src/
├── Entity.js
├── Environment.js
├── Sketch.js
├── dna/
│   ├── DNAFactory.js
│   └── DNAMutator.js
├── metabolism/
│   ├── ColorSystem.js
│   ├── FlagellaCosts.js
│   ├── MembraneSystem.js
│   ├── MetabolicCosts.js
│   └── ResourceConsumption.js
├── reproduction/
│   └── ReproductionSystem.js
├── utils/
│   ├── Constants.js
│   └── GeneticDistance.js
└── visualization/
    ├── CellRenderer.js
    ├── DevelopmentMonitor.js
    ├── MutationRateTracker.js
    └── SpeciesNotifier.js
```

---

### Estructura Propuesta

```
src/
├── core/
│   ├── Entity.js           # Clase principal de célula
│   └── Sketch.js           # Loop principal
│
├── environment/
│   ├── Environment.js      # Grid manager principal
│   ├── ResourceGrids.js    # Light, O₂, N₂, P, CO₂ (NUEVO)
│   ├── PhysicalGrids.js    # Temperature, pH, UV (NUEVO)
│   └── ChemicalGrids.js    # H₂, Fe²⁺, metals (FUTURO)
│
├── dna/
│   ├── DNAFactory.js       # Creación de DNA
│   └── DNAMutator.js       # Mutaciones
│
├── cellular_systems/       # RENOMBRADO de "metabolism"
│   ├── MetabolicCosts.js   # Costos metabólicos
│   ├── ResourceConsumption.js  # Consumo de recursos
│   ├── ColorSystem.js      # Pigmentos y fotoprotección
│   ├── MembraneSystem.js   # Membrana y tamaño
│   └── FlagellaCosts.js    # Flagelos y movimiento
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

### Justificación de Cambios

#### 1. **`core/`** (Nueva carpeta)
- Agrupa Entity y Sketch (núcleo de la simulación)
- Separación clara de lógica central

#### 2. **`environment/`** (Nueva carpeta)
- **Environment.js** - Manager principal
- **ResourceGrids.js** - Light, O₂, N₂, P, CO₂
- **PhysicalGrids.js** - Temperature, pH, UV
- **ChemicalGrids.js** - H₂, Fe²⁺ (futuro)

**Ventajas:**
- Modularización por tipo de grid
- Fácil añadir nuevos grids (H₂, pH, Fe²⁺)
- Código más mantenible

#### 3. **`cellular_systems/`** (Renombrado)
- Nombre más preciso que "metabolism"
- Incluye sistemas celulares: metabolismo, membrana, color, flagelos
- Refleja mejor el contenido

---

### Plan de Migración

#### Paso 1: Crear nuevas carpetas
```bash
mkdir src/core
mkdir src/environment
mkdir src/cellular_systems
```

#### Paso 2: Mover archivos
```bash
# Core
mv src/Entity.js src/core/
mv src/Sketch.js src/core/

# Environment (crear después de split)
mv src/Environment.js src/environment/

# Cellular systems
mv src/metabolism/* src/cellular_systems/
rmdir src/metabolism
```

#### Paso 3: Actualizar imports en `index.html`
```html
<!-- Core -->
<script src="src/core/Entity.js"></script>
<script src="src/core/Sketch.js"></script>

<!-- Environment -->
<script src="src/environment/Environment.js"></script>

<!-- Cellular Systems -->
<script src="src/cellular_systems/MetabolicCosts.js"></script>
<script src="src/cellular_systems/ResourceConsumption.js"></script>
<!-- ... etc -->
```

#### Paso 4: Split Environment.js (OPCIONAL - Fase 2)
```javascript
// environment/ResourceGrids.js
class ResourceGrids {
    static initializeLight(cols, rows, resolution) { ... }
    static initializeOxygen(cols, rows, resolution) { ... }
    static initializeNitrogen(cols, rows, resolution) { ... }
    static initializePhosphorus(cols, rows, resolution) { ... }
    static initializeCO2(cols, rows, resolution) { ... }
}

// environment/PhysicalGrids.js
class PhysicalGrids {
    static initializeTemperature(cols, rows, resolution) { ... }
    static initializeUV(cols, rows, resolution) { ... }
    // Future: pH, pressure
}

// environment/Environment.js
class Environment {
    constructor() {
        // Delegate to specialized classes
        this.lightGrid = ResourceGrids.initializeLight(...);
        this.temperatureGrid = PhysicalGrids.initializeTemperature(...);
        // ...
    }
}
```

---

## Resumen de Implementación

### Prioridad 1: Sistema de Temperatura (CRÍTICO)
- [ ] Añadir `temperatureGrid` a Environment
- [ ] Inicializar gradiente 50-80°C
- [ ] Añadir traits `thermalOptimum` y `thermalTolerance`
- [ ] Implementar mutación térmica
- [ ] Añadir estrés térmico en MetabolicCosts
- [ ] Añadir constantes de temperatura
- [ ] Probar adaptación térmica

### Prioridad 2: Reorganización de Código (MEJORA)
- [ ] Crear carpetas `core/` y `environment/`
- [ ] Renombrar `metabolism/` → `cellular_systems/`
- [ ] Mover archivos a nuevas ubicaciones
- [ ] Actualizar imports en `index.html`
- [ ] Verificar que todo funciona

### Prioridad 3: Split de Environment (OPCIONAL)
- [ ] Crear `ResourceGrids.js`
- [ ] Crear `PhysicalGrids.js`
- [ ] Refactorizar Environment para usar clases especializadas

---

## Referencias Científicas

- **Martin & Russell (2007)** - Alkaline hydrothermal vents (70-80°C)
- **Weiss et al. (2016)** - LUCA thermal habitat
- **Stetter (1996)** - Hyperthermophiles and origin of life
- **Daniel & Cowan (2000)** - Biomolecular stability at high temperatures

---

*Plan de implementación de temperatura y reorganización de código - Diciembre 2025*
