# Resumen de Traits - Sistema Completo

Documentación completa de todos los rasgos (traits) del sistema evolutivo de Cells.

---

## 📊 Categorías de Traits

### 1. Traits Evolutivos (Mutan)
Rasgos que evolucionan a través de generaciones:
- `mutationRate` - Tasa de mutación
- `metabolicEfficiency` - Eficiencia metabólica  
- `storageCapacity` - Capacidad de almacenamiento
- `size` - Tamaño celular
- `color` - Pigmentos celulares
- `flagellaLevel` - Nivel de flagelos

### 2. Traits de Especie (Fijos/Heredados)
Rasgos que definen la especie:
- `metabolismType` - Tipo metabólico (LUCA, Fermentation, Chemosynthesis)
- `organelles` - Organelos presentes
- `generation` - Generación (linaje)
- `evolutionaryEra` - Era evolutiva (Primordial, Transition, Modern)

---

## 🎯 Traits por Importancia

### ⭐⭐⭐ Críticos (Definen Estrategia)
1. **mutationRate** (10/10) - Controla evolución, presión ambiental
2. **metabolismType** (10/10) - Define especie y nicho ecológico
3. **size** (9/10) - Trade-offs múltiples (almacenamiento vs costo vs velocidad)
4. **flagellaLevel** (9/10) - Trade-off velocidad vs energía

### ⭐⭐ Importantes (Afectan Supervivencia)
5. **color** (8/10) - Absorción de luz vs costo de pigmentos
6. **storageCapacity** (8/10) - Supervivencia en escasez
7. **metabolicEfficiency** (7/10) - Necesita trade-offs para ser óptimo

---

## 🔄 Interacciones Entre Traits

### Tamaño × Almacenamiento
```
Capacidad Real = storageCapacity × (size/15)^1.5
```
- Células grandes amplifican capacidad de almacenamiento
- Células pequeñas tienen almacenamiento limitado

### Tamaño × Velocidad
```
Velocidad Real = flagellaLevel × 0.5 × (15/size)^0.7
```
- Células pequeñas son más rápidas
- Células grandes son más lentas (inercia/viscosidad)

### Tamaño × Costo
```
Costo Real = baseCost × (size/15)^1.3
```
- Células grandes cuestan más mantener
- Economías de escala limitadas

### Eficiencia × Metabolismo
- LUCA: 2.0x costo (muy ineficiente)
- Fermentation: 1.5x costo (moderado)
- Chemosynthesis: 1.0x costo (eficiente)

### Color × Metabolismo
- LUCA: Gris (primitivo, neutral)
- Fermentation: Púrpura (bacteriorodopsina-like)
- Chemosynthesis: Verde (clorofila-like)

---

## 📈 Rangos y Valores

| Trait                   | Mín  | Máx  | LUCA Inicial | Mutación        |
| ----------------------- | ---- | ---- | ------------ | --------------- |
| **mutationRate**        | 0.01 | 0.30 | 0.15-0.25    | ±0.02 + presión |
| **metabolicEfficiency** | 0.5  | 1.5  | 0.7-1.3      | ±0.1 × mr × 10  |
| **storageCapacity**     | 100  | 300  | 100-150      | ±10 × mr × 10   |
| **size**                | 5    | 40   | 8-15         | ±2 × mr × 10    |
| **color (R/G/B)**       | 0    | 255  | Varía        | ±20 × mr × 10   |
| **flagellaLevel**       | 0    | 6    | 0-2          | ±0.5 × mr       |

---

## 🧬 Evolución Esperada por Ambiente

### Ambiente Rico y Estable
- ⬇️ Baja mutation rate (preservar adaptaciones)
- 🐰 Baja storage capacity (no necesita reservas)
- 🏃 Alta flagella (búsqueda activa rentable)
- 📏 Tamaño pequeño (reproducción rápida)
- ⚡ Baja efficiency (velocidad > eficiencia)

### Ambiente Pobre y Variable
- ⬆️ Alta mutation rate (exploración)
- 🔋 Alta storage capacity (reservas críticas)
- 💰 Baja flagella (conservar energía)
- 📦 Tamaño grande (almacenamiento)
- 🐢 Alta efficiency (supervivencia)

