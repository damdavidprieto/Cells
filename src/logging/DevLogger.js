/**
 * DEVELOPMENT LOGGER
 * ==================
 * 
 * Sistema principal de logging para modo desarrollo.
 * Acumula eventos en memoria y genera archivos JSON descargables.
 * 
 * CARACTERÍSTICAS:
 * - Filtrado por circuitos
 * - Muestreo adaptativo
 * - Límite de tamaño
 * - Descarga automática de logs
 */

class DevLogger {
    constructor() {
        // Configuración
        this.enabled = GameConstants.DEVELOPMENT_LOGGING?.enabled || false;
        this.circuits = GameConstants.DEVELOPMENT_LOGGING?.circuits || ['all'];
        this.maxLogSizeMB = GameConstants.DEVELOPMENT_LOGGING?.max_log_size_mb || 10;
        this.maxCellsLogged = GameConstants.DEVELOPMENT_LOGGING?.max_cells_logged || 50;
        this.samplingRate = GameConstants.DEVELOPMENT_LOGGING?.sampling_rate || 10;

        // Estado
        this.runId = this.generateRunId();
        this.startTime = new Date().toISOString();
        this.frameCount = 0;
        this.currentSamplingRate = this.samplingRate;

        // Acumuladores de logs
        this.metadata = null;
        this.cellLogs = new Map(); // cellId -> events[]
        this.deaths = [];
        this.reproductions = [];
        this.environmentSamples = [];

        // Control de tamaño
        this.loggedCellIds = new Set();
        this.estimatedSizeBytes = 0;
        this.maxSizeBytes = this.maxLogSizeMB * 1024 * 1024;

        console.log(`[DevLogger] Initialized: ${this.runId}`);
        console.log(`[DevLogger] Circuits: ${this.circuits.join(', ')}`);
    }

    /**
     * Genera ID único para esta ejecución
     */
    generateRunId() {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        return `run_${timestamp}`;
    }

    /**
     * Inicializa metadata con índice de reproducción
     */
    initializeMetadata() {
        const reproductionIndex = ReproductionIndexCalculator.calculate();

        this.metadata = {
            run_id: this.runId,
            start_time: this.startTime,
            reproduction_index: reproductionIndex,
            config: {
                circuits_enabled: this.circuits,
                max_log_size_mb: this.maxLogSizeMB,
                max_cells_logged: this.maxCellsLogged,
                sampling_rate: this.samplingRate
            },
            constants: this.captureRelevantConstants()
        };

        console.log(`[DevLogger] Reproduction Index: ${reproductionIndex.theoretical_index.toFixed(2)}`);
        console.log(`[DevLogger] Frames until reproduction: ${reproductionIndex.frames_until_reproduction}`);
    }

    /**
     * Captura constantes relevantes del juego
     */
    captureRelevantConstants() {
        return {
            SOD_MAINTENANCE_COST: GameConstants.SOD_MAINTENANCE_COST,
            OXYGEN_SAFE_THRESHOLD: GameConstants.OXYGEN_SAFE_THRESHOLD,
            OXIDATIVE_DAMAGE_RATE: GameConstants.OXIDATIVE_DAMAGE_RATE,
            FE2_OXIDATION_RATE: GameConstants.FE2_OXIDATION_RATE,
            INITIAL_ENERGY: GameConstants.INITIAL_ENERGY,
            INITIAL_OXYGEN: GameConstants.INITIAL_OXYGEN,
            INITIAL_PHOSPHORUS: GameConstants.INITIAL_PHOSPHORUS
        };
    }

    /**
     * Loggea estado de una célula
     */
    logCellState(entity) {
        if (!this.enabled) return;
        if (!this.shouldLogCell(entity)) return;
        if (!this.shouldSample()) return;
        if (!CircuitFilter.shouldLog('resource_consumption', this.circuits)) return;

        const event = {
            frame: this.frameCount,
            type: 'state',
            energy: parseFloat(entity.energy.toFixed(2)),
            oxygen: parseFloat(entity.oxygen.toFixed(2)),
            phosphorus: parseFloat(entity.phosphorus.toFixed(2)),
            nitrogen: parseFloat(entity.nitrogen.toFixed(2)),
            sod_protein: parseFloat(entity.sodProtein.toFixed(3)),
            oxidative_damage: parseFloat(entity.oxidativeDamage.toFixed(3)),
            position: {
                x: Math.round(entity.pos.x),
                y: Math.round(entity.pos.y)
            }
        };

        this.addCellEvent(entity.id, event);
    }

    /**
     * Loggea muerte de célula
     */
    logDeath(entity, cause) {
        if (!this.enabled) return;
        if (!CircuitFilter.shouldLog('death_event', this.circuits)) return;

        // Calcular recursos faltantes para reproducción
        const missingForReproduction = {
            energy: Math.max(0, 100 - entity.energy),
            oxygen: Math.max(0, 50 - entity.oxygen),
            phosphorus: Math.max(0, 30 - entity.phosphorus),
            nitrogen: Math.max(0, 30 - entity.nitrogen)
        };

        const deathEvent = {
            frame: this.frameCount,
            cell_id: entity.id,
            cause: cause,
            lifespan: entity.age,
            reproductions: entity.reproductionCount || 0,
            position: {
                x: Math.round(entity.pos.x),
                y: Math.round(entity.pos.y)
            },
            final_state: {
                energy: parseFloat(entity.energy.toFixed(2)),
                oxygen: parseFloat(entity.oxygen.toFixed(2)),
                phosphorus: parseFloat(entity.phosphorus.toFixed(2)),
                nitrogen: parseFloat(entity.nitrogen.toFixed(2))
            },
            missing_for_reproduction: missingForReproduction
        };

        this.deaths.push(deathEvent);

        // También añadir a log individual de célula
        if (this.cellLogs.has(entity.id)) {
            this.addCellEvent(entity.id, {
                frame: this.frameCount,
                type: 'death',
                ...deathEvent
            });
        }

        this.updateEstimatedSize(JSON.stringify(deathEvent).length);
    }

