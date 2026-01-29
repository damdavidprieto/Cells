/**
 * CHEMOTAXIS SYSTEM - Gradient Sensing and Biased Random Walk
 * ==========================================================
 * 
 * Implements primitive "smell" (chemotaxis) for cells.
 * Replaces pure random movement with a biased random walk towards nutrients.
 * 
 * SCIENTIFIC BASIS:
 * ----------------
 * 1. Bacterial Chemotaxis (Berg 1975):
 *    - Even primitive bacteria sense chemical gradients
 *    - Mechanism: "Run-and-Tumble" (or biased drift for non-flagellated)
 *    - Cells suppress tumbling when moving UP a gradient
 * 
 * 2. Biased Brownian Motion (for LUCA):
 *    - LUCA likely lacked complex flagella
 *    - But drift wasn't purely random; thermodynamic favorability
 *    - Simulation: We bias the "random" force vector towards H2
 * 
 * IMPLEMENTATION:
 * --------------
 * - Scans 8 neighbors (Moore neighborhood)
 * - Calculates vector towards highest concentration
 * - Blends this "Desire Vector" with Random Noise
 * - Result: "Drifting" towards food rather than telepathic movement
 */
class ChemotaxisSystem {

    calculateBias(entity, environment) {
        let sensorRadius = environment.resolution;
        let gridX = floor(entity.pos.x / environment.resolution);
        let gridY = floor(entity.pos.y / environment.resolution);

        // 1. DETERMINE TARGET RESOURCE based on metabolism
        // LUCA -> Wants H2 (Vents)
        // Fermentation -> Wants Light (Surface)?? Actually they just avoid toxins, but let's stick to H2 for LUCA
        // Chemosynthesis -> Wants H2/Sediment

        let targetGrid = null;
        if (entity.dna.metabolismType === 'luca' || entity.dna.metabolismType === 'chemosynthesis') {
            targetGrid = environment.h2Grid;
        } else {
            return createVector(0, 0); // Other types (fermenters) rely on light (everywhere) or have different needs
        }

        // 2. SCAN NEIGHBORS (Moore Neighborhood)
        // Find neighbor with HIGHEST concentration
        // [ -1,-1  0,-1  1,-1 ]
        // [ -1, 0  CELL  1, 0 ]
        // [ -1, 1  0, 1  1, 1 ]

        let bestAmount = -1;
        let pBest = null;
        let currentAmount = 0;

        // Check center (current pos) first
        if (gridX >= 0 && gridX < environment.cols && gridY >= 0 && gridY < environment.rows) {
            currentAmount = targetGrid[gridX][gridY];
        }

        // Scan dx, dy from -1 to 1
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // Skip self

                let nx = gridX + dx;
                let ny = gridY + dy;

                if (nx >= 0 && nx < environment.cols && ny >= 0 && ny < environment.rows) {
                    let amount = targetGrid[nx][ny];

                    // IF amount is significantly better than current (Sensitivity threshold)
                    if (amount > currentAmount + GameConstants.MEMBRANE_SENSITIVITY) {
                        // And better than best found so far
                        if (amount > bestAmount) {
                            bestAmount = amount;
                            pBest = createVector(dx, dy); // Direction relative to cell
                        }
                    }
                }
            }
        }

        // 3. RETURN BIAS VECTOR (Nutrient Attraction)
        let totalForce = createVector(0, 0);

        if (pBest != null) {
            pBest.normalize();
            pBest.mult(GameConstants.CHEMOTAXIS_STRENGTH);
            totalForce.add(pBest);
        }

        // 4. NEGATIVE CHEMOTAXIS (OXYGEN AVOIDANCE)
        // If cell is anaerobic (LUCA) and detects O2, flee!
        if (entity.dna.metabolismType === 'luca' && entity.oxygenTolerance < 10) {
            let repulsion = this.calculateRepulsion(entity, environment, environment.oxygenGrid);
            totalForce.add(repulsion);
        }

        return totalForce;
    }

    calculateRepulsion(entity, environment, grid) {
        let gridX = floor(entity.pos.x / environment.resolution);
        let gridY = floor(entity.pos.y / environment.resolution);
        let currentAmt = 0;

        if (gridX >= 0 && gridX < environment.cols && gridY >= 0 && gridY < environment.rows) {
            currentAmt = grid[gridX][gridY];
        }

        // If current spot is safe, no panic
        if (currentAmt < 0.1) return createVector(0, 0);

        let worstDiff = -1;
        let pEscape = createVector(0, 0);

        // Scan neighbors for the WORST spot to avoid
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;

                let nx = gridX + dx;
                let ny = gridY + dy;

                if (nx >= 0 && nx < environment.cols && ny >= 0 && ny < environment.rows) {
                    let val = grid[nx][ny];
                    // If neighbor has MORE poison than me, flee AWAY from it (Reverse vector)
                    if (val > currentAmt) {
                        let diff = val - currentAmt;
                        // Accumulate escape vectors away from all high sources
                        let esc = createVector(-dx, -dy);
                        esc.mult(diff); // Stronger repulsion from higher gradients
                        pEscape.add(esc);
                    }
                }
            }
        }

        pEscape.normalize();
        pEscape.mult(GameConstants.CHEMOTAXIS_STRENGTH * 2.0); // Fear is stronger than hunger
        return pEscape;
    }
}
