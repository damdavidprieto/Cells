/**
 * VentActivityLogger.js
 * =====================
 * Logs vent activity to IndexedDB for scientific analysis.
 * Tracks chemical output, lifecycle changes, and population correlations.
 */
class VentActivityLogger {
    constructor(databaseManager) {
        this.db = databaseManager;
        this.enabled = GameConstants.DATABASE_LOGGING?.enabled || false;
        this.logInterval = 60; // Log every 60 frames (1 second at 60fps)
    }

    /**
     * Log current state of a vent
     */
    async logVentActivity(vent, env) {
        if (!this.enabled || !this.db) return;

        const record = {
            timestamp: Date.now(),
            frame: frameCount,
            ventId: vent.id,
            type: vent.type.id,
            position: {
                x: vent.x,
                y: vent.y
            },
            context: vent.context,
            intensity: vent.intensity,
            lifecycle: vent.lifecycle ? {
                phase: vent.lifecycle.phase,
                age: vent.lifecycle.age,
                progress: vent.lifecycle.age / vent.lifecycle.maxAge
            } : null,
            output: {
                h2: vent.getCurrentH2Output ? vent.getCurrentH2Output() : 0,
                co2: vent.getCurrentCO2Output ? vent.getCurrentCO2Output() : 0,
                fe2: vent.getCurrentFe2Output ? vent.getCurrentFe2Output() : 0,
                ch4: vent.getCurrentCH4Output ? vent.getCurrentCH4Output() : 0,
                h2s: vent.getCurrentH2SOutput ? vent.getCurrentH2SOutput() : 0,
                nh3: vent.getCurrentNH3Output ? vent.getCurrentNH3Output() : 0,
                temperature: vent.type.temperature,
                ph: vent.type.ph || 8.1,
                redox: vent.type.redox || 0
            },
            environment: {
                nearbyPopulation: this._countNearbyEntities(vent, env),
                averageH2: this._getAverageChemical(vent, env, 'h2Grid'),
                averageCO2: this._getAverageChemical(vent, env, 'co2Grid'),
                averageCH4: this._getAverageChemical(vent, env, 'ch4Grid'),
                currentPH: env.getPH(vent.x * env.resolution, vent.y),
                currentRedox: env.getRedox(vent.x * env.resolution, vent.y)
            }
        };

        try {
            await this.db.logVentActivity(record);
        } catch (error) {
            console.error('[VentActivityLogger] Failed to log:', error);
        }
    }

    /**
     * Log a geological event
     */
    async logGeologicalEvent(event) {
        if (!this.enabled || !this.db) return;

        const record = {
            timestamp: Date.now(),
            frame: frameCount,
            eventType: event.type,
            eventName: event.name,
            details: event.details || {}
        };

        try {
            await this.db.logGeologicalEvent(record);
        } catch (error) {
            console.error('[VentActivityLogger] Failed to log event:', error);
        }
    }

    /**
     * Count entities near a vent
     */
    _countNearbyEntities(vent, env) {
        if (!window.entities || !Array.isArray(window.entities)) return 0;

        const radius = vent.width * env.resolution * 3;
        const ventScreenX = vent.x * env.resolution;
        const ventScreenY = vent.y;

        return window.entities.filter(entity => {
            const dx = entity.pos.x - ventScreenX;
            const dy = entity.pos.y - ventScreenY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < radius;
        }).length;
    }

    /**
     * Get average chemical concentration near vent
     */
    _getAverageChemical(vent, env, gridName) {
        const grid = env[gridName];
        if (!grid) return 0;

        const radius = 3;
        let sum = 0;
        let count = 0;

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const x = vent.x + dx;
                const y = Math.floor(vent.y / env.resolution) + dy;

                if (x >= 0 && x < env.cols && y >= 0 && y < env.rows) {
                    if (grid[x] && grid[x][y] !== undefined) {
                        sum += grid[x][y];
                        count++;
                    }
                }
            }
        }

        return count > 0 ? sum / count : 0;
    }
}
