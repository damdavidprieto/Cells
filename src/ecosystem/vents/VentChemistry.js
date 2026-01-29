/**
 * VentChemistry.js
 * ================
 * Expanded chemical definitions and reactions for hydrothermal vents.
 * Includes pH, redox potential, and multi-chemical interactions.
 * 
 * Scientific References:
 * - Martin & Russell (2007) - Alkaline hydrothermal vents
 * - Kelley et al. (2005) - Lost City hydrothermal field
 * - Von Damm (1990) - Black smoker chemistry
 */
class VentChemistry {
    /**
     * Get chemical flux for a specific chemical at a vent
     */
    static getChemicalFlux(vent, chemical, env) {
        const baseFlux = this._getBaseFlux(chemical);
        const typeMultiplier = vent.type.chemicals[chemical] || 0;
        const intensity = vent.intensity * (GameConstants.VENTS?.GLOBAL_FLUX_MULTIPLIER || 1.0);
        const envMultiplier = env.fluxMultipliers?.[chemical] || 1.0;
        const lifecycleMultiplier = vent.lifecycle?.getIntensityMultiplier() || 1.0;

        return baseFlux * typeMultiplier * intensity * envMultiplier * lifecycleMultiplier;
    }

    /**
     * Base flux rates for each chemical (units per frame)
     */
    static _getBaseFlux(chemical) {
        const fluxRates = {
            h2: GameConstants.VENTS?.H2_BASE_FLUX || 5.0,
            co2: GameConstants.VENTS?.CO2_BASE_FLUX || 2.0,
            fe2: GameConstants.VENTS?.FE2_BASE_FLUX || 1.0,
            ch4: 1.5,  // Methane
            h2s: 2.0,  // Hydrogen sulfide
            nh3: 1.0,  // Ammonia
            ca: 0.5,   // Calcium
            mg: 0.5,   // Magnesium
            silica: 0.3 // Silica
        };

        return fluxRates[chemical] || 0;
    }

    /**
     * Get maximum accumulation for a chemical
     */
    static getMaxAccumulation(chemical) {
        const maxValues = {
            h2: GameConstants.H2_MAX_ACCUMULATION || 250,
            co2: GameConstants.CO2_MAX_ACCUMULATION || 150,
            fe2: 1000,
            ch4: 200,
            h2s: 300,
            nh3: 150,
            ca: 500,
            mg: 500,
            silica: 400
        };

        return maxValues[chemical] || 100;
    }

    /**
     * Calculate mixing zone reactions between two vents
     */
    static calculateMixingReactions(vent1, vent2, mixingCells, env) {
        // Alkaline + Acidic = Precipitation
        if (this._isAlkaline(vent1) && this._isAcidic(vent2)) {
            this._applyPrecipitation(mixingCells, env);
        }

        // H2S + Fe2 = FeS precipitation (black smoker chemistry)
        if (this._hasH2S(vent1) && this._hasFe2(vent2)) {
            this._applyIronSulfidePrecipitation(mixingCells, env);
        }

        // Methane oxidation (if O2 present)
        if (this._hasCH4(vent1) || this._hasCH4(vent2)) {
            this._applyMethaneOxidation(mixingCells, env);
        }
    }

    static _isAlkaline(vent) {
        return vent.type.ph && vent.type.ph > 9;
    }

    static _isAcidic(vent) {
        return vent.type.ph && vent.type.ph < 6;
    }

    static _hasH2S(vent) {
        return vent.type.chemicals.h2s && vent.type.chemicals.h2s > 0.5;
    }

    static _hasFe2(vent) {
        return vent.type.chemicals.fe2 && vent.type.chemicals.fe2 > 0.5;
    }

    static _hasCH4(vent) {
        return vent.type.chemicals.ch4 && vent.type.chemicals.ch4 > 0.5;
    }

    static _applyPrecipitation(cells, env) {
        // Carbonate precipitation (consumes Ca, Mg)
        for (let cell of cells) {
            if (env.fe2Grid && env.fe2Grid[cell.x]) {
                env.fe2Grid[cell.x][cell.y] *= 0.95; // 5% precipitation
            }
        }
    }

    static _applyIronSulfidePrecipitation(cells, env) {
        // FeS formation (black smoker chimneys)
        for (let cell of cells) {
            if (env.fe2Grid && env.fe2Grid[cell.x]) {
                env.fe2Grid[cell.x][cell.y] *= 0.9; // 10% precipitation
            }
        }
    }

    static _applyMethaneOxidation(cells, env) {
        // CH4 + 2O2 → CO2 + 2H2O
        for (let cell of cells) {
            if (env.oxygenGrid && env.oxygenGrid[cell.x] && env.oxygenGrid[cell.x][cell.y] > 10) {
                // Consume oxygen, produce CO2
                const oxidationRate = 0.1;
                env.oxygenGrid[cell.x][cell.y] *= (1 - oxidationRate);

                if (env.co2Grid && env.co2Grid[cell.x]) {
                    env.co2Grid[cell.x][cell.y] += oxidationRate * 5;
                }
            }
        }
    }
}
