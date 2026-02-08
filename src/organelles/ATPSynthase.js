/**
 * ATP Synthase Complex
 * ====================
 * Ancient molecular machine that converts the natural Proton Motive Force (PMF)
 * from the alkaline vent gradient into biochemical energy (ATP).
 * 
 * SCIENTIFIC BASIS:
 * - Lane & Martin (2012): The ATP synthase is universal and likely ancestral.
 * - LUCA utilized the natural pH gradient of alkaline vents.
 */
class ATPSynthase extends Organelle {
    constructor(level = 1) {
        super('atp_synthase', 'ATP Synthase Complex');
        this.level = level;
    }

    getMaintenanceCost() {
        return 0.05 * this.level; // High protein turnover cost
    }

    getConstructionCost() {
        return {
            energy: 50 * this.level,
            phosphorus: 10 * this.level,
            nitrogen: 15 * this.level
        };
    }

    /**
     * Calculate energy yield from pH gradient
     */
    calculatePMFYield(phGradient) {
        if (phGradient <= 0) return 0;
        // Efficiency scales with level
        let efficiency = 0.5 + (this.level * 0.1);
        return phGradient * GameConstants.PMF_ENERGY_YIELD * efficiency;
    }

    getCapabilities() {
        return { PMF_CONVERSION: this };
    }
}
