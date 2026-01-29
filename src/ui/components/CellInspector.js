/**
 * Cell Inspector Component
 * ========================
 * A specialized debug view for Single Cell Mode.
 * Renders a static, high-fidelity view of the cell against a clean white background
 * to allow verified color inspection without environmental artifacts.
 */
class CellInspector {
    constructor() {
        this.width = 200;
        this.height = 220; // Increased to fit all data
        this.margin = 20;
        this.enabled = false; // Controlado por ScenarioManager
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    draw() {
        // Only active if enabled by ScenarioManager
        if (!this.enabled) return;

        // Only active in SINGLE_CELL_MODE or SINGLE_VENT_MODE and if entities exist
        if ((GameConstants.EXECUTION_MODE !== 'SINGLE_CELL_MODE' && GameConstants.EXECUTION_MODE !== 'SINGLE_VENT_MODE') || !window.entities || window.entities.length === 0) return;

        let subject = window.entities[0]; // Always inspect first cell

        push();
        // Position on bottom-left of screen
        translate(20, height - this.height - 20);

        // Shadow
        fill(0, 0, 0, 100);
        noStroke();
        rect(5, 5, this.width, this.height, 10);

        // White Background
        fill(255);
        stroke(0);
        strokeWeight(2);
        rect(0, 0, this.width, this.height, 10);

        // Header
        noStroke();
        fill(0);
        textAlign(CENTER, TOP);
        textSize(14);
        textStyle(BOLD);
        text("CELL DATA MONITOR", this.width / 2, 10);
        textSize(10);
        textStyle(NORMAL);
        fill(100);
        text(`ID: #${subject.id}`, this.width / 2, 28);

        // DATA LIST
        textAlign(LEFT, TOP);
        textSize(11);
        fill(0);

        let startY = 45;
        let lineHeight = 14;
        let col2X = 110;

        // Column 1
        text(`Pos: [${subject.pos.x.toFixed(0)}, ${subject.pos.y.toFixed(0)}]`, 10, startY);
        text(`Age: ${subject.age}`, 10, startY + lineHeight);

        fill(subject.energy < 20 ? 200 : 0, 0, 0); // Red if low
        text(`Energy: ${subject.energy.toFixed(1)}`, 10, startY + lineHeight * 2);
        fill(0);

        text(`Health: ${(subject.health || 100).toFixed(0)}%`, 10, startY + lineHeight * 3);
        text(`Struct: ${(100 - subject.structuralDamage).toFixed(1)}%`, 10, startY + lineHeight * 4);

        // Column 2
        text(`DNA Size: ${subject.dna.size.toFixed(1)}`, col2X, startY);
        text(`Metab: ${subject.dna.metabolismType}`, col2X, startY + lineHeight);
        text(`Eff: ${subject.dna.metabolicEfficiency.toFixed(2)}`, col2X, startY + lineHeight * 2);

        // Resources
        let resY = startY + lineHeight * 6;
        textSize(10);
        textStyle(BOLD);
        text("INTERNAL RESOURCES:", 10, resY);
        textStyle(NORMAL);

        text(`O₂: ${subject.oxygen.toFixed(1)} / ${subject.maxResources}`, 10, resY + lineHeight);
        text(`N : ${subject.nitrogen.toFixed(1)} / ${subject.maxResources}`, 10, resY + lineHeight * 2);
        text(`P : ${subject.phosphorus.toFixed(1)} / ${subject.maxResources}`, 10, resY + lineHeight * 3);

        pop();
    }
}

