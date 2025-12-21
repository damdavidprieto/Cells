// Species Notification System - Shows alerts when new species emerge
class SpeciesNotifier {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 3;
        this.notificationDuration = 5000; // 5 seconds
        this.seenSpecies = new Set(['luca']); // Track which species we've seen
    }

    // Check if a new species has emerged
    checkForNewSpecies(cells) {
        for (let cell of cells) {
            let metabolismType = cell.dna.metabolismType;

            // If this is a new species we haven't seen before
            if (!this.seenSpecies.has(metabolismType)) {
                this.seenSpecies.add(metabolismType);
                this.addNotification(metabolismType, cell.dna.generation);
            }
        }
    }

    addNotification(speciesType, generation) {
        let notification = {
            type: speciesType,
            generation: generation,
            timestamp: millis(),
            alpha: 0 // For fade-in animation
        };

        this.notifications.push(notification);

        // Keep only the most recent notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications.shift();
        }
    }

    update() {
        let currentTime = millis();

        // Update and remove expired notifications
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            let notif = this.notifications[i];
            let age = currentTime - notif.timestamp;

            // Fade in (first 300ms)
            if (age < 300) {
                notif.alpha = map(age, 0, 300, 0, 255);
            }
            // Full opacity (middle period)
            else if (age < this.notificationDuration - 500) {
                notif.alpha = 255;
            }
            // Fade out (last 500ms)
            else if (age < this.notificationDuration) {
                notif.alpha = map(age, this.notificationDuration - 500, this.notificationDuration, 255, 0);
            }
            // Remove expired
            else {
                this.notifications.splice(i, 1);
            }
        }
    }

    render() {
        push();

        // Render notifications from bottom to top
        let yOffset = height - 100;

        for (let i = this.notifications.length - 1; i >= 0; i--) {
            let notif = this.notifications[i];
            this.renderNotification(notif, width / 2, yOffset);
            yOffset -= 80; // Stack notifications
        }

        pop();
    }

    renderNotification(notif, x, y) {
        push();
        translate(x, y);

        // Get species info
        let info = this.getSpeciesInfo(notif.type);

        // Background panel with glow
        fill(0, 0, 0, notif.alpha * 0.85);
        stroke(info.color[0], info.color[1], info.color[2], notif.alpha);
        strokeWeight(2);
        rect(-200, -30, 400, 60, 8);

        // Glow effect
        noFill();
        stroke(info.color[0], info.color[1], info.color[2], notif.alpha * 0.3);
        strokeWeight(4);
        rect(-202, -32, 404, 64, 10);

        // Icon (colored circle)
        noStroke();
        fill(info.color[0], info.color[1], info.color[2], notif.alpha);
        circle(-170, 0, 30);

        // Text
        textAlign(LEFT, CENTER);

        // Title
        fill(255, 255, 255, notif.alpha);
        textSize(16);
        textStyle(BOLD);
        text('🧬 NEW SPECIES EMERGED!', -140, -8);

        // Species name
        fill(info.color[0], info.color[1], info.color[2], notif.alpha);
        textSize(14);
        textStyle(NORMAL);
        text(info.name, -140, 12);

        // Generation info
        fill(200, 200, 200, notif.alpha * 0.8);
        textSize(11);
        text(`Generation ${notif.generation}`, 80, 0);

        pop();
    }

    getSpeciesInfo(type) {
        switch (type) {
            case 'fermentation':
                return {
                    name: 'Fermentation Cell',
                    color: [180, 100, 150],
                    icon: '🔴'
                };
            case 'chemosynthesis':
                return {
                    name: 'Chemosynthesis Cell',
                    color: [150, 200, 100],
                    icon: '🟢'
                };
            default:
                return {
                    name: 'Unknown Species',
                    color: [200, 200, 200],
                    icon: '⚪'
                };
        }
    }

    // Reset for new simulation
    reset() {
        this.notifications = [];
        this.seenSpecies = new Set(['luca']);
    }
}
