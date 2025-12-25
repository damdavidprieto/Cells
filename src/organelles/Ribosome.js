/**
 * Ribosome Organelle
 * ==================
 * Essential for protein synthesis.
 * All cells must have ribosomes to survive.
 */
class Ribosome extends Organelle {
    constructor() {
        super('ribosome', 'Ribosomes');
    }

    getMaintenanceCost() {
        // Base cost for maintaining protein synthesis machinery
        return 0.01;
    }

    getConstructionCost() {
        // High phosphorus cost (RNA rich)
        return { energy: 10, phosphorus: 5, nitrogen: 2 };
    }
}
