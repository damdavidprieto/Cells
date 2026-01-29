/**
 * VentPlumeCalculator.js
 * ======================
 * Calculates realistic hydrothermal plume dispersion.
 * Based on Gaussian plume model with buoyancy effects.
 * 
 * Scientific Reference:
 * Turner, J.S. (1973) - Buoyancy Effects in Fluids
 * Morton et al. (1956) - Turbulent gravitational convection
 */
class VentPlumeCalculator {
    constructor(vent) {
        this.vent = vent;
        this.plumeCache = null;
        this.cacheDirty = true;
    }

    /**
     * Calculate plume cells affected by this vent
     * Returns array of {x, y, distance, decay} objects
     */
    calculatePlume(env) {
        // Use cache if available and valid
        if (!this.cacheDirty && this.plumeCache) {
            return this.plumeCache;
        }

        const plumeCells = [];
        const sourceX = this.vent.x;
        const sourceY = Math.floor(this.vent.y / env.resolution);

        // Plume parameters
        const maxRadius = this.vent.width * 3; // Horizontal spread
        const maxHeight = 20; // Vertical rise (grid cells)
        const decayRate = this.vent.type.plume?.decayRate || 0.15;
        const buoyancy = this.vent.type.plume?.buoyancy || 0.8;

        // Only calculate for active vents
        if (!this.vent.lifecycle || !this.vent.lifecycle.isActive()) {
            this.plumeCache = [];
            this.cacheDirty = false;
            return [];
        }

        // Submarine vents: plume rises due to buoyancy
        if (this.vent.context === 'SUBMARINE') {
            for (let dy = 0; dy < maxHeight; dy++) {
                const targetY = sourceY - dy; // Rise upward
                if (targetY < 0 || targetY >= env.rows) continue;

                // Horizontal spread increases with height (Gaussian)
                const spreadRadius = Math.floor(maxRadius * (1 + dy * 0.2));

                for (let dx = -spreadRadius; dx <= spreadRadius; dx++) {
                    const targetX = sourceX + dx;
                    if (targetX < 0 || targetX >= env.cols) continue;

                    // Calculate distance and decay
                    const horizontalDist = Math.abs(dx);
                    const verticalDist = dy;
                    const totalDist = Math.sqrt(horizontalDist * horizontalDist + verticalDist * verticalDist);

                    // Gaussian decay with buoyancy boost
                    const decay = Math.exp(-decayRate * totalDist) * (1 - verticalDist * 0.02 * buoyancy);

                    if (decay > 0.01) { // Only include significant contributions
                        plumeCells.push({
                            x: targetX,
                            y: targetY,
                            distance: totalDist,
                            decay: Math.max(0, decay)
                        });
                    }
                }
            }
        }
        // Subaerial vents: radial spread on land
        else if (this.vent.context === 'SUBAERIAL') {
            for (let dx = -maxRadius; dx <= maxRadius; dx++) {
                for (let dy = -maxRadius; dy <= maxRadius; dy++) {
                    const targetX = sourceX + dx;
                    const targetY = sourceY + dy;

                    if (targetX < 0 || targetX >= env.cols) continue;
                    if (targetY < 0 || targetY >= env.rows) continue;

                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > maxRadius) continue;

                    const decay = Math.exp(-decayRate * distance);

                    if (decay > 0.01) {
                        plumeCells.push({
                            x: targetX,
                            y: targetY,
                            distance: distance,
                            decay: decay
                        });
                    }
                }
            }
        }
        // Generic: simple radial
        else {
            for (let dx = -maxRadius; dx <= maxRadius; dx++) {
                for (let dy = -maxRadius; dy <= maxRadius; dy++) {
                    const targetX = sourceX + dx;
                    const targetY = sourceY + dy;

                    if (targetX < 0 || targetX >= env.cols) continue;
                    if (targetY < 0 || targetY >= env.rows) continue;

                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > maxRadius) continue;

                    const decay = Math.exp(-decayRate * distance);

                    plumeCells.push({
                        x: targetX,
                        y: targetY,
                        distance: distance,
                        decay: decay
                    });
                }
            }
        }

        // Cache result
        this.plumeCache = plumeCells;
        this.cacheDirty = false;

        return plumeCells;
    }

    invalidateCache() {
        this.cacheDirty = true;
    }
}
