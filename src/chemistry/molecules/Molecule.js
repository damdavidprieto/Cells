/**
 * Molecule.js
 * ===========
 * Clase que representa una molécula química.
 * Las moléculas se construyen a partir de elementos de la tabla periódica.
 */

class Molecule {
    constructor(data) {
        // ===== IDENTIFICACIÓN =====
        this.formula = data.formula;           // Fórmula química (H2, CO2, H2O)
        this.name = data.name;                 // Nombre en inglés
        this.nameES = data.nameES || data.name; // Nombre en español
        this.commonName = data.commonName;     // Nombre común (opcional)
        this.charge = data.charge || 0;        // Carga eléctrica (para iones)

        // ===== COMPOSICIÓN ATÓMICA =====
        this.atoms = data.atoms;               // [{element: Element, count: number}]
        this.molecularMass = this.calculateMolecularMass();

        // ===== PROPIEDADES FÍSICAS =====
        this.density = data.density;           // Densidad (g/cm³)
        this.meltingPoint = data.meltingPoint; // Punto de fusión (K)
        this.boilingPoint = data.boilingPoint; // Punto de ebullición (K)
        this.phase = data.phase;               // Fase a 25°C (solid, liquid, gas)
        this.color = data.color;               // Color
        this.odor = data.odor;                 // Olor
        this.appearance = data.appearance;     // Apariencia

        // ===== PROPIEDADES QUÍMICAS =====
        this.polarity = data.polarity;         // Polaridad (polar, nonpolar)
        this.bondType = data.bondType;         // Tipo de enlace (covalent, ionic)
        this.bondLength = data.bondLength;     // Longitud de enlace (pm)
        this.bondEnergy = data.bondEnergy;     // Energía de enlace (kJ/mol)
        this.solubility = data.solubility;     // Solubilidad en agua
        this.reactivity = data.reactivity;     // Reactividad (low, moderate, high)
        this.stability = data.stability;       // Estabilidad

        // ===== PROPIEDADES TERMODINÁMICAS =====
        this.enthalpyFormation = data.enthalpyFormation;  // ΔHf° (kJ/mol)
        this.gibbsEnergy = data.gibbsEnergy;              // ΔGf° (kJ/mol)
        this.entropy = data.entropy;                      // S° (J/mol·K)

        // ===== PROPIEDADES BIOLÓGICAS =====
        this.biologicalRole = data.biologicalRole;        // Rol en organismos
        this.metabolicRelevance = data.metabolicRelevance; // Relevancia metabólica
        this.toxicity = data.toxicity;                    // Toxicidad
        this.essentialForLife = data.essentialForLife;    // Esencial para la vida

        // ===== INTEGRACIÓN CON CELLS =====
        this.gridName = data.gridName;         // Nombre del grid correspondiente
        this.metabolicPathways = data.metabolicPathways || []; // Rutas metabólicas

        // ===== VISUALIZACIÓN =====
        this.cpkColor = data.cpkColor;         // Color CPK para visualización

        // ===== FUENTES =====
        this.sources = data.sources || [];     // Fuentes de datos
    }

    // ===== MÉTODOS DE CÁLCULO =====

    /**
     * Calcula la masa molecular sumando las masas atómicas
     */
    calculateMolecularMass() {
        if (!this.atoms || this.atoms.length === 0) return 0;

        let mass = 0;
        for (let atom of this.atoms) {
            mass += atom.element.atomicMass * atom.count;
        }
        return parseFloat(mass.toFixed(4));
    }

    /**
     * Obtiene la composición atómica como objeto
     */
    getAtomicComposition() {
        const composition = {};
        for (let atom of this.atoms) {
            composition[atom.element.symbol] = atom.count;
        }
        return composition;
    }

    /**
     * Obtiene los porcentajes de masa de cada elemento
     */
    getElementPercentages() {
        const percentages = {};
        for (let atom of this.atoms) {
            const elementMass = atom.element.atomicMass * atom.count;
            percentages[atom.element.symbol] =
                parseFloat(((elementMass / this.molecularMass) * 100).toFixed(2));
        }
        return percentages;
    }

    /**
     * Obtiene el número total de átomos
     */
    getTotalAtomCount() {
        return this.atoms.reduce((sum, atom) => sum + atom.count, 0);
    }

    /**
     * Verifica si la molécula contiene un elemento específico
     */
    containsElement(elementSymbol) {
        return this.atoms.some(atom => atom.element.symbol === elementSymbol);
    }

    /**
     * Obtiene el número de átomos de un elemento específico
     */
    getElementCount(elementSymbol) {
        const atom = this.atoms.find(a => a.element.symbol === elementSymbol);
        return atom ? atom.count : 0;
    }

    // ===== MÉTODOS DE CONVERSIÓN =====

    /**
     * Convierte concentración del grid a moles
     */
    concentrationToMoles(concentration, volume = 1.0) {
        // concentration es un valor arbitrario del grid
        // Asumimos que representa mg/L o similar
        return (concentration * volume) / this.molecularMass;
    }

