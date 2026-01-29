# 🛠️ Carpeta de Desarrollo (.dev)

Esta carpeta contiene **scripts y documentación para desarrollo** que pueden subirse al repositorio público de forma segura.

## 📁 Contenido

### Herramientas de Diagnóstico

- **`diagnose-database.html`** - Herramienta web para inspeccionar la base de datos IndexedDB.
  - Permite ver estadísticas de ejecuciones, eventos, mutaciones y anomalías.
  - Incluye gráficas de población y energía en tiempo real (según logs).
  - Compatible con la arquitectura modular (DB v3).

## 🚀 Uso Rápido

### Inspeccionar la Base de Datos
1. Abre `index.html` en tu navegador y ejecuta una simulación.
2. Abre `.dev/diagnose-database.html` en una nueva pestaña.
3. Haz clic en "Ejecutar Diagnóstico Completo" para ver los datos de la sesión actual.

## 🔒 Seguridad

Todos los archivos en esta carpeta son seguros para subir al repositorio público:

- ✅ No contienen credenciales
- ✅ No contienen datos sensibles
- ✅ No requieren permisos de administrador
- ✅ Solo leen información local del sistema
- ✅ No modifican configuraciones del sistema

## 📝 Notas

- Esta carpeta está **incluida en el repositorio** (no está en .gitignore)
- Los scripts son **opcionales** y solo para facilitar el desarrollo
- Puedes ejecutar el juego sin usar ninguno de estos scripts
- Los scripts solo funcionan en **Windows** (PowerShell)

## 🐛 Reportar Problemas

Si encuentras algún problema con los scripts, por favor:

1. Verifica que estás usando PowerShell (no CMD)
2. Revisa la documentación en `CHECK_DATABASE.md`
3. Abre un issue en GitHub con detalles del error
