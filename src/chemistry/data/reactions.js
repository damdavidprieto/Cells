/**
 * ReactionLibrary.js
 * ===================
 * Biblioteca de reacciones metabólicas clave.
 */

function createReactions(molecularSystem) {
    const REACTIONS = [];

    // ===== 1. METANOGÉNESIS HIDROGENOTRÓFICA =====
    // 4H₂ + CO₂ → CH₄ + 2H₂O
    REACTIONS.push({
        id: 'methanogenesis',
        name: 'Methanogenesis',
        nameES: 'Metanogénesis',
        reactants: [
            { molecule: molecularSystem.getMolecule('H2'), coefficient: 4 },
            { molecule: molecularSystem.getMolecule('CO2'), coefficient: 1 }
        ],
        products: [
            { molecule: molecularSystem.getMolecule('CH4'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 2 }
        ],
        // ΔGr° ≈ -131 kJ/mol
        metabolicPathway: 'methanogenesis',
        biologicalRole: 'Energy production for archaea in anaerobic environments'
    });

    // ===== 2. RUTA WOOD-LJUNGDAHL (ACETOGÉNESIS) =====
    // 4H₂ + 2CO₂ → CH₃COOH (Acetato) + 2H₂O
    // Nota: Usamos una simplificación por ahora si no tenemos Acetato
    REACTIONS.push({
        id: 'wood_ljungdahl',
        name: 'Wood-Ljungdahl Pathway',
        nameES: 'Ruta Wood-Ljungdahl',
        reactants: [
            { molecule: molecularSystem.getMolecule('H2'), coefficient: 4 },
            { molecule: molecularSystem.getMolecule('CO2'), coefficient: 2 }
        ],
        products: [
            // CH3COOH aproximado (usamos CO2 + H2 por ahora o solo el ATP generado)
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 2 }
        ],
        // ΔGr° ≈ -95 kJ/mol
        metabolicPathway: 'acetogenesis',
        geochemicalBonus: true // Favorecido en vents
    });

    // ===== 3. OXIDACIÓN DE SULFURO (QUIMIOSÍNTESIS) =====
    // H₂S + 2O₂ → SO₄²⁻ + 2H⁺ (Simplificado: H2S + 0.5 O2 -> S + H2O)
    REACTIONS.push({
        id: 'sulfur_oxidation',
        name: 'Sulfur Oxidation',
        nameES: 'Oxidación de Azufre',
        reactants: [
            { molecule: molecularSystem.getMolecule('H2S'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('O2'), coefficient: 2 }
        ],
        products: [
            // Simplified for now
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 2 }
        ],
        // Muy exergónica
        metabolicPathway: 'chemosynthesis'
    });

    // ===== 4. RESPIRACIÓN AERÓBICA =====
    // C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O
    // Simplificado usando CH4 como modelo orgánico simple
    REACTIONS.push({
        id: 'aerobic_respiration',
        name: 'Aerobic Respiration',
        nameES: 'Respiración Aeróbica',
        reactants: [
            { molecule: molecularSystem.getMolecule('CH4'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('O2'), coefficient: 2 }
        ],
        products: [
            { molecule: molecularSystem.getMolecule('CO2'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 2 }
        ],
        // ΔGr° ≈ -818 kJ/mol
        metabolicPathway: 'cellular-respiration'
    });

    // ===== 5. NITRIFICACIÓN =====
    // NH₃ + 1.5 O₂ → NO₂⁻ + H₂O + H⁺
    REACTIONS.push({
        id: 'nitrification',
        name: 'Nitrification',
        nameES: 'Nitrificación',
        reactants: [
            { molecule: molecularSystem.getMolecule('NH3'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('O2'), coefficient: 2 }
        ],
        products: [
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 2 }
        ],
        metabolicPathway: 'nitrogen-cycle'
    });

    // ===== 6. FOTOSÍNTESIS OXIGÉNICA =====
    // 6CO₂ + 6H₂O + luz → C₆H₁₂O₆ (Glucosa) + 6O₂
    // Simplificado usando CH4 como modelo orgánico
    REACTIONS.push({
        id: 'oxigenic_photosynthesis',
        name: 'Oxygenic Photosynthesis',
        nameES: 'Fotosíntesis Oxigénica',
        reactants: [
            { molecule: molecularSystem.getMolecule('CO2'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 2 }
        ],
        products: [
            { molecule: molecularSystem.getMolecule('CH4'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('O2'), coefficient: 2 }
        ],
        // ΔGr° ≈ +818 kJ/mol (requiere energía)
        deltaG: 818,
        metabolicPathway: 'photosynthesis',
        requiresLight: true
    });

    // ===== 7. FERMENTACIÓN (Simplificada) =====
    // Glucosa → 2 Lactato + 2 ATP (o similar)
    REACTIONS.push({
        id: 'fermentation',
        name: 'Fermentation',
        nameES: 'Fermentación',
        reactants: [
            { molecule: molecularSystem.getMolecule('CH4'), coefficient: 1 } // Modelo
        ],
        products: [
            { molecule: molecularSystem.getMolecule('CO2'), coefficient: 1 }
        ],
        // Baja energía
        deltaG: -50,
        metabolicPathway: 'fermentation'
    });

    // ===== 8. HIDRÓLISIS DE ATP =====
    // ATP + H₂O → ADP + Pi (Fosfato) + H⁺
    REACTIONS.push({
        id: 'atp_hydrolysis',
        name: 'ATP Hydrolysis',
        nameES: 'Hidrólisis de ATP',
        reactants: [
            { molecule: molecularSystem.getMolecule('ATP'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 1 }
        ],
        products: [
            { molecule: molecularSystem.getMolecule('ADP'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('PO4 3-'), coefficient: 1 }
        ],
        // ΔGr° ≈ -30.5 kJ/mol
        deltaG: -30.5,
        metabolicPathway: 'energy-release'
    });

    // ===== 9. RUTA WOOD-LJUNGDAHL COMPLETA =====
    // 4H₂ + 2CO₂ + CoA → Acetil-CoA + 2H₂O
    REACTIONS.push({
        id: 'wood_ljungdahl_full',
        name: 'Wood-Ljungdahl (Full)',
        nameES: 'Ruta Wood-Ljungdahl (Completa)',
        reactants: [
            { molecule: molecularSystem.getMolecule('H2'), coefficient: 4 },
            { molecule: molecularSystem.getMolecule('CO2'), coefficient: 2 }
        ],
        products: [
            { molecule: molecularSystem.getMolecule('Acetyl-CoA'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 2 }
        ],
        metabolicPathway: 'carbon-fixation'
    });

    // ===== 10. REDOX: OXIDACIÓN DE NADH =====
    // NADH -> NAD+ + H+ + 2e- (Simplificado)
    REACTIONS.push({
        id: 'nadh_oxidation',
        name: 'NADH Oxidation',
        nameES: 'Oxidación de NADH',
        reactants: [
            { molecule: molecularSystem.getMolecule('NADH'), coefficient: 1 }
        ],
        products: [
            { molecule: molecularSystem.getMolecule('NAD+'), coefficient: 1 }
        ],
        // ΔGr° ≈ -62 kJ/mol (cuando se acopla a O2 o transportadores)
        deltaG: -62,
        metabolicPathway: 'electron-transport'
    });

    // ===== 11. SÍNTESIS DE ALANINA (Simplificada) =====
    // CH4 + NH3 + CO2 -> Alanina + H2O (Modelo aproximado)
    REACTIONS.push({
        id: 'alanine_synthesis',
        name: 'Alanine Synthesis',
        nameES: 'Síntesis de Alanina',
        reactants: [
            { molecule: molecularSystem.getMolecule('CH4'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('NH3'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('CO2'), coefficient: 0.5 } // Simplificación estequiométrica
        ],
        products: [
            { molecule: molecularSystem.getMolecule('C3H7NO2'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 1 }
        ],
        metabolicPathway: 'amino-acid-synthesis',
        requiresEnergy: true
    });

    // ===== 12. SÍNTESIS DE LÍPIDOS (Fosfolípidos Primitivos) =====
    // Ácido Palmítico + Glicerol + Fosfato -> Fosfolípido (Modelo)
    REACTIONS.push({
        id: 'lipid_synthesis',
        name: 'Lipid Synthesis',
        nameES: 'Síntesis de Lípidos',
        reactants: [
            { molecule: molecularSystem.getMolecule('C16H32O2'), coefficient: 2 },
            { molecule: molecularSystem.getMolecule('C3H8O3'), coefficient: 1 },
            { molecule: molecularSystem.getMolecule('PO4 3-'), coefficient: 1 }
        ],
        products: [
            // Representamos el aumento en biomasa de membrana o un objeto "Lipid" si existiera
            { molecule: molecularSystem.getMolecule('H2O'), coefficient: 2 }
        ],
        metabolicPathway: 'membrane-synthesis',
        requiresEnergy: true
    });

    return REACTIONS;
}
