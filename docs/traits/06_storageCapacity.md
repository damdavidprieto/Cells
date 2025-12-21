# 6. storageCapacity (Capacidad de Almacenamiento)

**Categoría:** Rasgo Funcional  
**Rango:** 100-300  
**Valor Inicial:** 100-150 (LUCA limitada)  
**Mutación:** ±10 × mutationRate × 10

---

## 🔬 Traducción Biológica

### VACUOLAS / GRÁNULOS DE ALMACENAMIENTO
- **Qué son:** Compartimentos celulares para almacenar nutrientes
- **Tipos de almacenamiento:**
  - **Glucógeno:** Polímero de glucosa (energía)
  - **Lípidos:** Gotas lipídicas (energía concentrada)
  - **Polifosfatos:** Gránulos de fósforo (volutina)
  - **Vacuolas:** Grandes compartimentos (células vegetales)

---

## ⚙️ Mecánica Actual en el Juego

### Implementación
```javascript
// En constructor
this.maxResources = this.dna.storageCapacity;

// Límites de recursos
if (this.energy > this.maxResources) this.energy = this.maxResources;
if (this.oxygen > this.maxResources) this.oxygen = this.maxResources;
if (this.nitrogen > this.maxResources) this.nitrogen = this.maxResources;
if (this.phosphorus > this.maxResources) this.phosphorus = this.maxResources;

// Reproducción requiere 75% de capacidad
let reproductionThreshold = this.maxResources * 0.75;

// Afecta tamaño del núcleo visual
let nucleusSize = map(this.dna.storageCapacity, 100, 300, 0.3, 0.5);
```

### Efectos
- ✅ Define límite de todos los recursos
- ✅ Afecta umbral de reproducción
- ✅ Afecta visualización del núcleo
- ❌ **NO afecta tamaño celular**
- ❌ **NO tiene costo metabólico**

---

## 💡 Sentido en el Juego

### Ventajas
- 📦 Almacenar más recursos
- ⏰ Sobrevivir más tiempo sin alimentarse
- 🎯 Reproducirse más fácilmente (umbral absoluto más alto)
- 🛡️ Buffer contra escasez temporal

### Desventajas Actuales
- ❌ **NINGUNA** - Solo ventajas

### Desventajas Esperadas (no implementadas)
- 📏 Debería aumentar tamaño celular
- ⚡ Mayor consumo metabólico basal
- 🐌 Movimiento más lento (más masa)

---

## 📊 Evaluación: **8/10**

### ✅ Fortalezas
- Mecánica bien implementada
- Afecta múltiples recursos (4)
- Crítico para reproducción
- Rango amplio (100-300)

### ❌ Debilidades
> [!IMPORTANT]
> **Bien implementado, pero falta vinculación**
> 
> Debería estar vinculado al tamaño celular y tener costos metabólicos asociados.

### 🔧 Mejoras Propuestas

#### 1. Vincular con Tamaño Celular
```javascript
// En constructor, calcular maxResources basado en tamaño Y capacidad
this.maxResources = this.dna.storageCapacity * (this.dna.size / 20);

// O forzar coherencia
this.dna.size = map(this.dna.storageCapacity, 100, 300, 8, 30);
```

#### 2. Costo Metabólico de Mantenimiento
```javascript
// En update(), mantener vacuolas cuesta energía
let storageCost = (this.dna.storageCapacity / 100) * 0.02;
this.energy -= storageCost;
```

#### 3. Penalización de Velocidad
```javascript
// En update(), más capacidad = más lento
let massEffect = this.dna.storageCapacity / 200;
this.vel.mult(1.0 / massEffect);
```

---

## 🧬 Evolución Esperada

Con trade-offs implementados:

### Alta Capacidad
- 🐘 Células grandes y lentas
- 📦 Gran almacenamiento
- ⏰ Supervivencia prolongada
- 🎯 Ambientes con recursos intermitentes

### Baja Capacidad
- 🐁 Células pequeñas y rápidas
- 📦 Poco almacenamiento
- ⚡ Bajo costo de mantenimiento
- 🎯 Ambientes con recursos constantes

### Nichos
- **Recursos intermitentes:** Alta capacidad domina
- **Recursos constantes:** Baja capacidad más eficiente
- **Ambientes variables:** Capacidad media óptima

---

## 🔬 Biología Real

### Ejemplos de Almacenamiento

#### Bacterias
- **Gránulos de glucógeno:** 10-30% del peso seco
- **Gránulos de polifosfato:** Reserva de P y energía
- **Gotas lipídicas:** Energía concentrada (9 kcal/g)

#### Eucariotas
- **Vacuolas vegetales:** Hasta 90% del volumen celular
- **Adipocitos:** 95% del volumen es lípido
- **Hepatocitos:** 8% glucógeno (reserva de glucosa)

### Trade-offs Reales
- **Camellos:** Joroba de grasa (supervivencia en desierto)
  - Ventaja: Semanas sin agua
  - Desventaja: Lento, vulnerable
  
- **Osos:** Grasa pre-hibernación
  - Ventaja: Meses sin comer
  - Desventaja: Movilidad reducida

### Estrategia de Almacenamiento
- **Ambientes predecibles:** Poco almacenamiento
- **Ambientes impredecibles:** Mucho almacenamiento
- **Migración:** Almacenamiento para el viaje
