# Diario Evolutivo - Cells Simulation

## Entrada 1: Sistema de Flagelos Evolutivos
**Fecha:** 2025-12-18  
**Cambio:** Implementación de flagelos como rasgo evolutivo

---

## 🧬 Potencial Evolutivo del Ecosistema

### Estado Inicial: LUCA Pura
- **Población:** 100% LUCA sin flagelos
- **Movimiento:** Browniano (velocidad ~0.1)
- **Distribución:** Uniforme, sin capacidad de migración
- **Estrategia:** Esperar recursos por difusión

### Presión Selectiva Esperada

#### Zonas con Recursos Dispersos
- **Problema:** Recursos alejados, difusión lenta
- **Ventaja evolutiva:** Flagelos (búsqueda activa)
- **Predicción:** Aparición de proto-flagelos (nivel 1-2)

#### Zonas con Recursos Concentrados
- **Problema:** Competencia local intensa
- **Ventaja evolutiva:** Sin flagelos (ahorro energético)
- **Predicción:** LUCA persiste sin evolucionar

#### Sedimento (Alta Viscosidad)
- **Problema:** Movimiento muy costoso
- **Ventaja evolutiva:** Sin flagelos o muy pocos
- **Predicción:** Selección contra flagelos avanzados

---

## 📊 Comportamientos Esperados

### Fase 1: Deriva Browniana (Gen 0-100)
```
Población: LUCA 100%
Movimiento: Aleatorio puro
Distribución: Uniforme
Mortalidad: Alta (recursos limitados)
```

**Esperado:**
- Células mueren si no hay recursos cerca
- No hay migración hacia zonas ricas
- Población estable pero baja

### Fase 2: Primeros Flagelos (Gen 100-500)
```
Mutación: flagellaLevel 0 → 1-2
Ventaja: +50% alcance de recursos
Costo: 3-6% energía (mantenimiento + uso)
```

**Esperado:**
- Células con proto-flagelos exploran más
- Mayor supervivencia en zonas dispersas
- Coexistencia LUCA + Proto-flagelados

### Fase 3: Especialización (Gen 500-1000)
```
Divergencia ecológica por zona:
- Superficie: flagellaLevel 3-5 (recursos dispersos)
- Sedimento: flagellaLevel 0-1 (viscosidad)
- Zonas ricas: flagellaLevel 0 (no necesario)
```

**Esperado:**
- Nichos ecológicos claros
- Especies especializadas por zona
- Equilibrio dinámico

### Fase 4: Optimización (Gen 1000+)
```
Ajuste fino de niveles de flagelos
Trade-off: Velocidad vs Eficiencia
```

**Esperado:**
- Nivel óptimo por ambiente
- Pérdida de flagelos en zonas estables
- Reaparición en zonas cambiantes

---

## 🎯 Predicciones Específicas

### Gradiente Vertical Esperado
```
Superficie (0-20% profundidad)
├─ Alta luz, recursos dispersos
├─ flagellaLevel medio: 3-4
└─ Estrategia: Búsqueda activa

Zona Media (20-80% profundidad)
├─ Luz media, recursos variables
├─ flagellaLevel mixto: 0-3
└─ Estrategia: Mixta (LUCA + flagelados)

Sedimento (80-100% profundidad)
├─ Sin luz, alta viscosidad
├─ flagellaLevel bajo: 0-1
└─ Estrategia: Conservación energética
```

### Ciclos Evolutivos Esperados
1. **Expansión:** Recursos abundantes → Flagelos evolucionan
2. **Estabilización:** Recursos estables → Flagelos se mantienen
3. **Colapso:** Recursos escasos → Flagelos desaparecen (costo alto)
4. **Recuperación:** Recursos vuelven → Ciclo reinicia

---

## 🔬 Experimentos Propuestos

### Experimento 1: Shock de Recursos
- **Acción:** Eliminar 80% de recursos en zona específica
- **Predicción:** Migración masiva de células flageladas
- **Observar:** Velocidad de migración vs supervivencia

### Experimento 2: Zona Estable
- **Acción:** Mantener recursos constantes en zona
- **Predicción:** Pérdida gradual de flagelos (costo innecesario)
- **Observar:** Generaciones hasta pérdida completa

### Experimento 3: Gradiente Extremo
- **Acción:** Recursos solo en esquinas opuestas
- **Predicción:** Evolución de flagelos avanzados (nivel 5-6)
- **Observar:** Tiempo hasta aparición de nivel 6

---

## 📝 Notas de Implementación

### Costos Implementados
```javascript
// Construcción (una vez)
constructionCost = (newLevel - parentLevel) * 10

// Mantenimiento (constante)
maintenanceCost = flagellaLevel * 0.03 per frame

// Uso (por movimiento)
movementCost = velocity.magnitude * 0.02 * flagellaLevel
```

### Valores Críticos
- **LUCA:** flagellaLevel = 0, maxSpeed = 0.1
- **Proto:** flagellaLevel = 1-2, maxSpeed = 1-2
- **Funcional:** flagellaLevel = 3-4, maxSpeed = 3-4
- **Avanzado:** flagellaLevel = 5-6, maxSpeed = 5-6

---

## 🎮 Observaciones Futuras

_Este espacio se llenará con observaciones reales del comportamiento del ecosistema_

### Generación 100
- [ ] ¿Aparecieron proto-flagelos?
- [ ] ¿En qué zonas?
- [ ] ¿Porcentaje de población?

### Generación 500
- [ ] ¿Nichos ecológicos establecidos?
- [ ] ¿Nivel máximo de flagelos alcanzado?
- [ ] ¿Coexistencia estable?

### Generación 1000
- [ ] ¿Optimización completada?
- [ ] ¿Especies distintas por zona?
- [ ] ¿Ciclos evolutivos observados?
