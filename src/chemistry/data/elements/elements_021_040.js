/**
 * elements_021_040.js
 * ===================
 * Datos científicos de los elementos 21 al 40 (Sc a Zr).
 * Incluye metales de transición críticos para la biología (Fe, Co, Ni, Cu, Zn).
 * 
 * Fuentes: IUPAC, NIST, WebElements, RSC.
 */

const ELEMENTS_021_040 = [];

// ===== 21. ESCANDIO (Sc) =====
ELEMENTS_021_040.push({
    atomicNumber: 21,
    symbol: 'Sc',
    name: 'Scandium',
    nameES: 'Escandio',
    atomicMass: 44.9559,
    category: 'transition-metal',
    group: 3,
    period: 4,
    block: 'd',

    density: 2.985,
    meltingPoint: 1814,
    boilingPoint: 3109,
    phase: 'solid',
    color: 'silvery-white',
    appearance: 'Silvery white metallic solid',

    electronConfiguration: '[Ar] 3d¹ 4s²',
    electronegativity: 1.36,
    oxidationStates: [3],
    ionizationEnergy: 633.1,
    electronAffinity: 18.1,
    atomicRadius: 162,
    covalentRadius: 144,
    vanDerWaalsRadius: 211,

    biologicalRole: 'No known biological role',
    essentialForLife: false,
    toxicity: 'low',
    bioavailability: 'very low',

    crustalAbundance: 22,
    oceanicAbundance: 0.0000006,
    meteoriteAbundance: 6.4,
    solarAbundance: 3.1,

    commonIsotopes: [
        { mass: 45, abundance: 100, radioactive: false }
    ],

    discoveryYear: 1879,
    discoveredBy: 'Lars Fredrik Nilson',
    nameOrigin: 'Latin "Scandia" (Scandinavia)',

    cpkColor: '#E6E6E6'
});

// ===== 22. TITANIO (Ti) =====
ELEMENTS_021_040.push({
    atomicNumber: 22,
    symbol: 'Ti',
    name: 'Titanium',
    nameES: 'Titanio',
    atomicMass: 47.867,
    category: 'transition-metal',
    group: 4,
    period: 4,
    block: 'd',

    density: 4.506,
    meltingPoint: 1941,
    boilingPoint: 3560,
    phase: 'solid',
    color: 'silvery-grey-white',
    appearance: 'Silvery grey-white metallic solid',

    electronConfiguration: '[Ar] 3d² 4s²',
    electronegativity: 1.54,
    oxidationStates: [2, 3, 4],
    ionizationEnergy: 658.8,
    electronAffinity: 7.6,
    atomicRadius: 147,
    covalentRadius: 136,
    vanDerWaalsRadius: 200,

    biologicalRole: 'Inert, not used by organisms but biocompatible',
    essentialForLife: false,
    toxicity: 'low',
    bioavailability: 'extremely low',

    crustalAbundance: 5650,
    oceanicAbundance: 0.001,
    meteoriteAbundance: 540,
    solarAbundance: 4.9,

    commonIsotopes: [
        { mass: 48, abundance: 73.7, radioactive: false }
    ],

    discoveryYear: 1791,
    discoveredBy: 'William Gregor',
    nameOrigin: 'Greek "Titans" (sons of the Earth)',

    cpkColor: '#BFC2C7'
});

// ===== 23. VANADIO (V) =====
ELEMENTS_021_040.push({
    atomicNumber: 23,
    symbol: 'V',
    name: 'Vanadium',
    nameES: 'Vanadio',
    atomicMass: 50.9415,
    category: 'transition-metal',
    group: 5,
    period: 4,
    block: 'd',

    density: 6.11,
    meltingPoint: 2183,
    boilingPoint: 3680,
    phase: 'solid',
    color: 'silvery-grey',
    appearance: 'Hard, silvery grey, ductile metallic solid',

    electronConfiguration: '[Ar] 3d³ 4s²',
    electronegativity: 1.63,
    oxidationStates: [2, 3, 4, 5],
    ionizationEnergy: 650.9,
    electronAffinity: 50.6,
    atomicRadius: 134,
    covalentRadius: 125,
    vanDerWaalsRadius: 200,

    biologicalRole: 'Essential for some algae, bacteria and sea squirts (vanadocytes)',
    essentialForLife: true, // For specific groups
    toxicity: 'moderate',
    bioavailability: 'low',

    crustalAbundance: 120,
    oceanicAbundance: 0.0025,
    meteoriteAbundance: 42,
    solarAbundance: 4.0,

    commonIsotopes: [
        { mass: 51, abundance: 99.75, radioactive: false }
    ],

    discoveryYear: 1801,
    discoveredBy: 'Andrés Manuel del Río',
    nameOrigin: 'Old Norse "Vanadís" (Freyja)',

    cpkColor: '#A6A6AB'
});

