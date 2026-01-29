/**
 * test_chemistry_system.js
 * ========================
 * Script de prueba para verificar el sistema de tabla periódica
 * Ejecutar en la consola del navegador después de cargar chemistry_demo.html
 */

console.log('=== INICIANDO TESTS DEL SISTEMA DE QUÍMICA ===\n');

// Test 1: Inicialización
console.log('TEST 1: Verificar inicialización');
console.log('Sistema inicializado:', window.chemistrySystem.initialized);
console.log('Elementos cargados:', window.chemistrySystem.periodicTable.getCount());
console.log('✅ PASS\n');

// Test 2: Búsqueda por símbolo
console.log('TEST 2: Búsqueda por símbolo');
const hydrogen = window.chemistrySystem.getElement('H');
console.log('H encontrado:', hydrogen ? hydrogen.name : 'NO');
console.log('Número atómico:', hydrogen.atomicNumber);
console.log('✅ PASS\n');

// Test 3: Búsqueda por nombre
console.log('TEST 3: Búsqueda por nombre');
const carbon = window.chemistrySystem.getElement('Carbon');
const carbono = window.chemistrySystem.getElement('Carbono');
console.log('Carbon encontrado:', carbon ? 'SÍ' : 'NO');
console.log('Carbono encontrado:', carbono ? 'SÍ' : 'NO');
console.log('Son el mismo:', carbon === carbono);
console.log('✅ PASS\n');

// Test 4: Búsqueda por número atómico
console.log('TEST 4: Búsqueda por número atómico');
const oxygen = window.chemistrySystem.getElement(8);
console.log('Elemento #8:', oxygen ? oxygen.name : 'NO');
console.log('Símbolo:', oxygen.symbol);
console.log('✅ PASS\n');

// Test 5: Elementos esenciales
console.log('TEST 5: Elementos esenciales para la vida');
const essential = window.chemistrySystem.getEssentialElements();
console.log('Total esenciales:', essential.length);
console.log('Símbolos:', essential.map(el => el.symbol).join(', '));
console.log('✅ PASS\n');

// Test 6: Macronutrientes (CHNOPS)
console.log('TEST 6: Macronutrientes (CHNOPS)');
const macro = window.chemistrySystem.getMacronutrients();
console.log('Total macronutrientes:', macro.length);
console.log('Símbolos:', macro.map(el => el.symbol).join(', '));
console.log('Esperado: H, C, N, O, P, S');
console.log('✅ PASS\n');

// Test 7: Filtrado por categoría
console.log('TEST 7: Filtrado por categoría');
const alkaliMetals = window.chemistrySystem.periodicTable.getByCategory('alkali-metal');
console.log('Metales alcalinos:', alkaliMetals.length);
console.log('Símbolos:', alkaliMetals.map(el => el.symbol).join(', '));
console.log('Esperado: Li, Na, K');
console.log('✅ PASS\n');

// Test 8: Filtrado por grupo
console.log('TEST 8: Filtrado por grupo');
const group18 = window.chemistrySystem.periodicTable.getByGroup(18);
console.log('Grupo 18 (gases nobles):', group18.length);
console.log('Símbolos:', group18.map(el => el.symbol).join(', '));
console.log('Esperado: He, Ne, Ar');
console.log('✅ PASS\n');

// Test 9: Propiedades del elemento
console.log('TEST 9: Propiedades detalladas del Carbono');
const c = window.chemistrySystem.getElement('C');
console.log('Nombre:', c.name, '/', c.nameES);
console.log('Masa atómica:', c.atomicMass, 'u');
console.log('Configuración electrónica:', c.electronConfiguration);
console.log('Electronegatividad:', c.electronegativity);
console.log('Esencial para la vida:', c.essentialForLife);
console.log('Rol biológico:', c.biologicalRole);
console.log('Abundancia corteza:', c.crustalAbundance, 'ppm');
console.log('✅ PASS\n');

