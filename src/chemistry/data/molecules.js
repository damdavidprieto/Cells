/**
 * molecules.js
 * ============
 * Definiciones de moléculas biológicamente relevantes.
 * Todas las moléculas se construyen a partir de elementos de la tabla periódica.
 * 
 * Fuentes:
 * - NIST Chemistry WebBook
 * - PubChem
 * - Biochemistry textbooks
 */

/**
 * Función helper para crear moléculas
 * Requiere que periodicTable esté inicializado
 */
function createMolecules(periodicTable) {
    const MOLECULES = [];

    // ===== 1. HIDRÓGENO MOLECULAR (H₂) =====
    MOLECULES.push({
        formula: 'H2',
        name: 'Hydrogen',
        nameES: 'Hidrógeno',
        commonName: 'Molecular Hydrogen',

        // Composición
        atoms: [
            { element: periodicTable.getBySymbol('H'), count: 2 }
        ],

        // Propiedades físicas
        density: 0.00008988,  // g/cm³ at STP
        meltingPoint: 14.01,  // K
        boilingPoint: 20.28,  // K
        phase: 'gas',
        color: 'colorless',
        odor: 'odorless',
        appearance: 'Colorless, odorless, highly flammable gas',

        // Propiedades químicas
        polarity: 'nonpolar',
        bondType: 'covalent',
        bondLength: 74,       // pm
        bondEnergy: 436,      // kJ/mol
        solubility: 'slightly soluble',
        reactivity: 'moderate',
        stability: 'stable',

        // Termodinámica
        enthalpyFormation: 0,     // kJ/mol (element in standard state)
        gibbsEnergy: 0,           // kJ/mol
        entropy: 130.7,           // J/mol·K

        // Biología
        biologicalRole: 'Electron donor for chemosynthesis in LUCA and archaea',
        metabolicRelevance: 'Essential substrate for hydrogenotrophic methanogenesis and chemolithoautotrophy',
        toxicity: 'none',
        essentialForLife: true,

        // Integración con Cells
        gridName: 'h2Grid',
        metabolicPathways: ['chemosynthesis', 'methanogenesis'],

        // Visualización
        cpkColor: '#FFFFFF',

        sources: ['NIST', 'PubChem CID: 783']
    });

    // ===== 2. DIÓXIDO DE CARBONO (CO₂) =====
    MOLECULES.push({
        formula: 'CO2',
        name: 'Carbon Dioxide',
        nameES: 'Dióxido de Carbono',
        commonName: 'Carbonic Gas',

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 1 },
            { element: periodicTable.getBySymbol('O'), count: 2 }
        ],

        density: 0.001977,    // g/cm³ at STP
        meltingPoint: 216.6,  // K (sublimes)
        boilingPoint: 194.7,  // K (at 5.1 atm)
        phase: 'gas',
        color: 'colorless',
        odor: 'odorless',
        appearance: 'Colorless, odorless gas',

        polarity: 'nonpolar',
        bondType: 'covalent',
        bondLength: 116,      // pm (C=O)
        bondEnergy: 799,      // kJ/mol (C=O)
        solubility: 'soluble',
        reactivity: 'low',
        stability: 'very stable',

        enthalpyFormation: -393.5,  // kJ/mol
        gibbsEnergy: -394.4,        // kJ/mol
        entropy: 213.8,             // J/mol·K

        biologicalRole: 'Primary carbon source for autotrophs, product of respiration',
        metabolicRelevance: 'Central to carbon fixation (Calvin cycle), methanogenesis, and cellular respiration',
        toxicity: 'low',
        essentialForLife: true,

        gridName: 'co2Grid',
        metabolicPathways: ['photosynthesis', 'calvin-cycle', 'methanogenesis', 'respiration'],

        cpkColor: '#909090',

        sources: ['NIST', 'PubChem CID: 280']
    });

    // ===== 3. METANO (CH₄) =====
    MOLECULES.push({
        formula: 'CH4',
        name: 'Methane',
        nameES: 'Metano',
        commonName: 'Natural Gas',

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 1 },
            { element: periodicTable.getBySymbol('H'), count: 4 }
        ],

        density: 0.000717,    // g/cm³ at STP
        meltingPoint: 90.7,   // K
        boilingPoint: 111.7,  // K
        phase: 'gas',
        color: 'colorless',
        odor: 'odorless',
        appearance: 'Colorless, odorless, flammable gas',

        polarity: 'nonpolar',
        bondType: 'covalent',
        bondLength: 109,      // pm (C-H)
        bondEnergy: 413,      // kJ/mol (C-H)
        solubility: 'slightly soluble',
        reactivity: 'low',
        stability: 'stable',

        enthalpyFormation: -74.6,   // kJ/mol
        gibbsEnergy: -50.5,         // kJ/mol
        entropy: 186.3,             // J/mol·K

        biologicalRole: 'Product of methanogenesis, substrate for methanotrophy',
        metabolicRelevance: 'Key intermediate in anaerobic carbon cycle, energy source for methanotrophic bacteria',
        toxicity: 'low',
        essentialForLife: false,

        gridName: 'ch4Grid',
        metabolicPathways: ['methanogenesis', 'methanotrophy'],

        cpkColor: '#909090',

        sources: ['NIST', 'PubChem CID: 297']
    });

    // ===== 4. SULFURO DE HIDRÓGENO (H₂S) =====
    MOLECULES.push({
        formula: 'H2S',
        name: 'Hydrogen Sulfide',
        nameES: 'Sulfuro de Hidrógeno',
        commonName: 'Sour Gas',

        atoms: [
            { element: periodicTable.getBySymbol('H'), count: 2 },
            { element: periodicTable.getBySymbol('S'), count: 1 }
        ],

        density: 0.001539,    // g/cm³ at STP
        meltingPoint: 187.7,  // K
        boilingPoint: 213.6,  // K
        phase: 'gas',
        color: 'colorless',
        odor: 'rotten eggs',
        appearance: 'Colorless, toxic gas with characteristic odor',

        polarity: 'polar',
        bondType: 'covalent',
        bondLength: 134,      // pm (S-H)
        bondEnergy: 363,      // kJ/mol (S-H)
        solubility: 'soluble',
        reactivity: 'high',
        stability: 'moderately stable',

        enthalpyFormation: -20.6,   // kJ/mol
        gibbsEnergy: -33.4,         // kJ/mol
        entropy: 205.8,             // J/mol·K

        biologicalRole: 'Electron donor for sulfur-oxidizing bacteria, toxic to most organisms',
        metabolicRelevance: 'Energy source for chemolithoautotrophs near hydrothermal vents',
        toxicity: 'high',
        essentialForLife: false,

        gridName: 'h2sGrid',
        metabolicPathways: ['sulfur-oxidation', 'chemosynthesis'],

        cpkColor: '#FFFF30',

        sources: ['NIST', 'PubChem CID: 402']
    });

    // ===== 5. AMONÍACO (NH₃) =====
    MOLECULES.push({
        formula: 'NH3',
        name: 'Ammonia',
        nameES: 'Amoníaco',
        commonName: 'Azane',

        atoms: [
            { element: periodicTable.getBySymbol('N'), count: 1 },
            { element: periodicTable.getBySymbol('H'), count: 3 }
        ],

        density: 0.000771,    // g/cm³ at STP
        meltingPoint: 195.4,  // K
        boilingPoint: 239.8,  // K
        phase: 'gas',
        color: 'colorless',
        odor: 'pungent',
        appearance: 'Colorless gas with pungent odor',

        polarity: 'polar',
        bondType: 'covalent',
        bondLength: 101,      // pm (N-H)
        bondEnergy: 391,      // kJ/mol (N-H)
        solubility: 'highly soluble',
        reactivity: 'moderate',
        stability: 'stable',

        enthalpyFormation: -45.9,   // kJ/mol
        gibbsEnergy: -16.4,         // kJ/mol
        entropy: 192.8,             // J/mol·K

        biologicalRole: 'Nitrogen source for biosynthesis, product of nitrogen fixation',
        metabolicRelevance: 'Essential for amino acid and nucleotide synthesis, key in nitrogen cycle',
        toxicity: 'moderate',
        essentialForLife: true,

        gridName: 'nh3Grid',
        metabolicPathways: ['nitrogen-fixation', 'amino-acid-synthesis'],

        cpkColor: '#3050F8',

        sources: ['NIST', 'PubChem CID: 222']
    });

    // ===== 6. OXÍGENO MOLECULAR (O₂) =====
    MOLECULES.push({
        formula: 'O2',
        name: 'Oxygen',
        nameES: 'Oxígeno',
        commonName: 'Dioxygen',

        atoms: [
            { element: periodicTable.getBySymbol('O'), count: 2 }
        ],

        density: 0.001429,    // g/cm³ at STP
        meltingPoint: 54.36,  // K
        boilingPoint: 90.20,  // K
        phase: 'gas',
        color: 'colorless',
        odor: 'odorless',
        appearance: 'Colorless, odorless gas',

        polarity: 'nonpolar',
        bondType: 'covalent',
        bondLength: 121,      // pm (O=O)
        bondEnergy: 498,      // kJ/mol (O=O)
        solubility: 'slightly soluble',
        reactivity: 'high',
        stability: 'stable',

        enthalpyFormation: 0,       // kJ/mol (element in standard state)
        gibbsEnergy: 0,             // kJ/mol
        entropy: 205.2,             // J/mol·K

        biologicalRole: 'Terminal electron acceptor in aerobic respiration, product of photosynthesis',
        metabolicRelevance: 'Essential for aerobic metabolism, highly toxic to anaerobes (Great Oxidation Event)',
        toxicity: 'none',
        essentialForLife: true,

        gridName: 'oxygenGrid',
        metabolicPathways: ['aerobic-respiration', 'photosynthesis'],

        cpkColor: '#FF0D0D',

        sources: ['NIST', 'PubChem CID: 977']
    });

    // ===== 7. AGUA (H₂O) - FUTURO =====
    MOLECULES.push({
        formula: 'H2O',
        name: 'Water',
        nameES: 'Agua',
        commonName: 'Dihydrogen Monoxide',

        atoms: [
            { element: periodicTable.getBySymbol('H'), count: 2 },
            { element: periodicTable.getBySymbol('O'), count: 1 }
        ],

        density: 0.997,       // g/cm³ at 25°C
        meltingPoint: 273.15, // K
        boilingPoint: 373.15, // K
        phase: 'liquid',
        color: 'colorless',
        odor: 'odorless',
        appearance: 'Clear, colorless liquid',

        polarity: 'polar',
        bondType: 'covalent',
        bondLength: 96,       // pm (O-H)
        bondEnergy: 463,      // kJ/mol (O-H)
        solubility: 'N/A',
        reactivity: 'low',
        stability: 'very stable',

        enthalpyFormation: -285.8,  // kJ/mol
        gibbsEnergy: -237.1,        // kJ/mol
        entropy: 70.0,              // J/mol·K

        biologicalRole: 'Universal solvent, essential for all known life',
        metabolicRelevance: 'Medium for all biochemical reactions, product of respiration',
        toxicity: 'none',
        essentialForLife: true,

        gridName: null,  // No grid específico (es el medio)
        metabolicPathways: ['all'],

        cpkColor: '#FF0D0D',

        sources: ['NIST', 'PubChem CID: 962']
    });

    // ===== 8. NITRÓGENO MOLECULAR (N₂) - FUTURO =====
    MOLECULES.push({
        formula: 'N2',
        name: 'Nitrogen',
        nameES: 'Nitrógeno',
        commonName: 'Dinitrogen',

        atoms: [
            { element: periodicTable.getBySymbol('N'), count: 2 }
        ],

        density: 0.001251,    // g/cm³ at STP
        meltingPoint: 63.15,  // K
        boilingPoint: 77.36,  // K
        phase: 'gas',
        color: 'colorless',
        odor: 'odorless',
        appearance: 'Colorless, odorless, inert gas',

        polarity: 'nonpolar',
        bondType: 'covalent',
        bondLength: 110,      // pm (N≡N)
        bondEnergy: 945,      // kJ/mol (N≡N) - very strong triple bond
        solubility: 'slightly soluble',
        reactivity: 'very low',
        stability: 'very stable',

        enthalpyFormation: 0,       // kJ/mol (element in standard state)
        gibbsEnergy: 0,             // kJ/mol
        entropy: 191.6,             // J/mol·K

        biologicalRole: 'Atmospheric reservoir, substrate for nitrogen fixation',
        metabolicRelevance: 'Converted to NH₃ by nitrogenase enzyme in nitrogen-fixing bacteria',
        toxicity: 'none',
        essentialForLife: true,
        gridName: 'nitrogenGrid',
        metabolicPathways: ['nitrogen-fixation'],

        cpkColor: '#3050F8',

        sources: ['NIST', 'PubChem CID: 947']
    });

    // ===== 9. ION FERROSO (Fe²⁺) =====
    MOLECULES.push({
        formula: 'Fe2+',
        name: 'Ferrous Ion',
        nameES: 'Ion Ferroso',
        commonName: 'Iron(II) Ion',
        charge: 2,

        atoms: [
            { element: periodicTable.getBySymbol('Fe'), count: 1 }
        ],

        phase: 'aqueous',
        color: 'pale green',

        polarity: 'ion',
        bondType: 'ionic',
        solubility: 'highly soluble',
        reactivity: 'high',

        biologicalRole: 'Crucial for electron transport, cytochromes, and iron-sulfur clusters',
        metabolicRelevance: 'Primary electron donor for many lithotrophs in anaerobic environments',
        toxicity: 'low (essential)',
        essentialForLife: true,

        gridName: 'fe2Grid',
        metabolicPathways: ['electron-transport', 'chemosynthesis'],

        cpkColor: '#E06633',
        sources: ['Wikipedia', 'IUPAC']
    });

    // ===== 10. ION MAGNESIO (Mg²⁺) =====
    MOLECULES.push({
        formula: 'Mg2+',
        name: 'Magnesium Ion',
        nameES: 'Ion Magnesio',
        charge: 2,

        atoms: [
            { element: periodicTable.getBySymbol('Mg'), count: 1 }
        ],

        phase: 'aqueous',
        polarity: 'ion',
        bondType: 'ionic',
        solubility: 'highly soluble',

        biologicalRole: 'Essential cofactor for thousands of enzymes, stabilizes DNA/RNA and ATP',
        metabolicRelevance: 'Required for all reactions involving ATP',
        toxicity: 'none',
        essentialForLife: true,

        cpkColor: '#8AFF00',
        sources: ['Wikipedia']
    });

    // ===== 11. ION CALCIO (Ca²⁺) =====
    MOLECULES.push({
        formula: 'Ca2+',
        name: 'Calcium Ion',
        nameES: 'Ion Calcio',
        charge: 2,

        atoms: [
            { element: periodicTable.getBySymbol('Ca'), count: 1 }
        ],

        phase: 'aqueous',
        polarity: 'ion',
        bondType: 'ionic',
        solubility: 'variable',

        biologicalRole: 'Signal transduction, bone formation, enzyme cofactor',
        metabolicRelevance: 'Universal second messenger in cellular signaling',
        toxicity: 'none',
        essentialForLife: true,

        cpkColor: '#3DFF00',
        sources: ['Wikipedia']
    });

    // ===== 12. FOSFATO (PO₄³⁻) =====
    MOLECULES.push({
        formula: 'PO4 3-',
        name: 'Phosphate',
        nameES: 'Fosfatos',
        commonName: 'Orthophosphate',
        charge: -3,

        atoms: [
            { element: periodicTable.getBySymbol('P'), count: 1 },
            { element: periodicTable.getBySymbol('O'), count: 4 }
        ],

        phase: 'aqueous',
        polarity: 'ion',
        bondType: 'covalent/ionic',
        solubility: 'variable',

        biologicalRole: 'Structural component of DNA, RNA, ATP, and phospholipids',
        metabolicRelevance: 'Central to energy transfer (ATP) and genetic information storage',
        toxicity: 'none',
        essentialForLife: true,
        gridName: 'phosphorusGrid',

        cpkColor: '#FFA500',
        sources: ['Wikipedia', 'PubChem CID: 1061']
    });

    // ===== 13. CIANURO DE HIDRÓGENO (HCN) =====
    MOLECULES.push({
        formula: 'HCN',
        name: 'Hydrogen Cyanide',
        nameES: 'Cianuro de Hidrógeno',
        commonName: 'Prussic Acid',

        atoms: [
            { element: periodicTable.getBySymbol('H'), count: 1 },
            { element: periodicTable.getBySymbol('C'), count: 1 },
            { element: periodicTable.getBySymbol('N'), count: 1 }
        ],

        molecularMass: 27.025,
        phase: 'gas',
        polarity: 'polar',
        bondType: 'covalent',
        reactivity: 'extreme',

        biologicalRole: 'Prebiotic precursor for amino acids and nucleobases',
        metabolicRelevance: 'Critical in origin of life chemistry (prebiotic synthesis)',
        toxicity: 'extreme',
        essentialForLife: false,

        cpkColor: '#FF1493',
        sources: ['NIST', 'PubChem CID: 768']
    });

    // ===== 14. FORMALDEHÍDO (HCHO) =====
    MOLECULES.push({
        formula: 'HCHO',
        name: 'Formaldehyde',
        nameES: 'Formaldehído',
        commonName: 'Methanal',

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 1 },
            { element: periodicTable.getBySymbol('H'), count: 2 },
            { element: periodicTable.getBySymbol('O'), count: 1 }
        ],

        phase: 'gas',
        polarity: 'polar',
        bondType: 'covalent',
        reactivity: 'high',

        biologicalRole: 'Precursor for sugars via the formose reaction',
        metabolicRelevance: 'Key intermediate in prebiotic carbohydrate synthesis',
        toxicity: 'high',
        essentialForLife: false,

        cpkColor: '#909090',
        sources: ['NIST', 'PubChem CID: 712']
    });

    // ===== 15. GLICINA (C₂H₅NO₂) =====
    MOLECULES.push({
        formula: 'Glycine',
        name: 'Glycine',
        nameES: 'Glicina',
        commonName: 'Aminoacetic Acid',

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 2 },
            { element: periodicTable.getBySymbol('H'), count: 5 },
            { element: periodicTable.getBySymbol('N'), count: 1 },
            { element: periodicTable.getBySymbol('O'), count: 2 }
        ],

        phase: 'solid',
        polarity: 'polar (zwitterion)',
        bondType: 'covalent',
        solubility: 'highly soluble',

        biologicalRole: 'Simplest amino acid, building block for proteins',
        metabolicRelevance: 'Essential for biosynthesis of proteins, heme, and purines',
        toxicity: 'none',
        essentialForLife: true,

        cpkColor: '#50D050',
        sources: ['NIST', 'PubChem CID: 750']
    });

    // ===== 16. ATP (Adenosín Trifosfato) =====
    MOLECULES.push({
        formula: 'ATP',
        name: 'Adenosine Triphosphate',
        nameES: 'Adenosín Trifosfato',
        commonName: 'Energy Currency',
        charge: -4,

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 10 },
            { element: periodicTable.getBySymbol('H'), count: 16 },
            { element: periodicTable.getBySymbol('N'), count: 5 },
            { element: periodicTable.getBySymbol('O'), count: 13 },
            { element: periodicTable.getBySymbol('P'), count: 3 }
        ],

        phase: 'aqueous',
        polarity: 'polar',
        bondType: 'covalent',
        solubility: 'highly soluble',

        biologicalRole: 'Primary energy carrier in all known forms of life',
        metabolicRelevance: 'The universal "energy currency" of cells',
        toxicity: 'none',
        essentialForLife: true,

        metabolicPathways: ['atp-synthesis', 'all-metabolism'],
        cpkColor: '#FFD700', // Gold/Yellow for energy
        sources: ['Wikipedia', 'PubChem CID: 5957']
    });

    // ===== 17. ADP (Adenosín Difosfato) =====
    MOLECULES.push({
        formula: 'ADP',
        name: 'Adenosine Diphosphate',
        nameES: 'Adenosín Difosfato',
        charge: -3,

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 10 },
            { element: periodicTable.getBySymbol('H'), count: 15 },
            { element: periodicTable.getBySymbol('N'), count: 5 },
            { element: periodicTable.getBySymbol('O'), count: 10 },
            { element: periodicTable.getBySymbol('P'), count: 2 }
        ],

        phase: 'aqueous',
        biologicalRole: 'Precursor to ATP; product of ATP hydrolysis',
        metabolicRelevance: 'Low-energy state of the adenosine system',
        essentialForLife: true,

        cpkColor: '#C0C0C0',
        sources: ['PubChem CID: 702']
    });

    // ===== 18. RIBOSA (C₅H₁₀O₅) =====
    MOLECULES.push({
        formula: 'C5H10O5',
        name: 'Ribose',
        nameES: 'Ribosa',
        commonName: 'RNA Sugar',

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 5 },
            { element: periodicTable.getBySymbol('H'), count: 10 },
            { element: periodicTable.getBySymbol('O'), count: 5 }
        ],

        phase: 'solid',
        polarity: 'polar',
        solubility: 'soluble',

        biologicalRole: 'Backbone of RNA and components like ATP, NADH',
        metabolicRelevance: 'Key component of the RNA world hypothesis and modern genetics',
        essentialForLife: true,

        cpkColor: '#B0E0E6',
        sources: ['NIST', 'PubChem CID: 5779']
    });

    // ===== 19. ADENINA (C₅H₅N₅) =====
    MOLECULES.push({
        formula: 'C5H5N5',
        name: 'Adenine',
        nameES: 'Adenina',
        commonName: 'Vitamin B10 (obsolete)',

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 5 },
            { element: periodicTable.getBySymbol('H'), count: 5 },
            { element: periodicTable.getBySymbol('N'), count: 5 }
        ],

        phase: 'solid',
        polarity: 'polar',

        biologicalRole: 'Nucleobase (A) for DNA/RNA; part of ATP and NAD',
        metabolicRelevance: 'Fundamental building block for genetic information and energy transfer',
        essentialForLife: true,

        cpkColor: '#4169E1',
        sources: ['NIST', 'PubChem CID: 190']
    });

    // ===== 20. ACETIL-COA =====
    MOLECULES.push({
        formula: 'Acetyl-CoA',
        name: 'Acetyl-Coenzyme A',
        nameES: 'Acetil-Coenzima A',

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 23 },
            { element: periodicTable.getBySymbol('H'), count: 38 },
            { element: periodicTable.getBySymbol('N'), count: 7 },
            { element: periodicTable.getBySymbol('O'), count: 17 },
            { element: periodicTable.getBySymbol('P'), count: 3 },
            { element: periodicTable.getBySymbol('S'), count: 1 }
        ],

        molecularMass: 809.57,
        phase: 'aqueous',

        biologicalRole: 'Central hub of metabolism, delivers the acetyl group to the Citric Acid Cycle',
        metabolicRelevance: 'End product of the Wood-Ljungdahl pathway (LUCA metabolism)',
        essentialForLife: true,

        metabolicPathways: ['wood-ljungdahl', 'krebs-cycle', 'fatty-acid-synthesis'],
        cpkColor: '#FF69B4',
        sources: ['Wikipedia', 'PubChem CID: 444493']
    });

    // ===== 21. LACTATO (C₃H₅O₃⁻) =====
    MOLECULES.push({
        formula: 'C3H5O3-',
        name: 'Lactate',
        nameES: 'Lactato',
        charge: -1,

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 3 },
            { element: periodicTable.getBySymbol('H'), count: 5 },
            { element: periodicTable.getBySymbol('O'), count: 3 }
        ],

        phase: 'aqueous',
        biologicalRole: 'End product of lactic acid fermentation',
        metabolicRelevance: 'Biomarker for anaerobic glycolysis; affects local pH',
        toxicity: 'low (acidifying)',
        essentialForLife: false,

        metabolicPathways: ['fermentation', 'anaerobic-glycolysis'],
        cpkColor: '#9ACD32',
        sources: ['PubChem CID: 61503']
    });

    // ===== 22. GUANINA (C₅H₅N₅O) =====
    MOLECULES.push({
        formula: 'C5H5N5O',
        name: 'Guanine',
        nameES: 'Guanina',
        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 5 },
            { element: periodicTable.getBySymbol('H'), count: 5 },
            { element: periodicTable.getBySymbol('N'), count: 5 },
            { element: periodicTable.getBySymbol('O'), count: 1 }
        ],
        phase: 'solid',
        biologicalRole: 'Nucleobase (G) for DNA/RNA',
        metabolicRelevance: 'Building block for genetic information',
        essentialForLife: true,
        cpkColor: '#4169E1',
        sources: ['NIST', 'PubChem CID: 135']
    });

    // ===== 23. CITOSINA (C₄H₅N₃O) =====
    MOLECULES.push({
        formula: 'C4H5N3O',
        name: 'Cytosine',
        nameES: 'Citosina',
        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 4 },
            { element: periodicTable.getBySymbol('H'), count: 5 },
            { element: periodicTable.getBySymbol('N'), count: 3 },
            { element: periodicTable.getBySymbol('O'), count: 1 }
        ],
        phase: 'solid',
        biologicalRole: 'Nucleobase (C) for DNA/RNA',
        metabolicRelevance: 'Building block for genetic information',
        essentialForLife: true,
        cpkColor: '#4169E1',
        sources: ['NIST', 'PubChem CID: 597']
    });

    // ===== 24. TIMINA (C₅H₆N₂O₂) =====
    MOLECULES.push({
        formula: 'C5H6N2O2',
        name: 'Thymine',
        nameES: 'Timina',
        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 5 },
            { element: periodicTable.getBySymbol('H'), count: 6 },
            { element: periodicTable.getBySymbol('N'), count: 2 },
            { element: periodicTable.getBySymbol('O'), count: 2 }
        ],
        phase: 'solid',
        biologicalRole: 'Nucleobase (T) for DNA',
        metabolicRelevance: 'Building block for genetic information',
        essentialForLife: true,
        cpkColor: '#4169E1',
        sources: ['NIST', 'PubChem CID: 1135']
    });

    // ===== 25. URACILO (C₄H₄N₂O₂) =====
    MOLECULES.push({
        formula: 'C4H4N2O2',
        name: 'Uracil',
        nameES: 'Uracilo',
        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 4 },
            { element: periodicTable.getBySymbol('H'), count: 4 },
            { element: periodicTable.getBySymbol('N'), count: 2 },
            { element: periodicTable.getBySymbol('O'), count: 2 }
        ],
        phase: 'solid',
        biologicalRole: 'Nucleobase (U) for RNA',
        metabolicRelevance: 'Building block for genetic information in the RNA world',
        essentialForLife: true,
        cpkColor: '#4169E1',
        sources: ['NIST', 'PubChem CID: 1174']
    });

    // ===== 26. ÁCIDO PALMÍTICO (C₁₆H₃₂O₂) =====
    MOLECULES.push({
        formula: 'C16H32O2',
        name: 'Palmitic Acid',
        nameES: 'Ácido Palmítico',
        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 16 },
            { element: periodicTable.getBySymbol('H'), count: 32 },
            { element: periodicTable.getBySymbol('O'), count: 2 }
        ],
        phase: 'solid',
        polarity: 'amphiphilic',
        biologicalRole: 'Major component of cell membranes (phospholipids)',
        metabolicRelevance: 'Essential for compartmentalization and fatty acid metabolism',
        essentialForLife: true,
        cpkColor: '#FFFFFF',
        sources: ['NIST', 'PubChem CID: 985']
    });

    // ===== 27. NAD+ (Nicotinamida Adenina Dinucleótido - Oxidado) =====
    MOLECULES.push({
        formula: 'C21H27N7O14P2',
        name: 'NAD+',
        nameES: 'NAD+ (Oxidado)',
        commonName: 'Nicotinamide Adenine Dinucleotide',
        charge: -1,

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 21 },
            { element: periodicTable.getBySymbol('H'), count: 27 },
            { element: periodicTable.getBySymbol('N'), count: 7 },
            { element: periodicTable.getBySymbol('O'), count: 14 },
            { element: periodicTable.getBySymbol('P'), count: 2 }
        ],

        phase: 'aqueous',
        biologicalRole: 'Universal electron carrier (oxidized)',
        metabolicRelevance: 'Accepts electrons during catabolic reactions (Glycolysis, Krebs)',
        essentialForLife: true,
        cpkColor: '#FFB6C1', // Light Pink
        sources: ['PubChem CID: 5892']
    });

    // ===== 28. NADH (Nicotinamida Adenina Dinucleótido - Reducido) =====
    MOLECULES.push({
        formula: 'C21H29N7O14P2',
        name: 'NADH',
        nameES: 'NADH (Reducido)',
        charge: -2,

        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 21 },
            { element: periodicTable.getBySymbol('H'), count: 29 },
            { element: periodicTable.getBySymbol('N'), count: 7 },
            { element: periodicTable.getBySymbol('O'), count: 14 },
            { element: periodicTable.getBySymbol('P'), count: 2 }
        ],

        phase: 'aqueous',
        biologicalRole: 'Universal electron carrier (reduced)',
        metabolicRelevance: 'Donates electrons to the electron transport chain to generate ATP',
        essentialForLife: true,
        cpkColor: '#FF69B4', // Hot Pink
        sources: ['PubChem CID: 439153']
    });

    // ===== 29. ALANINA (C₃H₇NO₂) =====
    MOLECULES.push({
        formula: 'C3H7NO2',
        name: 'Alanine',
        nameES: 'Alanina',
        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 3 },
            { element: periodicTable.getBySymbol('H'), count: 7 },
            { element: periodicTable.getBySymbol('N'), count: 1 },
            { element: periodicTable.getBySymbol('O'), count: 2 }
        ],
        phase: 'solid',
        biologicalRole: 'Non-polar amino acid, protein building block',
        metabolicRelevance: 'Key in the glucose-alanine cycle and protein synthesis',
        essentialForLife: true,
        cpkColor: '#50D050',
        sources: ['NIST', 'PubChem CID: 5950']
    });

    // ===== 30. SERINA (C₃H₇NO₃) =====
    MOLECULES.push({
        formula: 'C3H7NO3',
        name: 'Serine',
        nameES: 'Serina',
        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 3 },
            { element: periodicTable.getBySymbol('H'), count: 7 },
            { element: periodicTable.getBySymbol('N'), count: 1 },
            { element: periodicTable.getBySymbol('O'), count: 3 }
        ],
        phase: 'solid',
        biologicalRole: 'Polar amino acid, precursor to phospholipids and other amino acids',
        metabolicRelevance: 'Essential for the synthesis of purines and pyrimidines',
        essentialForLife: true,
        cpkColor: '#50D050',
        sources: ['NIST', 'PubChem CID: 5951']
    });

    // ===== 31. GLICEROL (C₃H₈O₃) =====
    MOLECULES.push({
        formula: 'C3H8O3',
        name: 'Glycerol',
        nameES: 'Glicerol',
        commonName: 'Glycerin',
        atoms: [
            { element: periodicTable.getBySymbol('C'), count: 3 },
            { element: periodicTable.getBySymbol('H'), count: 8 },
            { element: periodicTable.getBySymbol('O'), count: 3 }
        ],
        phase: 'liquid',
        biologicalRole: 'Backbone of triglycerides and phospholipids',
        metabolicRelevance: 'Intermediate in glycolysis and essential for membrane synthesis',
        essentialForLife: true,
        cpkColor: '#909090',
        sources: ['NIST', 'PubChem CID: 753']
    });

    return MOLECULES;
}
