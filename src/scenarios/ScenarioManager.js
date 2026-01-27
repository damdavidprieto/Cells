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
        console.log(`%% [ScenarioManager] Cargando escenario: ${scenarioDef?.name} (${scenarioDef?.id})`);

        if (!scenarioDef) {
            console.error("!! [ScenarioManager] Intento de cargar escenario NULO o INDEFINIDO.");
            return;
        }

        // 1. Fusionar Configuración Base con Overrides de Tiempo de Ejecución
        this.currentScenario = this._mergeConfig(scenarioDef, runtimeOverrides);

        // 2. Configurar el Motor de Juego (GameController)
        this._configureGameEngine(this.currentScenario);

        // 3. Configurar la Interfaz (UIManager)
        this._configureUI(this.currentScenario);

        // 4. Configurar Logs (DatabaseLogger)
        this._configureLogging(this.currentScenario);

        // 5. Configurar Ecosistema (GameConstants)
        this._configureEcosystem(this.currentScenario);

        // 6. Configurar Física (GameConstants)
        this._configurePhysics(this.currentScenario);

        console.log(`%% [ScenarioManager] Escenario listo. Iniciando simulación...`);
    }

    /**
     * Configura los parámetros físicos (Gravedad, Fricción).
     */
    static _configurePhysics(scenario) {
        if (!window.GameConstants || !window.GameConstants.PHYSICS) return;

        const phys = scenario.physics;
        const target = window.GameConstants.PHYSICS;

        if (phys.gravity !== null) target.GLOBAL_GRAVITY = phys.gravity;
        if (phys.viscosityWater !== null) target.VISCOSITY_WATER = phys.viscosityWater;
        if (phys.viscositySediment !== null) target.VISCOSITY_SEDIMENT = phys.viscositySediment;
        if (phys.brownianStrength !== null) target.BROWNIAN_STRENGTH = phys.brownianStrength;

        console.log("%% [ScenarioManager] Physics Parameters Updated:", target);
    }

    /**
     * Configura los parámetros de generación del ecosistema (Constantes).
     */
    static _configureEcosystem(scenario) {
        if (!window.GameConstants || !window.GameConstants.ECOSYSTEM_INIT) return;

        // 1. Resetear a Defaults (Hardcoded backup or implementation defaults)
        // Por seguridad, idealmente GameConstants tendría un metodo .reset()
        // Aquí asumimos, por simplicidad, que si es null no tocamos, si tiene valor, sobreescribimos.
        // NOTA: Para un sistema robusto, guardaríamos los defaults en una variable al inicio.

        // Vamos a asumir que "Default" es lo que está en el código estático.
        // Si queremos revertir, necesitaríamos recargar la página o tener un "Backup".
        // Para este prototipo, vamos a aplicar los cambios si existen.

        const eco = scenario.ecosystem;
        const target = window.GameConstants.ECOSYSTEM_INIT;

        if (eco.lightSurface !== null) target.LIGHT_SURFACE_INTENSITY = eco.lightSurface;
        if (eco.lightDecay !== null) target.LIGHT_DECAY_RATE = eco.lightDecay;

        if (eco.h2Vent !== null) target.H2_VENT_INTENSITY = eco.h2Vent;
        if (eco.fe2Vent !== null) target.FE2_VENT_INTENSITY = eco.fe2Vent;

        if (eco.tempSurface !== null) target.TEMP_SURFACE = eco.tempSurface;
        if (eco.tempVent !== null) target.TEMP_VENT = eco.tempVent;

        if (eco.phSurface !== null) target.PH_SURFACE = eco.phSurface;
        if (eco.phVent !== null) target.PH_VENT = eco.phVent;

        console.log("%% [ScenarioManager] Ecosystem Parameters Updated:", target);
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

        // Apply Custom Environment State (Legacy Migration)
        if (scenario.initialEnvState && window.environment) {
            console.log("%% [ScenarioManager] Applying Initial Environment State:", scenario.initialEnvState);
            this._applyInitialState(window.environment, scenario.initialEnvState);
        }

        // Configurar Spawn
        window.gameInstance.setSpawnRules(scenario.spawn);
    }

    static _applyInitialState(env, state) {
        if (state.oxygen !== undefined) {
            for (let i = 0; i < env.cols; i++) for (let j = 0; j < env.rows; j++) env.oxygenGrid[i][j] = state.oxygen;
        }
        if (state.light !== undefined) {
            for (let i = 0; i < env.cols; i++) for (let j = 0; j < env.rows; j++) env.lightGrid[i][j] = state.light;
        }
        if (state.uvRadiation !== undefined) {
            for (let i = 0; i < env.cols; i++) for (let j = 0; j < env.rows; j++) env.uvRadiationGrid[i][j] = state.uvRadiation;
        }
        if (state.temperature !== undefined) {
            for (let i = 0; i < env.cols; i++) for (let j = 0; j < env.rows; j++) env.temperatureGrid[i][j] = state.temperature;
        }

        // Multipliers
        if (state.h2Multiplier !== undefined) {
            for (let i = 0; i < env.cols; i++) for (let j = 0; j < env.rows; j++) env.h2Grid[i][j] *= state.h2Multiplier;
        }
        if (state.phosphorusMultiplier !== undefined) {
            for (let i = 0; i < env.cols; i++) for (let j = 0; j < env.rows; j++) env.phosphorusGrid[i][j] *= state.phosphorusMultiplier;
        }

        // Logic Flags (GOE)
        if (state.progressiveOxygenEnabled) {
            env.progressiveOxygenEnabled = true;
            env.maxOxygenEvent = state.maxOxygenEvent;
            env.oxygenRiseRate = state.oxygenRiseRate;
        }
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
            window.GameConstants.SCENARIO = scenario.id; // CRITICAL: Tag run for DatabaseLogger
            window.GameConstants.DATABASE_LOGGING.enabled = logConfig.enabled;
            window.GameConstants.DATABASE_LOGGING.log_frame_stats = logConfig.logEveryFrame;
            // etc.
        }
    }
    /**
     * Ciclo de actualización por frame.
     * Gestiona eventos scriptados del escenario.
     */
    static update() {
        if (!this.currentScenario || !this.currentScenario.events) return;

        // Verificar eventos programados para este frame
        // Nota: frameCount es global de p5.js
        const events = this.currentScenario.events.filter(e => e.frame === frameCount);

        for (let e of events) {
            this._executeEvent(e);
        }
    }

    /**
     * Ejecuta un evento scriptado.
     */
    static _executeEvent(event) {
        console.log(`[ScenarioManager] Evento disparado: ${event.action}`, event);

        switch (event.action) {
            case 'NOTIFY':
                if (window.uiManager && window.uiManager.speciesNotifier) {
                    window.uiManager.speciesNotifier.addNotification(event.payload, 'info');
                }
                break;
            case 'PAUSE':
                noLoop();
                break;
            case 'LOG':
                console.log(`[SCENARIO EVENT] ${event.payload}`);
                break;
            default:
                console.warn(`[ScenarioManager] Acción de evento desconocida: ${event.action}`);
        }
    }
}
