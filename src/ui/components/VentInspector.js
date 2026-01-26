/**
 * Vent Inspector Component
 * ========================
 * A specialized debug view for Single Vent Mode.
 * Monitors the chemical concentrations at the center of the vent (or cell position).
 */
class VentInspector {
    constructor() {
        this.width = 200;
        this.height = 160;
        this.margin = 20;
        this.active = false; // Controlado por ScenarioManager
    }

    enable() {
        this.active = true;
    }

    disable() {
        this.active = false;
    }

    draw() {
        // Mostrar si está activado explícitamente (ScenarioManager) o si es el modo legado SINGLE_VENT
        if (!this.active && GameConstants.EXECUTION_MODE !== 'SINGLE_VENT_MODE') return;

        let env = window.environment;

        // Target: The single vent center (waterStartCol -> waterEndCol)
        // If undefined (loading), skip
        if (typeof env.waterStartCol === 'undefined') return;

        let centerCol = Math.floor((env.waterStartCol + env.waterEndCol) / 2);
        let bottomRow = env.sedimentRow;

        // Get values at the vent source (bottom)
        let h2 = env.h2Grid[centerCol][bottomRow];
        let co2 = env.co2Grid[centerCol][bottomRow] || 0; // Assuming CO2 grid exists or we simulate
        // If CO2 comes from atmosphere, read top? No, let's read *Ambient* at cell location if cell exists?

        // BETTER: Read exactly where the cell IS (if exists), otherwise Vent Source.
        let targetX = centerCol;
        let targetY = bottomRow;

        if (window.entities && window.entities.length > 0) {
            let cell = window.entities[0];
            targetX = Math.floor(cell.pos.x / env.resolution);
            targetY = Math.floor(cell.pos.y / env.resolution);
        }

        // Clamp
        if (targetX < 0) targetX = 0; if (targetX >= env.cols) targetX = env.cols - 1;
        if (targetY < 0) targetY = 0; if (targetY >= env.rows) targetY = env.rows - 1;

        let currentH2 = env.h2Grid[targetX][targetY];
        let currentO2 = env.oxygenGrid[targetX][targetY];
        let currentLight = env.lightGrid[targetX][targetY];
        let currentTemp = 80; // Default vent temp? Or derived?

        push();
        // Position on bottom-right of screen
        translate(width - this.width - 20, height - this.height - 20);

        // Shadow
        fill(0, 0, 0, 100);
        noStroke();
        rect(5, 5, this.width, this.height, 10);

        // Dark Background (Industrial/Scientific look)
        fill(30, 40, 50);
        stroke(100, 200, 200);
        strokeWeight(2);
        rect(0, 0, this.width, this.height, 10);

        // Header
        noStroke();
        fill(100, 255, 200);
        textAlign(CENTER, TOP);
        textSize(14);
        textStyle(BOLD);
        text("VENT DATA MONITOR", this.width / 2, 10);
        textSize(10);
        textStyle(NORMAL);
        fill(150, 200, 200);
        text(`Probe: [${targetX}, ${targetY}]`, this.width / 2, 28);

        // DATA METERS
        textAlign(LEFT, TOP);
        textSize(11);
        fill(220);

        let startY = 50;
        let gap = 20;

        // Helper to draw bars
        const drawBar = (label, value, max, color, y) => {
            fill(220);
            text(label, 10, y);

            // Bar background
            fill(0, 0, 0, 100);
            rect(60, y, 120, 10);

            // Bar Value
            fill(color);
            let w = map(value, 0, max, 0, 120, true);
            rect(60, y, w, 10);

            // Text Value
            fill(255);
            textAlign(RIGHT);
            text(value.toFixed(1), 180, y - 1);
            textAlign(LEFT);
        };

        drawBar("H₂", currentH2, 100, color(0, 255, 100), startY);
        drawBar("O₂", currentO2, 100, color(0, 200, 255), startY + gap);
        drawBar("Light", currentLight, 100, color(255, 255, 0), startY + gap * 2);

        // Temp (Simulated based on depth/vent proximity)
        // If near vent (y high), hot.
        let temp = (targetY / env.rows) * 80 + 20; // 20C surface, 100C vent
        drawBar("Temp", temp, 120, color(255, 100, 100), startY + gap * 3);

        pop();
    }
}
