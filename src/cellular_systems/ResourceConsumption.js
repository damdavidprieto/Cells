// Resource Consumption - Maneja el consumo de recursos del ambiente
class ResourceConsumption {
    static consume(entity, environment) {
        // ═══════════════════════════════════════════════════════════════════
        // DEPRECATED METABOLIC LOGIC (FIX FOR DOUBLE CONSUMPTION BUG)
        // ═══════════════════════════════════════════════════════════════════
        // Metabolic consumption (H2, CO2, etc.) is now handled exclusively by 
        // MetabolicCosts.js to avoid double consumption of grid resources.
        //
        // This method remains for potential future non-metabolic consumption
        // (e.g., predation, endocytosis) but currently does nothing for
        // standard metabolism.
        //
        // PREVIOUSLY: This method consumed H2/CO2 and added energy.
        // MetabolicCosts.js ALSO consumed H2/CO2 and calculated costs.
        // This caused resources to deplete 2x faster than intended.
        // ═══════════════════════════════════════════════════════════════════

        // DEBUG: Ensure we don't accidentally consume doubling up
        // if (entity.id === 0 && frameCount % 60 === 0) {
        //     // console.log('[ResourceConsumption] Deprecated method called - no action taken');
        // }
    }
}
