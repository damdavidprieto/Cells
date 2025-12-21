# Luz (Light) - Energía Solar

**Tipo:** Recurso Primario de Energía  
**Fuente:** Radiación solar  
**Distribución:** Concentrada en superficie (decaimiento exponencial)  
**Regeneración:** Constante (ilimitada)  
**Rol Biológico:** Fuente primaria de energía para todas las células

---

## 🔬 Base Científica

### Océano Primordial sin Capa de Ozono (4.0-3.5 Ga)

**Características:**
- **Sin capa de ozono:** Radiación UV directa penetra profundamente
- **Pre-fotosíntesis:** No hay producción biológica de oxígeno
- **Ley de Beer-Lambert:** Intensidad de luz decae exponencialmente con profundidad
- **Fórmula:** I = I₀ × e^(-kz)
  - I₀ = Intensidad superficial
  - k = Coeficiente de absorción del agua
  - z = Profundidad

---

## ⚙️ Implementación

### Código
```javascript
// Environment.js - initGrids()
for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
        // Decaimiento exponencial con profundidad
        let depthFactor = exp(-j * 0.05);  // Decaimiento fuerte
        
        // Luz máxima en superficie, mínima en profundidad
        this.lightGrid[i][j] = 100 * depthFactor * noise(i * 0.1, j * 0.1);
    }
}

// Regeneración constante
update() {
    // La luz se regenera instantáneamente (sol siempre brilla)
    // No hay código de regeneración - valores constantes
}
```

### Distribución por Profundidad
```javascript
Superficie (0-20%):     80-100 unidades  (abundante)
Zona Media (20-80%):    20-60 unidades   (moderada)
Zona Profunda (80-90%): 5-20 unidades    (escasa)
Sedimento (90-100%):    0-5 unidades     (mínima)
```

---

## 💡 Características del Recurso

### Ventajas
- ✅ **Ilimitada:** Regeneración constante
- ✅ **Predecible:** Distribución estable
- ✅ **Universal:** Todas las células la necesitan
- ✅ **Gradiente claro:** Crea estratificación vertical

### Limitaciones
- ⚠️ **Estratificada:** No uniforme en profundidad
- ⚠️ **Competencia superficial:** Alta densidad de células en superficie
- ⚠️ **Inútil en sedimento:** Células profundas deben usar otras fuentes

---

## 🌊 Gradiente Vertical

### Zona de Luz Alta (0-20% profundidad)
**Características:**
- 💡 Luz: 80-100 unidades
- 🎯 Ideal para: Fermentación
- 📈 Ventaja: Energía abundante
- ⚠️ Desventaja: Alta competencia, radiación UV

**Estrategia óptima:**
- Color oscuro (máxima absorción)
- Metabolismo fermentación
- Tamaño pequeño (reproducción rápida)

### Zona de Luz Media (20-80% profundidad)
**Características:**
- 💡 Luz: 20-60 unidades
- 🎯 Ideal para: LUCA, mixto
- 📊 Ventaja: Balance recursos
- ⚖️ Desventaja: Ni abundante ni escasa

**Estrategia óptima:**
- Color medio
- Metabolismo mixto
- Tamaño medio
- Generalistas

### Zona de Luz Baja (80-90% profundidad)
**Características:**
- 💡 Luz: 5-20 unidades
- 🎯 Ideal para: Transición a quimiosíntesis
- 📉 Ventaja: Baja competencia
- ⚠️ Desventaja: Energía limitada

**Estrategia óptima:**
- Color claro (bajo costo pigmentos)
- Comenzar a usar nitrógeno
- Eficiencia alta

### Zona de Sedimento (90-100% profundidad)
**Características:**
- 💡 Luz: 0-5 unidades
- 🎯 Ideal para: Quimiosíntesis
- 🔋 Ventaja: Nitrógeno y fósforo abundantes
- 🚫 Desventaja: Luz casi inexistente

**Estrategia óptima:**
- Metabolismo quimiosíntesis (no depende de luz)
- Color irrelevante
- Tamaño grande (almacenamiento)

---

## 🧬 Efectos Evolutivos

### Presión Selectiva
- **Superficie:** Selecciona por absorción de luz (color oscuro)
- **Profundidad:** Selecciona por eficiencia energética
- **Sedimento:** Selecciona por metabolismo alternativo (quimiosíntesis)

