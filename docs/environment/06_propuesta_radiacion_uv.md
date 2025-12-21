# Radiación UV - Mecánica de Daño y Fotoprotección

**Propósito:** Añadir presión selectiva realista basada en radiación ultravioleta  
**Contexto:** Océano primordial sin capa de ozono (4.0-3.5 Ga)  
**Estado:** Propuesta de implementación

---

## 🔬 Base Científica

### Radiación UV en Tierra Primordial

**Sin capa de ozono (pre-2.4 Ga):**
- **UV-C (200-280 nm):** Extremadamente dañina, penetra agua
- **UV-B (280-315 nm):** Muy dañina, penetra parcialmente
- **UV-A (315-400 nm):** Moderadamente dañina, penetra profundamente

**Intensidad estimada:**
- **10-100× mayor** que niveles modernos en superficie
- **Penetración en agua:** 10-50 metros (vs <1m hoy)
- **Daño molecular:** Dímeros de timina, roturas de ADN, ROS

**Consecuencias biológicas:**
- **Mutaciones:** Aumento de tasa de mutación
- **Muerte celular:** Daño irreparable al ADN
- **Presión selectiva:** Favorece fotoprotección y reparación de ADN

---

## 💡 Propuesta de Mecánicas

### 1. Gradiente de Radiación UV

#### Distribución Vertical
```javascript
// Environment.js - Nuevo grid
this.uvRadiationGrid = [];

// Inicialización
for (let i = 0; i < this.cols; i++) {
    for (let j = 0; j < this.rows; j++) {
        // Decaimiento exponencial con profundidad (más rápido que luz visible)
        let depthFactor = exp(-j * 0.15);  // Decae 3x más rápido que luz
        
        // UV máxima en superficie, mínima en profundidad
        this.uvRadiationGrid[i][j] = 100 * depthFactor;
    }
}
```

#### Niveles por Zona
```javascript
Superficie (0-10%):     80-100 (extremo)
Zona Alta (10-30%):     40-80  (alto)
Zona Media (30-60%):    10-40  (moderado)
Zona Profunda (60-90%): 1-10   (bajo)
Sedimento (90-100%):    0-1    (mínimo)
```

---

### 2. Daño por UV

#### Mecanismo de Daño
```javascript
// Entity.js - update()
applyUVDamage(environment) {
    // Obtener nivel de UV en posición actual
    let col = floor(this.pos.x / environment.resolution);
    let row = floor(this.pos.y / environment.resolution);
    let uvLevel = environment.uvRadiationGrid[col][row];
    
    // Calcular fotoprotección (basada en color)
    let photoprotection = ColorSystem.calculatePhotoprotection(this.dna.color);
    
    // Daño efectivo (UV / protección)
    let effectiveUV = uvLevel / photoprotection;
    
    // Probabilidad de daño por frame
    let damageChance = map(effectiveUV, 0, 100, 0, 0.01);  // 0-1% por frame
    
    if (random(1) < damageChance) {
        this.applyUVDamageEffect(effectiveUV);
    }
}
```

#### Tipos de Daño

**1. Daño Energético (siempre)**
```javascript
applyUVDamageEffect(effectiveUV) {
    // Costo de reparación celular
    let repairCost = map(effectiveUV, 0, 100, 0, 2.0);
    this.energy -= repairCost;
}
```

**2. Mutación Inducida (probabilístico)**
```javascript
// Aumenta tasa de mutación temporalmente
if (random(1) < 0.3) {  // 30% de eventos de daño
    // Próxima reproducción tendrá mutación extra
    this.uvMutationPending = true;
}

// En ReproductionSystem.reproduce()
if (parent.uvMutationPending) {
    // Mutación adicional por UV
    childDNA = DNAMutator.applyUVMutation(childDNA);
    parent.uvMutationPending = false;
}
```

**3. Muerte Celular (raro pero posible)**
```javascript
// Daño letal si UV muy alta y sin protección
if (effectiveUV > 80 && random(1) < 0.001) {  // 0.1% si UV extrema
    this.isDead = true;
    this.deathCause = 'UV_RADIATION';
}
```

---

### 3. Fotoprotección por Color

#### Actualización de ColorSystem
```javascript
// ColorSystem.js - Mejorado
static calculatePhotoprotection(color) {
    let brightness = this.calculateBrightness(color);
    
    // Pigmentos oscuros protegen más
    // Basado en melanina, carotenoides
    let protection = map(
        brightness,
        0, 255,      // Rango de brillo
        2.5, 1.0     // Oscuro: 2.5x protección, Claro: 1.0x
    );
    
    return protection;
}
```

