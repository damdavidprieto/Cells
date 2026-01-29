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
        if (!this.active && GameConstants.EXECUTION_MODE !== 'SINGLE_VENT_MODE') return;

        let env = window.environment;
        if (!env || !env.ventSystem) return;

        const ventData = env.ventSystem.getVentData();
        if (!ventData || ventData.length === 0) return;

        push();
        // Position on bottom-right of screen
        translate(width - this.width - 20, height - (this.height * Math.min(ventData.length, 3)) - 20);

        ventData.slice(0, 3).forEach((vent, index) => {
            this._drawVentPanel(vent, 0, index * (this.height + 10));
        });

        pop();
    }

    _drawVentPanel(vent, x, y) {
        push();
        translate(x, y);

        // Shadow
        fill(0, 0, 0, 100);
        noStroke();
        rect(5, 5, this.width, this.height, 10);

        // Dark Background
        fill(30, 40, 50, 230);
        stroke(100, 200, 200);
        strokeWeight(2);
        rect(0, 0, this.width, this.height, 10);

        // Header
        noStroke();
        fill(100, 255, 200);
        textAlign(CENTER, TOP);
        textSize(12);
        textStyle(BOLD);
        text(vent.type.toUpperCase(), this.width / 2, 8);

        textSize(9);
        textStyle(NORMAL);
        fill(150, 200, 200);
        const lifecycleText = vent.lifecycle ? `${vent.lifecycle.phase} (${(vent.lifecycle.progress * 100).toFixed(0)}%)` : "N/A";
        text(`Status: ${lifecycleText} | Int: ${(vent.intensity * 100).toFixed(0)}%`, this.width / 2, 22);

        // DATA METERS
        textAlign(LEFT, TOP);
        textSize(10);
        fill(220);

        let startY = 40;
        let gap = 18;

        const drawBar = (label, value, max, color, barY) => {
            fill(220);
            text(label, 10, barY);
            fill(0, 0, 0, 100);
            rect(65, barY, 110, 8);
            fill(color);
            let w = map(value, 0, max, 0, 110, true);
            rect(65, barY, w, 8);
            fill(255);
            textAlign(RIGHT);
            text(value.toFixed(1), 185, barY - 1);
            textAlign(LEFT);
        };

        drawBar("H₂ Flux", vent.output.h2, 20, color(0, 255, 100), startY);
        drawBar("CO₂ Flux", vent.output.co2, 10, color(150, 100, 255), startY + gap);
        drawBar("Fe₂ Flux", vent.output.fe2, 5, color(255, 150, 50), startY + gap * 2);
        drawBar("Temp", vent.output.temperature, 350, color(255, 100, 100), startY + gap * 3);

        // pH and Redox info
        textSize(8);
        fill(180);
        text(`pH: ${vent.ph.toFixed(1)} | Redox: ${vent.redox}mV`, 10, startY + gap * 4 + 2);

        pop();
    }
}
