/**
 * Hydrogenase Complex
 * ====================
 * Specialized enzymes (NiFe or FeFe hydrogenases) that process environmental H2
 * to provide reducing power for the Wood-Ljungdahl pathway.
 * 
 * SCIENTIFIC BASIS:
 * - LUCA was dependent on H2 as its primary electron donor.
 * - Hydrogenases are among the most ancient enzymes known.
 */
class HydrogenaseComplex extends Organelle {
    constructor(level = 1) {
        super('hydrogenase_complex', 'Hydrogenase Complex');
        this.level = level;
    }

    getMaintenanceCost() {
        return 0.04 * this.level;
    }

    getConstructionCost() {
        return {
            energy: 30 * this.level,
            phosphorus: 5 * this.level,
            nitrogen: 10 * this.level
        };
    }

    /**
     * Provides a bonus to H2 diffusion efficiency or metabolic yield
     */
    getMetabolicBonus() {
        return 1.0 + (this.level * 0.05); // 5% bonus per level
    }

    getCapabilities() {
        return { HYDROGEN_PROCESSING: this };
    }
}
