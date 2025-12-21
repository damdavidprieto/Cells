# Guía de Configuración: Variabilidad LUCA

## 🎛️ Configuración de Variabilidad Inicial

La variabilidad inicial de LUCA se controla mediante el parámetro `LUCA_VARIABILITY_LEVEL` en [`Constants.js`](file:///c:/Proyectos/rare/Cells/src/utils/Constants.js).

---

## Niveles Disponibles

### Nivel NONE - Ancestro Único Puro
**Configuración:**
```javascript
LUCA_VARIABILITY_LEVEL: 'NONE'
```

**Características:**
- ✅ Todas las células LUCA son **idénticas**
- ✅ Concepto evolutivo más puro
- ✅ Evolución más lenta y predecible
- ⏱️ Primeros flagelos: ~20-30 minutos

**Valores:**
- Mutation Rate: 0.10 (fijo)
- Metabolic Efficiency: 1.0 (fijo)
- Storage Capacity: 130 (fijo)
- Size: 11.5 (fijo)
- Color: Gris uniforme [200, 200, 220]

**Uso recomendado:** Demostraciones educativas, observar evolución "pura"

---

### Nivel MEDIUM - Variabilidad Balanceada ⭐ (Por defecto)
**Configuración:**
```javascript
LUCA_VARIABILITY_LEVEL: 'MEDIUM'
```

**Características:**
- ✅ Variabilidad genética **realista**
- ✅ Balance entre pureza conceptual y dinamismo
- ✅ Evolución visible desde el inicio
- ⏱️ Primeros flagelos: ~10-15 minutos

**Valores:**
- Mutation Rate: 0.08 - 0.12 (±20%)
- Metabolic Efficiency: 0.9 - 1.1 (±10%)
- Storage Capacity: 120 - 140 (±7.7%)
- Size: 10 - 13 (±13%)
- Color: Gris con variación sutil [190-210, 190-210, 210-230]

**Uso recomendado:** Simulaciones normales, observación evolutiva

---

### Nivel HIGH - Alta Variabilidad (Modo Desarrollo)
**Configuración:**
```javascript
LUCA_VARIABILITY_LEVEL: 'HIGH'
```

**Características:**
- ✅ **Máxima variabilidad** inicial
- ✅ Evolución muy rápida
- ✅ Ideal para testing y desarrollo
- ⏱️ Primeros flagelos: ~5-8 minutos

**Valores:**
- Mutation Rate: 0.05 - 0.15 (±50%)
- Metabolic Efficiency: 0.7 - 1.3 (±30%)
- Storage Capacity: 100 - 150 (±20%)
- Size: 8 - 15 (±30%)
- Color: Amplia variación [100-200, 200-255, 200-255]

**Uso recomendado:** Testing, debugging, demostraciones rápidas

---

## 📊 Comparativa Visual

```
NONE (Ancestro Único)
├─ Todas las células idénticas
├─ Evolución lenta y predecible
└─ Primeras diferencias solo por mutación

MEDIUM (Balanceado) ⭐
├─ Ligeras diferencias visibles
├─ Selección natural desde inicio
└─ Evolución realista

HIGH (Desarrollo)
├─ Gran diversidad visible
├─ Evolución muy rápida
└─ Múltiples linajes desde inicio
```

---

## 🔧 Cómo Cambiar el Nivel

1. Abrir [`src/utils/Constants.js`](file:///c:/Proyectos/rare/Cells/src/utils/Constants.js)
2. Buscar la línea:
   ```javascript
   LUCA_VARIABILITY_LEVEL: 'MEDIUM',
   ```
3. Cambiar a `'NONE'`, `'MEDIUM'`, o `'HIGH'`
4. Recargar la página (F5)

---

## 🧬 Impacto en la Evolución

### NONE
- **Gen 0-100:** Población homogénea
- **Gen 100-200:** Primeras diferencias por mutación
- **Gen 200+:** Divergencia gradual

### MEDIUM
- **Gen 0-50:** Selección de células eficientes
- **Gen 50-150:** Primeros flagelos
- **Gen 150+:** Nichos ecológicos

### HIGH
- **Gen 0-20:** Selección intensa
- **Gen 20-80:** Múltiples linajes flagelados
- **Gen 80+:** Especialización rápida

---

## 💡 Recomendaciones

**Para observación científica:** `NONE`
- Pureza conceptual máxima
- Evolución paso a paso

**Para uso normal:** `MEDIUM` ⭐
- Balance perfecto
- Realismo biológico

**Para desarrollo/testing:** `HIGH`
- Iteración rápida
- Ver resultados en minutos

---

## 🎮 Ejemplos de Uso

### Demostración Educativa
```javascript
// Mostrar evolución desde cero
LUCA_VARIABILITY_LEVEL: 'NONE'
```

### Simulación Realista
```javascript
// Comportamiento natural
LUCA_VARIABILITY_LEVEL: 'MEDIUM'
```

### Testing de Nuevas Mecánicas
```javascript
// Ver resultados rápido
LUCA_VARIABILITY_LEVEL: 'HIGH'
```
