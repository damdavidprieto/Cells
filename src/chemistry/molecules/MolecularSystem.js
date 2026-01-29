/**
 * MolecularSystem.js
 * ==================
 * Gestor del sistema molecular.
 * Proporciona acceso a moléculas y métodos de consulta.
 */

class MolecularSystem {
    constructor() {
        this.molecules = new Map(); // Map<formula, Molecule>
        this.nameIndex = new Map(); // Map<name, Molecule>
        this.gridIndex = new Map(); // Map<gridName, Molecule>
        this.reactions = new Map(); // Map<id, Reaction>
        this.reactionIndex = new Map(); // Map<name, Reaction>
        this.enzymes = new Map(); // Map<id, Enzyme>
        this.enzymeIndex = new Map(); // Map<name, Enzyme>
        this.initialized = false;
    }

    /**
     * Inicializa el sistema molecular
     * Requiere que el sistema de química (tabla periódica) esté inicializado
     */
    initialize(periodicTable) {
        if (this.initialized) {
            console.warn('[MolecularSystem] Already initialized');
            return;
        }

        if (!periodicTable) {
            console.error('[MolecularSystem] PeriodicTable is required for initialization');
            return;
        }

        console.log('[MolecularSystem] Initializing molecular system...');

        // Crear moléculas usando la tabla periódica
        const moleculeDataArray = createMolecules(periodicTable);

        // Añadir cada molécula al sistema
        for (let moleculeData of moleculeDataArray) {
            const molecule = new Molecule(moleculeData);
            this.addMolecule(molecule);
        }

        // Crear reacciones usando las moléculas
        const reactionDataArray = createReactions(this);

        for (let reactionData of reactionDataArray) {
            const reaction = new Reaction(reactionData);
            this.addReaction(reaction);
        }

        // Crear enzimas
        const enzymeDataArray = createEnzymes(periodicTable);
        for (let enzymeData of enzymeDataArray) {
            const enzyme = new Enzyme(enzymeData);
            this.addEnzyme(enzyme);
        }

        this.initialized = true;
        console.log(`[MolecularSystem] Loaded ${this.molecules.size} molecules, ${this.reactions.size} reactions, and ${this.enzymes.size} enzymes`);
        this.printInfo();
    }

    /**
     * Añade una molécula al sistema
     */
    addMolecule(molecule) {
        // Índice por fórmula
        this.molecules.set(molecule.formula, molecule);

        // Índice por nombre (inglés y español)
        this.nameIndex.set(molecule.name.toLowerCase(), molecule);
        if (molecule.nameES) {
            this.nameIndex.set(molecule.nameES.toLowerCase(), molecule);
        }
        if (molecule.commonName) {
            this.nameIndex.set(molecule.commonName.toLowerCase(), molecule);
        }

        // Índice por grid
        if (molecule.gridName) {
            this.gridIndex.set(molecule.gridName, molecule);
        }
    }

    // ===== MÉTODOS DE BÚSQUEDA =====

    /**
     * Obtiene una molécula por fórmula
     */
    getByFormula(formula) {
        return this.molecules.get(formula);
    }

    /**
     * Obtiene una molécula por nombre (inglés, español o común)
     */
    getByName(name) {
        return this.nameIndex.get(name.toLowerCase());
    }

    /**
     * Obtiene una molécula por nombre de grid
     */
    getByGrid(gridName) {
        return this.gridIndex.get(gridName);
    }

    /**
     * Búsqueda flexible (intenta por fórmula o nombre)
     */
    getMolecule(query) {
        // Intentar como fórmula
        const byFormula = this.getByFormula(query);
        if (byFormula) return byFormula;

        // Intentar como nombre
        const byName = this.getByName(query);
        if (byName) return byName;

        return null;
    }

    // ===== GESTIÓN DE REACCIONES =====

    /**
     * Añade una reacción al sistema
     */
    addReaction(reaction) {
        this.reactions.set(reaction.id, reaction);
        this.reactionIndex.set(reaction.name.toLowerCase(), reaction);
        if (reaction.nameES) {
            this.reactionIndex.set(reaction.nameES.toLowerCase(), reaction);
        }
    }