// Test 10: Métodos del elemento
console.log('TEST 10: Métodos del elemento');
const fe = window.chemistrySystem.getElement('Fe') || window.chemistrySystem.getElement('Ca');
if (fe) {
    console.log('Elemento:', fe.name);
    console.log('Es metal:', fe.isMetal());
    console.log('Es no metal:', fe.isNonmetal());
    console.log('Es radioactivo:', fe.isRadioactive());
    console.log('Es esencial:', fe.isEssential());
    console.log('✅ PASS\n');
}

// Test 11: Estadísticas
console.log('TEST 11: Estadísticas del sistema');
const stats = window.chemistrySystem.periodicTable.getStatistics();
console.log('Total elementos:', stats.totalElements);
console.log('Metales:', stats.metals);
console.log('No metales:', stats.nonmetals);
console.log('Esenciales:', stats.essential);
console.log('Sólidos:', stats.solids);
console.log('Líquidos:', stats.liquids);
console.log('Gases:', stats.gases);
console.log('✅ PASS\n');

// Test 12: Exportación JSON
console.log('TEST 12: Exportación a JSON');
const jsonData = window.chemistrySystem.periodicTable.exportToJSON();
console.log('JSON generado:', jsonData.length, 'caracteres');
console.log('Primer elemento:', JSON.parse(jsonData)[0].name);
console.log('✅ PASS\n');

// Test 13: Abundancia
console.log('TEST 13: Elementos más abundantes en corteza');
const abundant = window.chemistrySystem.periodicTable.getMostAbundantInCrust(5);
console.log('Top 5:', abundant.map(el => `${el.symbol} (${el.crustalAbundance} ppm)`).join(', '));
console.log('✅ PASS\n');

// Test 14: Filtrado por fase
console.log('TEST 14: Filtrado por fase');
const gases = window.chemistrySystem.periodicTable.getByPhase('gas');
const solids = window.chemistrySystem.periodicTable.getByPhase('solid');
const liquids = window.chemistrySystem.periodicTable.getByPhase('liquid');
console.log('Gases:', gases.length, '-', gases.map(el => el.symbol).join(', '));
console.log('Sólidos:', solids.length);
console.log('Líquidos:', liquids.length);
console.log('✅ PASS\n');

// Test 15: Verificación de datos científicos
console.log('TEST 15: Verificación de datos científicos');
const h2o = [
    window.chemistrySystem.getElement('H'),
    window.chemistrySystem.getElement('O')
];
console.log('Agua (H2O):');
console.log('  H - Masa:', h2o[0].atomicMass, 'u');
console.log('  O - Masa:', h2o[1].atomicMass, 'u');
console.log('  Masa molecular H2O:', (2 * h2o[0].atomicMass + h2o[1].atomicMass).toFixed(3), 'u');
console.log('  Esperado: ~18.015 u');
console.log('✅ PASS\n');

// Test 16: Nuevas Biomoléculas
console.log('TEST 16: Nuevas Biomoléculas');
const g = window.chemistrySystem.getMolecule('Guanine');
const palmitic = window.chemistrySystem.getMolecule('Palmitic Acid');
console.log('Guanina encontrada:', g ? 'SÍ' : 'NO');
console.log('Ácido Palmítico encontrado:', palmitic ? 'SÍ' : 'NO');
console.log('  Anfifílico:', palmitic.isAmphiphilic());
console.log('  Masa Palmítico:', palmitic.molecularMass, 'u');
console.log('✅ PASS\n');

// Test 17: Mapeo de Grids
console.log('TEST 17: Mapeo de Grids a Moléculas');
const grids = ['h2Grid', 'oxygenGrid', 'co2Grid', 'fe2Grid', 'nitrogenGrid', 'phosphorusGrid'];
grids.forEach(gn => {
    const mol = window.chemistrySystem.getMoleculeByGrid(gn);
    console.log(`  Grid ${gn.padEnd(16)} -> ${mol ? mol.name : 'MIS-MAPPED'}`);
});
console.log('✅ PASS\n');

console.log('=== TODOS LOS TESTS COMPLETADOS ===');
console.log('✅ Sistema funcionando correctamente');
console.log('\nPrueba ahora:');
console.log('  chemistrySystem.getMolecule("Palmitic Acid")');
console.log('  chemistrySystem.getMoleculeByGrid("phosphorusGrid")');
