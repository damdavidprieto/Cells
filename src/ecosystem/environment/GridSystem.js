/**
 * Component: GridSystem
 * Manages all resource and physical grids (H2, CO2, O2, Temp, etc.)
 */
class GridSystem {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;

        // Normalized Grid Builders (Instances)
        const chemical = new ChemicalGrids();
        const physical = new PhysicalGrids();
        const resource = new ResourceGrids();

        // Resource Grids
        this.h2Grid = chemical.initializeH2(this.cols, this.rows);
        this.co2Grid = chemical.initializeCO2(this.cols, this.rows);
        this.phosphorusGrid = resource.initializePhosphorus(this.cols, this.rows);
        this.nitrogenGrid = resource.initializeNitrogen(this.cols, this.rows);
        this.oxygenGrid = resource.initializeOxygen(this.cols, this.rows);

        // Physical Grids
        this.lightGrid = resource.initializeLight(this.cols, this.rows);
        this.temperatureGrid = physical.initializeTemperature(this.cols, this.rows);
        this.uvRadiationGrid = physical.initializeUV(this.cols, this.rows);

        // Additional Grids (Vents)
        this.fe2Grid = chemical.initializeFe2(this.cols, this.rows);
        this.ch4Grid = chemical.initializeCH4(this.cols, this.rows);
        this.h2sGrid = chemical.initializeH2S(this.cols, this.rows);
        this.nh3Grid = chemical.initializeNH3(this.cols, this.rows);
    }

    createGrid() {
        let grid = new Array(this.cols);
        for (let i = 0; i < this.cols; i++) {
            grid[i] = new Array(this.rows).fill(0);
        }
        return grid;
    }

    sanitize(stratification) {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (!stratification.isInWater(i, j)) {
                    this.clearCell(i, j);
                }
            }
        }
    }

    clearCell(i, j) {
        this.h2Grid[i][j] = 0;
        this.co2Grid[i][j] = 0;
        this.phosphorusGrid[i][j] = 0;
        this.nitrogenGrid[i][j] = 0;
        this.oxygenGrid[i][j] = 0;
        this.lightGrid[i][j] = 0;
        this.uvRadiationGrid[i][j] = 0;
        this.fe2Grid[i][j] = 0;
        this.ch4Grid[i][j] = 0;
        this.h2sGrid[i][j] = 0;
        this.nh3Grid[i][j] = 0;
    }

    get(gridName, x, y, resolution) {
        let col = floor(x / resolution);
        let row = floor(y / resolution);

        if (this[gridName] && this[gridName][col]) {
            return this[gridName][col][row] || 0;
        }
        return 0;
    }

    set(gridName, x, y, resolution, value) {
        let col = floor(x / resolution);
        let row = floor(y / resolution);

        if (this[gridName] && this[gridName][col]) {
            this[gridName][col][row] = value;
        }
    }

    add(gridName, x, y, resolution, amount) {
        let col = floor(x / resolution);
        let row = floor(y / resolution);

        if (this[gridName] && this[gridName][col]) {
            this[gridName][col][row] = (this[gridName][col][row] || 0) + amount;
        }
    }

    consume(gridName, x, y, resolution, amount) {
        let col = floor(x / resolution);
        let row = floor(y / resolution);

        if (this[gridName] && this[gridName][col]) {
            let current = this[gridName][col][row] || 0;
            let actual = Math.min(current, amount);
            this[gridName][col][row] = current - actual;
            return actual;
        }
        return 0;
    }

    // Direct Grid Accessors (for diffusion performance)
    getGrid(name) { return this[name]; }
}
