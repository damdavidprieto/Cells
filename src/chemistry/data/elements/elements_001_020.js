/**
 * elements_001_020.js
 * ===================
 * Datos científicos de los elementos 1-20 (H a Ca)
 * Estos son los elementos más relevantes biológicamente.
 * 
 * Fuentes:
 * - IUPAC Periodic Table (2021)
 * - NIST Chemistry WebBook
 * - WebElements
 * - Royal Society of Chemistry
 */

const ELEMENTS_001_020 = [
    // ===== 1. HYDROGEN (H) =====
    {
        atomicNumber: 1,
        symbol: 'H',
        name: 'Hydrogen',
        nameES: 'Hidrógeno',
        atomicMass: 1.008,
        category: 'nonmetal',
        group: 1,
        period: 1,
        block: 's',

        // Physical properties
        density: 0.00008988, // g/cm³ at STP
        meltingPoint: 14.01, // K
        boilingPoint: 20.28, // K
        phase: 'gas',
        color: 'colorless',
        appearance: 'Colorless, odorless, tasteless gas',

        // Chemical properties
        electronConfiguration: '1s¹',
        electronegativity: 2.20,
        oxidationStates: [-1, 1],
        ionizationEnergy: 1312.0,
        electronAffinity: 72.8,
        atomicRadius: 53,
        covalentRadius: 31,
        vanDerWaalsRadius: 120,

        // Biological properties
        biologicalRole: 'Essential component of water and organic molecules',
        essentialForLife: true,
        toxicity: 'none',
        bioavailability: 'Very high',

        // Geochemical properties
        crustalAbundance: 1400, // ppm
        oceanicAbundance: 108000, // ppm (as H2O)
        meteoriteAbundance: 24000,
        solarAbundance: 12.00,

        // Isotopes
        commonIsotopes: [
            { mass: 1, abundance: 99.9885, halfLife: 'stable' },
            { mass: 2, abundance: 0.0115, halfLife: 'stable' }, // Deuterium
            { mass: 3, abundance: 0, halfLife: '12.32 years' }  // Tritium
        ],
        radioactive: false,

        // Historical
        discoveryYear: 1766,
        discoveredBy: 'Henry Cavendish',
        nameOrigin: 'Greek: hydro (water) + genes (forming)',

        // Visualization
        cpkColor: '#FFFFFF',
        sources: ['IUPAC', 'NIST', 'WebElements']
    },

    // ===== 2. HELIUM (He) =====
    {
        atomicNumber: 2,
        symbol: 'He',
        name: 'Helium',
        nameES: 'Helio',
        atomicMass: 4.0026,
        category: 'noble-gas',
        group: 18,
        period: 1,
        block: 's',

        density: 0.0001785,
        meltingPoint: null, // Does not solidify at normal pressure
        boilingPoint: 4.22,
        phase: 'gas',
        color: 'colorless',
        appearance: 'Colorless, odorless, tasteless gas',

        electronConfiguration: '1s²',
        electronegativity: null,
        oxidationStates: [0],
        ionizationEnergy: 2372.3,
        electronAffinity: 0,
        atomicRadius: 31,
        covalentRadius: 28,
        vanDerWaalsRadius: 140,

        biologicalRole: 'No biological role',
        essentialForLife: false,
        toxicity: 'none',
        bioavailability: 'None',

        crustalAbundance: 0.008,
        oceanicAbundance: 0.0000072,
        meteoriteAbundance: null,
        solarAbundance: 10.93,

        commonIsotopes: [
            { mass: 4, abundance: 99.999863, halfLife: 'stable' },
            { mass: 3, abundance: 0.000137, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1868,
        discoveredBy: 'Pierre Janssen, Norman Lockyer',
        nameOrigin: 'Greek: helios (sun)',

        cpkColor: '#D9FFFF',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 3. LITHIUM (Li) =====
    {
        atomicNumber: 3,
        symbol: 'Li',
        name: 'Lithium',
        nameES: 'Litio',
        atomicMass: 6.94,
        category: 'alkali-metal',
        group: 1,
        period: 2,
        block: 's',

        density: 0.534,
        meltingPoint: 453.65,
        boilingPoint: 1603,
        phase: 'solid',
        color: 'silvery-white',
        appearance: 'Soft, silvery-white metal',

        electronConfiguration: '[He] 2s¹',
        electronegativity: 0.98,
        oxidationStates: [1],
        ionizationEnergy: 520.2,
        electronAffinity: 59.6,
        atomicRadius: 167,
        covalentRadius: 128,
        vanDerWaalsRadius: 182,

        biologicalRole: 'Trace element, used in psychiatric medication',
        essentialForLife: false,
        toxicity: 'moderate',
        bioavailability: 'Moderate',

        crustalAbundance: 20,
        oceanicAbundance: 0.18,
        meteoriteAbundance: 1.7,
        solarAbundance: 1.10,

        commonIsotopes: [
            { mass: 7, abundance: 92.41, halfLife: 'stable' },
            { mass: 6, abundance: 7.59, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1817,
        discoveredBy: 'Johan August Arfwedson',
        nameOrigin: 'Greek: lithos (stone)',

        cpkColor: '#CC80FF',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 4. BERYLLIUM (Be) =====
    {
        atomicNumber: 4,
        symbol: 'Be',
        name: 'Beryllium',
        nameES: 'Berilio',
        atomicMass: 9.0122,
        category: 'alkaline-earth-metal',
        group: 2,
        period: 2,
        block: 's',

        density: 1.85,
        meltingPoint: 1560,
        boilingPoint: 2742,
        phase: 'solid',
        color: 'steel gray',
        appearance: 'Hard, brittle, steel-gray metal',

        electronConfiguration: '[He] 2s²',
        electronegativity: 1.57,
        oxidationStates: [2],
        ionizationEnergy: 899.5,
        electronAffinity: 0,
        atomicRadius: 112,
        covalentRadius: 96,
        vanDerWaalsRadius: null,

        biologicalRole: 'No biological role, toxic',
        essentialForLife: false,
        toxicity: 'high',
        bioavailability: 'Low',

        crustalAbundance: 2.8,
        oceanicAbundance: 0.0000056,
        meteoriteAbundance: 0.029,
        solarAbundance: 1.40,

        commonIsotopes: [
            { mass: 9, abundance: 100, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1798,
        discoveredBy: 'Louis Nicolas Vauquelin',
        nameOrigin: 'Greek: beryllos (beryl)',

        cpkColor: '#C2FF00',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 5. BORON (B) =====
    {
        atomicNumber: 5,
        symbol: 'B',
        name: 'Boron',
        nameES: 'Boro',
        atomicMass: 10.81,
        category: 'metalloid',
        group: 13,
        period: 2,
        block: 'p',

        density: 2.34,
        meltingPoint: 2349,
        boilingPoint: 4200,
        phase: 'solid',
        color: 'black-brown',
        appearance: 'Hard, black-brown metalloid',

        electronConfiguration: '[He] 2s² 2p¹',
        electronegativity: 2.04,
        oxidationStates: [3],
        ionizationEnergy: 800.6,
        electronAffinity: 26.7,
        atomicRadius: 87,
        covalentRadius: 84,
        vanDerWaalsRadius: null,

        biologicalRole: 'Essential trace element for plants, beneficial for animals',
        essentialForLife: true,
        toxicity: 'low',
        bioavailability: 'Moderate',

        crustalAbundance: 10,
        oceanicAbundance: 4.44,
        meteoriteAbundance: 0.9,
        solarAbundance: 2.70,

        commonIsotopes: [
            { mass: 11, abundance: 80.1, halfLife: 'stable' },
            { mass: 10, abundance: 19.9, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1808,
        discoveredBy: 'Joseph Louis Gay-Lussac, Louis Jacques Thénard',
        nameOrigin: 'Arabic: buraq (borax)',

        cpkColor: '#FFB5B5',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 6. CARBON (C) =====
    {
        atomicNumber: 6,
        symbol: 'C',
        name: 'Carbon',
        nameES: 'Carbono',
        atomicMass: 12.011,
        category: 'nonmetal',
        group: 14,
        period: 2,
        block: 'p',

        density: 2.267, // graphite
        meltingPoint: 3823, // sublimes
        boilingPoint: 4098,
        phase: 'solid',
        color: 'black (graphite), transparent (diamond)',
        appearance: 'Varies with allotrope',

        electronConfiguration: '[He] 2s² 2p²',
        electronegativity: 2.55,
        oxidationStates: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
        ionizationEnergy: 1086.5,
        electronAffinity: 153.9,
        atomicRadius: 67,
        covalentRadius: 76,
        vanDerWaalsRadius: 170,

        biologicalRole: 'Fundamental building block of all organic molecules',
        essentialForLife: true,
        toxicity: 'none',
        bioavailability: 'Very high',

        crustalAbundance: 200,
        oceanicAbundance: 28,
        meteoriteAbundance: 15000,
        solarAbundance: 8.43,

        commonIsotopes: [
            { mass: 12, abundance: 98.93, halfLife: 'stable' },
            { mass: 13, abundance: 1.07, halfLife: 'stable' },
            { mass: 14, abundance: 0, halfLife: '5730 years' }
        ],
        radioactive: false,

        discoveryYear: null, // Known since ancient times
        discoveredBy: 'Known to ancients',
        nameOrigin: 'Latin: carbo (charcoal)',

        cpkColor: '#909090',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 7. NITROGEN (N) =====
    {
        atomicNumber: 7,
        symbol: 'N',
        name: 'Nitrogen',
        nameES: 'Nitrógeno',
        atomicMass: 14.007,
        category: 'nonmetal',
        group: 15,
        period: 2,
        block: 'p',

        density: 0.0012506,
        meltingPoint: 63.15,
        boilingPoint: 77.36,
        phase: 'gas',
        color: 'colorless',
        appearance: 'Colorless, odorless gas',

        electronConfiguration: '[He] 2s² 2p³',
        electronegativity: 3.04,
        oxidationStates: [-3, -2, -1, 1, 2, 3, 4, 5],
        ionizationEnergy: 1402.3,
        electronAffinity: 7,
        atomicRadius: 56,
        covalentRadius: 71,
        vanDerWaalsRadius: 155,

        biologicalRole: 'Essential component of amino acids, proteins, and nucleic acids',
        essentialForLife: true,
        toxicity: 'none',
        bioavailability: 'Very high',

        crustalAbundance: 19,
        oceanicAbundance: 0.5,
        meteoriteAbundance: 3000,
        solarAbundance: 7.83,

        commonIsotopes: [
            { mass: 14, abundance: 99.636, halfLife: 'stable' },
            { mass: 15, abundance: 0.364, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1772,
        discoveredBy: 'Daniel Rutherford',
        nameOrigin: 'Greek: nitron + genes (niter-forming)',

        cpkColor: '#3050F8',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 8. OXYGEN (O) =====
    {
        atomicNumber: 8,
        symbol: 'O',
        name: 'Oxygen',
        nameES: 'Oxígeno',
        atomicMass: 15.999,
        category: 'nonmetal',
        group: 16,
        period: 2,
        block: 'p',

        density: 0.001429,
        meltingPoint: 54.36,
        boilingPoint: 90.20,
        phase: 'gas',
        color: 'colorless',
        appearance: 'Colorless, odorless gas',

        electronConfiguration: '[He] 2s² 2p⁴',
        electronegativity: 3.44,
        oxidationStates: [-2, -1, 1, 2],
        ionizationEnergy: 1313.9,
        electronAffinity: 141,
        atomicRadius: 48,
        covalentRadius: 66,
        vanDerWaalsRadius: 152,

        biologicalRole: 'Essential for cellular respiration and energy production',
        essentialForLife: true,
        toxicity: 'none',
        bioavailability: 'Very high',

        crustalAbundance: 461000,
        oceanicAbundance: 857000,
        meteoriteAbundance: 400000,
        solarAbundance: 8.69,

        commonIsotopes: [
            { mass: 16, abundance: 99.757, halfLife: 'stable' },
            { mass: 18, abundance: 0.205, halfLife: 'stable' },
            { mass: 17, abundance: 0.038, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1774,
        discoveredBy: 'Joseph Priestley, Carl Wilhelm Scheele',
        nameOrigin: 'Greek: oxy + genes (acid-forming)',

        cpkColor: '#FF0D0D',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 9. FLUORINE (F) =====
    {
        atomicNumber: 9,
        symbol: 'F',
        name: 'Fluorine',
        nameES: 'Flúor',
        atomicMass: 18.998,
        category: 'halogen',
        group: 17,
        period: 2,
        block: 'p',

        density: 0.001696,
        meltingPoint: 53.53,
        boilingPoint: 85.03,
        phase: 'gas',
        color: 'pale yellow',
        appearance: 'Pale yellow, highly corrosive gas',

        electronConfiguration: '[He] 2s² 2p⁵',
        electronegativity: 3.98,
        oxidationStates: [-1],
        ionizationEnergy: 1681.0,
        electronAffinity: 328,
        atomicRadius: 42,
        covalentRadius: 57,
        vanDerWaalsRadius: 147,

        biologicalRole: 'Trace element, strengthens bones and teeth',
        essentialForLife: true,
        toxicity: 'high',
        bioavailability: 'High',

        crustalAbundance: 585,
        oceanicAbundance: 1.3,
        meteoriteAbundance: 60,
        solarAbundance: 4.56,

        commonIsotopes: [
            { mass: 19, abundance: 100, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1886,
        discoveredBy: 'Henri Moissan',
        nameOrigin: 'Latin: fluere (to flow)',

        cpkColor: '#90E050',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 10. NEON (Ne) =====
    {
        atomicNumber: 10,
        symbol: 'Ne',
        name: 'Neon',
        nameES: 'Neón',
        atomicMass: 20.180,
        category: 'noble-gas',
        group: 18,
        period: 2,
        block: 'p',

        density: 0.0008999,
        meltingPoint: 24.56,
        boilingPoint: 27.07,
        phase: 'gas',
        color: 'colorless',
        appearance: 'Colorless, odorless, inert gas',

        electronConfiguration: '[He] 2s² 2p⁶',
        electronegativity: null,
        oxidationStates: [0],
        ionizationEnergy: 2080.7,
        electronAffinity: 0,
        atomicRadius: 38,
        covalentRadius: 58,
        vanDerWaalsRadius: 154,

        biologicalRole: 'No biological role',
        essentialForLife: false,
        toxicity: 'none',
        bioavailability: 'None',

        crustalAbundance: 0.005,
        oceanicAbundance: 0.00012,
        meteoriteAbundance: null,
        solarAbundance: 7.93,

        commonIsotopes: [
            { mass: 20, abundance: 90.48, halfLife: 'stable' },
            { mass: 22, abundance: 9.25, halfLife: 'stable' },
            { mass: 21, abundance: 0.27, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1898,
        discoveredBy: 'William Ramsay, Morris Travers',
        nameOrigin: 'Greek: neos (new)',

        cpkColor: '#B3E3F5',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 11. SODIUM (Na) =====
    {
        atomicNumber: 11,
        symbol: 'Na',
        name: 'Sodium',
        nameES: 'Sodio',
        atomicMass: 22.990,
        category: 'alkali-metal',
        group: 1,
        period: 3,
        block: 's',

        density: 0.971,
        meltingPoint: 370.87,
        boilingPoint: 1156,
        phase: 'solid',
        color: 'silvery-white',
        appearance: 'Soft, silvery-white metal',

        electronConfiguration: '[Ne] 3s¹',
        electronegativity: 0.93,
        oxidationStates: [1],
        ionizationEnergy: 495.8,
        electronAffinity: 52.8,
        atomicRadius: 190,
        covalentRadius: 166,
        vanDerWaalsRadius: 227,

        biologicalRole: 'Essential for nerve impulse transmission and fluid balance',
        essentialForLife: true,
        toxicity: 'low',
        bioavailability: 'Very high',

        crustalAbundance: 23600,
        oceanicAbundance: 10800,
        meteoriteAbundance: 5000,
        solarAbundance: 6.24,

        commonIsotopes: [
            { mass: 23, abundance: 100, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1807,
        discoveredBy: 'Humphry Davy',
        nameOrigin: 'English: soda',

        cpkColor: '#AB5CF2',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 12. MAGNESIUM (Mg) =====
    {
        atomicNumber: 12,
        symbol: 'Mg',
        name: 'Magnesium',
        nameES: 'Magnesio',
        atomicMass: 24.305,
        category: 'alkaline-earth-metal',
        group: 2,
        period: 3,
        block: 's',

        density: 1.738,
        meltingPoint: 923,
        boilingPoint: 1363,
        phase: 'solid',
        color: 'silvery-white',
        appearance: 'Shiny gray-white metal',

        electronConfiguration: '[Ne] 3s²',
        electronegativity: 1.31,
        oxidationStates: [2],
        ionizationEnergy: 737.7,
        electronAffinity: 0,
        atomicRadius: 145,
        covalentRadius: 141,
        vanDerWaalsRadius: 173,

        biologicalRole: 'Essential for enzyme function, DNA/RNA synthesis, chlorophyll',
        essentialForLife: true,
        toxicity: 'none',
        bioavailability: 'High',

        crustalAbundance: 23300,
        oceanicAbundance: 1290,
        meteoriteAbundance: 120000,
        solarAbundance: 7.60,

        commonIsotopes: [
            { mass: 24, abundance: 78.99, halfLife: 'stable' },
            { mass: 26, abundance: 11.01, halfLife: 'stable' },
            { mass: 25, abundance: 10.00, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1755,
        discoveredBy: 'Joseph Black',
        nameOrigin: 'Greek: Magnesia (district in Thessaly)',

        cpkColor: '#8AFF00',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 13. ALUMINUM (Al) =====
    {
        atomicNumber: 13,
        symbol: 'Al',
        name: 'Aluminum',
        nameES: 'Aluminio',
        atomicMass: 26.982,
        category: 'post-transition-metal',
        group: 13,
        period: 3,
        block: 'p',

        density: 2.698,
        meltingPoint: 933.47,
        boilingPoint: 2792,
        phase: 'solid',
        color: 'silvery-gray',
        appearance: 'Silvery-white, soft, ductile metal',

        electronConfiguration: '[Ne] 3s² 3p¹',
        electronegativity: 1.61,
        oxidationStates: [3],
        ionizationEnergy: 577.5,
        electronAffinity: 42.5,
        atomicRadius: 118,
        covalentRadius: 121,
        vanDerWaalsRadius: null,

        biologicalRole: 'No known biological role, potentially toxic',
        essentialForLife: false,
        toxicity: 'moderate',
        bioavailability: 'Low',

        crustalAbundance: 82300,
        oceanicAbundance: 0.002,
        meteoriteAbundance: 8700,
        solarAbundance: 6.45,

        commonIsotopes: [
            { mass: 27, abundance: 100, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1825,
        discoveredBy: 'Hans Christian Ørsted',
        nameOrigin: 'Latin: alumen (alum)',

        cpkColor: '#BFA6A6',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 14. SILICON (Si) =====
    {
        atomicNumber: 14,
        symbol: 'Si',
        name: 'Silicon',
        nameES: 'Silicio',
        atomicMass: 28.085,
        category: 'metalloid',
        group: 14,
        period: 3,
        block: 'p',

        density: 2.3296,
        meltingPoint: 1687,
        boilingPoint: 3538,
        phase: 'solid',
        color: 'dark gray',
        appearance: 'Hard, dark gray crystalline solid',

        electronConfiguration: '[Ne] 3s² 3p²',
        electronegativity: 1.90,
        oxidationStates: [-4, -3, -2, -1, 1, 2, 3, 4],
        ionizationEnergy: 786.5,
        electronAffinity: 133.6,
        atomicRadius: 111,
        covalentRadius: 111,
        vanDerWaalsRadius: 210,

        biologicalRole: 'Trace element, important for bone and connective tissue',
        essentialForLife: true,
        toxicity: 'low',
        bioavailability: 'Moderate',

        crustalAbundance: 282000,
        oceanicAbundance: 2.2,
        meteoriteAbundance: 140000,
        solarAbundance: 7.51,

        commonIsotopes: [
            { mass: 28, abundance: 92.223, halfLife: 'stable' },
            { mass: 29, abundance: 4.685, halfLife: 'stable' },
            { mass: 30, abundance: 3.092, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1824,
        discoveredBy: 'Jöns Jacob Berzelius',
        nameOrigin: 'Latin: silex (flint)',

        cpkColor: '#F0C8A0',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 15. PHOSPHORUS (P) =====
    {
        atomicNumber: 15,
        symbol: 'P',
        name: 'Phosphorus',
        nameES: 'Fósforo',
        atomicMass: 30.974,
        category: 'nonmetal',
        group: 15,
        period: 3,
        block: 'p',

        density: 1.82, // white phosphorus
        meltingPoint: 317.30,
        boilingPoint: 550,
        phase: 'solid',
        color: 'white, red, or black',
        appearance: 'Waxy white, red, or black allotropes',

        electronConfiguration: '[Ne] 3s² 3p³',
        electronegativity: 2.19,
        oxidationStates: [-3, -2, -1, 1, 2, 3, 4, 5],
        ionizationEnergy: 1011.8,
        electronAffinity: 72,
        atomicRadius: 98,
        covalentRadius: 107,
        vanDerWaalsRadius: 180,

        biologicalRole: 'Essential component of ATP, DNA, RNA, and bones',
        essentialForLife: true,
        toxicity: 'moderate',
        bioavailability: 'High',

        crustalAbundance: 1050,
        oceanicAbundance: 0.088,
        meteoriteAbundance: 1100,
        solarAbundance: 5.41,

        commonIsotopes: [
            { mass: 31, abundance: 100, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1669,
        discoveredBy: 'Hennig Brand',
        nameOrigin: 'Greek: phosphoros (light-bearing)',

        cpkColor: '#FF8000',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 16. SULFUR (S) =====
    {
        atomicNumber: 16,
        symbol: 'S',
        name: 'Sulfur',
        nameES: 'Azufre',
        atomicMass: 32.06,
        category: 'nonmetal',
        group: 16,
        period: 3,
        block: 'p',

        density: 2.067,
        meltingPoint: 388.36,
        boilingPoint: 717.87,
        phase: 'solid',
        color: 'bright yellow',
        appearance: 'Bright yellow crystalline solid',

        electronConfiguration: '[Ne] 3s² 3p⁴',
        electronegativity: 2.58,
        oxidationStates: [-2, -1, 1, 2, 3, 4, 5, 6],
        ionizationEnergy: 999.6,
        electronAffinity: 200,
        atomicRadius: 88,
        covalentRadius: 105,
        vanDerWaalsRadius: 180,

        biologicalRole: 'Essential component of amino acids (cysteine, methionine)',
        essentialForLife: true,
        toxicity: 'low',
        bioavailability: 'High',

        crustalAbundance: 350,
        oceanicAbundance: 904,
        meteoriteAbundance: 40000,
        solarAbundance: 7.12,

        commonIsotopes: [
            { mass: 32, abundance: 94.99, halfLife: 'stable' },
            { mass: 34, abundance: 4.25, halfLife: 'stable' },
            { mass: 33, abundance: 0.75, halfLife: 'stable' },
            { mass: 36, abundance: 0.01, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: null, // Known since ancient times
        discoveredBy: 'Known to ancients',
        nameOrigin: 'Latin: sulphur',

        cpkColor: '#FFFF30',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 17. CHLORINE (Cl) =====
    {
        atomicNumber: 17,
        symbol: 'Cl',
        name: 'Chlorine',
        nameES: 'Cloro',
        atomicMass: 35.45,
        category: 'halogen',
        group: 17,
        period: 3,
        block: 'p',

        density: 0.003214,
        meltingPoint: 171.6,
        boilingPoint: 239.11,
        phase: 'gas',
        color: 'yellow-green',
        appearance: 'Yellow-green, toxic gas',

        electronConfiguration: '[Ne] 3s² 3p⁵',
        electronegativity: 3.16,
        oxidationStates: [-1, 1, 3, 5, 7],
        ionizationEnergy: 1251.2,
        electronAffinity: 349,
        atomicRadius: 79,
        covalentRadius: 102,
        vanDerWaalsRadius: 175,

        biologicalRole: 'Essential for maintaining fluid balance and pH',
        essentialForLife: true,
        toxicity: 'high',
        bioavailability: 'Very high',

        crustalAbundance: 145,
        oceanicAbundance: 19400,
        meteoriteAbundance: 700,
        solarAbundance: 5.50,

        commonIsotopes: [
            { mass: 35, abundance: 75.76, halfLife: 'stable' },
            { mass: 37, abundance: 24.24, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1774,
        discoveredBy: 'Carl Wilhelm Scheele',
        nameOrigin: 'Greek: chloros (greenish yellow)',

        cpkColor: '#1FF01F',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 18. ARGON (Ar) =====
    {
        atomicNumber: 18,
        symbol: 'Ar',
        name: 'Argon',
        nameES: 'Argón',
        atomicMass: 39.948,
        category: 'noble-gas',
        group: 18,
        period: 3,
        block: 'p',

        density: 0.001784,
        meltingPoint: 83.80,
        boilingPoint: 87.30,
        phase: 'gas',
        color: 'colorless',
        appearance: 'Colorless, odorless, inert gas',

        electronConfiguration: '[Ne] 3s² 3p⁶',
        electronegativity: null,
        oxidationStates: [0],
        ionizationEnergy: 1520.6,
        electronAffinity: 0,
        atomicRadius: 71,
        covalentRadius: 106,
        vanDerWaalsRadius: 188,

        biologicalRole: 'No biological role',
        essentialForLife: false,
        toxicity: 'none',
        bioavailability: 'None',

        crustalAbundance: 3.5,
        oceanicAbundance: 0.45,
        meteoriteAbundance: null,
        solarAbundance: 6.40,

        commonIsotopes: [
            { mass: 40, abundance: 99.604, halfLife: 'stable' },
            { mass: 36, abundance: 0.334, halfLife: 'stable' },
            { mass: 38, abundance: 0.063, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1894,
        discoveredBy: 'Lord Rayleigh, William Ramsay',
        nameOrigin: 'Greek: argos (inactive)',

        cpkColor: '#80D1E3',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 19. POTASSIUM (K) =====
    {
        atomicNumber: 19,
        symbol: 'K',
        name: 'Potassium',
        nameES: 'Potasio',
        atomicMass: 39.098,
        category: 'alkali-metal',
        group: 1,
        period: 4,
        block: 's',

        density: 0.862,
        meltingPoint: 336.53,
        boilingPoint: 1032,
        phase: 'solid',
        color: 'silvery-white',
        appearance: 'Soft, silvery-white metal',

        electronConfiguration: '[Ar] 4s¹',
        electronegativity: 0.82,
        oxidationStates: [1],
        ionizationEnergy: 418.8,
        electronAffinity: 48.4,
        atomicRadius: 243,
        covalentRadius: 203,
        vanDerWaalsRadius: 275,

        biologicalRole: 'Essential for nerve function, muscle contraction, heart rhythm',
        essentialForLife: true,
        toxicity: 'low',
        bioavailability: 'Very high',

        crustalAbundance: 20900,
        oceanicAbundance: 399,
        meteoriteAbundance: 900,
        solarAbundance: 5.03,

        commonIsotopes: [
            { mass: 39, abundance: 93.258, halfLife: 'stable' },
            { mass: 41, abundance: 6.730, halfLife: 'stable' },
            { mass: 40, abundance: 0.012, halfLife: '1.248e9 years' }
        ],
        radioactive: false,

        discoveryYear: 1807,
        discoveredBy: 'Humphry Davy',
        nameOrigin: 'English: potash',

        cpkColor: '#8F40D4',
        sources: ['IUPAC', 'NIST']
    },

    // ===== 20. CALCIUM (Ca) =====
    {
        atomicNumber: 20,
        symbol: 'Ca',
        name: 'Calcium',
        nameES: 'Calcio',
        atomicMass: 40.078,
        category: 'alkaline-earth-metal',
        group: 2,
        period: 4,
        block: 's',

        density: 1.54,
        meltingPoint: 1115,
        boilingPoint: 1757,
        phase: 'solid',
        color: 'silvery-white',
        appearance: 'Soft, gray alkaline earth metal',

        electronConfiguration: '[Ar] 4s²',
        electronegativity: 1.00,
        oxidationStates: [2],
        ionizationEnergy: 589.8,
        electronAffinity: 2.37,
        atomicRadius: 194,
        covalentRadius: 176,
        vanDerWaalsRadius: null,

        biologicalRole: 'Essential for bones, teeth, muscle contraction, signaling',
        essentialForLife: true,
        toxicity: 'none',
        bioavailability: 'High',

        crustalAbundance: 41500,
        oceanicAbundance: 411,
        meteoriteAbundance: 12000,
        solarAbundance: 6.34,

        commonIsotopes: [
            { mass: 40, abundance: 96.941, halfLife: 'stable' },
            { mass: 44, abundance: 2.086, halfLife: 'stable' },
            { mass: 42, abundance: 0.647, halfLife: 'stable' },
            { mass: 48, abundance: 0.187, halfLife: '4.3e19 years' },
            { mass: 43, abundance: 0.135, halfLife: 'stable' },
            { mass: 46, abundance: 0.004, halfLife: 'stable' }
        ],
        radioactive: false,

        discoveryYear: 1808,
        discoveredBy: 'Humphry Davy',
        nameOrigin: 'Latin: calx (lime)',

        cpkColor: '#3DFF00',
        sources: ['IUPAC', 'NIST']
    }
];
