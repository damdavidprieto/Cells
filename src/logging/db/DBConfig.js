/**
 * DBConfig.js
 * ===========
 * Configuration constants for the IndexedDB logging system.
 */
class DBConfig {
    static get DB_NAME() { return 'CellsDevLogs'; }
    static get DB_VERSION() { return 6; }

    static get STORE_NAMES() {
        return {
            RUNS: 'runs',
            CELL_EVENTS: 'cell_events',
            MUTATIONS: 'mutations',
            FRAME_STATS: 'frame_stats',
            ENV_STATS: 'environment_stats',
            ANOMALIES: 'anomalies',
            VENT_ACTIVITY: 'vent_activity',
            GEOLOGICAL_EVENTS: 'geological_events',
            METABOLISM: 'metabolism_logs',
            SURVIVAL: 'survival_logs'
        };
    }
}
