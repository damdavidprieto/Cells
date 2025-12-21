# Sistema de Estabilidad Ambiental

**Propósito:** Rastrear caos/estabilidad ambiental para influir en evolución de tasa de mutación  
**Rango:** 0.0 (caótico) a 1.0 (estable)  
**Frecuencia de actualización:** Cada 100 frames  
**Influencia:** Presión evolutiva sobre tasas de mutación

---

## 🔬 Base Científica

### Estabilidad Ambiental y Evolución (Koonin & Martin 2005)
- **Ambientes estables:** Favorecen bajas tasas de mutación (preservar adaptaciones)
- **Ambientes caóticos:** Favorecen altas tasas de mutación (explorar estrategias)
- **Mecanismo:** Selección natural sobre la tasa de mutación misma

### Indicadores de Estabilidad
1. **Varianza poblacional:** Baja varianza = estable
2. **Distribución de recursos:** Distribución uniforme = estable
3. **Tasa de mortalidad:** Baja tasa de muerte = estable

---

## ⚙️ Implementación

### Cálculo
```javascript
// Environment.js - calculateEnvironmentalStability()
calculateEnvironmentalStability(cells, deathCount) {
    let populationStability = this.calculatePopulationStability(cells.length);
    let resourceStability = this.calculateResourceStability();
    let mortalityStability = this.calculateMortalityStability(deathCount);
    
    // Promedio ponderado (mortalidad es más importante)
    let stability = 
        (populationStability * 0.3) +
        (resourceStability * 0.2) +
        (mortalityStability * 0.5);
    
    return constrain(stability, 0, 1);
}
```

### Componentes

#### 1. Estabilidad Poblacional (30% peso)
- Calcula coeficiente de variación de población
- CV bajo = alta estabilidad
- Historial de 50 mediciones

#### 2. Estabilidad de Recursos (20% peso)
- Muestrea grids de recursos
- Varianza baja = distribución uniforme = estable
- 10 muestras aleatorias

#### 3. Estabilidad de Mortalidad (50% peso - MÁS IMPORTANTE)
- Tasa de muerte baja = alta estabilidad
- Tasa de muerte alta = estrés ambiental
- Indicador más directo de condiciones

---

## 💡 Efectos en Evolución

### Alta Estabilidad (0.8-1.0)
**Condiciones ambientales:**
- 📊 Tamaño poblacional estable
- 🌊 Distribución uniforme de recursos
- ✅ Baja tasa de mortalidad

**Presión evolutiva:**
- ⬇️ Presión hacia BAJA tasa de mutación (objetivo: 0.03)
- 🔒 Preservar adaptaciones exitosas
- 📈 Células "Modernas" dominan

### Baja Estabilidad (0.0-0.2)
**Condiciones ambientales:**
- 📉 Población fluctuante
- 🌋 Distribución parcheada de recursos
- ☠️ Alta tasa de mortalidad

**Presión evolutiva:**
- ⬆️ Presión hacia ALTA tasa de mutación (objetivo: 0.15)
- 🎲 Explorar nuevas estrategias
- 🔥 Células "Primordiales" favorecidas

### Estabilidad Media (0.4-0.6)
**Condiciones ambientales:**
- ⚖️ Fluctuaciones moderadas
- 🌊 Distribución mixta de recursos
- 📊 Mortalidad moderada

**Presión evolutiva:**
- ↔️ Selección neutral sobre tasa de mutación
- 🔄 Exploración/explotación balanceada
- 📈 Células "Transición" comunes

---

## 📊 Métricas de Estabilidad

### Monitoreo en Tiempo Real
```javascript
// Sketch.js - Loop principal
if (frameCount % 100 === 0) {
    environment.currentStability = 
        environment.calculateEnvironmentalStability(entities, deathCountThisFrame);
}
```

### Visualización
- **Mutation Rate Tracker:** Muestra correlación entre estabilidad y tasas de mutación
- **Distribución de Eras:** Proporciones Primordial/Transición/Moderna reflejan estabilidad

---

## 🧬 Dinámicas Esperadas

### Inicio Simulación (Gen 0-50)
- 🌋 **Baja estabilidad** (población estableciéndose)
- 📈 Tasas de mutación altas persisten
- 🎲 Fase de exploración

### Fase Estable (Gen 50-200)
- 📊 **Alta estabilidad** (recursos abundantes, población estable)
- ⬇️ Tasas de mutación disminuyen
- 🔒 Adaptaciones exitosas preservadas

### Agotamiento de Recursos (Gen 200+)
- 📉 **Estabilidad decreciente** (competencia aumenta)
- ⬆️ Tasas de mutación pueden aumentar de nuevo
- 🔄 Dinámicas cíclicas

---

## 🔬 Biología Real

### Variabilidad Ambiental y Tasas de Mutación

**Observaciones empíricas:**
- **Ambientes estables:** Bacterias evolucionan tasas de mutación más bajas
- **Ambientes estresantes:** Cepas mutadoras aumentan en frecuencia
- **Bet-hedging:** Algunas poblaciones mantienen alta mutación como seguro

**Ejemplos:**
- **E. coli en laboratorio:** Evoluciona tasa de mutación más baja en condiciones constantes
- **Patógenos:** Mantienen tasas de mutación más altas (presión del sistema inmune)
- **Extremófilos:** Tasas de mutación variables según estrés

### Marco Teórico
- **Drake (1991):** Tasa de mutación es rasgo evolucionable
- **Eigen (1971):** Umbral de error - balance fidelidad y adaptabilidad
- **Sniegowski et al. (2000):** Evolución de tasas de mutación en E. coli

---

## 📈 Configuración

### Constantes (Constants.js)
```javascript
ENVIRONMENTAL_STABILITY_ENABLED: true,
STABILITY_CALCULATION_INTERVAL: 100,      // Frames entre actualizaciones
STABILITY_HISTORY_LENGTH: 50,             // Muestras poblacionales a rastrear
STABILITY_PRESSURE_STRENGTH: 0.1,         // Qué tan rápido se adaptan células
STABILITY_MUTATION_PRESSURE_MIN: -0.01,   // Máx aumento por generación
STABILITY_MUTATION_PRESSURE_MAX: 0.02     // Máx disminución por generación
```

---

*Basado en: Koonin & Martin 2005, Drake 1991, Eigen 1971, Sniegowski et al. 2000*
