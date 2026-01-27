/**
 * Controlador Principal del Juego (GameController)
 * Se encarga de coordinar el inicio de la simulación, el bucle de juego y 
 * la comunicación entre los sistemas (Entorno, Mutaciones, UI).
 */
class GameController {
    constructor() {
        this.environment = null;

        this.speciesNotifier = null;
        this.databaseLogger = null;
        this.isRunning = false;
        this.autoDownloadTimer = null; // Timer para descarga automática de logs

        // Referencias globales necesarias para p5.js
        window.environment = null;
        window.entities = [];
        window.lucaBaseDNA = null;

        // Ensure database logs are closed properly on tab close
        window.addEventListener('beforeunload', () => {
            if (this.databaseLogger) {
                this.databaseLogger.endRun();
            }
        });

        // CRITICAL: Catch runtime errors (like getDeathCause missing) and log them
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            console.error('[Global Error]', msg, error);
            if (this.databaseLogger) {
                this.databaseLogger.logCellEvent(0, 'system_error', -1, {
                    message: msg,
                    line: lineNo,
                    stack: error ? error.stack : 'no stack'
                });
            }
            return false; // Let default handler run too
        };
    }

    /**
     * Inicializa la simulación en el modo seleccionado.
     * @param {string} mode - 'PRODUCTION' o 'DEVELOPMENT'
     */
    static startGame(mode) {
        if (['PRODUCTION', 'DEVELOPMENT', 'SINGLE_CELL_MODE', 'SINGLE_VENT_MODE'].includes(mode)) {
            GameConstants.EXECUTION_MODE = mode;
            console.log(`[GameController] Iniciando juego en modo: ${mode}`);
        }

        // Instancia única (Singleton simplificado para acceso global si es necesario)
        if (!window.gameInstance) {
            window.gameInstance = new GameController();
        }

        window.gameInstance.initialize();

        // Ocultar pantalla de inicio y mostrar UI
        if (window.uiManager) {
            window.uiManager.onGameStart();
        }

        // Arrancar el bucle de p5.js
        loop();
    }

    static stopGame() {
        noLoop(); // p5.js stop
        if (window.gameInstance) {
            window.gameInstance.isRunning = false;
        }
        if (window.uiManager) {
            window.uiManager.resetUI();
        }
        console.log("[GameController] Juego detenido.");
    }

    /**
     * Called by ScenarioManager to inject specific environment config.
     */
    prepareEnvironment(envConfig) {
        console.log("%% [GameController] Preparing Environment from Scenario Config...");
        window.environment = new Environment(envConfig);
        this.environment = window.environment;
    }

    setSpawnRules(rules) {
        this.spawnRules = rules;
    }

    /**
     * Configura todos los sistemas del juego (Entorno, Entidades, logs).
     */
    async initialize() {
        // Inicializar sistemas core

        // 1. Environment Initialization
        // If ScenarioManager already prepared the environment, use it.
        // Otherwise, fallback to defaults (Legacy support or direct run).
        if (!this.environment) {
            console.log("%% [GameController] No Environment injected. Loading STANDARD Scenario.");
            ScenarioManager.loadScenario(ScenarioLibrary.STANDARD);
            // Sync reference after manager creates it
            this.environment = window.environment;
        }

        // Legacy Scenario Init Removed (Handled by ScenarioManager)

        this.speciesNotifier = new SpeciesNotifier();

        // DatabaseLogger (IndexedDB - no network)
        if (GameConstants.DATABASE_LOGGING.enabled) {
            this.databaseLogger = new DatabaseLogger();
            try {
                await this.databaseLogger.init();
                console.log('[GameController] DatabaseLogger initialized');
                window.databaseLogger = this.databaseLogger; // Acceso global para consola

                this.databaseLogger.startRun();
            } catch (err) {
                console.error('[GameController] DatabaseLogger init failed:', err);
            }
        }

        // Resetear y Crear Entidades Iniciales (LUCA)
        // Resetear y Crear Entidades Iniciales (LUCA)
        window.entities = [];

        // 3. Spawning Entities
        if (this.spawnRules) {
            this._executeSpawnRules();
        } else {
            console.warn("[GameController] No spawn rules found. Using standard random fallback.");
            this._spawnRandom(20);
        }

        this.isRunning = true;
        console.log("[GameController] Simulación inicializada correctamente.");
    }

    /**
     * Executes the spawn logic based on the active scenario rules.
     */
    _executeSpawnRules() {
        const rules = this.spawnRules;
        console.log(`[GameController] Executing Spawn Rules: ${rules.mode} (Count: ${rules.count})`);

        switch (rules.mode) {
            case 'CENTER_VENT':
                this._spawnCenterVent(rules.count);
                break;
            case 'RANDOM':
            default:
                this._spawnRandom(rules.count);
                break;
        }
    }

    _spawnCenterVent(count) {
        // Find center column
        let centerCol = Math.floor(this.environment.cols / 2);
        if (this.environment.waterStartCol !== undefined) {
            centerCol = Math.floor((this.environment.waterStartCol + this.environment.waterEndCol) / 2);
        }

        // Calculate pixel position
        let idealX = centerCol * this.environment.resolution;

        let spawnRow = this.environment.sedimentRow;
        if (this.environment.rows === 1) spawnRow = 0; // Handle single row worlds

        // Center vertically in the cell
        let idealY = spawnRow * this.environment.resolution + (this.environment.resolution / 2);

        // Spawn
        for (let i = 0; i < count; i++) {
            let entity = new Entity(idealX, idealY);
            this._registerEntity(entity, i);

            // Log specific single-cell start
            if (this.databaseLogger) {
                this.databaseLogger.logCellEvent(0, 'birth', entity.id, {
                    position: { x: entity.pos.x, y: entity.pos.y },
                    dna: entity.dna,
                    sod: entity.sodProtein,
                    energy: entity.energy,
                    oxygen: entity.oxygen,
                    mode: 'CENTER_VENT'
                });
            }
        }
    }

    _spawnRandom(count) {
        // Calculate water zone boundaries
        let waterStartY = this.environment.waterStartRow * this.environment.resolution;
        let waterEndY = this.environment.waterEndRow * this.environment.resolution;

        // Spawn closer to bottom (scientific accuracy: origin at vents)
        let spawnZoneStart = waterEndY - (height * 0.2);
        let spawnZoneEnd = waterEndY - 10;

        let minX = this.environment.waterStartCol * this.environment.resolution;
        let maxX = this.environment.waterEndCol * this.environment.resolution;

        for (let i = 0; i < count; i++) {
            let entity = new Entity(
                random(minX, maxX),
                random(spawnZoneStart, spawnZoneEnd)
            );
            this._registerEntity(entity, i);
        }
    }

    _registerEntity(entity, index) {
        entity.id = index;
        entity.reproductionCount = 0;

        if (index === 0) {
            window.lucaBaseDNA = entity.dna; // Global reference
        }

        window.entities.push(entity);

        // Standard Logging
        if (this.databaseLogger && GameConstants.DATABASE_LOGGING.log_cell_events) {
            this.databaseLogger.logCellEvent(0, 'birth', entity.id, {
                position: { x: entity.pos.x, y: entity.pos.y },
                dna: entity.dna,
                sod: entity.sodProtein,
                energy: entity.energy
            });
        }
    }
}
