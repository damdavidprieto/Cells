# 3. color (Color Celular)

**Categoría:** Rasgo Visual  
**Rango:** RGB [0-255, 0-255, 0-255]  
**Valor Inicial:** [100-200, 200-255, 200-255]  
**Mutación:** ±20 × mutationRate × 10 por canal

---

## 🔬 Traducción Biológica

### PIGMENTOS CELULARES / CROMÓFOROS
- **Qué son:** Proteínas o moléculas que absorben/reflejan luz
- **Función:** Fotosíntesis, fotoprotección, señalización
- **Ejemplos reales:**
  - **Clorofila** (verde): Absorbe luz roja y azul, refleja verde
  - **Bacteriorrodopsina** (púrpura): Bombea protones usando luz
  - **Carotenoides** (naranja): Protección contra radicales libres
  - **Ficobilinas** (azul/rojo): Pigmentos accesorios en cianobacterias

---

## ⚙️ Mecánica Actual en el Juego

### Implementación
```javascript
// En show(), el color base se sobrescribe por metabolismo
if (this.dna.metabolismType === 'luca') {
    baseColor = [200, 200, 220]; // Gris/blanco
} else if (this.dna.metabolismType === 'fermentation') {
    baseColor = [180, 100, 150]; // Púrpura
} else if (this.dna.metabolismType === 'chemosynthesis') {
    baseColor = [150, 200, 100]; // Verde-amarillo
}

// Modulado por salud y eficiencia
fill(
    baseColor[0] * healthFactor * efficiencyHue,
    baseColor[1] * healthFactor,
    baseColor[2] * healthFactor,
    150
);
```

### Efectos
- ✅ Identificación visual del tipo metabólico
- ✅ Modulado por salud (células enfermas más oscuras)
- ✅ Modulado por eficiencia metabólica
- ❌ **El color del DNA es ignorado** (sobrescrito por metabolismo)

---

## 💡 Sentido en el Juego

### Función Actual
- 🎨 Solo identificación visual
- 📊 Indicador de salud (brillo)
- 🔬 Indicador de eficiencia

### Potencial No Implementado
- ☀️ Absorción diferencial de luz según color
- 🛡️ Protección contra radiación
- 🎯 Camuflaje en diferentes zonas

---

## 📊 Evaluación: **4/10**

### ✅ Fortalezas
- Visualización clara de metabolismo
- Feedback visual de salud

### ❌ Debilidades
> [!NOTE]
> **El color está fijado por metabolismo**
> 
> El rasgo `color` en el DNA es ignorado. Podría ser más dinámico y tener función adaptativa.

### 🔧 Mejoras Propuestas

#### 1. Absorción de Luz por Color
```javascript
// En eat(), al consumir luz
let lightAbsorption = 1.0;

// Células oscuras absorben más luz
let brightness = (this.dna.color[0] + this.dna.color[1] + this.dna.color[2]) / 3;
lightAbsorption = map(brightness, 0, 255, 1.5, 0.5);

energyConsumed = environment.consumeLight(this.pos.x, this.pos.y, energyNeeded * lightAbsorption);
```

#### 2. Color Independiente del Metabolismo
```javascript
// Permitir variación de color dentro de cada tipo metabólico
let baseHue = metabolismType === 'luca' ? 200 : 
              metabolismType === 'fermentation' ? 280 : 180;

let finalColor = [
    constrain(baseHue + this.dna.color[0] - 128, 0, 255),
    constrain(baseHue + this.dna.color[1] - 128, 0, 255),
    constrain(baseHue + this.dna.color[2] - 128, 0, 255)
];
```

#### 3. Fotoprotección
```javascript
// En update(), daño por luz en superficie
if (j < this.rows * 0.2) { // Zona superficial
    let lightDamage = environment.lightGrid[i][j] * 0.001;
    
    // Células oscuras resisten mejor
    let protection = 1.0 - (brightness / 255) * 0.5;
    this.energy -= lightDamage * protection;
}
```

---

## 🧬 Evolución Esperada

Con funcionalidad implementada:
- **Superficie:** Células oscuras (absorben más luz, resisten radiación)
- **Profundidad:** Células claras (no necesitan pigmentos)
- **Fermentación:** Colores púrpuras (bacteriorrodopsina-like)
- **Quimiosíntesis:** Colores verdosos (enzimas sulfuro-oxidantes)

---

## 🔬 Biología Real

### Pigmentos por Nicho
- **Cianobacterias superficiales:** Verde brillante (clorofila + carotenoides)
- **Bacterias púrpuras:** Púrpura (bacterioclorofila)
- **Bacterias verdes del azufre:** Verde oscuro (clorofila + azufre)
- **Arqueas halófilas:** Rosa/rojo (bacteriorrodopsina)
