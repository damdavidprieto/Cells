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

    _renderSubmarineVent(vent, x, y, width) {
        const ventColor = vent.type.color;
        const intensity = vent.getVisualIntensity();

        push();

        // Glow effect (intensity-based) - Disabled in clean mode
        if (intensity > 0.5 && this.showLabels) {
            fill(ventColor[0], ventColor[1], ventColor[2], 50);
            noStroke();
            ellipse(x, y, width * 3, width * 3);
        }

        // Chimney structure (Draw upwards from floor)
        fill(80, 60, 50); // Dark rock
        stroke(40, 30, 25);
        strokeWeight(1);
        rect(x - width / 2, y - 10, width, 10);

        // Vent opening (triangle)
        fill(ventColor[0], ventColor[1], ventColor[2], 200 * intensity);
        noStroke();
        triangle(
            x - width / 2, y,
            x + width / 2, y,
            x, y - 15
        );

        // Active indicator (pulsing)
        if (vent.lifecycle && vent.lifecycle.isActive()) {
            const pulse = 0.8 + 0.2 * Math.sin(frameCount * 0.1);
            fill(255, 200, 0, 150 * pulse);
            ellipse(x, y - 10, 5, 5);
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
