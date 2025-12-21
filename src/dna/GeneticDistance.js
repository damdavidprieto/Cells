// Genetic Distance - Calculates genetic distance between two DNA samples
class GeneticDistance {
    static calculate(dna1, dna2) {
        let distance = 0;

        // Metabolic efficiency difference (normalized to 0-1)
        distance += Math.abs(dna1.metabolicEfficiency - dna2.metabolicEfficiency) / 2.0;

        // Storage capacity difference (normalized to 0-1)
        distance += Math.abs(dna1.storageCapacity - dna2.storageCapacity) / 300.0;

        // Mutation rate difference (normalized to 0-1)
        distance += Math.abs(dna1.mutationRate - dna2.mutationRate) / 0.3;

        // Size difference (normalized to 0-1)
        distance += Math.abs(dna1.size - dna2.size) / 40.0;

        // Flagella level difference (normalized to 0-1)
        distance += Math.abs(dna1.flagellaLevel - dna2.flagellaLevel) / 6.0;

        // Metabolism type (categorical - big jump if different)
        if (dna1.metabolismType !== dna2.metabolismType) {
            distance += 1.0; // Major difference
        }

        // Color difference (normalized to 0-1)
        let colorDist = 0;
        for (let i = 0; i < 3; i++) {
            colorDist += Math.abs(dna1.color[i] - dna2.color[i]) / 255.0;
        }
        distance += colorDist / 3.0;

        // Normalize total distance to percentage (0-100)
        // We have 7 components, so divide by 7 and multiply by 100
        return (distance / 7.0) * 100;
    }
}