#### Efectividad por Color
| Color                     | Brillo | Protección | UV Efectiva (superficie) |
| ------------------------- | ------ | ---------- | ------------------------ |
| Negro (0,0,0)             | 0      | 2.5x       | 40 (tolerable)           |
| Gris oscuro (100,100,100) | 100    | 1.8x       | 55 (moderado)            |
| Gris medio (150,150,150)  | 150    | 1.4x       | 71 (alto)                |
| Gris claro (200,200,200)  | 200    | 1.1x       | 91 (extremo)             |
| Blanco (255,255,255)      | 255    | 1.0x       | 100 (letal)              |

---

### 4. Sistemas de Reparación de ADN

#### Trait Nuevo: DNA Repair Efficiency
```javascript
// DNAFactory.js - Añadir a LUCA
dnaRepairEfficiency: random(0.3, 0.7)  // LUCA tiene reparación primitiva
```

#### Mecánica de Reparación
```javascript
// Entity.js
applyUVDamageEffect(effectiveUV) {
    // Costo base de reparación
    let baseCost = map(effectiveUV, 0, 100, 0, 2.0);
    
    // Eficiencia de reparación reduce costo
    // Alta eficiencia = reparación más barata
    let repairCost = baseCost / this.dna.dnaRepairEfficiency;
    
    this.energy -= repairCost;
    
    // Reparación imperfecta puede causar mutaciones
    if (random(1) > this.dna.dnaRepairEfficiency) {
        this.uvMutationPending = true;
    }
}
```

#### Evolución de Reparación
```javascript
// DNAMutator.js
dnaRepairEfficiency: constrain(
    parentDNA.dnaRepairEfficiency + random(-0.05 * mr, 0.05 * mr),
    0.1,  // Mínimo (reparación muy primitiva)
    1.0   // Máximo (reparación perfecta)
)
```

---

## 🧬 Presiones Evolutivas

### 1. Gradiente de Color

**Superficie (UV alta):**
- ⬇️ **Presión hacia color oscuro**
- Células claras mueren o gastan mucha energía
- Células oscuras dominan

**Profundidad (UV baja):**
- ⬆️ **Presión hacia color claro**
- Pigmentos oscuros cuestan energía sin beneficio
- Células claras dominan

**Resultado esperado:**
```
Superficie (0-30%):  Color oscuro (brillo 50-100)
Zona Media (30-70%): Color medio (brillo 100-180)
Profundidad (70-100%): Color claro (brillo 180-255)
```

---

### 2. Evolución de Reparación de ADN

**Trade-off:**
- **Alta eficiencia:** Menor daño por UV, pero costo metabólico
- **Baja eficiencia:** Mayor daño por UV, pero ahorro energético

**Presión selectiva:**
- **Superficie:** Alta eficiencia necesaria (UV intensa)
- **Profundidad:** Baja eficiencia suficiente (UV mínima)

**Evolución esperada:**
```
Gen 0-50:   dnaRepairEfficiency 0.3-0.7 (primitivo)
Gen 50-200: Superficie → 0.7-0.9 (mejorado)
            Profundidad → 0.3-0.5 (primitivo)
Gen 200+:   Especialización completa
```

---

### 3. Migración Vertical

**Comportamiento emergente:**
- Células sin protección migran a profundidad
- Células con protección pueden explotar superficie
- Segregación espacial por color

---

## 📊 Parámetros de Configuración

### Constants.js - Nuevas Constantes
```javascript
// UV Radiation System
UV_RADIATION_ENABLED: true,
UV_SURFACE_INTENSITY: 100,           // Intensidad en superficie
UV_DECAY_RATE: 0.15,                 // Decaimiento con profundidad
UV_DAMAGE_CHANCE_MAX: 0.01,          // 1% máximo por frame
UV_REPAIR_COST_MAX: 2.0,             // Máximo costo energético
UV_LETHAL_THRESHOLD: 80,             // UV efectiva para muerte
UV_LETHAL_CHANCE: 0.001,             // 0.1% muerte si >threshold
UV_MUTATION_CHANCE: 0.3,             // 30% eventos causan mutación

// DNA Repair
DNA_REPAIR_MIN: 0.1,                 // Eficiencia mínima
DNA_REPAIR_MAX: 1.0,                 // Eficiencia máxima
DNA_REPAIR_MUTATION_RANGE: 0.05,    // Rango de mutación
DNA_REPAIR_COST_MULTIPLIER: 0.1     // Costo metabólico por eficiencia
```

---

## 🎮 Implicaciones en Gameplay

### Fase Temprana (Gen 0-50)
- 🎲 **Exploración de color:** Diversidad alta
- ☠️ **Mortalidad superficial:** Células claras mueren
- 📈 **Selección rápida:** Color oscuro en superficie

### Fase Media (Gen 50-200)
- 🌈 **Gradiente de color:** Oscuro arriba, claro abajo
- 🧬 **Reparación evoluciona:** Superficie mejora eficiencia
- ⚖️ **Trade-offs claros:** Protección vs costo

