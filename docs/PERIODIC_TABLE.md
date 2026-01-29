# Sistema de Tabla Periódica

## 📖 Descripción

Sistema completo y científicamente preciso de la tabla periódica con los 118 elementos químicos. Diseñado de forma modular y desacoplada para facilitar su integración futura con el simulador Cells.

## 🎯 Características

### ✅ Implementado (Elementos 1-20)

- **20 elementos biológicamente relevantes** (H a Ca)
- **Datos científicos fidedignos** de fuentes oficiales (IUPAC, NIST)
- **Propiedades completas**:
  - Básicas (número atómico, símbolo, masa, categoría)
  - Físicas (densidad, puntos de fusión/ebullición, fase)
  - Químicas (configuración electrónica, electronegatividad, estados de oxidación)
  - Biológicas (rol en organismos, esencialidad, toxicidad)
  - Geoquímicas (abundancia en corteza, océanos, meteoritos)
  - Históricas (descubrimiento, origen del nombre)
- **Sistema de búsqueda avanzado**
- **Filtrado por múltiples criterios**
- **Interfaz de demostración interactiva**
- **Sistema Molecular Integrado** (Vea [MOLECULAR_SYSTEM.md](MOLECULAR_SYSTEM.md))

### 🚧 Pendiente

- Elementos 21-118 (en desarrollo)
- Integración con el simulador Cells
- Visualización de tabla periódica completa
- Sistema de reacciones químicas

## 📁 Estructura de Archivos

```
src/chemistry/
├── Element.js              # Clase base para cada elemento
├── PeriodicTable.js        # Gestor principal del sistema
├── ElementCategories.js    # Definiciones de categorías
├── ChemistrySystem.js      # Inicializador del sistema
├── data/
│   ├── elements_001_020.js # H a Ca (✅ Completo)
│   ├── elements_021_040.js # Sc a Zr (🚧 Pendiente)
│   ├── elements_041_060.js # Nb a Nd (🚧 Pendiente)
│   ├── elements_061_080.js # Pm a Hg (🚧 Pendiente)
│   ├── elements_081_100.js # Tl a Fm (🚧 Pendiente)
│   └── elements_101_118.js # Md a Og (🚧 Pendiente)
└── utils/
    ├── ElementSearch.js    # (🚧 Futuro)
    └── ElementValidator.js # (🚧 Futuro)

chemistry_demo.html         # Demostración interactiva
```

## 🚀 Uso Básico

### Inicialización

```javascript
// El sistema se inicializa automáticamente al cargar
window.chemistrySystem.initialize();
```

### Búsqueda de Elementos

```javascript
// Por símbolo
const hydrogen = chemistrySystem.getElement('H');

// Por nombre (inglés o español)
const oxygen = chemistrySystem.getElement('Oxygen');
const carbono = chemistrySystem.getElement('Carbono');

// Por número atómico
const nitrogen = chemistrySystem.getElement(7);
```

### Filtrado

```javascript
// Elementos esenciales para la vida
const essential = chemistrySystem.getEssentialElements();

// Macronutrientes (CHNOPS)
const macro = chemistrySystem.getMacronutrients();

// Por categoría
const metals = chemistrySystem.periodicTable.getMetals();
const nonmetals = chemistrySystem.periodicTable.getNonmetals();

// Por grupo o periodo
const alkaliMetals = chemistrySystem.periodicTable.getByGroup(1);
const period2 = chemistrySystem.periodicTable.getByPeriod(2);

// Por abundancia
const abundant = chemistrySystem.periodicTable.getMostAbundantInCrust(10);
```

### Propiedades de un Elemento

```javascript
const carbon = chemistrySystem.getElement('C');

// Propiedades básicas
console.log(carbon.atomicNumber);        // 6
console.log(carbon.symbol);              // 'C'
console.log(carbon.name);                // 'Carbon'
console.log(carbon.atomicMass);          // 12.011

// Propiedades físicas
console.log(carbon.density);             // 2.267 g/cm³
console.log(carbon.meltingPoint);        // 3823 K
console.log(carbon.phase);               // 'solid'

// Propiedades químicas
console.log(carbon.electronegativity);   // 2.55
console.log(carbon.electronConfiguration); // '[He] 2s² 2p²'

// Propiedades biológicas
console.log(carbon.essentialForLife);    // true
console.log(carbon.biologicalRole);      // 'Fundamental building block...'

// Métodos útiles
console.log(carbon.isMetal());           // false
console.log(carbon.isEssential());       // true
console.log(carbon.getMeltingPointCelsius()); // 3549.85 °C
```

## 🧪 Demo Interactiva

Abre `chemistry_demo.html` en tu navegador para ver una demostración interactiva del sistema:

1. **Búsqueda**: Busca elementos por símbolo, nombre o número atómico
2. **Filtros rápidos**: Elementos esenciales, macronutrientes, metales, etc.
3. **Tarjetas detalladas**: Información completa de cada elemento
4. **Estadísticas**: Resumen del sistema

## 📊 Datos Científicos

Todos los datos provienen de fuentes oficiales y verificadas:

### Fuentes Principales

1. **IUPAC** (International Union of Pure and Applied Chemistry)
   - Nomenclatura oficial
   - Masas atómicas estándar
   - Configuraciones electrónicas

2. **NIST** (National Institute of Standards and Technology)
   - Propiedades físicas y químicas
   - Datos termodinámicos
   - Constantes atómicas

