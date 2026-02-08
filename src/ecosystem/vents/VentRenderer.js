/**
 * VentRenderer.js
 * ===============
 * Handles visual representation of all vents in the simulation.
 * Renders vent icons, plumes, and status indicators.
 */
class VentRenderer {
    constructor() {
        this.showLabels = true;
        this.showPlumes = true;
        this.showHeatmap = false;
    }

    render(vents, env) {
        if (!vents || vents.length === 0) return;

        // Force labels OFF if explicitly requested by scenario UI
        if (window.uiManager && window.uiManager.showLabels === false) {
            this.showLabels = false;
        } else if (window.uiManager && window.uiManager.showLabels === true) {
            this.showLabels = true;
        }

        push();

        for (let vent of vents) {
            this._renderVent(vent, env);
        }

        pop();
    }

    _renderVent(vent, env) {
        const screenX = vent.x * env.resolution;
        const screenY = vent.y;
        const width = vent.width * env.resolution;

        // Render based on context
        if (vent.context === 'SUBMARINE') {
            this._renderSubmarineVent(vent, screenX, screenY, width);
        } else if (vent.context === 'SUBAERIAL') {
            this._renderSubaerialVent(vent, screenX, screenY, width);
        } else {
            this._renderGenericVent(vent, screenX, screenY, width);
        }

        // Render plume particles
        if (this.showPlumes && vent.plume) {
            vent.plume.render(env.resolution);
        }

        // Render selection highlight
        if (window.uiManager?.ventControl?.selectedVentId === vent.id) {
            this._renderSelectionHighlight(screenX, screenY, width);
        }

        // Render status indicators
        this._renderStatusIndicators(vent, screenX, screenY);

        // Render label
        if (this.showLabels) {
            this._renderLabel(vent, screenX, screenY);
        }
    }

    _renderSubmarineVent(vent, x, y, width, resolution) {
        const type = vent.type;
        const intensity = vent.getVisualIntensity();
        const albedo = type.albedo || 0.5;
        const glowAmount = type.glow || 0;

        // SINGLE SOLID COLOR: Base Type color blended with Ambient Chemistry
        const chemicals = type.chemicals || {};
        const ambientTint = window.ventColorSystem ?
            window.ventColorSystem.getAmbientColor(y, chemicals) : [0, 60, 120];

        push();

        // 0. The Halo: (Disabled as per user request to avoid circular artifacts)
        // noStroke();
        // fill(ambientTint[0], ambientTint[1], ambientTint[2], 30 * intensity);
        // ellipse(x, y, width * 3, width * 1.5);

        const brightness = 1.0 + (albedo - 0.5) * 0.5;

        // MINERAL COLOR INTEGRATION (New)
        // Blend base color with mineral composition for realistic chimney appearance
        let mineralColor = [type.color[0], type.color[1], type.color[2]];
        if (window.ventColorSystem && type.minerals && type.minerals.length > 0) {
            mineralColor = window.ventColorSystem.getVentChimneyColor(type.minerals, intensity);
        }

        // Final color synthesis: Mineral base + Archaean ambient tint + Thermal effects
        // Weight: 40% mineral, 40% ambient, 20% thermal
        let r = (mineralColor[0] * 0.4 + ambientTint[0] * 0.4) * brightness;
        let g = (mineralColor[1] * 0.4 + ambientTint[1] * 0.4) * brightness;
        let b = (mineralColor[2] * 0.4 + ambientTint[2] * 0.4) * brightness;

        // Add thermal tint (20% weight)
        const temp = type.temperature || 70;
        if (temp > 200) {
            const thermalR = map(temp, 200, 400, 0, 50);
            r += thermalR * 0.2;
            g += thermalR * 0.06; // Less green
            b -= thermalR * 0.1;  // Less blue
        } else if (temp < 50) {
            const coldB = map(temp, 10, 50, 30, 0);
            b += coldB * 0.2;
            r -= coldB * 0.06;
        }

        r = Math.min(255, r);
        g = Math.min(255, g);
        b = Math.min(255, b);

        // Main vent body (Homogeneous Square - as requested)
        // REVISED: Higher base visibility, removed double intensity multiplication
        // DYNAMICS: Only render solid chimney for non-diffuse types AND if enabled in config
        const isChimneyType = type.id !== 'DIFFUSE' && type.id !== 'COLD_SEEP';
        const showChimneys = env.config?.render?.showChimneys !== false; // Default true

        if (isChimneyType && showChimneys) {
            rectMode(CENTER);
            stroke(r * 0.5, g * 0.5, b * 0.5);
            strokeWeight(1);
            fill(r, g, b); // Intensity is already mixed in minerals/ambient
            rect(x, y, width, width);
        }

        pop();
    }