### Fase Tardía (Gen 200+)
- 🎯 **Especialización completa:** Color por profundidad
- 🔬 **Reparación optimizada:** Alta en superficie, baja en profundidad
- 🌍 **Ecosistema estratificado:** UV como factor clave

---

## 🔬 Validación Científica

### Evidencia Biológica

**1. Fotoprotección por pigmentos:**
- **Melanina:** Absorbe UV, protege ADN (humanos, hongos)
- **Carotenoides:** Antioxidantes, protegen de ROS (bacterias, plantas)
- **Micosporinas:** Absorben UV (cianobacterias, algas)

**2. Reparación de ADN:**
- **Fotorreactivación:** Enzima fotoliasa repara dímeros de timina
- **Reparación por escisión:** Corta y reemplaza ADN dañado
- **Evolución:** Sistemas más complejos en organismos modernos

**3. Gradientes ecológicos:**
- **Profundidad:** Organismos superficiales más pigmentados
- **Latitud:** Organismos tropicales más pigmentados (UV alta)
- **Evolución convergente:** Múltiples linajes evolucionan protección

---

## 📈 Interacciones con Otros Sistemas

### UV + Color
- **Sinergia directa:** Color oscuro = protección UV
- **Costo-beneficio:** Pigmentos cuestan energía
- **Gradiente vertical:** Optimización por profundidad

### UV + Mutation Rate
- **Daño UV aumenta mutaciones:** Presión adicional
- **Reparación reduce mutaciones:** Contrarresta daño
- **Interacción compleja:** UV + reparación + mutación base

### UV + Metabolismo
- **Fermentación superficial:** Sufre UV + toxicidad O₂
- **Quimiosíntesis profunda:** Evita UV completamente
- **Segregación reforzada:** UV añade presión espacial

---

## 🔧 Implementación Sugerida

### Fase 1: UV Básica (Mínimo Viable)
```javascript
1. Crear uvRadiationGrid con gradiente vertical
2. Aplicar daño energético basado en UV / photoprotection
3. Usar ColorSystem.calculatePhotoprotection existente
```

### Fase 2: Mutaciones UV (Intermedio)
```javascript
4. Añadir uvMutationPending flag
5. Aplicar mutación extra en reproducción
6. Visualizar células con daño UV (opcional)
```

### Fase 3: Reparación de ADN (Completo)
```javascript
7. Añadir dnaRepairEfficiency trait
8. Costo de reparación basado en eficiencia
9. Evolución de eficiencia de reparación
10. Costo metabólico de alta eficiencia
```

### Fase 4: Muerte por UV (Avanzado)
```javascript
11. Muerte probabilística si UV > threshold
12. Tracking de causa de muerte
13. Estadísticas de mortalidad por UV
```

---

## 📊 Métricas de Éxito

### Indicadores de Funcionamiento Correcto

1. **Gradiente de color:**
   - Superficie: Brillo promedio <120
   - Profundidad: Brillo promedio >180

2. **Mortalidad por UV:**
   - Superficie: 5-10% muertes por UV
   - Profundidad: <1% muertes por UV

3. **Eficiencia de reparación:**
   - Superficie: 0.7-0.9
   - Profundidad: 0.3-0.5

4. **Segregación espacial:**
   - Células oscuras concentradas en superficie
   - Células claras concentradas en profundidad

---

## 🎯 Beneficios de la Implementación

### Realismo Científico
- ✅ Basado en biología real (fotoprotección, reparación ADN)
- ✅ Contexto histórico correcto (océano sin ozono)
- ✅ Presiones evolutivas documentadas

### Gameplay
- ✅ Añade presión selectiva vertical
- ✅ Refuerza gradiente de color
- ✅ Crea trade-offs interesantes (protección vs costo)
- ✅ Aumenta complejidad estratégica

### Educativo
- ✅ Enseña sobre radiación UV
- ✅ Muestra evolución de fotoprotección
- ✅ Demuestra reparación de ADN

---

## 📚 Referencias Científicas

- **Cockell, C. S. & Knowland, J. (1999).** Ultraviolet radiation screening compounds. *Biological Reviews*, 74(3), 311-345.
- **Sinha, R. P. & Häder, D. P. (2002).** UV-induced DNA damage and repair. *Photochemical & Photobiological Sciences*, 1(4), 225-236.
- **Garcia-Pichel, F. (1998).** Solar ultraviolet and the evolutionary history of cyanobacteria. *Origins of Life and Evolution of Biospheres*, 28(3), 321-347.
- **Kasting, J. F. (1993).** Earth's early atmosphere. *Science*, 259(5097), 920-926.

---

*Propuesta de implementación - Radiación UV con rigor científico*
*Prioridad: Media-Alta (añade profundidad sin romper balance)*
