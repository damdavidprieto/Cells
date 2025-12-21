# Fósforo (Phosphorus) - EL Nutriente Limitante

**Tipo:** Recurso Crítico (Limitante)  
**Fuente:** Sedimento profundo (meteorización de rocas)  
**Distribución:** Solo en sedimento profundo (95-100%)  
**Regeneración:** Muy lenta (+0.02/frame)  
**Rol Biológico:** **CRÍTICO** para replicación de ADN/ARN

---

## 🔬 Base Científica

### Fósforo: El Cuello de Botella de la Vida

**Por qué es crítico:**
- **Columna vertebral del ADN/ARN:** Enlace fosfodiéster
- **ATP:** Moneda energética (adenosín tri-**fosfato**)
- **Membranas:** Fosfolípidos
- **Sin sustituto:** No hay alternativa química

**Escasez primordial:**
- **Solubilidad baja:** Fosfatos precipitan fácilmente
- **Meteorización lenta:** Liberación desde apatita (Ca₅(PO₄)₃)
- **Adsorción:** Se adhiere a minerales (Fe, Al)
- **Resultado:** Nutriente más limitante en océanos

---

## ⚙️ Implementación

### Código
```javascript
// Environment.js - initGrids()
for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
        if (this.isInDeepSediment(j)) {
            // SEDIMENTO PROFUNDO (95-100%): Fósforo moderado
            this.phosphorusGrid[i][j] = random(40, 80) * noise(i * 0.1, j * 0.1);
        } else {
            // RESTO: Trazas
            this.phosphorusGrid[i][j] = random(0, 10) * noise(i * 0.1, j * 0.1);
        }
    }
}

// Regeneración MUY LENTA (solo sedimento profundo)
update() {
    for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
            if (this.isInDeepSediment(j)) {
                // Regeneración muy lenta
                this.phosphorusGrid[i][j] += 0.02;  // Mitad que nitrógeno
                this.phosphorusGrid[i][j] = min(this.phosphorusGrid[i][j], 80);
            }
        }
    }
}

// Zona de sedimento profundo
isInDeepSediment(y) {
    return y > this.rows * 0.95;  // Último 5%
}
```

### Distribución por Zona
```javascript
Columna de Agua (0-90%):    0-10 unidades   (trazas)
Sedimento (90-95%):         0-10 unidades   (trazas)
Sedimento Profundo (95-100%): 40-80 unidades (moderado)
Regeneración:               +0.02/frame (solo profundo)
```

---

## 💡 Características del Recurso

### Ventajas
- 🎯 **Define nicho:** Zona más profunda del mapa
- 🔄 **Renovable:** Regeneración lenta pero constante
- ⚖️ **Limita población:** Previene explosión demográfica
- 🏆 **Recompensa especialización:** Quimiosíntesis en profundo

### Limitaciones
- 📍 **Extremadamente localizado:** Solo 5% del mapa
- 🐌 **Regeneración muy lenta:** +0.02/frame (40% de nitrógeno)
- ⚠️ **CRÍTICO para reproducción:** 60% de capacidad requerida
- 💀 **Cuello de botella:** Limita crecimiento poblacional

---

## 🌊 Gradiente Vertical Extremo

### Columna de Agua + Sedimento (0-95% profundidad)
**Características:**
- 💀 Fósforo: 0-10 unidades (trazas)
- 🚫 Reproducción insostenible
- ⚠️ Células deben migrar o morir

**Estrategia:**
- Migración constante a sedimento profundo
- Reproducción solo ocasional (si encuentran parche)
- Muerte por inanición de fósforo

### Sedimento Profundo (95-100% profundidad)
**Características:**
- 🟢 Fósforo: 40-80 unidades (moderado)
- ✅ Reproducción sostenible
- 🔄 Regeneración: +0.02/frame
- 🎯 **ÚNICO** lugar viable para reproducción a largo plazo

**Estrategia:**
- Quimiosíntesis domina (también tiene nitrógeno)
- Competencia intensa (espacio limitado)
- Tamaño grande (maximizar almacenamiento)

---

## 🧬 Efectos Evolutivos

### Presión Selectiva Extrema
- **Reproducción requiere 60% de fósforo**
- **Solo disponible en 5% del mapa**
- **Resultado:** Migración masiva hacia sedimento profundo

### Control Poblacional
```javascript
// ReproductionSystem.js
let phosphorusRequired = entity.maxResources * 0.60;

if (entity.phosphorus < phosphorusRequired) {
    return false;  // NO puede reproducirse
}
```

**Efecto:**
- Limita crecimiento exponencial
- Crea competencia por espacio en sedimento profundo
- Favorece eficiencia metabólica (quimiosíntesis)

### Segregación Espacial Forzada
```
Superficie (0-30%):     Fermentación (puede sobrevivir, no reproducirse)
Zona Media (30-90%):    LUCA/Mixto (sobrevive, reproducción rara)
Sedimento (90-95%):     Transición (lucha por fósforo)
Profundo (95-100%):     Quimiosíntesis (domina, reproducción sostenible)
```

---

## 🔬 Biología Real

### Fósforo en Bioquímica

**Funciones esenciales:**
```
ADN/ARN:     Enlace fosfodiéster (columna vertebral)
ATP:         Adenosín trifosfato (energía)
Fosfolípidos: Membranas celulares
Fosfoproteínas: Señalización celular
```

