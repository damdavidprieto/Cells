/**
 * DatabaseLogger - Sistema de Logging con IndexedDB
 * 
 * Sistema de logging para modo desarrollo que almacena datos localmente
 * en el navegador usando IndexedDB. No requiere backend ni abre puertos de red.
 * 
 * Características:
 * - Solo activo en modo DEVELOPMENT
 * - Almacenamiento local persistente
 * - Exportación a JSON para análisis
 * - Sin vectores de ataque (sin red)
 */
class DatabaseLogger {
    constructor(runId) {
        this.runId = runId || this.generateRunId();
        this.db = null;
        this.enabled = GameConstants.EXECUTION_MODE === 'DEVELOPMENT' || GameConstants.EXECUTION_MODE === 'SINGLE_CELL_MODE';
        this.initialized = false;

        console.log(`[DatabaseLogger] Initialized with runId: ${this.runId}`);
    }

    /**
     * Genera un ID único para esta ejecución
     */
    generateRunId() {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
        return `run_${timestamp}`;
    }

    /**
     * Inicializa la base de datos IndexedDB
     */
    async init() {
        if (!this.enabled) {
            console.log('[DatabaseLogger] Disabled (not in DEVELOPMENT mode)');
            return;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open('CellsDevLogs', 1);

            request.onerror = () => {
                console.error('[DatabaseLogger] Error opening database:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.initialized = true;
                console.log('[DatabaseLogger] Database initialized successfully');

                // Registrar el inicio de esta ejecución
                this.startRun();
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log('[DatabaseLogger] Creating database schema...');

                // Store: runs (ejecuciones)
                if (!db.objectStoreNames.contains('runs')) {
                    const runsStore = db.createObjectStore('runs', { keyPath: 'run_id' });
                    runsStore.createIndex('start_time', 'start_time', { unique: false });
                    console.log('[DatabaseLogger] Created store: runs');
                }

                // Store: cell_events (eventos de células)
                if (!db.objectStoreNames.contains('cell_events')) {
                    const eventsStore = db.createObjectStore('cell_events', { autoIncrement: true });
                    eventsStore.createIndex('run_id', 'run_id', { unique: false });
                    eventsStore.createIndex('frame', 'frame_number', { unique: false });
                    eventsStore.createIndex('event_type', 'event_type', { unique: false });
                    console.log('[DatabaseLogger] Created store: cell_events');
                }

                // Store: mutations (mutaciones)
                if (!db.objectStoreNames.contains('mutations')) {
                    const mutationsStore = db.createObjectStore('mutations', { autoIncrement: true });
                    mutationsStore.createIndex('run_id', 'run_id', { unique: false });
                    mutationsStore.createIndex('frame', 'frame_number', { unique: false });
                    console.log('[DatabaseLogger] Created store: mutations');
                }

                // Store: frame_stats (estadísticas por frame)
                if (!db.objectStoreNames.contains('frame_stats')) {
                    const statsStore = db.createObjectStore('frame_stats', { autoIncrement: true });
                    statsStore.createIndex('run_id', 'run_id', { unique: false });
                    statsStore.createIndex('frame', 'frame_number', { unique: false });
                    console.log('[DatabaseLogger] Created store: frame_stats');
                }

                // Store: environment_stats (estadísticas del entorno)
                if (!db.objectStoreNames.contains('environment_stats')) {
                    const envStore = db.createObjectStore('environment_stats', { autoIncrement: true });
                    envStore.createIndex('run_id', 'run_id', { unique: false });
                    envStore.createIndex('frame', 'frame_number', { unique: false });
                    console.log('[DatabaseLogger] Created store: environment_stats');
                }
            };
        });
    }

    /**
     * Registra el inicio de una nueva ejecución
     */
    async startRun() {
        if (!this.enabled || !this.db) return;

        try {
            const transaction = this.db.transaction(['runs'], 'readwrite');
            const store = transaction.objectStore('runs');

            const runData = {
                run_id: this.runId,
                start_time: new Date().toISOString(),
                mode: GameConstants.EXECUTION_MODE,
                config: {
                    grid_size: GameConstants.GRID_SIZE,
                    initial_population: 20,
                    execution_mode: GameConstants.EXECUTION_MODE
                },
                end_time: null
            };

            const request = store.add(runData);

            request.onsuccess = () => {
                console.log('[DatabaseLogger] Run started successfully:', this.runId);
            };

            request.onerror = () => {
                console.error('[DatabaseLogger] Failed to add run record:', request.error);
            };
        } catch (error) {
            console.error('[DatabaseLogger] Error in startRun transaction:', error);
        }
    }

    /**
     * Registra un evento de célula (nacimiento, muerte, estado)
     */
    async logCellEvent(frame, eventType, cellId, data) {
        if (!this.enabled || !this.db) return;

        const transaction = this.db.transaction(['cell_events'], 'readwrite');
        const store = transaction.objectStore('cell_events');

        const eventData = {
            run_id: this.runId,
            frame_number: frame,
            event_type: eventType, // 'birth', 'death', 'state'
            cell_id: cellId,
            data: data,
            timestamp: new Date().toISOString()
        };

        store.add(eventData);
    }

    /**
     * Registra una mutación
     */
    async logMutation(frame, parentId, childId, dnaChanges) {
        if (!this.enabled || !this.db) return;

        const transaction = this.db.transaction(['mutations'], 'readwrite');
        const store = transaction.objectStore('mutations');

        const mutationData = {
            run_id: this.runId,
            frame_number: frame,
            parent_id: parentId,
            child_id: childId,
            dna_changes: dnaChanges,
            timestamp: new Date().toISOString()
        };

        store.add(mutationData);
    }

