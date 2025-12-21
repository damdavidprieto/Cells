/**
 * DEVELOPMENT MONITOR - Debug Panel for Mechanic Validation
 * ========================================================
 * 
 * Logs and displays mechanic events for scientific validation and debugging.
 * Only visible in DEVELOPMENT mode.
 * 
 * FEATURES:
 * - Event logging with categories (UV damage, mutations, deaths, etc.)
 * - Event counters (tracks all events, even if filtered)
 * - Filtering by category and severity
 * - Real-time display of last 20 events
 * - Color-coded by event type
 * - Frame number tracking
 * 
 * USAGE:
 * developmentMonitor.log('uvDamage', 'UV HIGH: 85.3 → Cost: 4.2', {data...});
 */
class DevelopmentMonitor {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;  // Keep last 100 events in memory

        // Event counters (track ALL events, even if filtered)
        this.counters = {
            uvDamage: 0,
            mutations: 0,
            deaths: 0,
            reproductions: 0,
            metabolicDivergence: 0
        };

        // Filters (can be toggled)
        this.filters = {
            uvDamage: true,
            mutations: true,
            deaths: true,
            reproductions: true,  // Enabled to show counter
            metabolicDivergence: true
        };

        // Severity thresholds
        this.severityThresholds = {
            uvDamage: {
                HIGH: 60,
                MED: 30,
                LOW: 0
            }
        };
    }

    /**
     * Log an event
     * @param {string} category - Event category (uvDamage, mutations, deaths, etc.)
     * @param {string} message - Human-readable message
     * @param {object} data - Additional data for analysis
     */
    log(category, message, data = {}) {
        // Increment counter (ALWAYS, even if filtered)
        if (this.counters.hasOwnProperty(category)) {
            this.counters[category]++;
        }

        // Check if category is enabled for display
        if (!this.filters[category]) return;

        // Add to log
        this.logs.push({
            frame: frameCount,
            category: category,
            message: message,
            data: data,
            timestamp: Date.now()
        });

        // Keep only last maxLogs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    /**
     * Render monitor panel
     */
    render() {
        push();

        // Background panel (right side)
        fill(0, 0, 0, 220);
        noStroke();
        rect(width - 320, 0, 320, height);

        // Header
        fill(100, 200, 255);
        textSize(14);
        textAlign(LEFT, TOP);
        textFont('monospace');
        text('🔬 DEVELOPMENT MONITOR', width - 310, 10);

        // Mode indicator
        fill(255, 200, 0);
        textSize(10);
        text(`MODE: ${GameConstants.EXECUTION_MODE}`, width - 310, 30);
        text(`SPEED: ${GameConstants.getCurrentMode().SIMULATION_SPEED}x`, width - 310, 45);

        // Separator
        stroke(100, 100, 100);
        line(width - 320, 60, width, 60);
        noStroke();

        // Filter status with counters
        fill(150);
        textSize(9);
        let filterY = 70;
        text('FILTERS:', width - 310, filterY);
        filterY += 12;

        for (let category in this.filters) {
            let enabled = this.filters[category];
            let count = this.counters[category] || 0;
            fill(enabled ? [100, 255, 100] : [100, 100, 100]);
            text(`${enabled ? '✓' : '✗'} ${category} (${count})`, width - 310, filterY);
            filterY += 12;
        }

        // Separator
        stroke(100, 100, 100);
        line(width - 320, filterY + 5, width, filterY + 5);
        noStroke();

        // Event log (last 20 events, newest first)
        fill(200, 200, 255);
        textSize(10);
        text('RECENT EVENTS:', width - 310, filterY + 15);

        let y = filterY + 35;
        let eventsShown = 0;
        let maxEvents = 15;  // Show last 15 events

        for (let i = this.logs.length - 1; i >= 0 && eventsShown < maxEvents; i--) {
            let log = this.logs[i];

            // Check if we have space
            if (y > height - 40) break;

            this.renderLog(log, y);
            y += 35;  // Space between events
            eventsShown++;
        }

        // Footer
        fill(100);
        textSize(8);
        text(`Total events: ${this.logs.length}`, width - 310, height - 20);

        pop();
    }

    /**
     * Render a single log entry
     * @param {object} log - Log entry
     * @param {number} y - Y position
     */
    renderLog(log, y) {
        // Category badge with color
        let color = this.getCategoryColor(log.category);
        fill(color[0], color[1], color[2], 200);
        rect(width - 310, y, 8, 8);

        // Frame number
        fill(150);
        textSize(8);
        text(`[${log.frame}]`, width - 298, y);

        // Category name
        fill(color);
        textSize(9);
        text(log.category, width - 260, y);

        // Message (truncate if too long)
        fill(220);
        textSize(9);
        let msg = log.message;
        if (msg.length > 35) {
            msg = msg.substring(0, 32) + '...';
        }
        text(msg, width - 310, y + 12);

        // Additional data (if any)
        if (log.data && Object.keys(log.data).length > 0) {
            fill(150);
            textSize(8);
            let dataStr = this.formatData(log.data);
            if (dataStr.length > 40) {
                dataStr = dataStr.substring(0, 37) + '...';
            }
            text(dataStr, width - 310, y + 24);
        }
    }

    /**
     * Get color for category
     * @param {string} category - Event category
     * @returns {Array} RGB color
     */
    getCategoryColor(category) {
        const colors = {
            uvDamage: [255, 200, 0],           // Orange
            mutations: [255, 100, 255],        // Magenta
            deaths: [255, 50, 50],             // Red
            reproductions: [100, 255, 100],    // Green
            metabolicDivergence: [100, 200, 255]  // Cyan
        };
        return colors[category] || [255, 255, 255];
    }

    /**
     * Format data object for display
     * @param {object} data - Data object
     * @returns {string} Formatted string
     */
    formatData(data) {
        let parts = [];
        for (let key in data) {
            let value = data[key];
            if (typeof value === 'number') {
                value = value.toFixed(2);
            } else if (typeof value === 'object') {
                continue;  // Skip nested objects
            }
            parts.push(`${key}:${value}`);
        }
        return parts.join(' ');
    }

    /**
     * Toggle filter for category
     * @param {string} category - Category to toggle
     */
    toggleFilter(category) {
        if (this.filters.hasOwnProperty(category)) {
            this.filters[category] = !this.filters[category];
        }
    }

    /**
     * Clear all logs
     */
    clear() {
        this.logs = [];
    }

    /**
     * Export logs to JSON
     * @returns {string} JSON string of logs
     */
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
}
