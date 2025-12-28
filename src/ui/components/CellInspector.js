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
        this.height = 160;
        this.margin = 20;
    }

    draw() {
        // Only active in SINGLE_CELL_MODE and if entities exist
        if (GameConstants.EXECUTION_MODE !== 'SINGLE_CELL_MODE' || !window.entities || window.entities.length === 0) return;

        // Position: Bottom-Left Corner (Safe from Stats(TL) and Legend(BR))
        const x = this.margin;
        const y = height - this.height - this.margin;

        // 1. Draw Panel Background
        push();
        translate(x, y);

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
        text("CELL INSPECTOR", this.width / 2, 10);
        textSize(10);
        textStyle(NORMAL);
        fill(100);
        text("(Live Feed - Bottom Left)", this.width / 2, 28);

        // 2. Render Cells (Grid Layout)
        // Show up to 4 cells
        let cellsToShow = window.entities.slice(0, 4);
        let cellCount = cellsToShow.length;

        let startX = this.width / 2;
        let startY = this.height / 2 + 10;
        let spacing = 60;

        if (cellCount > 1) {
            startX = this.width / 2 - ((cellCount - 1) * spacing) / 2;
        }

        cellsToShow.forEach((subject, index) => {
            let posX = startX + index * spacing;
            let posY = startY;

            // Draw individual cell
            push();
            translate(posX, posY);

            // Mock Entity for centering
            let pulse = map(sin(frameCount * 0.1 + subject.noiseOffset), -1, 1, -2, 2);
            let mockEntity = {
                pos: createVector(0, 0),
                dna: subject.dna,
                vel: createVector(0, 0),
                organelles: subject.organelles || [],
                energy: subject.energy, // Live energy
                health: 100, // Show full health for color clarity
                age: subject.age,
                id: subject.id,
                noiseOffset: subject.noiseOffset,
                maxResources: subject.maxResources,
                oxygen: subject.oxygen,
                nitrogen: subject.nitrogen,
                phosphorus: subject.phosphorus,
                metabolicEfficiency: subject.dna.metabolicEfficiency
            };

            scale(1.5); // Slightly smaller scale to fit potential multiple cells via loop

            // Using standard renderer with pulse
            // healthFactor 1.0 ensures we see the color clearly
            // overrideAlpha 255 ensures FULL OPACITY for color verification
            CellRenderer.drawCellBody(mockEntity, pulse, 1.0, 255);
            CellRenderer.drawNucleus(mockEntity, 1.0);
            CellRenderer.drawOrganelles(mockEntity);

            pop();

            // Label ID
            fill(0);
            textAlign(CENTER, BOTTOM);
            textSize(9);
            text(`#${subject.id}`, posX, posY + 40);
        });

        // Footer Stats (First Cell)
        if (window.entities[0]) {
            let first = window.entities[0];
            fill(0);
            textAlign(LEFT, BOTTOM);
            textSize(9);
            text(`RGB: [${first.dna.color[0].toFixed(0)}, ${first.dna.color[1].toFixed(0)}, ${first.dna.color[2].toFixed(0)}]`, 10, this.height - 5);
        }

        pop();
    }
}

