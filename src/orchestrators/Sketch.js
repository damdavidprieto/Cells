// Variables Globales (Mantenidas para compatibilidad con p5.js y depuración)
let uiManager;
let deathCountThisFrame = 0;

/**
 * SETUP: Configuración inicial de p5.js
 * Solo crea el canvas, instancia los gestores y pausa la ejecución.
 */
// Global Hook for Testing
window.runTests = () => {
    if (window.TestManager) {
        if (window.VentTests) TestManager.register(VentTests);
        if (window.ScenarioTests) TestManager.register(ScenarioTests);
        if (window.PhysicsTests) TestManager.register(PhysicsTests);
        if (window.DatabaseTests) TestManager.register(DatabaseTests);
        if (window.GridTests) TestManager.register(GridTests);
        TestManager.runAll();
    } else {
        console.error("TestManager not loaded.");
    }
};

function setup() {
    // Initialize random seeds for true randomness across runs
    // Use timestamp to ensure different behavior each time
    const seed = Date.now();
    randomSeed(seed);
    noiseSeed(seed);
    console.log(`[Random] Initialized with seed: ${seed}`);

    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');

    // Instanciar Gestor de UI (Monta los componentes)
    uiManager = new UIManager();
    window.uiManager = uiManager; // Acceso global para GameController

    // INSTANCE-BASED SYSTEMS (Normalization)
    window.gridUtils = new GridUtils();
    window.dnaFactory = new DNAFactory();
    window.dnaMutator = new DNAMutator();
    window.geneticDistance = new GeneticDistance();

    window.metabolicCosts = new MetabolicCosts();
    window.membraneSystem = new MembraneSystem();
    window.oxygenTolerance = new OxygenTolerance();
    window.thermalStress = new ThermalStress();
    window.colorSystem = new ColorSystem();
    window.reproductionSystem = new ReproductionSystem();
    window.chemotaxisSystem = new ChemotaxisSystem();
    window.flagellaCosts = new FlagellaCosts();
    window.resourceConsumption = new ResourceConsumption();
    window.anomalyDetector = new AnomalyDetector();
    window.cellRenderer = new CellRenderer();

    // CHEMISTRY SYSTEM (Global)
    if (window.chemistrySystem) {
        window.chemistrySystem.initialize();
    } else {
        console.error("ChemistrySystem not loaded.");
    }

    // SCENARIO SYSTEM (Instance Required)
    window.scenarioManager = new ScenarioManager();

    // VIEWPORT SYSTEM (Camera)
    window.viewport = {
        x: 0, y: 0,
        zoom: 1.0,
        targetX: 0, targetY: 0,
        isHoming: true,
        lerpFactor: 0.1
    };

    // PAUSAR hasta que el usuario elija modo en la pantalla de configuración
    noLoop();
}

/**
 * DRAW: Bucle principal de renderizado (60 FPS)
 * Delega la lógica a los sistemas instanciados por GameController.
 */
