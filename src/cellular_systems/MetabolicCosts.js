/**
 * METABOLIC COSTS - Multi-Metabolism System
 * ==========================================
 * 
 * Cells can have multiple metabolic pathways and automatically select the best one
 * based on substrate availability.
 * 
 * PHASE 1 METABOLISMS:
 * -------------------
 * 1. Wood-Ljungdahl (LUCA): H₂ + CO₂ → Acetyl-CoA
 * 2. Fermentation: Energy → CO₂ + ATP
 * 3. Anoxigenic Photosynthesis: H₂ + CO₂ + light → carbohydrates
 * 4. Oxygenic Photosynthesis: CO₂ + light → glucose + O₂
 * 5. Aerobic Respiration: Energy + O₂ → CO₂ + H₂O + 36 ATP
 * 
 * REFERENCES:
 * ----------
 * - Weiss et al. (2016). The physiology and habitat of LUCA.
 * - Martin & Russell (2007). On the origin of biochemistry.
 * - Lane (2015). The Vital Question.
 */
class MetabolicCosts {
    static calculate(entity, environment) {
        let baseCost = GameConstants.BASE_METABOLIC_COST;
        let thermalStress = ThermalStress.calculateThermalStress(entity, environment);

        // MULTI-METABOLISM SYSTEM
        // Try each enabled metabolism and use the best one
        let bestMetabolism = this.selectBestMetabolism(entity, environment);

        if (!bestMetabolism) {
            // No viable metabolism - cell enters dormant state (lower cost than active starvation)
            // SCIENTIFIC NOTE: Bacteria can enter dormancy/spore states to survive
            return {
                energy: baseCost * 2.0,  // Reduced from 10x to 2x (dormancy cost)
                oxygen: 0,
                nitrogen: 0,
                co2Produced: 0
            };
        }

        // Calculate costs and energy production
        let result = this.calculateMetabolismCosts(
            entity,
            environment,
            bestMetabolism.name,
            bestMetabolism.data,
            baseCost,
            thermalStress
        );

        // DEBUG: Log metabolism usage (first 100 frames only to avoid spam)
        if (typeof frameCount !== 'undefined' && frameCount < 100 && frameCount % 30 === 0) {
            console.log(`[Metabolism] Entity using: ${bestMetabolism.name} (efficiency: ${(bestMetabolism.data.efficiency * 100).toFixed(1)}%, availability: ${(bestMetabolism.availability * 100).toFixed(1)}%)`);
        }

        return result;
    }

    /**
     * Select the best available metabolism based on substrate availability
     */
    static selectBestMetabolism(entity, environment) {
        let bestEnergy = -Infinity;
        let bestMetabolism = null;

        for (let [name, data] of Object.entries(entity.dna.metabolisms)) {
            if (!data.enabled || data.efficiency <= 0) continue;

            // Check if substrates are available
            let substrateAvailability = this.checkSubstrates(entity, environment, data);
            if (substrateAvailability <= 0) continue;

            // Calculate potential energy yield
            let potentialEnergy = data.energyYield * data.efficiency * substrateAvailability;

            if (potentialEnergy > bestEnergy) {
                bestEnergy = potentialEnergy;
                bestMetabolism = { name, data, availability: substrateAvailability };
            }
        }

        return bestMetabolism;
    }

