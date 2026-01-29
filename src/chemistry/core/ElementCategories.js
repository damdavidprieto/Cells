/**
 * ElementCategories.js
 * ====================
 * Definiciones de categorías y constantes para el sistema de tabla periódica.
 * Basado en clasificación IUPAC estándar.
 */

const ElementCategories = {
    // Categorías principales
    ALKALI_METAL: {
        id: 'alkali-metal',
        name: 'Alkali Metal',
        nameES: 'Metal Alcalino',
        description: 'Highly reactive metals in Group 1',
        color: '#FF6B6B'
    },
    ALKALINE_EARTH_METAL: {
        id: 'alkaline-earth-metal',
        name: 'Alkaline Earth Metal',
        nameES: 'Metal Alcalinotérreo',
        description: 'Reactive metals in Group 2',
        color: '#FFA07A'
    },
    TRANSITION_METAL: {
        id: 'transition-metal',
        name: 'Transition Metal',
        nameES: 'Metal de Transición',
        description: 'Metals in Groups 3-12',
        color: '#FFB347'
    },
    POST_TRANSITION_METAL: {
        id: 'post-transition-metal',
        name: 'Post-transition Metal',
        nameES: 'Metal Post-transición',
        description: 'Metals after transition metals',
        color: '#CCCCCC'
    },
    METALLOID: {
        id: 'metalloid',
        name: 'Metalloid',
        nameES: 'Metaloide',
        description: 'Elements with properties between metals and nonmetals',
        color: '#9ACD32'
    },
    NONMETAL: {
        id: 'nonmetal',
        name: 'Nonmetal',
        nameES: 'No Metal',
        description: 'Elements that lack metallic properties',
        color: '#87CEEB'
    },
    HALOGEN: {
        id: 'halogen',
        name: 'Halogen',
        nameES: 'Halógeno',
        description: 'Highly reactive nonmetals in Group 17',
        color: '#FFD700'
    },
    NOBLE_GAS: {
        id: 'noble-gas',
        name: 'Noble Gas',
        nameES: 'Gas Noble',
        description: 'Inert gases in Group 18',
        color: '#E6E6FA'
    },
    LANTHANIDE: {
        id: 'lanthanide',
        name: 'Lanthanide',
        nameES: 'Lantánido',
        description: 'Rare earth elements (57-71)',
        color: '#FFB6C1'
    },
    ACTINIDE: {
        id: 'actinide',
        name: 'Actinide',
        nameES: 'Actínido',
        description: 'Radioactive elements (89-103)',
        color: '#DDA0DD'
    },
    UNKNOWN: {
        id: 'unknown',
        name: 'Unknown',
        nameES: 'Desconocido',
        description: 'Properties not yet fully characterized',
        color: '#D3D3D3'
    }
};

/**
 * Fases de la materia a temperatura ambiente (25°C, 1 atm)
 */
const Phase = {
    SOLID: 'solid',
    LIQUID: 'liquid',
    GAS: 'gas',
    UNKNOWN: 'unknown'
};

/**
 * Bloques de la tabla periódica
 */
const Block = {
    S: 's',
    P: 'p',
    D: 'd',
    F: 'f'
};

/**
 * Niveles de toxicidad
 */
const Toxicity = {
    NONE: 'none',
    LOW: 'low',
    MODERATE: 'moderate',
    HIGH: 'high',
    EXTREME: 'extreme',
    UNKNOWN: 'unknown'
};

/**
 * Roles biológicos
 */
const BiologicalRole = {
    ESSENTIAL: 'essential',           // Esencial para la vida
    BENEFICIAL: 'beneficial',         // Beneficioso pero no esencial
    NEUTRAL: 'neutral',               // Sin rol conocido
    TOXIC: 'toxic',                   // Tóxico
    RADIOACTIVE: 'radioactive',       // Radioactivo
    UNKNOWN: 'unknown'                // Desconocido
};

/**
 * Elementos esenciales para la vida (CHNOPS + oligoelementos)
 */
const EssentialElements = {
    // Macronutrientes (CHNOPS)
    MACRONUTRIENTS: [1, 6, 7, 8, 15, 16], // H, C, N, O, P, S

    // Elementos mayores
    MAJOR: [11, 12, 17, 19, 20],          // Na, Mg, Cl, K, Ca

    // Oligoelementos (trace elements)
    TRACE: [
        5,   // B - Boron
        9,   // F - Fluorine
        14,  // Si - Silicon
        23,  // V - Vanadium
        24,  // Cr - Chromium
        25,  // Mn - Manganese
        26,  // Fe - Iron
        27,  // Co - Cobalt
        28,  // Ni - Nickel
        29,  // Cu - Copper
        30,  // Zn - Zinc
        34,  // Se - Selenium
        42,  // Mo - Molybdenum
        53   // I - Iodine
    ]
};

/**
 * Obtener categoría por ID
 */
function getCategoryById(id) {
    return Object.values(ElementCategories).find(cat => cat.id === id) || ElementCategories.UNKNOWN;
}

/**
 * Verificar si un elemento es esencial para la vida
 */
function isEssentialForLife(atomicNumber) {
    return EssentialElements.MACRONUTRIENTS.includes(atomicNumber) ||
        EssentialElements.MAJOR.includes(atomicNumber) ||
        EssentialElements.TRACE.includes(atomicNumber);
}

/**
 * Obtener el tipo de elemento esencial
 */
function getEssentialType(atomicNumber) {
    if (EssentialElements.MACRONUTRIENTS.includes(atomicNumber)) return 'macronutrient';
    if (EssentialElements.MAJOR.includes(atomicNumber)) return 'major';
    if (EssentialElements.TRACE.includes(atomicNumber)) return 'trace';
    return null;
}
