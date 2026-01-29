/**
 * PeriodicTable.js
 * ================
 * Gestor principal del sistema de tabla periódica.
 * Contiene todos los elementos y proporciona métodos de búsqueda, filtrado y consulta.
 */

class PeriodicTable {
    constructor() {
        this.elements = new Map(); // Map<atomicNumber, Element>
        this.symbolIndex = new Map(); // Map<symbol, Element>
        this.nameIndex = new Map(); // Map<name, Element>
        this.initialized = false;
    }

    /**
     * Inicializa la tabla periódica con todos los elementos
     */
    initialize(elementDataArrays) {
        console.log('[PeriodicTable] Initializing periodic table...');

        // Cargar todos los arrays de datos de elementos
        for (let dataArray of elementDataArrays) {
            for (let elementData of dataArray) {
                const element = new Element(elementData);
                this.addElement(element);
            }
        }

        this.initialized = true;
        console.log(`[PeriodicTable] Loaded ${this.elements.size} elements`);
    }

    /**
     * Añade un elemento a la tabla
     */
    addElement(element) {
        this.elements.set(element.atomicNumber, element);
        this.symbolIndex.set(element.symbol.toUpperCase(), element);
        this.nameIndex.set(element.name.toLowerCase(), element);
        if (element.nameES) {
            this.nameIndex.set(element.nameES.toLowerCase(), element);
        }
    }

    // ===== MÉTODOS DE BÚSQUEDA =====

    /**
     * Obtiene un elemento por número atómico
     */
    getByAtomicNumber(atomicNumber) {
        return this.elements.get(atomicNumber);
    }

    /**
     * Obtiene un elemento por símbolo químico
     */
    getBySymbol(symbol) {
        return this.symbolIndex.get(symbol.toUpperCase());
    }

    /**
     * Obtiene un elemento por nombre (inglés o español)
     */
    getByName(name) {
        return this.nameIndex.get(name.toLowerCase());
    }

    /**
     * Búsqueda flexible (intenta por número, símbolo o nombre)
     */
    search(query) {
        // Intentar como número atómico
        const asNumber = parseInt(query);
        if (!isNaN(asNumber)) {
            const element = this.getByAtomicNumber(asNumber);
            if (element) return element;
        }

        // Intentar como símbolo
        const bySymbol = this.getBySymbol(query);
        if (bySymbol) return bySymbol;

        // Intentar como nombre
        const byName = this.getByName(query);
        if (byName) return byName;

        return null;
    }

    // ===== MÉTODOS DE FILTRADO =====

    /**
     * Obtiene todos los elementos de una categoría
     */
    getByCategory(categoryId) {
        return Array.from(this.elements.values())
            .filter(el => el.category === categoryId);
    }

    /**
     * Obtiene todos los elementos de un grupo
     */
    getByGroup(group) {
        return Array.from(this.elements.values())
            .filter(el => el.group === group);
    }

    /**
     * Obtiene todos los elementos de un periodo
     */
    getByPeriod(period) {
        return Array.from(this.elements.values())
            .filter(el => el.period === period);
    }

    /**
     * Obtiene todos los elementos de un bloque
     */
    getByBlock(block) {
        return Array.from(this.elements.values())
            .filter(el => el.block === block);
    }

    /**
     * Obtiene todos los elementos esenciales para la vida
     */
    getEssentialElements() {
        return Array.from(this.elements.values())
            .filter(el => el.essentialForLife === true);
    }

    /**
     * Obtiene elementos por fase a temperatura ambiente
     */
    getByPhase(phase) {
        return Array.from(this.elements.values())
            .filter(el => el.phase === phase);
    }

    /**
     * Obtiene elementos radioactivos
     */
    getRadioactiveElements() {
        return Array.from(this.elements.values())
            .filter(el => el.radioactive === true);
    }

    /**
     * Obtiene elementos metálicos
     */
    getMetals() {
        return Array.from(this.elements.values())
            .filter(el => el.isMetal());
    }

    /**
     * Obtiene elementos no metálicos
     */
    getNonmetals() {
        return Array.from(this.elements.values())
            .filter(el => el.isNonmetal());
    }

    // ===== MÉTODOS DE CONSULTA AVANZADA =====

