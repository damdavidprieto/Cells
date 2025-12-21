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
    static calculateBrightness(color) {
        return (color[0] + color[1] + color[2]) / 3;
    }

    /**
     * Calculate light absorption multiplier based on color
     * Darker cells absorb more light
     * @param {Array} color - RGB array
     * @returns {number} Absorption multiplier (0.5-1.5)
     */
    static calculateLightAbsorption(color) {
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
    static calculatePhotoprotection(color) {
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
    static calculatePigmentCost(color) {
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
    static getMetabolismBaseColor(metabolismType) {
        const baseColors = {
            'luca': [200, 200, 220],           // Gray/white
            'fermentation': [180, 100, 150],    // Purple
            'chemosynthesis': [150, 200, 100]   // Green-yellow
        };
        return baseColors[metabolismType] || [200, 200, 220];
    }

    /**
     * Apply color variation to base metabolism color
     * Allows evolution within metabolism type
     * @param {string} metabolismType - Metabolism type
     * @param {Array} dnaColor - DNA color values
     * @returns {Array} Final RGB color
     */
    static applyColorVariation(metabolismType, dnaColor) {
        const level = GameConstants.COLOR_EVOLUTION_LEVEL;
        const config = GameConstants.COLOR_EVOLUTION[level];

        let baseColor = this.getMetabolismBaseColor(metabolismType);

        if (!config.allowVariation) {
            return baseColor;  // Fixed by metabolism
        }

        // Apply DNA color as variation around base (±50%)
        let finalColor = [
            constrain(baseColor[0] + (dnaColor[0] - 128) * 0.5, 0, 255),
            constrain(baseColor[1] + (dnaColor[1] - 128) * 0.5, 0, 255),
            constrain(baseColor[2] + (dnaColor[2] - 128) * 0.5, 0, 255)
        ];

        return finalColor;
    }
}
