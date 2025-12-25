# 🛠️ Carpeta de Desarrollo (.dev)

Esta carpeta contiene **scripts y documentación para desarrollo** que pueden subirse al repositorio público de forma segura.

## 📁 Contenido

### Scripts de PowerShell

- **`check-database.ps1`** - Verifica el estado de IndexedDB en navegadores instalados
  - No requiere permisos de administrador
  - Soporta Chrome, Edge y Firefox
  - Muestra tamaño y ubicación de la base de datos

### Documentación

- **`CHECK_DATABASE.md`** - Guía completa sobre cómo verificar el estado de IndexedDB
  - Métodos manuales (DevTools)
  - Métodos automáticos (scripts)
  - Solución de problemas
  - Comandos útiles para desarrollo

## 🚀 Uso Rápido

### Verificar Estado de la Base de Datos

```powershell
# Verificar en todos los navegadores
.\.dev\check-database.ps1

# Verificar solo en Chrome
.\.dev\check-database.ps1 -Browser Chrome

# Verificar en un perfil específico
.\.dev\check-database.ps1 -Browser Firefox -BrowserProfile "dev-edition-default"
```

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