    _renderSubaerialVent(vent, x, y, width) {
        const intensity = vent.getVisualIntensity();

        push();

        // Volcanic cone
        fill(120, 60, 40);
        stroke(80, 40, 20);
        strokeWeight(1);
        triangle(
            x - width * 1.5, y + 20,
            x + width * 1.5, y + 20,
            x, y - 20
        );

        // Crater
        fill(200, 80, 50, 200 * intensity);
        noStroke();
        ellipse(x, y - 15, width * 0.8, width * 0.8);

        // Lava glow
        if (intensity > 0.3) {
            fill(255, 100, 0, 100 * intensity);
            ellipse(x, y - 15, width * 1.2, width * 1.2);
        }

        pop();
    }

    _renderGenericVent(vent, x, y, width) {
        const ventColor = vent.type.color;
        const intensity = vent.getVisualIntensity();

        push();

        // Simple circle representation
        fill(ventColor[0], ventColor[1], ventColor[2], 150 * intensity);
        stroke(ventColor[0] * 0.7, ventColor[1] * 0.7, ventColor[2] * 0.7);
        strokeWeight(2);
        ellipse(x, y, width, width);

        // Center dot
        fill(255, 255, 255, 200);
        noStroke();
        ellipse(x, y, width * 0.3, width * 0.3);

        pop();
    }

    _renderStatusIndicators(vent, x, y) {
        if (!vent.lifecycle || !this.showLabels) return;

        const phase = vent.lifecycle.phase;
        let statusColor, statusText;

        switch (phase) {
            case 'ACTIVE':
                statusColor = [0, 255, 0];
                statusText = '●';
                break;
            case 'DORMANT':
                statusColor = [150, 150, 150];
                statusText = '○';
                break;
            case 'WANING':
                statusColor = [255, 200, 0];
                statusText = '◐';
                break;
            case 'EXTINCT':
                statusColor = [100, 100, 100];
                statusText = '✕';
                break;
            default:
                return;
        }

        push();
        fill(statusColor[0], statusColor[1], statusColor[2]);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(statusText, x + 20, y - 20);
        pop();
    }

    _renderLabel(vent, x, y) {
        push();

        // Background
        fill(0, 0, 0, 150);
        noStroke();
        const labelWidth = 80;
        const labelHeight = 30;
        rect(x - labelWidth / 2, y - 40, labelWidth, labelHeight, 3);

        // Text
        fill(255);
        textAlign(CENTER, TOP);
        textSize(9);
        text(vent.type.name.split(' ')[0], x, y - 38);

        textSize(8);
        fill(200, 200, 200);
        text(`${(vent.intensity * 100).toFixed(0)}%`, x, y - 26);

        pop();
    }

    _renderSelectionHighlight(x, y, width) {
        push();
        noFill();
        stroke(255, 204, 0, 150 + 100 * Math.sin(frameCount * 0.1));
        strokeWeight(3);
        const ringSize = width * 1.5 + 5 * Math.sin(frameCount * 0.1);
        ellipse(x, y, ringSize, ringSize);

        // Small corner brackets or pointers could be added here
        pop();
    }

    toggleLabels() {
        this.showLabels = !this.showLabels;
    }

    togglePlumes() {
        this.showPlumes = !this.showPlumes;
    }
}
