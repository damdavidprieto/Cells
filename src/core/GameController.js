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
        if (['PRODUCTION', 'DEVELOPMENT', 'SINGLE_CELL_MODE'].includes(mode)) {
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

    /**
     * Configura todos los sistemas del juego (Entorno, Entidades, logs).
     */
    async initialize() {
        // Inicializar sistemas core
        window.environment = new Environment();
        this.environment = window.environment; // Referencia local

        // Initialize Global Scenario (O2 Rise, Scarcity, etc.)
        this.environment.initializeScenario();


        this.speciesNotifier = new SpeciesNotifier();

        // DatabaseLogger (IndexedDB - no network)
        if (GameConstants.DATABASE_LOGGING.enabled && (GameConstants.EXECUTION_MODE === 'DEVELOPMENT' || GameConstants.EXECUTION_MODE === 'SINGLE_CELL_MODE')) {
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
        window.entities = [];

        // Calculate water zone boundaries (only habitable area)
        let waterStartY = this.environment.waterStartRow * this.environment.resolution;
        let waterEndY = this.environment.waterEndRow * this.environment.resolution;

        // SCIENTIFIC ACCURACY: Origin of Life likely occurred at Hydrothermal Vents
        // Spawn cells closer to the bottom (sediment) where H2 and nutrients are abundant
        let spawnZoneStart = waterEndY - (height * 0.2); // Last 20% of water column
        let spawnZoneEnd = waterEndY - 10; // Just above sediment

        // SINGLE CELL ANALYSIS MODE
        if (GameConstants.EXECUTION_MODE === 'SINGLE_CELL_MODE') {
            console.log('[GameController] Initializing SINGLE_CELL_MODE (Analysis)');

            // Spawn in deep sediment (IDEAL VENT)
            let idealX = width / 2;
            let idealY = height - 20; // Deep in sediment

            let entity = new Entity(idealX, idealY);
            entity.id = 0;
            window.lucaBaseDNA = entity.dna;
            window.entities.push(entity);

            if (this.databaseLogger) {
                this.databaseLogger.logCellEvent(0, 'birth', entity.id, {
                    position: { x: entity.pos.x, y: entity.pos.y },
                    dna: entity.dna,
                    sod: entity.sodProtein,
                    energy: entity.energy,
                    oxygen: entity.oxygen,
                    maxResources: entity.maxResources,
                    parent_id: null
                });
            }

            // Force environment to be perfect around this cell immediately
            // Force environment to be perfect around this cell immediately
            // DISABLED: User requested to match Development mode behavior
            /*
            if (GameConstants.SINGLE_CELL_MODE.FORCE_IDEAL_CONDITIONS) {
                this.environment.forceIdealConditions(idealX, idealY);
            }
            */
        }
        // STANDARD MODES
        else {
            for (let i = 0; i < 20; i++) {
                // Spawn near vents (rich energy source)
                let entity = new Entity(
                    random(width),
                    random(spawnZoneStart, spawnZoneEnd)
                );
                entity.id = i;
                entity.reproductionCount = 0;
                if (i === 0) {
                    window.lucaBaseDNA = entity.dna; // Referencia para distancias genéticas
                }
                window.entities.push(entity);

                if (this.databaseLogger) {
                    this.databaseLogger.logCellEvent(0, 'birth', entity.id, {
                        position: { x: entity.pos.x, y: entity.pos.y },
                        dna: entity.dna,
                        sod: entity.sodProtein,
                        energy: entity.energy,
                        oxygen: entity.oxygen,
                        maxResources: entity.maxResources,
                        parent_id: null
                    });
                }
            }
        }

        this.isRunning = true;
        console.log("[GameController] Simulación inicializada correctamente.");
    }
}
