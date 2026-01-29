/**
 * ChemistrySystem.js
 * ==================
 * Inicializador y punto de entrada del sistema de química.
 * Carga la tabla periódica y la hace disponible globalmente.
 */

class ChemistrySystem {
    constructor() {
        this.periodicTable = null;
        this.molecularSystem = null;
        this.initialized = false;
    }

    /**
     * Inicializa el sistema de química
     */
    initialize() {
        if (this.initialized) {
            console.warn('[ChemistrySystem] Already initialized');
            return;
        }

        console.log('[ChemistrySystem] Initializing chemistry system...');

        // Crear instancia de la tabla periódica
        this.periodicTable = new PeriodicTable();

        // Cargar datos de elementos (1-60)
        const elementDataArrays = [
            ELEMENTS_001_020,
            ELEMENTS_021_040,
            ELEMENTS_041_060
            // TODO: Añadir ELEMENTS_061_080, etc. cuando estén disponibles
        ];

        this.periodicTable.initialize(elementDataArrays);

        // Inicializar Sistema Molecular
        this.molecularSystem = new MolecularSystem();
        this.molecularSystem.initialize(this.periodicTable);

        this.initialized = true;
        console.log('[ChemistrySystem] Chemistry system initialized successfully');

        // Mostrar estadísticas
        this.periodicTable.printInfo();
        this.molecularSystem.printInfo();
    }

    /**
     * Obtiene la tabla periódica
     */
    getPeriodicTable() {
        if (!this.initialized) {
            console.error('[ChemistrySystem] System not initialized. Call initialize() first.');
            return null;
        }
        return this.periodicTable;
    }

    /**
     * Búsqueda rápida de elemento
     */
    getElement(query) {
        if (!this.initialized) {
            console.error('[ChemistrySystem] System not initialized.');
            return null;
        }
        return this.periodicTable.search(query);
    }

    /**
     * Obtiene elementos esenciales para la vida
     */
    getEssentialElements() {
        if (!this.initialized) {
            console.error('[ChemistrySystem] System not initialized.');
            return [];
        }
        return this.periodicTable.getEssentialElements();
    }

    /**
     * Obtiene los macronutrientes (CHNOPS)
     */
    getMacronutrients() {
        if (!this.initialized) return [];

        const macronutrientSymbols = ['H', 'C', 'N', 'O', 'P', 'S'];
        return macronutrientSymbols.map(symbol =>
            this.periodicTable.getBySymbol(symbol)
        ).filter(el => el !== undefined);
    }

    /**
     * Verifica si un elemento es esencial para la vida
     */
    isEssential(elementQuery) {
        const element = this.getElement(elementQuery);
        return element ? element.isEssential() : false;
    }

    /**
     * Obtiene información resumida de un elemento
     */
    getElementInfo(elementQuery) {
        const element = this.getElement(elementQuery);
        return element ? element.getSummary() : null;
    }

    // ===== MÉTODOS MOLECULARES =====

    /**
     * Obtiene una molécula por fórmula o nombre
     */
    getMolecule(query) {
        if (!this.initialized) return null;
        return this.molecularSystem.getMolecule(query);
    }

    /**
     * Obtiene una molécula asociada a un grid de Cells
     */
    getMoleculeByGrid(gridName) {
        if (!this.initialized) return null;
        return this.molecularSystem.getByGrid(gridName);
    }

    /**
     * Obtiene todas las moléculas esenciales para la vida
     */
    getEssentialMolecules() {
        if (!this.initialized) return [];
        return this.molecularSystem.getEssentialMolecules();
    }

    // ===== MÉTODOS DE REACCIÓN =====

    /**
     * Obtiene una reacción por ID o nombre
     */
    getReaction(query) {
        if (!this.initialized) return null;
        return this.molecularSystem.getReaction(query) ||
            this.molecularSystem.getReactionByName(query);
    }

    /**
     * Obtiene todas las reacciones de una ruta metabólica
     */
    getReactionsByPathway(pathway) {
        if (!this.initialized) return [];
        return this.molecularSystem.getReactionsByPathway(pathway);
    }

    // ===== MÉTODOS DE ENZIMA =====

    /**
     * Obtiene una enzima por ID o nombre
     */
    getEnzyme(query) {
        if (!this.initialized) return null;
        return this.molecularSystem.getEnzyme(query) ||
            this.molecularSystem.getEnzymeByName(query);
    }

    /**
     * Obtiene todas las enzimas
     */
    getAllEnzymes() {
        if (!this.initialized) return [];
        return this.molecularSystem.getAllEnzymes();
    }
}

// Crear instancia global (opcional, para facilitar el acceso)
// Se puede inicializar manualmente cuando sea necesario
if (typeof window !== 'undefined') {
    window.chemistrySystem = new ChemistrySystem();
}