**Composición celular:**
- **Bacterias:** 2-3% del peso seco es fósforo
- **Eucariotas:** 1-2% del peso seco
- **Crítico:** Sin fósforo = sin replicación

### Limitación de Fósforo (Elser et al. 2007)

**Evidencia empírica:**
- **Lagos:** Fósforo limita productividad primaria
- **Océanos:** Fósforo limita en muchas regiones
- **Evolución:** Organismos evolucionan eficiencia en uso de P

**Ciclo del fósforo:**
```
Rocas (apatita) → Meteorización → PO₄³⁻ disuelto → 
Organismos → Muerte → Sedimento → Rocas
```

**Tiempo de ciclo:** Millones de años (muy lento)

---

## 📊 Consumo por Metabolismo

### LUCA
```javascript
phosphorusCost = 0.3 × baseCost
Consumo típico: 0.3 unidades/frame
```

### Fermentación
```javascript
phosphorusCost = 0.4 × baseCost
Consumo típico: 0.4 unidades/frame
```

### Quimiosíntesis
```javascript
phosphorusCost = 0.5 × baseCost
Consumo típico: 0.5 unidades/frame
Nota: Mayor consumo pero acceso a fuente
```

**Reproducción (todos):**
```javascript
// Costo de construcción de flagelos
phosphorusCost = 0.2 × (newLevel - oldLevel)
```

---

## 🎮 Implicaciones en el Juego

### Cuello de Botella Poblacional

**Fase Temprana (Gen 0-50):**
- 📈 Población crece rápidamente
- 🌊 Fósforo inicial suficiente
- ✅ Reproducción en cualquier lugar (reservas)

**Fase Media (Gen 50-200):**
- ⚠️ Fósforo agotándose fuera de sedimento profundo
- 📉 Tasa de reproducción disminuye
- 🏃 Migración hacia sedimento profundo

**Fase Tardía (Gen 200+):**
- 💀 Fósforo solo en sedimento profundo (95-100%)
- 🟢 Quimiosíntesis domina (acceso a P + N)
- 🌍 Población estabilizada (limitada por P)

### Estrategias Viables

#### Estrategia "Residente Profundo" (Óptima)
```
Metabolismo: Quimiosíntesis
Ubicación: Sedimento profundo (95-100%)
Tamaño: Grande (almacenamiento)
Eficiencia: Alta
Resultado: Reproducción sostenible
```

#### Estrategia "Nómada" (Subóptima)
```
Metabolismo: Fermentación/LUCA
Ubicación: Superficie/Media
Tamaño: Pequeño (movilidad)
Flagelos: Altos (búsqueda)
Resultado: Supervivencia, reproducción rara
```

---

## 📈 Interacción con Otros Recursos

### Fósforo + Nitrógeno
**Sinergia en sedimento profundo:**
- Ambos concentrados en 95-100%
- Quimiosíntesis accede a ambos
- **Ventaja competitiva masiva**

### Fósforo + Luz
**Trade-off extremo:**
- Superficie: Luz 80-100, Fósforo 0-10
- Profundo: Luz 0-5, Fósforo 40-80
- **Imposible optimizar ambos**

### Fósforo + Oxígeno
**Independientes:**
- Oxígeno: Aleatorio, finito
- Fósforo: Localizado, renovable
- Sin correlación

---

## 🌍 Comparación Zonas

| Profundidad | Fósforo | Regeneración | Reproducción   | Metabolismo Óptimo       |
| ----------- | ------- | ------------ | -------------- | ------------------------ |
| 0-30%       | 0-10    | No           | Insostenible   | Fermentación (sobrevive) |
| 30-90%      | 0-10    | No           | Rara           | LUCA/Mixto (sobrevive)   |
| 90-95%      | 0-10    | No           | Muy rara       | Transición               |
| 95-100%     | 40-80   | +0.02/frame  | **Sostenible** | **Quimiosíntesis**       |

---

## ⚙️ Parámetros de Configuración

```javascript
// Constants.js
DEEP_SEDIMENT_DEPTH: 0.05,           // Último 5% del mapa
PHOSPHORUS_REGENERATION_RATE: 0.02,  // Unidades/frame (muy lento)
PHOSPHORUS_DEEP_MIN: 40,             // Mínimo en sedimento profundo
PHOSPHORUS_DEEP_MAX: 80,             // Máximo en sedimento profundo
PHOSPHORUS_ELSEWHERE_MAX: 10,        // Máximo fuera (trazas)

// Reproducción
REPRODUCTION_PHOSPHORUS_THRESHOLD: 0.60  // 60% de capacidad requerida
```

---

## 🎯 Diseño Intencional

### ¿Por qué fósforo es tan limitante?

1. **Realismo biológico:** Fósforo ES el nutriente limitante en la Tierra
2. **Control poblacional:** Previene explosión demográfica
3. **Especialización forzada:** Favorece quimiosíntesis en sedimento
4. **Estratificación:** Crea ecosistema vertical claro
5. **Dinámica temporal:** Población crece → se estabiliza → equilibrio

### Efecto en Gameplay
- ✅ **Fase temprana:** Crecimiento libre (exploración)
- ⚖️ **Fase media:** Competencia aumenta (transición)
- 🎯 **Fase tardía:** Equilibrio estable (ecosistema maduro)

---

*Basado en: Elser et al. 2007 (P limitation), Paytan & McLaughlin 2007 (P cycle), Weiss et al. 2016 (LUCA habitat)*
