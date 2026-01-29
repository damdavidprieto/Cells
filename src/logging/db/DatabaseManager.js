/**
 * DatabaseManager.js
 * ==================
 * Main entry point for the logging system.
 * Facade that orchestrates DB connection, writing, and exporting.
 * Integrates with ScenarioManager to tag runs correctly.
 */
class DatabaseManager {
    constructor() {
        this.runId = null;
        this.db = null;
        this.writer = null;
        this.enabled = true;
        this.initialized = false;
    }

    async init() {
        if (!this.enabled) return;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DBConfig.DB_NAME, DBConfig.DB_VERSION);

            request.onerror = () => {
                console.error('[DatabaseManager] Error opening DB:', request.error);
                reject(request.error);
            };

            request.onupgradeneeded = (event) => {
                DBSchema.applySchema(event.target.result);
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.writer = new DBWriter(this.db);
                this.initialized = true;
                console.log('[DatabaseManager] System initialized.');
                resolve();
            };
        });
    }

    generateRunId() {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);

        // Scenario Integration: Tag run with Scenario ID
        let scenarioTag = 'STANDARD';
        if (window.ScenarioManager && ScenarioManager.currentScenario) {
            scenarioTag = ScenarioManager.currentScenario.id;
        }

        return `run_${scenarioTag}_${timestamp}`;
    }

    async startRun() {
        if (!this.initialized) return;

        this.runId = this.generateRunId();
        console.log(`[DatabaseManager] Starting Run: ${this.runId}`);

        const runData = {
            run_id: this.runId,
            start_time: new Date().toISOString(),
            mode: GameConstants.EXECUTION_MODE,
            scenario: window.ScenarioManager?.currentScenario?.id || 'UNKNOWN',
            config: {
                grid_size: GameConstants.GRID_SIZE,
                physics: GameConstants.PHYSICS // Log current physics state
            },
            end_time: null
        };

        this.writer.add(DBConfig.STORE_NAMES.RUNS, runData);
    }

    async endRun() {
        if (!this.initialized || !this.runId) return;

        this.writer.updateRun(this.runId, (data) => {
            data.end_time = new Date().toISOString();
        });
        console.log('[DatabaseManager] Run ended.');
    }

    // ===== PROXY METHODS FOR LOGGING =====

    logCellEvent(frame, eventType, cellId, data) {
        if (!this.initialized) return;
        this.writer.add(DBConfig.STORE_NAMES.CELL_EVENTS, {
            run_id: this.runId,
            frame_number: frame,
            event_type: eventType,
            cell_id: cellId,
            data: data,
            timestamp: new Date().toISOString()
        });
    }

    logMutation(frame, parentId, childId, dnaChanges) {
        if (!this.initialized) return;
        this.writer.add(DBConfig.STORE_NAMES.MUTATIONS, {
            run_id: this.runId,
            frame_number: frame,
            parent_id: parentId,
            child_id: childId,
            dna_changes: dnaChanges,
            timestamp: new Date().toISOString()
        });
    }

    logFrameStats(frame, stats) {
        if (!this.initialized) return;
        this.writer.add(DBConfig.STORE_NAMES.FRAME_STATS, {
            run_id: this.runId,
            frame_number: frame,
            ...stats,
            timestamp: new Date().toISOString()
        });
    }

    logEnvironmentStats(frame, stats) {
        if (!this.initialized) return;
        this.writer.add(DBConfig.STORE_NAMES.ENV_STATS, {
            run_id: this.runId,
            frame_number: frame,
            ...stats,
            timestamp: new Date().toISOString()
        });
    }

    logAnomaly(frame, type, severity, targetId, details) {
        if (!this.initialized) return;
        this.writer.add(DBConfig.STORE_NAMES.ANOMALIES, {
            run_id: this.runId,
            frame_number: frame,
            type, severity, targetId, details,
            timestamp: new Date().toISOString()
        });
    }

    logVentActivity(data) {
        if (!this.initialized) return;
        this.writer.add(DBConfig.STORE_NAMES.VENT_ACTIVITY, {
            run_id: this.runId,
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    logSingleCellAnalysis(frame, cell) {
        if (!this.initialized || !cell) return;
        this.writer.add(DBConfig.STORE_NAMES.CELL_EVENTS, {
            run_id: this.runId,
            frame_number: frame,
            event_type: 'single_cell_analysis',
            cell_id: cell.id,
            data: {
                energy: cell.energy,
                pos: { x: cell.pos.x, y: cell.pos.y },
                metabolism: cell.dna?.metabolismType,
                structuralDamage: cell.structuralDamage,
                efficiency: cell.dna?.metabolicEfficiency
            },
            timestamp: new Date().toISOString()
        });
    }

    logGeologicalEvent(data) {
        if (!this.initialized) return;
        this.writer.add(DBConfig.STORE_NAMES.GEOLOGICAL_EVENTS, {
            run_id: this.runId,
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    // ===== EXPORT =====

    async exportToJSON() {
        if (!this.initialized) return;
        const exporter = new DBExporter(this.db, this.runId);
        await exporter.export();
    }
}
