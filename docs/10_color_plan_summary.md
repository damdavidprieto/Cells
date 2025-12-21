# Plan de Color Funcional - Resumen Ejecutivo

## 🎯 Qué Hace

Convierte el color de cosmético a funcional:
- **Color oscuro** = Mejor absorción de luz + Fotoprotección + Mayor costo
- **Color claro** = Menor absorción + Sin protección + Menor costo

## 📁 Archivos a Modificar

1. **NUEVO:** `src/metabolism/ColorSystem.js` (10 min)
2. `src/utils/Constants.js` - Añadir COLOR_EVOLUTION (2 min)
3. `src/Entity.js` - Costo de pigmentos (2 min)
4. `src/metabolism/ResourceConsumption.js` - Absorción de luz (3 min)
5. `src/visualization/CellRenderer.js` - Variación de color (3 min)
6. `src/dna/DNAMutator.js` - Mutación configurable (2 min)
7. `index.html` - Import ColorSystem (1 min)

**Total:** ~25 minutos

## ⚙️ 3 Niveles

- `NONE`: Cosmético (actual)
- `MEDIUM`: Balanceado ⭐ (recomendado)
- `HIGH`: Efectos fuertes (desarrollo)

## 🧬 Evolución Esperada

**Superficie:** Células oscuras (absorben más luz, resisten UV)  
**Profundidad:** Células claras (bajo costo, no necesitan pigmentos)

---

Ver plan completo en `implementation_plan.md`
