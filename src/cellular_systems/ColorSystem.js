/**
 * Color System - Handles color-based mechanics (cellular pigments)
 * 
 * Biological basis:
 * - Dark pigments absorb more light (better energy capture)
 * - Dark pigments provide photoprotection (UV resistance)
 * - Pigments cost energy to produce and maintain
 */
class ColorSystem {
    /**
     * Calculate brightness of a color (0-255)
     * @param {Array} color - RGB array [r, g, b]
     * @returns {number} Brightness value (0-255)
     */
    calculateBrightness(color) {
        return (color[0] + color[1] + color[2]) / 3;
    }

    /**
     * Calculate light absorption multiplier based on color
     * Darker cells absorb more light
     * @param {Array} color - RGB array
     * @returns {number} Absorption multiplier (0.5-1.5)
     */
    calculateLightAbsorption(color) {
        const level = GameConstants.COLOR_EVOLUTION_LEVEL;
        const config = GameConstants.COLOR_EVOLUTION[level];

        if (level === 'NONE') return 1.0;

        let brightness = this.calculateBrightness(color);

        // Dark cells (low brightness) = high absorption
        // Light cells (high brightness) = low absorption
        let absorptionFactor = map(
            brightness,
            0, 255,
            config.lightAbsorptionMultiplier,  // Dark: high
            1.0 / config.lightAbsorptionMultiplier  // Light: low
        );

        return absorptionFactor;
    }

    /**
     * Calculate photoprotection multiplier based on color
     * Darker cells resist UV damage better (melanin, carotenoids)
     * @param {Array} color - RGB array
     * @returns {number} Protection multiplier (1.0-2.5)
     */
    calculatePhotoprotection(color) {
        const level = GameConstants.COLOR_EVOLUTION_LEVEL;
        const config = GameConstants.COLOR_EVOLUTION[level];

        if (level === 'NONE') return 1.0;

        let brightness = this.calculateBrightness(color);

        // Dark cells = strong UV protection (2.5x)
        // Light cells = no UV protection (1.0x)
        // Based on melanin/carotenoid photoprotection in nature
        let protectionFactor = map(
            brightness,
            0, 255,
            2.5,  // Dark (brightness 0): 2.5x protection
            1.0   // Light (brightness 255): 1.0x protection (no protection)
        );

        return protectionFactor;
    }

    /**
     * Calculate pigment maintenance cost
     * Darker pigments cost more energy
     * @param {Array} color - RGB array
     * @returns {number} Energy cost per frame
     */
    calculatePigmentCost(color) {
        const level = GameConstants.COLOR_EVOLUTION_LEVEL;
        const config = GameConstants.COLOR_EVOLUTION[level];

        if (level === 'NONE') return 0;

        let brightness = this.calculateBrightness(color);

        // Darker pigments cost more
        let pigmentDensity = 1.0 - (brightness / 255);
        return config.pigmentCost * pigmentDensity;
    }

    /**
     * Get base color for metabolism type
     * @param {string} metabolismType - 'luca', 'fermentation', 'chemosynthesis'
     * @returns {Array} Base RGB color
     */
    getMetabolismBaseColor(metabolismType) {
        const baseColors = {
            'luca': [200, 200, 220],           // Gray/white
            'fermentation': [180, 100, 150],    // Purple
            'chemosynthesis': [240, 200, 60],   // Gold/Yellow (Chemical Energy) - Distinct from H2 Green

            // New Scientific Names (Standardized)
            'anoxigenicPhotosynthesis': [200, 0, 200],   // PURPLE (Debug Trace) - Was Gold, Was Green
            // 'anoxigenicPhotosynthesis': [50, 150, 50],   // Green (Chlorobi) - OLD (Caused green cell bug)
            'oxigenicPhotosynthesis': [0, 150, 255],     // Blue/Azure (Cyanobacteria) - Changed from Greenish-Cyan to avoid confusion
            'aerobicRespiration': [220, 80, 80]          // Red (Oxidative)
        };
        return baseColors[metabolismType] || [180, 180, 180];
    }

    /**
     * Allows evolution within metabolism type
     * @param {string} metabolismType - Metabolism type
     * @param {Array} dnaColor - DNA color values
     * @returns {Array} Final RGB color
     */
    applyColorVariation(metabolismType, dnaColor) {
        // ... kept for compatibility or base variation ...
        // Better: this should be part of the phenotypic calculation
        return this.calculatePhenotypicColor({ metabolisms: { [metabolismType]: { efficiency: 1.0 } }, color: dnaColor });
    }

    /**
     * Calculate final phenotypic color based on metabolic mix
     * Blends colors of all enabled metabolisms weighted by efficiency
     */
    calculatePhenotypicColor(dna) {
        let totalWeight = 0;
        let r = 0, g = 0, b = 0;

        // 1. Blend Base Colors of Metabolisms
        if (GameConstants.ENABLE_METABOLIC_COLOR) {
            for (let [type, data] of Object.entries(dna.metabolisms || {})) {
                // GRADUAL COLOR EXPRESSION:
                // Pigment production scales linearly with metabolic efficiency.
                let weight = data.efficiency;

                if (weight > 0) {
                    let base = this.getMetabolismBaseColor(type);
                    r += base[0] * weight;
                    g += base[1] * weight;
                    b += base[2] * weight;
                    totalWeight += weight;
                }
            }
        }

        // Default or Fallback to Gray if no metabolism active or DISABLED
        if (totalWeight === 0) {
            r = 200; g = 200; b = 200; // Force Gray Base
            totalWeight = 1;
        } else {
            r /= totalWeight;
            g /= totalWeight;
            b /= totalWeight;
        }

        // 2. Apply Individual Variation (Genetic Drift)
        // DNA color acts as a modifier/tint on top of the metabolic base
        if (GameConstants.ENABLE_DNA_COLOR_TINT) {
            let dnaColor = dna.color || [128, 128, 128];
            r = r * 0.7 + dnaColor[0] * 0.3;
            g = g * 0.7 + dnaColor[1] * 0.3;
            b = b * 0.7 + dnaColor[2] * 0.3;
        }

        let finalR = constrain(r, 0, 255);
        let finalG = constrain(g, 0, 255);
        let finalB = constrain(b, 0, 255);

        // DEBUG: Trace Green Cells (Hybrid Theory)
        // If Green is dominant and Red/Blue are lower
        if (finalG > finalR + 20 && finalG > finalB + 20) {
            console.log("🟢 GREEN CELL DETECTED! Mixing:", dna.metabolisms, "Color:", [finalR, finalG, finalB], "DNA tint:", dna.color);
        }

        return [finalR, finalG, finalB];
    }
}
