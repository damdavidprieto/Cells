/**
 * DBWriter.js
 * ===========
 * Handles all write operations to the IndexedDB.
 */
class DBWriter {
    constructor(db) {
        this.db = db;
    }

    /**
     * Generic add method.
     * @param {string} storeName - Name of the object store
     * @param {Object} data - Data to store
     */
    async add(storeName, data) {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);
            request.onsuccess = () => {
                // Uncomment for verbose logging if needed
                // console.log(`[DBWriter] ✅ Wrote to ${storeName}`);
            };
            request.onerror = (e) => {
                console.error(`[DBWriter] ❌ Error writing to ${storeName}:`, e.target.error);
            };
        } catch (error) {
            console.error(`[DBWriter] Error writing to ${storeName}:`, error);
        }
    }

    /**
     * Specific method for updating a run record (e.g. end time).
     */
    async updateRun(runId, updateFn) {
        if (!this.db) return;

        const transaction = this.db.transaction([DBConfig.STORE_NAMES.RUNS], 'readwrite');
        const store = transaction.objectStore(DBConfig.STORE_NAMES.RUNS);
        const request = store.get(runId);

        request.onsuccess = () => {
            const data = request.result;
            if (data) {
                updateFn(data);
                store.put(data);
            }
        };
    }
}