3. **WebElements**
   - Datos compilados y verificados
   - Información histórica
   - Abundancias geoquímicas

4. **Royal Society of Chemistry**
   - Periodic Table data
   - Propiedades actualizadas

### Propiedades Incluidas

#### Básicas
- Número atómico (Z)
- Símbolo químico
- Nombre (inglés y español)
- Masa atómica (u)
- Categoría (metal, no-metal, etc.)
- Grupo, periodo, bloque

#### Físicas
- Densidad (g/cm³)
- Punto de fusión (K)
- Punto de ebullición (K)
- Fase a 25°C
- Color y apariencia

#### Químicas
- Configuración electrónica
- Electronegatividad (Pauling)
- Estados de oxidación
- Energía de ionización (kJ/mol)
- Afinidad electrónica (kJ/mol)
- Radios atómicos (pm)

#### Biológicas
- Rol en organismos vivos
- Esencialidad para la vida
- Nivel de toxicidad
- Biodisponibilidad

#### Geoquímicas
- Abundancia en corteza terrestre (ppm)
- Abundancia en océanos (ppm)
- Abundancia en meteoritos
- Abundancia solar (escala logarítmica)

#### Isótopos
- Isótopos comunes
- Abundancia isotópica (%)
- Vida media

#### Históricas
- Año de descubrimiento
- Descubridor(es)
- Origen del nombre

## 🔬 Elementos Esenciales para la Vida

### Macronutrientes (CHNOPS)
Los 6 elementos fundamentales de la vida:
- **H** (Hidrógeno) - Agua y moléculas orgánicas
- **C** (Carbono) - Base de toda química orgánica
- **N** (Nitrógeno) - Aminoácidos, proteínas, ADN
- **O** (Oxígeno) - Respiración celular, agua
- **P** (Fósforo) - ATP, ADN, ARN, huesos
- **S** (Azufre) - Aminoácidos (cisteína, metionina)

### Elementos Mayores
- **Na** (Sodio) - Impulsos nerviosos, balance de fluidos
- **Mg** (Magnesio) - Enzimas, ADN/ARN, clorofila
- **Cl** (Cloro) - Balance de fluidos, pH
- **K** (Potasio) - Función nerviosa, contracción muscular
- **Ca** (Calcio) - Huesos, dientes, señalización celular

### Oligoelementos
- **B** (Boro) - Plantas, beneficioso para animales
- **F** (Flúor) - Fortalece huesos y dientes
- **Si** (Silicio) - Huesos, tejido conectivo

## 🔮 Integración Futura con Cells

El sistema está diseñado para integrarse fácilmente con el simulador:

### Posibles Usos

1. **Sistema de Vents**
   ```javascript
   // Composición química precisa de emisiones
   const vent = {
       outputs: {
           H2: chemistrySystem.getElement('H'),
           CO2: chemistrySystem.getElement('C'),
           Fe2: chemistrySystem.getElement('Fe')
       }
   };
   ```

2. **Metabolismo Celular**
   ```javascript
   // Elementos esenciales para células
   const cellRequirements = chemistrySystem.getMacronutrients();
   
   // Verificar disponibilidad de nutrientes
   if (chemistrySystem.isEssential('Fe')) {
       // Implementar metabolismo basado en hierro
   }
   ```

3. **Química Ambiental**
   ```javascript
   // Reacciones basadas en propiedades reales
   const element = chemistrySystem.getElement('O');
   if (element.electronegativity > 3.0) {
       // Alta reactividad
   }
   ```

4. **Toxicidad**
   ```javascript
   const mercury = chemistrySystem.getElement('Hg');
   if (mercury.toxicity === 'extreme') {
       // Efectos tóxicos en células
   }
   ```

## 📈 Próximos Pasos

### Fase 2: Elementos 21-118
- [ ] Crear `elements_021_040.js` (Sc a Zr)
- [ ] Crear `elements_041_060.js` (Nb a Nd)
- [ ] Crear `elements_061_080.js` (Pm a Hg)
- [ ] Crear `elements_081_100.js` (Tl a Fm)
- [ ] Crear `elements_101_118.js` (Md a Og)

### Fase 3: Utilidades Avanzadas
- [ ] `ElementSearch.js` - Búsqueda avanzada
- [ ] `ElementValidator.js` - Validación de datos
- [ ] Sistema de comparación entre elementos
- [ ] Exportación a JSON/CSV

### Fase 4: Visualización
- [ ] Tabla periódica visual interactiva
- [ ] Gráficos de propiedades
- [ ] Comparación visual de elementos

### Fase 5: Integración con Cells
- [ ] Conectar con sistema de vents
- [ ] Integrar con metabolismo celular
- [ ] Implementar reacciones químicas
- [ ] Sistema de toxicidad

## 🤝 Contribuir

Para añadir más elementos:

1. Seguir el formato de `elements_001_020.js`
2. Verificar datos con fuentes oficiales (IUPAC, NIST)
3. Incluir todas las propiedades requeridas
4. Documentar fuentes en el array `sources`

## 📝 Licencia

Este sistema es parte del proyecto Cells y está bajo la misma licencia MIT.

---

**Desarrollado con 🧪 y ☕ para el proyecto Cells**

*Datos científicos verificados de IUPAC, NIST y otras fuentes oficiales*
