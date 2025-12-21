/**
 * REGENERACIÓN DE OXÍGENO - Dinámica del O₂ en la Era de LUCA
 * ===========================================================
 * 
 * Módulo dedicado para la regeneración de oxígeno en la era pre-fotosíntesis.
 * Enfocado específicamente en las condiciones ambientales de LUCA (4.0-3.5 Ga).
 * 
 * CONTEXTO CIENTÍFICO - O₂ EN LA ERA DE LUCA:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * NIVELES DE O₂ ATMOSFÉRICO:
 * - Moderno: 21% (1.0 PAL - Nivel Atmosférico Presente)
 * - Era LUCA (Arcaico): <10⁻⁵ PAL (<0.001% del moderno)
 * - Simulación: 5-20 unidades (representa <0.001% PAL)
 * 
 * ¿POR QUÉ TAN POCO O₂ EN LA ERA DE LUCA?
 * - NO existía fotosíntesis oxigénica (apareció ~2.4 Ga después)
 * - Océano rico en Fe²⁺ (hierro ferroso) consumía O₂ rápidamente
 * - Atmósfera reductora (CH₄, NH₃, H₂S) consumía O₂
 * - Producción MUY lenta (solo fotólisis UV)
 * 
 * FUENTES DE O₂ EN LA ERA DE LUCA:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ✅ IMPLEMENTADA:
 * 
 * 1. FOTÓLISIS UV DEL H₂O (FUENTE PRIMARIA):
 *    2H₂O + UV → 2H₂ + O₂
 *    
 *    Ubicación: Superficie del océano y atmósfera superior
 *    Tasa: MUY lenta (~10⁻¹⁴ mol O₂/cm²/s)
 *    Mecanismo: 
 *      - Radiación UV rompe moléculas de agua
 *      - H₂ escapa al espacio (ligero)
 *      - O₂ queda atrapado en atmósfera/océano
 *    
 *    ✅ Implementada en este módulo
 *    ✅ Científicamente correcta para era LUCA
 * 
 * ❌ NO IMPLEMENTADAS (Fuentes Menores):
 * 
 * 2. FOTODISOCIACIÓN DE CO₂:
 *    2CO₂ + UV → 2CO + O₂
 *    
 *    Tasa: ~10⁻¹⁵ mol O₂/cm²/s (10× más lenta que H₂O)
 *    Contribución: ~10% del total
 *    ❌ NO IMPLEMENTADA: Impacto menor, complejidad adicional
 *    Justificación: Simplificación aceptable para LUCA
 * 
 * 3. ACTIVIDAD VOLCÁNICA (SO₂):
 *    2SO₂ + UV → 2SO + O₂
 *    
 *    Tasa: Episódica (eventos volcánicos)
 *    Contribución: Muy menor, localizada
 *    ❌ NO IMPLEMENTADA: No hay sistema volcánico
 *    Justificación: Impacto despreciable en escala global
 * 
 * 4. FOTOSÍNTESIS BIOLÓGICA:
 *    - Anoxigénica: H₂S + CO₂ → CH₂O + S (NO produce O₂)
 *    - Oxigénica: H₂O + CO₂ → CH₂O + O₂ (apareció ~2.4 Ga)
 *    
 *    ❌ NO IMPLEMENTADA: LUCA predató la fotosíntesis
 *    Justificación: Históricamente correcto para era LUCA
 * 
 * SUMIDEROS DE O₂ (Consumo) EN LA ERA DE LUCA:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ✅ IMPLEMENTADOS:
 * 
 * 1. RESPIRACIÓN CELULAR (LUCA):
 *    - LUCA consume 0.5 O₂/frame
 *    - Respiración primitiva (pre-aeróbica)
 *    - ✅ Implementado en ResourceConsumption.js
 *    - ✅ Correcto: LUCA usaba trazas de O₂
 * 
 * ❌ NO IMPLEMENTADOS (Sumideros Críticos):
 * 
 * 2. OXIDACIÓN DE HIERRO FERROSO (Fe²⁺) - ⚠️ CRÍTICO:
 *    4Fe²⁺ + O₂ + 10H₂O → 4Fe(OH)₃
 *    
 *    Importancia: SUMIDERO PRINCIPAL de O₂ en era LUCA
 *    Contexto: Océanos Arcaicos ricos en Fe²⁺ disuelto
 *    Tasa: Consume O₂ MÁS RÁPIDO de lo que fotólisis lo produce
 *    Resultado: Mantiene O₂ en niveles de trazas
 *    
 *    ❌ NO IMPLEMENTADO: Requeriría grid de Fe²⁺
 *    ⚠️ IMPACTO: Sin este sumidero, O₂ se acumula irrealmente
 *    
 *    EVIDENCIA GEOLÓGICA:
 *    - Formaciones de Hierro Bandeado (BIF) - Arcaico
 *    - Demuestra que Fe²⁺ + O₂ → Fe³⁺ (óxido)
 *    - Principal mecanismo de control de O₂
 * 
 * 3. OXIDACIÓN DE GASES REDUCIDOS:
 *    - H₂S + O₂ → SO₄²⁻ (oxidación de sulfuro)
 *    - CH₄ + O₂ → CO₂ + H₂O (oxidación de metano)
 *    - NH₃ + O₂ → NO₃⁻ (oxidación de amoníaco)
 *    
 *    Importancia: Sumideros secundarios significativos
 *    Contexto: Atmósfera reductora rica en estos gases
 *    ❌ NO IMPLEMENTADO: Requeriría grids de H₂S, CH₄, NH₃
 *    Impacto: Moderado, pero contribuye a O₂ bajo
 * 
 * 4. METEORIZACIÓN DE ROCAS:
 *    FeO + O₂ → Fe₂O₃ (formación de óxido/herrumbre)
 *    
 *    ❌ NO IMPLEMENTADO: No hay sistema de minerales/rocas
 *    Impacto: Menor en escala oceánica
 * 
 * EVALUACIÓN DE PRECISIÓN CIENTÍFICA:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ✅ CORRECTO PARA ERA LUCA:
 * - Fotólisis UV como fuente primaria de O₂
 * - Tasa de regeneración MUY lenta (0.01-0.02/frame)
 * - Producción solo en superficie (penetración UV)
 * - Niveles de O₂ en trazas (5-20 unidades)
 * - Consumo mínimo por LUCA (0.5/frame)
 * 
 * ⚠️ SIMPLIFICACIONES ACEPTABLES:
 * - No incluye fotólisis de CO₂ (impacto <10%)
 * - No incluye SO₂ volcánico (episódico, menor)
 * - Simplificación lineal UV → O₂ (vs. espectral real)
 * 
 * ❌ FALTANTE CRÍTICO PARA REALISMO TOTAL:
 * - Oxidación de Fe²⁺ (SUMIDERO PRINCIPAL)
 * - Oxidación de H₂S, CH₄, NH₃ (sumideros secundarios)
 * - Resultado: O₂ puede acumularse sin límite natural
 * 
 * ANÁLISIS DE BALANCE:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * IMPLEMENTACIÓN ACTUAL:
 * Producción (superficie): 0.02 O₂/frame (fotólisis UV)
 * Consumo (células):      0.5 O₂/frame por célula LUCA
 * 
 * Balance:
 * - 1 celda de grid produce 0.02/frame
 * - 1 célula LUCA consume 0.5/frame
 * - Ratio: 1 celda soporta 0.04 células (1 célula necesita 25 celdas)
 * 
 * ⚠️ PROBLEMA SIN Fe²⁺:
 * Sin oxidación de Fe²⁺, O₂ se acumula en áreas despobladas
 * Cap en 20 es un "parche" para compensar falta de sumidero natural
 * 
 * BALANCE REALISTA (con Fe²⁺):
 * Producción (fotólisis): 0.02/frame
 * Consumo (Fe²⁺):         0.015/frame (oxidación)
 * Consumo (células):      0.5/frame (si hay células)
 * Neto:                   0.005/frame (acumulación muy lenta)
 * 
 * → Con Fe²⁺, O₂ se mantiene naturalmente en trazas
 * 
 * RECOMENDACIONES PARA MEJORAR REALISMO:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. CRÍTICO: Implementar oxidación de Fe²⁺
 *    - Añadir fe2Grid (alto en océano, bajo en superficie)
 *    - Implementar: O₂ + Fe²⁺ → Fe³⁺ (consume O₂)
 *    - Efecto: Mantiene O₂ en niveles realistas sin cap artificial
 * 
 * 2. OPCIONAL: Añadir oxidación de H₂S/CH₄
 *    - Impacto moderado pero aumenta realismo
 *    - Requiere grids adicionales
 * 
 * 3. FUTURO: Implementar fotosíntesis oxigénica
 *    - Post-evolución de LUCA (~2.4 Ga)
 *    - Gran Evento de Oxidación (GOE)
 *    - Aumento masivo de O₂ (trazas → 21%)
 * 
 * REFERENCIAS CIENTÍFICAS:
 * ═══════════════════════════════════════════════════════════════════
 * - Kasting, J. F. (1993). Earth's early atmosphere. Science.
 * - Catling, D. C. & Claire, M. W. (2005). How Earth's atmosphere evolved.
 * - Holland, H. D. (2006). The oxygenation of the atmosphere and oceans.
 * - Lyons, T. W., et al. (2014). The rise of oxygen in Earth's early ocean.
 * - Weiss, M. C., et al. (2016). The physiology and habitat of LUCA.
 */

