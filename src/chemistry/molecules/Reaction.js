/**
 * Reaction.js
 * ===========
 * Clase que representa una reacción química.
 * Utiliza moléculas del MolecularSystem para calcular estequiometría y termodinámica.
 */

class Reaction {
    constructor(data) {
        this.name = data.name;                 // Nombre de la reacción (ej: 'Metanogénesis')
        this.id = data.id;                     // ID único

        // Reactivos y Productos: [{molecule: Molecule, coefficient: number}]
        this.reactants = data.reactants || [];
        this.products = data.products || [];

        // Propiedades Energéticas
        this.deltaG = data.deltaG || this.calculateDeltaG(); // ΔGr° (kJ/mol)
        this.activationEnergy = data.activationEnergy;       // Ea (kJ/mol)

        // Condiciones Óptimas (opcional)
        this.optimumPH = data.optimumPH;
        this.optimumRedox = data.optimumRedox;

        // Relevancia Biológica
        this.metabolicPathway = data.metabolicPathway;
        this.organisms = data.organisms || []; // Organismos que la realizan
    }

    /**
     * Calcula la Energía Libre de Gibbs de la reacción (ΔGr°)
     * ΔGr° = Σ (n * ΔGf° productos) - Σ (n * ΔGf° reactivos)
     */
    calculateDeltaG() {
        let reactantsG = 0;
        let productsG = 0;

        for (let r of this.reactants) {
            reactantsG += (r.molecule.gibbsEnergy || 0) * r.coefficient;
        }

        for (let p of this.products) {
            productsG += (p.molecule.gibbsEnergy || 0) * p.coefficient;
        }

        return parseFloat((productsG - reactantsG).toFixed(2));
    }

    /**
     * Verifica si la reacción es exergónica (produce energía)
     */
    isExergonic() {
        return this.deltaG < 0;
    }

    /**
     * Verifica si la reacción es endergónica (consume energía)
     */
    isEndergonic() {
        return this.deltaG > 0;
    }

    /**
     * Calcula el ATP potencial producido
     * Asumiendo ~30.5 kJ/mol para 1 mol de ATP
     */
    calculateATPYield(efficiency = 1.0) {
        if (!this.isExergonic()) return 0;
        const atpStandardEnergy = 30.5; // kJ/mol
        return (Math.abs(this.deltaG) / atpStandardEnergy) * efficiency;
    }

    /**
     * Verifica si la reacción está balanceada en masa
     */
    isMassBalanced() {
        const reactantAtoms = this._getAtomCounts(this.reactants);
        const productAtoms = this._getAtomCounts(this.products);

        const allElements = new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]);

        for (let element of allElements) {
            if (reactantAtoms[element] !== productAtoms[element]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Verifica si la reacción está balanceada en carga
     */
    isChargeBalanced() {
        let reactantCharge = 0;
        let productCharge = 0;

        for (let r of this.reactants) {
            reactantCharge += (r.molecule.charge || 0) * r.coefficient;
        }

        for (let p of this.products) {
            productCharge += (p.molecule.charge || 0) * p.coefficient;
        }

        return reactantCharge === productCharge;
    }

    _getAtomCounts(compoundList) {
        const counts = {};
        for (let item of compoundList) {
            const molComposition = item.molecule.getAtomicComposition();
            for (let [element, count] of Object.entries(molComposition)) {
                counts[element] = (counts[element] || 0) + count * item.coefficient;
            }
        }
        return counts;
    }

    /**
     * Obtiene la ecuación química en formato texto
     */
    getEquationText() {
        const formatSide = (side) => side.map(item =>
            `${item.coefficient > 1 ? item.coefficient : ''}${item.molecule.getUnicodeFormula()}`
        ).join(' + ');

        return `${formatSide(this.reactants)} ➔ ${formatSide(this.products)}`;
    }

    /**
     * Obtiene la ecuación química en formato HTML
     */
    getEquationHTML() {
        const formatSide = (side) => side.map(item =>
            `${item.coefficient > 1 ? item.coefficient : ''}${item.molecule.getHTMLFormula()}`
        ).join(' + ');

        return `${formatSide(this.reactants)} &rarr; ${formatSide(this.products)}`;
    }

    /**
     * Calcula los requerimientos de sustrato para una cantidad deseada de producto
     */
    calculateRequirementsForProduct(targetMoleculeFormula, targetAmount) {
        const product = this.products.find(p => p.molecule.formula === targetMoleculeFormula);
        if (!product) return null;

        const ratio = targetAmount / product.coefficient;

        return {
            reactants: this.reactants.map(r => ({
                formula: r.molecule.formula,
                amount: r.coefficient * ratio
            })),
            energy: Math.abs(this.deltaG * ratio)
        };
    }

    /**
     * Informasión detallada de la reacción
     */
    getSummary() {
        return {
            name: this.name,
            equation: this.getEquationText(),
            deltaG: this.deltaG,
            atpYield: this.calculateATPYield().toFixed(2),
            isBalanced: this.isMassBalanced() && this.isChargeBalanced(),
            pathway: this.metabolicPathway
        };
    }
}
