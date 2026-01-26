/**
 * Gestor de Escenarios (ScenarioManager)
 * ======================================
 * Nivel Superior de Control.
 * Responsable de orquestar la carga de un escenario, configurar el motor
 * y adaptar la interfaz de usuario.
 * 
 * Centraliza la lógica que antes estaba dispersa en GameController, Sketch y UIManager.
 */
class ScenarioManager {
    static currentScenario = null;

    /**
     * Carga e inicia un escenario específico.
     * @param {ScenarioDefinition} scenarioDef - La definición del escenario a cargar.
     * @param {Object} runtimeOverrides - Parámetros dinámicos (ej. sliders del menú) que sobreescriben la definición base.
     */
    static loadScenario(scenarioDef, runtimeOverrides = {}) {
        console.log(`%% [ScenarioManager] Cargando escenario: ${scenarioDef.name} (${scenarioDef.id})`);

        // 1. Fusionar Configuración Base con Overrides de Tiempo de Ejecución
        this.currentScenario = this._mergeConfig(scenarioDef, runtimeOverrides);

        // 2. Configurar el Motor de Juego (GameController)
        this._configureGameEngine(this.currentScenario);

        // 3. Configurar la Interfaz (UIManager)
        this._configureUI(this.currentScenario);

        // 4. Configurar Logs (DatabaseLogger)
        this._configureLogging(this.currentScenario);

        console.log(`%% [ScenarioManager] Escenario listo. Iniciando simulación...`);
    }

    /**
     * Fusiona la configuración estática con las opciones del usuario.
     */
    static _mergeConfig(base, overrides) {
        // Clonar para no mutar el preset original
        // Nota: StructuredClone es moderno, usaremos una copia simple o librerias si fuera complejo.
        // Aquí asumimos una copia superficial inteligente para este prototipo.
        let config = new ScenarioDefinition(base);

        // Aplicar Overrides específicos (ej. Altura del mapa desde el slider)
        if (overrides.world) {
            if (overrides.world.rows) config.world.rows = overrides.world.rows;
            if (overrides.world.cols) config.world.cols = overrides.world.cols;
            if (overrides.world.vents) {
                // Si el override trae vents (con parámetros de flux/width), los usamos
                config.world.vents = overrides.world.vents;
            }
        }

        return config;
    }

    /**
     * Prepara el GameController y el Environment.
     */
    static _configureGameEngine(scenario) {
        if (!window.gameInstance) {
            console.error("!! [ScenarioManager] GameController no instanciado.");
            return;
        }

        // Traducir ScenarioDef a WorldConfig (formato legado de Environment.js)
        let envConfig = {
            resolution: scenario.world.resolution,
            rows: scenario.world.rows, // 0 = Auto
            cols: scenario.world.cols, // 0 = Auto
            atmosphereDepth: scenario.world.atmosphereDepth,
            sedimentDepth: scenario.world.sedimentDepth,
            restrictToVents: scenario.world.restrictToVents,
            vents: scenario.world.vents,

            // Pasar flags de renderizado al Environment si es necesario
            renderConfig: scenario.render
        };

        // Inyectar en el GameController global
        // GameController internamente creará el 'new Environment(config)'
        window.gameInstance.prepareEnvironment(envConfig);

        // Configurar Spawn
        window.gameInstance.setSpawnRules(scenario.spawn);
    }

    /**
     * Adapta la UI (Paneles visibles/invisibles).
     */
    static _configureUI(scenario) {
        if (!window.uiManager) return;

        const ui = scenario.ui;

        // Stats Panel
        ui.showStatsPanel ? window.uiManager.statsPanel.show() : window.uiManager.statsPanel.hide();

        // Vent Inspector (Nuevo Monitor)
        if (window.uiManager.ventInspector) {
            ui.showVentMonitor ? window.uiManager.ventInspector.enable() : window.uiManager.ventInspector.disable();
            // Nota: Necesitaremos añadir enable()/disable() o show()/hide() en VentInspector
        }

        // Cell Inspector
        if (window.uiManager.cellInspector) {
            // Podríamos querer mostrarlo siempre o solo en debug
            // Por ahora asumimos que sigue la config
            // ui.showCellInspector ? ...
        }

        // Legend
        ui.showLegend ? window.uiManager.legend.show() : window.uiManager.legend.hide();
    }

    /**
     * Configura el sistema de logs.
     */
    static _configureLogging(scenario) {
        if (!window.gameInstance) return;

        // Configurar flags globales o del logger
        const logConfig = scenario.logging;

        // Podemos guardar esto en GameConstants o configurarlo directamente en el logger
        if (window.GameConstants) {
            window.GameConstants.DATABASE_LOGGING.enabled = logConfig.enabled;
            window.GameConstants.DATABASE_LOGGING.log_frame_stats = logConfig.logEveryFrame;
            // etc.
        }
    }
}
