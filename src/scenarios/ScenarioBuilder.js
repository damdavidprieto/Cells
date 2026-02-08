/**
 * ScenarioBuilder
 * Pattern: Builder
 * Description: Fluent API for constructing ScenarioDefinition objects.
 * Eliminates large object literals and simplifies test data generation.
 */
class ScenarioBuilder {
    constructor() {
        this.config = {
            id: 'UNKNOWN',
            name: 'Unnamed Scenario',
            description: '',
            world: {},
            spawn: {},
            ui: {},
            render: {},
            logging: {},
            events: [],
            ecosystem: {},
            physics: {},
            initialEnvState: {}
        };
    }

    withId(id) {
        this.config.id = id;
        return this;
    }

    withName(name) {
        this.config.name = name;
        return this;
    }

    withDescription(desc) {
        this.config.description = desc;
        return this;
    }

    // --- World Configuration ---
    withWorldDimensions(rows, cols, resolution = 60) {
        this.config.world.rows = rows;
        this.config.world.cols = cols;
        this.config.world.resolution = resolution;
        return this;
    }

    withStratification(atmosphereDepth, sedimentDepth) {
        this.config.world.atmosphereDepth = atmosphereDepth;
        this.config.world.sedimentDepth = sedimentDepth;
        return this;
    }

    withVents(vents) {
        this.config.world.vents = vents;
        return this;
    }

    withRestrictedArea(isRestricted) {
        this.config.world.restrictToVents = isRestricted;
        return this;
    }

    // --- Spawn Configuration ---
    withSpawn(mode, count, type = 'LUCA') {
        this.config.spawn.mode = mode;
        this.config.spawn.count = count;
        this.config.spawn.type = type;
        return this;
    }

    // --- UI Configuration ---
    withUI(uiConfig) {
        this.config.ui = { ...this.config.ui, ...uiConfig };
        return this;
    }

    withMinimalUI() {
        return this.withUI({
            showStatsPanel: false,
            showVentMonitor: false,
            showCellInspector: false,
            showChemistryInspector: false,
            showLegend: false,
            showControls: false,
            exitButton: true,
            showVentLabels: false
        });
    }

    // --- Render Configuration ---
    withRender(renderConfig) {
        this.config.render = { ...this.config.render, ...renderConfig };
        return this;
    }

    withChimneys(show) {
        this.config.render.showChimneys = show;
        return this;
    }

    withBlackScreen() {
        this.config.render.blackScreen = true;
        return this;
    }

    // --- Logging Configuration ---
    withLogging(enabled, detailLevel = 'SUMMARY') {
        this.config.logging.enabled = enabled;
        this.config.logging.detailLevel = detailLevel;
        this.config.logging.logEveryFrame = enabled;
        return this;
    }

    // --- Events & Physics ---
    addEvent(frame, action, payload) {
        this.config.events.push({ frame, action, payload });
        return this;
    }

    withPhysics(physicsConfig) {
        this.config.physics = { ...this.config.physics, ...physicsConfig };
        return this;
    }

    withEcosystem(ecosystemConfig) {
        this.config.ecosystem = { ...this.config.ecosystem, ...ecosystemConfig };
        return this;
    }

    withInitialEnvState(state) {
        this.config.initialEnvState = { ...this.config.initialEnvState, ...state };
        return this;
    }

    build() {
        return new ScenarioDefinition(this.config);
    }
}
