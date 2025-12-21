/**
 * METABOLIC COSTS - Bioenergetics of Primordial Metabolism
 * ========================================================
 * 
 * Calculates energy costs for different metabolic types based on biochemical efficiency.
 * 
 * SCIENTIFIC BASIS:
 * ----------------
 * 1. LUCA Metabolism (Martin & Russell 2007):
 *    - Primitive, inefficient metabolism (2x cost multiplier)
 *    - Likely fermentation-like or chemolithoautotrophic
 *    - No complex electron transport chains
 *    - ATP yield: ~2-4 ATP per glucose equivalent
 * 
 * 2. Fermentation (Müller et al. 2012):
 *    - Anaerobic, moderate efficiency (1.5x multiplier)
 *    - Hydrogenosomes evolved from mitochondrial ancestors
 *    - Oxygen toxicity: Reactive oxygen species (ROS) damage
 *    - ATP yield: ~4-6 ATP per glucose
 * 
 * 3. Chemosynthesis (Nakagawa & Takai 2008):
 *    - Uses chemical energy (H₂, H₂S, CH₄), most efficient (1.0x)
 *    - Requires nitrogen compounds from sediment
 *    - Habitat preference: Deep zones near chemical sources
 *    - ATP yield: ~8-12 ATP per substrate
 * 
 * ENVIRONMENTAL STRESS:
 * --------------------
 * - Fermentation + High O₂: +50% cost (oxygen toxicity)
 * - Chemosynthesis outside sediment: +30% cost (substrate scarcity)
 * 
 * REFERENCES:
 * ----------
 * - Martin, W. & Russell, M. J. (2007). On the origin of biochemistry. Phil. Trans. R. Soc. B.
 * - Müller, M., et al. (2012). Biochemistry and evolution of anaerobic energy metabolism. Microbiol. Mol. Biol. Rev.
 * - Nakagawa, S. & Takai, K. (2008). Deep-sea vent chemoautotrophs. FEMS Microbiol. Ecol.
 */
class MetabolicCosts {
    static calculate(entity, environment) {
        let baseCost = GameConstants.BASE_METABOLIC_COST;
        let metabolismMultiplier = this.getMetabolismMultiplier(entity.dna.metabolismType);
        let environmentalStress = this.getEnvironmentalStress(entity, environment);

        let energyCost, oxygenCost, nitrogenCost, co2Produced;

        // LUCA: Primitive respiration (O₂ → CO₂ + H₂O)
        if (entity.dna.metabolismType === 'luca') {
            energyCost = baseCost * metabolismMultiplier * environmentalStress * entity.dna.metabolicEfficiency * 2;
            oxygenCost = GameConstants.OXYGEN_COST * entity.dna.metabolicEfficiency;
            nitrogenCost = 0;
            // Produce CO₂ proportional to O₂ consumed (1:1 ratio)
            co2Produced = oxygenCost * 1.0;
        }
        // Fermentation: Anaerobic (Glucose → CO₂ + Ethanol, NO O₂)
        else if (entity.dna.metabolismType === 'fermentation') {
            energyCost = baseCost * metabolismMultiplier * environmentalStress * entity.dna.metabolicEfficiency * 2;
            oxygenCost = GameConstants.OXYGEN_COST * entity.dna.metabolicEfficiency;  // Minimal (toxic if >70)
            nitrogenCost = 0;
            // Produce CO₂ from fermentation (without using O₂)
            co2Produced = baseCost * 0.5 * entity.dna.metabolicEfficiency;
        }
        // Chemosynthesis: Uses H₂S/H₂, NOT O₂ (H₂S + CO₂ → CH₂O + S)
        else if (entity.dna.metabolismType === 'chemosynthesis') {
            energyCost = baseCost * metabolismMultiplier * environmentalStress * entity.dna.metabolicEfficiency;
            oxygenCost = 0;  // Does NOT use O₂ in primordial era
            nitrogenCost = baseCost * 0.5 * environmentalStress * entity.dna.metabolicEfficiency;
            // Minimal CO₂ production (uses CO₂ as carbon source)
            co2Produced = baseCost * 0.1 * entity.dna.metabolicEfficiency;
        }

        // Produce CO₂ in environment
        if (co2Produced > 0) {
            environment.produceCO2(entity.pos.x, entity.pos.y, co2Produced);
        }

        return {
            energy: energyCost,
            oxygen: oxygenCost,
            nitrogen: nitrogenCost,
            co2Produced: co2Produced  // For tracking/debugging
        };
    }

    static getMetabolismMultiplier(metabolismType) {
        const multipliers = {
            'luca': GameConstants.LUCA_MULTIPLIER,
            'fermentation': GameConstants.FERMENTATION_MULTIPLIER,
            'chemosynthesis': GameConstants.CHEMOSYNTHESIS_MULTIPLIER
        };
        return multipliers[metabolismType] || 1.0;
    }

    static getEnvironmentalStress(entity, environment) {
        let stress = 1.0;

        if (entity.dna.metabolismType === 'fermentation') {
            // Oxygen toxicity for fermenters
            let oxygenLevel = environment.oxygenGrid?.[floor(entity.pos.x / environment.resolution)]?.[floor(entity.pos.y / environment.resolution)] || 0;
            if (oxygenLevel > 70) {
                stress = 1.5; // 50% higher cost in high oxygen
            }
        } else if (entity.dna.metabolismType === 'chemosynthesis') {
            // Prefers deep zones (sediment)
            if (!environment.isInSediment(entity.pos.y)) {
                stress = 1.3; // 30% higher cost outside sediment
            }
        }

        return stress;
    }
}
