/**
 * OXYGEN TOLERANCE - Sistema de Tolerancia al Oxígeno con SOD
 * ============================================================
 * 
 * Sistema celular que gestiona la defensa contra el estrés oxidativo
 * mediante la proteína SOD (Superóxido Dismutasa).
 * 
 * CONTEXTO CIENTÍFICO - O₂ Tóxico en Era LUCA:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ERA DE LUCA (4.0-3.5 Ga):
 * - O₂ atmosférico: <10⁻⁵ PAL (trazas)
 * - O₂ era TÓXICO para organismos anaeróbicos
 * - Radicales libres dañan proteínas, DNA, lípidos
 * 
 * MECANISMO DE TOXICIDAD:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. FORMACIÓN DE SUPERÓXIDO:
 *    O₂ + e⁻ → O₂⁻ (superóxido - radical libre)
 *    
 *    Fuente: Respiración mitocondrial "imperfecta"
 *    - 1-2% del O₂ se convierte en O₂⁻
 *    - Más O₂ disponible = más O₂⁻ generado
 * 
 * 2. DAÑO CELULAR:
 *    O₂⁻ + [Fe-S] clusters → Fe³⁺ + S (destruye proteínas)
 *    O₂⁻ + DNA → roturas de cadena simple
 *    O₂⁻ + lípidos → peroxidación lipídica
 * 
 * 3. CASCADA DE RADICALES:
 *    O₂⁻ + O₂⁻ + 2H⁺ → H₂O₂ (peróxido de hidrógeno)
 *    H₂O₂ + Fe²⁺ → OH· (radical hidroxilo - MUY reactivo)
 *    OH· + DNA → roturas de doble cadena (letal)
 * 
 * DEFENSA ANCESTRAL: SOD (Superóxido Dismutasa):
 * ═══════════════════════════════════════════════════════════════════
 * 
 * REACCIÓN CATALIZADA:
 * 2O₂⁻ + 2H⁺ → H₂O₂ + O₂
 * 
 * MECANISMO:
 * - SOD convierte O₂⁻ (muy tóxico) en H₂O₂ (menos tóxico)
 * - H₂O₂ luego es eliminado por catalasa (evolución posterior)
 * - Reduce daño oxidativo en ~90%
 * 
 * TIPOS DE SOD:
 * - SOD-Fe: Presente en LUCA (ancestral)
 * - SOD-Mn: Bacterias, mitocondrias
 * - SOD-Cu/Zn: Eucariotas (evolucionó después)
 * 
 * EVIDENCIA DE ANCESTRALIDAD:
 * - SOD presente en TODOS los dominios (Bacteria, Archaea, Eukarya)
 * - Secuencias altamente conservadas
 * - Esencial para vida aeróbica
 * 
 * COSTO ENERGÉTICO:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * SÍNTESIS DE SOD:
 * - ~150 aminoácidos por monómero
 * - Requiere Fe²⁺ o Mn²⁺ (cofactor)
 * - Costo: ~150 ATP por proteína
 * 
 * MANTENIMIENTO:
 * - Recambio proteico: vida media ~24h
 * - Reparación de proteínas oxidadas
 * - Costo continuo: ~5-10% del metabolismo basal
 * 
 * BALANCE COSTO-BENEFICIO:
 * - Costo: Energía para síntesis y mantenimiento
 * - Beneficio: Protección contra O₂ tóxico
 * - En O₂ bajo (<10): costo > beneficio (no vale la pena)
 * - En O₂ alto (>20): beneficio >> costo (esencial)
 * 
 * UMBRALES DE O₂:
 * ═══════════════════════════════════════════════════════════════════
 * 
 * BASADOS EN ESTUDIOS EMPÍRICOS:
 * 
 * O₂ < 10 unidades (~0.5% PAL):
 * - Nivel "seguro" para anaerobios facultativos
 * - Daño oxidativo mínimo
 * - SOD bajo suficiente
 * 
 * O₂ 10-20 unidades (~0.5-1% PAL):
 * - Zona de transición
 * - Daño oxidativo moderado
 * - SOD medio necesario
 * 
 * O₂ > 20 unidades (~1% PAL):
 * - Tóxico para anaerobios estrictos
 * - Daño oxidativo severo
 * - SOD alto esencial
 * 
 * REFERENCIAS:
 * ═══════════════════════════════════════════════════════════════════
 * - Fridovich, I. (1995). Superoxide radical and superoxide dismutases.
 *   Annual Review of Biochemistry, 64(1), 97-112.
 * - McCord, J. M., & Fridovich, I. (1969). Superoxide dismutase.
 *   Journal of Biological Chemistry, 244(22), 6049-6055.
 * - Imlay, J. A. (2013). The molecular mechanisms and physiological
 *   consequences of oxidative stress. Nature Reviews Microbiology, 11(7), 443-454.
 * - Raymond, J., & Segrè, D. (2006). The effect of oxygen on biochemical
 *   networks and the evolution of complex life. Science, 311(5768), 1764-1767.
 */

