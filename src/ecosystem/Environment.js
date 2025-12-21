/**
 * ENVIRONMENT - Primordial Ocean Simulation
 * =========================================
 * 
 * Simulates the chemical and physical environment of early Earth oceans (~4.0-3.5 Ga)
 * where LUCA (Last Universal Common Ancestor) likely evolved.
 * 
 * SCIENTIFIC BASIS:
 * ----------------
 * 1. Resource Distribution (Weiss et al. 2016):
 *    - Light: Surface-concentrated (no ozone layer, direct sunlight)
 *    - Oxygen: Limited and patchy (pre-photosynthesis era)
 *    - Nitrogen: Sediment-concentrated (from decomposition, volcanic activity)
 *    - Phosphorus: Deep sediment (weathering of rocks, extremely limited)
 * 
 * 2. Hydrothermal Vent Model (Martin & Russell 2007):
 *    - LUCA likely lived near alkaline hydrothermal vents
 *    - Chemical gradients provided energy (chemiosmosis)
 *    - Sediment zones rich in reduced compounds (H₂, CH₄, NH₃)
 * 
 * 3. Environmental Stability (Koonin & Martin 2005):
 *    - Population variance indicates environmental stress
 *    - Resource distribution uniformity reflects stability
 *    - Mortality rate is key indicator of environmental harshness
 * 
 * IMPLEMENTATION:
 * --------------
 * - 4 Resource grids: Light, Oxygen, Nitrogen, Phosphorus
 * - Vertical stratification: Water (90%) + Sediment (10%)
 * - Exponential gradients (realistic diffusion)
 * - Environmental stability tracking (influences mutation rate evolution)
 * 
 * REFERENCES:
 * ----------
 * - Weiss, M. C., et al. (2016). The physiology and habitat of LUCA. Nat. Microbiol.
 * - Martin, W. & Russell, M. J. (2007). On the origin of biochemistry. Phil. Trans. R. Soc. B.
 * - Koonin, E. V. & Martin, W. (2005). On the origin of genomes and cells. Trends Genet.
 */
class Environment {
    constructor() {
        this.resolution = 60; // Larger cells for better visibility
        this.cols = ceil(width / this.resolution);
        this.rows = ceil(height / this.resolution);

        // Resource grids
        this.lightGrid = []; // Renamed from energyGrid
        this.oxygenGrid = [];
        this.nitrogenGrid = []; // Nitrogen in sediment
        this.phosphorusGrid = []; // Phosphorus - essential for reproduction
        this.uvRadiationGrid = []; // UV radiation (no ozone layer)
        this.co2Grid = []; // CO₂ - primordial atmosphere (high concentration)
        this.h2Grid = []; // H₂ - hydrogen from hydrothermal vents (LUCA metabolism)
        this.fe2Grid = []; // Fe²⁺ - ferrous iron (Archean ocean, O₂ sink)

        // Physical zones
        this.sedimentDepth = 0.10; // Bottom 10% is sediment (changed from 15%)
        this.sedimentRow = floor(this.rows * (1 - this.sedimentDepth));

        // ENVIRONMENTAL STABILITY SYSTEM
        // Tracks environmental chaos/stability to influence mutation rate evolution
        this.stabilityHistory = [];  // Track population sizes
        this.currentStability = 0.5;  // 0 = chaotic, 1 = stable
        this.stabilityUpdateCounter = 0;
        this.lastDeathCount = 0;

        this.initGrids();
    }

    initGrids() {
        // Initialize grids using modular classes
        // This replaces 80+ lines of initialization code with clean module calls
        this.lightGrid = ResourceGrids.initializeLight(this.cols, this.rows, this.resolution);
        this.oxygenGrid = ResourceGrids.initializeOxygen(this.cols, this.rows, this.resolution);
        this.nitrogenGrid = ResourceGrids.initializeNitrogen(this.cols, this.rows, this.resolution);
        this.phosphorusGrid = ResourceGrids.initializePhosphorus(this.cols, this.rows, this.resolution);

        this.co2Grid = ChemicalGrids.initializeCO2(this.cols, this.rows, this.resolution);
        this.h2Grid = ChemicalGrids.initializeH2(this.cols, this.rows, this.resolution);
        this.fe2Grid = ChemicalGrids.initializeFe2(this.cols, this.rows, this.resolution);

        this.uvRadiationGrid = PhysicalGrids.initializeUV(this.cols, this.rows, this.resolution);
    }

    update() {
        // Regenerate resources using modular classes
        // This replaces 60+ lines of regeneration code with clean module calls
        GridRegeneration.regenerateLight(this);
        GridRegeneration.regenerateNitrogen(this);
        GridRegeneration.regeneratePhosphorus(this);
        GridRegeneration.regenerateH2(this);
        GridRegeneration.regenerateOxygen(this);  // NEW - Photolysis UV
        OxygenRegeneration.oxidarHierro(this);    // NEW - Fe²⁺ oxidation (O₂ sink)
    }

