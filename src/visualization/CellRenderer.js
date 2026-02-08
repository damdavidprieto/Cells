// Cell Renderer - Handles visual rendering of cells
class CellRenderer {
    render(entity) {
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

    drawCellBody(entity, pulse, healthFactor, overrideAlpha = null) {
        // Get final color with variation (metabolism base + DNA variation)
        let finalColor = window.colorSystem.applyColorVariation(
            entity.dna.metabolismType,
            entity.dna.color
        );



        // Color intensity modifiers
        let efficiencyHue = 1.0;
        let healthMultiplier = 1.0;

        if (GameConstants.ENABLE_VISUAL_MODIFIERS) {
            efficiencyHue = map(entity.dna.metabolicEfficiency, 0.5, 1.5, 0.6, 1.4, true); // Constrain
            healthMultiplier = 1.0; // Stability preferred by user
        }

        // Alpha: Use override if provided, otherwise default to 255 (100% opaque)
        // Previous transparent values caused background bleeding artifacts (green ghost effect).
        let alpha = overrideAlpha !== null ? overrideAlpha : 255;

        fill(
            finalColor[0] * healthMultiplier * efficiencyHue,
            finalColor[1] * healthMultiplier * efficiencyHue,
            finalColor[2] * healthMultiplier * efficiencyHue,
            alpha
        );
        circle(entity.pos.x, entity.pos.y, entity.dna.size + pulse);
    }

    drawNucleus(entity, healthFactor) {
        // Nucleus (size reflects storage capacity)
        let nucleusSize = map(entity.dna.storageCapacity, 100, 300, 0.3, 0.5);
        fill(255, 255, 255, 200 * healthFactor);
        circle(entity.pos.x, entity.pos.y, entity.dna.size * nucleusSize);
    }

    drawOrganelles(entity) {
        let organelleSize = 2;

        // Ribosomes (all cells have them) - white dots
        if (entity.dna.organelles.ribosomes) {
            this.drawRibosomes(entity, organelleSize);
        }

        // ATP Synthase (PMF Motor) - Golden Spinning dots
        if (entity.dna.organelles.atp_synthase) {
            this.drawATPSynthase(entity, organelleSize);
        }

        // Hydrogenase Complex (H2 optimization) - Cyan dots
        if (entity.dna.organelles.hydrogenase_complex) {
            this.drawHydrogenases(entity, organelleSize);
        }
    }

    drawRibosomes(entity, organelleSize) {
        fill(255, 255, 255, 180);

        for (let i = 0; i < 3; i++) {
            let angle = (TWO_PI / 3) * i + frameCount * 0.01;
            let radius = entity.dna.size * 0.2;
            let ox = entity.pos.x + cos(angle) * radius;
            let oy = entity.pos.y + sin(angle) * radius;
            circle(ox, oy, organelleSize);
        }
    }

    drawATPSynthase(entity, organelleSize) {
        fill(255, 215, 0, 200); // GOLD

        for (let i = 0; i < 2; i++) {
            let angle = (TWO_PI / 2) * i + frameCount * 0.03; // Faster spin
            let radius = entity.dna.size * 0.3;
            let ox = entity.pos.x + cos(angle) * radius;
            let oy = entity.pos.y + sin(angle) * radius;
            circle(ox, oy, organelleSize * 1.5);
        }
    }

    drawHydrogenases(entity, organelleSize) {
        fill(0, 255, 255, 180); // CYAN

        for (let i = 0; i < 2; i++) {
            let angle = (TWO_PI / 2) * i + PI / 4 + frameCount * 0.015;
            let radius = entity.dna.size * 0.25;
            let ox = entity.pos.x + cos(angle) * radius;
            let oy = entity.pos.y + sin(angle) * radius;
            circle(ox, oy, organelleSize * 1.2);
        }
    }

    getMetabolismColor(metabolismType) {
        const colors = {
            'luca': [200, 200, 220],           // Gray/white (primitive)
            'fermentation': [180, 100, 150],    // Reddish-purple (anaerobic)
            'chemosynthesis': [150, 200, 100]   // Greenish-yellow (chemical energy)
        };
        return colors[metabolismType] || [200, 200, 220];
    }
}