class OxygenRegeneration {
    /**
     * Regenerar O₂ vía fotólisis UV (era pre-fotosíntesis)
     * 
     * PROCESO: 2H₂O + UV → 2H₂ + O₂
     * 
     * DETALLES DE IMPLEMENTACIÓN:
     * ═══════════════════════════════════════════════════════════════════
     */
    static regenerate(environment) {
        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {

                // 1. ZONA DE REGENERACIÓN: Solo superficie (top 45% del agua)
                // ¿Qué hace?: Limita regeneración a donde UV penetra
                // ¿Por qué?: UV no penetra profundidad (absorbido por agua)
                // Efecto en juego: O₂ solo se regenera en superficie
                //                  Vents (sedimento) NO regeneran O₂
                // ✅ REALISTA PARA LUCA: UV penetra ~10-50m en océano Arcaico
                if (j < environment.sedimentRow / 2) {  // Top 45% del agua

                    // 2. OBTENER NIVEL DE UV EN ESTA POSICIÓN
                    // ¿Qué hace?: Lee intensidad UV del grid
                    // ¿Por qué?: Fotólisis proporcional a UV disponible
                    // Valores: 100 (superficie) → 10 (media profundidad) → 0 (vents)
                    // ✅ CORRECTO: Más UV en superficie = más fotólisis
                    let uvLevel = environment.uvRadiationGrid[i][j];

                    // 3. CALCULAR TASA DE FOTÓLISIS UV
                    // ¿Qué hace?: photolysisRate = (UV / 100) × 0.02
                    // ¿Por qué?: Más UV = más fotólisis (relación lineal simplificada)
                    // 
                    // FÓRMULA REAL (simplificada para juego):
                    // J(O₂) = σ(λ) × Φ(λ) × I(λ)
                    // - σ(λ) = Sección transversal de absorción H₂O
                    // - Φ(λ) = Rendimiento cuántico (eficiencia)
                    // - I(λ) = Intensidad UV
                    // 
                    // SIMPLIFICACIÓN EN JUEGO:
                    // photolysisRate ∝ UV (lineal, no espectral)
                    // 
                    // TASAS RESULTANTES:
                    // - Superficie (UV=100): 0.02 O₂/frame
                    // - Media (UV=50):       0.01 O₂/frame
                    // - Profundidad (UV=10): 0.002 O₂/frame
                    // 
                    // ✅ REALISTA PARA LUCA: Tasa muy lenta (10⁻¹⁴ mol/cm²/s real)
                    let photolysisRate = (uvLevel / 100) * 0.02;

                    // 4. AÑADIR O₂ AL GRID
                    // ¿Qué hace?: Incrementa O₂ en esta celda
                    // ¿Por qué?: Simula producción continua por fotólisis
                    // Efecto en juego: O₂ aumenta lentamente en superficie
                    // 
                    // ⚠️ PROBLEMA SIN Fe²⁺ SINK:
                    // Sin oxidación de Fe²⁺, O₂ se acumula sin límite
                    // En era LUCA real: Fe²⁺ + O₂ → Fe³⁺ (consume O₂ rápidamente)
                    // Resultado: O₂ se mantiene en trazas naturalmente
                    environment.oxygenGrid[i][j] += photolysisRate;

                    // 5. CAP EN MÁXIMO (TRAZAS) - PARCHE TEMPORAL
                    // ¿Qué hace?: Limita O₂ a máximo 20 unidades
                    // ¿Por qué?: Evita acumulación irreal sin Fe²⁺ sink
                    // Efecto en juego: O₂ nunca supera 20 (trazas)
                    // 
                    // ✅ CORRECTO PARA LUCA: Mantiene O₂ en niveles Arcaicos (<10⁻⁵ PAL)
                    // 
                    // ⚠️ NOTA IMPORTANTE:
                    // Este cap es un "parche" para compensar falta de Fe²⁺ sink
                    // Idealmente: Oxidación de Fe²⁺ limitaría O₂ naturalmente
                    // Sin cap: O₂ se acumularía irrealmente en áreas despobladas
                    environment.oxygenGrid[i][j] = min(
                        environment.oxygenGrid[i][j],
                        GameConstants.OXYGEN_GRID_MAX  // 20
                    );
                }
            }
        }
    }

    /**
     * Oxidar Fe²⁺ (hierro ferroso) - SUMIDERO PRINCIPAL DE O₂
     * 
     * PROCESO: 4Fe²⁺ + O₂ + 10H₂O → 4Fe(OH)₃ (hidróxido férrico)
     * 
     * CONTEXTO CIENTÍFICO - Oxidación de Hierro en Era LUCA:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * IMPORTANCIA:
     * - SUMIDERO PRINCIPAL de O₂ en océanos Arcaicos
     * - Consumía O₂ MÁS RÁPIDO de lo que fotólisis UV lo producía
     * - Mantenía O₂ en niveles de trazas (<10⁻⁵ PAL)
     * - Permitió que vida anaeróbica (como LUCA) prosperara
     * 
     * QUÍMICA:
     * Reacción: 4Fe²⁺ + O₂ + 10H₂O → 4Fe(OH)₃ + 8H⁺
     * Ratio estequiométrico: 4 moles Fe²⁺ : 1 mol O₂
     * 
     * Producto: Fe(OH)₃ (hidróxido férrico)
     * - Precipita como óxido de hierro
     * - Se deposita en fondo oceánico
     * - Forma Banded Iron Formations (BIF)
     * 
     * EVIDENCIA GEOLÓGICA:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * BANDED IRON FORMATIONS (BIF):
     * - Formaciones rocosas del Arcaico (3.8-1.8 Ga)
     * - Capas alternadas de Fe-rico (magnetita, hematita) y Fe-pobre (chert)
     * - Indican oxidación episódica de Fe²⁺ por O₂
     * - Evidencia directa de océanos ricos en Fe²⁺
     * 
     * EJEMPLOS:
     * - Isua Supracrustal Belt, Groenlandia (~3.8 Ga)
     * - Hamersley Basin, Australia (~2.5 Ga)
     * - Transvaal Supergroup, Sudáfrica (~2.5 Ga)
     * 
     * INTERPRETACIÓN:
     * - Capas Fe-ricas: Períodos de oxidación (O₂ disponible)
     * - Capas Fe-pobres: Períodos sin oxidación (O₂ agotado, Fe²⁺ agotado)
     * - Ciclos indican balance delicado entre producción y consumo de O₂
     * 
     * TASA DE OXIDACIÓN:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * REAL:
     * - k_obs ≈ 10⁻² - 10⁻¹ M⁻¹ s⁻¹ (constante de velocidad)
     * - Muy rápida en presencia de O₂
     * - Limitada por disponibilidad de O₂ (no de Fe²⁺)
     * 
     * SIMULACIÓN:
     * - oxidationRate = 0.015 O₂/frame
     * - Consume 4× más Fe²⁺ (ratio 4:1)
     * - Comparable a tasa de fotólisis UV (0.02/frame)
     * - Resultado: O₂ se mantiene en trazas naturalmente
     * 
     * BALANCE EN JUEGO:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * SIN Fe²⁺ OXIDATION:
     * Producción O₂: 0.02/frame (fotólisis UV)
     * Consumo O₂:    0.5/frame (células, si hay)
     * Resultado:     O₂ se acumula en áreas despobladas (IRREAL)
     * 
     * CON Fe²⁺ OXIDATION:
     * Producción O₂:  0.02/frame (fotólisis UV)
     * Consumo Fe²⁺:   0.015/frame (oxidación)
     * Consumo células: 0.5/frame (si hay)
     * Neto:           0.005/frame (acumulación muy lenta)
     * Resultado:      O₂ en trazas (REALISTA)
     * 
     * REFERENCIAS:
     * ═══════════════════════════════════════════════════════════════════
     * - Holland, H. D. (2006). The oxygenation of the atmosphere and oceans.
     *   Phil. Trans. R. Soc. B.
     * - Lyons, T. W., et al. (2014). The rise of oxygen in Earth's early ocean
     *   and atmosphere. Nature.
     * - Konhauser, K. O., et al. (2007). Could bacteria have formed the
     *   Precambrian banded iron formations? Geology.
     * - Bekker, A., et al. (2010). Iron formation: The sedimentary product of a
     *   complex interplay among mantle, tectonic, oceanic, and biospheric processes.
     * 
     * IMPLEMENTACIÓN:
     * ═══════════════════════════════════════════════════════════════════
     */
    static oxidarHierro(environment) {
        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {

                // 1. VERIFICAR DISPONIBILIDAD DE REACTIVOS
                // ¿Qué hace?: Comprueba si hay O₂ y Fe²⁺ suficientes
                // ¿Por qué?: Reacción requiere ambos reactivos
                // Condiciones:
                //   - O₂ > 5 (suficiente para reaccionar)
                //   - Fe²⁺ > 10 (umbral de agotamiento)
                if (environment.oxygenGrid[i][j] > 5 &&
                    environment.fe2Grid[i][j] > GameConstants.FE2_DEPLETION_THRESHOLD) {

                    // 2. CALCULAR TASA DE OXIDACIÓN
                    // ¿Qué hace?: Determina cuánto O₂ se consume
                    // ¿Por qué?: Simula velocidad de reacción Fe²⁺ + O₂
                    // Tasa: 0.015 O₂/frame (comparable a fotólisis UV)
                    // 
                    // NOTA CIENTÍFICA:
                    // Tasa real depende de [O₂], [Fe²⁺], pH, temperatura
                    // Simplificación: tasa constante si reactivos disponibles
                    let oxidationRate = GameConstants.FE2_OXIDATION_RATE;  // 0.015

                    // 3. CONSUMIR O₂
                    // ¿Qué hace?: Reduce O₂ en el grid
                    // ¿Por qué?: O₂ es consumido en la reacción
                    // Efecto en juego: O₂ no se acumula indefinidamente
                    //                  Mantiene O₂ en trazas (5-20)
                    //                  REALISTA para era LUCA
                    environment.oxygenGrid[i][j] -= oxidationRate;

                    // 4. CONSUMIR Fe²⁺ (RATIO 4:1)
                    // ¿Qué hace?: Reduce Fe²⁺ en el grid
                    // ¿Por qué?: Estequiometría 4Fe²⁺ : 1O₂
                    // Efecto en juego: Fe²⁺ se agota con el tiempo
                    //                  Eventualmente permite acumulación de O₂
                    //                  Simula transición Arcaico → Proterozoico
                    // 
                    // NOTA CIENTÍFICA:
                    // En realidad, Fe²⁺ se reponía por vents hidrotermales
                    // Aquí: Fe²⁺ finito (simplificación)
                    // Resultado: Eventualmente se agota (realista a largo plazo)
                    environment.fe2Grid[i][j] -= oxidationRate * 4;  // Ratio 4:1

                    // 5. ASEGURAR NO NEGATIVOS
                    // ¿Qué hace?: Previene valores negativos
                    // ¿Por qué?: Concentraciones no pueden ser negativas
                    environment.oxygenGrid[i][j] = max(environment.oxygenGrid[i][j], 0);
                    environment.fe2Grid[i][j] = max(environment.fe2Grid[i][j], 0);

                    // EFECTO NETO:
                    // - O₂ se mantiene bajo (consumido por Fe²⁺)
                    // - Fe²⁺ se agota lentamente
                    // - Cuando Fe²⁺ < 10, oxidación se detiene
                    // - O₂ puede empezar a acumularse (Great Oxidation Event)
                }
            }
        }
    }
}