// ===== 24. CROMO (Cr) =====
ELEMENTS_021_040.push({
    atomicNumber: 24,
    symbol: 'Cr',
    name: 'Chromium',
    nameES: 'Cromo',
    atomicMass: 51.9961,
    category: 'transition-metal',
    group: 6,
    period: 4,
    block: 'd',

    density: 7.19,
    meltingPoint: 2180,
    boilingPoint: 2944,
    phase: 'solid',
    color: 'silvery-metallic',
    appearance: 'Silvery, lustrous, hard metallic solid',

    electronConfiguration: '[Ar] 3d⁵ 4s¹',
    electronegativity: 1.66,
    oxidationStates: [2, 3, 6],
    ionizationEnergy: 652.9,
    electronAffinity: 64.3,
    atomicRadius: 128,
    covalentRadius: 127,
    vanDerWaalsRadius: 200,

    biologicalRole: 'Trace nutrient, involved in insulin action and glucose metabolism',
    essentialForLife: true,
    toxicity: 'low (Cr III), high (Cr VI)',
    bioavailability: 'low',

    crustalAbundance: 102,
    oceanicAbundance: 0.0003,
    meteoriteAbundance: 3500,
    solarAbundance: 5.6,

    commonIsotopes: [
        { mass: 52, abundance: 83.8, radioactive: false }
    ],

    discoveryYear: 1797,
    discoveredBy: 'Louis Nicolas Vauquelin',
    nameOrigin: 'Greek "chroma" (color)',

    cpkColor: '#8A99C7'
});

// ===== 25. MANGANESO (Mn) =====
ELEMENTS_021_040.push({
    atomicNumber: 25,
    symbol: 'Mn',
    name: 'Manganese',
    nameES: 'Manganeso',
    atomicMass: 54.938,
    category: 'transition-metal',
    group: 7,
    period: 4,
    block: 'd',

    density: 7.43,
    meltingPoint: 1519,
    boilingPoint: 2334,
    phase: 'solid',
    color: 'silvery-grey',
    appearance: 'Hard, brittle, silvery metallic solid',

    electronConfiguration: '[Ar] 3d⁵ 4s²',
    electronegativity: 1.55,
    oxidationStates: [2, 3, 4, 6, 7],
    ionizationEnergy: 717.3,
    electronAffinity: 0,
    atomicRadius: 127,
    covalentRadius: 139,
    vanDerWaalsRadius: 200,

    biologicalRole: 'Essential cofactor for many enzymes, including oxygen-evolving complex in photosynthesis',
    essentialForLife: true,
    toxicity: 'moderate',
    bioavailability: 'medium',

    crustalAbundance: 950,
    oceanicAbundance: 0.0002,
    meteoriteAbundance: 1700,
    solarAbundance: 5.5,

    commonIsotopes: [
        { mass: 55, abundance: 100, radioactive: false }
    ],

    discoveryYear: 1774,
    discoveredBy: 'Johan Gottlieb Gahn',
    nameOrigin: 'Latin "magnes" (magnet)',

    cpkColor: '#9C7AC7'
});

