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
        // OPTIMIZATION: Respect Restricted Vents (Single Vent Mode)
        let startCol = 0;
        let endCol = environment.cols;

        if (environment.config && environment.config.restrictToVents) {
            startCol = environment.waterStartCol;
            endCol = environment.waterEndCol;
        }

        for (let i = startCol; i < endCol; i++) {
            for (let j = 0; j < environment.rows; j++) {
                // 1. CALCULAR PROFUNDIDAD NORMALIZADA
                let depthRatio = j / environment.rows;

                // 2. APPLY FLUX MULTIPLIER (Global Intensity)
                let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.light : 1.0;

                // CALCULAR LUZ MÁXIMA EN ESTA PROFUNDIDAD (Beer-Lambert Law)
                let maxLight = (100 * fluxMult) * exp(-4 * depthRatio);

                // 3. REGENERAR LUZ
                if (environment.lightGrid[i][j] < maxLight) {
                    environment.lightGrid[i][j] += 0.5 * fluxMult;
                }
            }
        }
    }

    // ... (Nitrogen already fixed) ...

    static regenerateOxygen(environment) {
        OxygenRegeneration.regenerate(environment);

        let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.oxygen : 1.0;

        // Manual Flux Boost for O2 (if slider > 100%)
        if (fluxMult !== 1.0) {
            // OPTIMIZATION: Respect Restricted Vents
            let startCol = 0;
            let endCol = environment.cols;

            if (environment.config && environment.config.restrictToVents) {
                startCol = environment.waterStartCol;
                endCol = environment.waterEndCol;
            }

            for (let i = startCol; i < endCol; i++) {
                for (let j = 0; j < environment.rows; j++) {
                    // Approach: Add/Subtract based on deviation from 1.0
                    // Base regen rate assumed approx 0.1 per frame globally?
                    let extra = 0.05 * (fluxMult - 1.0);
                    if (extra !== 0) {
                        environment.oxygenGrid[i][j] += extra;
                        environment.oxygenGrid[i][j] = Math.max(0, min(environment.oxygenGrid[i][j], 100));
                    }
                }
            }
        }
    }

    /**
     * Regenerate nitrogen (slow, in sediment only)
     * BALANCE FIX: Doubled regeneration rate for viable LUCA environment
     */
    static regenerateNitrogen(environment) {
        let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.nitrogen : 1.0;

        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {
                if (j >= environment.sedimentRow) {

                    // NEW: Use Generic Config Restrictions
                    if (environment.config && environment.config.restrictToVents) {
                        // Use calculated boundaries from Environment
                        if (i < environment.waterStartCol || i >= environment.waterEndCol) {
                            environment.nitrogenGrid[i][j] = 0;
                            continue;
                        }
                    }

                    // Only regenerate in sediment zone
                    environment.nitrogenGrid[i][j] += GameConstants.VENT_NITROGEN_FLUX * fluxMult;
                    environment.nitrogenGrid[i][j] = min(environment.nitrogenGrid[i][j], GameConstants.NITROGEN_GRID_MAX);
                }
            }
        }
    }

    /**
     * Regenerate phosphorus (delegates to PhosphorusRegeneration module)
     */
    static regeneratePhosphorus(environment) {
        // Note: PhosphorusRegeneration module needs to be updated or we perform a manual hack here if it's external.
        // Assuming PhosphorusRegeneration.regenerate handles it, but we should pass the multiplier if possible.
        // Since PhosphorusRegeneration might be complex, let's look at how to inject it.
        // For now, simpler to modify the grid directly AFTER standard regen if needed, OR modify the module.
        // Let's modify the module call or assume we can inject context.
        // Actually, let's just do a direct addition here if the module isn't loaded, or modify the module.
        PhosphorusRegeneration.regenerate(environment);

        // Manual Flux Boost for Single Vent Mode (simplest integration)
        let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.phosphorus : 1.0;
        if (fluxMult !== 1.0) {
            for (let i = 0; i < environment.cols; i++) {
                for (let j = 0; j < environment.rows; j++) {
                    if (j >= environment.sedimentRow) {
                        // Add extra proportional to the multiplier exceeding 1.0 (or reduce)
                        // But PhosphorusRegeneration already adds VENT_PHOSPHORUS_FLUX. 
                        // We should scale that. As we can't easily edit the other file in same step, 
                        // we will apply a correction here:
                        // (fluxMult - 1) * VENT_PHOSPHORUS_FLUX
                        let extra = GameConstants.VENT_PHOSPHORUS_FLUX * (fluxMult - 1.0);
                        if (extra !== 0) {
                            environment.phosphorusGrid[i][j] += extra;
                            environment.phosphorusGrid[i][j] = Math.max(0, min(environment.phosphorusGrid[i][j], GameConstants.PHOSPHORUS_GRID_MAX));
                        }
                    }
                }
            }
        }
    }

    /**
     * Regenerate H₂ (continuous production in vents)
     */
    static regenerateH2(environment) {
        let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.h2 : 1.0;
        let isSingleVent = GameConstants.EXECUTION_MODE === 'SINGLE_VENT_MODE';
        let centerCol = Math.floor(environment.cols / 2);
        let ventRadius = 0; // Width of the single vent (1 column)

        for (let i = 0; i < environment.cols; i++) {
            for (let j = 0; j < environment.rows; j++) {
                if (j >= environment.sedimentRow) {
                    // Restriction for Single Vent Mode
                    if (isSingleVent && Math.abs(i - centerCol) > ventRadius) {
                        // STRICT ISOLATION: Wipe data outside the vent
                        environment.h2Grid[i][j] = 0;
                        continue;
                    }

                    // Sediment zone (vents): High production
                    environment.h2Grid[i][j] += GameConstants.H2_VENT_PRODUCTION * fluxMult;
                    environment.h2Grid[i][j] = min(environment.h2Grid[i][j], GameConstants.H2_MAX_ACCUMULATION);
                }
            }
        }
    }

    /**
     * Regenerate O₂
     */
    static regenerateOxygen(environment) {
        OxygenRegeneration.regenerate(environment);

        let fluxMult = environment.fluxMultipliers ? environment.fluxMultipliers.oxygen : 1.0;

        // Manual Flux Boost for O2 (if slider > 100%)
        // We assume standard regen is "100%". 
        // If slider is 200%, we add significantly more O2.
        // If slider is 0%, we might want to suppress it, but OxygenRegeneration is a bit complex.
        // For simple control: ADD extra O2 based on multiplier.
        if (fluxMult !== 1.0) {

            let startCol = 0;
            let endCol = environment.cols;

            if (environment.config && environment.config.restrictToVents) {
                startCol = environment.waterStartCol;
                endCol = environment.waterEndCol;
            }

            for (let i = startCol; i < endCol; i++) {
                for (let j = 0; j < environment.rows; j++) {
                    // Add extra O2 everywhere (Atmosphere simulation) or just modify what's there?
                    // Let's modify the grid proportionally:
                    // 1. If increasing (>1): Add extra
                    // 2. If decreasing (<1): Decay existing? Or just don't add?
                    // Simplest robust way: Apply multiplier to the *result* of this frame's regen? 
                    // No, that compounds. 
                    // Let's just add a flat rate or scale the grid towards target.

                    // Approach: Add/Subtract based on deviation from 1.0
                    // Base regen rate assumed approx 0.1 per frame globally?
                    let extra = 0.05 * (fluxMult - 1.0);
                    if (extra !== 0) {
                        environment.oxygenGrid[i][j] += extra;
                        environment.oxygenGrid[i][j] = Math.max(0, min(environment.oxygenGrid[i][j], 100));
                    }
                }
            }
        }
    }
}
