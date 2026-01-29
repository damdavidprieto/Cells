/**
 * Protein.js
 * ==========
 * Representa una macromolécula biológica (proteína) compuesta por aminoácidos.
 * Hereda de Molecule ya que es, en esencia, una molécula compleja.
 */

class Protein extends Molecule {
    constructor(data) {
        // Para proteínas, la fórmula es a menudo demasiado compleja, 
        // así que usamos una representación abstracta o el nombre.
        super(data);

        this.aminoAcidCount = data.aminoAcidCount || 0; // Tamaño de la proteína
        this.baseSynthesisCost = data.baseSynthesisCost || 10; // Coste base en energía (ATP)

        // Estabilidad y degradación
        this.halfLife = data.halfLife || 1000; // Frames de vida media
        this.isFoldingCorrect = true;          // Calidad de la síntesis

        this.type = 'protein';
    }

    /**
     * Calcula el coste total de síntesis considerando tamaño y eficiencia
     */
    calculateSynthesisEnergy(cellEfficiency = 1.0) {
        return (this.baseSynthesisCost * (this.aminoAcidCount / 100)) / cellEfficiency;
    }

    /**
     * Devuelve el coste en materiales (aminoácidos)
     * Simplificado: 1 unidad de 'Glicina' por cada N aminoácidos
     */
    getMaterialRequirements() {
        return {
            glycine: Math.ceil(this.aminoAcidCount / 10)
        };
    }
}