class OxygenTolerance {
    /**
     * Calcular daño oxidativo por O₂
     * 
     * FÓRMULA:
     * damage = (O₂ - threshold) × (1 - sodEfficiency) × DAMAGE_RATE
     * 
     * PARÁMETROS:
     * - entity: Entidad celular
     * - environment: Entorno (para obtener nivel de O₂)
     * 
     * RETORNA:
     * - Daño oxidativo (0.0 - N)
     */
    static calculateOxidativeDamage(entity, environment) {
        // 1. OBTENER NIVEL DE O₂ EN POSICIÓN DE LA CÉLULA
        // ¿Qué hace?: Lee O₂ del grid ambiental
        // ¿Por qué?: Daño depende de concentración local de O₂
        let oxygenLevel = GridUtils.getGridValue(
            environment.oxygenGrid,
            entity.pos.x,
            entity.pos.y,
            environment.resolution,
            environment.cols,
            environment.rows
        );

        // 2. VERIFICAR SI O₂ ESTÁ POR ENCIMA DEL UMBRAL SEGURO
        // ¿Qué hace?: Compara O₂ con umbral de toxicidad (10)
        // ¿Por qué?: Por debajo de 10, daño es despreciable
        // 
        // UMBRAL CIENTÍFICO:
        // - 10 unidades ≈ 0.5% PAL (nivel microaeróbico)
        // - Anaerobios facultativos toleran hasta este nivel
        // - Por debajo: O₂⁻ generado es mínimo
        if (oxygenLevel <= GameConstants.OXYGEN_SAFE_THRESHOLD) {
            return 0; // Sin daño
        }

        // 3. CALCULAR O₂ EXCESIVO (por encima del umbral)
        // ¿Qué hace?: Calcula cuánto O₂ está por encima de lo seguro
        // ¿Por qué?: Daño es proporcional al exceso de O₂
        let excessOxygen = oxygenLevel - GameConstants.OXYGEN_SAFE_THRESHOLD;

        // 4. OBTENER EFICIENCIA DE SOD
        // ¿Qué hace?: Lee eficiencia de SOD del DNA (trait evolutivo)
        // ¿Por qué?: SOD alto protege más (reduce daño)
        // Rango: 0.0 (sin SOD) → 1.0 (SOD máximo)
        let sodEfficiency = entity.dna.sodEfficiency || 0.5; // Default 0.5

        // 5. CALCULAR FACTOR DE PROTECCIÓN
        // ¿Qué hace?: Calcula cuánto daño pasa a través de la defensa SOD
        // ¿Por qué?: SOD no es 100% eficiente
        // 
        // EJEMPLOS:
        // - sodEfficiency = 0.0 → protectionFactor = 1.0 (0% protección)
        // - sodEfficiency = 0.5 → protectionFactor = 0.5 (50% protección)
        // - sodEfficiency = 1.0 → protectionFactor = 0.0 (100% protección)
        let protectionFactor = 1.0 - sodEfficiency;

        // 6. CALCULAR DAÑO OXIDATIVO
        // ¿Qué hace?: Calcula daño final considerando O₂ excesivo y protección SOD
        // ¿Por qué?: Simula formación de O₂⁻ y daño celular
        // 
        // FÓRMULA:
        // damage = excessO₂ × protectionFactor × DAMAGE_RATE
        // 
        // TASA DE DAÑO (0.05):
        // - Basada en estudios de estrés oxidativo
        // - 1-2% del O₂ se convierte en O₂⁻
        // - O₂⁻ causa daño proporcional
        // 
        // EJEMPLOS:
        // O₂ = 15, SOD = 0.5: (15-10) × 0.5 × 0.05 = 0.125 daño/frame
        // O₂ = 20, SOD = 0.0: (20-10) × 1.0 × 0.05 = 0.5 daño/frame (severo)
        // O₂ = 20, SOD = 0.9: (20-10) × 0.1 × 0.05 = 0.05 daño/frame (leve)
        let damage = excessOxygen * protectionFactor * GameConstants.OXIDATIVE_DAMAGE_RATE;

        return damage;
    }

