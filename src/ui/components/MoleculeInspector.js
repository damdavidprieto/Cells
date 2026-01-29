/**
 * Componente: MoleculeInspector
 * =============================
 * Herramienta de depuración para visualizar las concentraciones químicas 
 * de cualquier celda del grid bajo el cursor.
 */
class MoleculeInspector {
    constructor() {
        this.enabled = false;
        this.width = 180;
        this.height = 320;
        this.padding = 15;
        this.visible = false;
    }

    enable() { this.enabled = true; }
    disable() { this.enabled = false; }
    toggle() { this.enabled = !this.enabled; }

    draw() {
        if (!this.enabled || !window.environment) return;

        // Determinar celda bajo el mouse
        const res = window.environment.resolution;
        const col = Math.floor(mouseX / res);
        const row = Math.floor(mouseY / res);

        // Validar límites
        if (col < 0 || col >= window.environment.cols || row < 0 || row >= window.environment.rows) return;

        this._drawPanel(col, row);
    }

    _drawPanel(col, row) {
        const env = window.environment;
        const res = env.resolution;
        const x = mouseX + 20;
        const y = mouseY + 20;

        // Ajustar posición si se sale de la pantalla
        const finalX = (x + this.width > width) ? mouseX - this.width - 20 : x;
        const finalY = (y + this.height > height) ? mouseY - this.height - 20 : y;

        push();
        translate(finalX, finalY);

        // Fondo semi-transparente elegante
        fill(20, 25, 30, 230);
        stroke(100, 150, 255, 150);
        strokeWeight(1);
        rect(0, 0, this.width, this.height, 8);

        // Cabecera
        noStroke();
        fill(100, 150, 255);
        textStyle(BOLD);
        textSize(12);
        textAlign(LEFT, TOP);
        text("CHEMISTRY INSPECTOR", this.padding, this.padding);

        textSize(10);
        fill(180);
        textStyle(NORMAL);
        text(`Grid Cell: [${col}, ${row}]`, this.padding, this.padding + 16);

        // Línea divisoria
        stroke(255, 255, 255, 30);
        line(this.padding, 48, this.width - this.padding, 48);
        noStroke();

        // Lista de Moléculas y Parámetros
        let currentY = 60;
        const lineHeight = 18;

        const data = [
            { label: "Temp", val: env.temperatureGrid[col][row].toFixed(1) + "°C", color: "#ff8c00" },
            { label: "pH", val: env.getPH(col * res, row * res).toFixed(2), color: "#00ff7f" },
            { label: "O₂", val: env.oxygenGrid[col][row].toFixed(2), color: "#ff4500" },
            { label: "CO₂", val: env.co2Grid[col][row].toFixed(2), color: "#909090" },
            { label: "H₂", val: env.h2Grid[col][row].toFixed(2), color: "#ffffff" },
            { label: "CH₄", val: env.ch4Grid[col][row].toFixed(2), color: "#cecece" },
            { label: "H₂S", val: env.h2sGrid[col][row].toFixed(2), color: "#ffff00" },
            { label: "NH₃", val: env.nh3Grid[col][row].toFixed(2), color: "#4169e1" },
            { label: "Fe²⁺", val: env.fe2Grid[col][row].toFixed(2), color: "#cd853f" },
            { label: "P", val: env.phosphorusGrid[col][row].toFixed(2), color: "#ffa500" },
            { label: "N", val: env.nitrogenGrid[col][row].toFixed(2), color: "#add8e6" },
            { label: "UV", val: env.uvRadiationGrid[col][row].toFixed(0), color: "#da70d6" }
        ];

        textSize(11);
        data.forEach(item => {
            fill(200);
            text(item.label, this.padding, currentY);

            fill(item.color);
            textAlign(RIGHT, TOP);
            text(item.val, this.width - this.padding, currentY);
            textAlign(LEFT, TOP);

            currentY += lineHeight;
        });

        pop();
    }
}
