# 5. metabolicEfficiency (Eficiencia Metabólica)

**Categoría:** Rasgo Funcional  
**Rango:** 0.5-1.5  
**Valor Inicial:** 0.7-1.3  
**Mutación:** ±0.1 × mutationRate × 10

---

## 🔬 Traducción Biológica

### MITOCONDRIAS / ENZIMAS METABÓLICAS
- **Qué son:** Maquinaria celular que convierte nutrientes en ATP
- **Eficiencia:** Porcentaje de energía aprovechada vs desperdiciada
- **Ejemplos reales:**
  - **Respiración aeróbica:** ~38% eficiente (38 ATP por glucosa)
  - **Fermentación:** ~2% eficiente (2 ATP por glucosa)
  - **Fotosíntesis:** ~3-6% eficiente (luz → biomasa)

---

## ⚙️ Mecánica Actual en el Juego

### Implementación
```javascript
// En update(), reduce costos de vida
let energyCost = baseCost * metabolismMultiplier * environmentalStress * this.dna.metabolicEfficiency;

// En eat(), reduce consumo al alimentarse
let energyNeeded = baseAmount * this.dna.metabolicEfficiency;
energyConsumed = environment.consumeLight(this.pos.x, this.pos.y, energyNeeded);

// Afecta visualización (brillo)
let efficiencyHue = map(this.dna.metabolicEfficiency, 0.5, 1.5, 0.6, 1.4);
fill(baseColor[0] * healthFactor * efficiencyHue, ...);
```

### Efectos
- ✅ Reduce costos metabólicos de vida
- ✅ Reduce cantidad de recursos necesarios
- ✅ Afecta brillo visual (células eficientes más brillantes)
- ❌ **NO tiene trade-off** (solo ventajas)

---

## 💡 Sentido en el Juego

### Ventajas
- ⚡ Menor consumo de energía
- 🎯 Mayor supervivencia en ambientes pobres
- 📈 Más recursos disponibles para reproducción

### Desventajas Actuales
- ❌ **NINGUNA** - No hay razón para no maximizar

### Desventajas Esperadas (no implementadas)
- 🐌 Reproducción más lenta
- 💪 Menor velocidad máxima
- 🧬 Mayor costo de replicación

---

## 📊 Evaluación: **7/10**

### ✅ Fortalezas
- Mecánica clara y funcional
- Afecta múltiples aspectos del juego
- Rango razonable de valores

### ❌ Debilidades
> [!WARNING]
> **Falta trade-off**
> 
> Alta eficiencia solo tiene ventajas. No hay razón evolutiva para no maximizarla siempre.

### 🔧 Mejoras Propuestas

#### 1. Trade-off: Eficiencia vs Velocidad de Reproducción
```javascript
// En reproduce(), tiempo entre reproducciones
let reproductionChance = 0.005;

// Alta eficiencia = reproducción más lenta (estrategia K)
// Baja eficiencia = reproducción más rápida (estrategia r)
let efficiencyPenalty = map(this.dna.metabolicEfficiency, 0.5, 1.5, 1.5, 0.7);
if (random(1) < reproductionChance * efficiencyPenalty) {
    // reproduce
}
```

#### 2. Trade-off: Eficiencia vs Velocidad Máxima
```javascript
// En constructor
this.effectiveMaxSpeed = this.dna.maxSpeed * (1.5 - this.dna.metabolicEfficiency * 0.3);
// Células eficientes son más lentas (conservan energía)
```

#### 3. Trade-off: Eficiencia vs Adaptabilidad
```javascript
// En update(), bajo estrés ambiental
if (environmentalStress > 1.2) {
    // Células muy eficientes sufren más con cambios
    let adaptabilityCost = (this.dna.metabolicEfficiency - 0.5) * 0.1;
    this.energy -= adaptabilityCost;
}
```

---

## 🧬 Evolución Esperada

Con trade-offs implementados:

### Estrategia r (Baja Eficiencia)
- 🐰 Reproducción rápida
- 🏃 Movimiento rápido
- 💥 Colonización explosiva
- ⚠️ Alto consumo de recursos

### Estrategia K (Alta Eficiencia)
- 🐢 Reproducción lenta
- 🐌 Movimiento conservador
- 🔒 Supervivencia prolongada
- ✅ Bajo consumo de recursos

### Nichos
- **Ambientes ricos:** Estrategia r domina
- **Ambientes pobres:** Estrategia K domina
- **Ambientes variables:** Eficiencia media óptima

---

## 🔬 Biología Real

### Estrategias r/K
- **r-estrategas:** Bacterias, insectos, malezas
  - Alta tasa de reproducción
  - Baja eficiencia energética
  - Colonización rápida
  
- **K-estrategas:** Mamíferos grandes, árboles
  - Baja tasa de reproducción
  - Alta eficiencia energética
  - Supervivencia prolongada

### Eficiencia Metabólica Real
- **Endotermos** (mamíferos): Baja eficiencia (~10%), alta actividad
- **Ectotermos** (reptiles): Alta eficiencia (~50%), baja actividad
- **Trade-off:** Actividad vs Eficiencia