// ===== 26. HIERRO (Fe) =====
ELEMENTS_021_040.push({
    atomicNumber: 26,
    symbol: 'Fe',
    name: 'Iron',
    nameES: 'Hierro',
    atomicMass: 55.845,
    category: 'transition-metal',
    group: 8,
    period: 4,
    block: 'd',

    density: 7.874,
    meltingPoint: 1811,
    boilingPoint: 3134,
    phase: 'solid',
    color: 'metallic-gray',
    appearance: 'Lustrous, metallic gray solid',

    electronConfiguration: '[Ar] 3d⁶ 4s²',
    electronegativity: 1.83,
    oxidationStates: [2, 3, 6],
    ionizationEnergy: 762.5,
    electronAffinity: 15.7,
    atomicRadius: 126,
    covalentRadius: 132,
    vanDerWaalsRadius: 200,

    biologicalRole: 'Critical for hemoglobin, myoglobin, cytochromes, and iron-sulfur clusters (LUCA energy)',
    essentialForLife: true,
    toxicity: 'low (but overloading is toxic)',
    bioavailability: 'low in oxygenated water, high in reducing environments',

    crustalAbundance: 56300,
    oceanicAbundance: 0.002,
    meteoriteAbundance: 184000,
    solarAbundance: 7.5,

    commonIsotopes: [
        { mass: 56, abundance: 91.75, radioactive: false },
        { mass: 54, abundance: 5.85, radioactive: false }
    ],

    discoveryYear: -5000,
    discoveredBy: 'Ancient civilizations',
    nameOrigin: 'Anglo-Saxon "iron"',

    cpkColor: '#E06633'
});

// ===== 27. COBALTO (Co) =====
ELEMENTS_021_040.push({
    atomicNumber: 27,
    symbol: 'Co',
    name: 'Cobalt',
    nameES: 'Cobalto',
    atomicMass: 58.933,
    category: 'transition-metal',
    group: 9,
    period: 4,
    block: 'd',

    density: 8.9,
    meltingPoint: 1768,
    boilingPoint: 3200,
    phase: 'solid',
    color: 'metallic-gray',
    appearance: 'Hard, lustrous, brittle, metallic gray solid',

    electronConfiguration: '[Ar] 3d⁷ 4s²',
    electronegativity: 1.88,
    oxidationStates: [2, 3],
    ionizationEnergy: 760.4,
    electronAffinity: 63.7,
    atomicRadius: 125,
    covalentRadius: 126,
    vanDerWaalsRadius: 200,

    biologicalRole: 'Essential part of Vitamin B12 (cobalamin)',
    essentialForLife: true,
    toxicity: 'moderate',
    bioavailability: 'medium',

    crustalAbundance: 25,
    oceanicAbundance: 0.00002,
    meteoriteAbundance: 550,
    solarAbundance: 4.9,

    commonIsotopes: [
        { mass: 59, abundance: 100, radioactive: false }
    ],

    discoveryYear: 1735,
    discoveredBy: 'Georg Brandt',
    nameOrigin: 'German "kobold" (goblin)',

    cpkColor: '#F090A0'
});

// ===== 28. NÍQUEL (Ni) =====
ELEMENTS_021_040.push({
    atomicNumber: 28,
    symbol: 'Ni',
    name: 'Nickel',
    nameES: 'Níquel',
    atomicMass: 58.693,
    category: 'transition-metal',
    group: 10,
    period: 4,
    block: 'd',

    density: 8.908,
    meltingPoint: 1728,
    boilingPoint: 3186,
    phase: 'solid',
    color: 'silvery-white',
    appearance: 'Lustrous, silvery-white metallic solid',

    electronConfiguration: '[Ar] 3d⁸ 4s²',
    electronegativity: 1.91,
    oxidationStates: [2, 3],
    ionizationEnergy: 737.1,
    electronAffinity: 112,
    atomicRadius: 124,
    covalentRadius: 121,
    vanDerWaalsRadius: 163,

    biologicalRole: 'Essential for urease and hydrogenase enzymes',
    essentialForLife: true,
    toxicity: 'moderate (allergenic)',
    bioavailability: 'medium',

    crustalAbundance: 84,
    oceanicAbundance: 0.00056,
    meteoriteAbundance: 11000,
    solarAbundance: 6.2,

    commonIsotopes: [
        { mass: 58, abundance: 68.1, radioactive: false },
        { mass: 60, abundance: 26.2, radioactive: false }
    ],

    discoveryYear: 1751,
    discoveredBy: 'Axel Fredrik Cronstedt',
    nameOrigin: 'German "Nickel" (mischievous spirit)',

    cpkColor: '#50D050'
});