function draw() {
    if (!window.gameInstance || !window.gameInstance.isRunning) return;

    const game = window.gameInstance;
    const env = game.environment;
    const ents = window.entities;

    // Check if we're in a Laboratory mode (No stats, minimal UI)
    const currentScenarioId = window.scenarioManager?.currentScenario?.id;
    const isLabMode = currentScenarioId === 'VENT_LABORATORY' || currentScenarioId === 'LAB_SINGLE_VENT';

    // In Lab modes, skip all physics and entity processing unless it's the single cell scenario
    if (!isLabMode || currentScenarioId === 'LAB_SINGLE_VENT') {
        // 0. Gobernanza y Configuración de Velocidad
        if (game.governor) {
            game.governor.update();
        }

        // 0.1 Guion de Escenario (Eventos Scriptados)
        if (window.scenarioManager) window.scenarioManager.update();

        // 0.2 Sanitizador de Anomalías (Cada 60 frames ~ 1 seg)
        if (frameCount % 60 === 0 && window.gameInstance && window.gameInstance.databaseLogger) {
            // Asegurar que AnomalyDetector existe (cargado en index)
            if (window.anomalyDetector) {
                const anomalies = window.anomalyDetector.scan(ents, env);
                if (anomalies.length > 0) {
                    console.warn(`[Sanitizer] Eliminando ${anomalies.length} anomalías.`);
                    for (let a of anomalies) {
                        window.gameInstance.databaseLogger.logAnomaly(frameCount, a.type, a.severity, a.targetId, a.details);
                    }
                }
            }
        }

        // HYPER-SPEED LOOP
        // Run physics multiple times per frame based on configuration
        const steps = GameConstants[GameConstants.EXECUTION_MODE].PHYSICS_STEPS || 1;

        for (let s = 0; s < steps; s++) {
            // 1. Física del Entorno
            deathCountThisFrame = 0;
            env.update();

            // 2. Estabilidad Ambiental (cada N frames lógicos)
            if ((frameCount * steps + s) % GameConstants.STABILITY_CALCULATION_INTERVAL === 0) {
                env.currentStability = env.calculateEnvironmentalStability(ents, deathCountThisFrame);
            }

            // 3. Procesar Entidades (FÍSICA SOLAMENTE)
            for (let i = ents.length - 1; i >= 0; i--) {
                let e = ents[i];

                // Comportamientos Físicos
                e.update(env); // Movimiento, Metabolismo

                // Colisiones
                for (let j = 0; j < ents.length; j++) {
                    if (i !== j) e.checkCollision(ents[j]);
                }

                // Reproducción
                let child = null;
                if (!game.governor || game.governor.canReproduce()) {
                    child = e.reproduce(env.currentStability);
                }

                if (child != null) {
                    // PHANTOM MITOSIS (Single Vent Mode)
                    if (GameConstants.EXECUTION_MODE === 'SINGLE_VENT_MODE' && GameConstants.SINGLE_VENT_MODE.PHANTOM_MITOSIS) {
                        // Log the "virtual" birth
                        if (game.databaseLogger) {
                            game.databaseLogger.logCellEvent(frameCount, 'phantom_birth', 'phantom_' + frameCount, {
                                parent_id: e.id,
                                dna: child.dna,
                                generation: child.dna.generation
                            });
                        }
                        // Discard child (do not add to ents)
                    }
                    // NORMAL MITOSIS
                    else {
                        child.id = ents.length;
                        child.reproductionCount = 0;
                        e.reproductionCount = (e.reproductionCount || 0) + 1;
                        ents.push(child);

                        // Logging (Only log if strictly needed, heavy for hyper-speed)
                        if (game.databaseLogger) handleLogging(game, e, child, frameCount);
                    }
                }

                // Muerte
                if (e.isDead) {
                    let cause = getDeathCause(e);
                    if (game.databaseLogger && GameConstants.DATABASE_LOGGING.log_cell_events) {
                        game.databaseLogger.logCellEvent(frameCount, 'death', e.id, {
                            cause: cause,
                            final_state: { sod: e.sodEfficiency, ox: e.oxygen } // Minimal data
                        });
                    }
                    env.recyclePhosphorus(e.pos.x, e.pos.y, e.phosphorus);
                    ents.splice(i, 1);
                    deathCountThisFrame++;
                }
            }
        }
    } else {
        // VENT_LABORATORY mode: Only update environment (vents)
        env.update();
    }

    // 4. Renderizado (UNAVEZ POR FRAME)
    background(0); // Restore Black Background

    push(); // Start Global View Transform

    try {
        // --- VIEWPORT / CAMERA LOGIC ---
        let worldWidth = env.cols * env.resolution;
        let worldHeight = env.rows * env.resolution;

        // Auto-Homing (Focus on Vent/Cell)
        if (window.viewport.isHoming) {
            const target = env.getViewportTarget();
            if (target) {
                window.viewport.targetX = target.x;
                window.viewport.targetY = target.y;
            } else {
                window.viewport.targetX = worldWidth / 2;
                window.viewport.targetY = worldHeight / 2;
            }
        }

        // Apply Smoothing
        window.viewport.x = lerp(window.viewport.x, window.viewport.targetX, window.viewport.lerpFactor);
        window.viewport.y = lerp(window.viewport.y, window.viewport.targetY, window.viewport.lerpFactor);

        // Calculate translation (Center the target in the screen)
        let tx = width / 2 - window.viewport.x;
        let ty = height / 2 - window.viewport.y;

        // Constraint: Don't show void if the world is smaller than screen
        if (worldWidth < width) tx = (width - worldWidth) / 2;
        if (worldHeight < height) ty = (height - worldHeight) / 2;

        translate(tx, ty);

        env.show(); // Dibujar Entorno (includes vents)

        // Render entities if they exist (usually only in non-lab or LAB_SINGLE_VENT)
        if (!isLabMode || currentScenarioId === 'LAB_SINGLE_VENT') {
            for (let e of ents) {
                e.show(); // Dibujar Células
            }
        }
    } catch (renderErr) {
        console.error("!! [Render Error]", renderErr);
        fill(255, 0, 0);
        textAlign(CENTER);
        textSize(20);
        text("RENDER ERROR Check Console", width / 2, height / 2);
    }

    pop(); // End Global View Transform

    // 5. Actualizar Trackers y UI - Skip in pure Laboratory/Dev modes
    if (!isLabMode) {
        try {
            game.speciesNotifier.checkForNewSpecies(ents);
            game.speciesNotifier.update();

            // Calcular estadísticas para UI
            const stats = env.stats.getStats(ents, deathCountThisFrame);
            uiManager.update(stats);

            // NEW: Log frame stats to DatabaseLogger (every N frames)
            if (game.databaseLogger && GameConstants.DATABASE_LOGGING.log_frame_stats) {
                if (frameCount % GameConstants.DATABASE_LOGGING.frame_stats_interval === 0) {
                    let totalEnergy = 0;
                    let activePopulation = 0;

                    for (let e of ents) {
                        if (!e.isDead) { // Only count living cells for realistic average
                            totalEnergy += e.energy;
                            activePopulation++;
                        }
                    }

                    const avgEnergy = activePopulation > 0 ? (totalEnergy / activePopulation) : 0;

                    game.databaseLogger.logFrameStats(frameCount, {
                        population: activePopulation,
                        deaths: deathCountThisFrame,
                        births: 0,
                        avg_energy: avgEnergy,
                        species_count: stats.speciesCount,
                        // Pass evolutionary metrics calculated above
                        avg_sod: stats.avg_sod,
                        avg_repair: stats.avg_repair,
                        avg_damage: stats.avg_structural_damage,
                        // Pass detailed damage breakdown
                        avg_structural_damage: stats.avg_structural_damage,
                        avg_oxidative_damage: stats.avg_oxidative_damage,
                        avg_uv_damage: stats.avg_uv_damage,
                        // FORENSIC METRICS
                        env_max_oxygen: stats.maxOxygen,
                        victims_oxidative: stats.oxidative_victims,
                        victims_uv: stats.uv_victims
                    });
                }
            }

            // SINGLE CELL ANALYSIS LOGGING
            // Logs detailed internal state of the specific cell every frame
            if ((GameConstants.EXECUTION_MODE === 'SINGLE_CELL_MODE' || GameConstants.EXECUTION_MODE === 'SINGLE_VENT_MODE') && game.databaseLogger && ents.length > 0) {
                if (GameConstants.SINGLE_CELL_MODE.LOG_EVERY_FRAME || (GameConstants.SINGLE_VENT_MODE && GameConstants.SINGLE_VENT_MODE.LOG_EVERY_FRAME)) {
                    game.databaseLogger.logSingleCellAnalysis(frameCount, ents[0]);
                }
            }
        } catch (uiErr) {
            console.error("!! [UI Error]", uiErr);
        }
    }

    // 6. Renderizar Overlays (Monitors, Notifications) - Skip in VENT_LABORATORY
    renderOverlays(game, ents, env);

    // ALWAYS render overlays (even if physics is skipped)
    // This ensures panels are visible in all modes
    if (!isLabMode || currentScenarioId === 'LAB_SINGLE_VENT') {
        // Already rendered above
    } else {
        // Lab mode without physics - still render overlays
        renderOverlays(game, ents, env);
    }
}

