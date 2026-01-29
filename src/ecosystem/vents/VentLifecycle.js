/**
 * VentLifecycle.js
 * ================
 * Manages the lifecycle phases of a hydrothermal vent.
 * Vents can be ACTIVE, DORMANT, WANING, or EXTINCT.
 */
class VentLifecycle {
    constructor(config = {}) {
        this.phase = config.defaultPhase || 'ACTIVE';
        this.age = 0;
        this.maxAge = config.maxAge || Infinity;

        // Activity cycle (optional)
        this.activityCycle = config.activityCycle || null;
        // Example: { active: 1000, dormant: 500, total: 1500 }

        // Phase-specific multipliers
        this.phaseMultipliers = {
            ACTIVE: 1.0,
            WANING: 0.5,
            DORMANT: 0.0,
            EXTINCT: 0.0
        };
    }

    update() {
        this.age++;

        // Handle activity cycles
        if (this.activityCycle) {
            this._updateCycle();
        }

        // Handle aging
        if (this.age > this.maxAge * 0.9 && this.phase === 'ACTIVE') {
            this.phase = 'WANING';
        }

        if (this.age >= this.maxAge) {
            this.phase = 'EXTINCT';
        }
    }

    _updateCycle() {
        if (!this.activityCycle) return;

        const cyclePosition = this.age % this.activityCycle.total;

        if (cyclePosition < this.activityCycle.active) {
            if (this.phase === 'DORMANT') {
                this.phase = 'ACTIVE';
                console.log('[VentLifecycle] Vent reactivated');
            }
        } else {
            if (this.phase === 'ACTIVE') {
                this.phase = 'DORMANT';
                console.log('[VentLifecycle] Vent entered dormancy');
            }
        }
    }

    isActive() {
        return this.phase === 'ACTIVE' || this.phase === 'WANING';
    }

    getIntensityMultiplier() {
        return this.phaseMultipliers[this.phase] || 0;
    }

    getState() {
        return {
            phase: this.phase,
            age: this.age,
            maxAge: this.maxAge,
            progress: this.age / this.maxAge,
            isActive: this.isActive()
        };
    }

    setPhase(newPhase) {
        if (this.phaseMultipliers.hasOwnProperty(newPhase)) {
            this.phase = newPhase;
            console.log(`[VentLifecycle] Phase changed to ${newPhase}`);
        }
    }

    reactivate() {
        if (this.phase === 'DORMANT' || this.phase === 'WANING') {
            this.phase = 'ACTIVE';
            this.age = 0; // Reset age
            console.log('[VentLifecycle] Vent forcefully reactivated');
        }
    }

    extinguish() {
        this.phase = 'EXTINCT';
        console.log('[VentLifecycle] Vent extinguished');
    }
}