// ===== 29. COBRE (Cu) =====
ELEMENTS_021_040.push({
    atomicNumber: 29,
    symbol: 'Cu',
    name: 'Copper',
    nameES: 'Cobre',
    atomicMass: 63.546,
    category: 'transition-metal',
    group: 11,
    period: 4,
    block: 'd',

    density: 8.96,
    meltingPoint: 1357.77,
    boilingPoint: 2835,
    phase: 'solid',
    color: 'red-orange',
    appearance: 'Red-orange, lustrous, ductile metallic solid',

    electronConfiguration: '[Ar] 3d¹⁰ 4s¹',
    electronegativity: 1.9,
    oxidationStates: [1, 2],
    ionizationEnergy: 745.5,
    electronAffinity: 118.4,
    atomicRadius: 128,
    covalentRadius: 132,
    vanDerWaalsRadius: 140,

    biologicalRole: 'Essential for many enzymes, including cytochrome c oxidase (respiration)',
    essentialForLife: true,
    toxicity: 'moderate',
    bioavailability: 'medium',

    crustalAbundance: 60,
    oceanicAbundance: 0.00025,
    meteoriteAbundance: 110,
    solarAbundance: 4.2,

    commonIsotopes: [
        { mass: 63, abundance: 69.17, radioactive: false },
        { mass: 65, abundance: 30.83, radioactive: false }
    ],

    discoveryYear: -9000,
    discoveredBy: 'Ancient civilizations',
    nameOrigin: 'Latin "Cuprum" (from Cyprus)',

    cpkColor: '#C88033'
});

// ===== 30. ZINC (Zn) =====
ELEMENTS_021_040.push({
    atomicNumber: 30,
    symbol: 'Zn',
    name: 'Zinc',
    nameES: 'Zinc',
    atomicMass: 65.38,
    category: 'transition-metal',
    group: 12,
    period: 4,
    block: 'd',

    density: 7.14,
    meltingPoint: 692.68,
    boilingPoint: 1180,
    phase: 'solid',
    color: 'silvery-blue',
    appearance: 'Silvery-blue-grey metallic solid',

    electronConfiguration: '[Ar] 3d¹⁰ 4s²',
    electronegativity: 1.65,
    oxidationStates: [2],
    ionizationEnergy: 906.4,
    electronAffinity: 0,
    atomicRadius: 134,
    covalentRadius: 122,
    vanDerWaalsRadius: 139,

    biologicalRole: 'Crucial for DNA transcription (zinc fingers), carbon anhydrase, and enzymes',
    essentialForLife: true,
    toxicity: 'low',
    bioavailability: 'high',

    crustalAbundance: 70,
    oceanicAbundance: 0.0004,
    meteoriteAbundance: 310,
    solarAbundance: 4.6,

    commonIsotopes: [
        { mass: 64, abundance: 49.17, radioactive: false }
    ],

    discoveryYear: -1000,
    discoveredBy: 'Ancient civilizations (isolated in 1746 by Marggraf)',
    nameOrigin: 'German "Zinke"',

    cpkColor: '#7D80B0'
});

// ===== 31. GALIO (Ga) =====
ELEMENTS_021_040.push({
    atomicNumber: 31,
    symbol: 'Ga',
    name: 'Gallium',
    nameES: 'Galio',
    atomicMass: 69.723,
    category: 'post-transition-metal',
    group: 13,
    period: 4,
    block: 'p',

    density: 5.91,
    meltingPoint: 302.91, // Melts in hand!
    boilingPoint: 2673,
    phase: 'solid',
    color: 'silvery-blue',
    appearance: 'Silvery-blue metallic solid',

    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹',
    electronegativity: 1.81,
    oxidationStates: [3],
    ionizationEnergy: 578.8,
    electronAffinity: 28.9,
    atomicRadius: 135,
    covalentRadius: 122,
    vanDerWaalsRadius: 187,

    biologicalRole: 'No known biological role (can substitute for Fe in some cases)',
    essentialForLife: false,
    toxicity: 'low',
    bioavailability: 'low',

    crustalAbundance: 19,
    oceanicAbundance: 0.00003,
    meteoriteAbundance: 6,
    solarAbundance: 2.8,

    commonIsotopes: [
        { mass: 69, abundance: 60.1, radioactive: false }
    ],

    discoveryYear: 1875,
    discoveredBy: 'Paul-Émile Lecoq de Boisbaudran',
    nameOrigin: 'Latin "Gallia" (France)',

    cpkColor: '#C28F8F'
});

