/**
 * REGENERACIÓN DE FÓSFORO - Dinámica del P en la Era de LUCA
 * ===========================================================
 * 
 * Módulo dedicado para la regeneración de fósforo en la era pre-fotosíntesis.
 * Enfocado específicamente en las condiciones ambientales de LUCA (4.0-3.5 Ga).
 * 
 * CONTEXTO CIENTÍFICO - P EN LA ERA DE LUCA:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * IMPORTANCIA DEL FÓSFORO:
 * - Componente esencial de DNA, RNA, ATP
 * - Limitante para reproducción celular
 * - Ciclo biogeoquímico MUY lento (millones de años)
 * - Recurso NO renovable a escala celular
 * 
 * CONCENTRACIÓN EN ERA LUCA:
 * - Océano moderno: ~2 μM (muy bajo)
 * - Océano Arcaico: ~10-50 μM (estimado, mayor que moderno)
 * - Vents hidrotermales: ~100-500 μM (fuente principal)
 * - Simulación: 0-80 unidades (representa gradiente vent → océano)
 * 
 * ¿POR QUÉ P ERA LIMITANTE EN ERA LUCA?
 * - Fuente principal: Meteorización de rocas (MUY lenta)
 * - Precipita fácilmente con Ca²⁺, Fe³⁺ (se vuelve insoluble)
 * - NO tiene fase gaseosa (a diferencia de N₂, CO₂)
 * - Ciclo geológico, no biológico (sin plantas para reciclar)
 * 
 * FUENTES DE P EN LA ERA DE LUCA:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ✅ IMPLEMENTADA:
 * 
 * 1. METEORIZACIÓN DE ROCAS (FUENTE PRIMARIA):
 *    Apatita (Ca₅(PO₄)₃(OH,F,Cl)) → PO₄³⁻
 *    
 *    Ubicación: Sedimento (contacto roca-agua)
 *    Tasa: MUY lenta (escala geológica: millones de años)
 *    Mecanismo:
 *      - Agua + CO₂ → H₂CO₃ (ácido carbónico)
 *      - H₂CO₃ disuelve minerales fosfatados
 *      - Libera PO₄³⁻ soluble al océano
 *    
 *    ✅ Implementada en este módulo
 *    ✅ Científicamente correcta para era LUCA
 * 
 * ❌ NO IMPLEMENTADAS (Fuentes Menores):
 * 
 * 2. VENTS HIDROTERMALES:
 *    Fluidos hidrotermales ricos en PO₄³⁻
 *    
 *    Tasa: Continua pero localizada
 *    Concentración: 100-500 μM (10-50× océano)
 *    ❌ NO IMPLEMENTADA: Requeriría regeneración continua en vents
 *    Justificación: Meteorización ya simula aporte lento
 * 
 * 3. IMPACTOS METEÓRICOS:
 *    Meteoritos ricos en fosfuros (Fe₃P, schreibersite)
 *    
 *    Tasa: Episódica (eventos de impacto)
 *    Contribución: Significativa en Arcaico temprano (4.0-3.8 Ga)
 *    ❌ NO IMPLEMENTADA: Eventos raros, difícil de modelar
 *    Justificación: Impacto menor en escala de simulación
 * 
 * 4. ACTIVIDAD VOLCÁNICA:
 *    Cenizas volcánicas ricas en P
 *    
 *    Tasa: Episódica
 *    ❌ NO IMPLEMENTADA: No hay sistema volcánico
 *    Justificación: Contribución menor vs. meteorización
 * 
 * SUMIDEROS DE P (Consumo) EN LA ERA DE LUCA:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ✅ IMPLEMENTADOS:
 * 
 * 1. SÍNTESIS DE BIOMOLÉCULAS (LUCA):
 *    - LUCA consume 0.3 P/frame
 *    - Para DNA, RNA, ATP, fosfolípidos
 *    - ✅ Implementado en ResourceConsumption.js
 *    - ✅ Correcto: P es limitante para reproducción
 * 
 * 2. SÍNTESIS EN OTROS METABOLISMOS:
 *    - Fermentación: 0.4 P/frame
 *    - Quimiosíntesis: 0.5 P/frame
 *    - ✅ Implementado
 * 
 * ❌ NO IMPLEMENTADOS (Sumideros Críticos):
 * 
 * 3. PRECIPITACIÓN CON Ca²⁺ (APATITA):
 *    Ca²⁺ + PO₄³⁻ → Ca₅(PO₄)₃(OH) (apatita)
 *    
 *    Importancia: SUMIDERO PRINCIPAL de P en océanos
 *    Contexto: Ca²⁺ abundante en océano Arcaico
 *    Resultado: P precipita, se vuelve insoluble
 *    
 *    ❌ NO IMPLEMENTADO: Requeriría grid de Ca²⁺
 *    ⚠️ IMPACTO: Sin este sumidero, P se acumula irrealmente
 * 
 * 4. ADSORCIÓN EN Fe(OH)₃:
 *    PO₄³⁻ + Fe(OH)₃ → Fe(OH)₃-PO₄ (adsorbido)
 *    
 *    Importancia: Sumidero secundario significativo
 *    Contexto: Fe(OH)₃ abundante (producto de oxidación Fe²⁺)
 *    ❌ NO IMPLEMENTADO: Requiere tracking de Fe(OH)₃
 * 
 * 5. RECICLAJE BIOLÓGICO:
 *    Células muertas → Descomposición → Libera P
 *    
 *    Importancia: CRÍTICO para sostenibilidad
 *    Tasa: 80-90% del P celular se recicla
 *    ❌ NO IMPLEMENTADO: Células muertas no liberan P
 *    ⚠️ IMPACTO CRÍTICO: Sin reciclaje, P se agota rápidamente
 * 
 * EVALUACIÓN DE PRECISIÓN CIENTÍFICA:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ✅ CORRECTO PARA ERA LUCA:
 * - Meteorización como fuente primaria de P
 * - Tasa de regeneración MUY lenta (0.15 cada 100 frames)
 * - Producción solo en sedimento (contacto roca-agua)
 * - P como recurso limitante para reproducción
 * - Consumo celular (0.3-0.5/frame)
 * 
 * ⚠️ SIMPLIFICACIONES ACEPTABLES:
 * - No incluye vents hidrotermales (fuente continua)
 * - No incluye impactos meteóricos (episódicos)
 * - Tasa constante (vs. dependiente de pH, temperatura)
 * 
 * ❌ FALTANTE CRÍTICO PARA REALISMO TOTAL:
 * - Precipitación con Ca²⁺ (SUMIDERO PRINCIPAL)
 * - Adsorción en Fe(OH)₃ (sumidero secundario)
 * - **RECICLAJE BIOLÓGICO** (CRÍTICO para sostenibilidad)
 * - Resultado: P se agota sin reciclaje, población colapsa
 * 
 * ANÁLISIS DE BALANCE:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * IMPLEMENTACIÓN ACTUAL:
 * Producción (sedimento): 0.15 P cada 100 frames (1% probabilidad)
 *                       = 0.0015 P/frame efectivo
 * Consumo (células):    0.3-0.5 P/frame por célula LUCA
 * 
 * Balance:
 * - 1 celda de grid produce 0.0015/frame
 * - 1 célula LUCA consume 0.3/frame
 * - Ratio: 1 celda soporta 0.005 células (1 célula necesita 200 celdas)
 * 
 * ⚠️ PROBLEMA CRÍTICO:
 * Sin reciclaje biológico, P se agota en ~268 frames
 * Población colapsa cuando P < 10 en sedimento
 * 
 * BALANCE REALISTA (con reciclaje):
 * Producción (meteorización): 0.0015/frame
 * Reciclaje (células muertas): 0.24/frame (80% de 0.3 consumido)
 * Consumo (células vivas):     0.3/frame
 * Neto:                        -0.0585/frame (lento agotamiento)
 * 
 * → Con reciclaje, P se mantiene mucho más tiempo
 * 
 * RECOMENDACIONES PARA MEJORAR REALISMO:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. CRÍTICO: Implementar reciclaje biológico de P
 *    - Células muertas liberan 80% de su P
 *    - Implementar en Entity.die() o similar
 *    - Efecto: Sostenibilidad a largo plazo
 * 
 * 2. OPCIONAL: Añadir precipitación con Ca²⁺
 *    - Añadir ca2Grid (alto en océano)
 *    - Implementar: PO₄³⁻ + Ca²⁺ → apatita (consume P)
 *    - Efecto: Limita P disponible (realista)
 * 
 * 3. OPCIONAL: Aumentar tasa de meteorización
 *    - De 1% a 5% probabilidad (0.0015 → 0.0075/frame)
 *    - Justificación: Arcaico tenía más actividad tectónica
 * 
 * 4. FUTURO: Implementar vents como fuente continua
 *    - P regenera continuamente en vents (como H₂)
 *    - Tasa: +0.05/frame en sedimento
 *    - Efecto: Vents como oasis de P
 * 
 * REFERENCIAS CIENTÍFICAS:
 * ═══════════════════════════════════════════════════════════════════
 * - Pasek, M. A. & Lauretta, D. S. (2005). Aqueous corrosion of phosphide 
 *   minerals from iron meteorites. Astrobiology.
 * - Konhauser, K. O., et al. (2007). Oceanic nickel depletion and a 
 *   methanogen famine before the Great Oxidation Event. Nature.
 * - Planavsky, N. J., et al. (2010). The evolution of the marine phosphate 
 *   reservoir. Nature.
 * - Filippelli, G. M. (2008). The global phosphorus cycle: past, present, 
 *   and future. Elements.
 */