    /**
     * Registra estadísticas del frame actual
     */
    async logFrameStats(frame, stats) {
        if (!this.enabled || !this.db) return;

        const transaction = this.db.transaction(['frame_stats'], 'readwrite');
        const store = transaction.objectStore('frame_stats');

        const statsData = {
            run_id: this.runId,
            frame_number: frame,
            population: stats.population || 0,
            deaths: stats.deaths || 0,
            births: stats.births || 0,
            avg_energy: stats.avg_energy || 0,
            species_count: stats.species_count || 0,
            timestamp: new Date().toISOString()
        };

        store.add(statsData);
    }

    /**
     * Registra estadísticas del entorno (difusión, recursos)
     */
    async logEnvironmentStats(frame, stats) {
        if (!this.enabled || !this.db) return;

        const transaction = this.db.transaction(['environment_stats'], 'readwrite');
        const store = transaction.objectStore('environment_stats');

        const envData = {
            run_id: this.runId,
            frame_number: frame,
            ...stats, // Expand stats object (h2_avg, h2_max, o2_avg, etc)
            timestamp: new Date().toISOString()
        };

        store.add(envData);
    }

    /**
     * Registra análisis detallado de una única célula
     * (Solo para SINGLE_CELL_MODE)
     */
    async logSingleCellAnalysis(frame, cell) {
        if (!this.enabled || !this.db) return;

        // Use 'cell_events' store with a special event type to store detailed state
        const transaction = this.db.transaction(['cell_events'], 'readwrite');
        const store = transaction.objectStore('cell_events');

        const analysisData = {
            run_id: this.runId,
            frame_number: frame,
            event_type: 'single_cell_analysis',
            cell_id: cell.id,
            data: {
                energy: cell.energy,
                oxygen: cell.oxygen,
                nitrogen: cell.nitrogen,
                phosphorus: cell.phosphorus,
                pos: { x: cell.pos.x, y: cell.pos.y },
                vel: { x: cell.vel.x, y: cell.vel.y },
                // Add more internal state if needed
                age: cell.age,
                sod: cell.sodProtein,
                oxidativeDamage: cell.oxidativeDamage
            },
            timestamp: new Date().toISOString()
        };

        store.add(analysisData);
    }

    /**
     * Obtiene todos los eventos de esta ejecución
     */
    async getAllEvents() {
        if (!this.db) return [];

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['cell_events'], 'readonly');
            const store = transaction.objectStore('cell_events');
            const index = store.index('run_id');
            const request = index.getAll(this.runId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Obtiene todas las mutaciones de esta ejecución
     */
    async getAllMutations() {
        if (!this.db) return [];

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['mutations'], 'readonly');
            const store = transaction.objectStore('mutations');
            const index = store.index('run_id');
            const request = index.getAll(this.runId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Obtiene todas las estadísticas del entorno
     */
    async getAllEnvironmentStats() {
        if (!this.db) return [];

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['environment_stats'], 'readonly');
            const store = transaction.objectStore('environment_stats');
            const index = store.index('run_id');
            const request = index.getAll(this.runId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Obtiene todas las estadísticas de esta ejecución
     */
    async getAllStats() {
        if (!this.db) return [];

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['frame_stats'], 'readonly');
            const store = transaction.objectStore('frame_stats');
            const index = store.index('run_id');
            const request = index.getAll(this.runId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Exporta todos los datos de esta ejecución a JSON
     */
    async exportToJSON() {
        if (!this.db) {
            console.warn('[DatabaseLogger] Cannot export: database not initialized');
            return;
        }

        console.log('[DatabaseLogger] Exporting data to JSON...');

        const [events, mutations, stats, envStats] = await Promise.all([
            this.getAllEvents(),
            this.getAllMutations(),
            this.getAllStats(),
            this.getAllEnvironmentStats()
        ]);

        const exportData = {
            run_id: this.runId,
            export_time: new Date().toISOString(),
            summary: {
                total_events: events.length,
                total_mutations: mutations.length,
                total_frames: stats.length
            },
            events: events,
            mutations: mutations,
            frame_stats: stats,
            environment_stats: envStats
        };

        // Crear y descargar archivo JSON
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cells_dev_${this.runId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`[DatabaseLogger] Exported ${events.length} events, ${mutations.length} mutations, ${stats.length} frame stats`);
    }

    /**
     * Finaliza la ejecución actual
     */
    async endRun() {
        if (!this.enabled || !this.db) return;

        const transaction = this.db.transaction(['runs'], 'readwrite');
        const store = transaction.objectStore('runs');
        const request = store.get(this.runId);

        request.onsuccess = () => {
            const runData = request.result;
            if (runData) {
                runData.end_time = new Date().toISOString();
                store.put(runData);
                console.log('[DatabaseLogger] Run ended:', this.runId);
            }
        };
    }

    /**
     * Lista todas las ejecuciones almacenadas
     */
    static async listAllRuns() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('CellsDevLogs', 1);

            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['runs'], 'readonly');
                const store = transaction.objectStore('runs');
                const getAllRequest = store.getAll();

                getAllRequest.onsuccess = () => {
                    resolve(getAllRequest.result);
                    db.close();
                };
                getAllRequest.onerror = () => reject(getAllRequest.error);
            };

            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Limpia todas las bases de datos (útil para desarrollo)
     */
    static async clearAllData() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase('CellsDevLogs');
            request.onsuccess = () => {
                console.log('[DatabaseLogger] All data cleared');
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }
}
