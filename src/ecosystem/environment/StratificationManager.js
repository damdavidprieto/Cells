/**
 * Component: StratificationManager
 * Manages vertical and horizontal boundaries of the simulation.
 */
class StratificationManager {
    constructor(config, rows, cols) {
        this.config = config;
        this.rows = rows;
        this.cols = cols;

        // Vertical Zones (Defaults)
        this.atmosphereDepth = 0.15;
        this.sedimentDepth = 0.10;

        this.calculateBoundaries();
    }

    calculateBoundaries() {
        // 1. Vertical Zones (Atmosphere / Water / Sediment)
        this.atmosphereRow = floor(this.rows * this.atmosphereDepth);
        this.sedimentRow = floor(this.rows * (1 - this.sedimentDepth));

        this.waterStartRow = this.atmosphereRow;
        this.waterEndRow = this.sedimentRow;

        // 2. Horizontal Zones (Full width by default)
        this.waterStartCol = 0;
        this.waterEndCol = this.cols;

        // 3. Restriction Logic (Single Vent Mode)
        if (this.config.restrictToVents) {
            this.applyRestrictedBoundaries();
        }
    }

    applyRestrictedBoundaries() {
        // Floating mode: No visual/physical atmosphere/sediment collision
        this.atmosphereRow = -1;
        this.sedimentRow = this.rows; // Virtual sediment at bottom
        this.waterStartRow = 0;
        this.waterEndRow = this.rows;

        if (this.config.vents && this.config.vents.length > 0) {
            let vWidth = this.config.vents[0].width || 1;
            let centerCol = floor(this.cols / 2);
            let halfWidth = floor(vWidth / 2);

            this.waterStartCol = max(0, centerCol - halfWidth);
            this.waterEndCol = min(this.cols, centerCol + halfWidth + 1);
        }
    }

    isInWater(col, row) {
        return row >= this.waterStartRow &&
            row < this.waterEndRow &&
            col >= this.waterStartCol &&
            col < this.waterEndCol;
    }

    isInSediment(row) {
        if (this.config.restrictToVents) return false;
        return row >= this.sedimentRow;
    }

    isInAtmosphere(row) {
        if (this.config.restrictToVents) return false;
        return row < this.atmosphereRow;
    }

    getViscosity(row) {
        if (this.isInSediment(row)) return GameConstants.PHYSICS.VISCOSITY_SEDIMENT;
        return GameConstants.PHYSICS.VISCOSITY_WATER;
    }
}
