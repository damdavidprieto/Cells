/**
 * VentEventSystem.js
 * ==================
 * Simulates geological events that affect hydrothermal vents.
 * Events: Earthquakes, volcanic surges, reactivations, extinctions.
 */
class VentEventSystem {
    constructor() {
        this.events = [
            {
                type: 'EARTHQUAKE',
                name: 'Terremoto Submarino',
                probability: 0.00005, // 0.005% per frame (~1 every 20,000 frames)
                cooldown: 0,
                minCooldown: 3000, // Minimum frames between earthquakes
                effect: (ventManager, env) => this._handleEarthquake(ventManager, env)
            },
            {
                type: 'VOLCANIC_SURGE',
                name: 'Erupción Volcánica',
                probability: 0.0001, // 0.01% per frame
                cooldown: 0,
                minCooldown: 2000,
                effect: (ventManager, env) => this._handleVolcanicSurge(ventManager)
            },
            {
                type: 'REACTIVATION',
                name: 'Reactivación Geológica',
                probability: 0.0002, // 0.02% per frame
                cooldown: 0,
                minCooldown: 1500,
                effect: (ventManager, env) => this._handleReactivation(ventManager)
            },
            {
                type: 'COOLING',
                name: 'Enfriamiento Gradual',
                probability: 0.0003, // 0.03% per frame
                cooldown: 0,
                minCooldown: 1000,
                effect: (ventManager, env) => this._handleCooling(ventManager)
            }
        ];

        this.eventHistory = [];
        this.maxHistoryLength = 50;
    }

    update(ventManager, env) {
        for (let event of this.events) {
            // Decrease cooldown
            if (event.cooldown > 0) {
                event.cooldown--;
                continue;
            }

            // Check if event triggers
            if (Math.random() < event.probability) {
                this._triggerEvent(event, ventManager, env);
            }
        }
    }

    _triggerEvent(event, ventManager, env) {
        console.log(`[GEOLOGICAL EVENT] ${event.name} occurred!`);

        // Execute event effect
        event.effect(ventManager, env);

        // Set cooldown
        event.cooldown = event.minCooldown;

        // Record in history
        this.eventHistory.push({
            type: event.type,
            name: event.name,
            frame: frameCount,
            timestamp: Date.now()
        });

        // Trim history
        if (this.eventHistory.length > this.maxHistoryLength) {
            this.eventHistory.shift();
        }

        // Notify UI (if available)
        if (window.uiManager && window.uiManager.showNotification) {
            window.uiManager.showNotification(`🌋 ${event.name}`, 'warning');
        }
    }

    _handleEarthquake(ventManager, env) {
        // Create a new vent at a random location
        const config = env.config || {};
        const newX = Math.floor(Math.random() * (config.cols || 100));
        const newY = config.sedimentRow ? config.sedimentRow * (config.resolution || 10) :
            Math.floor(Math.random() * (config.rows || 100)) * (config.resolution || 10);

        const ventTypes = ['ALKALINE', 'BLACK_SMOKER', 'DIFFUSE'];
        const randomType = ventTypes[Math.floor(Math.random() * ventTypes.length)];

        const newVentConfig = {
            x: newX,
            y: newY,
            type: randomType,
            width: 3 + Math.floor(Math.random() * 3),
            intensity: 0.5 + Math.random() * 0.5
        };

        ventManager.addVent(newVentConfig);
        console.log(`[EARTHQUAKE] New ${randomType} vent created at (${newX}, ${newY})`);
    }

    _handleVolcanicSurge(ventManager) {
        // Temporarily increase intensity of all active vents
        const surgeDuration = 300; // 5 seconds at 60fps
        const surgeMultiplier = 2.0;

        for (let vent of ventManager.vents) {
            if (vent.lifecycle && vent.lifecycle.isActive()) {
                const originalIntensity = vent.intensity;
                vent.intensity *= surgeMultiplier;

                // Schedule return to normal
                setTimeout(() => {
                    vent.intensity = originalIntensity;
                }, surgeDuration * (1000 / 60)); // Convert frames to ms
            }
        }

        console.log(`[VOLCANIC_SURGE] All vents surged to ${surgeMultiplier}x intensity for ${surgeDuration} frames`);
    }

    _handleReactivation(ventManager) {
        // Reactivate a random dormant vent
        const dormantVents = ventManager.vents.filter(v =>
            v.lifecycle && v.lifecycle.phase === 'DORMANT'
        );

        if (dormantVents.length > 0) {
            const randomVent = dormantVents[Math.floor(Math.random() * dormantVents.length)];
            randomVent.lifecycle.reactivate();
            console.log(`[REACTIVATION] Vent ${randomVent.id} reactivated`);
        }
    }

    _handleCooling(ventManager) {
        // Reduce intensity of a random active vent
        const activeVents = ventManager.vents.filter(v =>
            v.lifecycle && v.lifecycle.phase === 'ACTIVE'
        );

        if (activeVents.length > 0) {
            const randomVent = activeVents[Math.floor(Math.random() * activeVents.length)];
            randomVent.intensity *= 0.7;

            if (randomVent.intensity < 0.3) {
                randomVent.lifecycle.setPhase('WANING');
            }

            console.log(`[COOLING] Vent ${randomVent.id} cooled to ${(randomVent.intensity * 100).toFixed(0)}%`);
        }
    }

    getRecentEvents(count = 10) {
        return this.eventHistory.slice(-count);
    }
}
