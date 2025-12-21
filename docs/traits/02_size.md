# 2. size (Tamaño Celular)

**Categoría:** Rasgo Visual  
**Rango:** 5-40  
**Valor Inicial:** 8-15 (LUCA pequeña)  
**Mutación:** ±2 × mutationRate × 10

---

## 🔬 Traducción Biológica

### MEMBRANA CELULAR / VOLUMEN CITOPLASMÁTICO
- **Qué es:** Tamaño total de la célula
- **Función:** Determina superficie de intercambio y volumen interno
- **Relación superficie/volumen:** Crítica para metabolismo
- **Ejemplos reales:**
  - Bacterias: 0.5-5 μm
  - Levaduras: 3-10 μm
  - Células eucariotas: 10-100 μm
  - Células gigantes (huevo): hasta varios cm

---

## ⚙️ Mecánica Actual en el Juego

### Implementación
```javascript
// En show()
circle(this.pos.x, this.pos.y, this.dna.size + pulse);

// En checkCollision()
let minDist = (this.dna.size + other.dna.size) * 0.5;

// Afecta tamaño del núcleo visual
let nucleusSize = map(this.dna.storageCapacity, 100, 300, 0.3, 0.5);
circle(this.pos.x, this.pos.y, this.dna.size * nucleusSize);
```

### Efectos
- ✅ Visualización del tamaño
- ✅ Afecta colisiones entre células
- ✅ Afecta tamaño del núcleo
- ❌ **NO afecta capacidad de almacenamiento**
- ❌ **NO afecta consumo metabólico**

---

## 💡 Sentido en el Juego

### Ventajas Potenciales (no implementadas)
- 📦 Mayor capacidad de almacenamiento
- 🎯 Más fácil de encontrar recursos (mayor área)
- 💪 Más resistente a daños

### Desventajas Potenciales (no implementadas)
- ⚡ Mayor consumo energético
- 🐌 Movimiento más lento
- 🎲 Mutaciones más costosas (más ADN que replicar)

---

## 📊 Evaluación: **3/10**

### ✅ Fortalezas
- Visualización clara
- Afecta colisiones físicas

### ❌ Debilidades
> [!CAUTION]
> **El tamaño es puramente cosmético**
> 
> No tiene impacto funcional real en el juego. Debería estar vinculado a `storageCapacity` y costos metabólicos.

### 🔧 Mejoras Propuestas

#### 1. Vincular con Capacidad de Almacenamiento
```javascript
// En constructor, después de definir dna
this.maxResources = this.dna.storageCapacity * (this.dna.size / 20);
```

#### 2. Costo Metabólico por Tamaño
```javascript
// En update(), en el cálculo de costos
let sizeFactor = this.dna.size / 15; // Normalizado a tamaño medio
let energyCost = baseCost * metabolismMultiplier * sizeFactor;
```

#### 3. Relación Tamaño-Velocidad
```javascript
// En constructor
this.effectiveMaxSpeed = this.dna.maxSpeed * (20 / this.dna.size);
// Células grandes son más lentas
```

---

## 🧬 Evolución Esperada

Con los trade-offs implementados:
- **Células pequeñas:** Rápidas, eficientes, poca capacidad
- **Células grandes:** Lentas, costosas, gran capacidad de almacenamiento
- **Estrategia r/K:** Pequeñas se reproducen rápido, grandes sobreviven mejor

---

## 🔬 Biología Real

### Ley de Kleiber (Metabolismo vs Tamaño)
- Metabolismo ∝ Masa^(3/4)
- Células grandes son más eficientes por unidad de masa
- Pero tienen menor relación superficie/volumen

### Trade-off Real
- **Pequeñas:** Alta tasa metabólica, rápida reproducción
- **Grandes:** Baja tasa metabólica, mayor supervivencia
