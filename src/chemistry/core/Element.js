/**
 * Element.js
 * ===========
 * Clase que representa un elemento químico individual.
 * Contiene todas las propiedades científicas fidedignas de cada elemento.
 */

class Element {
    constructor(data) {
        // ===== PROPIEDADES BÁSICAS =====
        this.atomicNumber = data.atomicNumber;           // Número atómico (Z)
        this.symbol = data.symbol;                       // Símbolo químico (H, He, Li...)
        this.name = data.name;                           // Nombre en inglés
        this.nameES = data.nameES || data.name;          // Nombre en español
        this.atomicMass = data.atomicMass;               // Masa atómica estándar (u)
        this.category = data.category;                   // Categoría (alkali-metal, noble-gas, etc.)
        this.group = data.group;                         // Grupo (1-18, null para lantánidos/actínidos)
        this.period = data.period;                       // Periodo (1-7)
        this.block = data.block;                         // Bloque (s, p, d, f)

        // ===== PROPIEDADES FÍSICAS =====
        this.density = data.density;                     // Densidad (g/cm³) a 25°C
        this.meltingPoint = data.meltingPoint;           // Punto de fusión (K)
        this.boilingPoint = data.boilingPoint;           // Punto de ebullición (K)
        this.phase = data.phase;                         // Fase a 25°C (solid, liquid, gas)
        this.color = data.color;                         // Color característico
        this.appearance = data.appearance;               // Descripción de apariencia

        // ===== PROPIEDADES QUÍMICAS =====
        this.electronConfiguration = data.electronConfiguration;  // Configuración electrónica
        this.electronegativity = data.electronegativity;          // Electronegatividad (Pauling)
        this.oxidationStates = data.oxidationStates;              // Estados de oxidación comunes
        this.ionizationEnergy = data.ionizationEnergy;            // Primera energía de ionización (kJ/mol)
        this.electronAffinity = data.electronAffinity;            // Afinidad electrónica (kJ/mol)
        this.atomicRadius = data.atomicRadius;                    // Radio atómico (pm)
        this.covalentRadius = data.covalentRadius;                // Radio covalente (pm)
        this.vanDerWaalsRadius = data.vanDerWaalsRadius;          // Radio de van der Waals (pm)

        // ===== PROPIEDADES BIOLÓGICAS =====
        this.biologicalRole = data.biologicalRole;       // Rol en organismos vivos
        this.essentialForLife = data.essentialForLife;   // Si es esencial para la vida
        this.toxicity = data.toxicity;                   // Nivel de toxicidad
        this.bioavailability = data.bioavailability;     // Disponibilidad biológica

        // ===== PROPIEDADES GEOQUÍMICAS =====
        this.crustalAbundance = data.crustalAbundance;   // Abundancia en corteza terrestre (ppm)
        this.oceanicAbundance = data.oceanicAbundance;   // Abundancia en océanos (ppm)
        this.meteoriteAbundance = data.meteoriteAbundance; // Abundancia en meteoritos
        this.solarAbundance = data.solarAbundance;       // Abundancia en el Sol (log scale)

        // ===== ISÓTOPOS =====
        this.commonIsotopes = data.commonIsotopes;       // Isótopos comunes [{mass, abundance, halfLife}]
        this.radioactive = data.radioactive || false;    // Si es radioactivo

        // ===== CONTEXTO HISTÓRICO =====
        this.discoveryYear = data.discoveryYear;         // Año de descubrimiento
        this.discoveredBy = data.discoveredBy;           // Descubridor(es)
        this.nameOrigin = data.nameOrigin;               // Origen del nombre

        // ===== DATOS ADICIONALES =====
        this.cpkColor = data.cpkColor;                   // Color CPK para visualización molecular
        this.sources = data.sources || [];               // Fuentes de datos científicos
    }

    // ===== MÉTODOS DE CONSULTA =====

    /**
     * Obtiene la categoría completa del elemento
     */
    getCategory() {
        return getCategoryById(this.category);
    }

    /**
     * Verifica si el elemento es un metal
     */
    isMetal() {
        const metalCategories = ['alkali-metal', 'alkaline-earth-metal', 'transition-metal', 'post-transition-metal'];
        return metalCategories.includes(this.category);
    }

    /**
     * Verifica si el elemento es un no metal
     */
    isNonmetal() {
        return this.category === 'nonmetal' || this.category === 'halogen' || this.category === 'noble-gas';
    }

    /**
     * Verifica si el elemento es radioactivo
     */
    isRadioactive() {
        return this.radioactive;
    }

    /**
     * Obtiene el punto de fusión en Celsius
     */
    getMeltingPointCelsius() {
        return this.meltingPoint ? this.meltingPoint - 273.15 : null;
    }

    /**
     * Obtiene el punto de ebullición en Celsius
     */
    getBoilingPointCelsius() {
        return this.boilingPoint ? this.boilingPoint - 273.15 : null;
    }

    /**
     * Verifica si el elemento es esencial para la vida
     */
    isEssential() {
        return this.essentialForLife === true;
    }

    /**
     * Obtiene información resumida del elemento
     */
    getSummary() {
        return {
            atomicNumber: this.atomicNumber,
            symbol: this.symbol,
            name: this.name,
            atomicMass: this.atomicMass,
            category: this.getCategory().name,
            phase: this.phase,
            essential: this.essentialForLife
        };
    }

    /**
     * Obtiene toda la información del elemento como objeto
     */
    toJSON() {
        return {
            atomicNumber: this.atomicNumber,
            symbol: this.symbol,
            name: this.name,
            nameES: this.nameES,
            atomicMass: this.atomicMass,
            category: this.category,
            group: this.group,
            period: this.period,
            block: this.block,
            density: this.density,
            meltingPoint: this.meltingPoint,
            boilingPoint: this.boilingPoint,
            phase: this.phase,
            color: this.color,
            appearance: this.appearance,
            electronConfiguration: this.electronConfiguration,
            electronegativity: this.electronegativity,
            oxidationStates: this.oxidationStates,
            ionizationEnergy: this.ionizationEnergy,
            electronAffinity: this.electronAffinity,
            atomicRadius: this.atomicRadius,
            covalentRadius: this.covalentRadius,
            vanDerWaalsRadius: this.vanDerWaalsRadius,
            biologicalRole: this.biologicalRole,
            essentialForLife: this.essentialForLife,
            toxicity: this.toxicity,
            bioavailability: this.bioavailability,
            crustalAbundance: this.crustalAbundance,
            oceanicAbundance: this.oceanicAbundance,
            meteoriteAbundance: this.meteoriteAbundance,
            solarAbundance: this.solarAbundance,
            commonIsotopes: this.commonIsotopes,
            radioactive: this.radioactive,
            discoveryYear: this.discoveryYear,
            discoveredBy: this.discoveredBy,
            nameOrigin: this.nameOrigin,
            cpkColor: this.cpkColor
        };
    }

    /**
     * Representación en string del elemento
     */
    toString() {
        return `${this.symbol} (${this.atomicNumber}) - ${this.name}`;
    }
}