function mousePressed() {
    if (!window.uiManager || GameConstants.EXECUTION_MODE !== 'SINGLE_VENT_MODE') return;
    if (!window.environment || !window.environment.ventSystem) return;

    // Account for Viewport Translation
    let env = window.environment;
    let worldWidth = env.cols * env.resolution;
    let worldHeight = env.rows * env.resolution;

    // Viewport translation logic (inverse of draw translation)
    let tx = width / 2 - window.viewport.x;
    let ty = height / 2 - window.viewport.y;

    if (worldWidth < width) tx = (width - worldWidth) / 2;
    if (worldHeight < height) ty = (height - worldHeight) / 2;

    let mouseXWorld = mouseX - tx;
    let mouseYWorld = mouseY - ty;

    const vents = env.ventSystem.vents;
    for (let vent of vents) {
        const screenX = vent.x * env.resolution;
        const screenY = vent.y;
        const radius = (vent.width * env.resolution) / 2 + 15; // Extra padding for easier click

        const d = dist(mouseXWorld, mouseYWorld, screenX, screenY);
        if (d < radius) {
            console.log(`[Interaction] Selected Vent: ${vent.id}`);
            window.uiManager.ventControl.selectVent(vent.id);
            return; // Select first match
        }
    }
}

// --- Funciones Auxiliares para limpiar draw() ---

function getDeathCause(e) {
    if (e.energy <= 0) return 'energy_depletion';
    if (e.oxygen <= 0) return 'oxygen_depletion';
    if (e.phosphorus <= 0) return 'phosphorus_depletion';
    if (e.nitrogen <= 0) return 'nitrogen_depletion';
    return e.deathCause || 'unknown';
}


function renderOverlays(game, ents, env) {
    // 1. Species Notifier (Toasts)
    game.speciesNotifier.render();

    // VENT MONITOR PANEL (LAB Mode only)
    if (window.ventMonitor) {
        window.ventMonitor.render(env);
    }

    // UI MANAGER (Overlays, Panels, etc.)
    if (window.uiManager) {
        window.uiManager.render(ents, env);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if (window.scenarioManager && window.gameInstance) {
        window.scenarioManager.resizeEnvironment();
    }
}

function handleLogging(game, e, child, frameCount) {
    if (GameConstants.DATABASE_LOGGING.log_mutations) {
        game.databaseLogger.logMutation(frameCount, e.id, child.id, {
            parent_dna: e.dna,
            child_dna: child.dna
        });
    }
    if (GameConstants.DATABASE_LOGGING.log_cell_events) {
        game.databaseLogger.logCellEvent(frameCount, 'birth', child.id, {
            position: { x: child.pos.x, y: child.pos.y },
            dna: child.dna,
            parent_id: e.id,
            sod: child.sodProtein, // Log vital stat
            // FORENSIC DATA:
            energy: child.energy,
            oxygen: child.oxygen,
            maxResources: child.maxResources
        });
    }
}
