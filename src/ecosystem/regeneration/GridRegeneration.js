/**
 * GRID REGENERATION - Resource Regeneration Logic
 * ================================================
 * 
 * Handles regeneration of resources over time:
 * - Light (constant regeneration from sunlight)
 * - Nitrogen (slow regeneration in sediment)
 * - Phosphorus (very slow regeneration in sediment)
 * - H₂ (continuous production in vents)
 * - O₂ (photolysis UV in surface) - NEW
 */
class GridRegeneration {
    /**
     * Regenerate light (constant from sunlight)
     * 
     * SCIENTIFIC BASIS - Primordial Ocean Light Penetration:
     * ═══════════════════════════════════════════════════════════════════
     * 
     * 1. SUNLIGHT IN ARCHEAN ERA (4.0-3.5 Ga):
     *    - Young Sun was ~25-30% dimmer than modern (Faint Young Sun Paradox)
     *    - BUT: No ozone layer → More UV penetration
     *    - Greenhouse gases (CH₄, CO₂) compensated for dimmer sun
     *    - Net result: Similar total energy to modern oceans
     * 
     * 2. LIGHT ATTENUATION IN WATER (Beer-Lambert Law):
     *    I(z) = I₀ × e^(-k×z)
     *    - I₀ = Surface intensity (100 in simulation)
     *    - k = Attenuation coefficient (4 in simulation)
     *    - z = Depth (depthRatio)
     * 
     *    Real ocean attenuation:
     *    - Clear water: k ≈ 0.04 m⁻¹ (light penetrates ~100m)
     *    - Primordial ocean: k ≈ 0.1-0.5 m⁻¹ (more turbid, Fe²⁺ rich)
     *    - Simulation uses k=4 (compressed scale for gameplay)
     * 
     * 3. EXPONENTIAL DECAY JUSTIFICATION:
     *    Surface (j=0):     100 × e^(-4×0) = 100 (full sunlight)
     *    Mid-depth (j=0.5): 100 × e^(-4×0.5) = 13.5 (13.5% of surface)
     *    Bottom (j=1.0):    100 × e^(-4×1) = 1.8 (1.8% of surface)
     * 
     *    ✅ REALISTIC: Matches exponential light decay in real oceans
     * 
     * 4. REGENERATION RATE (0.5/frame):
     *    - Sunlight is CONSTANT (doesn't deplete)
     *    - Regeneration simulates continuous solar input
     *    - Rate 0.5/frame balances consumption by cells
     * 
     *    Balance analysis:
     *    - 1 cell consumes ~1.5-2.0 light/frame (fermentation)
     *    - Grid cell regenerates 0.5/frame
     *    - Ratio: 1 grid cell supports ~0.25-0.33 cells
     *    - ✅ BALANCED: Creates resource competition
     * 
     * REFERENCES:
     * - Kasting, J. F. (1993). Earth's early atmosphere. Science.
     * - Sagan & Chyba (1997). The early faint sun paradox.
     * - Cockell, C. S. (2000). The ultraviolet history of the terrestrial planets.
     * 
     * IMPLEMENTATION:
     * ═══════════════════════════════════════════════════════════════════
     */
    static regenerateLight(environment) {
        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {
                // 1. CALCULAR PROFUNDIDAD NORMALIZADA (0.0 = superficie, 1.0 = fondo)
                // ¿Qué hace?: Convierte índice de fila (j) a ratio de profundidad
                // ¿Por qué?: Permite aplicar fórmula exponencial independiente de resolución
                let depthRatio = j / environment.rows;

                // 2. CALCULAR LUZ MÁXIMA EN ESTA PROFUNDIDAD (Beer-Lambert Law)
                // ¿Qué hace?: I(z) = 100 × e^(-4 × depthRatio)
                // ¿Por qué?: Luz decae exponencialmente con profundidad (física real)
                // Efecto en juego: Superficie = 100, Media profundidad = 13.5, Fondo = 1.8
                //                  → Presión evolutiva para vivir en superficie (más luz)
                let maxLight = 100 * exp(-4 * depthRatio);

                // 3. REGENERAR LUZ SI ESTÁ POR DEBAJO DEL MÁXIMO
                // ¿Qué hace?: Añade 0.5 unidades de luz si está por debajo del máximo
                // ¿Por qué?: Simula entrada constante de luz solar (no se agota)
                // Efecto en juego: Luz se regenera continuamente (recurso renovable)
                //                  Pero tasa (0.5) < consumo célula (1.5-2.0)
                //                  → Competencia por luz en zonas pobladas
                if (environment.lightGrid[i][j] < maxLight) {
                    environment.lightGrid[i][j] += 0.5;
                }
            }
        }
    }

    /**
     * Regenerate nitrogen (slow, in sediment only)
     * BALANCE FIX: Doubled regeneration rate for viable LUCA environment
     */
    static regenerateNitrogen(environment) {
        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {
                if (j >= environment.sedimentRow) {
                    // Only regenerate in sediment zone
                    // SCIENTIFIC UPDATE: Nitrogen Fixation at Vents
                    // Ammonia (NH4+) is produced continuously at alkaline vents
                    environment.nitrogenGrid[i][j] += GameConstants.VENT_NITROGEN_FLUX;
                    environment.nitrogenGrid[i][j] = min(environment.nitrogenGrid[i][j], GameConstants.NITROGEN_GRID_MAX);
                }
            }
        }
    }

    /**
     * Regenerate phosphorus (delegates to PhosphorusRegeneration module)
     * See PhosphorusRegeneration.js for detailed scientific documentation
     */
    static regeneratePhosphorus(environment) {
        PhosphorusRegeneration.regenerate(environment);
    }

    /**
     * Regenerate H₂ (continuous production in vents)
     * Hydrothermal activity produces H₂ continuously
     * SCIENTIFIC FIX: H₂ diffuses upward from vents (Sleep et al. 2011)
     * Not confined to sediment - creates vertical gradient
     */
    static regenerateH2(environment) {
        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {
                if (j >= environment.sedimentRow) {
                    // Sediment zone (vents): High production
                    environment.h2Grid[i][j] += GameConstants.H2_VENT_PRODUCTION;
                    environment.h2Grid[i][j] = min(environment.h2Grid[i][j], GameConstants.H2_MAX_ACCUMULATION);
                }
                // REMOVED: Fake random diffusion. Now handled by proper DiffusionSystem.
            }
        }
    }

    /**
     * Regenerate O₂ (delegates to OxygenRegeneration module)
     * See OxygenRegeneration.js for detailed scientific documentation
     */
    static regenerateOxygen(environment) {
        OxygenRegeneration.regenerate(environment);
    }
}
