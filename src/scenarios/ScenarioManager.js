/**
 * Gestor de Escenarios (ScenarioManager)
 * ======================================
 * Nivel Superior de Control.
 * Responsable de orquestar la carga de un escenario, configurar el motor
 * y adaptar la interfaz de usuario.
 * 
 * Centraliza la lógica que antes estaba dispersa en GameController, Sketch y UIManager.
 * 
 * EJEMPLO: Escenario VENT_LABORATORY
 * -----------------------------------
 * Cuando se carga ScenarioLibrary.VENT_LABORATORY:
 * - Crea un entorno sin grid (rows=0, cols=0)
 * - Genera 2 vents: ALKALINE (x:30) y BLACK_SMOKER (x:70)
 * - CREA solo exitButton (otros componentes UI NO EXISTEN)
 * - Activa modo blackScreen (pantalla negra)
 * - No genera células (spawn.mode: 'NONE')
 */
class ScenarioManager {
    constructor() {
        // Almacena el escenario actualmente cargado
        // Para VENT_LABORATORY: { id: 'VENT_LABORATORY', world: {...}, ui: {...}, render: {...} }
        this.currentScenario = null;
    }

    /**
     * Carga y configura un escenario completo.
     * 
     * VENT_LABORATORY: Cuando se llama con ScenarioLibrary.VENT_LABORATORY
     * 1. Valida el escenario
     * 2. Configura el motor de juego (crea vents, sin grid)
     * 3. Configura UI (CREA solo exitButton, NO CREA otros componentes)
     * 4. Desactiva logging
     * 5. No configura ecosistema ni física (valores por defecto)
     * 
     * @param {ScenarioDefinition} scenarioDef - Definición del escenario
     * @param {Object} runtimeOverrides - Sobrescrituras opcionales
     */
    loadScenario(scenarioDef, runtimeOverrides = {}) {
        console.log(`%% [ScenarioManager] Cargando escenario: ${scenarioDef?.name} (${scenarioDef?.id})`);
        // VENT_LABORATORY: "Cargando escenario: Laboratorio de Vents (VENT_LABORATORY)"

        if (!scenarioDef) {
            console.error("!! [ScenarioManager] Intento de cargar escenario NULO o INDEFINIDO.");
            return;
        }

        // VENT_LABORATORY: Fusiona la definición base (sin overrides normalmente)
        this.currentScenario = this._mergeConfig(scenarioDef, runtimeOverrides);

        // VENT_LABORATORY: Crea Environment con rows=0, cols=0, vents=[ALKALINE, BLACK_SMOKER]
        this._configureGameEngine(this.currentScenario);

        // VENT_LABORATORY: CREA solo exitButton. NO CREA statsPanel, legend, inspectores.
        this._configureUI(this.currentScenario);

        // VENT_LABORATORY: Desactiva logging (enabled: false)
        this._configureLogging(this.currentScenario);

        // VENT_LABORATORY: No modifica ecosistema (valores por defecto)
        this._configureEcosystem(this.currentScenario);

        // VENT_LABORATORY: No modifica física (valores por defecto)
        this._configurePhysics(this.currentScenario);

        console.log(`%% [ScenarioManager] Escenario listo. Iniciando simulación...`);
    }

    /**
     * Configura parámetros de física global.
     * 
     * VENT_LABORATORY: No define physics, usa valores por defecto del sistema.
     */
    _configurePhysics(scenario) {
        if (!window.GameConstants || !window.GameConstants.PHYSICS) return;
        const phys = scenario.physics;
        const target = window.GameConstants.PHYSICS;
        if (phys.gravity !== null) target.GLOBAL_GRAVITY = phys.gravity;
        if (phys.viscosityWater !== null) target.VISCOSITY_WATER = phys.viscosityWater;
        if (phys.viscositySediment !== null) target.VISCOSITY_SEDIMENT = phys.viscositySediment;
        if (phys.brownianStrength !== null) target.BROWNIAN_STRENGTH = phys.brownianStrength;
    }

    /**
     * Configura parámetros del ecosistema (luz, temperatura, pH, etc.).
     * 
     * VENT_LABORATORY: No define ecosystem, usa valores por defecto.
     */
    _configureEcosystem(scenario) {
        if (!window.GameConstants || !window.GameConstants.ECOSYSTEM_INIT) return;
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
    }

