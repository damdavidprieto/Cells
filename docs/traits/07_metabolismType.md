# 7. metabolismType (Tipo de Metabolismo)

**Categoría:** Rasgo Metabólico  
**Valores:** 'luca', 'fermentation', 'chemosynthesis'  
**Herencia:** Del padre (1% divergencia desde LUCA, 0.001% transición entre especializados)

---

## 🔬 Traducción Biológica

### VÍAS METABÓLICAS COMPLETAS

#### LUCA (Last Universal Common Ancestor)
- **Qué es:** Ancestro común de toda la vida
- **Metabolismo:** Quimiosmosis primitiva, probablemente en fuentes hidrotermales
- **Características:** Ineficiente, generalista, puede divergir

#### Fermentación
- **Qué es:** Glucólisis anaeróbica
- **Proceso:** Glucosa → Piruvato → Lactato/Etanol + 2 ATP
- **Ejemplos:** Levaduras, bacterias lácticas, músculos sin oxígeno

#### Quimiosíntesis
- **Qué es:** Obtención de energía de compuestos inorgánicos
- **Procesos:**
  - Oxidación de H₂S (bacterias del azufre)
  - Oxidación de NH₃ (bacterias nitrificantes)
  - Oxidación de Fe²⁺ (bacterias del hierro)
  - Oxidación de H₂ (metanógenos)

---

## ⚙️ Mecánica Actual en el Juego

### Tabla Comparativa

| Metabolismo        | Multiplicador Costo    | Recursos            | Estrés Ambiental      | Nicho          |
| ------------------ | ---------------------- | ------------------- | --------------------- | -------------- |
| **LUCA**           | 2.0× (muy ineficiente) | Energía × 2         | Ninguno               | Generalista    |
| **Fermentación**   | 1.5×                   | Energía × 2         | +50% en alto O₂ (>70) | Zonas anóxicas |
| **Quimiosíntesis** | 1.0× (eficiente)       | Energía + Nitrógeno | +30% fuera sedimento  | Sedimento      |

### Implementación
```javascript
// En update(), costos específicos por metabolismo
if (this.dna.metabolismType === 'luca') {
    metabolismMultiplier = 2.0;
    this.energy -= energyCost * 2;
} else if (this.dna.metabolismType === 'fermentation') {
    metabolismMultiplier = 1.5;
    if (oxygenLevel > 70) environmentalStress = 1.5; // Toxicidad O₂
    this.energy -= energyCost * 2;
} else if (this.dna.metabolismType === 'chemosynthesis') {
    metabolismMultiplier = 1.0;
    if (!environment.isInSediment(this.pos.y)) environmentalStress = 1.3;
    this.energy -= energyCost;
    this.nitrogen -= nitrogenCost;
}

// Divergencia desde LUCA (1% chance)
if (this.dna.metabolismType === 'luca' && random(1) < 0.01) {
    if (random(1) < 0.5) {
        childDNA.metabolismType = 'fermentation';
        childDNA.organelles.hydrogenosomes = true;
    } else {
        childDNA.metabolismType = 'chemosynthesis';
        childDNA.organelles.chemosynthetic_enzymes = true;
    }
}

// Transición entre especializados (0.001% chance, 80% mortalidad)
if (this.dna.metabolismType !== 'luca' && random(1) < 0.00001) {
    if (random(1) < 0.8) return null; // Muerte
    // Cambio de metabolismo
}
```

---

## 💡 Sentido en el Juego

### LUCA
- **Ventajas:**
  - 🌍 Puede vivir en cualquier zona
  - 🧬 Puede divergir a especializaciones
  - 🎲 Flexibilidad evolutiva
- **Desventajas:**
  - ⚡ Muy ineficiente (2× costo)
  - 📉 Superado por especializados en sus nichos

### Fermentación
- **Ventajas:**
  - 🌑 Domina zonas sin oxígeno
  - 💜 Hidrogenosomas especializados
  - 📦 Solo necesita energía (no nitrógeno)
- **Desventajas:**
  - ☠️ Toxicidad de oxígeno (+50% costo en O₂ >70)
  - ⚡ Ineficiente (1.5× costo)
  - 🎯 Nicho limitado

### Quimiosíntesis
- **Ventajas:**
  - ✅ Muy eficiente (1.0× costo)
  - 🌊 Domina sedimento (nitrógeno abundante)
  - 💚 Enzimas especializadas
- **Desventajas:**
  - 🔵 Requiere nitrógeno (recurso adicional)
  - 📍 Penalización fuera de sedimento (+30% costo)
  - 🎯 Nicho específico

---

## 📊 Evaluación: **10/10**

### ✅ Fortalezas
> [!TIP]
> **MECÁNICA ESTRELLA - DISEÑO PERFECTO**
> 
> - ✅ Nichos ecológicos claros y distintos
> - ✅ Trade-offs bien balanceados
> - ✅ Divergencia evolutiva realista
> - ✅ Transiciones raras y costosas
> - ✅ Presión ambiental específica
> - ✅ Integración con organelos

### Sin Debilidades Significativas
Esta es la mecánica mejor diseñada del juego.

---

## 🧬 Evolución Esperada

### Distribución Espacial
```
Superficie (Alto O₂, Alta Luz)
├─ LUCA (pocos, ineficientes)
└─ Fermentadores (sufren toxicidad)

Zona Media (O₂ Medio, Luz Media)
├─ LUCA (mayoría, generalistas)
├─ Fermentadores (en bolsas anóxicas)
└─ Quimiosintéticos (migración)

Sedimento (Bajo O₂, Alto N₂)
├─ Quimiosintéticos (dominan)
├─ Fermentadores (prosperan)
└─ LUCA (pocos, superados)
```

### Dinámica Temporal
1. **Inicio:** 100% LUCA
2. **Divergencia:** LUCA → Fermentadores + Quimiosintéticos
3. **Especialización:** Cada tipo domina su nicho
4. **Equilibrio:** Coexistencia estable

---

## 🔬 Biología Real

### Metabolismos Primitivos
- **LUCA:** Probablemente quimioautótrofo en fuentes hidrotermales
- **Fermentación:** Uno de los metabolismos más antiguos
- **Quimiosíntesis:** Descubierta en fuentes hidrotermales (1977)

### Nichos Modernos
- **Fermentadores:** Intestinos, sedimentos, aguas estancadas
- **Quimiosintéticos:** Fuentes hidrotermales, sedimentos profundos, cuevas

### Ejemplos Reales
- **Methanococcus jannaschii:** Quimiosintético, fuentes hidrotermales
- **Clostridium:** Fermentador anaeróbico obligado
- **Thiobacillus:** Oxida azufre, quimiosintético
