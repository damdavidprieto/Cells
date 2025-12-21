// Mutation Rate Tracker - Visualizes evolution of mutation rates over time
// Shows how cells evolve from high LUCA mutation rates to low modern rates
class MutationRateTracker {
    constructor() {
        this.history = [];
        this.maxHistory = 200;  // Track last 200 data points
        this.eraColors = {
            primordial: [255, 100, 100],  // Red for LUCA era
            transition: [255, 200, 100],  // Orange for transition
            modern: [100, 255, 100]       // Green for modern
        };
    }

    update(cells) {
        if (cells.length === 0) return;

        // Calculate statistics
        let mutationRates = cells.map(c => c.dna.mutationRate);
        let avg = mutationRates.reduce((a, b) => a + b) / mutationRates.length;
        let min = Math.min(...mutationRates);
        let max = Math.max(...mutationRates);

        // Count cells by evolutionary era
        let eraCounts = {
            primordial: 0,
            transition: 0,
            modern: 0
        };

        cells.forEach(c => {
            if (c.dna.evolutionaryEra) {
                eraCounts[c.dna.evolutionaryEra]++;
            }
        });

        this.history.push({
            avg,
            min,
            max,
            generation: frameCount,
            eraCounts,
            totalCells: cells.length
        });

        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    render(x, y, w, h) {
        if (this.history.length === 0) return;

        push();
        translate(x, y);

        // Background panel
        fill(0, 0, 0, 180);
        stroke(100, 100, 100);
        strokeWeight(1);
        rect(0, 0, w, h, 5);

        // Title
        fill(255);
        noStroke();
        textSize(14);
        textAlign(LEFT, TOP);
        text('Mutation Rate Evolution', 10, 10);

        // Draw graph area
        let graphY = 35;
        let graphH = h - 100;
        this.drawGraph(10, graphY, w - 20, graphH);

        // Current statistics
        let current = this.history[this.history.length - 1];
        textSize(11);
        fill(200);
        text(`Average: ${current.avg.toFixed(3)}`, 10, h - 55);
        text(`Range: ${current.min.toFixed(3)} - ${current.max.toFixed(3)}`, 10, h - 40);

        // Era distribution
        textSize(10);
        fill(150);
        text('Era Distribution:', 10, h - 25);

        let barY = h - 12;
        let barW = w - 20;
        let primordialPct = current.eraCounts.primordial / current.totalCells;
        let transitionPct = current.eraCounts.transition / current.totalCells;
        let modernPct = current.eraCounts.modern / current.totalCells;

        // Draw era bars
        noStroke();
        let xOffset = 10;

        if (primordialPct > 0) {
            fill(...this.eraColors.primordial);
            rect(xOffset, barY, barW * primordialPct, 8);
            xOffset += barW * primordialPct;
        }

        if (transitionPct > 0) {
            fill(...this.eraColors.transition);
            rect(xOffset, barY, barW * transitionPct, 8);
            xOffset += barW * transitionPct;
        }

        if (modernPct > 0) {
            fill(...this.eraColors.modern);
            rect(xOffset, barY, barW * modernPct, 8);
        }

        pop();
    }

    drawGraph(x, y, w, h) {
        push();
        translate(x, y);

        // Graph background
        fill(20, 20, 30);
        noStroke();
        rect(0, 0, w, h);

        // Reference lines
        stroke(60, 60, 70);
        strokeWeight(1);

        // LUCA reference (0.20)
        let lucaY = map(0.20, 0, 0.3, h, 0);
        line(0, lucaY, w, lucaY);
        fill(255, 100, 100, 150);
        noStroke();
        textSize(9);
        textAlign(RIGHT, BOTTOM);
        text('LUCA (0.20)', w - 5, lucaY - 2);

        // Modern reference (0.05)
        stroke(60, 60, 70);
        let modernY = map(0.05, 0, 0.3, h, 0);
        line(0, modernY, w, modernY);
        fill(100, 255, 100, 150);
        noStroke();
        text('Modern (0.05)', w - 5, modernY - 2);

        // Transition reference (0.08)
        stroke(60, 60, 70);
        let transitionY = map(0.08, 0, 0.3, h, 0);
        line(0, transitionY, w, transitionY);
        fill(255, 200, 100, 150);
        noStroke();
        text('Transition (0.08)', w - 5, transitionY - 2);

        // Draw mutation rate range (min-max band)
        fill(100, 150, 255, 30);
        noStroke();
        beginShape();
        for (let i = 0; i < this.history.length; i++) {
            let px = map(i, 0, this.maxHistory - 1, 0, w);
            let py = map(this.history[i].max, 0, 0.3, h, 0);
            vertex(px, py);
        }
        for (let i = this.history.length - 1; i >= 0; i--) {
            let px = map(i, 0, this.maxHistory - 1, 0, w);
            let py = map(this.history[i].min, 0, 0.3, h, 0);
            vertex(px, py);
        }
        endShape(CLOSE);

        // Draw average line
        stroke(100, 200, 255);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let i = 0; i < this.history.length; i++) {
            let px = map(i, 0, this.maxHistory - 1, 0, w);
            let py = map(this.history[i].avg, 0, 0.3, h, 0);
            vertex(px, py);
        }
        endShape();

        pop();
    }
}
