// Variables Globales (Mantenidas para compatibilidad con p5.js y depuración)
let uiManager;
let deathCountThisFrame = 0;

/**
 * SETUP: Configuración inicial de p5.js
 * Solo crea el canvas, instancia los gestores y pausa la ejecución.
 */
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');

    // Instanciar Gestor de UI (Monta los componentes)
    uiManager = new UIManager();
    window.uiManager = uiManager; // Acceso global para GameController

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

    // 0. Gobernanza y Configuración de Velocidad
    if (game.governor) {
        game.governor.update();
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
            e.eat(env);
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
                child.id = ents.length;
                child.reproductionCount = 0;
                e.reproductionCount = (e.reproductionCount || 0) + 1;
                ents.push(child);

                // Logging (Only log if strictly needed, heavy for hyper-speed)
                if (game.databaseLogger) handleLogging(game, e, child, frameCount);
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
                PhosphorusRegeneration.reciclarFosforo(env, e.pos.x, e.pos.y, e.phosphorus);
                ents.splice(i, 1);
                deathCountThisFrame++;
            }
        }
    }

    // 4. Renderizado (UNA VEZ POR FRAME)
    env.show(); // Dibujar Entorno

    for (let e of ents) {
        e.show(); // Dibujar Células
    }

    // 5. Actualizar Trackers y UI

    game.speciesNotifier.checkForNewSpecies(ents);
    game.speciesNotifier.update();

    // Conservación (evitar extinción total en demo)
    // DISABLED: Para análisis científico real. Si mueren, deben extinguirse.
    /*
    if (ents.length < 5 && random(1) < 0.05) {
        // Safe spawn in lower water column (near food)
        let waterBottom = game.environment.waterEndRow * game.environment.resolution;
        let spawnY = random(waterBottom - 200, waterBottom - 20);
        ents.push(new Entity(random(width), spawnY));
    }
    */

    // Calcular estadísticas para UI
    const stats = calculateStats(env, ents);
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
    if (GameConstants.EXECUTION_MODE === 'SINGLE_CELL_MODE' && game.databaseLogger && ents.length > 0) {
        if (GameConstants.SINGLE_CELL_MODE.LOG_EVERY_FRAME) {
            game.databaseLogger.logSingleCellAnalysis(frameCount, ents[0]);
        }
    }

    // 6. Renderizar Overlays (Monitors, Notifications)
    renderOverlays(game);
}

// --- Funciones Auxiliares para limpiar draw() ---

function getDeathCause(e) {
    if (e.energy <= 0) return 'energy_depletion';
    if (e.oxygen <= 0) return 'oxygen_depletion';
    if (e.phosphorus <= 0) return 'phosphorus_depletion';
    if (e.nitrogen <= 0) return 'nitrogen_depletion';
    return e.deathCause || 'unknown';
}

function calculateStats(env, ents) {
    let totalLight = 0, totalOx = 0, totalNi = 0, totalPh = 0;

    // Calculate Environment Totals (Grid Iteration)
    let maxOx = 0;
    for (let x = 0; x < env.cols; x++) {
        for (let y = 0; y < env.rows; y++) {
            totalLight += env.lightGrid[x][y];
            totalOx += env.oxygenGrid[x][y];
            if (env.oxygenGrid[x][y] > maxOx) maxOx = env.oxygenGrid[x][y];
            totalNi += env.nitrogenGrid[x][y];
            totalPh += env.phosphorusGrid[x][y];
        }
    }

    // Calculate Averages for UI readability
    let totalCells = env.cols * env.rows;
    let avgLight = totalLight / totalCells;
    let avgOx = totalOx / totalCells;
    let avgNi = totalNi / totalCells;
    let avgPh = totalPh / totalCells;



    let metaCounts = { luca: 0, fermentation: 0, chemosynthesis: 0 };
    let speciesSet = new Set();

    // Evolutionary Health Metrics
    let totalSOD = 0;
    let totalRepair = 0;
    let totalStructuralDamage = 0;
    let totalOxidativeDamage = 0;
    let totalUVDamage = 0;

    // Forensic Counts (Victims per frame)
    let oxidativeVictims = 0;
    let uvVictims = 0;

    for (let e of ents) {
        metaCounts[e.dna.metabolismType]++;
        speciesSet.add(e.dna.metabolismType);

        totalSOD += e.dna.sodEfficiency || 0;
        totalRepair += e.dna.dnaRepairEfficiency || 0;
        totalStructuralDamage += e.structuralDamage || 0;

        let oxDmg = e.oxidativeDamage || 0;
        totalOxidativeDamage += oxDmg;
        if (oxDmg > 0) oxidativeVictims++;

        let uvDmg = e.uvDamageFrame || 0;
        totalUVDamage += uvDmg;
        if (uvDmg > 0) uvVictims++;
    }

    let popSize = ents.length > 0 ? ents.length : 1; // Avoid division by zero

    return {
        entityCount: ents.length,
        speciesCount: speciesSet.size,
        lucaCount: metaCounts.luca,
        fermentationCount: metaCounts.fermentation,
        chemosynthesisCount: metaCounts.chemosynthesis,
        totalOxygen: avgOx,  // Returning AVERAGE for UI display (0-100 scale)
        maxOxygen: maxOx,    // FORENSIC: Peak O2 level
        totalNitrogen: avgNi,
        totalPhosphorus: avgPh,

        // New Evolutionary Metrics
        avg_sod: totalSOD / popSize,
        avg_repair: totalRepair / popSize,
        avg_structural_damage: totalStructuralDamage / popSize, // Total health lost
        avg_oxidative_damage: totalOxidativeDamage / popSize,   // Damage from Oxygen (per frame)
        avg_uv_damage: totalUVDamage / popSize,                  // Damage from UV (per frame)
        // FORENSIC COUNTS
        oxidative_victims: oxidativeVictims,
        uv_victims: uvVictims
    };
}

function renderOverlays(game) {
    // 1. Species Notifier (Toasts)
    game.speciesNotifier.render();

    // 2. UI Manager Canvas Components (Cell Inspector, etc.)
    if (window.uiManager) {
        window.uiManager.render();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if (window.gameInstance) {
        window.environment = new Environment(); // Re-init grid
        window.gameInstance.environment = window.environment;
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

/**
 * Helper to safely extract death cause
 */
function getDeathCause(e) {
    if (e.deathCause) return e.deathCause;
    // Fallback if not set (should not happen with new checkDeath)
    if (e.energy <= 0) return 'energy_depletion_unknown';
    if (e.structuralDamage >= 100) return 'structural_failure_unknown';
    return 'unknown_cause';
}