// ===== 32. GERMANIO (Ge) =====
ELEMENTS_021_040.push({
    atomicNumber: 32,
    symbol: 'Ge',
    name: 'Germanium',
    nameES: 'Germanio',
    atomicMass: 72.63,
    category: 'metalloid',
    group: 14,
    period: 4,
    block: 'p',

    density: 5.323,
    meltingPoint: 1211.4,
    boilingPoint: 3106,
    phase: 'solid',
    color: 'greyish-white',
    appearance: 'Greyish-white metallic-looking solid',

    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p²',
    electronegativity: 2.01,
    oxidationStates: [2, 4],
    ionizationEnergy: 762,
    electronAffinity: 119,
    atomicRadius: 122,
    covalentRadius: 120,
    vanDerWaalsRadius: 211,

    biologicalRole: 'No known biological role',
    essentialForLife: false,
    toxicity: 'low',
    bioavailability: 'low',

    crustalAbundance: 1.5,
    oceanicAbundance: 0.00005,
    meteoriteAbundance: 21,
    solarAbundance: 3.6,

    commonIsotopes: [
        { mass: 74, abundance: 36.3, radioactive: false }
    ],

    discoveryYear: 1886,
    discoveredBy: 'Clemens Winkler',
    nameOrigin: 'Latin "Germania" (Germany)',

    cpkColor: '#668F8F'
});

// ===== 33. ARSÉNICO (As) =====
ELEMENTS_021_040.push({
    atomicNumber: 33,
    symbol: 'As',
    name: 'Arsenic',
    nameES: 'Arsénico',
    atomicMass: 74.9216,
    category: 'metalloid',
    group: 15,
    period: 4,
    block: 'p',

    density: 5.727,
    meltingPoint: 1090, // Sublimes at 887 K
    boilingPoint: 887,
    phase: 'solid',
    color: 'metallic-grey',
    appearance: 'Metallic grey, brittle solid',

    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p³',
    electronegativity: 2.18,
    oxidationStates: [-3, 3, 5],
    ionizationEnergy: 947,
    electronAffinity: 78,
    atomicRadius: 119,
    covalentRadius: 119,
    vanDerWaalsRadius: 185,

    biologicalRole: 'Used by some bacteria for respiration (arsenate reduction), but highly toxic to others',
    essentialForLife: false,
    toxicity: 'extreme',
    bioavailability: 'medium',

    crustalAbundance: 1.8,
    oceanicAbundance: 0.0037,
    meteoriteAbundance: 2,
    solarAbundance: 2.3,

    commonIsotopes: [
        { mass: 75, abundance: 100, radioactive: false }
    ],

    discoveryYear: 1250,
    discoveredBy: 'Albertus Magnus',
    nameOrigin: 'Greek "arsenikon" (yellow orpiment)',

    cpkColor: '#BD80E3'
});

// ===== 34. SELENIO (Se) =====
ELEMENTS_021_040.push({
    atomicNumber: 34,
    symbol: 'Se',
    name: 'Selenium',
    nameES: 'Selenio',
    atomicMass: 78.971,
    category: 'nonmetal',
    group: 16,
    period: 4,
    block: 'p',

    density: 4.81,
    meltingPoint: 494,
    boilingPoint: 958,
    phase: 'solid',
    color: 'grey-black',
    appearance: 'Lustrous grey-black nonmetal solid',

    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴',
    electronegativity: 2.55,
    oxidationStates: [-2, 4, 6],
    ionizationEnergy: 941,
    electronAffinity: 195,
    atomicRadius: 117,
    covalentRadius: 120,
    vanDerWaalsRadius: 190,

    biologicalRole: 'Essential trace element, part of selenocysteine (21st amino acid)',
    essentialForLife: true,
    toxicity: 'high (in excess)',
    bioavailability: 'medium',

    crustalAbundance: 0.05,
    oceanicAbundance: 0.0002,
    meteoriteAbundance: 13,
    solarAbundance: 3.3,

    commonIsotopes: [
        { mass: 80, abundance: 49.6, radioactive: false }
    ],

    discoveryYear: 1817,
    discoveredBy: 'Jöns Jacob Berzelius',
    nameOrigin: 'Greek "selene" (Moon)',

    cpkColor: '#FFA100'
});

