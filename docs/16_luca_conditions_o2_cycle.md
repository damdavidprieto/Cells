# Plan: Condiciones LUCA y Ciclo Metabólico de O₂

## Objetivo
Validar que las condiciones iniciales reproduzcan el ambiente de LUCA (4.0-3.5 Ga) y añadir rigor científico al manejo de O₂ considerando productos metabólicos.

---

## Parte 1: Validación de Condiciones Iniciales LUCA

### 🔬 Condiciones Ambientales de LUCA (Weiss et al. 2016)

**Habitat probable:**
- Vents hidrotermales alcalinos
- Temperatura: 50-80°C
- pH: 9-11 (alcalino)
- Presión: 100-200 atm (profundidad oceánica)

**Composición atmosférica (4.0 Ga):**
- CO₂: 10-100× PAL (Present Atmospheric Level)
- N₂: 0.5-1.0× PAL
- CH₄: 100-1000 ppm
- **O₂: <10⁻⁵ PAL** (trazas por fotólisis UV)
- H₂: 0.1-1% (vents hidrotermales)

**Océano primordial:**
- **Anóxico** (sin oxígeno libre)
- Rico en Fe²⁺ (hierro reducido)
- pH: 5.5-7.0 (ligeramente ácido)
- Temperatura superficial: 50-70°C

---

### ✅ Estado Actual vs Condiciones LUCA

| Parámetro                 | LUCA Real                | Simulación Actual      | ¿Correcto?    |
| ------------------------- | ------------------------ | ---------------------- | ------------- |
| **O₂ atmosférico**        | <10⁻⁵ PAL                | Trazas (30-80 inicial) | ⚠️ **REVISAR** |
| **Distribución O₂**       | Irregular (fotólisis UV) | Parcheada aleatoria    | ✅ Correcto    |
| **Regeneración O₂**       | No (pre-fotosíntesis)    | No                     | ✅ Correcto    |
| **Toxicidad O₂**          | Sí (anaerobios)          | Sí (fermentación >70)  | ✅ Correcto    |
| **Metabolismo dominante** | Anaerobio                | LUCA anaerobio         | ✅ Correcto    |

---

### ⚠️ Ajustes Propuestos

#### 1. Reducir O₂ Inicial (MÁS REALISTA)

**Problema actual:**
```javascript
// Environment.js - ACTUAL
this.oxygenGrid[i][j] = random(30, 80) * noise(i * 0.1, j * 0.1);
```
- Niveles 30-80 son demasiado altos para era pre-fotosíntesis
- LUCA vivió en ambiente casi anóxico

**Propuesta:**
```javascript
// Environment.js - PROPUESTO
this.oxygenGrid[i][j] = random(5, 20) * noise(i * 0.1, j * 0.1);
```
- Niveles 5-20 representan trazas de O₂ por fotólisis UV
- Más realista para 4.0-3.5 Ga
- Aún permite respiración mínima

**Justificación científica:**
- Fotólisis UV: 2H₂O + UV → 2H₂ + O₂ (muy limitada)
- O₂ se consume rápidamente por oxidación de Fe²⁺, S²⁻
- Resultado: <1% de niveles modernos

---

#### 2. Gradiente de O₂ por Profundidad (OPCIONAL)

**Concepto:**
- Superficie: Mayor fotólisis UV → O₂ ligeramente mayor
- Profundidad: Consumo por reacciones químicas → O₂ mínimo

**Implementación:**
```javascript
// Environment.js - initGrids()
let depthRatio = j / this.rows;
let surfaceBonus = exp(-3 * depthRatio);  // Decae con profundidad

this.oxygenGrid[i][j] = (5 + 15 * surfaceBonus) * noise(i * 0.1, j * 0.1);
// Superficie: 5-20
// Profundidad: 5-8
```

---

## Parte 2: Ciclo Metabólico de O₂ y Productos

### 🔬 Bioquímica Real del O₂

#### LUCA (Metabolismo Primitivo)
**Respiración mínima (sin cadena de transporte de electrones completa):**
```
Glucosa + O₂ → CO₂ + H₂O + energía (limitada)
```
- Usa O₂ para oxidación parcial
- Genera CO₂ y H₂O como subproductos
- Eficiencia baja (sin mitocondrias)