    /**
     * Convierte concentración del grid a masa
     */
    concentrationToMass(concentration, volume = 1.0) {
        return concentration * volume;
    }

    /**
     * Convierte moles a concentración del grid
     */
    molesToConcentration(moles, volume = 1.0) {
        return (moles * this.molecularMass) / volume;
    }

    // ===== MÉTODOS DE PROPIEDADES =====

    /**
     * Verifica si es un ion
     */
    isIon() {
        return this.charge !== 0;
    }

    /**
     * Verifica si es un anión
     */
    isAnion() {
        return this.charge < 0;
    }

    /**
     * Verifica si es un catión
     */
    isCation() {
        return this.charge > 0;
    }

    /**
     * Verifica si es un gas a temperatura ambiente
     */
    isGas() {
        return this.phase === 'gas';
    }

    /**
     * Verifica si es polar
     */
    isPolar() {
        return this.polarity === 'polar' || this.polarity === 'amphiphilic';
    }

    /**
     * Verifica si es no polar
     */
    isNonpolar() {
        return this.polarity === 'nonpolar';
    }

    /**
     * Verifica si es anfifílica (parte polar y parte no polar)
     */
    isAmphiphilic() {
        return this.polarity === 'amphiphilic';
    }

    /**
     * Verifica si es tóxica
     */
    isToxic() {
        return this.toxicity && this.toxicity !== 'none' && this.toxicity !== 'low';
    }

    /**
     * Verifica si es esencial para la vida
     */
    isEssential() {
        return this.essentialForLife === true;
    }

    /**
     * Obtiene el punto de ebullición en Celsius
     */
    getBoilingPointCelsius() {
        return this.boilingPoint ? this.boilingPoint - 273.15 : null;
    }

    /**
     * Obtiene el punto de fusión en Celsius
     */
    getMeltingPointCelsius() {
        return this.meltingPoint ? this.meltingPoint - 273.15 : null;
    }

    // ===== MÉTODOS DE INFORMACIÓN =====

    /**
     * Obtiene información resumida de la molécula
     */
    getSummary() {
        return {
            formula: this.formula,
            name: this.name,
            molecularMass: this.molecularMass,
            composition: this.getAtomicComposition(),
            phase: this.phase,
            essential: this.essentialForLife,
            biologicalRole: this.biologicalRole
        };
    }

    /**
     * Obtiene la fórmula con subíndices HTML
     */
    getHTMLFormula() {
        let html = '';
        for (let atom of this.atoms) {
            html += atom.element.symbol;
            if (atom.count > 1) {
                html += `<sub>${atom.count}</sub>`;
            }
        }

        // Añadir carga
        if (this.charge !== 0) {
            const chargeText = Math.abs(this.charge) === 1 ?
                (this.charge > 0 ? '+' : '-') :
                (Math.abs(this.charge) + (this.charge > 0 ? '+' : '-'));
            html += `<sup>${chargeText}</sup>`;
        }

        return html;
    }

    /**
     * Obtiene la fórmula con subíndices Unicode
     */
    getUnicodeFormula() {
        const subscripts = {
            '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
            '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
        };

        let unicode = '';
        for (let atom of this.atoms) {
            unicode += atom.element.symbol;
            if (atom.count > 1) {
                unicode += String(atom.count).split('').map(d => subscripts[d]).join('');
            }
        }

        // Añadir carga Unicode
        if (this.charge !== 0) {
            const superscripts = {
                '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
                '+': '⁺', '-': '⁻'
            };

            const chargeVal = Math.abs(this.charge);
            if (chargeVal > 1) {
                unicode += String(chargeVal).split('').map(d => superscripts[d]).join('');
            }
            unicode += (this.charge > 0 ? superscripts['+'] : superscripts['-']);
        }

        return unicode;
    }

    /**
     * Exporta toda la información como JSON
     */
    toJSON() {
        return {
            formula: this.formula,
            name: this.name,
            nameES: this.nameES,
            commonName: this.commonName,
            charge: this.charge,
            molecularMass: this.molecularMass,
            composition: this.getAtomicComposition(),
            percentages: this.getElementPercentages(),
            density: this.density,
            meltingPoint: this.meltingPoint,
            boilingPoint: this.boilingPoint,
            phase: this.phase,
            color: this.color,
            odor: this.odor,
            polarity: this.polarity,
            bondType: this.bondType,
            solubility: this.solubility,
            reactivity: this.reactivity,
            enthalpyFormation: this.enthalpyFormation,
            gibbsEnergy: this.gibbsEnergy,
            entropy: this.entropy,
            biologicalRole: this.biologicalRole,
            metabolicRelevance: this.metabolicRelevance,
            toxicity: this.toxicity,
            essentialForLife: this.essentialForLife,
            gridName: this.gridName,
            metabolicPathways: this.metabolicPathways
        };
    }

    /**
     * Representación en string
     */
    toString() {
        return `${this.formula} (${this.name}) - ${this.molecularMass} g/mol`;
    }
}
