# 06. Capacidad de Almacenamiento (Storage Capacity)

**Categoría:** Rasgo Funcional  
**Rango:** 100-300  
**Inicial:** 100-150  
**Mutación:** ±10 × mutationRate × 10

---

## 🔬 Traducción Biológica

### VACUOLAS / COMPARTIMENTOS DE ALMACENAMIENTO
- **Qué son:** Estructuras celulares que almacenan nutrientes
- **Función:** Reserva de recursos para períodos de escasez
- **Ejemplos reales:**
  - **Vacuolas:** Células vegetales (hasta 90% del volumen)
  - **Gránulos de glucógeno:** Bacterias y animales
  - **Gotas lipídicas:** Almacenamiento de grasas
  - **Polifosfatos:** Reserva de fósforo en bacterias

**Trade-off biológico:**
- Alta capacidad = Mayor supervivencia en escasez, pero mayor tamaño celular
- Baja capacidad = Menor tamaño, pero vulnerable a fluctuaciones

---

## ⚙️ Implementación Actual

### Código
```javascript
// MembraneSystem.js - Interacción con tamaño
calculateStorageCapacity(baseCapacity, size) {
    return baseCapacity * pow(size / 15, 1.5);
}

// Entity.js - Límites de recursos
this.maxResources = MembraneSystem.calculateStorageCapacity(
    this.dna.storageCapacity,
    this.dna.size
);
```

### Efectos
- ✅ **Capacidad máxima:** Define límite de recursos almacenables
- ✅ **Interacción con tamaño:** Células grandes almacenan más (no-lineal)
- ✅ **Supervivencia:** Mayor capacidad = más tiempo sin comer
- ✅ **Reproducción:** Necesita 75% de capacidad para reproducirse

---

## 💡 Mecánicas del Juego

### Alta Capacidad (250-300)
**Ventajas:**
- 🔋 Gran reserva de recursos
- ⏱️ Supervivencia prolongada sin alimento
- 🌊 Resistente a fluctuaciones ambientales
- 🎯 Mejor en ambientes variables

**Desventajas:**
- ⏳ Tarda más en llenar reservas
- 🐌 Reproducción más lenta (necesita más recursos)
- 💸 Mayor inversión inicial

### Baja Capacidad (100-150)
**Ventajas:**
- ⚡ Llena reservas rápidamente
- 🐰 Reproducción más rápida
- 💰 Menor inversión de recursos
- 🏃 Mejor en ambientes estables y ricos

**Desventajas:**
- ☠️ Vulnerable a escasez
- ⚠️ Muerte rápida sin alimento
- 📉 Inestable en ambientes variables

### Capacidad Media (175-225)
**Equilibrada:**
- ⚖️ Balance entre velocidad y seguridad
- 🎯 Versátil
- 📊 Estrategia general

---

## 📊 Evaluación: **8/10**

### ✅ Fortalezas
> [!TIP]
> **BUENA MECÁNICA CON INTERACCIONES**
> 
> - Interactúa con tamaño celular
> - Trade-off claro (velocidad vs seguridad)
> - Biológicamente realista
> - Afecta supervivencia y reproducción

### ❌ Debilidades Menores
- Podría tener costo metabólico (mantener vacuolas)
- Podría afectar velocidad (células "llenas" más lentas)

### 🔧 Mejoras Propuestas

#### Costo de Mantenimiento
```javascript
// Vacuolas grandes cuestan energía mantener
let storageCost = (this.dna.storageCapacity - 100) * 0.0001;
this.energy -= storageCost;
```

#### Penalización por Llenado
```javascript
// Células llenas se mueven más lento
let fillRatio = this.energy / this.maxResources;
let speedPenalty = map(fillRatio, 0, 1, 1.0, 0.8);
this.effectiveSpeed *= speedPenalty;
```

---

## 🧬 Evolución Esperada

### Ambientes Estables y Ricos
- 🐰 **Baja capacidad domina**
- Reproducción rápida
- No necesita reservas grandes
- Estrategia r

### Ambientes Variables
- 🔋 **Alta capacidad domina**
- Supervivencia a través de períodos malos
- Reservas críticas
- Estrategia K

### Ambientes Pobres pero Estables
- ⚖️ **Capacidad media óptima**
- Balance entre eficiencia y seguridad
- Adaptación gradual

---

## 🔬 Biología Real

### Almacenamiento Celular

#### Bacterias
- **Glucógeno:** Reserva de carbono/energía
- **Polifosfatos:** Reserva de fósforo (crítico)
- **Lípidos:** Almacenamiento de alta densidad energética
- **Capacidad:** 10-30% del peso seco

#### Eucariotas
- **Vacuolas:** Hasta 90% del volumen celular (plantas)
- **Gotas lipídicas:** Adipocitos (células grasas)
- **Glucógeno:** Hígado y músculos
- **Capacidad:** Variable (5-95% del volumen)

### Estrategias Ecológicas
- **Copiótrofos:** Baja capacidad, crecimiento rápido
- **Oligótrofos:** Alta capacidad, crecimiento lento
- **Generalistas:** Capacidad media, versátiles

---

## 🎮 Implicaciones en el Juego

### Fase Temprana (Gen 0-50)
- 🎲 Diversidad de capacidades
- 📊 Exploración de estrategias
- 🔄 Selección según ambiente

### Fase Media (Gen 50-200)
- 🌊 Segregación por nicho
- 🔋 Alta capacidad en zonas profundas (recursos escasos)
- 🐰 Baja capacidad en superficie (recursos abundantes)

### Fase Tardía (Gen 200+)
- 🎯 Especialización por hábitat
- 📈 Distribuciones estables
- 🌍 Correlación capacidad-ambiente

---

## 📈 Interacción con Otros Rasgos

### Tamaño × Capacidad
```
Capacidad Real = storageCapacity × (size/15)^1.5

Ejemplos:
- Pequeña (size=5) + Alta capacidad (300):  ~50 recursos max
- Grande (size=40) + Baja capacidad (100):  ~700 recursos max
- Media (size=15) + Media capacidad (200):  200 recursos max
```

**Implicación:** Tamaño amplifica capacidad de almacenamiento

### Eficiencia × Capacidad
- Alta eficiencia + Baja capacidad = Estrategia óptima en abundancia
- Baja eficiencia + Alta capacidad = Necesita grandes reservas
- Balance necesario para supervivencia

---

*Basado en: Koch 1996 (Bacterial storage), Preiss & Romeo 1989 (Glycogen metabolism)*