#### Fermentación (Anaeróbica)
**Fermentación láctica:**
```
Glucosa → 2 Lactato + 2 ATP
```
- **NO usa O₂** (anaeróbica)
- Genera lactato, etanol, o acetato
- O₂ es TÓXICO (genera ROS)

**Fermentación alcohólica:**
```
Glucosa → 2 Etanol + 2 CO₂ + 2 ATP
```
- Genera CO₂ sin usar O₂

#### Quimiosíntesis (Basada en compuestos reducidos)
**Oxidación de H₂S (sin O₂):**
```
H₂S + CO₂ → CH₂O + S + H₂O
```
- Usa H₂S o H₂ como donador de electrones
- Genera S (azufre) o SO₄²⁻
- **NO requiere O₂**

**Oxidación de NH₃ (con O₂ - moderna):**
```
NH₃ + O₂ → NO₂⁻ + H₂O + energía
```
- Solo en presencia de O₂ (post-Gran Oxidación)
- Genera nitritos/nitratos

---

### 💡 Propuesta: Sistema de Productos Metabólicos

#### Nuevo Grid: CO₂ (Dióxido de Carbono)

**Fuente:**
- Respiración de LUCA (usa O₂)
- Fermentación (no usa O₂, pero genera CO₂)
- Actividad volcánica (constante)

**Implementación:**
```javascript
// Environment.js
this.co2Grid = [];  // Nuevo grid

// Inicialización (alta concentración primordial)
this.co2Grid[i][j] = random(80, 100);  // Atmósfera rica en CO₂

// Producción por metabolismo
produceCO2(x, y, amount) {
    let col = floor(x / this.resolution);
    let row = floor(y / this.resolution);
    this.co2Grid[col][row] += amount;
    this.co2Grid[col][row] = min(this.co2Grid[col][row], 150);  // Cap
}

// Consumo (futuro: fotosíntesis)
consumeCO2(x, y, amount) {
    // Para cuando se implemente fotosíntesis
}
```

---

#### Actualización de MetabolicCosts

**LUCA (usa O₂ mínimamente):**
```javascript
// MetabolicCosts.js
if (metabolismType === 'luca') {
    let o2Cost = 0.02 * efficiency;
    let o2Consumed = entity.oxygen > o2Cost ? o2Cost : 0;
    
    // Producir CO₂ proporcional a O₂ consumido
    let co2Produced = o2Consumed * 1.0;  // Ratio 1:1
    environment.produceCO2(entity.pos.x, entity.pos.y, co2Produced);
    
    return {
        energy: 2.0 * efficiency,
        oxygen: o2Cost,
        nitrogen: 0,
        co2Produced: co2Produced  // Nuevo
    };
}
```

**Fermentación (NO usa O₂, pero genera CO₂):**
```javascript
if (metabolismType === 'fermentation') {
    // Fermentación alcohólica: Glucosa → Etanol + CO₂
    let co2Produced = 0.5 * efficiency;  // Genera CO₂ sin usar O₂
    environment.produceCO2(entity.pos.x, entity.pos.y, co2Produced);
    
    return {
        energy: 1.5 * efficiency,
        oxygen: 0.02 * efficiency,  // Respiración mínima (tóxico si >70)
        nitrogen: 0,
        co2Produced: co2Produced
    };
}
```

**Quimiosíntesis (NO usa O₂ en era primordial):**
```javascript
if (metabolismType === 'chemosynthesis') {
    // Usa H₂S o H₂, no O₂
    // Genera S (azufre) como subproducto
    
    return {
        energy: 1.0 * efficiency,
        oxygen: 0,  // NO usa O₂ en era anóxica
        nitrogen: 0.5 * efficiency,  // Usa compuestos nitrogenados
        sulfurProduced: 0.3  // Nuevo: genera azufre
    };
}
```

---

### 🌍 Efectos del CO₂ en el Ecosistema