    /**
     * Check substrate availability for a metabolism
     * Returns 0-1 (fraction of substrates available)
     */
    static checkSubstrates(entity, environment, metabolism) {
        let minAvailability = 1.0;

        for (let [substrate, amount] of Object.entries(metabolism.substrates)) {
            let available = 0;

            switch (substrate) {
                case 'H2':
                    let col = floor(entity.pos.x / environment.resolution);
                    let row = floor(entity.pos.y / environment.resolution);
                    let h2 = environment.h2Grid?.[col]?.[row] || 0;
                    // SCIENTIFIC UPDATE: Lowered threshold to 0.01 (high affinity hydrogenase)
                    available = h2 >= 0.01 ? min(h2 / amount, 1.0) : 0;
                    break;

                case 'CO2':
                    let co2Col = floor(entity.pos.x / environment.resolution);
                    let co2Row = floor(entity.pos.y / environment.resolution);
                    let co2 = environment.co2Grid?.[co2Col]?.[co2Row] || 0;
                    available = co2 >= 0.1 ? min(co2 / amount, 1.0) : 0;
                    break;

                case 'O2':
                    let o2Col = floor(entity.pos.x / environment.resolution);
                    let o2Row = floor(entity.pos.y / environment.resolution);
                    let o2 = environment.oxygenGrid?.[o2Col]?.[o2Row] || 0;
                    available = o2 >= 1.0 ? min(o2 / (amount * 10), 1.0) : 0;
                    break;

                case 'light':
                    let lightCol = floor(entity.pos.x / environment.resolution);
                    let lightRow = floor(entity.pos.y / environment.resolution);
                    let light = environment.lightGrid?.[lightCol]?.[lightRow] || 0;
                    available = light >= (metabolism.minLightLevel || 0) ? min(light / amount, 1.0) : 0;
                    break;

                case 'energy':
                    // Uses internal energy stores
                    available = entity.energy >= amount ? 1.0 : entity.energy / amount;
                    break;
            }

            minAvailability = min(minAvailability, available);
        }

        return minAvailability;
    }

    /**
     * Calculate costs for a specific metabolism
     */
    static calculateMetabolismCosts(entity, environment, metabolismName, metabolism, baseCost, thermalStress) {
        let energyCost = 0;
        let oxygenCost = 0;
        let nitrogenCost = 0;
        let co2Produced = 0;

        // Consume substrates
        for (let [substrate, amount] of Object.entries(metabolism.substrates)) {
            switch (substrate) {
                case 'H2':
                    environment.consumeH2(entity.pos.x, entity.pos.y, amount);
                    break;
                case 'CO2':
                    environment.consumeCO2(entity.pos.x, entity.pos.y, amount);
                    break;
                case 'O2':
                    oxygenCost = amount;
                    break;
                case 'energy':
                    // Will be deducted from entity.energy
                    break;
            }
        }

        // Calculate energy production
        let energyProduced = metabolism.energyYield * metabolism.efficiency;

        // NEW: Apply Color System Light Absorption
        // Darker cells absorb more light (bonus) but pay higher maintenance cost
        if (metabolism.requiresLight) {
            let absorptionMultiplier = ColorSystem.calculateLightAbsorption(entity.dna.color);
            energyProduced *= absorptionMultiplier;
        }

        // Geochemical bonus (Wood-Ljungdahl in vents)
        if (metabolism.geochemicalBonus && environment.isInSediment(entity.pos.y)) {
            energyProduced += 0.5 * metabolism.efficiency;
        }

        // Base metabolic cost (removed hardcoded * 2 multiplier that was causing starvation)
        let maintenanceCost = baseCost * thermalStress * entity.dna.metabolicEfficiency;

        // Net energy cost (negative = energy gain, positive = energy loss)
        // This will be SUBTRACTED from entity.energy, so negative values increase energy
        energyCost = maintenanceCost - energyProduced;

        // Produce O₂ if oxygenic photosynthesis
        if (metabolism.producesO2 && metabolism.producesO2 > 0) {
            // TODO: Implement produceO2 method in Environment
            // environment.produceO2(entity.pos.x, entity.pos.y, metabolism.producesO2 * metabolism.efficiency);
        }

        // Produce CO₂ (most metabolisms)
        if (metabolismName !== 'oxigenicPhotosynthesis') {
            co2Produced = baseCost * 0.1 * metabolism.efficiency;
            environment.produceCO2(entity.pos.x, entity.pos.y, co2Produced);
        }

        return {
            energy: energyCost,  // Can be negative (gain) or positive (loss)
            oxygen: oxygenCost,
            nitrogen: nitrogenCost,
            co2Produced: co2Produced,
            metabolismUsed: metabolismName  // For debugging/logging
        };
    }
}
