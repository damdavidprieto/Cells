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
        this.temperatureGrid = []; // Temperature - thermal gradients (50-80°C)

        // Physical zones (3-layer system)
        // ATMOSPHERE (top 10%): Gas phase, cells cannot live here
        this.atmosphereDepth = 0.10;
        this.atmosphereRow = floor(this.rows * this.atmosphereDepth);

        // WATER COLUMN (middle 80%): Habitable zone for cells
        this.waterStartRow = this.atmosphereRow;

        // SEDIMENT (bottom 10%): Hydrothermal vents, cells cannot spawn here
        this.sedimentDepth = 0.10;
        this.sedimentRow = floor(this.rows * (1 - this.sedimentDepth));
        this.waterEndRow = this.sedimentRow;

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
        this.temperatureGrid = PhysicalGrids.initializeTemperature(this.cols, this.rows, this.resolution);
    }



    applyScenario(col, row) {
        const scenario = GameConstants.SCENARIO || 'STANDARD';

        // Base Ideal Conditions (STANDARD)
        // High H2 for LUCA, decent resources
        this.h2Grid[col][row] = GameConstants.H2_GRID_MAX; // Max Energy
        this.co2Grid[col][row] = GameConstants.CO2_MAX_ACCUMULATION; // Max Carbon
        this.phosphorusGrid[col][row] = 100; // Abundant
        this.nitrogenGrid[col][row] = 100; // Abundant

        switch (scenario) {
            case 'PRESSURE_OXYGEN':
                // THE GREAT OXIDATION EVENT (Simulated)
                // Start: O2 = 5 (Safe/Anaerobic-friendly) everywhere
                // End: O2 = 35 (Highly Toxic) everywhere
                // Rate: Rise over ~10 minutes (36,000 frames @ 60fps) to allow evolution

                // 1. Initialize Safe Baseline
                for (let i = 0; i < this.cols; i++) {
                    for (let j = 0; j < this.rows; j++) {
                        this.oxygenGrid[i][j] = 5.0;
                    }
                }

                // 2. Enable Progressive Rise Flag
                this.progressiveOxygenEnabled = true;
                this.oxygenRiseRate = 0.0005; // +1.0 O2 every ~2000 frames (33 secs)
                this.maxOxygenEvent = 40.0;   // Cap at extreme toxicity

                console.log("⚠️ Applied PRESSURE_OXYGEN: Starting Great Oxidation Event (Progressive Rise).");
                break;

            case 'PRESSURE_LIGHT':
                // High UV/Light, move cell to surface?
                // The cell is spawned in deep sediment. We must bring Light TO the sediment or simulate a transparent ocean.
                // Let's make the whole ocean transparent for this test.
                for (let i = 0; i < this.cols; i++) {
                    for (let j = 0; j < this.rows; j++) {
                        this.lightGrid[i][j] = 100; // Full blast
                        this.uvRadiationGrid[i][j] = 80; // High UV
                    }
                }
                console.log("⚠️ Applied PRESSURE_LIGHT: Global high visibility and UV.");
                break;

            case 'PRESSURE_SCARCITY':
                // Reduce all resources to bare minimum
                this.h2Grid[col][row] = 20; // Barely enough (Cost is ~0.05/frame)
                this.phosphorusGrid[col][row] = 50; // Just below threshold? No, just scarce
                // Global reduction
                for (let i = 0; i < this.cols; i++) {
                    for (let j = 0; j < this.rows; j++) {
                        this.h2Grid[i][j] *= 0.1;
                        this.phosphorusGrid[i][j] *= 0.1;
                    }
                }
                console.log("⚠️ Applied PRESSURE_SCARCITY: Famine conditions.");
                break;

            case 'PRESSURE_THERMAL':
                // High Temp
                for (let i = 0; i < this.cols; i++) {
                    for (let j = 0; j < this.rows; j++) {
                        this.temperatureGrid[i][j] = 90; // Hot!
                    }
                }
                console.log("⚠️ Applied PRESSURE_THERMAL: Global warming.");
                break;
        }
    }

    update() {
        // Regenerate resources using modular classes
        // This replaces 60+ lines of regeneration code with clean module calls
        // 1. Regenerate Resources
        // Apply Progressive Oxygen Event (if enabled)
        if (this.progressiveOxygenEnabled) {
            this.applyProgressiveOxygenRise();
        }

        GridRegeneration.regenerateLight(this);
        GridRegeneration.regenerateNitrogen(this);
        GridRegeneration.regeneratePhosphorus(this);
        GridRegeneration.regenerateH2(this);
        GridRegeneration.regenerateOxygen(this);  // Photolysis UV
        OxygenRegeneration.oxidarHierro(this);    // Fe²⁺ oxidation (O₂ sink)

        // NEW: Diffusion from infinite reservoirs (atmosphere & ocean)
        if (typeof ReservoirSystem !== 'undefined') {
            ReservoirSystem.diffuseFromAtmosphere(this);
            ReservoirSystem.diffuseFromOcean(this);
            ReservoirSystem.enhanceVentFlux(this);
        } else {
            console.warn('[Environment] ReservoirSystem not loaded!');
        }

        // NEW: Internal Diffusion System (simulates fluid dynamics)
        if (typeof DiffusionSystem !== 'undefined') {
            DiffusionSystem.update(this);
        } else {
            console.warn('[Environment] DiffusionSystem not loaded!');
        }

        // FORCE IDEAL CONDITIONS (Single Cell Mode only)
        // DISABLED: User requested to match Development mode behavior (no artificial survival)
        // (Logic removed)

        // LOGGING: Environmental Stats (Diffusion verification)
        if (typeof frameCount !== 'undefined' &&
            GameConstants.DATABASE_LOGGING.enabled &&
            GameConstants.DATABASE_LOGGING.log_env_stats &&
            frameCount % GameConstants.DATABASE_LOGGING.env_stats_interval === 0) {

            this.calculateAndLogStats();
        }
    }

    show() {
        noStroke();

        // Render Grid Cells
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                let px = x * this.resolution;
                let py = y * this.resolution;

                let r, g, b;

                // 1. Base Color by Zone (Atmosphere, Water, Sediment)
                if (y < this.atmosphereRow) {
                    // ATMOSPHERE: Pale Blue / White
                    r = 200; g = 230; b = 255;
                } else if (y >= this.sedimentRow) {
                    // SEDIMENT: Dark Red/Brown (Volcanic)
                    r = 50; g = 20; b = 10;
                } else {
                    // WATER: Deep Blue Gradient
                    let depth = (y - this.atmosphereRow) / (this.sedimentRow - this.atmosphereRow);
                    r = 10; g = 20 + depth * 20; b = 60 + depth * 40;
                }

                // 2. Resource Overlay (Additive Blending)

                // H2 (Vents) - Green Glow
                // Tuned down to avoid artifacting/saturation in Single Cell Mode
                let h2Val = this.h2Grid[x][y];
                if (h2Val > 10) {
                    let intensity = map(h2Val, 10, 250, 0, 120, true);
                    r += 0; g += intensity; b += 0;
                }

                // CO2 - Purple Haze
                let co2Val = this.co2Grid[x][y];
                if (co2Val > 50) {
                    let intensity = map(co2Val, 50, 200, 0, 80);
                    r += intensity; g += 0; b += intensity;
                }

                // O2 - Cyan Brightness
                let o2Val = this.oxygenGrid[x][y];
                if (o2Val > 5) {
                    let intensity = map(o2Val, 5, 50, 0, 100);
                    r += 0; g += intensity; b += intensity;
                }

                fill(constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255));
                rect(px, py, this.resolution, this.resolution);
            }
        }

        // Draw Zone Boundaries
        let atmosphereY = this.atmosphereRow * this.resolution;
        stroke(255, 255, 255, 100);
        strokeWeight(2);
        line(0, atmosphereY, width, atmosphereY);

        let sedimentY = this.sedimentRow * this.resolution;
        stroke(200, 50, 50, 150);
        strokeWeight(2);
        line(0, sedimentY, width, sedimentY);

        noStroke();
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

    // Get temperature at position (°C)
    // Returns temperature gradient: 50-60°C surface, 70-80°C vents
    getTemperature(x, y) {
        let i = floor(x / this.resolution);
        let j = floor(y / this.resolution);
        if (i >= 0 && i < this.cols && j >= 0 && j < this.rows) {
            return this.temperatureGrid[i][j];
        }
        return 60; // Default mid-range temperature
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

    // Check if position is valid for cells (water zone only)
    // Cells cannot live in atmosphere (gas) or sediment (solid)
    isValidCellPosition(y) {
        let rowIndex = floor(y / this.resolution);
        return rowIndex >= this.waterStartRow && rowIndex < this.waterEndRow;
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

    // ===== STATS CALCULATION FOR LOGGING =====
    calculateAndLogStats() {
        if (!window.databaseLogger) return;

        let h2Stats = this.getGridStats(this.h2Grid);
        let co2Stats = this.getGridStats(this.co2Grid);
        let o2Stats = this.getGridStats(this.oxygenGrid);
        let tempStats = this.getGridStats(this.temperatureGrid);

        // Specific check for Vents (bottom of map) vs Surface (top) for H2
        // H2 should be high at bottom (vents) and low at top
        let ventH2 = this.getAverageAtRow(this.h2Grid, this.rows - 2);
        let surfaceH2 = this.getAverageAtRow(this.h2Grid, 2);

        window.databaseLogger.logEnvironmentStats(frameCount, {
            h2_avg: h2Stats.avg,
            h2_max: h2Stats.max,
            h2_min: h2Stats.min,
            h2_vent: ventH2,
            h2_surface: surfaceH2,

            o2_avg: o2Stats.avg,
            o2_max: o2Stats.max,

            co2_avg: co2Stats.avg,
            temp_avg: tempStats.avg
        });
    }

    getGridStats(grid) {
        let sum = 0;
        let max = -Infinity;
        let min = Infinity;
        let count = 0;

        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                let val = grid[x][y];
                sum += val;
                if (val > max) max = val;
                if (val < min) min = val;
                count++;
            }
        }

        return {
            avg: count > 0 ? sum / count : 0,
            max: max,
            min: min
        };
    }

    applyProgressiveOxygenRise() {
        // Increment ALL grid cells by the rise rate
        // This simulates atmospheric accumulation
        let maxReached = true;

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.oxygenGrid[i][j] < this.maxOxygenEvent) {
                    this.oxygenGrid[i][j] += this.oxygenRiseRate;
                    maxReached = false;
                }
            }
        }

        // Periodic Log (every ~10 seconds)
        if (frameCount % 600 === 0 && !maxReached) {
            console.log(`[GOE] Global Oxygen Rising: ${this.oxygenGrid[10][10].toFixed(2)} (Target: ${this.maxOxygenEvent})`);
        }
    }

    getAverageAtRow(grid, rowIdx) {
        if (rowIdx < 0 || rowIdx >= this.rows) return 0;
        let sum = 0;
        for (let x = 0; x < this.cols; x++) {
            sum += grid[x][rowIdx];
        }
        return sum / this.cols;
    }
}
