# 10. organelles.chemosynthetic_enzymes (Enzimas Quimiosintéticas)

**Categoría:** Rasgo Metabólico (Organelo Especializado)  
**Valor:** `true` solo en células con quimiosíntesis  
**Herencia:** Se activa al evolucionar a quimiosíntesis

---

## 🔬 Traducción Biológica

### ENZIMAS QUIMIOSINTÉTICAS
- **Qué son:** Sistemas enzimáticos que oxidan compuestos inorgánicos para obtener energía
- **Tipos principales:**
  - **Nitrogenasa:** N₂ → NH₃ (fijación de nitrógeno)
  - **Sulfuro oxidasa:** H₂S → SO₄²⁻ (oxidación de azufre)
  - **Hierro oxidasa:** Fe²⁺ → Fe³⁺ (oxidación de hierro)
  - **Hidrogenasa:** H₂ → H⁺ (oxidación de hidrógeno)

---

## ⚙️ Mecánica Actual en el Juego

### Implementación
```javascript
// Se activa al evolucionar a quimiosíntesis
if (this.dna.metabolismType === 'luca' && random(1) < 0.01) {
    if (random(1) >= 0.5) {
        childDNA.metabolismType = 'chemosynthesis';
        childDNA.organelles.chemosynthetic_enzymes = true; // ← Activación
        childDNA.color = [150, 200, 100]; // Verde-amarillo
    }
}

// Permite consumir nitrógeno
if (this.dna.metabolismType === 'chemosynthesis') {
    let nitrogenNeeded = 0.8 * this.dna.metabolicEfficiency;
    nitrogenConsumed = environment.consumeNitrogen(this.pos.x, this.pos.y, nitrogenNeeded);
}

// Visualización
if (this.dna.organelles.chemosynthetic_enzymes) {
    fill(200, 220, 100, 200); // Verde-amarillo
    for (let i = 0; i < 2; i++) {
        let angle = (TWO_PI / 2) * i + PI / 2 + frameCount * 0.015;
        let radius = this.dna.size * 0.25;
        let ox = this.pos.x + cos(angle) * radius;
        let oy = this.pos.y + sin(angle) * radius;
        circle(ox, oy, 3); // 2 puntos verde-amarillos
    }
}
```

### Efectos
- ✅ Vinculado a metabolismo de quimiosíntesis
- ✅ Permite consumir nitrógeno como recurso
- ✅ Eficiente en sedimento (1.0× costo)
- ✅ Penalización fuera de sedimento (+30% costo)
- ❌ **NO produce subproductos** (O₂, NO₃⁻)

---

## 💡 Sentido en el Juego

### Función Actual
- 🎨 Identificación visual de quimiosintéticos
- 🔗 Vinculado correctamente al metabolismo
- 🌊 Nicho ecológico claro (sedimento)
- ⚡ Metabolismo más eficiente

### Potencial No Implementado
- 💨 Producción de O₂ (subproducto de nitrificación)
- 🧪 Producción de NO₃⁻ (nitrato)
- 🔄 Afectar ciclo del nitrógeno
- 🌱 Simbiosis con otras células

---

## 📊 Evaluación: **9/10**

### ✅ Fortalezas
> [!TIP]
> **Muy bien implementado**
> 
> - ✅ Nicho ecológico único (sedimento)
> - ✅ Consume recurso específico (nitrógeno)
> - ✅ Trade-off claro (eficiente en sedimento, penalizado fuera)
> - ✅ Integración perfecta con ambiente

### ❌ Debilidades Menores
- Podría producir oxígeno como subproducto

### 🔧 Mejoras Propuestas

#### 1. Producción de O₂ (Subproducto)
```javascript
// En update(), si tiene enzimas quimiosintéticas
if (this.dna.organelles.chemosynthetic_enzymes && this.isInSediment) {
    // Nitrificación produce O₂
    // NH₃ + O₂ → NO₂⁻ + H₂O (Nitrosomonas)
    // NO₂⁻ + O₂ → NO₃⁻ (Nitrobacter)
    let o2Production = 0.05;
    environment.addOxygen(this.pos.x, this.pos.y, o2Production);
}
```

#### 2. Tipos de Enzimas Quimiosintéticas
```javascript
// En DNA
chemosynthesisType: random(['nitrification', 'sulfur_oxidation', 'iron_oxidation'])

// Cada tipo consume recurso diferente
if (chemosynthesisType === 'nitrification') {
    nitrogenConsumed = environment.consumeNitrogen(...);
} else if (chemosynthesisType === 'sulfur_oxidation') {
    sulfurConsumed = environment.consumeSulfur(...);
}
```

#### 3. Eficiencia Variable
```javascript
// En DNA
enzymeEfficiency: random(0.7, 1.3), // Calidad de las enzimas

// Afecta conversión de nitrógeno a energía
let energyFromNitrogen = nitrogenConsumed * this.dna.enzymeEfficiency * 2;
this.energy += energyFromNitrogen;
```

---

## 🧬 Evolución Esperada

Con mejoras implementadas:

### Sedimento Profundo
- 💚 Quimiosintéticos dominan
- 💨 Producción de O₂ local
- 🔄 Ciclo del nitrógeno activo
- 🌱 Posible simbiosis con fermentadores

### Zona Media
- 📉 Quimiosintéticos sufren penalización
- 🌊 Migración hacia sedimento
- ⚖️ Competencia con LUCA

---

## 🔬 Biología Real

### Organismos Quimiosintéticos

#### Nitrificantes
- **Nitrosomonas:** NH₃ → NO₂⁻
- **Nitrobacter:** NO₂⁻ → NO₃⁻
- **Ambiente:** Suelos, sedimentos, aguas residuales

#### Oxidantes de Azufre
- **Thiobacillus:** H₂S → SO₄²⁻
- **Beggiatoa:** Filamentos en sedimentos
- **Ambiente:** Fuentes hidrotermales, sedimentos marinos

#### Oxidantes de Hierro
- **Acidithiobacillus ferrooxidans:** Fe²⁺ → Fe³⁺
- **Ambiente:** Drenajes ácidos de minas

#### Metanógenos
- **Methanococcus:** H₂ + CO₂ → CH₄
- **Ambiente:** Sedimentos anóxicos, tracto digestivo

### Importancia Ecológica
- **Ciclo del nitrógeno:** Nitrificación esencial
- **Ciclo del azufre:** Oxidación de H₂S
- **Fuentes hidrotermales:** Base de ecosistemas profundos
- **Producción primaria:** Sin luz solar

### Descubrimiento
- **1977:** Fuentes hidrotermales del Pacífico
- **Revolucionó:** Concepto de vida sin fotosíntesis
- **Ecosistemas completos:** Basados en quimiosíntesis
