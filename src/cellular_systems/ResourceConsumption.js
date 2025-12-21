// Resource Consumption - Maneja el consumo de recursos del ambiente
class ResourceConsumption {
    static consume(entity, environment) {
        let energyConsumed = 0;
        let oxygenConsumed = 0;
        let nitrogenConsumed = 0;
        let phosphorusConsumed = 0;

        if (entity.dna.metabolismType === 'luca') {
            // ═══════════════════════════════════════════════════════════════════
            // LUCA: Metabolismo quimioautotrófico primitivo
            // ═══════════════════════════════════════════════════════════════════
            // 
            // BASE CIENTÍFICA (Weiss et al. 2016, Martin & Russell 2007):
            // - LUCA usaba gradientes químicos simples para energía (H₂ + CO₂ → orgánicos)
            // - Muy ineficiente comparado con metabolismo moderno (sin cadena de transporte de electrones compleja)
            // - Requería O₂ mínimo para respiración primitiva (pre-aeróbica)
            // - Fósforo crítico para mundo RNA/DNA (Pasek & Lauretta 2005)
            //
            // ✅ IMPLEMENTACIÓN CIENTÍFICAMENTE CORRECTA:
            // ═══════════════════════════════════════════════════════════════════
            // 
            // METABOLISMO REAL DE LUCA (Weiss et al. 2016):
            // Vía Wood-Ljungdahl: H₂ + CO₂ → Acetil-CoA → Biomoléculas
            // - Donador e⁻: H₂ (hidrógeno de vents hidrotermales)
            // - Aceptor e⁻: CO₂ (atmósfera reductora)
            // - Enzimas: Hidrogenasas [NiFe], Ferredoxinas
            // - Energía: Gradiente de protones (pH 9-11 vents vs pH 6-7 océano)
            //
            // EFECTOS EN EL JUEGO:
            // ═══════════════════════════════════════════════════════════════════

            // 1. CONSUMO DE H₂ (DONADOR DE ELECTRONES)
            // ¿Qué hace?: Consume H₂ del grid ambiental (vents hidrotermales)
            // ¿Por qué?: H₂ es el donador de electrones primario en vía Wood-Ljungdahl
            // Efecto en juego: LUCA prospera en SEDIMENTO (vents con H₂ alto)
            //                  Células en superficie (H₂ bajo) mueren de hambre
            //                  → Presión evolutiva para vivir cerca de vents
            //                  → Opuesto a fermentación (que usa luz en superficie)
            let h2Needed = 1.5 * entity.dna.metabolicEfficiency;
            let h2Consumed = environment.consumeH2(entity.pos.x, entity.pos.y, h2Needed);

            // 2. CONSUMO DE CO₂ (ACEPTOR DE ELECTRONES Y FUENTE DE CARBONO)
            // ¿Qué hace?: Consume CO₂ del grid ambiental (atmósfera reductora)
            // ¿Por qué?: CO₂ es el aceptor de electrones y fuente de carbono
            // Efecto en juego: CO₂ es abundante (80-100) así que no es limitante
            //                  Permite fijación de carbono autotrófica
            let co2Needed = 1.0 * entity.dna.metabolicEfficiency;
            let co2Consumed = environment.consumeCO2(entity.pos.x, entity.pos.y, co2Needed);

            // 3. GENERACIÓN DE ENERGÍA (VÍA WOOD-LJUNGDAHL)
            // ¿Qué hace?: Convierte H₂ + CO₂ en energía (ATP vía gradiente de protones)
            // ¿Por qué?: Simula quimiosíntesis primitiva sin fotosíntesis
            // Efecto en juego: Energía proporcional a H₂ disponible (limitante)
            //
            // NOTA CIENTÍFICA: Eficiencia vs Factor de Conversión
            // ═══════════════════════════════════════════════════════════════════
            // Eficiencia termodinámica REAL de Wood-Ljungdahl: ~30-40%
            // (4H₂ + 2CO₂ → CH₃COOH, ΔG° = -95 kJ/mol, ATP captura ~30-40 kJ/mol)
            //
            // PERO en el juego usamos "conversionFactor" (no eficiencia termodinámica)
            // para balance de jugabilidad:
            //
            // JERARQUÍA DE METABOLISMOS (primitivo → evolucionado):
            // - LUCA (1.0):          Primitivo, funcional pero ineficiente
            // - Fermentación (1.5):  Más evolucionado, enzimas optimizadas
            // - Quimiosíntesis (2.0): Especializado, muy eficiente
            // - Fotosíntesis (3.0):  (Futuro) Altamente evolucionado
            //
            // LUCA es el MENOS eficiente, pero suficiente para sobrevivir en vents
            // ═══════════════════════════════════════════════════════════════════

            let conversionFactor = 1.0; // Factor de conversión (primitivo pero funcional)
            energyConsumed = (h2Consumed + co2Consumed) * conversionFactor;
            // Resultado típico: (1.5 + 1.0) × 1.0 = 2.5 energía/frame
            // Suficiente para supervivencia + reproducción lenta

            // 4. CONSUMO MÍNIMO DE O₂ (RESPIRACIÓN PRIMITIVA)
            // ¿Qué hace?: Consume 0.5 unidades de O₂ (muy poco)
            // ¿Por qué?: LUCA vivió en era casi anóxica, O₂ era tóxico pero necesario en trazas
            // Efecto en juego: LUCA puede sobrevivir con O₂ bajo (5-20)
            //                  NO necesita altas concentraciones como aerobios modernos
            // ✅ CIENTÍFICAMENTE CORRECTO
            oxygenConsumed = environment.consumeOxygen(entity.pos.x, entity.pos.y, 0.5);

            // 5. CONSUMO DE FÓSFORO (CRÍTICO PARA DNA/RNA)
            // ¿Qué hace?: Consume 0.3 unidades de fósforo
            // ¿Por qué?: Fósforo es esencial para síntesis de ácidos nucleicos (ATP, DNA, RNA)
            // Efecto en juego: Células necesitan estar cerca de sedimento (rico en P)
            //                  Fósforo es recurso LIMITANTE para reproducción
            //                  → Presión evolutiva para eficiencia en uso de P
            // ✅ CIENTÍFICAMENTE CORRECTO
            phosphorusConsumed = environment.consumePhosphorus(entity.pos.x, entity.pos.y, 0.3);
        }
        else if (entity.dna.metabolismType === 'fermentation') {
            // ═══════════════════════════════════════════════════════════════════
            // FERMENTACIÓN: Metabolismo anaeróbico evolucionado
            // ═══════════════════════════════════════════════════════════════════
            // Conversión Factor: 1.5 (más eficiente que LUCA 1.0)
            // Usa luz directamente (simplificación de juego)
            // Más evolucionado: enzimas optimizadas, menor dependencia de O₂

            let lightAbsorption = ColorSystem.calculateLightAbsorption(entity.dna.color);
            let energyNeeded = 1.5 * entity.dna.metabolicEfficiency; // Factor 1.5 (evolucionado)
            energyConsumed = environment.consumeEnergy(entity.pos.x, entity.pos.y, energyNeeded * lightAbsorption);
            oxygenConsumed = environment.consumeOxygen(entity.pos.x, entity.pos.y, 0.3);
            phosphorusConsumed = environment.consumePhosphorus(entity.pos.x, entity.pos.y, 0.4);
        }
        else if (entity.dna.metabolismType === 'chemosynthesis') {
            // ═══════════════════════════════════════════════════════════════════
            // QUIMIOSÍNTESIS: Metabolismo especializado (altamente evolucionado)
            // ═══════════════════════════════════════════════════════════════════
            // Conversión Factor: 2.0 implícito (1.0 luz + 0.8 N₂ + eficiencia)
            // Especializado en sedimento: usa N₂ como fuente adicional de energía
            // MÁS eficiente que LUCA (1.0) y Fermentación (1.5)

            let lightAbsorption = ColorSystem.calculateLightAbsorption(entity.dna.color);
            let energyNeeded = 1.0 * entity.dna.metabolicEfficiency; // Base energía
            let nitrogenNeeded = 0.8 * entity.dna.metabolicEfficiency; // Energía adicional de N₂
            energyConsumed = environment.consumeEnergy(entity.pos.x, entity.pos.y, energyNeeded * lightAbsorption);
            nitrogenConsumed = environment.consumeNitrogen(entity.pos.x, entity.pos.y, nitrogenNeeded);
            // Energía total efectiva: ~1.0 + 0.8 = 1.8-2.0 (más eficiente)
            oxygenConsumed = environment.consumeOxygen(entity.pos.x, entity.pos.y, 0.3);
            phosphorusConsumed = environment.consumePhosphorus(entity.pos.x, entity.pos.y, 0.5);
        }

        entity.energy += energyConsumed;
        entity.oxygen += oxygenConsumed;
        entity.nitrogen += nitrogenConsumed;
        entity.phosphorus += phosphorusConsumed;

        // SOD (Superoxide Dismutase) maintenance cost
        // Continuous energy cost to maintain SOD protein levels
        // Cost proportional to SOD level (more SOD = more energy)
        let sodCost = OxygenTolerance.getSODMaintenanceCost(entity);
        entity.energy -= sodCost;

        // Cap based on storage capacity
        if (entity.energy > entity.maxResources) entity.energy = entity.maxResources;
        if (entity.oxygen > entity.maxResources) entity.oxygen = entity.maxResources;
        if (entity.nitrogen > entity.maxResources) entity.nitrogen = entity.maxResources;
        if (entity.phosphorus > entity.maxResources) entity.phosphorus = entity.maxResources;
    }
}
