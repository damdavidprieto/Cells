/**
 * BioChemistryTests.js
 * ====================
 * Suite de pruebas para la Fase 5: Bio-Maquinaria y Sinergia Ambiental.
 * Verifica cofactores, síntesis de proteínas y bonos catalíticos.
 */
class BioChemistryTests {

    // 1. Verificar carga de Elementos y Masa (1-60)
    static async testElementsLoaded() {
        const h = window.chemistrySystem.getElement('H');
        const ni = window.chemistrySystem.getElement('Ni');
        const mo = window.chemistrySystem.getElement('Mo');

        TestManager.assert(h && ni && mo, "Elementos críticos (H, Ni, Mo) deben estar cargados");
        TestManager.assert(ni.atomicNumber === 28, "Número atómico del Níquel debe ser 28");
        TestManager.assert(mo.atomicMass > 90, "La masa del Molibdeno debe ser > 90u");
    }

    // 2. Verificar Emisión de Trazas de Fumarolas
    static async testVentTraceEmissions() {
        const ventData = {
            type: VentTypes.get('BLACK_SMOKER'),
            pos: { x: 500, y: 500 },
            intensity: 1.0,
            width: 3
        };

        // Mock de VentManager para simular la lógica de detección
        const manager = new VentManager();
        manager.vents = [ventData];

        const feLevel = manager.getTraceElementLevelAt(500, 500, 'Fe');
        const cuLevel = manager.getTraceElementLevelAt(500, 500, 'Cu');
        const nothingLevel = manager.getTraceElementLevelAt(500, 500, 'Au'); // Oro no emitido

        TestManager.assert(feLevel > 1.0, "La concentración de Hierro en la base del vent debe ser alta");
        TestManager.assert(cuLevel > 0, "Debe haber trazas de Cobre");
        TestManager.assertEqual(nothingLevel, 0, "No debe haber Oro si no está en la definición");
    }

    // 3. Verificar Síntesis y Gasto de Energía
    static async testProteinSynthesis() {
        const mockEntity = {
            energy: 1000,
            dna: { metabolicEfficiency: 1.0 }
        };
        const proteome = new Proteome(mockEntity);
        const enzyme = window.chemistrySystem.getEnzyme('hydrogenase');

        const success = proteome.synthesize(enzyme);

        TestManager.assert(success, "La síntesis debe ser exitosa con energía suficiente");
        TestManager.assert(mockEntity.energy < 1000, "La energía debe haber disminuido tras la síntesis");
        TestManager.assertEqual(proteome.proteins.get('hydrogenase').count, 1, "Debe haber una hidrogenasa en el proteoma");
    }

    // 4. Verificar Bono Catalítico con Cofactores
    static async testCofactorCatalysis() {
        const mockEntity = {
            energy: 1000,
            pos: { x: 100, y: 100 },
            dna: { metabolicEfficiency: 1.0 }
        };
        const proteome = new Proteome(mockEntity);
        const enzyme = window.chemistrySystem.getEnzyme('hydrogenase'); // Requiere Ni y Fe

        // Añadir 10 hidrogenasas
        for (let i = 0; i < 10; i++) proteome.synthesize(enzyme);

        // Mock de entorno con NIQUEL
        const envWithNi = {
            getTraceElementLevel: (x, y, symbol) => (symbol === 'Ni' || symbol === 'Fe') ? 0.5 : 0
        };

        // Mock de entorno sin metales
        const envDead = {
            getTraceElementLevel: () => 0
        };

        const bonusWithNi = proteome.getCatalyticBonus('wood_ljungdahl', window.chemistrySystem, envWithNi);
        const bonusDead = proteome.getCatalyticBonus('wood_ljungdahl', window.chemistrySystem, envDead);

        TestManager.assert(bonusWithNi > bonusDead, "El bono catalítico debe ser mayor si hay cofactores disponibles");
        TestManager.assert(bonusDead >= 1.0, "El bono base debe ser al menos 1.0");
        console.log(`Bono con Metales: ${bonusWithNi.toFixed(2)} vs Sin Metales: ${bonusDead.toFixed(2)}`);
    }

    // 5. Verificar Nuevas Moléculas (Bases, Lípidos, Transportadores)
    static async testNewMolecules() {
        const guanine = window.chemistrySystem.getMolecule('Guanine');
        const palmitic = window.chemistrySystem.getMolecule('Palmitic Acid');
        const nadPlus = window.chemistrySystem.getMolecule('NAD+');
        const nadh = window.chemistrySystem.getMolecule('NADH');
        const alanine = window.chemistrySystem.getMolecule('Alanine');
        const glycerol = window.chemistrySystem.getMolecule('Glycerol');

        TestManager.assert(guanine, "La Guanina debe estar cargada");
        TestManager.assert(palmitic, "El Ácido Palmítico debe estar cargado");
        TestManager.assert(palmitic.isAmphiphilic(), "El Ácido Palmítico debe ser anfifílico");

        TestManager.assert(nadPlus && nadh, "Los transportadores redox (NAD+/NADH) deben estar cargados");
        TestManager.assert(alanine, "La Alanina debe estar cargada");
        TestManager.assert(glycerol, "El Glicerol debe estar cargado");

        // Verificación de masa (NADH tiene 2 Hidrógenos más que NAD+)
        const massDiff = nadh.molecularMass - nadPlus.molecularMass;
        TestManager.assert(Math.abs(massDiff - 2.016) < 0.1, `Diferencia de masa NAD+/NADH incorrecta: ${massDiff.toFixed(3)}`);
    }

    // 6. Verificar Mapeo de Grids
    static async testGridMapping() {
        const molN2 = window.chemistrySystem.getMoleculeByGrid('nitrogenGrid');
        const molP = window.chemistrySystem.getMoleculeByGrid('phosphorusGrid');
        const molFe = window.chemistrySystem.getMoleculeByGrid('fe2Grid');

        TestManager.assert(molN2 && molN2.formula === 'N2', "nitrogenGrid debe mapear a N2");
        TestManager.assert(molP && molP.formula === 'PO4 3-', "phosphorusGrid debe mapear a Fosfatos");
        TestManager.assert(molFe && molFe.formula === 'Fe2+', "fe2Grid debe mapear a Hierro");
    }
}

// Register suite
TestManager.register(BioChemistryTests);
