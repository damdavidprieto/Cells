# 02. Tipo Metabólico (Metabolism Type)

**Categoría:** Identificador de Especie  
**Valores:** LUCA, Fermentación, Quimiosíntesis  
**Inicial:** LUCA (100%)  
**Mutación:** Divergencia (1% probabilidad desde LUCA)

---

## 🔬 Traducción Biológica

### RUTAS METABÓLICAS
Tres estrategias metabólicas distintas representando la evolución celular temprana:

#### 1. **LUCA** (Último Ancestro Común Universal)
- **Equivalente biológico:** Quimiolitoautotrofía primitiva
- **Fuente de energía:** Gradientes químicos (H₂, CO₂)
- **Eficiencia:** Muy baja (2-4 ATP por sustrato)
- **Multiplicador de costo:** 2.0x (más ineficiente)
- **Organelos:** Solo ribosomas
- **Color:** Gris (200, 200, 220)

#### 2. **Fermentación** (Anaeróbica)
- **Equivalente biológico:** Glucólisis + fermentación
- **Fuente de energía:** Compuestos orgánicos (glucosa)
- **Eficiencia:** Baja-media (4-6 ATP por glucosa)
- **Multiplicador de costo:** 1.5x
- **Organelos:** Ribosomas + Hidrogenosomas
- **Color:** Púrpura (180, 100, 150)
- **Estrés:** +50% costo en alto oxígeno (>70)

#### 3. **Quimiosíntesis** (Energía química)
- **Equivalente biológico:** Quimiolitoautotrofía (moderna)
- **Fuente de energía:** Compuestos químicos (H₂S, NH₃, CH₄) + Nitrógeno
- **Eficiencia:** Alta (8-12 ATP por sustrato)
- **Multiplicador de costo:** 1.0x (más eficiente)
- **Organelos:** Ribosomas + Enzimas quimiosintéticas
- **Color:** Verde (150, 200, 100)
- **Estrés:** +30% costo fuera del sedimento

---

## ⚙️ Implementación Actual

### Mecánicas de Divergencia
```javascript
// DNAMutator.js - applyMetabolicDivergence()
if (parentDNA.metabolismType === 'luca' && random(1) < 0.01) {
    // 1% probabilidad de especialización
    if (random(1) < 0.5) {
        // Ruta FERMENTACIÓN
        childDNA.metabolismType = 'fermentation';
        childDNA.organelles.hydrogenosomes = true;
        childDNA.color = [180, 100, 150];  // Púrpura
    } else {
        // Ruta QUIMIOSÍNTESIS
        childDNA.metabolismType = 'chemosynthesis';
        childDNA.organelles.chemosynthetic_enzymes = true;
        childDNA.color = [150, 200, 100];  // Verde
    }
}
```

### Transiciones Cruzadas
```javascript
// Extremadamente raras (0.001%) con alta mortalidad
if (parentDNA.metabolismType !== 'luca' && random(1) < 0.00001) {
    if (random(1) < 0.8) {
        childDNA._lethal = true;  // 80% mortalidad
    } else {
        // Transición exitosa (20%)
        // Fermentación ↔ Quimiosíntesis
    }
}
```

---

## 💡 Mecánicas del Juego

### LUCA (Primordial)
**Ventajas:**
- 🧬 Puede divergir en tipos especializados
- 🎲 Alta tasa de mutación (exploración)
- 🌊 Sin estrés ambiental

**Desventajas:**
- 💸 Muy ineficiente (2x costo)
- 📉 Superada por tipos especializados
- ⚠️ Metabolismo primitivo

### Fermentación (Anaeróbica)
**Ventajas:**
- ⚡ Más eficiente que LUCA (1.5x)
- 🌊 Funciona en zonas de bajo oxígeno
- 🎯 Nicho especializado

**Desventajas:**
- ☠️ Toxicidad por oxígeno (+50% costo si O₂ > 70)
- 🚫 Evita zonas superficiales
- 📊 Limitada a consumo solo de energía

### Quimiosíntesis (Química)
**Ventajas:**
- 🏆 Más eficiente (1.0x costo)
- 🔋 Usa nitrógeno (recurso adicional)
- 💪 Ventaja competitiva

**Desventajas:**
- 🏔️ Requiere zonas de sedimento (+30% costo fuera)
- 🧪 Necesita compuestos nitrogenados
- 📍 Restringida por hábitat

---

## 📊 Evaluación: **10/10** ⭐

### ✅ Fortalezas
> [!TIP]
> **EXCELENTE SISTEMA DE ESPECIES**
> 
> - Tres estrategias metabólicas distintas
> - Nichos ecológicos claros
> - Mecánicas de divergencia realistas
> - Factores de estrés ambiental
> - Especialización irreversible (realista)
> - Diferenciación basada en organelos

### Base Científica
- **Martin & Russell (2007):** Metabolismo de LUCA
- **Müller et al. (2012):** Evolución de fermentación
- **Nakagawa & Takai (2008):** Quimiosíntesis
- **Weiss et al. (2016):** Diversidad metabólica temprana

---

## 🧬 Evolución Esperada

### Simulación Temprana (Gen 0-50)
- 🔵 100% LUCA (primordial)
- 🎲 Alta diversidad genética
- 📈 Crecimiento poblacional

### Simulación Media (Gen 50-200)
- 🟣 Aparecen primeras células de fermentación (~30s-2min)
- 🟢 Aparecen primeras células de quimiosíntesis
- ⚖️ LUCA declina (superada)
- 🌍 Comienza diferenciación de nichos

### Simulación Tardía (Gen 200+)
- 🏆 Tipos especializados dominan
- 🔵 LUCA extinta o rara
- 🟣 Fermentación en zonas superficie/media
- 🟢 Quimiosíntesis en sedimento
- 🌈 Ecosistema estable

---

## 🔬 Biología Real

### Línea Temporal de Evolución Metabólica
- **4.0 Ga:** LUCA con metabolismo primitivo
- **3.5 Ga:** Evoluciona fermentación
- **3.0 Ga:** Se diversifica quimiosíntesis
- **2.5 Ga:** Emerge fotosíntesis (no en simulación)

### Rendimientos de ATP (Real)
- **Tipo LUCA:** ~2-4 ATP por reacción
- **Fermentación:** 2 ATP por glucosa (glucólisis)
- **Quimiosíntesis:** Variable (8-12 ATP típico)
- **Respiración aeróbica:** 38 ATP por glucosa (no en simulación)

### Nichos Ecológicos
- **Fermentadores:** Microbiomas intestinales, sedimentos anaeróbicos
- **Quimiosintetizadores:** Fuentes hidrotermales, océano profundo
- **Segregación de hábitat:** Gradiente de oxígeno crea nichos

---

## 🌍 Interacciones Ambientales

### Preferencias de Recursos
| Metabolismo    | Luz   | Oxígeno | Nitrógeno | Fósforo | Hábitat    |
| -------------- | ----- | ------- | --------- | ------- | ---------- |
| LUCA           | Media | Baja    | Baja      | Baja    | Cualquiera |
| Fermentación   | Alta  | Baja    | Ninguna   | Media   | Superficie |
| Quimiosíntesis | Baja  | Baja    | Alta      | Alta    | Sedimento  |

### Dinámicas Competitivas
- **Partición de recursos:** Patrones de consumo diferentes
- **Segregación espacial:** Estratificación vertical
- **Jerarquía de eficiencia:** Quimiosíntesis > Fermentación > LUCA

---

*Basado en: Martin & Russell 2007, Müller et al. 2012, Nakagawa & Takai 2008, Weiss et al. 2016*
