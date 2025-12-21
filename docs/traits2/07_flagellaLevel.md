# 07. Nivel de Flagelos (Flagella Level)

**Categoría:** Rasgo de Locomoción  
**Rango:** 0-6  
**Inicial:** 0-2  
**Mutación:** ±0.5 × mutationRate (redondeado)

---

## 🔬 Traducción Biológica

### FLAGELOS BACTERIANOS
- **Qué son:** Estructuras proteicas rotatorias para locomoción
- **Función:** Movimiento activo vs movimiento browniano
- **Componentes:**
  - **Motor flagelar:** ~40 proteínas diferentes
  - **Filamento:** Flagelina (proteína estructural)
  - **Gancho:** Articulación flexible
  - **Costo:** ~2% del presupuesto proteico celular

**Trade-off biológico:**
- Con flagelos = Movimiento dirigido, pero alto costo energético
- Sin flagelos = Movimiento browniano, bajo costo

---

## ⚙️ Implementación Actual

### Código
```javascript
// Entity.js - Movimiento
if (this.dna.flagellaLevel > 0) {
    // Movimiento activo
    let speed = this.dna.flagellaLevel * 0.5;
    this.applyForce(randomDirection.mult(speed));
} else {
    // Movimiento browniano
    this.applyForce(p5.Vector.random2D().mult(0.1));
}

// FlagellaCosts.js - Costos
static calculateMaintenance(flagellaLevel) {
    return 0.03 * flagellaLevel;  // Por frame
}

static calculateMovementCost(velocity, flagellaLevel) {
    return 0.02 * velocity.mag() * flagellaLevel;
}

static calculateConstructionCost(oldLevel, newLevel) {
    let increment = newLevel - oldLevel;
    return {
        energy: 10 * increment,
        phosphorus: 0.2 * increment
    };
}
```

### Efectos
- ✅ **Velocidad:** Mayor nivel = mayor velocidad (0.5x por nivel)
- ✅ **Costo de mantenimiento:** 0.03 energía/frame por nivel
- ✅ **Costo de movimiento:** Proporcional a velocidad y nivel
- ✅ **Costo de construcción:** 10 energía + 0.2 fósforo por nivel
- ✅ **Visual:** Células con flagelos se mueven más

---

## 💡 Mecánicas del Juego

### Sin Flagelos (Nivel 0)
**Ventajas:**
- 💰 Costo cero (mantenimiento y movimiento)
- ⚡ Más energía para otras funciones
- 🎯 Estrategia pasiva viable

**Desventajas:**
- 🎲 Movimiento aleatorio (browniano)
- 🐌 Muy lento (0.1 velocidad)
- ❌ No puede escapar de peligros
- 📉 No puede buscar recursos activamente

### Flagelos Bajos (Nivel 1-2)
**Ventajas:**
- 🏃 Movimiento moderado (0.5-1.0 velocidad)
- 💰 Costo bajo-moderado
- ⚖️ Balance costo-beneficio
- 🎯 Búsqueda básica de recursos

**Desventajas:**
- 💸 Costo de mantenimiento (0.03-0.06/frame)
- ⚡ Menos energía disponible
- 🔧 Costo de construcción inicial

### Flagelos Altos (Nivel 5-6)
**Ventajas:**
- 🚀 Movimiento rápido (2.5-3.0 velocidad)
- 🏃 Escape efectivo
- 🎯 Búsqueda activa eficiente
- 💪 Exploración rápida

**Desventajas:**
- 💸💸 Alto costo de mantenimiento (0.15-0.18/frame)
- ⚡⚡ Alto costo de movimiento
- 🔧 Construcción muy costosa (50-60 energía)
- 📉 Menos energía para reproducción

---

## 📊 Evaluación: **9/10** ⭐

### ✅ Fortalezas
> [!TIP]
> **EXCELENTE SISTEMA DE TRADE-OFFS**
> 
> - Tres tipos de costos (mantenimiento, movimiento, construcción)
> - Trade-off claro (velocidad vs energía)
- Biológicamente realista
> - Permite estrategias diversas
> - Afecta múltiples aspectos del juego