    /**
     * Obtiene una reacción por ID
     */
    getReaction(id) {
        return this.reactions.get(id);
    }

    /**
     * Obtiene una reacción por nombre
     */
    getReactionByName(name) {
        return this.reactionIndex.get(name.toLowerCase());
    }

    /**
     * Obtiene reacciones de una ruta metabólica específica
     */
    getReactionsByPathway(pathway) {
        return Array.from(this.reactions.values())
            .filter(r => r.metabolicPathway === pathway);
    }

    /**
     * Obtiene todas las reacciones
     */
    getAllReactions() {
        return Array.from(this.reactions.values());
    }

    // ===== GESTIÓN DE ENZIMAS =====

    /**
     * Añade una enzima al sistema
     */
    addEnzyme(enzyme) {
        this.enzymes.set(enzyme.id, enzyme);
        this.enzymeIndex.set(enzyme.name.toLowerCase(), enzyme);
        if (enzyme.nameES) {
            this.enzymeIndex.set(enzyme.nameES.toLowerCase(), enzyme);
        }
    }

    /**
     * Obtiene una enzima por ID
     */
    getEnzyme(id) {
        return this.enzymes.get(id);
    }

    /**
     * Obtiene una enzima por nombre
     */
    getEnzymeByName(name) {
        return this.enzymeIndex.get(name.toLowerCase());
    }

    /**
     * Obtiene todas las enzimas
     */
    getAllEnzymes() {
        return Array.from(this.enzymes.values());
    }

    // ===== MÉTODOS DE FILTRADO =====

    /**
     * Obtiene todas las moléculas gaseosas
     */
    getGases() {
        return Array.from(this.molecules.values())
            .filter(mol => mol.phase === 'gas');
    }

    /**
     * Obtiene todas las moléculas líquidas
     */
    getLiquids() {
        return Array.from(this.molecules.values())
            .filter(mol => mol.phase === 'liquid');
    }

    /**
     * Obtiene todas las moléculas sólidas
     */
    getSolids() {
        return Array.from(this.molecules.values())
            .filter(mol => mol.phase === 'solid');
    }

    /**
     * Obtiene moléculas esenciales para la vida
     */
    getEssentialMolecules() {
        return Array.from(this.molecules.values())
            .filter(mol => mol.essentialForLife === true);
    }

    /**
     * Obtiene moléculas polares
     */
    getPolarMolecules() {
        return Array.from(this.molecules.values())
            .filter(mol => mol.polarity === 'polar');
    }

    /**
     * Obtiene moléculas no polares
     */
    getNonpolarMolecules() {
        return Array.from(this.molecules.values())
            .filter(mol => mol.polarity === 'nonpolar');
    }

    /**
     * Obtiene moléculas tóxicas
     */
    getToxicMolecules() {
        return Array.from(this.molecules.values())
            .filter(mol => mol.isToxic());
    }

    /**
     * Obtiene moléculas que contienen un elemento específico
     */
    getMoleculesContaining(elementSymbol) {
        return Array.from(this.molecules.values())
            .filter(mol => mol.containsElement(elementSymbol));
    }

    /**
     * Obtiene moléculas involucradas en una ruta metabólica
     */
    getMoleculesByPathway(pathway) {
        return Array.from(this.molecules.values())
            .filter(mol => mol.metabolicPathways.includes(pathway));
    }

    /**
     * Obtiene moléculas con grid asociado
     */
    getMoleculesWithGrid() {
        return Array.from(this.molecules.values())
            .filter(mol => mol.gridName !== null && mol.gridName !== undefined);
    }

    // ===== MÉTODOS DE CONSULTA AVANZADA =====

    /**
     * Filtra moléculas por rango de masa molecular
     */
    getByMassRange(minMass, maxMass) {
        return Array.from(this.molecules.values())
            .filter(mol => mol.molecularMass >= minMass && mol.molecularMass <= maxMass);
    }

