/**
 * Component: EnvironmentRenderer
 * Handles all visual representation of the environment.
 */
class EnvironmentRenderer {
    constructor(resolution) {
        this.resolution = resolution;
    }

    render(gridSystem, stratification, config) {
        // Check if black screen mode is enabled
        const blackScreenMode = config.renderConfig && config.renderConfig.blackScreen;

        // 1. BACKGROUND
        if (!blackScreenMode) {
            this.drawBackground();
        }
        // In blackScreenMode, we rely on the global background(0) call in Sketch.js 
        // to avoid translation issues and ensure a pure black void.

        // 2. GRID CELLS (Skip in black screen mode)
        if (!blackScreenMode) {
            this.drawGrids(gridSystem, stratification);
        }

        // 3. VENTS (Always render, even in black screen mode)
        if (window.environment && window.environment.ventSystem) {
            window.environment.ventSystem.render(window.environment);
        }

        // 4. BOUNDARIES (Optional, skip in black screen mode)
        if (!config.restrictToVents && !blackScreenMode) {
            this.drawBoundaries(stratification);
        }
    }

    drawBackground() {
        // Full screen deep ocean
        noStroke();
        fill(5, 10, 25);
        rect(0, 0, width, height);
    }



    drawGrids(gridSystem, stratification) {
        const res = this.resolution;
        const h2 = gridSystem.h2Grid;
        const co2 = gridSystem.co2Grid;
        const o2 = gridSystem.oxygenGrid;
        const light = gridSystem.lightGrid;
        const temp = gridSystem.temperatureGrid;

        for (let i = stratification.waterStartCol; i < stratification.waterEndCol; i++) {
            for (let j = stratification.waterStartRow; j < stratification.waterEndRow; j++) {
                if (j < 0 || j >= stratification.rows) continue;

                // Basic resource lighting logic (optimized)
                let h = h2[i][j];
                let c = co2[i][j];
                let o = o2[i][j];
                let l = light[i][j];
                let t = temp[i][j];

                if (h > 0 || c > 0 || o > 0 || l > 0) {
                    // Compose color based on chemical signature
                    // Green = CO2, Blue = H2, Red = O2, Yellow = Light
                    fill(t * 2, c + l, h + o, 150);
                    rect(i * res, j * res, res, res);
                }
            }
        }
    }

    drawBoundaries(stratification) {
        let res = this.resolution;
        let startX = stratification.waterStartCol * res;
        let endX = stratification.waterEndCol * res;

        // Atmosphere line
        let atmosphereY = stratification.atmosphereRow * res;
        stroke(255, 255, 255, 100);
        strokeWeight(2);
        line(startX, atmosphereY, endX, atmosphereY);

        // Sediment line
        let sedimentY = stratification.sedimentRow * res;
        stroke(200, 50, 50, 150);
        strokeWeight(2);
        line(startX, sedimentY, endX, sedimentY);

        noStroke();
    }
}
