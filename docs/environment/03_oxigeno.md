# Oxígeno (Oxygen) - Recurso Limitado

**Tipo:** Recurso Secundario (Respiración)  
**Fuente:** Fotólisis UV (pre-fotosíntesis)  
**Distribución:** Parcheada, aleatoria  
**Regeneración:** Ninguna (finito)  
**Rol Biológico:** Respiración mínima, tóxico para anaerobios

---

## 🔬 Base Científica

### Océano Primordial Pre-Fotosíntesis (4.0-2.4 Ga)

**Características:**
- **Pre-Gran Oxidación:** Antes del evento de 2.4 Ga
- **Oxígeno <1%:** Menos del 1% de niveles atmosféricos modernos
- **Fuente:** Fotólisis UV de H₂O (no biológica)
- **Distribución:** Irregular, parcheada
- **Toxicidad:** Especies reactivas de oxígeno (ROS) dañan células anaeróbicas

**Contexto histórico:**
- 4.0-2.4 Ga: Atmósfera reductora (CH₄, NH₃, H₂)
- 2.4 Ga: Gran Oxidación (cianobacterias)
- 2.0-1.5 Ga: Oxigenación de océanos profundos

---

## ⚙️ Implementación

### Código
```javascript
// Environment.js - initGrids()
for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
        // Distribución aleatoria, parcheada
        this.oxygenGrid[i][j] = random(30, 80) * noise(i * 0.1, j * 0.1);
    }
}

// SIN regeneración - recurso finito
update() {
    // NO hay regeneración de oxígeno
    // Se agota permanentemente cuando se consume
}

// Consumo
consumeOxygen(x, y, amount) {
    let col = floor(x / this.resolution);
    let row = floor(y / this.resolution);
    
    let available = this.oxygenGrid[col][row];
    let consumed = min(available, amount);
    this.oxygenGrid[col][row] -= consumed;
    
    return consumed;
}
```

### Distribución
```javascript
Inicial:  30-80 unidades (aleatorio)
Parches:  Zonas de 50-80 (alto)
          Zonas de 30-50 (medio)
          Zonas de <30 (bajo)
```

---

## 💡 Características del Recurso

### Ventajas
- 📊 **Distribución inicial:** Suficiente para fase temprana
- 🎲 **Variabilidad:** Crea nichos espaciales
- ⚖️ **Balance:** No crítico pero útil

### Limitaciones
- ⚠️ **Finito:** NO se regenera
- ⏳ **Se agota:** Eventualmente desaparece
- ☠️ **Tóxico:** Para células de fermentación (>70)
- 📉 **Declive inevitable:** Población debe adaptarse

---

## 🌊 Toxicidad por Oxígeno

### Fermentación + Alto Oxígeno
```javascript
// MetabolicCosts.js - getEnvironmentalStress()
if (entity.dna.metabolismType === 'fermentation') {
    let oxygenLevel = environment.oxygenGrid[x][y];
    if (oxygenLevel > 70) {
        stress = 1.5;  // +50% costo metabólico
    }
}
```

**Mecanismo biológico:**
- **ROS (Reactive Oxygen Species):** O₂⁻, H₂O₂, OH·
- **Daño celular:** Lípidos, proteínas, ADN
- **Sin defensa:** Fermentadores carecen de catalasa/superóxido dismutasa
- **Resultado:** Mayor costo energético para reparar daño

---

## 🧬 Efectos Evolutivos

### Fase Temprana (Gen 0-100)
- 🌊 **Oxígeno abundante:** 30-80 en todas partes
- ✅ **Sin presión:** Todas las células sobreviven
- 📊 **Distribución uniforme:** Fermentación en cualquier lugar

### Fase Media (Gen 100-300)
- 📉 **Oxígeno declinando:** Consumo > regeneración (0)
- ⚠️ **Parches agotados:** Zonas con <10 oxígeno
- 🟣 **Fermentación migra:** Evita zonas de alto oxígeno residual

### Fase Tardía (Gen 300+)
- 💀 **Oxígeno casi agotado:** <5 en mayoría de zonas
- ✅ **Ventaja fermentación:** Sin toxicidad
- 🌍 **Nuevo equilibrio:** Población adaptada a anoxia

---

## 🔬 Biología Real

### Toxicidad del Oxígeno

**Organismos anaerobios:**
- **Anaerobios obligados:** Mueren en presencia de O₂
  - Clostridium (gangrena)
  - Metanógenos (arqueas)
  