### Adaptaciones Esperadas
1. **Segregación vertical por metabolismo:**
   - Fermentación → Superficie
   - LUCA → Zona media
   - Quimiosíntesis → Sedimento

2. **Gradiente de color:**
   - Oscuro en superficie (absorción)
   - Claro en profundidad (ahorro)

3. **Especialización metabólica:**
   - Dependientes de luz (superficie)
   - Independientes de luz (sedimento)

---

## 🔬 Biología Real

### Penetración de Luz en Océanos

**Océano moderno (con oxígeno):**
- Zona fótica: 0-200m (luz suficiente para fotosíntesis)
- Zona afótica: >200m (sin luz)
- Decaimiento: ~99% de luz absorbida en primeros 100m

**Océano primordial (sin oxígeno):**
- Mayor penetración UV (sin capa de ozono)
- Menor absorción por oxígeno disuelto
- Penetración más profunda de ciertas longitudes de onda

### Absorción de Luz por Pigmentos

**Pigmentos reales:**
- **Clorofila a:** Absorbe rojo (680nm) y azul (430nm)
- **Carotenoides:** Absorben azul-verde (400-550nm)
- **Ficobilinas:** Absorben verde-amarillo (500-650nm)

**En simulación:**
- Color oscuro = Mayor absorción (1.3x)
- Color claro = Menor absorción (0.8x)
- Simplificación de espectro completo

---

## 📊 Consumo por Metabolismo

### LUCA
```javascript
energyNeeded = 2.0 × efficiency × lightAbsorption
Consumo típico: 2.0-3.0 unidades/frame
```

### Fermentación
```javascript
energyNeeded = 1.5 × efficiency × lightAbsorption
Consumo típico: 1.5-2.5 unidades/frame
```

### Quimiosíntesis
```javascript
energyNeeded = 1.0 × efficiency × lightAbsorption
Consumo típico: 1.0-1.5 unidades/frame
Nota: También consume nitrógeno
```

---

## 🎮 Implicaciones en el Juego

### Estratificación Poblacional
- 🟣 **Superficie (0-30%):** Dominada por fermentación
- 🔵 **Media (30-80%):** Mixta (LUCA + fermentación)
- 🟢 **Profunda (80-100%):** Dominada por quimiosíntesis

### Competencia por Luz
- **Alta densidad superficial:** Agota luz localmente
- **Migración vertical:** Células buscan zonas óptimas
- **Especialización:** Reduce competencia directa

### Sostenibilidad
- ✅ **Recurso sostenible:** No se agota
- ✅ **Permite poblaciones grandes:** En superficie
- ⚠️ **Crea desigualdad:** Superficie vs profundidad

---

## 📈 Interacción con Otros Recursos

### Luz + Oxígeno
- Superficie: Luz alta + Oxígeno variable
- Fermentación sufre si oxígeno >70 (toxicidad)

### Luz + Nitrógeno
- Superficie: Luz alta + Nitrógeno bajo
- Sedimento: Luz baja + Nitrógeno alto
- **Trade-off espacial**

### Luz + Fósforo
- Superficie: Luz alta + Fósforo trazas
- Sedimento profundo: Luz mínima + Fósforo moderado
- **Fósforo limita reproducción en superficie**

---

## 🌍 Comparación Zonas

| Profundidad | Luz    | Ventaja              | Desventaja           | Metabolismo Óptimo |
| ----------- | ------ | -------------------- | -------------------- | ------------------ |
| 0-20%       | 80-100 | Energía abundante    | Alta competencia, UV | Fermentación       |
| 20-50%      | 40-80  | Balance              | Competencia media    | LUCA/Fermentación  |
| 50-80%      | 10-40  | Baja competencia     | Energía limitada     | LUCA/Transición    |
| 80-90%      | 5-20   | Muy baja competencia | Energía escasa       | Transición         |
| 90-100%     | 0-5    | Nitrógeno/Fósforo    | Sin luz              | Quimiosíntesis     |

---

*Basado en: Weiss et al. 2016 (LUCA habitat), Kirk 1994 (Light in water), Falkowski & Raven 2007 (Aquatic photosynthesis)*