    show() {
        // VERTICAL GRADIENT BACKGROUND
        for (let y = 0; y < height; y++) {
            let rowIndex = floor(y / this.resolution);
            let inter = y / height;

            let c;
            if (rowIndex >= this.sedimentRow) {
                // SEDIMENT ZONE (dark brown/purple tint)
                let sedimentInter = (y - this.sedimentRow * this.resolution) / (height - this.sedimentRow * this.resolution);
                c = lerpColor(
                    color(50, 30, 40),   // Dark purple-brown at top of sediment
                    color(25, 15, 20),   // Almost black with purple at bottom
                    sedimentInter
                );
            } else {
                // WATER ZONE (light blue to dark blue)
                c = lerpColor(
                    color(20, 60, 120),  // Top: lighter blue
                    color(5, 15, 30),    // Bottom: dark blue
                    inter
                );
            }

            stroke(c);
            line(0, y, width, y);
        }

        // SEDIMENT BOUNDARY LINE (clear delimitation)
        let sedimentY = this.sedimentRow * this.resolution;

        // Main boundary line (thick and visible)
        stroke(80, 60, 50);
        strokeWeight(3);
        line(0, sedimentY, width, sedimentY);

        // Highlight line above (subtle glow effect)
        stroke(100, 80, 70, 150);
        strokeWeight(1);
        line(0, sedimentY - 1, width, sedimentY - 1);

        // Shadow line below
        stroke(30, 20, 25, 200);
        strokeWeight(2);
        line(0, sedimentY + 3, width, sedimentY + 3);

        noStroke();

        // Light grid visualization disabled (too much visual clutter)
        // UV radiation provides similar gradient information
        /*
        // Draw LIGHT grid (YELLOW/GOLD for sunlight)
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let lightVal = this.lightGrid[i][j];
                if (lightVal > 5) {
                    let alpha = map(lightVal, 0, 100, 0, 140);
                    fill(255, 220, 80, alpha); // Golden sunlight
                    rect(i * this.resolution, j * this.resolution, this.resolution, this.resolution);
                }
            }
        }
        */

        // Draw NITROGEN grid (PURPLE/VIOLET in sediment)
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let nitrogenVal = this.nitrogenGrid[i][j];
                if (nitrogenVal > 5) {
                    let alpha = map(nitrogenVal, 0, 100, 0, 130);
                    fill(180, 80, 255, alpha); // Purple nitrogen
                    rect(i * this.resolution, j * this.resolution, this.resolution, this.resolution);
                }
            }
        }

        // Draw PHOSPHORUS grid (ORANGE/AMBER in deep sediment)
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let phosphorusVal = this.phosphorusGrid[i][j];
                if (phosphorusVal > 5) {
                    let alpha = map(phosphorusVal, 0, 80, 0, 150);
                    fill(255, 140, 60, alpha); // Orange/amber phosphorus
                    rect(i * this.resolution, j * this.resolution, this.resolution, this.resolution);
                }
            }
        }

        // Draw OXYGEN grid (CYAN/BLUE)
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let oxygenVal = this.oxygenGrid[i][j];
                if (oxygenVal > 5) {
                    let alpha = map(oxygenVal, 0, 100, 0, 80);
                    fill(80, 200, 255, alpha); // Cyan oxygen
                    rect(i * this.resolution, j * this.resolution, this.resolution, this.resolution);
                }
            }
        }
    }

    consumeLight(x, y, amount) {
        let i = floor(x / this.resolution);
        let j = floor(y / this.resolution);
        if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
            let available = this.lightGrid[i][j];
            let taken = min(available, amount);
            this.lightGrid[i][j] -= taken;
            return taken;
        }
        return 0;
    }

    consumeOxygen(x, y, amount) {
        let i = floor(x / this.resolution);
        let j = floor(y / this.resolution);
        if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
            let available = this.oxygenGrid[i][j];
            let taken = min(available, amount);
            this.oxygenGrid[i][j] -= taken;
            return taken;
        }
        return 0;
    }

    consumeNitrogen(x, y, amount) {
        let i = floor(x / this.resolution);
        let j = floor(y / this.resolution);
        if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
            let available = this.nitrogenGrid[i][j];
            let taken = min(available, amount);
            this.nitrogenGrid[i][j] -= taken;
            return taken;
        }
        return 0;
    }

    consumePhosphorus(x, y, amount) {
        let i = floor(x / this.resolution);
        let j = floor(y / this.resolution);
        if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
            let available = this.phosphorusGrid[i][j];
            let taken = min(available, amount);
            this.phosphorusGrid[i][j] -= taken;
            return taken;
        }
        return 0;
    }

    // Get UV radiation level at position
    getUVLevel(x, y) {
        let i = floor(x / this.resolution);
        let j = floor(y / this.resolution);
        if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
            return this.uvRadiationGrid[i][j];
        }
        return 0;
    }

    // Produce CO₂ (metabolic byproduct)
    produceCO2(x, y, amount) {
        let i = floor(x / this.resolution);
        let j = floor(y / this.resolution);
        if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
            this.co2Grid[i][j] += amount;
            // Cap CO₂ accumulation
            this.co2Grid[i][j] = min(this.co2Grid[i][j], GameConstants.CO2_MAX_ACCUMULATION);
        }
    }

    // Consume CO₂ (for future photosynthesis)
    consumeCO2(x, y, amount) {
        let i = floor(x / this.resolution);
        let j = floor(y / this.resolution);
        if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
            let available = this.co2Grid[i][j];
            let taken = min(available, amount);
            this.co2Grid[i][j] -= taken;
            return taken;
        }
        return 0;
    }

    // Consume H₂ (for LUCA metabolism - Wood-Ljungdahl pathway)
    consumeH2(x, y, amount) {
        let i = floor(x / this.resolution);
        let j = floor(y / this.resolution);
        if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
            let available = this.h2Grid[i][j];
            let taken = min(available, amount);
            this.h2Grid[i][j] -= taken;
            return taken;
        }
        return 0;
    }

    // Check if position is in sediment zone
    isInSediment(y) {
        let rowIndex = floor(y / this.resolution);
        return rowIndex >= this.sedimentRow;
    }

    // Get viscosity factor at position
    getViscosity(y) {
        if (this.isInSediment(y)) {
            return 0.7; // 30% slower in sediment
        }
        return 1.0;
    }

    // Legacy compatibility - keep consumeEnergy as alias
    consumeEnergy(x, y, amount) {
        return this.consumeLight(x, y, amount);
    }

    // Legacy compatibility
    consumeResource(x, y, amount) {
        return this.consumeLight(x, y, amount);
    }

    // ===== ENVIRONMENTAL STABILITY SYSTEM =====
    // Calculate environmental stability based on multiple factors
    // Returns 0 (chaotic) to 1 (stable)
    calculateEnvironmentalStability(cells, deathCount) {
        if (!GameConstants.ENVIRONMENTAL_STABILITY_ENABLED) {
            return 0.5;  // Neutral if disabled
        }

        // Factor 1: Population stability (low variance = stable)
        let populationStability = this.calculatePopulationStability(cells.length);

        // Factor 2: Resource stability (uniform distribution = stable)
        let resourceStability = this.calculateResourceStability();

        // Factor 3: Mortality stability (low death rate = stable)
        let mortalityStability = this.calculateMortalityStability(deathCount);

        // Weighted average (mortality is most important)
        let stability = (populationStability * 0.3) + (resourceStability * 0.2) + (mortalityStability * 0.5);

        return constrain(stability, 0, 1);
    }

    calculatePopulationStability(currentPopulation) {
        // Track population history
        this.stabilityHistory.push(currentPopulation);
        if (this.stabilityHistory.length > GameConstants.STABILITY_HISTORY_LENGTH) {
            this.stabilityHistory.shift();
        }

        if (this.stabilityHistory.length < 10) {
            return 0.5;  // Not enough data yet
        }

        // Calculate variance
        let mean = this.stabilityHistory.reduce((a, b) => a + b) / this.stabilityHistory.length;
        let variance = this.stabilityHistory.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / this.stabilityHistory.length;
        let stdDev = Math.sqrt(variance);

        // Coefficient of variation (normalized measure)
        let cv = mean > 0 ? stdDev / mean : 1;

        // Low CV (< 0.1) = high stability, High CV (> 0.5) = low stability
        return map(constrain(cv, 0, 0.5), 0, 0.5, 1, 0);
    }

    calculateResourceStability() {
        // Measure uniformity of resource distribution
        // Sample a few grid cells and check variance
        let samples = [];
        for (let i = 0; i < 10; i++) {
            let col = floor(random(this.cols));
            let row = floor(random(this.rows));
            let totalResource = this.lightGrid[col][row] + this.oxygenGrid[col][row] +
                this.nitrogenGrid[col][row] + this.phosphorusGrid[col][row];
            samples.push(totalResource);
        }

        let mean = samples.reduce((a, b) => a + b) / samples.length;
        let variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length;
        let stdDev = Math.sqrt(variance);
        let cv = mean > 0 ? stdDev / mean : 1;

        // Low variance = high stability
        return map(constrain(cv, 0, 1), 0, 1, 1, 0);
    }

    calculateMortalityStability(currentDeathCount) {
        // Low death rate = stable environment
        // High death rate = chaotic/stressful environment

        // Death rate as percentage of population
        let populationSize = this.stabilityHistory.length > 0 ?
            this.stabilityHistory[this.stabilityHistory.length - 1] : 100;

        let deathRate = populationSize > 0 ? currentDeathCount / populationSize : 0;

        // Low death rate (< 0.05) = high stability
        // High death rate (> 0.3) = low stability
        return map(constrain(deathRate, 0, 0.3), 0, 0.3, 1, 0);
    }
}
