# Nitrógeno (Nitrogen) - Combustible Quimiosintético

**Tipo:** Recurso Especializado  
**Fuente:** Sedimento (descomposición, actividad volcánica)  
**Distribución:** Concentrado en sedimento  
**Regeneración:** Lenta (solo en sedimento)  
**Rol Biológico:** Combustible para quimiosíntesis, aminoácidos, nucleótidos

---

## 🔬 Base Científica

### Nitrógeno en Océano Primordial (4.0-3.5 Ga)

**Fuentes de nitrógeno:**
- **Volcanes:** Emisiones de NH₃ (amoníaco), N₂
- **Descomposición:** Materia orgánica en sedimento
- **Fijación abiótica:** Relámpagos, radiación UV
- **Fuentes hidrotermales:** NH₃, NO₃⁻ de vents

**Distribución:**
- **Columna de agua:** Nitrógeno escaso (N₂ poco reactivo)
- **Sedimento:** Acumulación de compuestos nitrogenados
- **Vents hidrotermales:** Concentraciones altas de NH₃

---

## ⚙️ Implementación

### Código
```javascript
// Environment.js - initGrids()
for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
        if (this.isInSediment(j)) {
            // SEDIMENTO: Nitrógeno abundante
            this.nitrogenGrid[i][j] = random(60, 100) * noise(i * 0.1, j * 0.1);
        } else {
            // COLUMNA DE AGUA: Nitrógeno escaso
            this.nitrogenGrid[i][j] = random(5, 20) * noise(i * 0.1, j * 0.1);
        }
    }
}

// Regeneración LENTA (solo en sedimento)
update() {
    for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
            if (this.isInSediment(j)) {
                // Regeneración lenta en sedimento
                this.nitrogenGrid[i][j] += 0.05;
                this.nitrogenGrid[i][j] = min(this.nitrogenGrid[i][j], 100);
            }
        }
    }
}
```

### Distribución por Zona
```javascript
Columna de Agua (0-90%):  5-20 unidades   (escaso)
Sedimento (90-100%):      60-100 unidades (abundante)
Regeneración:             +0.05/frame (solo sedimento)
```

---

## 💡 Características del Recurso

### Ventajas
- 🔋 **Abundante en sedimento:** Recurso clave para quimiosíntesis
- 🔄 **Renovable:** Regeneración lenta pero constante
- 🎯 **Crea nicho:** Favorece especialización en sedimento
- 💪 **Ventaja competitiva:** Quimiosíntesis más eficiente

### Limitaciones
- 📍 **Localizado:** Solo abundante en sedimento (10% del mapa)
- 🐌 **Regeneración lenta:** +0.05/frame (vs luz ilimitada)
- 🚫 **Inútil para LUCA/Fermentación:** No lo consumen
- ⚖️ **Competencia intensa:** En zona limitada

---

## 🌊 Gradiente Vertical

### Columna de Agua (0-90% profundidad)
**Características:**
- 🔵 Nitrógeno: 5-20 unidades (escaso)
- 🚫 No sostenible para quimiosíntesis
- ⚠️ Células quimiosintéticas sufren (+30% costo)

**Estrategia:**
- LUCA y Fermentación no lo necesitan
- Quimiosíntesis debe migrar a sedimento

### Sedimento (90-100% profundidad)
**Características:**
- 🟢 Nitrógeno: 60-100 unidades (abundante)
- ✅ Sostenible para quimiosíntesis
- 🔄 Regeneración: +0.05/frame
- 🎯 Nicho especializado

**Estrategia:**
- Quimiosíntesis domina
- Tamaño grande (almacenamiento)
- Eficiencia alta (aprovecha recursos)

---

## 🧬 Efectos Evolutivos

### Presión Selectiva
- **Quimiosíntesis fuera de sedimento:** +30% costo metabólico
- **Resultado:** Migración hacia sedimento
- **Especialización:** Quimiosíntesis = habitantes del fondo

### Segregación Espacial
```
Superficie (0-30%):  Fermentación (luz + sin nitrógeno)
Zona Media (30-90%): LUCA/Mixto (luz moderada)
Sedimento (90-100%): Quimiosíntesis (nitrógeno + fósforo)
```

### Ventaja Competitiva
- **Eficiencia:** Quimiosíntesis 1.0x vs LUCA 2.0x
- **Recursos duales:** Usa luz + nitrógeno
- **Resultado:** Domina sedimento

---

## 🔬 Biología Real

### Ciclo del Nitrógeno Primordial

**Fuentes abióticas:**
```
N₂ (atmósfera) + energía → NH₃ (amoníaco)
NH₃ + H₂O → NH₄⁺ (amonio)
```

**Fuentes volcánicas:**
- Emisiones de NH₃ en vents hidrotermales
- Concentraciones: 0.1-10 mM (variable)

