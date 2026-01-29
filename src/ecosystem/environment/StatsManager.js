/**
 * Component: StatsManager
 * Centralizes population and environment statistics gathering.
 * Calculates environmental stability for evolutionary pressure.
 */
class StatsManager {
    constructor(gridSystem, stratification) {
        this.grids = gridSystem;
        this.stratification = stratification;
        this.stabilityHistory = [];
        this.currentStability = 0.5;
        this.lastPopulationCount = 0;
    }

    /**
     * Gathers all statistics for the current frame.
     * @param {Array} entities - List of all living cells.
     * @param {number} deathCount - Number of deaths this frame.
     * @returns {Object} - Compiled statistics.
     */
    getStats(entities, deathCount) {
        const envStats = this.calculateEnvironmentAverages();
        const popStats = this.calculatePopulationMetrics(entities);

        return {
            ...envStats,
            ...popStats,
            stability: this.currentStability,
            deaths: deathCount
        };
    }

    /**
     * Calculates average resource levels across the water column.
     */
    calculateEnvironmentAverages() {
        let totalLight = 0, totalOx = 0, totalNi = 0, totalPh = 0;
        let maxOx = 0;

        const startX = this.stratification.waterStartCol;
        const endX = this.stratification.waterEndCol;
        const startY = this.stratification.waterStartRow;
        const endY = this.stratification.waterEndRow;

        let waterCells = 0;

        for (let x = startX; x < endX; x++) {
            for (let y = startY; y < endY; y++) {
                if (y < 0 || y >= this.grids.rows) continue;

                totalLight += this.grids.lightGrid[x][y];
                const ox = this.grids.oxygenGrid[x][y];
                totalOx += ox;
                if (ox > maxOx) maxOx = ox;

                totalNi += this.grids.nitrogenGrid[x][y];
                totalPh += this.grids.phosphorusGrid[x][y];
                waterCells++;
            }
        }

        // Avoid division by zero
        const count = waterCells || 1;

        return {
            totalOxygen: totalOx / count,
            maxOxygen: maxOx,
            totalNitrogen: totalNi / count,
            totalPhosphorus: totalPh / count,
            totalLight: totalLight / count
        };
    }

    /**
     * Calculates metrics about the current population.
     */
    calculatePopulationMetrics(entities) {
        let metaCounts = { luca: 0, fermentation: 0, chemosynthesis: 0 };
        let speciesSet = new Set();

        let totalSOD = 0;
        let totalRepair = 0;
        let totalStructuralDamage = 0;
        let totalOxidativeDamage = 0;
        let totalUVDamage = 0;

        let oxidativeVictims = 0;
        let uvVictims = 0;

        for (let e of entities) {
            metaCounts[e.dna.metabolismType]++;
            speciesSet.add(e.dna.metabolismType);

            totalSOD += e.dna.sodEfficiency || 0;
            totalRepair += e.dna.dnaRepairEfficiency || 0;
            totalStructuralDamage += e.structuralDamage || 0;

            const oxDmg = e.oxidativeDamage || 0;
            totalOxidativeDamage += oxDmg;
            if (oxDmg > 0) oxidativeVictims++;

            const uvDmg = e.uvDamageFrame || 0;
            totalUVDamage += uvDmg;
            if (uvDmg > 0) uvVictims++;
        }

        const popSize = entities.length || 1;

        return {
            entityCount: entities.length,
            speciesCount: speciesSet.size,
            lucaCount: metaCounts.luca,
            fermentationCount: metaCounts.fermentation,
            chemosynthesisCount: metaCounts.chemosynthesis,
            avg_sod: totalSOD / popSize,
            avg_repair: totalRepair / popSize,
            avg_structural_damage: totalStructuralDamage / popSize,
            avg_oxidative_damage: totalOxidativeDamage / popSize,
            avg_uv_damage: totalUVDamage / popSize,
            oxidative_victims: oxidativeVictims,
            uv_victims: uvVictims
        };
    }

    /**
     * Determines environmental stability (0.0 to 1.0).
     * 1.0 = Highly stable, 0.0 = Chaotic/Lethal.
     */
    calculateStability(entities, deathCount) {
        // Stability Factors:
        // 1. Population Volatility (Sudden deaths)
        // 2. Resource Availability (Gradients)
        // 3. Extremes (Lethal O2 or UV)

        let stability = 1.0;

        // Factor 1: Mortality rate
        const popSize = entities.length;
        if (popSize > 0) {
            const mortalityRate = deathCount / popSize;
            stability -= Math.min(0.5, mortalityRate * 5); // Severe penalty for high mortality
        }

        // Factor 2: Population growth stability
        const deltaPop = Math.abs(popSize - this.lastPopulationCount);
        if (this.lastPopulationCount > 0) {
            const volatility = deltaPop / this.lastPopulationCount;
            stability -= Math.min(0.3, volatility);
        }
        this.lastPopulationCount = popSize;

        // Factor 3: Resource extremes (Example: O2 toxicity)
        const stats = this.calculateEnvironmentAverages();
        if (stats.maxOxygen > GameConstants.OXYGEN_SAFE_THRESHOLD) {
            const toxicPenalty = (stats.maxOxygen - GameConstants.OXYGEN_SAFE_THRESHOLD) / 50;
            stability -= Math.min(0.4, toxicPenalty);
        }

        stability = Math.max(0.0, Math.min(1.0, stability));

        // Smooth with history (Moving average)
        this.stabilityHistory.push(stability);
        if (this.stabilityHistory.length > 50) this.stabilityHistory.shift();

        const sum = this.stabilityHistory.reduce((a, b) => a + b, 0);
        return sum / this.stabilityHistory.length;
    }
}
