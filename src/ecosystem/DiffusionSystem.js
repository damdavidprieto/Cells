/**
 * DIFFUSION SYSTEM - Realistic Resource Propagation
 * =================================================
 * 
 * Simulates the physical spread of resources using Cellular Automata / Laplacian Diffusion.
 * Creates continuous gradients from high-concentration sources (vents) to low-concentration sinks.
 * 
 * PHYSICS:
 * --------
 * Discrete Laplacian Operator on a 2D Grid:
 * Next_Cell = Current_Cell + Rate * (Neighbor_Sum - 4 * Current_Cell)
 * 
 * PHASES:
 * -------
 * 1. ATMOSPHERE (Top 10%): High diffusion (gases mix fast)
 * 2. WATER (Middle 80%): Medium diffusion (liquid transport)
 * 3. SEDIMENT (Bottom 10%): Low diffusion (porous media flow)
 */
class DiffusionSystem {
    constructor() {
        this.frameCounter = 0;
    }

    update(environment) {
        if (!GameConstants.DIFFUSION.ENABLED) return;

        // Run diffusion iterations
        for (let k = 0; k < GameConstants.DIFFUSION.ITERATIONS; k++) {
            this.diffuseGrid(environment.h2Grid, environment);
            this.diffuseGrid(environment.oxygenGrid, environment);
            this.diffuseGrid(environment.co2Grid, environment);
            this.diffuseGrid(environment.nitrogenGrid, environment);
            this.diffuseGrid(environment.phosphorusGrid, environment);
            this.diffuseGrid(environment.fe2Grid, environment);
        }
    }

    diffuseGrid(grid, env) {
        const cols = env.cols;
        const rows = env.rows;

        // 1. Create a temporary grid for the next state (Double Buffering)
        // This prevents "dirty reads" where one cell's update affects its neighbor in the same loop
        // creating an artificial directional bias (top-left to bottom-right).
        const nextGrid = Array.from({ length: cols }, () => new Float32Array(rows));

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let rate = 0;

                if (y < env.atmosphereRow) {
                    rate = GameConstants.DIFFUSION.RATES.ATMOSPHERE;
                } else if (y >= env.sedimentRow) {
                    rate = GameConstants.DIFFUSION.RATES.SEDIMENT;
                } else {
                    rate = GameConstants.DIFFUSION.RATES.WATER;
                }

                let sum = 0;
                let neighbors = 0;

                // Use current grid for neighborhood sum
                if (x > 0) { sum += grid[x - 1][y]; neighbors++; }
                if (x < cols - 1) { sum += grid[x + 1][y]; neighbors++; }
                if (y > 0) { sum += grid[x][y - 1]; neighbors++; }
                if (y < rows - 1) { sum += grid[x][y + 1]; neighbors++; }

                if (neighbors > 0) {
                    let avg = sum / neighbors;
                    let diff = avg - grid[x][y];

                    // Store new value in nextGrid
                    if (Math.abs(diff) > 0.001) { // Increased sensitivity
                        nextGrid[x][y] = grid[x][y] + diff * rate;
                    } else {
                        nextGrid[x][y] = grid[x][y];
                    }
                } else {
                    nextGrid[x][y] = grid[x][y];
                }
            }
        }

        // 2. Copy back to original grid (Safe copy for both Array and TypedArray)
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                grid[x][y] = nextGrid[x][y];
            }
        }
    }
}