### Ambiente Estable pero Pobre
- ⬇️ Baja mutation rate (estabilidad)
- ⚖️ Storage media (balance)
- 💰 Flagella baja-media
- 📏 Tamaño medio
- 🎯 Alta efficiency (crítica)

---

## 🌍 Nichos Ecológicos

### Superficie (0-20% profundidad)
**Características:**
- Luz abundante (80-100)
- Oxígeno variable (30-80)
- Nitrógeno escaso (5-20)
- Fósforo trazas (0-10)

**Traits favorecidos:**
- 🟣 Fermentation metabolism
- 🌑 Color oscuro (absorción de luz)
- 🏃 Flagelos medios-altos (búsqueda)
- 📏 Tamaño pequeño-medio

### Sedimento (90-100% profundidad)
**Características:**
- Luz mínima (0-5)
- Oxígeno variable (30-80)
- Nitrógeno abundante (60-100)
- Fósforo moderado (40-80 en profundo)

**Traits favorecidos:**
- 🟢 Chemosynthesis metabolism
- ⚪ Color claro (ahorro de pigmentos)
- 💰 Flagelos bajos (conservar energía)
- 📦 Tamaño grande (almacenamiento)

### Zona Media (20-90% profundidad)
**Características:**
- Luz moderada (20-60)
- Oxígeno variable
- Recursos mixtos

**Traits favorecidos:**
- 🔵 LUCA o mixto
- 🌓 Color medio
- ⚖️ Traits balanceados
- 📊 Generalistas

---

## 🎮 Estrategias Viables

### Estrategia "Explorador Rápido"
```
size: 5-10 (pequeño)
flagellaLevel: 5-6 (alto)
storageCapacity: 100-150 (bajo)
metabolicEfficiency: 0.5-0.8 (bajo)
mutationRate: 0.15-0.25 (alto)
```
**Nicho:** Superficie, recursos parcheados  
**Ventaja:** Encuentra recursos rápido  
**Desventaja:** Vulnerable a escasez

### Estrategia "Tanque Resistente"
```
size: 30-40 (grande)
flagellaLevel: 0-1 (bajo)
storageCapacity: 250-300 (alto)
metabolicEfficiency: 1.2-1.5 (alto)
mutationRate: 0.01-0.05 (bajo)
```
**Nicho:** Sedimento, recursos escasos  
**Ventaja:** Supervivencia prolongada  
**Desventaja:** Reproducción lenta

### Estrategia "Generalista Equilibrado"
```
size: 15-20 (medio)
flagellaLevel: 2-3 (medio)
storageCapacity: 175-225 (medio)
metabolicEfficiency: 0.9-1.1 (medio)
mutationRate: 0.08-0.12 (medio)
```
**Nicho:** Cualquiera  
**Ventaja:** Versátil  
**Desventaja:** No especializado

---

## 📚 Referencias Científicas

Cada trait está documentado con referencias a investigación peer-reviewed:

- **Mutation Rate:** Drake 1991, Eigen 1971, Poole et al. 1998
- **Metabolism:** Martin & Russell 2007, Müller et al. 2012, Nakagawa & Takai 2008
- **Size:** Koch 1996, West et al. 1997, Savage et al. 2004
- **Color:** Falkowski & Raven 2007, Cockell & Knowland 1999
- **Storage:** Koch 1996, Preiss & Romeo 1989
- **Flagella:** Berg 2003, Mitchell 2002
- **Efficiency:** Lane & Martin 2010, Brown et al. 2004

---

## 🔧 Configuración (Constants.js)

### LUCA Variability Levels
```javascript
LUCA_VARIABILITY_LEVEL: 'HIGH'  // NONE, MEDIUM, HIGH

LUCA_VARIABILITY: {
    HIGH: {
        mutationRate: [0.10, 0.30],
        metabolicEfficiency: [0.7, 1.3],
        storageCapacity: [100, 150],
        size: [8, 15],
        color: [[100,200,200], [200,255,255]],
        flagellaLevel: [0, 2]
    }
}
```

### Evolution Parameters
```javascript
ENVIRONMENTAL_STABILITY_ENABLED: true
LUCA_DIVERGENCE_CHANCE: 0.01        // 1% per reproduction
CROSS_METABOLISM_CHANCE: 0.00001    // 0.001% (extremely rare)
```

---

*Documentación completa actualizada - 2025-12-19*
