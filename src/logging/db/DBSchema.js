/**
 * DBSchema.js
 * ===========
 * Handles the structure and initialization of the IndexedDB object stores.
 */
class DBSchema {
    /**
     * Applies the schema to the database during onupgradeneeded.
     * @param {IDBDatabase} db 
     */
    static applySchema(db) {
        console.log('[DBSchema] Applying database schema...');
        const stores = DBConfig.STORE_NAMES;

        // Store: runs (ejecuciones)
        if (!db.objectStoreNames.contains(stores.RUNS)) {
            const runsStore = db.createObjectStore(stores.RUNS, { keyPath: 'run_id' });
            runsStore.createIndex('start_time', 'start_time', { unique: false });
            console.log(`[DBSchema] Created store: ${stores.RUNS}`);
        }

        // Store: cell_events
        if (!db.objectStoreNames.contains(stores.CELL_EVENTS)) {
            const s = db.createObjectStore(stores.CELL_EVENTS, { autoIncrement: true });
            s.createIndex('run_id', 'run_id', { unique: false });
            s.createIndex('frame', 'frame_number', { unique: false });
            s.createIndex('event_type', 'event_type', { unique: false });
            console.log(`[DBSchema] Created store: ${stores.CELL_EVENTS}`);
        }

        // Store: mutations
        if (!db.objectStoreNames.contains(stores.MUTATIONS)) {
            const s = db.createObjectStore(stores.MUTATIONS, { autoIncrement: true });
            s.createIndex('run_id', 'run_id', { unique: false });
            s.createIndex('frame', 'frame_number', { unique: false });
            console.log(`[DBSchema] Created store: ${stores.MUTATIONS}`);
        }

        // Store: frame_stats
        if (!db.objectStoreNames.contains(stores.FRAME_STATS)) {
            const s = db.createObjectStore(stores.FRAME_STATS, { autoIncrement: true });
            s.createIndex('run_id', 'run_id', { unique: false });
            s.createIndex('frame', 'frame_number', { unique: false });
            console.log(`[DBSchema] Created store: ${stores.FRAME_STATS}`);
        }

        // Store: environment_stats
        if (!db.objectStoreNames.contains(stores.ENV_STATS)) {
            const s = db.createObjectStore(stores.ENV_STATS, { autoIncrement: true });
            s.createIndex('run_id', 'run_id', { unique: false });
            s.createIndex('frame', 'frame_number', { unique: false });
            console.log(`[DBSchema] Created store: ${stores.ENV_STATS}`);
        }

        // Store: anomalies
        if (!db.objectStoreNames.contains(stores.ANOMALIES)) {
            const s = db.createObjectStore(stores.ANOMALIES, { autoIncrement: true });
            s.createIndex('run_id', 'run_id', { unique: false });
            s.createIndex('frame', 'frame_number', { unique: false });
            s.createIndex('severity', 'severity', { unique: false });
            console.log(`[DBSchema] Created store: ${stores.ANOMALIES}`);
        }

        // Store: vent_activity
        if (!db.objectStoreNames.contains(stores.VENT_ACTIVITY)) {
            const s = db.createObjectStore(stores.VENT_ACTIVITY, { autoIncrement: true });
            s.createIndex('run_id', 'run_id', { unique: false });
            s.createIndex('frame', 'frame_number', { unique: false });
            s.createIndex('vent_id', 'ventId', { unique: false });
            console.log(`[DBSchema] Created store: ${stores.VENT_ACTIVITY}`);
        }

        // Store: geological_events
        if (!db.objectStoreNames.contains(stores.GEOLOGICAL_EVENTS)) {
            const s = db.createObjectStore(stores.GEOLOGICAL_EVENTS, { autoIncrement: true });
            s.createIndex('run_id', 'run_id', { unique: false });
            s.createIndex('frame', 'frame_number', { unique: false });
            s.createIndex('event_type', 'eventType', { unique: false });
            console.log(`[DBSchema] Created store: ${stores.GEOLOGICAL_EVENTS}`);
        }
    }
}
