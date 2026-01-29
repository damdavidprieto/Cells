/**
 * enzymes.js
 * ==========
 * Biblioteca de enzimas clave para el metabolismo celular.
 * Vincula reacciones químicas con requerimientos de cofactores metálicos.
 */

function createEnzymes(periodicTable) {
    const ENZYMES = [];

    // ===== 1. HIDROGENASA (Ferredoxina-Hidrogenasa) =====
    // Cataliza: Oxidación de H2
    ENZYMES.push({
        id: 'hydrogenase',
        name: 'Hydrogenase',
        nameES: 'Hidrogenasa',
        targetReactionId: 'wood_ljungdahl_full', // En LUCA
        aminoAcidCount: 450,
        baseSynthesisCost: 25,
        efficiency: 3.5,
        cofactors: ['Fe', 'Ni', 'S'], // Clústeres [FeNi]
        biologicalRole: 'Oxidation of molecular hydrogen for energy',
        metabolicPathway: 'wood-ljungdahl',
        cpkColor: '#FF4500'
    });

    // ===== 2. NITROGENASA =====
    // Cataliza: Fijación de Nitrógeno (N2 -> NH3)
    ENZYMES.push({
        id: 'nitrogenase',
        name: 'Nitrogenase',
        nameES: 'Nitrogenasa',
        targetReactionId: 'nitrification', // Simplificación
        aminoAcidCount: 1200, // Complejo grande
        baseSynthesisCost: 80, // Muy costosa de fabricar
        efficiency: 2.0,
        cofactors: ['Mo', 'Fe', 'S'], // Cofactor FeMoco
        biologicalRole: 'Converting atmospheric nitrogen into ammonia',
        metabolicPathway: 'nitrogen-fixation',
        cpkColor: '#4169E1'
    });

    // ===== 3. ATP SINTETASA =====
    // Cataliza: ADP + Pi -> ATP (Usa gradiente de protones)
    ENZYMES.push({
        id: 'atp_synthase',
        name: 'ATP Synthase',
        nameES: 'ATP Sintetasa',
        targetReactionId: 'atp_hydrolysis', // Reversible
        aminoAcidCount: 3500, // Maquinaria rotatoria masiva
        baseSynthesisCost: 150,
        efficiency: 10.0,
        cofactors: ['Mg'], // Requiere Mg2+ para estabilizar el ATP
        biologicalRole: 'The universal motor of cellular energy production',
        metabolicPathway: 'bioenergetics',
        cpkColor: '#FFD700'
    });

    // ===== 4. RUBISCO =====
    // Cataliza: Fijación de CO2 en fotosíntesis
    ENZYMES.push({
        id: 'rubisco',
        name: 'RuBisCO',
        nameES: 'RuBisCO',
        targetReactionId: 'oxigenic_photosynthesis',
        aminoAcidCount: 500,
        baseSynthesisCost: 40,
        efficiency: 1.2, // Notoriamente lenta e ineficiente
        cofactors: ['Mg'],
        biologicalRole: 'Primary carbon fixation in photosynthesis',
        metabolicPathway: 'calvin-cycle',
        cpkColor: '#228B22'
    });

    // ===== 5. CITOCROMO C OXIDASA =====
    // Cataliza: Paso final de la respiración aeróbica
    ENZYMES.push({
        id: 'cytochrome_oxidase',
        name: 'Cytochrome c Oxidase',
        nameES: 'Citocromo c Oxidasa',
        targetReactionId: 'aerobic_respiration',
        aminoAcidCount: 800,
        baseSynthesisCost: 60,
        efficiency: 8.0,
        cofactors: ['Fe', 'Cu'], // Requiere Hierro y Cobre
        biologicalRole: 'Last enzyme in the respiratory electron transport chain',
        metabolicPathway: 'cellular-respiration',
        cpkColor: '#D2691E'
    });

    return ENZYMES;
}
