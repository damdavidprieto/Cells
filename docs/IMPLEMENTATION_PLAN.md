# Plan de Implementación: Balance Energético LUCA

## 🔬 Clasificación por Rigor Científico

### ✅ CIENTÍFICAMENTE RIGUROSAS

#### 1. **Ajustar óptimo térmico LUCA: 60°C** 
**Rigor**: ⭐⭐⭐⭐⭐ MÁXIMO

**Evidencia científica**:
- Martin & Russell (2007): LUCA en vents alcalinos 50-80°C
- Weiss et al. (2016): Termofilia moderada, no extrema
- Stetter (2006): Ancestros termófilos ~60-70°C

**Justificación**: LUCA no era extremófilo, sino termófilo moderado. 60°C es el punto medio entre superficie (50°C) y vents (80°C).

**Implementación**: `DNAFactory.createLUCA()` → `thermalOptimum: 60`

---

#### 2. **Expandir distribución H₂**
**Rigor**: ⭐⭐⭐⭐⭐ MÁXIMO

**Evidencia científica**:
- Sleep et al. (2011): H₂ difunde desde vents
- Russell et al. (2010): Gradientes H₂ en océano primordial
- Shock & Schulte (1998): H₂ disponible en columna de agua

**Justificación**: H₂ no está solo en vents, se difunde verticalmente. LUCA necesita acceso a H₂ para metabolismo Wood-Ljungdahl.

**Implementación**: `ChemicalGrids.initializeH2()` → Gradiente vertical, no solo sedimento

---

#### 3. **Mejorar quimiotaxis hacia H₂**
**Rigor**: ⭐⭐⭐⭐ ALTO

**Evidencia científica**:
- Falke et al. (1997): Quimiotaxis primitiva en bacterias
- Adler (1966): Respuesta a gradientes químicos
- Berg (2004): Run-and-tumble en procariotas

**Justificación**: LUCA tenía quimiotaxis primitiva para encontrar H₂. Es un mecanismo ancestral conservado.

**Implementación**: `ChemotaxisSystem.calculateBias()` → Priorizar H₂ sobre otros recursos

---

### ⚠️ AJUSTES DE GAMEPLAY (pero razonables)

#### 4. **Reducir estrés térmico: 0.02 → 0.005**
**Rigor**: ⭐⭐⭐ MEDIO

**Justificación científica parcial**:
- Células termófilas tienen adaptaciones (proteínas heat-shock)
- El costo del 2% por grado es arbitrario
- 0.5% por grado es más realista para termófilos

**Pero**: No hay datos cuantitativos exactos del costo metabólico por desviación térmica en LUCA.

**Implementación**: `Constants.js` → `THERMAL_STRESS_MULTIPLIER: 0.005`

---

#### 5. **Aumentar regeneración de recursos: ×2-×3**
**Rigor**: ⭐⭐⭐ MEDIO

**Justificación**:
- Océano primordial era rico en nutrientes
- Baja competencia (pocas células)
- Vents regeneran constantemente

**Pero**: Las tasas exactas de regeneración son desconocidas. Es un ajuste para balance de juego.

**Implementación**: `GridRegeneration.js` → Aumentar tasas de regeneración

---

#### 6. **Ajustar threshold O₂: 10 → 20**
**Rigor**: ⭐⭐ BAJO

**Justificación**:
- Ambiente anóxico (O₂ < 1% actual)
- SOD primitivo menos eficiente
- Threshold más alto = menos daño

**Pero**: Es un ajuste arbitrario para reducir daño oxidativo. No hay evidencia de threshold específico.

**Implementación**: `Constants.js` → `OXYGEN_SAFE_THRESHOLD: 20`

---

#### 7. **Reducir SOD cost: 0.05 → 0.03**
**Rigor**: ⭐⭐ BAJO

**Justificación**:
- SOD es enzima simple (bajo costo)
- Pero el costo exacto es desconocido

**Implementación**: `Constants.js` → `SOD_MAINTENANCE_COST: 0.03`

---

#### 8. **Optimizar difusión pasiva**
**Rigor**: ⭐⭐⭐⭐ ALTO

**Justificación científica**:
- Membranas primitivas eran más permeables
- Difusión pasiva es mecanismo ancestral
- Osmosis es "gratis" energéticamente

**Implementación**: `MembraneSystem.performPassiveDiffusion()` → Aumentar eficiencia

---

## 📋 Plan de Implementación

### Fase 1: Cambios Científicamente Rigurosos
1. ✅ Ajustar óptimo térmico LUCA → 60°C
2. ✅ Expandir distribución H₂ → Gradiente vertical
3. ✅ Mejorar quimiotaxis → Priorizar H₂

### Fase 2: Ajustes de Balance (razonables)
4. ✅ Reducir estrés térmico → 0.005
5. ✅ Aumentar regeneración → ×2
6. ✅ Optimizar difusión pasiva → Más eficiente

### Fase 3: Ajustes Opcionales (si necesario)
7. ⚠️ Ajustar threshold O₂ → 20 (solo si persiste problema)
8. ⚠️ Reducir SOD cost → 0.03 (solo si persiste problema)

---

## 🎯 Orden de Implementación

1. **DNAFactory.js** - Thermal optimum LUCA
2. **Constants.js** - Thermal stress multiplier
3. **ChemicalGrids.js** - H₂ distribution
4. **GridRegeneration.js** - Regeneration rates
5. **ChemotaxisSystem.js** - H₂ priority
6. **MembraneSystem.js** - Passive diffusion

---

## ✅ Criterios de Éxito

Después de implementar:
- Balance energético: **> 0** (positivo)
- Índice reproducción: **> 30%** (viable)
- Muertes por energía: **< 50%** (diversificadas)
- Población: **Estable o creciente**