    /**
     * Filtra elementos por rango de masa atómica
     */
    getByMassRange(minMass, maxMass) {
        return Array.from(this.elements.values())
            .filter(el => el.atomicMass >= minMass && el.atomicMass <= maxMass);
    }

    /**
     * Filtra elementos por rango de electronegatividad
     */
    getByElectronegativityRange(min, max) {
        return Array.from(this.elements.values())
            .filter(el => el.electronegativity &&
                el.electronegativity >= min &&
                el.electronegativity <= max);
    }

    /**
     * Obtiene elementos descubiertos en un rango de años
     */
    getByDiscoveryYearRange(startYear, endYear) {
        return Array.from(this.elements.values())
            .filter(el => el.discoveryYear &&
                el.discoveryYear >= startYear &&
                el.discoveryYear <= endYear);
    }

    /**
     * Filtra elementos por abundancia en corteza terrestre
     */
    getMostAbundantInCrust(limit = 10) {
        return Array.from(this.elements.values())
            .filter(el => el.crustalAbundance !== null && el.crustalAbundance !== undefined)
            .sort((a, b) => b.crustalAbundance - a.crustalAbundance)
            .slice(0, limit);
    }

    /**
     * Filtra elementos por abundancia en océanos
     */
    getMostAbundantInOcean(limit = 10) {
        return Array.from(this.elements.values())
            .filter(el => el.oceanicAbundance !== null && el.oceanicAbundance !== undefined)
            .sort((a, b) => b.oceanicAbundance - a.oceanicAbundance)
            .slice(0, limit);
    }

    // ===== MÉTODOS DE UTILIDAD =====

    /**
     * Obtiene el número total de elementos
     */
    getCount() {
        return this.elements.size;
    }

    /**
     * Obtiene todos los elementos como array
     */
    getAllElements() {
        return Array.from(this.elements.values());
    }

    /**
     * Obtiene todos los elementos ordenados por número atómico
     */
    getAllElementsSorted() {
        return Array.from(this.elements.values())
            .sort((a, b) => a.atomicNumber - b.atomicNumber);
    }

    /**
     * Exporta todos los elementos como JSON
     */
    exportToJSON() {
        const elements = this.getAllElementsSorted();
        return JSON.stringify(elements.map(el => el.toJSON()), null, 2);
    }

    /**
     * Obtiene estadísticas de la tabla periódica
     */
    getStatistics() {
        const all = this.getAllElements();

        return {
            totalElements: all.length,
            metals: this.getMetals().length,
            nonmetals: this.getNonmetals().length,
            radioactive: this.getRadioactiveElements().length,
            essential: this.getEssentialElements().length,
            solids: this.getByPhase(Phase.SOLID).length,
            liquids: this.getByPhase(Phase.LIQUID).length,
            gases: this.getByPhase(Phase.GAS).length,
            categoryCounts: this._getCategoryCounts(),
            blockCounts: this._getBlockCounts()
        };
    }

    _getCategoryCounts() {
        const counts = {};
        for (let element of this.elements.values()) {
            counts[element.category] = (counts[element.category] || 0) + 1;
        }
        return counts;
    }

    _getBlockCounts() {
        const counts = {};
        for (let element of this.elements.values()) {
            counts[element.block] = (counts[element.block] || 0) + 1;
        }
        return counts;
    }

    /**
     * Imprime información de la tabla periódica en consola
     */
    printInfo() {
        const stats = this.getStatistics();
        console.log('=== PERIODIC TABLE STATISTICS ===');
        console.log(`Total Elements: ${stats.totalElements}`);
        console.log(`Metals: ${stats.metals}`);
        console.log(`Nonmetals: ${stats.nonmetals}`);
        console.log(`Radioactive: ${stats.radioactive}`);
        console.log(`Essential for Life: ${stats.essential}`);
        console.log(`\nPhases at 25°C:`);
        console.log(`  Solids: ${stats.solids}`);
        console.log(`  Liquids: ${stats.liquids}`);
        console.log(`  Gases: ${stats.gases}`);
        console.log('\nCategory Distribution:', stats.categoryCounts);
        console.log('Block Distribution:', stats.blockCounts);
    }
}
