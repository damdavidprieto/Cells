# 📊 Sistemas de Logging en Cells

## Estado Actual (Diciembre 2024)

### ✅ Sistema ACTIVO: DatabaseLogger (IndexedDB)

**Archivo principal:** `src/logging/DatabaseLogger.js`  
**Almacenamiento:** IndexedDB (base de datos `CellsDevLogs`)  
**Herramienta de diagnóstico:** `.dev/diagnose-database.html`

#### Características:
- ✅ Base de datos local persistente (IndexedDB)
- ✅ Sin backend ni red
- ✅ Exportación a JSON desde interfaz web
- ✅ Stores separados: runs, cell_events, mutations, frame_stats
- ✅ Interfaz gráfica para diagnóstico y exportación

#### Uso:
```javascript
// Desde la consola del navegador
window.databaseLogger.exportToJSON()  // Exportar última ejecución
DatabaseLogger.listAllRuns()          // Listar todas las ejecuciones
DatabaseLogger.clearAllData()         // Limpiar base de datos
```

#### Herramienta de diagnóstico:
Abrir: `.dev/diagnose-database.html`
- 🔍 Diagnóstico completo del estado de IndexedDB
- 📋 Listado de todas las ejecuciones
- 👁️ Visualización de datos
- 💾 Exportación de runs específicas
- 🗑️ Limpieza de base de datos

---

### ⚠️ Sistema DEPRECATED: DevLogger + LogPersistence (localStorage)

**Archivos:**
- `src/logging/DevLogger.js` (DEPRECATED)
- `src/logging/LogPersistence.js` (DEPRECATED)

**Almacenamiento:** localStorage del navegador  
**Documentación obsoleta:** `docs/LOG_RECOVERY_GUIDE.md`

#### ¿Por qué está deprecated?
- localStorage tiene límite de ~5-10 MB
- No tiene estructura de base de datos
- Difícil de consultar y analizar
- Reemplazado por IndexedDB (más robusto)

#### Estado:
- ⚠️ Todavía se ejecuta en paralelo (marcado como "OLD SYSTEM")
- 🗑️ Pendiente de eliminación tras validación completa
- 📝 Código marcado con comentarios "DEPRECATED"

---

## 📁 Archivos de Log Exportados

### Ubicación actual:
```
Cells/
  logs/
    cells_dev_run_2025-12-23T23-52-14.json  ← Exportado desde IndexedDB ✅
```

### Formato del archivo exportado (IndexedDB):
```json
{
  "run_id": "run_2025-12-23T23-52-14",
  "export_time": "2025-12-24T00:08:06.122Z",
  "summary": {
    "total_events": 17,
    "total_mutations": 0,
    "total_stats": 49
  },
  "events": [...],        // Todos los eventos de células
  "mutations": [...],     // Todas las mutaciones
  "frame_stats": [...]    // Estadísticas por frame
}
```

### Formato antiguo (localStorage - DEPRECATED):
```
run_YYYY-MM-DDTHH-MM-SS_metadata.json
run_YYYY-MM-DDTHH-MM-SS_deaths.json
run_YYYY-MM-DDTHH-MM-SS_reproductions.json
run_YYYY-MM-DDTHH-MM-SS_summary.json
run_YYYY-MM-DDTHH-MM-SS_cell_X.json
```

---

## 🔄 Plan de Migración

### Fase 1: Validación (COMPLETADA ✅)
- [x] DatabaseLogger funciona correctamente
- [x] Datos se exportan correctamente
- [x] Herramienta de diagnóstico creada
- [x] Verificación de integridad de datos

### Fase 2: Limpieza (PENDIENTE)
- [ ] Eliminar llamadas a DevLogger en Sketch.js
- [ ] Eliminar DevLogger.js
- [ ] Eliminar LogPersistence.js
- [ ] Actualizar GameController.js
- [ ] Eliminar docs/LOG_RECOVERY_GUIDE.md (obsoleto)

### Fase 3: Documentación (PENDIENTE)
- [ ] Actualizar DATABASE_LOGGING.md con nueva herramienta
- [ ] Crear guía de uso de diagnose-database.html
- [ ] Documentar workflow de análisis de logs

---

## 🎯 Recomendaciones

### Para desarrollo:
1. Usa `.dev/diagnose-database.html` para verificar logs
2. Exporta runs desde la interfaz gráfica
3. Analiza los JSON exportados con Python/JavaScript

### Para producción:
- DATABASE_LOGGING.enabled = false (automático en build)
- Todo el código de logging se elimina en producción

---

## 📝 Notas

- **IndexedDB** es el estándar moderno para almacenamiento local
- **localStorage** tiene límites más restrictivos
- La herramienta de diagnóstico facilita enormemente el debugging
- Los logs exportados son compatibles con análisis en Python/R/JavaScript
