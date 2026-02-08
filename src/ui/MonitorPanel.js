/**
 * MonitorPanel.js
 * ===============
 * Base class for creating reusable monitor panels
 * Provides common UI elements: sections, bars, text, styling
 */
class MonitorPanel {
    constructor(x, y, width, height, title, accentColor = [100, 240, 255]) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.title = title;
        this.accentColor = accentColor;
        this.padding = 15;
        this.lineHeight = 20;
        this.tooltips = []; // Active tooltips for this frame
    }

    /**
     * Main render method - override in subclasses
     */
    render(data) {
        this.tooltips = []; // Reset tooltips for new frame

        push();
        this._renderBackground();
        this._renderTitle();

        // Subclasses implement this and register tooltips
        this.renderContent(data);

        pop();

        // Render tooltips after everything else to avoid clipping
        this._renderActiveTooltip();
    }

    /**
     * Override this in subclasses to render specific content
     */
    renderContent(data) {
        // To be implemented by subclasses
    }

    _renderBackground() {
        fill(20, 20, 25, 240);
        stroke(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.height, 5);
    }

    _renderTitle() {
        // High contrast background for title
        fill(30, 30, 40);
        noStroke();
        rect(this.x, this.y, this.width, 40, 5, 5, 0, 0);

        // Sharp title text
        fill(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
        textSize(15);
        textFont('Verdana');
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        text(this.title.toUpperCase(), this.x + this.padding, this.y + 20);

        // Reset style
        textStyle(NORMAL);
    }

    /**
     * Render a section header
     */
    renderSectionHeader(label, y, icon = '', xOffset = 0) {
        const drawX = this.x + this.padding + xOffset;

        // Subtle background line for header
        fill(this.accentColor[0], this.accentColor[1], this.accentColor[2], 30);
        noStroke();
        rect(drawX - 5, y - 2, (this.width / 2) - 40, 18, 2);

        fill(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
        textSize(11);
        textFont('Verdana');
        textStyle(BOLD);
        textAlign(LEFT, TOP);

        text(`${icon} ${label}`, drawX, y);

        // Reset style
        textStyle(NORMAL);
        return y + 24;
    }

    /**
     * Render a section divider line
     */
    renderDivider(y) {
        stroke(80, 80, 90);
        strokeWeight(1);
        line(this.x + this.padding, y, this.x + this.width - this.padding, y);
        return y + 10;
    }

    /**
     * Render a text line
     */
    renderText(label, value, y, size = 11, xOffset = 0) {
        fill(220, 220, 230);
        textSize(size);
        textFont('Verdana');
        textAlign(LEFT, TOP);
        noStroke();

        const drawX = this.x + this.padding + xOffset;
        if (value !== undefined && value !== '') {
            text(`${label}: ${value}`, drawX, y);
        } else {
            text(label, drawX, y);
        }

        return y + this.lineHeight;
    }

    /**
     * Render a progress bar
     */
    renderBar(label, value, y, color = [100, 200, 255], xOffset = 0) {
        const drawX = this.x + this.padding + xOffset;
        const totalBarWidth = (this.width / 2) - (this.padding * 2) - 40; // Adjusted for columns
        const barHeight = 12;
        const percentage = Math.min(value * 100, 100);

        // Label
        fill(200, 200, 210);
        textSize(11);
        text(label + ':', drawX, y);

        // Background bar
        fill(40, 40, 50);
        noStroke();
        rect(drawX + 35, y, totalBarWidth, barHeight, 2);

        // Filled bar
        fill(color[0], color[1], color[2]);
        rect(drawX + 35, y, (totalBarWidth * percentage / 100), barHeight, 2);

        // Percentage text
        fill(200, 200, 210);
        textAlign(RIGHT, TOP);
        text(`${percentage.toFixed(0)}%`, drawX + 35 + totalBarWidth + 40, y);
        textAlign(LEFT, TOP);

        return y + barHeight + 8;
    }

    /**
     * Render a color swatch
     */
    renderColorSwatch(rgb, label, y, xOffset = 0) {
        const drawX = this.x + this.padding + xOffset;
        fill(rgb[0], rgb[1], rgb[2]);
        noStroke();
        rect(drawX, y, 30, 15, 2);

        fill(200, 200, 210);
        textSize(11);
        text(label, drawX + 40, y);

        return y + this.lineHeight + 5;
    }

    /**
     * Register a tooltip area
     */
    registerTooltip(x, y, w, h, text) {
        this.tooltips.push({ x, y, w, h, text });
    }

    /**
     * Check mouse hover and render the relevant tooltip
     */
    _renderActiveTooltip() {
        if (!this.tooltips) return;

        const mx = mouseX;
        const my = mouseY;

        for (let tt of this.tooltips) {
            if (mx >= tt.x && mx <= tt.x + tt.w && my >= tt.y && my <= tt.y + tt.h) {
                this._drawTooltipBox(mx, my, tt.text);
                break; // Only show one
            }
        }
    }

    _drawTooltipBox(x, y, txt) {
        push();
        const margin = 10;
        const maxWidth = 250;

        textSize(10);
        textFont('Verdana');

        // Calculate lines for wrapping
        let words = txt.split(' ');
        let lines = [];
        let currentLine = '';
        for (let word of words) {
            let testLine = currentLine + word + ' ';
            if (textWidth(testLine) > maxWidth - margin * 2) {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);

        const boxWidth = Math.min(maxWidth, textWidth(txt) + margin * 2);
        const boxHeight = lines.length * 14 + margin * 2;

        // Keep box inside screen
        let drawX = x + 15;
        let drawY = y + 15;
        if (drawX + boxWidth > width) drawX = x - boxWidth - 15;
        if (drawY + boxHeight > height) drawY = y - boxHeight - 15;

        // Shadow
        noStroke();
        fill(0, 0, 0, 100);
        rect(drawX + 3, drawY + 3, boxWidth, boxHeight, 4);

        // Box
        fill(25, 25, 35, 230);
        stroke(this.accentColor[0], this.accentColor[1], this.accentColor[2], 150);
        strokeWeight(1);
        rect(drawX, drawY, boxWidth, boxHeight, 4);

        // Text
        noStroke();
        fill(220, 220, 230);
        textAlign(LEFT, TOP);
        for (let i = 0; i < lines.length; i++) {
            text(lines[i], drawX + margin, drawY + margin + i * 14);
        }
        pop();
    }
}
