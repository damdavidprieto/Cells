// Cell Renderer - Handles visual rendering of cells
class CellRenderer {
    static render(entity) {
        noStroke();
        let pulse = map(sin(frameCount * 0.1 + entity.noiseOffset), -1, 1, -2, 2);

        // Health-based brightness (average of all FOUR resources)
        let health = (entity.energy + entity.oxygen + entity.nitrogen + entity.phosphorus) / (4 * entity.maxResources);
        let healthFactor = map(health, 0, 1, 0.3, 1.0);

        // Draw cell body
        this.drawCellBody(entity, pulse, healthFactor);

        // Draw nucleus
        this.drawNucleus(entity, healthFactor);

        // Draw organelles
        this.drawOrganelles(entity);
    }

    static drawCellBody(entity, pulse, healthFactor) {
        // Get final color with variation (metabolism base + DNA variation)
        let finalColor = ColorSystem.applyColorVariation(
            entity.dna.metabolismType,
            entity.dna.color
        );

        // Color intensity based on metabolic efficiency
        let efficiencyHue = map(entity.dna.metabolicEfficiency, 0.5, 1.5, 0.6, 1.4);

        fill(
            finalColor[0] * healthFactor * efficiencyHue,
            finalColor[1] * healthFactor,
            finalColor[2] * healthFactor,
            150
        );
        circle(entity.pos.x, entity.pos.y, entity.dna.size + pulse);
    }

    static drawNucleus(entity, healthFactor) {
        // Nucleus (size reflects storage capacity)
        let nucleusSize = map(entity.dna.storageCapacity, 100, 300, 0.3, 0.5);
        fill(255, 255, 255, 200 * healthFactor);
        circle(entity.pos.x, entity.pos.y, entity.dna.size * nucleusSize);
    }

    static drawOrganelles(entity) {
        let organelleSize = 2;

        // Ribosomes (all cells have them) - white dots
        if (entity.dna.organelles.ribosomes) {
            this.drawRibosomes(entity, organelleSize);
        }

        // Hydrogenosomes (fermentation) - purple dots
        if (entity.dna.organelles.hydrogenosomes) {
            this.drawHydrogenosomes(entity, organelleSize);
        }

        // Chemosynthetic enzymes - yellow/green dots
        if (entity.dna.organelles.chemosynthetic_enzymes) {
            this.drawChemosyntheticEnzymes(entity, organelleSize);
        }
    }

    static drawRibosomes(entity, organelleSize) {
        fill(255, 255, 255, 180);
        for (let i = 0; i < 3; i++) {
            let angle = (TWO_PI / 3) * i + frameCount * 0.01;
            let radius = entity.dna.size * 0.2;
            let ox = entity.pos.x + cos(angle) * radius;
            let oy = entity.pos.y + sin(angle) * radius;
            circle(ox, oy, organelleSize);
        }
    }

    static drawHydrogenosomes(entity, organelleSize) {
        fill(180, 80, 200, 200);
        for (let i = 0; i < 2; i++) {
            let angle = (TWO_PI / 2) * i + frameCount * 0.015;
            let radius = entity.dna.size * 0.25;
            let ox = entity.pos.x + cos(angle) * radius;
            let oy = entity.pos.y + sin(angle) * radius;
            circle(ox, oy, organelleSize * 1.5);
        }
    }

    static drawChemosyntheticEnzymes(entity, organelleSize) {
        fill(200, 220, 100, 200);
        for (let i = 0; i < 2; i++) {
            let angle = (TWO_PI / 2) * i + PI / 2 + frameCount * 0.015;
            let radius = entity.dna.size * 0.25;
            let ox = entity.pos.x + cos(angle) * radius;
            let oy = entity.pos.y + sin(angle) * radius;
            circle(ox, oy, organelleSize * 1.5);
        }
    }

    static getMetabolismColor(metabolismType) {
        const colors = {
            'luca': [200, 200, 220],           // Gray/white (primitive)
            'fermentation': [180, 100, 150],    // Reddish-purple (anaerobic)
            'chemosynthesis': [150, 200, 100]   // Greenish-yellow (chemical energy)
        };
        return colors[metabolismType] || [200, 200, 220];
    }
}