    /**
     * Fusiona configuración base con sobrescrituras en tiempo de ejecución.
     * 
     * VENT_LABORATORY: 
     * - Si rows/cols no están en overrides, los calcula automáticamente
     * - rows = Math.ceil(height / resolution)
     * - cols = Math.ceil(width / resolution)
     */
    _mergeConfig(base, overrides) {
        let config = new ScenarioDefinition(base);

        if (overrides.world) {
            // Si se proporcionan overrides, usarlos
            if (overrides.world.rows !== undefined) config.world.rows = overrides.world.rows;
            if (overrides.world.cols !== undefined) config.world.cols = overrides.world.cols;
            if (overrides.world.vents) config.world.vents = overrides.world.vents;
        }

        // CENTRALIZACIÓN: Calcular dimensiones automáticamente si son 0
        // Validar que p5.js esté inicializado antes de usar width/height
        if (config.world.rows === 0) {
            if (typeof height !== 'undefined' && !isNaN(height) && height > 0) {
                config.world.rows = Math.ceil(height / config.world.resolution);
                console.log(`[ScenarioManager] Auto-calculated rows: ${config.world.rows}`);
            } else {
                config.world.rows = 10;
                console.warn(`[ScenarioManager] height not ready, using fallback rows: 10`);
            }
        }
        if (config.world.cols === 0) {
            if (typeof width !== 'undefined' && !isNaN(width) && width > 0) {
                config.world.cols = Math.ceil(width / config.world.resolution);
                console.log(`[ScenarioManager] Auto-calculated cols: ${config.world.cols}`);
            } else {
                config.world.cols = 10;
                console.warn(`[ScenarioManager] width not ready, using fallback cols: 10`);
            }
        }

        return config;
    }

    /**
     * Configura el motor de juego: Environment, vents, spawn rules.
     * 
     * VENT_LABORATORY: 
     * - Crea Environment con rows y cols calculados dinámicamente
     * - Los valores base (0, 0) se sobrescriben con runtimeOverrides
     * - runtimeOverrides.world.rows = Math.ceil(height / resolution)
     * - runtimeOverrides.world.cols = Math.ceil(width / resolution)
     * - resolution: 50
     * - atmosphereDepth: 0.0 (océano profundo)
     * - sedimentDepth: 0.2 (20% sedimento)
     * - vents: [
     *     { type: 'ALKALINE', x: 30, width: 3, intensity: 1.2 },
     *     { type: 'BLACK_SMOKER', x: 70, width: 2, intensity: 1.5 }
     *   ]
     * - renderConfig: { blackScreen: true } ⭐ CLAVE para pantalla negra
     * - spawn: { mode: 'NONE', count: 0 } → No genera células
     */
    _configureGameEngine(scenario) {
        if (!window.gameInstance) return;

        // VENT_LABORATORY: Configuración del entorno (con overrides aplicados)
        let envConfig = {
            resolution: scenario.world.resolution,      // 50
            rows: scenario.world.rows,                  // Calculado dinámicamente
            cols: scenario.world.cols,                  // Calculado dinámicamente
            atmosphereDepth: scenario.world.atmosphereDepth,  // 0.0
            sedimentDepth: scenario.world.sedimentDepth,      // 0.2
            restrictToVents: scenario.world.restrictToVents,  // false
            vents: scenario.world.vents,                // ⭐ Array con 2 vents
            renderConfig: scenario.render               // ⭐ { blackScreen: true }
        };

        // VENT_LABORATORY: Crea el Environment y los vents
        window.gameInstance.prepareEnvironment(envConfig);

        // VENT_LABORATORY: No tiene initialEnvState, se salta
        if (scenario.initialEnvState && window.environment) {
            this._applyInitialState(window.environment, scenario.initialEnvState);
        }

        // VENT_LABORATORY: Configura spawn rules (mode: 'NONE', count: 0)
        window.gameInstance.setSpawnRules(scenario.spawn);
    }

