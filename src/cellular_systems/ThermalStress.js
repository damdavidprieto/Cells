/**
 * THERMAL STRESS SYSTEM
 * =====================
 * 
 * Simulates metabolic stress from temperature deviation.
 * 
 * SCIENTIFIC BASIS:
 * ----------------
 * - Enzymes have optimal temperature ranges (Arrhenius equation)
 * - Deviation from optimum increases metabolic cost
 * - LUCA lived in warm environments (50-80°C) near hydrothermal vents
 * - Temperature affects protein folding and enzyme kinetics
 * 
 * IMPLEMENTATION:
 * --------------
 * - Cells have thermalOptimum (50-80°C)
 * - Cells have thermalTolerance (±5-15°C)
 * - Outside tolerance → increased metabolic cost
 * - Creates evolutionary pressure for thermal niche specialization
 * 
 * REFERENCES:
 * ----------
 * - Weiss et al. (2016) - LUCA lived in hydrothermal vents (70-80°C)
 * - Daniel & Danson (2013) - Temperature adaptation in extremophiles
 */
class ThermalStress {
    /**
     * Calculate thermal stress multiplier
     * Returns 1.0 (no stress) to 2.0 (severe stress)
     * 
     * @param {Entity} entity - The cell experiencing thermal stress
     * @param {Environment} environment - The environment with temperature grid
     * @returns {number} Stress multiplier (1.0 = no stress, 2.0 = 100% cost increase)
     */
    static calculateThermalStress(entity, environment) {
        if (!GameConstants.TEMPERATURE_ENABLED) {
            return 1.0; // No stress if temperature system disabled
        }

        // Get current temperature at cell position
        let currentTemp = environment.getTemperature(entity.pos.x, entity.pos.y);

        // Calculate deviation from optimal temperature
        let tempDeviation = Math.abs(currentTemp - entity.dna.thermalOptimum);

        // Within tolerance → no stress
        if (tempDeviation <= entity.dna.thermalTolerance) {
            return 1.0;
        }

        // Outside tolerance → stress increases linearly
        // Each degree beyond tolerance increases metabolic cost
        let excessDeviation = tempDeviation - entity.dna.thermalTolerance;
        let stressMultiplier = 1.0 + (excessDeviation * GameConstants.THERMAL_STRESS_MULTIPLIER);

        // Cap at 2.0 (100% increase in metabolic cost)
        // Prevents extreme values that would kill all cells
        return Math.min(stressMultiplier, 2.0);
    }

    /**
     * Get thermal stress category for logging/debugging
     * 
     * @param {number} stressMultiplier - The stress multiplier value
     * @returns {string} Category: 'none', 'low', 'medium', 'high', 'severe'
     */
    static getStressCategory(stressMultiplier) {
        if (stressMultiplier <= 1.0) return 'none';
        if (stressMultiplier <= 1.2) return 'low';
        if (stressMultiplier <= 1.5) return 'medium';
        if (stressMultiplier <= 1.8) return 'high';
        return 'severe';
    }
}