**Fijación biológica (posterior):**
- Nitrogenasa (enzima)
- Convierte N₂ → NH₃
- Evoluciona después de LUCA

### Quimiosíntesis Real

**Organismos modernos:**
- **Thiobacillus:** Oxida H₂S + NO₃⁻
- **Nitrosomonas:** Oxida NH₄⁺ → NO₂⁻
- **Nitrobacter:** Oxida NO₂⁻ → NO₃⁻

**Ecuaciones:**
```
NH₄⁺ + 1.5 O₂ → NO₂⁻ + 2H⁺ + H₂O + energía
NO₂⁻ + 0.5 O₂ → NO₃⁻ + energía
```

**En simulación (simplificado):**
- Nitrógeno como "combustible" genérico
- Representa compuestos reducidos (NH₃, NH₄⁺)

---

## 📊 Consumo por Metabolismo

### LUCA
```javascript
nitrogenCost = 0
Consumo: NO consume nitrógeno
```

### Fermentación
```javascript
nitrogenCost = 0
Consumo: NO consume nitrógeno
```

### Quimiosíntesis
```javascript
nitrogenCost = 0.5 × baseCost × stress × efficiency
Consumo típico: 0.4-0.8 unidades/frame

// Estrés fuera de sedimento
if (!isInSediment) {
    stress = 1.3;  // +30% costo
}
```

---

## 🎮 Implicaciones en el Juego

### Nicho Ecológico Especializado

**Quimiosíntesis en sedimento:**
- ✅ Nitrógeno abundante (60-100)
- ✅ Fósforo moderado (40-80 en profundo)
- ⚠️ Luz mínima (0-5)
- 🎯 **Estrategia:** Independencia de luz

**Ventajas:**
1. **Baja competencia:** Pocos competidores en sedimento
2. **Recursos duales:** Nitrógeno + fósforo
3. **Eficiencia:** 1.0x costo (mejor que LUCA 2.0x)

**Desventajas:**
1. **Espacio limitado:** Solo 10% del mapa
2. **Dependencia:** Debe estar en sedimento
3. **Migración costosa:** Salir del sedimento = +30% costo

### Dinámica Poblacional

#### Fase Temprana (Gen 0-50)
- 🔵 100% LUCA (no usa nitrógeno)
- 🌊 Nitrógeno sin usar
- 📈 Acumulación en sedimento

#### Fase Media (Gen 50-200)
- 🟢 Primeras quimiosíntesis aparecen
- 📍 Migran a sedimento
- ⚖️ Comienza especialización espacial

#### Fase Tardía (Gen 200+)
- 🟢 Quimiosíntesis domina sedimento
- 🟣 Fermentación domina superficie
- 🌍 Ecosistema estratificado estable

---

## 📈 Interacción con Otros Recursos

### Nitrógeno + Luz
**Trade-off espacial:**
- Superficie: Luz alta (80-100) + Nitrógeno bajo (5-20)
- Sedimento: Luz baja (0-5) + Nitrógeno alto (60-100)
- **Resultado:** Segregación metabólica

### Nitrógeno + Fósforo
**Sinergia en sedimento:**
- Ambos concentrados en sedimento
- Quimiosíntesis accede a ambos
- **Ventaja:** Reproducción sostenible en sedimento

### Nitrógeno + Oxígeno
**Independientes:**
- Oxígeno: Distribución aleatoria
- Nitrógeno: Concentrado en sedimento
- Sin correlación directa

---

## 🌍 Comparación Zonas

| Profundidad | Nitrógeno | Regeneración | Metabolismo Óptimo | Estrategia               |
| ----------- | --------- | ------------ | ------------------ | ------------------------ |
| 0-30%       | 5-20      | No           | Fermentación       | Ignorar nitrógeno        |
| 30-90%      | 5-20      | No           | LUCA/Mixto         | Ignorar nitrógeno        |
| 90-95%      | 60-100    | +0.05/frame  | Quimiosíntesis     | Usar nitrógeno           |
| 95-100%     | 60-100    | +0.05/frame  | Quimiosíntesis     | Usar nitrógeno + fósforo |

---

## ⚙️ Parámetros de Configuración

```javascript
// Constants.js
SEDIMENT_DEPTH: 0.10,              // 10% inferior es sedimento
NITROGEN_REGENERATION_RATE: 0.05,  // Unidades/frame en sedimento
NITROGEN_SEDIMENT_MIN: 60,         // Mínimo en sedimento
NITROGEN_SEDIMENT_MAX: 100,        // Máximo en sedimento
NITROGEN_WATER_MIN: 5,             // Mínimo en agua
NITROGEN_WATER_MAX: 20             // Máximo en agua
```

---

*Basado en: Weiss et al. 2016 (LUCA habitat), Canfield et al. 2010 (Nitrogen cycle), Nakagawa & Takai 2008 (Chemosynthesis)*