#### 1. Acumulación de CO₂
- Aumenta con respiración y fermentación
- Simula atmósfera primordial rica en CO₂

#### 2. Preparación para Fotosíntesis (Futuro)
```javascript
// Futuro: Fotosíntesis oxigénica
// CO₂ + H₂O + Luz → Glucosa + O₂
if (metabolismType === 'photosynthesis') {
    let co2Consumed = environment.consumeCO2(x, y, 1.0);
    let o2Produced = co2Consumed * 1.0;  // Ratio 1:1
    environment.produceOxygen(x, y, o2Produced);
}
```

#### 3. Efecto Invernadero (Visual/Informativo)
- Alto CO₂ → Mayor temperatura (no afecta mecánicas aún)
- Indicador visual de condiciones primordiales

---

## Parte 3: Validación Científica

### ✅ Checklist de Rigor Científico

**Condiciones Iniciales:**
- [ ] O₂ inicial reducido a 5-20 (trazas)
- [ ] CO₂ inicial alto 80-100 (atmósfera reductora)
- [ ] Distribución parcheada de O₂ (fotólisis UV)
- [ ] Sin regeneración de O₂ (pre-fotosíntesis)

**Metabolismo y Productos:**
- [ ] LUCA: O₂ → CO₂ + H₂O (respiración primitiva)
- [ ] Fermentación: Glucosa → CO₂ + Etanol (sin O₂)
- [ ] Quimiosíntesis: H₂S/H₂ → S (sin O₂)
- [ ] Toxicidad O₂ para fermentación (>70)

**Ciclo de Carbono:**
- [ ] CO₂ se acumula (respiración + fermentación)
- [ ] CO₂ no se consume (pre-fotosíntesis)
- [ ] Preparado para fotosíntesis futura

---

## Parte 4: Implementación Propuesta

### Archivos a Modificar

#### 1. `Environment.js`
- Reducir O₂ inicial: `random(5, 20)`
- Añadir `co2Grid` con inicialización alta
- Añadir `produceCO2(x, y, amount)`
- (Opcional) Gradiente de O₂ por profundidad

#### 2. `MetabolicCosts.js`
- LUCA: Producir CO₂ al consumir O₂
- Fermentación: Producir CO₂ sin consumir O₂
- Quimiosíntesis: No usar O₂, generar S

#### 3. `Constants.js`
- `INITIAL_OXYGEN: 10` (reducido de 100)
- `INITIAL_CO2: 90` (nuevo)
- `OXYGEN_INITIAL_MIN: 5`
- `OXYGEN_INITIAL_MAX: 20`
- `CO2_INITIAL_MIN: 80`
- `CO2_INITIAL_MAX: 100`

#### 4. Visualización (Opcional)
- Mostrar CO₂ en panel de recursos
- Color rojo/naranja para CO₂ en grid

---

## Parte 5: Extensiones Futuras

### Fotosíntesis Oxigénica
```javascript
// Nuevo metabolismo: photosynthesis
// CO₂ + H₂O + Luz → Glucosa + O₂
// Genera O₂, consume CO₂
// Desencadena Gran Oxidación (2.4 Ga)
```

### Respiración Aeróbica
```javascript
// Nuevo metabolismo: aerobic_respiration
// Glucosa + O₂ → CO₂ + H₂O + ATP (mucha energía)
// Requiere O₂ alto (>50)
// Eficiencia 10x mayor que fermentación
```

### Ciclo del Azufre
```javascript
// Quimiosíntesis genera S
// S se acumula en sedimento
// Futuro: oxidación de S → SO₄²⁻
```

---

## Referencias Científicas

- **Weiss et al. (2016)** - The physiology and habitat of LUCA
- **Kasting & Siefert (2002)** - Life and the evolution of Earth's atmosphere
- **Canfield (2005)** - The early history of atmospheric oxygen
- **Martin & Russell (2007)** - On the origin of biochemistry at an alkaline hydrothermal vent
- **Lane & Martin (2012)** - The origin of membrane bioenergetics

---

*Plan para condiciones LUCA científicamente rigurosas y ciclo metabólico completo de O₂*
