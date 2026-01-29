/**
 * VentPlume.js
 * ============
 * Sistema de partículas para visualizar plumas hidrotermales.
 * Simula el flujo ascendente de fluidos calientes desde vents.
 */
class VentPlume {
    constructor(vent) {
        this.vent = vent;
        this.particles = [];
        this.maxParticles = 20;
        this.spawnRate = 0.3; // Probabilidad de spawn por frame
    }

    update() {
        // Spawn new particles
        if (Math.random() < this.spawnRate && this.particles.length < this.maxParticles) {
            this.particles.push(this._createParticle());
        }

        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Movement (buoyancy)
            p.y -= p.velocity;
            p.x += p.drift;

            // Fade out
            p.alpha -= p.fadeRate;
            p.size *= 0.98; // Shrink slightly

            // Random drift
            p.drift += (Math.random() - 0.5) * 0.2;

            // Remove dead particles
            if (p.alpha <= 0 || p.y < 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(resolution) {
        push();
        noStroke();

        for (let p of this.particles) {
            const screenX = p.x * resolution;
            const screenY = p.y;

            // Color with alpha
            fill(p.color[0], p.color[1], p.color[2], p.alpha);
            ellipse(screenX, screenY, p.size, p.size);
        }

        pop();
    }

    _createParticle() {
        const baseColor = this.vent.type.color;

        return {
            x: this.vent.x + (Math.random() - 0.5) * this.vent.width,
            y: this.vent.y,
            velocity: 0.5 + Math.random() * 1.0, // Upward speed
            drift: (Math.random() - 0.5) * 0.5,  // Horizontal drift
            size: 3 + Math.random() * 4,
            alpha: 150 + Math.random() * 100,
            fadeRate: 1 + Math.random() * 2,
            color: [
                baseColor[0] + (Math.random() - 0.5) * 30,
                baseColor[1] + (Math.random() - 0.5) * 30,
                baseColor[2] + (Math.random() - 0.5) * 30
            ]
        };
    }

    clear() {
        this.particles = [];
    }
}