    /**
     * Loggea reproducción
     */
    logReproduction(parent, child) {
        if (!this.enabled) return;
        if (!CircuitFilter.shouldLog('reproduction_success', this.circuits)) return;

        // Comparar DNA
        const dnaChanges = this.compareDNA(parent.dna, child.dna);

        const reproductionEvent = {
            frame: this.frameCount,
            parent_id: parent.id,
            child_id: child.id,
            dna_changes: dnaChanges,
            mutations_count: Object.keys(dnaChanges).length
        };

        this.reproductions.push(reproductionEvent);

        // Añadir a log del padre
        if (this.cellLogs.has(parent.id)) {
            this.addCellEvent(parent.id, {
                frame: this.frameCount,
                type: 'reproduction',
                success: true,
                child_id: child.id,
                mutations: Object.keys(dnaChanges)
            });
        }

        this.updateEstimatedSize(JSON.stringify(reproductionEvent).length);
    }

    /**
     * Compara dos DNAs y retorna cambios
     */
    compareDNA(dnaBefore, dnaAfter) {
        const changes = {};
        const keys = ['sodEfficiency', 'mutationRate', 'metabolicEfficiency', 'dnaRepairEfficiency', 'size'];

        for (let key of keys) {
            if (dnaBefore[key] !== dnaAfter[key]) {
                changes[key] = {
                    before: parseFloat(dnaBefore[key].toFixed(3)),
                    after: parseFloat(dnaAfter[key].toFixed(3))
                };
            }
        }

        return changes;
    }

    /**
     * Añade evento a log de célula
     */
    addCellEvent(cellId, event) {
        if (!this.cellLogs.has(cellId)) {
            this.cellLogs.set(cellId, []);
        }
        this.cellLogs.get(cellId).push(event);
        this.updateEstimatedSize(JSON.stringify(event).length);
    }

    /**
     * Decide si loggear esta célula
     */
    shouldLogCell(entity) {
        // Si ya está siendo loggeada, continuar
        if (this.loggedCellIds.has(entity.id)) {
            return true;
        }

        // Si alcanzamos el límite, no loggear nuevas células
        if (this.loggedCellIds.size >= this.maxCellsLogged) {
            return false;
        }

        // Loggear primeras 10 células (baseline)
        if (entity.id < 10) {
            this.loggedCellIds.add(entity.id);
            return true;
        }

        // Loggear 1 de cada 10 células después (muestra)
        if (entity.id % 10 === 0) {
            this.loggedCellIds.add(entity.id);
            return true;
        }

        return false;
    }

    /**
     * Decide si muestrear este frame
     */
    shouldSample() {
        return this.frameCount % this.currentSamplingRate === 0;
    }

    /**
     * Actualiza tamaño estimado y ajusta muestreo
     */
    updateEstimatedSize(bytes) {
        this.estimatedSizeBytes += bytes;

        // Si nos acercamos al límite, aumentar sampling rate
        if (this.estimatedSizeBytes > this.maxSizeBytes * 0.8) {
            this.currentSamplingRate = Math.min(this.currentSamplingRate * 2, 100);
            console.warn(`[DevLogger] Approaching size limit. Increasing sampling rate to ${this.currentSamplingRate}`);
        }
    }

    /**
     * Incrementa contador de frames
     */
    incrementFrame() {
        if (!this.enabled) return;
        this.frameCount++;
    }

    /**
     * Genera resumen final
     */
    generateSummary(entities) {
        return {
            run_id: this.runId,
            total_frames: this.frameCount,
            total_cells_logged: this.loggedCellIds.size,
            total_deaths: this.deaths.length,
            total_reproductions: this.reproductions.length,
            final_population: entities.length,
            actual_reproduction_index: this.reproductions.length / Math.max(this.deaths.length, 1),
            log_size_mb: (this.estimatedSizeBytes / (1024 * 1024)).toFixed(2)
        };
    }

    /**
     * Descarga todos los logs como archivos JSON
     */
    downloadLogs(entities) {
        if (!this.enabled) return;

        console.log('[DevLogger] Generating logs for download...');

        // 1. Metadata
        this.downloadJSON(this.metadata, `${this.runId}_metadata.json`);

        // 2. Deaths
        this.downloadJSON(this.deaths, `${this.runId}_deaths.json`);

        // 3. Reproductions
        this.downloadJSON(this.reproductions, `${this.runId}_reproductions.json`);

        // 4. Summary
        const summary = this.generateSummary(entities);
        this.downloadJSON(summary, `${this.runId}_summary.json`);

        // 5. Cell logs (solo primeras 10 para no saturar descargas)
        let cellCount = 0;
        for (let [cellId, events] of this.cellLogs) {
            if (cellCount >= 10) break; // Limitar descargas
            this.downloadJSON(events, `${this.runId}_cell_${cellId}.json`);
            cellCount++;
        }

        console.log(`[DevLogger] Downloaded ${cellCount + 4} log files`);
    }

    /**
     * Descarga un objeto como archivo JSON
     */
    downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}
