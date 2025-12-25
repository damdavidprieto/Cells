/**
 * Chemosynthetic Enzymes
 * ======================
 * Specialized protein complexes for chemical energy extraction.
 */
class ChemosyntheticEnzymes extends Organelle {
    constructor() {
        super('chemosynthetic_enzymes', 'Chemo Enzymes');
    }

    getMaintenanceCost() {
        return 0.03; // Complex enzymes are costly
    }

    getConstructionCost() {
        return { energy: 25, phosphorus: 3, nitrogen: 8 };
    }
}