    /**
     * Obtiene moléculas ordenadas por masa molecular
     */
    getMoleculesByMass(ascending = true) {
        const molecules = Array.from(this.molecules.values());
        return molecules.sort((a, b) =>
            ascending ? a.molecularMass - b.molecularMass : b.molecularMass - a.molecularMass
        );
    }

    /**
     * Obtiene moléculas por número de átomos
     */
    getByAtomCount(count) {
        return Array.from(this.molecules.values())
            .filter(mol => mol.getTotalAtomCount() === count);
    }

    // ===== MÉTODOS DE UTILIDAD =====

    /**
     * Obtiene el número total de moléculas
     */
    getCount() {
        return this.molecules.size;
    }

    /**
     * Obtiene todas las moléculas como array
     */
    getAllMolecules() {
        return Array.from(this.molecules.values());
    }

    /**
     * Obtiene todas las moléculas ordenadas por fórmula
     */
    getAllMoleculesSorted() {
        return Array.from(this.molecules.values())
            .sort((a, b) => a.formula.localeCompare(b.formula));
    }

    /**
     * Exporta todas las moléculas como JSON
     */
    exportToJSON() {
        const molecules = this.getAllMoleculesSorted();
        return JSON.stringify(molecules.map(mol => mol.toJSON()), null, 2);
    }

    /**
     * Obtiene estadísticas del sistema molecular
     */
    getStatistics() {
        const all = this.getAllMolecules();

        return {
            totalMolecules: all.length,
            gases: this.getGases().length,
            liquids: this.getLiquids().length,
            solids: this.getSolids().length,
            essential: this.getEssentialMolecules().length,
            polar: this.getPolarMolecules().length,
            nonpolar: this.getNonpolarMolecules().length,
            toxic: this.getToxicMolecules().length,
            withGrid: this.getMoleculesWithGrid().length,
            averageMass: this._calculateAverageMass(),
            massRange: this._getMassRange()
        };
    }

    _calculateAverageMass() {
        const molecules = this.getAllMolecules();
        if (molecules.length === 0) return 0;

        const totalMass = molecules.reduce((sum, mol) => sum + mol.molecularMass, 0);
        return parseFloat((totalMass / molecules.length).toFixed(2));
    }

    _getMassRange() {
        const molecules = this.getAllMolecules();
        if (molecules.length === 0) return { min: 0, max: 0 };

        const masses = molecules.map(mol => mol.molecularMass);
        return {
            min: Math.min(...masses),
            max: Math.max(...masses)
        };
    }

    /**
     * Imprime información del sistema en consola
     */
    printInfo() {
        const stats = this.getStatistics();
        console.log('=== MOLECULAR SYSTEM STATISTICS ===');
        console.log(`Total Molecules: ${stats.totalMolecules}`);
        console.log(`Essential for Life: ${stats.essential}`);
        console.log(`With Grid Integration: ${stats.withGrid}`);
        console.log(`\nPhases at 25°C:`);
        console.log(`  Gases: ${stats.gases}`);
        console.log(`  Liquids: ${stats.liquids}`);
        console.log(`  Solids: ${stats.solids}`);
        console.log(`\nPolarity:`);
        console.log(`  Polar: ${stats.polar}`);
        console.log(`  Nonpolar: ${stats.nonpolar}`);
        console.log(`\nMass Range: ${stats.massRange.min} - ${stats.massRange.max} g/mol`);
        console.log(`Average Mass: ${stats.averageMass} g/mol`);
    }

    /**
     * Obtiene el mapeo de grids a moléculas
     */
    getGridMapping() {
        const mapping = {};
        for (let [gridName, molecule] of this.gridIndex) {
            mapping[gridName] = {
                formula: molecule.formula,
                name: molecule.name,
                molecularMass: molecule.molecularMass
            };
        }
        return mapping;
    }

    /**
     * Imprime el mapeo de grids
     */
    printGridMapping() {
        console.log('=== GRID TO MOLECULE MAPPING ===');
        for (let [gridName, molecule] of this.gridIndex) {
            console.log(`${gridName} → ${molecule.getUnicodeFormula()} (${molecule.name}, ${molecule.molecularMass} g/mol)`);
        }
    }
}