- **Anaerobios aerotolerantes:** Sobreviven pero no usan O₂
  - Lactobacillus (fermentación láctica)
  
- **Anaerobios facultativos:** Cambian según O₂
  - E. coli (fermentación o respiración)

**Mecanismos de daño:**
```
O₂ + e⁻ → O₂⁻  (superóxido)
O₂⁻ + 2H⁺ → H₂O₂  (peróxido de hidrógeno)
H₂O₂ + Fe²⁺ → OH· + OH⁻  (radical hidroxilo)
```

**Defensas (ausentes en anaerobios):**
- Superóxido dismutasa (SOD)
- Catalasa
- Peroxidasas

---

## 📊 Consumo por Metabolismo

### LUCA
```javascript
oxygenCost = 0.02 × efficiency
Consumo típico: 0.5 unidades/frame
```

### Fermentación
```javascript
oxygenCost = 0.02 × efficiency
Consumo típico: 0.3 unidades/frame
Nota: Sufre toxicidad si nivel >70
```

### Quimiosíntesis
```javascript
oxygenCost = 0.02 × efficiency
Consumo típico: 0.3 unidades/frame
```

**Observación:** Consumo bajo para todos (respiración mínima)

---

## 🎮 Implicaciones en el Juego

### Dinámica Temporal

#### Fase 1: Abundancia (Gen 0-100)
- 🌊 Oxígeno disponible en todas partes
- 🟣 Fermentación evita zonas >70
- ✅ Sin crisis de oxígeno

#### Fase 2: Declive (Gen 100-300)
- 📉 Oxígeno agotándose
- 🎯 Fermentación se expande (menos toxicidad)
- ⚠️ Competencia por otros recursos

#### Fase 3: Anoxia (Gen 300+)
- 💀 Oxígeno casi inexistente
- 🌍 Mundo anaeróbico (realista para era primordial)
- ✅ Fermentación y quimiosíntesis dominan

### Estrategias Adaptativas

**Para Fermentación:**
1. **Fase temprana:** Evitar zonas >70 oxígeno
2. **Fase media:** Expandirse a zonas agotadas
3. **Fase tardía:** Dominar (sin toxicidad)

**Para Quimiosíntesis:**
- Indiferente al oxígeno (sedimento tiene niveles variables)
- Ventaja en fase tardía (no depende de oxígeno)

---

## 📈 Interacción con Otros Recursos

### Oxígeno + Luz
- **Superficie:** Luz alta + Oxígeno variable
- **Profundidad:** Luz baja + Oxígeno variable
- **Sin correlación directa**

### Oxígeno + Nitrógeno
- **Distribución independiente**
- Oxígeno: Aleatorio
- Nitrógeno: Concentrado en sedimento

### Oxígeno + Fósforo
- **Ambos escasos eventualmente**
- Oxígeno: Se agota por consumo
- Fósforo: Regeneración muy lenta

---

## 🌍 Comparación Histórica

| Era            | Oxígeno Atmosférico | Océano                 | Vida Dominante          |
| -------------- | ------------------- | ---------------------- | ----------------------- |
| **4.0-2.4 Ga** | <1%                 | Anóxico                | Anaerobios (simulación) |
| **2.4-2.0 Ga** | 1-10%               | Parcialmente oxigenado | Transición              |
| **2.0-0.5 Ga** | 10-20%              | Oxigenado              | Aerobios emergen        |
| **0.5 Ga-hoy** | 21%                 | Oxigenado              | Aerobios dominan        |

**Simulación representa:** Era 4.0-2.4 Ga (pre-fotosíntesis)

---

## ⚠️ Notas de Diseño

### ¿Por qué oxígeno finito?

1. **Realismo histórico:** Pre-fotosíntesis = sin producción de O₂
2. **Presión evolutiva:** Fuerza adaptación a anoxia
3. **Transición temporal:** Simula cambio de eras
4. **Ventaja fermentación:** Recompensa especialización anaeróbica

### Posibles Extensiones Futuras

- **Fotosíntesis:** Células que produzcan O₂
- **Respiración aeróbica:** Metabolismo que use O₂ eficientemente
- **Gradiente de O₂:** Oxigenación desde superficie

---

*Basado en: Kasting & Siefert 2002 (Early atmosphere), Canfield 2005 (Oxygen history), Imlay 2013 (Oxygen toxicity)*
