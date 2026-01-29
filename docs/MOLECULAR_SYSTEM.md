# Sistema Molecular - Documentación

## 📖 Descripción

Complemento del sistema de tabla periódica que permite la creación y gestión de moléculas químicamente precisas. Este sistema vincula los elementos de la tabla periódica con las sustancias compuestas utilizadas en el simulador Cells (como H₂, CO₂, etc.), proporcionando propiedades físicas, químicas y termodinámicas fidedignas.

## 🎯 Características

### ✅ Implementado

- **Clase Molecule**: Representación de sustancias compuestas con cálculo automático de masa molecular a partir de átomos.
- **MolecularLibrary**: Biblioteca con las 21+ moléculas más importantes:
  - **Grids de juego**: H₂, CO₂, CH₄, H₂S, NH₃, O₂, Fe²⁺.
  - **Biológicamente críticas**: H₂O, N₂, Mg²⁺, Ca²⁺, PO₄³⁻.
  - **Prebióticas**: HCN, HCHO, Glicina.
  - **Energía y Herencia (Fase 4)**: ATP/ADP, Acetil-CoA, Ribosa, Adenina, Lactato.
- **Soporte para Iones**: Manejo de carga eléctrica y representación correcta de cationes y aniones.
- **Capa de Bio-Maquinaria (Proteínas y Enzimas)**: 
  - **Proteome**: Inventario interno de cada célula para gestionar sus herramientas químicas.
  - **Enzimas con Cofactores**: Catalizadores que requieren metales de transición (Fe, Mo, Cu, Ni) para funcionar a máxima eficiencia.
  - **Traducción Genética**: El ADN ahora decide qué proteínas fabricar basándose en el entorno.
  - Masas moleculares reales (calculadas de la tabla periódica).
  - Puntos de fusión y ebullición.
  - Polaridad y tipo de enlace.
  - Energías de formación (ΔHf°) y Gibbs (ΔGf°).
  - Toxicidad y relevancia metabólica.
- **Integración con Grids**: Mapeo directo entre la molécula y el grid de Cells (ej: `H2` ↔ `h2Grid`).
- **Demostración Interactiva**: Interfaz visual en `molecule_demo.html`.

## 📁 Arquitectura

```
src/chemistry/
├── Molecule.js             # Clase base de molécula
├── MolecularSystem.js      # Gestor de moléculas
├── data/
│   └── molecules.js        # Datos de moléculas predefinidas
├── ChemistrySystem.js      # Punto de entrada unificado
```

## 🚀 Guía de Uso

### Acceso Unificado

El `ChemistrySystem` es el punto de entrada para ambos sistemas:

```javascript
// Obtener una molécula
const h2 = chemistrySystem.getMolecule('H2');

// Obtener por grid
const ch4 = chemistrySystem.getMoleculeByGrid('ch4Grid');
```

### Propiedades de la Molécula

```javascript
const h2s = chemistrySystem.getMolecule('H2S');

console.log(h2s.molecularMass);      // 34.08 g/mol (calculado)
console.log(h2s.getUnicodeFormula()); // "H₂S"
console.log(h2s.isToxic());          // true
console.log(h2s.polarity);           // "polar"
```

### Conversiones de Concentración

El sistema facilita la transición de valores arbitrarios de "intensidad" a valores químicos reales:

```javascript
const intensity = environment.h2Grid[x][y];
const molecule = chemistrySystem.getMolecule('H2');

// Convertir a moles (asumiendo unidad de masa / L)
const moles = molecule.concentrationToMoles(intensity);
```

## 📊 Moléculas Implementadas

| Fórmula | Nombre | Masa (g/mol) | Grid en Cells |
|:---:|---|:---:|:---:|
| **H₂** | Hidrógeno | 2.016 | `h2Grid` |
| **CO₂** | Dióxido de Carbono | 44.01 | `co2Grid` |
| **CH₄** | Metano | 16.04 | `ch4Grid` |
| **H₂S** | Sulfuro de Hidrógeno | 34.08 | `h2sGrid` |
| **NH₃** | Amoníaco | 17.03 | `nh3Grid` |
| **O₂** | Oxígeno | 32.00 | `oxygenGrid` |
| **H₂O** | Agua | 18.015 | - |
| **N₂** | Nitrógeno | 28.01 | - |

## 🧪 Próximos Pasos

1. **Energética Metabólica**: Usar ΔGf° para calcular rendimientos de ATP reales en las rutas metabólicas actuales.
2. **Estequiometría**: Validar que el consumo de recursos en `MetabolicCosts.js` respeta las proporciones de las moléculas (ej: 4 H₂ por cada CO₂ en metanogénesis).
3. **Capa del Medio**: Definir el agua (H₂O) no solo como molécula, sino como solvente que afecta la difusión y reactividad.
4. **Isótopos y Fraccionamiento**: (Avanzado) Simular cómo los procesos biológicos prefieren ciertos isótopos de C u O.
