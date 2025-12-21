/**
 * GRID UTILS - Common Grid Utilities
 * ===================================
 * 
 * Common utilities for grid operations:
 * - Grid creation
 * - Safe grid access
 * - Resource consumption
 */
class GridUtils {
    /**
     * Create empty grid
     */
    static createGrid(cols, rows) {
        let grid = [];
        for (let i = 0; i < cols; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                grid[i][j] = 0;
            }
        }
        return grid;
    }

    /**
     * Get grid value safely (with bounds checking)
     */
    static getGridValue(grid, x, y, resolution, cols, rows) {
        let i = floor(x / resolution);
        let j = floor(y / resolution);
        if (i >= 0 && i < cols && j >= 0 && j < rows) {
            return grid[i][j];
        }
        return 0;
    }

    /**
     * Set grid value safely (with bounds checking)
     */
    static setGridValue(grid, x, y, value, resolution, cols, rows) {
        let i = floor(x / resolution);
        let j = floor(y / resolution);
        if (i >= 0 && i < cols && j >= 0 && j < rows) {
            grid[i][j] = value;
        }
    }

    /**
     * Consume from grid (returns amount consumed)
     */
    static consumeFromGrid(grid, x, y, amount, resolution, cols, rows) {
        let i = floor(x / resolution);
        let j = floor(y / resolution);
        if (i >= 0 && i < cols && j >= 0 && j < rows) {
            let available = grid[i][j];
            let taken = min(available, amount);
            grid[i][j] -= taken;
            return taken;
        }
        return 0;
    }
}
