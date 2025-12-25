/**
 * Hydrogenosome Organelle
 * =======================
 * Anaerobic energy generation (Fermentation precursor).
 * Evolved from basic LUCA metabolism or endosymbiosis.
 */
class Hydrogenosome extends Organelle {
    constructor() {
        super('hydrogenosome', 'Hydrogenosomes');
    }

    getMaintenanceCost() {
        return 0.02; // Cost to maintain the organelle
    }

    getConstructionCost() {
        return { energy: 20, phosphorus: 2, nitrogen: 5 };
    }

    applyEffect(entity) {
        // Enables fermentation metabolism
        // This logic is mostly handled in MetabolicCosts.js via the metabolismType flag
    }
}
