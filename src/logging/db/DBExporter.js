/**
 * DBExporter.js
 * =============
 * Handles exporting logs to JSON format.
 */
class DBExporter {
    constructor(db, runId) {
        this.db = db;
        this.runId = runId;
    }

    async getData(storeName) {
        if (!this.db) return [];
        return new Promise((resolve, reject) => {
            try {
                const transaction = this.db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const index = store.index('run_id');
                const request = index.getAll(this.runId);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (e) {
                // If store doesn't exist or DB closed
                resolve([]);
            }
        });
    }

    async export() {
        const stores = DBConfig.STORE_NAMES;

        const [events, mutations, stats, envStats, anomalies, ventActivity, geoEvents] = await Promise.all([
            this.getData(stores.CELL_EVENTS),
            this.getData(stores.MUTATIONS),
            this.getData(stores.FRAME_STATS),
            this.getData(stores.ENV_STATS),
            this.getData(stores.ANOMALIES),
            this.getData(stores.VENT_ACTIVITY),
            this.getData(stores.GEOLOGICAL_EVENTS)
        ]);

        const exportData = {
            run_id: this.runId,
            export_time: new Date().toISOString(),
            summary: {
                total_events: events.length,
                total_mutations: mutations.length,
                total_frames: stats.length,
                total_anomalies: anomalies.length,
                total_vent_activity: ventActivity.length,
                total_geological_events: geoEvents.length
            },
            events: events,
            mutations: mutations,
            frame_stats: stats,
            environment_stats: envStats,
            anomalies: anomalies,
            vent_activity: ventActivity,
            geological_events: geoEvents
        };

        this.downloadJSON(exportData);
    }

    downloadJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        let filenamePrefix = 'cells_log';
        if (GameConstants.EXECUTION_MODE === 'SINGLE_CELL_MODE') filenamePrefix = 'cells_single';

        a.download = `${filenamePrefix}_${this.runId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