// ===== 35. BROMO (Br) =====
ELEMENTS_021_040.push({
    atomicNumber: 35,
    symbol: 'Br',
    name: 'Bromine',
    nameES: 'Bromo',
    atomicMass: 79.904,
    category: 'halogen',
    group: 17,
    period: 4,
    block: 'p',

    density: 3.102,
    meltingPoint: 265.8,
    boilingPoint: 332,
    phase: 'liquid', // One of two liquid elements at STP
    color: 'red-brown',
    appearance: 'Red-brown liquid',

    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵',
    electronegativity: 2.96,
    oxidationStates: [-1, 1, 3, 5],
    ionizationEnergy: 1139.9,
    electronAffinity: 324.6,
    atomicRadius: 114,
    covalentRadius: 120,
    vanDerWaalsRadius: 185,

    biologicalRole: 'Essential for basement membrane architecture in animals',
    essentialForLife: true,
    toxicity: 'high',
    bioavailability: 'high',

    crustalAbundance: 2.4,
    oceanicAbundance: 67,
    meteoriteAbundance: 1,
    solarAbundance: 2.5,

    commonIsotopes: [
        { mass: 79, abundance: 50.69, radioactive: false },
        { mass: 81, abundance: 49.31, radioactive: false }
    ],
    discoveryYear: 1826,
    discoveredBy: 'Antoine Jérôme Balard and Carl Jacob Löwig',
    nameOrigin: 'Greek "bromos" (stench)',

    cpkColor: '#A62929'
});

// ===== 36. KRIPTÓN (Kr) =====
ELEMENTS_021_040.push({
    atomicNumber: 36,
    symbol: 'Kr',
    name: 'Krypton',
    nameES: 'Kriptón',
    atomicMass: 83.798,
    category: 'noble-gas',
    group: 18,
    period: 4,
    block: 'p',

    density: 0.003733,
    meltingPoint: 115.79,
    boilingPoint: 119.93,
    phase: 'gas',
    color: 'colorless',
    appearance: 'Colorless, odorless gas',

    electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶',
    electronegativity: 3.0,
    oxidationStates: [0, 2],
    ionizationEnergy: 1350.8,
    electronAffinity: 0,
    atomicRadius: 110,
    covalentRadius: 116,
    vanDerWaalsRadius: 202,

    biologicalRole: 'No known biological role',
    essentialForLife: false,
    toxicity: 'none',
    bioavailability: 'none',

    crustalAbundance: 0.0001,
    oceanicAbundance: 0.00021,
    meteoriteAbundance: 0.05,
    solarAbundance: 1.0,

    commonIsotopes: [
        { mass: 84, abundance: 57, radioactive: false }
    ],

    discoveryYear: 1898,
    discoveredBy: 'William Ramsay and Morris Travers',
    nameOrigin: 'Greek "kryptos" (hidden)',

    cpkColor: '#5CB8D1'
});

// ===== 37. RUBIDIO (Rb) =====
ELEMENTS_021_040.push({
    atomicNumber: 37,
    symbol: 'Rb',
    name: 'Rubidium',
    nameES: 'Rubidio',
    atomicMass: 85.4678,
    category: 'alkali-metal',
    group: 1,
    period: 5,
    block: 's',

    density: 1.532,
    meltingPoint: 312.46,
    boilingPoint: 961,
    phase: 'solid',
    color: 'silvery-white',
    appearance: 'Silvery-white metallic solid',

    electronConfiguration: '[Kr] 5s¹',
    electronegativity: 0.82,
    oxidationStates: [1],
    ionizationEnergy: 403,
    electronAffinity: 46.9,
    atomicRadius: 248,
    covalentRadius: 220,
    vanDerWaalsRadius: 303,

    biologicalRole: 'No known essential role, but used similarly to potassium',
    essentialForLife: false,
    toxicity: 'low',
    bioavailability: 'medium',

    crustalAbundance: 90,
    oceanicAbundance: 0.12,
    meteoriteAbundance: 2.3,
    solarAbundance: 2.6,

    commonIsotopes: [
        { mass: 85, abundance: 72.17, radioactive: false },
        { mass: 87, abundance: 27.83, radioactive: true }
    ],

    discoveryYear: 1861,
    discoveredBy: 'Robert Bunsen and Gustav Kirchhoff',
    nameOrigin: 'Latin "rubidus" (deep red)',

    cpkColor: '#702EB0'
});

