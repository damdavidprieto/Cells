# 🧬 Cells - Simulador de Evolución

Un simulador de evolución celular científicamente fundamentado que modela el surgimiento y divergencia de la vida desde **LUCA** (Último Antepasado Común Universal) en océanos primordiales.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![p5.js](https://img.shields.io/badge/p5.js-1.9.0-ED225D.svg)](https://p5js.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E.svg)](https://www.javascript.com/)
[![Estado Desarrollo](https://img.shields.io/badge/estado-alpha-orange.svg)](DESARROLLO.md)
[![Asistido por IA](https://img.shields.io/badge/IA-Antigravity-blue.svg)](ATRIBUCION.md)

> ⚠️ **Estado de Desarrollo**: Este proyecto está en desarrollo activo (v1.0.0-alpha). Ver [DESARROLLO.md](DESARROLLO.md) para estado actual y limitaciones.

> 🤖 **Desarrollo Asistido por IA**: Este proyecto fue desarrollado con asistencia significativa de IA (~85-90% generación de código). Ver [ATRIBUCION.md](ATRIBUCION.md) para transparencia total.

## 🎮 [Demo en Vivo](https://damdavidprieto.github.io/Cells/)

> **Nota**: La demo estará disponible una vez que se habilite GitHub Pages en la configuración del repositorio.

---

## 📖 Resumen

**Cells** simula la evolución de vida celular primitiva en condiciones similares al Eón Arcaico de la Tierra (hace 4.0-3.5 mil millones de años). Comenzando con organismos tipo LUCA, las células evolucionan a través de mutación, selección natural y divergencia metabólica en linajes especializados:

- 🔵 **LUCA** - Ancestro quimiosintético primitivo
- 🟣 **Fermentación** - Metabolismo anaeróbico
- 🟢 **Quimiosíntesis** - Utilización especializada de energía química

La simulación está construida sobre investigación científica revisada por pares, modelando presiones evolutivas realistas, competencia por recursos y costos metabólicos.

---

## ✨ Características

### 🧬 Mecánicas Evolutivas
- **Evolución de tasa de mutación**: Las células evolucionan su tasa de mutación basada en estabilidad ambiental
- **Divergencia metabólica**: LUCA puede evolucionar hacia fermentación o quimiosíntesis (1% probabilidad por reproducción)
- **Deriva genética**: Dinámicas evolutivas a nivel de población
- **Selección natural**: La escasez de recursos impulsa la adaptación

### 🔬 Precisión Científica
- **Basado en investigación**: 23 papers científicos de Nature, Science, Cell, etc.
- **Metabolismo realista**: LUCA (costo 2.0x) → Fermentación (1.5x) → Quimiosíntesis (1.0x)
- **Gradientes ambientales**: Distribución de luz, oxígeno, nitrógeno, fósforo
- **Tasas de mutación**: Modeladas según tasas reales de LUCA (10⁻⁵ a 10⁻⁴ por base)

### 🎨 Visualización
- **Tracking en tiempo real**: Gráfico de tasa de mutación con eras evolutivas
- **Notificaciones de especies**: Alertas cuando surgen nuevos tipos metabólicos
- **Células con código de color**: Distinción visual entre tipos de metabolismo
- **Grids de recursos**: Ver distribución de recursos ambientales
- **Logs de desarrollo**: Descarga de datos detallados de simulación

---

## 🚀 Inicio Rápido

### Opción 1: Abrir Directamente
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/damdavidprieto/Cells.git
   cd Cells
   ```
2. Abrir `index.html` en tu navegador

### Opción 2: Servidor Local (Recomendado)
```bash
# Usando npx
npx http-server -p 8080
```
3. Abrir `http://localhost:8080` en tu navegador

---

## 🔍 Transparencia y Desarrollo

### Estado de Desarrollo
Este proyecto está en **desarrollo activo** (v1.0.0-alpha). Aunque funcional y científicamente fundamentado, debe considerarse software experimental/educativo.

- **Qué funciona**: Simulación core, evolución, divergencia metabólica
- **Limitaciones**: Rendimiento con >200 células, biología simplificada
- **Planeado**: Fotosíntesis, predador-presa, transferencia horizontal de genes

Ver [DESARROLLO.md](DESARROLLO.md) para estado detallado y roadmap.

### Desarrollo Asistido por IA
Este proyecto fue desarrollado mediante **colaboración humano-IA** usando Antigravity AI:

- **~85-90% código generado por IA**: Sistemas, documentación, infraestructura
- **~10-15% dirigido por humano**: Diseño, validación, precisión científica
- **100% supervisión humana**: Todas las decisiones validadas por experiencia humana

Creemos en la transparencia radical sobre la asistencia de IA. Ver [ATRIBUCION.md](ATRIBUCION.md) para detalles completos sobre herramientas, metodología y autoría de código.

---

## 📚 Documentación

- **[Estado de Desarrollo](DESARROLLO.md)** - Estado actual, limitaciones y roadmap
- **[Atribución y Herramientas](ATRIBUCION.md)** - Asistencia IA, autoría, metodología
- **[Arquitectura y Mecánicas](docs/00_Architecture_and_Mechanics.md)** - Documentación completa del sistema
- **[Referencias Científicas](docs/13_scientific_references.md)** - Bibliografía (23 papers)
- **[Guía de Inicio Rápido](docs/QUICKSTART.md)** - Introducción para principiantes

---

## 📧 Contacto

**David Prieto**
- GitHub: [@damdavidprieto](https://github.com/damdavidprieto)
- Repositorio: [Cells](https://github.com/damdavidprieto/Cells)

---

**Hecho con 🧬 y ☕ por David Prieto**