    /**
     * Actualizar niveles de SOD en la célula
     * 
     * MECANISMO:
     * - SOD se sintetiza según eficiencia del DNA
     * - Nivel de SOD tiende hacia eficiencia del DNA
     * - Síntesis gradual (no instantánea)
     */
    static updateSODLevels(entity) {
        // 1. OBTENER EFICIENCIA OBJETIVO (del DNA)
        // ¿Qué hace?: Lee eficiencia de SOD que la célula "quiere" tener
        // ¿Por qué?: DNA determina capacidad de síntesis de SOD
        let targetSOD = entity.dna.sodEfficiency || 0.5;

        // 2. SÍNTESIS GRADUAL DE SOD
        // ¿Qué hace?: Ajusta nivel actual hacia objetivo gradualmente
        // ¿Por qué?: Síntesis de proteínas no es instantánea
        // 
        // TASA DE SÍNTESIS (0.05/frame):
        // - Basada en vida media de proteínas (~24h)
        // - Permite adaptación gradual a cambios de O₂
        // - Realista: síntesis toma tiempo
        let synthesisRate = 0.05;

        if (entity.sodProtein < targetSOD) {
            // Sintetizar SOD (aumentar nivel)
            entity.sodProtein += synthesisRate;
            entity.sodProtein = min(entity.sodProtein, targetSOD);
        } else if (entity.sodProtein > targetSOD) {
            // Degradar SOD (reducir nivel si DNA cambió)
            entity.sodProtein -= synthesisRate;
            entity.sodProtein = max(entity.sodProtein, targetSOD);
        }
    }

    /**
     * Calcular costo energético de mantenimiento de SOD
     * 
     * COSTO CONTINUO (más riguroso científicamente):
     * - Recambio proteico: vida media ~24h
     * - Reparación de SOD oxidado
     * - Síntesis de nuevas moléculas
     * 
     * RETORNA:
     * - Costo energético (unidades de energía/frame)
     */
    static getSODMaintenanceCost(entity) {
        // 1. OBTENER NIVEL ACTUAL DE SOD
        // ¿Qué hace?: Lee cuánta SOD tiene la célula
        // ¿Por qué?: Costo proporcional a cantidad de SOD
        let sodLevel = entity.sodProtein || 0.5;

        // 2. CALCULAR COSTO DE MANTENIMIENTO
        // ¿Qué hace?: Calcula energía necesaria para mantener SOD
        // ¿Por qué?: Proteínas requieren recambio continuo
        // 
        // COSTO BASE (0.1/frame):
        // - Basado en ~5-10% del metabolismo basal
        // - Incluye: síntesis, degradación, reparación
        // - Proporcional a nivel de SOD
        // 
        // EJEMPLOS:
        // SOD = 0.0: 0.0 × 0.1 = 0.0 energía/frame (sin costo)
        // SOD = 0.5: 0.5 × 0.1 = 0.05 energía/frame (moderado)
        // SOD = 1.0: 1.0 × 0.1 = 0.1 energía/frame (alto)
        let maintenanceCost = sodLevel * GameConstants.SOD_MAINTENANCE_COST;

        return maintenanceCost;
    }
}