// ===== 38. ESTRONCIO (Sr) =====
ELEMENTS_021_040.push({
    atomicNumber: 38,
    symbol: 'Sr',
    name: 'Strontium',
    nameES: 'Estroncio',
    atomicMass: 87.62,
    category: 'alkaline-earth-metal',
    group: 2,
    period: 5,
    block: 's',

    density: 2.64,
    meltingPoint: 1050,
    boilingPoint: 1655,
    phase: 'solid',
    color: 'silvery-white',
    appearance: 'Silvery-white metallic solid',

    electronConfiguration: '[Kr] 5s²',
    electronegativity: 0.95,
    oxidationStates: [2],
    ionizationEnergy: 549.5,
    electronAffinity: 5.0,
    atomicRadius: 215,
    covalentRadius: 195,
    vanDerWaalsRadius: 249,

    biologicalRole: 'Can replace calcium in bones, essential for some marine organisms (acantharians)',
    essentialForLife: false,
    toxicity: 'low',
    bioavailability: 'medium',

    crustalAbundance: 370,
    oceanicAbundance: 7.9,
    meteoriteAbundance: 11,
    solarAbundance: 2.9,

    commonIsotopes: [
        { mass: 88, abundance: 82.58, radioactive: false }
    ],

    discoveryYear: 1790,
    discoveredBy: 'Adair Crawford',
    nameOrigin: 'Village of Strontian (Scotland)',

    cpkColor: '#00FF00'
});

// ===== 39. ITRIO (Y) =====
ELEMENTS_021_040.push({
    atomicNumber: 39,
    symbol: 'Y',
    name: 'Yttrium',
    nameES: 'Itrio',
    atomicMass: 88.9058,
    category: 'transition-metal',
    group: 3,
    period: 5,
    block: 'd',

    density: 4.472,
    meltingPoint: 1799,
    boilingPoint: 3337,
    phase: 'solid',
    color: 'silvery-white',
    appearance: 'Silvery-white metallic solid',

    electronConfiguration: '[Kr] 4d¹ 5s²',
    electronegativity: 1.22,
    oxidationStates: [3],
    ionizationEnergy: 600,
    electronAffinity: 29.6,
    atomicRadius: 180,
    covalentRadius: 164,
    vanDerWaalsRadius: 219,

    biologicalRole: 'No known biological role',
    essentialForLife: false,
    toxicity: 'low',
    bioavailability: 'low',

    crustalAbundance: 33,
    oceanicAbundance: 0.000013,
    meteoriteAbundance: 1.8,
    solarAbundance: 1.9,

    commonIsotopes: [
        { mass: 89, abundance: 100, radioactive: false }
    ],

    discoveryYear: 1794,
    discoveredBy: 'Johan Gadolin',
    nameOrigin: 'Village of Ytterby (Sweden)',

    cpkColor: '#94FFFF'
});

// ===== 40. CIRCONIO (Zr) =====
ELEMENTS_021_040.push({
    atomicNumber: 40,
    symbol: 'Zr',
    name: 'Zirconium',
    nameES: 'Circonio',
    atomicMass: 91.224,
    category: 'transition-metal',
    group: 4,
    period: 5,
    block: 'd',

    density: 6.52,
    meltingPoint: 2128,
    boilingPoint: 4682,
    phase: 'solid',
    color: 'silvery-grey-white',
    appearance: 'Silvery grey-white metallic solid',

    electronConfiguration: '[Kr] 4d² 5s²',
    electronegativity: 1.33,
    oxidationStates: [4],
    ionizationEnergy: 640.1,
    electronAffinity: 41,
    atomicRadius: 160,
    covalentRadius: 150,
    vanDerWaalsRadius: 200,

    biologicalRole: 'No known biological role',
    essentialForLife: false,
    toxicity: 'low',
    bioavailability: 'very low',

    crustalAbundance: 165,
    oceanicAbundance: 0.00003,
    meteoriteAbundance: 5.4,
    solarAbundance: 1.9,

    commonIsotopes: [
        { mass: 90, abundance: 51.45, radioactive: false }
    ],

    discoveryYear: 1789,
    discoveredBy: 'Martin Heinrich Klaproth',
    nameOrigin: 'Persian "zargun" (gold-colored)',

    cpkColor: '#94E0E0'
});
