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
    regenerate(environment) {
        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {
                if (j < environment.sedimentRow / 2) {
                    let uvLevel = environment.uvRadiationGrid[i][j];
                    let photolysisRate = (uvLevel / 100) * 0.02;

                    environment.oxygenGrid[i][j] += photolysisRate;

                    let maxO2 = environment.maxOxygenEvent || GameConstants.OXYGEN_GRID_MAX;
                    if (GameConstants.SCENARIO === 'PRESSURE_OXYGEN') maxO2 = Math.max(maxO2, 100.0);

                    environment.oxygenGrid[i][j] = min(
                        environment.oxygenGrid[i][j],
                        maxO2
                    );
                }
            }
        }
    }

    oxidarHierro(environment) {
        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {
                if (environment.oxygenGrid[i][j] > 5 &&
                    environment.fe2Grid[i][j] > GameConstants.FE2_DEPLETION_THRESHOLD) {

                    let oxidationRate = GameConstants.FE2_OXIDATION_RATE;

                    environment.oxygenGrid[i][j] -= oxidationRate;
                    environment.fe2Grid[i][j] -= oxidationRate * 4;

                    environment.oxygenGrid[i][j] = max(environment.oxygenGrid[i][j], 0);
                    environment.fe2Grid[i][j] = max(environment.fe2Grid[i][j], 0);
                }
            }
        }
    }
}
