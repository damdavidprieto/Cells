# Sistema de Logging para Desarrollo

## 📊 DatabaseLogger (IndexedDB)

El proyecto ahora incluye un sistema de logging robusto para modo desarrollo que utiliza **IndexedDB** (almacenamiento local del navegador, sin backend ni red).

### ✅ Características

- **Sin red**: Todo se almacena localmente en el navegador
- **Sin vectores de ataque**: No abre puertos ni requiere configuración de firewall
- **Persistente**: Los datos se mantienen entre sesiones
- **Exportable**: Descarga datos en formato JSON para análisis
- **Solo desarrollo**: Completamente eliminado en el build de producción

### 🚀 Uso

#### Modo Desarrollo

1. Abre `index.html` en tu navegador
2. El sistema detecta automáticamente modo `DEVELOPMENT`
3. Se crea la base de datos `CellsDevLogs` en IndexedDB
4. Los eventos se registran automáticamente:
   - Nacimientos de células
   - Muertes de células
   - Mutaciones
   - Estadísticas por frame

#### Exportar Datos

Desde la consola del navegador:

```javascript
// Exportar datos de la ejecución actual
window.databaseLogger.exportToJSON();

// Ver todas las ejecuciones almacenadas
DatabaseLogger.listAllRuns().then(runs => console.table(runs));

// Limpiar toda la base de datos (útil para testing)
DatabaseLogger.clearAllData();
```

#### Inspeccionar Base de Datos

1. Abre DevTools (F12)
2. Ve a la pestaña "Application" (Chrome) o "Storage" (Firefox)
3. Expande "IndexedDB" → "CellsDevLogs"
4. Explora las tablas:
   - `runs`: Información de cada ejecución
   - `cell_events`: Eventos de células (nacimientos, muertes)
   - `mutations`: Registro de mutaciones
   - `frame_stats`: Estadísticas poblacionales por frame

### 🏗️ Build de Producción

Para generar una versión optimizada sin código de desarrollo:

```bash
# Generar build de producción
npm run build

# Limpiar build anterior
npm run clean
```

El script `build-prod.js`:
- Copia todos los archivos a `./build/`
- Elimina archivos de desarrollo (`DatabaseLogger.js`, `DevLogger.js`, etc.)
- Cambia `EXECUTION_MODE` a `'PRODUCTION'` en `Constants.js`
- Deshabilita `DATABASE_LOGGING`
- Limpia comentarios `DEPRECATED`

### 📁 Estructura de Datos

#### Tabla: runs
```javascript
{
  run_id: "run_2024-12-23T14-30-00",
  start_time: "2024-12-23T14:30:00.000Z",
  mode: "DEVELOPMENT",
  config: { /* configuración del juego */ },
  end_time: null
}
```

#### Tabla: cell_events
```javascript
{
  id: 1,
  run_id: "run_2024-12-23T14-30-00",
  frame_number: 150,
  event_type: "death", // 'birth', 'death', 'state'
  cell_id: 42,
  data: {
    cause: "energy_depletion",
    position: { x: 320, y: 240 },
    final_state: { energy: 0, oxygen: 5, ... }
  },
  timestamp: "2024-12-23T14:30:15.000Z"
}
```

#### Tabla: mutations
```javascript
{
  id: 1,
  run_id: "run_2024-12-23T14-30-00",
  frame_number: 200,
  parent_id: 10,
  child_id: 25,
  dna_changes: {
    parent_dna: { /* DNA del padre */ },
    child_dna: { /* DNA del hijo */ }
  },
  timestamp: "2024-12-23T14:30:20.000Z"
}
```

#### Tabla: frame_stats
```javascript
{
  id: 1,
  run_id: "run_2024-12-23T14-30-00",
  frame_number: 100,
  population: 45,
  deaths: 2,
  births: 3,
  avg_energy: 75.3,
  species_count: 3,
  timestamp: "2024-12-23T14:30:10.000Z"
}
```

### ⚙️ Configuración

En `src/utils/Constants.js`:

```javascript
DATABASE_LOGGING: {
    enabled: true,                // Habilitar logging
    log_cell_events: true,        // Registrar eventos de células
    log_mutations: true,          // Registrar mutaciones
    log_frame_stats: true,        // Registrar estadísticas
    frame_stats_interval: 10,     // Cada 10 frames
}
```

### 🔒 Seguridad

- ✅ Sin backend (no hay servidor corriendo)
- ✅ Sin puertos de red abiertos
- ✅ Sin CORS ni firewall necesarios
- ✅ Solo funciona cuando abres el juego
- ✅ Datos locales en el navegador
- ✅ Código dev eliminado en producción
- ✅ Seguro para GitHub público (sin secretos)

### 📝 Notas

- El sistema antiguo (`LogPersistence.js`, `DevLogger.js`) está marcado como `DEPRECATED` y se eliminará tras validación
- Los datos persisten entre sesiones del navegador
- Puedes tener múltiples ejecuciones almacenadas simultáneamente
- El tamaño de IndexedDB está limitado por el navegador (generalmente varios GB)
