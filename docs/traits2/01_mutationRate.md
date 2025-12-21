# 01. Tasa de Mutación (Mutation Rate)

**Categoría:** Rasgo Evolutivo  
**Rango:** 0.01-0.30  
**Inicial (LUCA):** 0.15-0.25  
**Mutación:** ±0.02 (independiente) + Presión Ambiental

---

## 🔬 Traducción Biológica

### SISTEMAS DE REPARACIÓN DE ADN Y POLIMERASAS
- **Qué son:** Enzimas que copian el ADN durante la replicación
- **Fidelidad:** Precisión en la copia del ADN
- **Sistemas de reparación:**
  - **DNA Polimerasa III:** ~1 error por 10⁷ bases (alta fidelidad)
  - **Sin reparación:** ~1 error por 10⁴ bases (baja fidelidad)
  - **Reparación de errores:** MutS, MutL, MutH (reducen errores 100-1000×)

**Contexto LUCA (Weiss et al. 2016):**
- Sistemas de reparación primitivos
- Alta tasa de mutación: 10⁻⁵ a 10⁻⁴ por base por generación
- Genoma pequeño (~500-1000 genes)
- Ambiente hostil (radiación UV, alta temperatura)

---

## ⚙️ Implementación Actual

### Código
```javascript
// DNAMutator.js - Con presión evolutiva
mutationRate: this.mutateMutationRate(parentDNA.mutationRate, environmentalStability)

static mutateMutationRate(parentMutationRate, environmentalStability) {
    // Calcular presión evolutiva
    let pressure = this.calculateMutationPressure(environmentalStability, parentMutationRate);
    
    // Mutación aleatoria + presión direccional
    let newMutationRate = parentMutationRate +
        random(-0.02, 0.02) +  // Deriva genética
        pressure;               // Selección natural
    
    return constrain(newMutationRate, 0.01, 0.30);
}
```

### Efectos
- ✅ Multiplica TODAS las mutaciones de descendientes
- ✅ **Evoluciona por sí misma** (meta-evolución)
- ✅ **Presión ambiental:** Estable → baja mutación, Caótico → alta mutación
- ✅ Afecta variabilidad genética poblacional
- ✅ Clasificada en eras evolutivas (Primordial, Transición, Moderna)

---

## 💡 Mecánicas del Juego

### Alta Mutación
**Ventajas:**
- 🧬 Adaptación rápida a cambios ambientales
- 🎲 Mayor diversidad genética
- 🚀 Exploración del espacio de rasgos
- 🌊 Mejor en ambientes caóticos

**Desventajas:**
- ☠️ Riesgo de mutaciones letales
- 📉 Pérdida de adaptaciones exitosas
- 🎯 Menor estabilidad genética
- ⚡ Mayor costo energético (sistemas de reparación complejos)

### Baja Mutación
**Ventajas:**
- 🔒 Preserva adaptaciones exitosas
- 📊 Mayor estabilidad
- 🎯 Reproducción fiel
- 🏆 Mejor en ambientes estables

**Desventajas:**
- 🐌 Adaptación lenta
- 🚫 Menor diversidad
- ⚠️ Vulnerable a cambios ambientales

---

## 📊 Evaluación: **10/10** ⭐

### ✅ Fortalezas
> [!TIP]
> **MECÁNICA EXCELENTE - FUNDAMENTADA CIENTÍFICAMENTE**
> 
> - Meta-evolución (la tasa de mutación muta)
> - Presión ambiental (Drake 1991, Eigen 1971)
> - Trade-offs claros
> - Afecta toda la población
> - Biológicamente realista
> - Crea eras evolutivas

### Base Científica
- **Drake (1991):** Las tasas de mutación evolucionan bajo selección
- **Eigen (1971):** Teoría del umbral de error
- **Poole et al. (1998):** LUCA tenía altas tasas de mutación
- **Weiss et al. (2016):** Características de LUCA

---

## 🧬 Evolución Esperada

### Ambientes Estables (Alta Estabilidad 0.8-1.0)
- ⬇️ Baja mutación domina (objetivo: 0.03)
- 🔒 Preservación de adaptaciones
- 📊 Poblaciones homogéneas
- 🎯 Células "Modernas" (10⁻⁹ por base)

### Ambientes Caóticos (Baja Estabilidad 0.0-0.2)
- ⬆️ Alta mutación domina (objetivo: 0.15)
- 🎲 Exploración de nuevas estrategias
- 🌈 Poblaciones diversas
- 🔥 Células "Primordiales" (10⁻⁵ por base)

### Equilibrio
- ⚖️ Mutación media óptima en la mayoría de casos
- 🔄 Ciclos de exploración y explotación
- 📈 Evolución gradual de LUCA (0.20) → Moderna (0.03)

---

## 🔬 Biología Real

### Tasas de Mutación Naturales
- **LUCA (4.0 Ga):** ~10⁻⁵ a 10⁻⁴ por base
- **Bacterias modernas:** ~10⁻⁹ por base por generación
- **Virus RNA:** ~10⁻⁴ (muy alta, adaptación rápida)
- **Humanos:** ~10⁻⁸ por base por generación

### Cepas Mutadoras
- **Fenotipo mutador:** Defectos en sistemas de reparación
- **Ventaja:** Adaptación rápida a antibióticos
- **Desventaja:** Acumulación de mutaciones deletéreas

### Estrategia Evolutiva
- **Bet-hedging:** Mantener diversidad para sobrevivir cambios
- **Mutación adaptativa:** Aumentar mutación bajo estrés (controvertido)
- **Catástrofe de error:** Mutación demasiado alta → colapso poblacional

---

## 📈 Eras Evolutivas

| Era            | Tasa de Mutación | Características                        | Línea Temporal  |
| -------------- | ---------------- | -------------------------------------- | --------------- |
| **Primordial** | >0.15            | Alta exploración, reparación primitiva | 4.0-3.5 Ga      |
| **Transición** | 0.08-0.15        | Sistemas de reparación evolucionando   | 3.5-2.5 Ga      |
| **Moderna**    | <0.08            | Fidelidad optimizada                   | 2.5 Ga-presente |

---

*Basado en: Drake 1991, Eigen 1971, Poole et al. 1998, Forterre 2015, Weiss et al. 2016*
