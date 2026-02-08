const fs = require('fs');
const vm = require('vm');

function loadFile(path) {
    return fs.readFileSync(path, 'utf8');
}

const context = vm.createContext({ console: console });

try {
    vm.runInContext(loadFile('src/scenarios/ScenarioDefinition.js'), context);
    vm.runInContext(loadFile('src/scenarios/ScenarioBuilder.js'), context);
    vm.runInContext(loadFile('src/scenarios/ScenarioLibrary.js'), context);

    const lab = vm.runInContext('ScenarioLibrary.LAB_SINGLE_VENT', context);
    console.log(`LAB_SINGLE_VENT:`);
    console.log(`- Rows: ${lab.world.rows}`);
    console.log(`- SedimentDepth: ${lab.world.sedimentDepth}`);

    // Test logic:
    // Rows = 1. SedimentDepth = 0.
    // SedimentRow = floor(1 * (1 - 0)) = 1.
    // Since rows=1, max valid index is 0.
    // VentFactory y = sedimentRow * res = 1 * 60 = 60.
    // Is y=60 valid?
    // Drawing at y=60 (bottom edge). Draws upward (negative Y).
    // rect(x, 60-10, w, 10) -> rect(x, 50, w, 10).
    // Valid.

    if (lab.world.sedimentDepth !== 0) throw new Error("SedimentDepth should be 0");
    if (lab.world.rows !== 1) throw new Error("Rows should be 1");

    console.log("✅ Verification successful.");

} catch (e) {
    console.error("❌ " + e.message);
}
