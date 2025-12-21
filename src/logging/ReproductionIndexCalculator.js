/**
 * REPRODUCTION INDEX CALCULATOR
 * ==============================
 * 
 * Calcula el índice teórico de reproducción basado en el balance energético
 * y los requisitos de recursos del código actual.
 */

class ReproductionIndexCalculator {
    /**
     * Calcula el índice teórico de reproducción
     * 
     * @returns {Object} - Índice y detalles del cálculo
     */
    static calculate() {
        // 1. BALANCE ENERGÉTICO (LUCA en vents)
        const energyIncome = this.calculateEnergyIncome();
        const energyExpenses = this.calculateEnergyExpenses();
        const netEnergy = energyIncome - energyExpenses;

        // 2. REQUISITOS PARA REPRODUCCIÓN
        const reproductionRequirements = this.getReproductionRequirements();

        // 3. TIEMPO HASTA REPRODUCCIÓN
        const framesUntilReproduction = reproductionRequirements.energy / netEnergy;

        // 4. FACTORES LIMITANTES
        const limitingFactors = this.identifyLimitingFactors();

        // 5. ÍNDICE TEÓRICO
        // Basado en probabilidad de sobrevivir hasta reproducción
        let theoreticalIndex = 0.7; // Base: 70% en condiciones ideales

        // Ajustar por factores limitantes
        if (limitingFactors.includes('phosphorus')) {
            theoreticalIndex *= 0.9; // -10% por P limitante
        }
        if (limitingFactors.includes('oxygen_toxicity')) {
            theoreticalIndex *= 0.8; // -20% por O₂ tóxico
        }

        return {
            theoretical_index: theoreticalIndex,
            frames_until_reproduction: Math.round(framesUntilReproduction),
            energy_balance: {
                income: energyIncome,
                expenses: energyExpenses,
                net: netEnergy
            },
            requirements: reproductionRequirements,
            limiting_factors: limitingFactors,
            conditions: 'Ideal conditions (vents, abundant resources)',
            interpretation: this.getInterpretation(theoreticalIndex, framesUntilReproduction)
        };
    }

    /**
     * Calcula ingresos de energía (LUCA en vents)
     */
    static calculateEnergyIncome() {
        // H₂ + CO₂ → energía
        const h2Consumption = 1.5; // metabolicEfficiency ≈ 1.0
        const co2Consumption = 1.0;
        const conversionFactor = 1.0; // LUCA

        return (h2Consumption + co2Consumption) * conversionFactor; // 2.5
    }

    /**
     * Calcula gastos de energía
     */
    static calculateEnergyExpenses() {
        const metabolismBase = 1.5; // Costo metabólico base
        const sodCost = 0.5 * GameConstants.SOD_MAINTENANCE_COST; // 0.025 (SOD=0.5)
        const pigmentCost = 0.1; // Costo de pigmento
        const oxidativeDamage = 0; // En vents (O₂ < 10)

        return metabolismBase + sodCost + pigmentCost + oxidativeDamage; // 1.625
    }

    /**
     * Obtiene requisitos para reproducción
     */
    static getReproductionRequirements() {
        return {
            energy: 100, // 50% de maxResources (200)
            oxygen: 50,
            phosphorus: 30,
            nitrogen: 30
        };
    }

    /**
     * Identifica factores limitantes
     */
    static identifyLimitingFactors() {
        const factors = [];

        // Fósforo (regeneración muy lenta)
        if (GameConstants.PHOSPHORUS_REGENERATION_RATE < 0.01) {
            factors.push('phosphorus');
        }

        // Oxígeno tóxico en superficie
        if (GameConstants.OXYGEN_SAFE_THRESHOLD <= 10) {
            factors.push('oxygen_toxicity');
        }

        // Fe²⁺ agotamiento
        if (GameConstants.FE2_DEPLETION_THRESHOLD > 0) {
            factors.push('fe2_depletion');
        }

        return factors;
    }

    /**
     * Genera interpretación del índice
     */
    static getInterpretation(index, frames) {
        let interpretation = '';

        if (index >= 0.7) {
            interpretation = `High reproduction rate: ${Math.round(index * 100)}% of cells should reproduce at least once before dying. Average time to first reproduction: ${frames} frames.`;
        } else if (index >= 0.4) {
            interpretation = `Moderate reproduction rate: ${Math.round(index * 100)}% of cells should reproduce. Population may be stable but slow growth.`;
        } else {
            interpretation = `Low reproduction rate: Only ${Math.round(index * 100)}% of cells reproduce. Population likely declining.`;
        }

        return interpretation;
    }
}
