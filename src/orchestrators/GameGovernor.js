/**
 * GAME GOVERNOR
 * =============
 * 
 * Responsible for maintaining simulation stability and performance.
 * Acts as a "safety brake" preventing population explosions or CPU saturation.
 */
class GameGovernor {
    constructor() {
        this.fpsHistory = [];
        this.currentFPS = 60;
        this.reproductionAllowed = true;
        this.status = 'STABLE'; // STABLE, UNSTABLE, CRITICAL
        this.lastCheckFrame = 0;
    }

    update() {
        // Monitor performance
        this.fpsHistory.push(frameRate());
        if (this.fpsHistory.length > 60) this.fpsHistory.shift();

        // Run governance checks periodically
        if (frameCount % GameConstants.GOVERNANCE.FPS_CHECK_INTERVAL === 0) {
            this.runGovernanceChecks();
        }
    }

    runGovernanceChecks() {
        // Calculate average FPS
        let sum = this.fpsHistory.reduce((a, b) => a + b, 0);
        this.currentFPS = sum / this.fpsHistory.length;

        // Get limits based on mode
        let mode = GameConstants.EXECUTION_MODE;
        let popCap = (mode === 'DEVELOPMENT')
            ? GameConstants.GOVERNANCE.DEV_POPULATION_CAP
            : GameConstants.GOVERNANCE.PROD_POPULATION_CAP;

        let currentPop = window.entities ? window.entities.length : 0;

        // DECISION LOGIC
        // 1. Population Hard Cap
        if (currentPop >= popCap) {
            this.reproductionAllowed = false;
            this.status = 'POPULATION LIMIT REACHED';
            if (mode === 'DEVELOPMENT') console.warn(`[Governor] Population limit reached (${currentPop}/${popCap})`);
            return;
        }

        // 2. FPS Brake (Performance Protection)
        if (this.currentFPS < GameConstants.GOVERNANCE.MIN_FPS_THRESHOLD) {
            this.reproductionAllowed = false;
            this.status = 'LOW FPS - BRAKING';
            if (mode === 'DEVELOPMENT') console.warn(`[Governor] Low FPS (${this.currentFPS.toFixed(1)}). Stopping reproduction.`);
            return;
        }

        // If checks pass
        this.reproductionAllowed = true;
        this.status = 'STABLE';
    }

    canReproduce() {
        // Always allow if Single Cell Mode (unless explicitly capped, but usually 1)
        if (GameConstants.EXECUTION_MODE === 'SINGLE_CELL_MODE') return true;

        return this.reproductionAllowed;
    }

    getStatus() {
        return {
            status: this.status,
            fps: this.currentFPS.toFixed(1),
            allowed: this.reproductionAllowed
        };
    }
}
