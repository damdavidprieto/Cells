# Plan: Modularización de Environment.js

## Objetivo
Dividir Environment.js (482 líneas) en scripts más pequeños y manejables, organizados por responsabilidad.

---

## Estructura Propuesta

```
src/ecosystem/
├── Environment.js              # Manager principal (100 líneas)
├── grids/
│   ├── ResourceGrids.js        # Luz, O₂, N₂, P (80 líneas)
│   ├── ChemicalGrids.js        # CO₂, H₂ (60 líneas)
│   └── PhysicalGrids.js        # UV, Temperatura (futuro) (40 líneas)
├── regeneration/
│   └── GridRegeneration.js     # Lógica de regeneración (100 líneas)
└── utils/
    └── GridUtils.js            # Utilidades comunes (40 líneas)
```

---

## Responsabilidades de Cada Módulo

### **1. ResourceGrids.js**
**Responsabilidad:** Inicialización de recursos biológicos

```javascript
class ResourceGrids {
    static initializeLight(cols, rows, resolution) { }
    static initializeOxygen(cols, rows, resolution) { }
    static initializeNitrogen(cols, rows, resolution) { }
    static initializePhosphorus(cols, rows, resolution) { }
}
```

**Contenido:**
- Luz (gradiente exponencial)
- O₂ (trazas, fotólisis UV)
- N₂ (concentrado en sedimento)
- P (muy concentrado en sedimento)

---

### **2. ChemicalGrids.js**
**Responsabilidad:** Inicialización de químicos atmosféricos

```javascript
class ChemicalGrids {
    static initializeCO2(cols, rows, resolution) { }
    static initializeH2(cols, rows, resolution) { }
}
```

**Contenido:**
- CO₂ (atmósfera reductora, 80-100)
- H₂ (vents hidrotermales, gradiente exponencial)

---

### **3. PhysicalGrids.js**
**Responsabilidad:** Inicialización de parámetros físicos

```javascript
class PhysicalGrids {
    static initializeUV(cols, rows, resolution) { }
    static initializeTemperature(cols, rows, resolution) { }  // Futuro
    static initializePH(cols, rows, resolution) { }           // Futuro
}
```

**Contenido:**
- UV radiation (gradiente exponencial, 3× decay)
- Temperatura (futuro)
- pH (futuro)

---

### **4. GridRegeneration.js**
**Responsabilidad:** Lógica de regeneración de recursos

```javascript
class GridRegeneration {
    static regenerateLight(environment) { }
    static regenerateNitrogen(environment) { }
    static regeneratePhosphorus(environment) { }
    static regenerateH2(environment) { }
    static regenerateOxygen(environment) { }  // NUEVO - Fotólisis UV
}
```

**Contenido:**
- Regeneración de luz (constante)
- Regeneración de N₂ (lenta, sedimento)
- Regeneración de P (muy lenta, sedimento)
- Regeneración de H₂ (continua, vents)
- Regeneración de O₂ (fotólisis UV, superficie) - NUEVO

---

### **5. GridUtils.js**
**Responsabilidad:** Utilidades comunes

```javascript
class GridUtils {
    static createGrid(cols, rows) { }
    static getGridValue(grid, x, y, resolution, cols, rows) { }
    static setGridValue(grid, x, y, value, resolution, cols, rows) { }
    static consumeFromGrid(grid, x, y, amount, resolution, cols, rows) { }
}
```

**Contenido:**
- Creación de grids
- Acceso seguro a grids
- Consumo de recursos

---

### **6. Environment.js (Refactorizado)**
**Responsabilidad:** Coordinador principal

```javascript
class Environment {
    constructor() {
        // Inicializar grids usando módulos
        this.lightGrid = ResourceGrids.initializeLight(...);
        this.oxygenGrid = ResourceGrids.initializeOxygen(...);
        this.co2Grid = ChemicalGrids.initializeCO2(...);
        this.h2Grid = ChemicalGrids.initializeH2(...);
        this.uvRadiationGrid = PhysicalGrids.initializeUV(...);
    }
    
    update() {
        // Delegar regeneración a módulo
        GridRegeneration.regenerateLight(this);
        GridRegeneration.regenerateNitrogen(this);
        GridRegeneration.regeneratePhosphorus(this);
        GridRegeneration.regenerateH2(this);
        GridRegeneration.regenerateOxygen(this);  // NUEVO
    }
    
    // Métodos de consumo (delegados a GridUtils)
    consumeLight(x, y, amount) {
        return GridUtils.consumeFromGrid(this.lightGrid, x, y, amount, ...);
    }
}
```

---

## Ventajas de Esta Estructura

### ✅ **1. Modularidad**
- Cada archivo tiene una responsabilidad clara
- Fácil encontrar código específico

### ✅ **2. Mantenibilidad**
- Archivos pequeños (40-100 líneas)
- Fácil de editar a mano
- Cambios localizados

### ✅ **3. Escalabilidad**
- Fácil añadir nuevos grids (temperatura, pH)
- Fácil añadir nueva lógica de regeneración

### ✅ **4. Testing**
- Cada módulo se puede probar independientemente
- Funciones estáticas puras (sin estado)

### ✅ **5. Claridad**
- Nombres descriptivos
- Organización lógica
- Fácil de entender

---

## Plan de Migración

### Fase 1: Crear Estructura de Carpetas
```bash
mkdir src/ecosystem/grids
mkdir src/ecosystem/regeneration
mkdir src/ecosystem/utils
```

### Fase 2: Crear Módulos Vacíos
- Crear ResourceGrids.js
- Crear ChemicalGrids.js
- Crear PhysicalGrids.js
- Crear GridRegeneration.js
- Crear GridUtils.js

### Fase 3: Extraer Código de Environment.js
- Mover inicialización de luz → ResourceGrids
- Mover inicialización de O₂ → ResourceGrids
- Mover inicialización de N₂ → ResourceGrids
- Mover inicialización de P → ResourceGrids
- Mover inicialización de CO₂ → ChemicalGrids
- Mover inicialización de H₂ → ChemicalGrids
- Mover inicialización de UV → PhysicalGrids
- Mover regeneración → GridRegeneration

### Fase 4: Refactorizar Environment.js
- Usar módulos en constructor
- Usar módulos en update()
- Mantener métodos de consumo (delegar a GridUtils)

### Fase 5: Actualizar index.html
```html
<!-- Ecosystem Grids -->
<script src="src/ecosystem/grids/ResourceGrids.js"></script>
<script src="src/ecosystem/grids/ChemicalGrids.js"></script>
<script src="src/ecosystem/grids/PhysicalGrids.js"></script>
<script src="src/ecosystem/regeneration/GridRegeneration.js"></script>
<script src="src/ecosystem/utils/GridUtils.js"></script>
<script src="src/ecosystem/Environment.js"></script>
```

### Fase 6: Testing
- Verificar que simulación funciona
- Verificar que todos los grids se inicializan
- Verificar que regeneración funciona

---

## Próximos Pasos

1. ¿Apruebas esta estructura?
2. ¿Quieres que proceda con la implementación?
3. ¿Algún cambio en la organización?

---

*Plan de modularización de Environment.js - Diciembre 2025*
