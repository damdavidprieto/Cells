const fs = require('fs');
const vm = require('vm');

function loadFile(path) {
    return fs.readFileSync(path, 'utf8');
}

const context = vm.createContext({ console: console });

try {
    // 1. Load Dependencies
    vm.runInContext(loadFile('src/scenarios/ScenarioDefinition.js'), context);
    vm.runInContext(loadFile('src/scenarios/ScenarioBuilder.js'), context);
    vm.runInContext(loadFile('src/scenarios/ScenarioLibrary.js'), context);

    // 2. Verify Scenarios
    console.log("Verifying Scenario Construction...");

    const scenarios = [
        'STANDARD',
        'LAB_SINGLE_VENT',
        'STRESS_TEST',
        'PRESSURE_OXYGEN',
        'PRESSURE_LIGHT',
        'PRESSURE_SCARCITY',
        'PRESSURE_THERMAL',
        'HYDROTHERMAL_COLONIZATION',
        'SINGLE_VENT_DEV',
        'EMPTY_GRID',
        'VENT_LABORATORY'
    ];

    scenarios.forEach(name => {
        const scenario = vm.runInContext(`ScenarioLibrary.${name}`, context);
        if (!scenario) {
            throw new Error(`Failed to load scenario: ${name}`);
        }
        console.log(`✅ ${name} loaded successfully (ID: ${scenario.id})`);

        // Basic Validations
        if (!scenario.config?.world) throw new Error(`${name} missing world config`);
        if (!scenario.config?.id) throw new Error(`${name} missing ID`);
    });

    console.log("All scenarios verified successfully.");

} catch (e) {
    console.error("❌ VERIFICATION FAILED:", e);
    process.exit(1);
}