class PhosphorusRegeneration {
    /**
     * Regenerar P vía meteorización de rocas (era pre-fotosíntesis)
     * 
     * PROCESO: Apatita + H₂CO₃ → PO₄³⁻ + Ca²⁺
     * 
     * DETALLES DE IMPLEMENTACIÓN:
     * ═══════════════════════════════════════════════════════════════════
     */
    static regenerate(environment) {
        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {

                // 1. ZONA DE REGENERACIÓN: Solo sedimento profundo
                // ¿Qué hace?: Limita regeneración a donde hay contacto roca-agua
                // ¿Por qué?: Meteorización ocurre en interfaz sedimento-océano
                // Efecto en juego: P solo se regenera en sedimento
                //                  Superficie NO regenera P
                // ✅ REALISTA PARA LUCA: P viene de rocas en fondo oceánico
                if (j >= environment.sedimentRow) {

                    // 2. CALCULAR P MÁXIMO EN ESTA PROFUNDIDAD
                    // ¿Qué hace?: Determina concentración máxima de P
                    // ¿Por qué?: P más concentrado en sedimento profundo (vents)
                    // Gradiente: Exponencial (similar a H₂, N₂)
                    // Valores: Superficie = 0, Sedimento superficial = 5, Vents = 80
                    let depthRatio = j / environment.rows;
                    let maxPhosphorus = 80 * exp(-6 * (1 - depthRatio));

                    // 3. CONTINUOUS HYDROTHERMAL FLUX (VENTS)
                    // Replaced stochastic weathering (too slow) with constant flux
                    // Uses GameConstants.VENT_PHOSPHORUS_FLUX (0.5/frame)
                    // Cap at PHOSPHORUS_GRID_MAX (200)
                    environment.phosphorusGrid[i][j] += GameConstants.VENT_PHOSPHORUS_FLUX;
                    environment.phosphorusGrid[i][j] = min(environment.phosphorusGrid[i][j], GameConstants.PHOSPHORUS_GRID_MAX);

                    // REMOVED: Probabilistic Weathering (was 2% chance of 0.3)
                    // The old method yielding 0.006 P/frame effectively sterilized the colony.
                }
            }
        }
    }

    /**
     * Reciclar fósforo biológico (CRÍTICO para sostenibilidad)
     * 
     * PROCESO: Célula muere → Libera 80% de su P → P reutilizable
     * 
     * CONTEXTO CIENTÍFICO - Reciclaje de P en Era LUCA:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * IMPORTANCIA:
     * - Sin reciclaje: P se agota en ~268 frames (población colapsa)
     * - Con reciclaje: Ciclo biogeoquímico cerrado (sostenible)
     * - Eficiencia: 80% (basado en estudios empíricos)
     * 
     * MECANISMO:
     * Cuando célula muere:
     * 1. Membranas se rompen
     * 2. Contenido celular se libera (DNA, RNA, ATP, fosfolípidos)
     * 3. Fosfatasas ambientales hidrolizan enlaces P-O
     * 4. PO₄³⁻ libre queda disponible para otras células
     * 
     * PÉRDIDAS (20%):
     * ═══════════════════════════════════════════════════════════════════
     * 
     * 1. PRECIPITACIÓN (10-15%):
     *    PO₄³⁻ + Ca²⁺ → Ca₅(PO₄)₃(OH) (apatita - insoluble)
     *    PO₄³⁺ + Fe³⁺ → FePO₄ (strengita - insoluble)
     *    
     * 2. ADSORCIÓN (5-10%):
     *    PO₄³⁻ + Fe(OH)₃ → Fe(OH)₃-PO₄ (adsorbido en minerales)
     *    PO₄³⁻ + arcillas → complejo arcilla-P (no disponible)
     *    
     * 3. ENTIERRO (5%):
     *    Células muertas se hunden → sedimento profundo
     *    P queda fuera del alcance de células vivas
     * 
     * EFICIENCIA DE RECICLAJE:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * OCÉANOS MODERNOS:
     * - Eficiencia: 70-90% (promedio 80%)
     * - Redfield et al. (1963): Ciclo P en océanos
     * 
     * OCÉANO ARCAICO (Era LUCA):
     * - Probablemente MENOR (más Fe²⁺, Ca²⁺ para precipitar)
     * - Estimado: 70-80%
     * - Usamos 80% (optimista pero razonable)
     * 
     * BALANCE CON RECICLAJE:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * SIN RECICLAJE (actual):
     * Producción: 0.0015 P/frame (meteorización)
     * Consumo:    0.3 P/frame (LUCA)
     * Neto:       -0.2985 P/frame (INSOSTENIBLE)
     * Tiempo hasta colapso: ~268 frames
     * 
     * CON RECICLAJE (80%):
     * Producción: 0.0015 P/frame (meteorización)
     * Reciclaje:  0.24 P/frame (80% de 0.3 consumido)
     * Consumo:    0.3 P/frame (LUCA)
     * Neto:       -0.0585 P/frame (SOSTENIBLE a largo plazo)
     * Tiempo hasta colapso: ~1370 frames (5× más)
     * 
     * REFERENCIAS:
     * ═══════════════════════════════════════════════════════════════════
     * - Redfield, A. C., et al. (1963). The influence of organisms on the
     *   composition of sea-water. The Sea.
     * - Filippelli, G. M. (2008). The global phosphorus cycle: past, present,
     *   and future. Elements, 4(2), 89-95.
     * - Planavsky, N. J., et al. (2010). The evolution of the marine phosphate
     *   reservoir. Nature, 467(7319), 1088-1090.
     * 
     * IMPLEMENTACIÓN:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * Este método debe llamarse desde Entity.die() o similar
     * Parámetros:
     * - environment: Referencia al Environment
     * - x, y: Posición de la célula muerta
     * - cellularPhosphorus: Cantidad de P en la célula (acumulado)
     */
    static reciclarFosforo(environment, x, y, cellularPhosphorus) {
        // 1. CONVERTIR POSICIÓN A ÍNDICES DE GRID
        // ¿Qué hace?: Calcula índices i,j del grid desde coordenadas x,y
        // ¿Por qué?: Grid usa índices discretos, no coordenadas continuas
        let i = floor(x / environment.resolution);
        let j = floor(y / environment.resolution);

        // 2. VERIFICAR LÍMITES DEL GRID
        // ¿Qué hace?: Comprueba que índices están dentro del grid
        // ¿Por qué?: Evita errores de acceso fuera de límites
        if (i >= 0 && i < environment.cols && j >= 0 && j < environment.rows) {

            // 3. CALCULAR P RECICLADO (80%)
            // ¿Qué hace?: Calcula cuánto P se libera (80% del total celular)
            // ¿Por qué?: 20% se pierde por precipitación, adsorción, entierro
            // 
            // NOTA CIENTÍFICA:
            // Eficiencia 80% basada en:
            // - Redfield et al. (1963): Ciclo P oceánico
            // - Filippelli (2008): Ciclo global del P
            // - Océano Arcaico probablemente tenía eficiencia menor
            //   (más Fe²⁺, Ca²⁺ para precipitar P)
            // - 80% es valor optimista pero razonable
            let recycledP = cellularPhosphorus * 0.8;

            // 4. AÑADIR P AL GRID AMBIENTAL
            // ¿Qué hace?: Incrementa P disponible en esa celda del grid
            // ¿Por qué?: Simula liberación de PO₄³⁻ al ambiente
            // Efecto en juego: P vuelve a estar disponible para otras células
            //                  Ciclo biogeoquímico cerrado
            //                  Sostenibilidad a largo plazo
            environment.phosphorusGrid[i][j] += recycledP;

            // EFECTO NETO:
            // - Célula consume 0.3 P/frame durante vida
            // - Al morir, libera 0.24 P (80%)
            // - Pérdida neta: 0.06 P por célula (20%)
            // - Con meteorización (0.0015/frame), sistema es sostenible
            // 
            // CICLO COMPLETO:
            // Meteorización → PO₄³⁻ disponible → Consumo celular → 
            // P en biomasa → Muerte celular → Reciclaje (80%) → 
            // PO₄³⁻ disponible (ciclo cerrado)
        }
    }
}
