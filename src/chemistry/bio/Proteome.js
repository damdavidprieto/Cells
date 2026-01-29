/**
 * Proteome.js
 * ===========
 * Gestiona el inventario de proteínas y enzimas de una célula.
 * Controla la síntesis, degradación y el impacto catalítico en el metabolismo.
 */

class Proteome {
    constructor(entity) {
        this.entity = entity; // Referencia a la célula
        this.proteins = new Map(); // Map<proteinId, { count: number, quality: number }>
        this.totalProteinMass = 0;
    }

    /**
     * Sintetiza una nueva proteína/enzima
     * @param {Enzyme|Protein} proteinTemplate - El prototipo de la proteína
     */
    synthesize(proteinTemplate) {
        const cost = proteinTemplate.calculateSynthesisEnergy(this.entity.dna.metabolicEfficiency || 1.0);

        // Verificar si la célula tiene suficiente energía
        if (this.entity.energy < cost) {
            console.warn(`[Proteome] Not enough energy to synthesize ${proteinTemplate.name}`);
            return false;
        }

        // Consumir energía de la célula
        this.entity.energy -= cost;

        // Añadir al inventario
        const existing = this.proteins.get(proteinTemplate.id) || { count: 0, quality: 1.0 };
        existing.count += 1;
        this.proteins.set(proteinTemplate.id, existing);

        this.totalProteinMass += proteinTemplate.aminoAcidCount;

        console.log(`[Proteome] Synthesized ${proteinTemplate.nameES}. Current count: ${existing.count}`);
        return true;
    }

    /**
     * Obtiene el multiplicador catalítico para una reacción específica
     * @param {string} reactionId - ID de la reacción química
     * @param {ChemistrySystem} chemistryRef - Referencia al sistema de química
     * @param {Environment} environment - Referencia al entorno para detectar cofactores
     */
    getCatalyticBonus(reactionId, chemistryRef, environment) {
        let totalBonus = 0; // Bonus sumatorio sobre la base 1.0

        for (let [proteinId, data] of this.proteins) {
            const enzyme = chemistryRef.getEnzyme(proteinId);
            if (enzyme && enzyme.targetReactionId === reactionId) {

                // 1. Calcular disponibilidad de cofactores en la posición de la célula
                const cellPos = this.entity.pos;
                const context = { elements: {} };

                for (let symbol of enzyme.cofactors) {
                    // Detectar nivel del metal traza en el entorno
                    // Usamos el entorno para consultar la concentración local
                    const level = environment.getTraceElementLevel(cellPos.x, cellPos.y, symbol);

                    // Umbral de saturación: 0.1 es suficiente para funcionar al 100%
                    // Si el nivel es bajo, la eficiencia cae linealmente hacia un mínimo basal (0.1)
                    context.elements[symbol] = level >= 0.1 ? 1.0 : (0.1 + level * 9);
                }

                // 2. Aplicar eficiencia de la enzima con sus cofactores
                const vMax = enzyme.catalyze(chemistryRef.getReaction(reactionId), context);

                // 3. Cinética de saturación según cantidad de enzimas (Michaelis-Menten)
                const count = data.count;
                const km = 10;
                const bonus = (vMax * count) / (km + count);

                totalBonus += bonus;
            }
        }

        return 1.0 + totalBonus;
    }

    /**
     * Paso de tiempo: degradación natural de proteínas
     */
    update() {
        // Por ahora simple: pequeña probabilidad de pérdida por frame
        // En una versión avanzada, dependería de la 'halfLife' de cada proteína
        for (let [proteinId, data] of this.proteins) {
            if (Math.random() < 0.001) { // Desgaste natural
                data.count = Math.max(0, data.count - 1);
                if (data.count === 0) this.proteins.delete(proteinId);
            }
        }
    }

    /**
     * Información para el inspector de la célula
     */
    getSummary() {
        const summary = [];
        for (let [id, data] of this.proteins) {
            summary.push({ id, count: data.count });
        }
        return summary;
    }
}
