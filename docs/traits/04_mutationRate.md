# 4. mutationRate (Tasa de Mutación)

**Categoría:** Rasgo Funcional  
**Rango:** 0.01-0.3  
**Valor Inicial:** 0.05-0.15  
**Mutación:** ±0.02 (independiente de sí misma)

---

## 🔬 Traducción Biológica

### SISTEMA DE REPARACIÓN DE ADN / POLIMERASAS
- **Qué son:** Enzimas que copian el ADN durante la replicación
- **Fidelidad:** Precisión en la copia del ADN
- **Sistemas de reparación:**
  - **DNA Polimerasa III:** ~1 error por 10^7 bases (alta fidelidad)
  - **Sin reparación:** ~1 error por 10^4 bases (baja fidelidad)
  - **Sistemas de reparación:** MutS, MutL, MutH (reducen errores 100-1000×)

---

## ⚙️ Mecánica Actual en el Juego

### Implementación
```javascript
// En reproduce(), la tasa de mutación multiplica TODAS las mutaciones
let mr = this.dna.mutationRate;

let childDNA = {
    maxSpeed: this.dna.maxSpeed + random(-0.2 * mr, 0.2 * mr) * 10,
    size: this.dna.size + random(-2 * mr, 2 * mr) * 10,
    color: [
        constrain(this.dna.color[0] + random(-20 * mr, 20 * mr) * 10, 0, 255),
        // ... etc
    ],
    metabolicEfficiency: constrain(
        this.dna.metabolicEfficiency + random(-0.1 * mr, 0.1 * mr) * 10,
        0.5, 1.5
    ),
    // La tasa de mutación puede mutar en sí misma
    mutationRate: constrain(
        this.dna.mutationRate + random(-0.02, 0.02),
        0.01, 0.3
    )
};
```

### Efectos
- ✅ Multiplica todas las mutaciones de descendientes
- ✅ Puede evolucionar (meta-evolución)
- ✅ Afecta variabilidad genética poblacional
- ✅ Rango bien balanceado (0.01-0.3)

---

## 💡 Sentido en el Juego

### Ventajas de Alta Mutación
- 🧬 Adaptación rápida a cambios ambientales
- 🎲 Mayor diversidad genética
- 🚀 Exploración del espacio de rasgos

### Desventajas de Alta Mutación
- ☠️ Riesgo de mutaciones letales
- 📉 Pérdida de adaptaciones exitosas
- 🎯 Menor estabilidad genética

### Ventajas de Baja Mutación
- 🔒 Preserva adaptaciones exitosas
- 📊 Mayor estabilidad
- 🎯 Reproducción fiel

### Desventajas de Baja Mutación
- 🐌 Adaptación lenta
- 🚫 Menor diversidad
- ⚠️ Vulnerable a cambios ambientales

---

## 📊 Evaluación: **9/10**

### ✅ Fortalezas
> [!TIP]
> **EXCELENTE MECÁNICA**
> 
> - Meta-evolución (la mutación muta)
> - Trade-offs claros
> - Afecta toda la población
> - Biológicamente realista

### ❌ Debilidades Menores
- Podría tener un pequeño costo energético (alta fidelidad requiere más energía)

### 🔧 Mejora Propuesta (Opcional)

#### Costo Energético de Baja Mutación
```javascript
// En reproduce(), antes de crear descendiente
// Baja mutación = alta fidelidad = más costoso
let replicationCost = map(this.dna.mutationRate, 0.01, 0.3, 15, 5);
this.energy -= replicationCost;
this.phosphorus -= replicationCost * 0.3; // DNA replication
```

**Efecto:** Células con baja mutación gastan más energía en replicación precisa.

---

## 🧬 Evolución Esperada

### Ambientes Estables
- ⬇️ Baja mutación domina
- 🔒 Preservación de adaptaciones
- 📊 Poblaciones homogéneas

### Ambientes Cambiantes
- ⬆️ Alta mutación domina
- 🎲 Exploración de nuevas estrategias
- 🌈 Poblaciones diversas

### Equilibrio
- ⚖️ Mutación media óptima en la mayoría de casos
- 🔄 Ciclos de exploración y explotación

---

## 🔬 Biología Real

### Tasas de Mutación Naturales
- **Bacterias:** ~10^-9 por base por generación
- **Virus RNA:** ~10^-4 (muy alta, adaptación rápida)
- **Humanos:** ~10^-8 por base por generación

### Mutadores
- **Cepas mutadoras:** Defectos en sistemas de reparación
- **Ventaja:** Adaptación rápida a antibióticos
- **Desventaja:** Acumulación de mutaciones deletéreas

### Estrategia Evolutiva
- **Bet-hedging:** Mantener diversidad para sobrevivir cambios
- **Mutación adaptativa:** Aumentar mutación bajo estrés (controvertido)
