/**
 * Enzyme.js
 * =========
 * Proteína especializada que actúa como catalizador de reacciones químicas.
 * Vincula el ADN (maquinaria) con el MolecularSystem (química).
 */

class Enzyme extends Protein {
    constructor(data) {
        super(data);

        this.targetReactionId = data.targetReactionId; // Reacción que cataliza
        this.catalyticEfficiency = data.efficiency || 1.0; // Multiplicador de velocidad

        // Cofactores Metálicos (Requerimiento de elementos traza)
        // Ejemplo: ['Fe', 'S'] para clústeres de hierro-azufre
        this.cofactors = data.cofactors || [];

        this.type = 'enzyme';
    }

    /**
     * Aplica el efecto de la enzima a una reacción
     * @param {Reaction} reaction - La reacción a catalizar
     * @param {Object} cellContext - Contexto de la célula (presencia de cofactores)
     */
    catalyze(reaction, cellContext = {}) {
        if (reaction.id !== this.targetReactionId) return 1.0;

        // Verificar si la célula tiene los cofactores necesarios del entorno
        let cofactorMultiplier = 1.0;

        for (let symbol of this.cofactors) {
            // Si falta un cofactor esencial (como Mo o Fe), la eficiencia cae drásticamente
            const available = cellContext.elements && cellContext.elements[symbol] ? 1.0 : 0.1;
            cofactorMultiplier *= available;
        }

        return this.catalyticEfficiency * cofactorMultiplier;
    }

    /**
     * Obtiene el resumen de la enzima y su impacto
     */
    getEnzymeSummary() {
        return {
            name: this.nameES,
            catalyzes: this.targetReactionId,
            efficiency: this.catalyticEfficiency,
            requiredCofactors: this.cofactors,
            synthesisCost: this.baseSynthesisCost
        };
    }
}
