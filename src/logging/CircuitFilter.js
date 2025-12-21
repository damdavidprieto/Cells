/**
 * CIRCUIT FILTER - Filtrado de Logs por Circuito
 * ================================================
 * 
 * Define los circuitos (mecánicas) del juego y filtra eventos de logging
 * según qué circuitos están habilitados.
 */

class CircuitFilter {
    /**
     * Definición de circuitos disponibles
     * Cada circuito agrupa eventos relacionados con una mecánica específica
     */
    static CIRCUITS = {
        // Metabolismo y Energía
        metabolism: {
            description: 'Resource consumption, energy generation, metabolic costs',
            events: [
                'resource_consumption',
                'energy_balance',
                'metabolic_cost',
                'sod_cost'
            ]
        },

        // Reproducción
        reproduction: {
            description: 'Cell division, DNA inheritance, mutations',
            events: [
                'reproduction_attempt',
                'reproduction_success',
                'reproduction_failure',
                'dna_comparison',
                'mutation_event'
            ]
        },

        // Muerte
        death: {
            description: 'Cell death causes and state at death',
            events: [
                'death_event',
                'death_cause',
                'missing_resources',
                'final_state'
            ]
        },

        // Oxígeno y SOD
        oxygen: {
            description: 'O₂ levels, oxidative damage, SOD activity',
            events: [
                'oxygen_level',
                'oxidative_damage',
                'sod_state',
                'sod_synthesis'
            ]
        },

        // Fósforo
        phosphorus: {
            description: 'P consumption, recycling, availability',
            events: [
                'phosphorus_consumption',
                'phosphorus_recycling',
                'phosphorus_depletion'
            ]
        },

        // UV y DNA Repair
        uv_damage: {
            description: 'UV radiation damage and repair',
            events: [
                'uv_event',
                'dna_repair',
                'uv_mutations',
                'uv_death'
            ]
        },

        // Movimiento
        movement: {
            description: 'Cell position, velocity, collisions',
            events: [
                'position_update',
                'collision_event',
                'boundary_bounce'
            ]
        },

        // Ambiente
        environment: {
            description: 'Resource grids, regeneration',
            events: [
                'grid_state',
                'regeneration_event',
                'fe2_oxidation'
            ]
        }
    };

    /**
     * Verifica si un evento debe ser loggeado según circuitos activos
     * 
     * @param {string} eventType - Tipo de evento (ej. 'death_event')
     * @param {Array<string>} enabledCircuits - Circuitos habilitados (ej. ['death', 'reproduction'])
     * @returns {boolean} - true si el evento debe ser loggeado
     */
    static shouldLog(eventType, enabledCircuits) {
        // Si 'all' está habilitado, loggear todo
        if (enabledCircuits.includes('all')) {
            return true;
        }

        // Buscar en qué circuito está el evento
        for (let circuitName of enabledCircuits) {
            let circuit = this.CIRCUITS[circuitName];
            if (circuit && circuit.events.includes(eventType)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Obtiene lista de todos los circuitos disponibles
     * @returns {Array<string>} - Nombres de circuitos
     */
    static getAvailableCircuits() {
        return Object.keys(this.CIRCUITS);
    }

    /**
     * Obtiene descripción de un circuito
     * @param {string} circuitName - Nombre del circuito
     * @returns {string} - Descripción
     */
    static getCircuitDescription(circuitName) {
        return this.CIRCUITS[circuitName]?.description || 'Unknown circuit';
    }
}