    /**
     * Aplica estado inicial al entorno (oxígeno, luz, temperatura, etc.).
     * 
     * VENT_LABORATORY: No define initialEnvState, este método no se ejecuta.
     */
    _applyInitialState(env, state) {
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
        if (state.h2Multiplier !== undefined) {
            for (let i = 0; i < env.cols; i++) for (let j = 0; j < env.rows; j++) env.h2Grid[i][j] *= state.h2Multiplier;
        }
        if (state.phosphorusMultiplier !== undefined) {
            for (let i = 0; i < env.cols; i++) for (let j = 0; j < env.rows; j++) env.phosphorusGrid[i][j] *= state.phosphorusMultiplier;
        }
        if (state.progressiveOxygenEnabled) {
            env.progressiveOxygenEnabled = true;
            env.maxOxygenEvent = state.maxOxygenEvent;
            env.oxygenRiseRate = state.oxygenRiseRate;
        }
    }

    /**
     * Configura qué elementos de UI mostrar/ocultar.
     * 
     * VENT_LABORATORY:
     * - Delega a UIManager.configureForScenario()
     * - UIManager CREA solo exitButton
     * - UIManager NO CREA statsPanel, legend, inspectores
     * 
     * RESULTADO: Solo existe el botón "⬅ Salir de Prueba" (rojo, arriba izquierda)
     * No hay componentes ocultos, simplemente NO EXISTEN.
     */
    _configureUI(scenario) {
        if (!window.uiManager) return;

        // Delegar configuración completa a UIManager
        // UIManager creará o destruirá componentes según scenario.ui
        window.uiManager.configureForScenario(scenario);
    }

    /**
     * Configura sistema de logging a base de datos.
     * 
     * VENT_LABORATORY:
     * - enabled: false → No registra eventos en DB
     * - logEveryFrame: false
     * - detailLevel: 'SUMMARY'
     */
    _configureLogging(scenario) {
        if (!window.gameInstance) return;
        const logConfig = scenario.logging;
        if (window.GameConstants) {
            window.GameConstants.SCENARIO = scenario.id;  // 'VENT_LABORATORY'
            window.GameConstants.DATABASE_LOGGING.enabled = logConfig.enabled;  // false
            window.GameConstants.DATABASE_LOGGING.log_frame_stats = logConfig.logEveryFrame;  // false
        }
    }

    /**
     * Ejecuta eventos scriptados del escenario en frames específicos.
     * 
     * VENT_LABORATORY: events = [] (sin eventos programados)
     */
    update() {
        if (!this.currentScenario || !this.currentScenario.events) return;
        const events = this.currentScenario.events.filter(e => e.frame === frameCount);
        for (let e of events) {
            this._executeEvent(e);
        }
    }

    /**
     * Ejecuta un evento específico (NOTIFY, PAUSE, LOG).
     * 
     * VENT_LABORATORY: No tiene eventos, este método nunca se ejecuta.
     */
    _executeEvent(event) {
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

    /**
     * Reajusta el entorno cuando se redimensiona la ventana.
     * Mantiene los parámetros del escenario actual.
     * 
     * VENT_LABORATORY: Si se redimensiona la ventana, recalcula cols basándose
     * en el nuevo ancho, pero mantiene rows=0 y todos los demás parámetros.
     */
    resizeEnvironment() {
        if (!this.currentScenario || !window.gameInstance) return;

        console.log("%% [ScenarioManager] Adaptando entorno al nuevo tamaño de ventana...");

        // VENT_LABORATORY: Recalcula configuración manteniendo escenario
        let envConfig = {
            resolution: this.currentScenario.world.resolution,  // 50
            rows: this.currentScenario.world.rows,              // 0
            cols: Math.ceil(width / this.currentScenario.world.resolution),  // Dinámico
            atmosphereDepth: this.currentScenario.world.atmosphereDepth,  // 0.0
            sedimentDepth: this.currentScenario.world.sedimentDepth,      // 0.2
            restrictToVents: this.currentScenario.world.restrictToVents,  // false
            vents: this.currentScenario.world.vents,            // Mantiene vents
            renderConfig: this.currentScenario.render           // { blackScreen: true }
        };

        window.gameInstance.prepareEnvironment(envConfig);

        // Re-apply initial state if needed (or just let it be clean)
        if (this.currentScenario.initialEnvState && window.environment) {
            this._applyInitialState(window.environment, this.currentScenario.initialEnvState);
        }
    }
}
