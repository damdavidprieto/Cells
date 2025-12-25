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

    static update(environment) {
        if (!GameConstants.DIFFUSION.ENABLED) return;

        // Run diffusion iterations
        // Usually 1 per frame is enough for performance, but more gives faster propagation
        for (let k = 0; k < GameConstants.DIFFUSION.ITERATIONS; k++) {

            // 1. Diffuse H2 (Source: Vents -> Upwards)
            this.diffuseGrid(environment.h2Grid, environment);

            // 2. Diffuse O2 (Source: Atmosphere/Surface -> Downwards)
            this.diffuseGrid(environment.oxygenGrid, environment);

            // 3. Diffuse CO2 (Source: Atmosphere -> Downwards)
            this.diffuseGrid(environment.co2Grid, environment);

            // 4. Diffuse Nutrients (P, N, Fe2) - Slower / Optional optimization?
            // Nitrogen and Phosphorus are critical, so we diffuse them too
            this.diffuseGrid(environment.nitrogenGrid, environment);
            this.diffuseGrid(environment.phosphorusGrid, environment);
            this.diffuseGrid(environment.fe2Grid, environment);
        }
    }

    /**
     * Generic diffusion algorithm for any grid
     * Optimized for performance (minimize object creation)
     */
    static diffuseGrid(grid, env) {
        const cols = env.cols;
        const rows = env.rows;

        // Create a temporary buffer to store next state without race conditions
        // Optimization: In a single-threaded JS loop without parallel processing,
        // we can sometimes get away with in-place updates ("Gauss-Seidel relaxation")
        // which actually converges faster than Jacobi (buffer) method.
        // Let's use in-place for performance and faster gradient formation.

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {

                // 1. Determine local diffusion rate based on Phase (Air/Water/Sediment)
                let rate = 0;

                if (y < env.atmosphereRow) {
                    rate = GameConstants.DIFFUSION.RATES.ATMOSPHERE;
                } else if (y >= env.sedimentRow) {
                    rate = GameConstants.DIFFUSION.RATES.SEDIMENT;
                } else {
                    rate = GameConstants.DIFFUSION.RATES.WATER;
                }

                // 2. Get neighbor values
                // Boundary checks implicitly handled by clamping index or treating edges as closed
                let sum = 0;
                let neighbors = 0;

                // Left
                if (x > 0) { sum += grid[x - 1][y]; neighbors++; }
                // Right
                if (x < cols - 1) { sum += grid[x + 1][y]; neighbors++; }
                // Top
                if (y > 0) {
                    // Interface Check: slowing down diffusion across phase boundaries
                    // (e.g. from Water to Air is hard)
                    // For now, simplify: just add neighbor
                    sum += grid[x][y - 1]; neighbors++;
                }
                // Bottom
                if (y < rows - 1) {
                    sum += grid[x][y + 1]; neighbors++;
                }

                // 3. Apply Diffusion (Laplacian)
                // NewVal = Val + Rate * (AvgNeighbor - Val)
                if (neighbors > 0) {
                    let avg = sum / neighbors;
                    let diff = avg - grid[x][y];

                    // Specific logic: H2 rises? CO2 sinks? 
                    // For now, isotropic diffusion (equal in all directions)
                    // Gravity effects are handled by 'Buoyancy' logic if we wanted, 
                    // but simple diffusion covers 90% of needs.

                    if (Math.abs(diff) > 0.01) { // Optimization: don't compute micro-changes
                        grid[x][y] += diff * rate;
                    }
                }
            }
        }
    }
}