### ❌ Debilidades Menores
- Podría tener costo de fósforo en mantenimiento (proteínas)
- Podría interactuar con tamaño (células grandes necesitan más flagelos)

---

## 🧬 Evolución Esperada

### Ambientes Ricos en Recursos
- 🚀 **Flagelos altos dominan**
- Búsqueda activa rentable
- Costo energético sostenible
- Competencia por velocidad

### Ambientes Pobres en Recursos
- 💰 **Sin flagelos o bajos**
- Conservación de energía crítica
- Movimiento browniano suficiente
- Estrategia de espera

### Ambientes con Depredadores (futuro)
- 🏃 **Flagelos altos para escape**
- Velocidad = supervivencia
- Costo justificado

### Ambientes Estables
- ⚖️ **Flagelos medios (2-3)**
- Balance entre búsqueda y costo
- Estrategia versátil

---

## 🔬 Biología Real

### Flagelos Bacterianos

#### Estructura
- **Diámetro:** ~20 nm
- **Longitud:** 10-20 μm (varias veces el tamaño celular)
- **Rotación:** 200-1000 rpm
- **Velocidad:** 20-60 μm/s (~10-30 longitudes corporales/s)

#### Costo Energético
- **Construcción:** ~2% del presupuesto proteico
- **Mantenimiento:** Proteínas flagelares (~40 genes)
- **Operación:** Consume ATP/protones
- **Total:** 5-10% del gasto energético celular

#### Estrategias
- **E. coli:** 4-6 flagelos peritricos (alrededor del cuerpo)
- **Vibrio:** 1 flagelo polar (en un extremo)
- **Células sin flagelos:** Dependen de corrientes, adhesión

### Ecología del Movimiento
- **Copiótrofos:** Alta movilidad (buscan parches de nutrientes)
- **Oligótrofos:** Baja movilidad (conservan energía)
- **Trade-off universal:** Velocidad vs eficiencia energética

---

## 🎮 Implicaciones en el Juego

### Estrategias Viables

#### 1. Estrategia Pasiva (Nivel 0)
- 🌊 Deriva con corrientes
- 💰 Máxima eficiencia energética
- 🎯 Viable en ambientes ricos y estables

#### 2. Estrategia Explorador (Nivel 4-6)
- 🚀 Búsqueda activa
- 💸 Alto costo pero alta recompensa
- 🎯 Viable en ambientes parcheados

#### 3. Estrategia Equilibrada (Nivel 2-3)
- ⚖️ Balance costo-beneficio
- 🎯 Versátil
- 📊 Común en poblaciones

### Interacciones con Otros Rasgos

#### Tamaño × Flagelos
- Células pequeñas + Flagelos altos = Muy rápidas
- Células grandes + Flagelos altos = Moderadamente rápidas (inercia)
- Células grandes + Sin flagelos = Muy lentas

#### Eficiencia × Flagelos
- Alta eficiencia + Flagelos altos = Sostenible
- Baja eficiencia + Flagelos altos = Insostenible (alto consumo)

---

## 📈 Costos Detallados

### Por Nivel
| Nivel | Velocidad | Mant./Frame | Mov./Frame* | Construcción |
| ----- | --------- | ----------- | ----------- | ------------ |
| 0     | 0.1       | 0           | 0           | 0            |
| 1     | 0.5       | 0.03        | ~0.01       | 10 E + 0.2 P |
| 2     | 1.0       | 0.06        | ~0.02       | 20 E + 0.4 P |
| 3     | 1.5       | 0.09        | ~0.03       | 30 E + 0.6 P |
| 4     | 2.0       | 0.12        | ~0.04       | 40 E + 0.8 P |
| 5     | 2.5       | 0.15        | ~0.05       | 50 E + 1.0 P |
| 6     | 3.0       | 0.18        | ~0.06       | 60 E + 1.2 P |

*Costo de movimiento aproximado (depende de velocidad real)

---

*Basado en: Berg 2003 (E. coli motility), Mitchell 2002 (Bacterial flagella), Magariyama & Kudo 2002 (Swimming speed)*
