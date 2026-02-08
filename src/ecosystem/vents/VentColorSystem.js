/**
 * VentColorSystem.js
 * =================
 * Calculates emergent colors based on geochemistry and optical physics.
 * 
 * Logic:
 * 1. Water (H2O): base blue-cyan tint (Beer-Lambert law for depth).
 * 2. Dissolved Iron (Fe2+): Greenish-yellow shift (Archaean Ocean).
 * 3. H2/CH4: Subtle white/shimmer (diffraction).
 * 4. Minerals: Blended colors based on concentration.
 */
class VentColorSystem {
    constructor() {
        // Beer-Lambert attenuation coefficients (simplification)
        // Red is absorbed fast, Blue/Green penetrate deep
        this.attenuation = {
            r: 0.15,
            g: 0.05,
            b: 0.02
        };
    }

    /**
     * Calculate emergent color based on Pure H2O, Depth and Fe2+
     * REVISED: "Ferruginous Green" (Deep, Murky, Iron-Rich)
     */
    getAmbientColor(depthP, chemicals = {}) {
        const depthFactor = depthP / 1000;
        const fe2 = chemicals.fe2 || 0;
        // Boosted normalization for visible green at lower concentrations
        const fe2Normalized = Math.min(1.0, fe2 / 10);

        // Base Pure H2O [R, G, B] - Crystal Blue -> Shift to Ferruginous
        // Archaean Ocean: Oxygen-free, Iron-rich = Green/Brown murky water

        // Base (No Iron): Deep Blue (Archaean baseline)
        let r = 20;
        let g = 40;
        let b = 80;

        // Add Iron (Fe2+): Shift to Green/Amber (Murky)
        // REVISED: Simulating PRECIPITATES (Fe(OH)2, FeS, FeCO3) not just dissolved Fe2+
        // Precipitates are much more visible (green/brown turbidity)
        if (fe2Normalized > 0) {
            const precipitateFactor = Math.pow(fe2Normalized, 0.8); // Non-linear (precipitates form quickly)
            r += precipitateFactor * 80;  // Strong rust/brown tint (oxides)
            g += precipitateFactor * 150; // Deep olive green (Fe(OH)2, FeS)
            b += precipitateFactor * 30;  // Little blue (turbid water)
        }

        // Optical Attenuation (Beer-Lambert)
        // REVISED: Less aggressive attenuation to show the Ferruginous color
        const visibility = Math.max(0.3, 1.0 - depthFactor);

        r *= visibility;
        g *= visibility;
        b *= visibility;

        return [constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255)];
    }

    /**
     * Get breakdown of H2O, Depth, Iron, and Thermal effects for UI
     * REVISED: Now includes thermal effects and precipitate simulation
     */
    getColorBreakdown(chemicals = {}, temperature = 70) {
        const fe2 = chemicals.fe2 || 0;
        const breakdown = [
            {
                name: 'Base H2O',
                effect: 'Azul Cristalino',
                contribution: 'Base',
                color: [0, 80, 160],
                tooltip: "Color intrínseco del agua pura debido a la absorción selectiva del espectro rojo."
            }
        ];

        if (fe2 > 0.05) {
            const precipitateFactor = Math.pow(Math.min(1.0, fe2 / 10), 0.8);
            const contribution = Math.min(80, (precipitateFactor * 100)).toFixed(0);
            breakdown.push({
                name: 'Precipitados Fe',
                effect: 'Verde/Marrón Turbio',
                contribution: '+' + contribution + '%',
                color: [80, 150, 40], // Olive green/brown
                tooltip: "Precipitados de hierro: Fe(OH)2 (verde oliva), FeS (negro verdoso), FeCO3 (marrón). Mucho más visibles que el Fe2+ disuelto."
            });
        }

        // Thermal effects
        if (temperature > 200) {
            const thermalIntensity = Math.min(100, ((temperature - 200) / 200) * 100).toFixed(0);
            breakdown.push({
                name: 'Efecto Térmico',
                effect: 'Tinte Rojizo',
                contribution: '+' + thermalIntensity + '%',
                color: [200, 80, 40],
                tooltip: `Vents calientes (${temperature}°C) emiten tonos rojizos por radiación térmica y oxidación acelerada.`
            });
        } else if (temperature < 50) {
            const coldIntensity = Math.min(100, ((50 - temperature) / 40) * 100).toFixed(0);
            breakdown.push({
                name: 'Efecto Térmico',
                effect: 'Tinte Azulado',
                contribution: '+' + coldIntensity + '%',
                color: [40, 80, 200],
                tooltip: `Vents fríos (${temperature}°C) mantienen tonos azulados por menor actividad química.`
            });
        }

        breakdown.push({
            name: 'Atenuación Prof.',
            effect: 'Absorción Luz',
            contribution: 'Dinámica',
            color: [20, 20, 40],
            tooltip: "Pérdida de intensidad luminosa y cambio cromático (Ley de Beer-Lambert) conforme aumenta la profundidad."
        });

        return breakdown;
    }

    /**
     * Calculate emergent color for a vent plume cell
     * REVISED: Added thermal effects, removed unrealistic H2 shimmer
     */
    getPlumeColor(baseColor, chemicals = {}, temperature = 70, opacity = 150) {
        // Blend base vent color with local chemical signatures
        let [r, g, b] = baseColor;

        // Fe2+ (Iron) makes it more "Iron Smoker" (rusty/greenish)
        if (chemicals.fe2 > 50) {
            r = r * 0.8 + 20;
            g = g * 0.8 + 40;
            b = b * 0.8 + 10;
        }

        // H2S (Sulfides) make it a "Black Smoker" (dark/opaque)
        if (chemicals.h2s > 50) {
            const dark = map(chemicals.h2s, 50, 250, 1.0, 0.2);
            r *= dark; g *= dark; b *= dark;
        }

        // THERMAL EFFECTS (Temperature-based color shift)
        if (temperature > 200) {
            // Hot vents (Black Smokers): Reddish glow
            const thermalIntensity = map(temperature, 200, 400, 0, 30);
            r += thermalIntensity;
            g += thermalIntensity * 0.3; // Less green
            b -= thermalIntensity * 0.5; // Less blue
        } else if (temperature < 50) {
            // Cold vents: Bluer tones
            const coldIntensity = map(temperature, 10, 50, 20, 0);
            b += coldIntensity;
            r -= coldIntensity * 0.3;
        }

        return [r, g, b, opacity];
    }

    /**
     * Calculate emergent mineral color for the chimney itself
     */
    getVentChimneyColor(minerals, intensity = 1.0) {
        if (!minerals || minerals.length === 0) return [100, 100, 100];

        let totalR = 0, totalG = 0, totalB = 0;

        // Weighted average of minerals
        for (let m of minerals) {
            totalR += m.color[0];
            totalG += m.color[1];
            totalB += m.color[2];
        }

        const count = minerals.length;
        const minVis = Math.max(0.2, intensity); // Always show at least 20% structure
        return [
            (totalR / count) * minVis,
            (totalG / count) * minVis,
            (totalB / count) * minVis
        ];
    }
}

// Global instance
window.ventColorSystem = new VentColorSystem();
