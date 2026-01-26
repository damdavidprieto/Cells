/**
 * Detector de Anomalías (Game Sanitizer)
 * =====================================
 * Escanea el estado del juego en busca de valores imposibles, corrupción de datos
 * o violaciones de las leyes físicas/biológicas.
 */
class AnomalyDetector {

    /**
     * Ejecuta un escaneo completo de la simulación.
     * @param {Array} entities - Lista de células activas
     * @param {Object} environment - Estado del entorno
     * @returns {Array} Lista de anomalías encontradas
     */
    static scan(entities, environment) {
        let anomalies = [];

        // 1. Verificar Entidades
        entities.forEach(entity => {
            const report = this.checkEntity(entity);
            if (report) {
                anomalies.push(report);
            }
        });

        // 2. Verificar Entorno (Opcional, costoso si se recorre todo el grid)
        // Podríamos comprobar solo valores globales o una muestra aleatoria.

        return anomalies;
    }

    static checkEntity(e) {
        // A. INTEGRIDAD DE DATOS (CRITICAL)
        if (isNaN(e.pos.x) || isNaN(e.pos.y)) {
            return {
                type: 'DATA_CORRUPTION',
                severity: 'CRITICAL',
                targetId: e.id,
                details: { issue: 'NaN coordinates', pos: e.pos }
            };
        }

        if (!e.dna) {
            return {
                type: 'DATA_CORRUPTION',
                severity: 'CRITICAL',
                targetId: e.id,
                details: { issue: 'Missing DNA' }
            };
        }

        // B. VIOLACIONES FÍSICAS (WARNING)
        if (e.energy === Infinity || e.energy === -Infinity) {
            return {
                type: 'PHYSICS',
                severity: 'CRITICAL',
                targetId: e.id,
                details: { issue: 'Infinite Energy', val: e.energy }
            };
        }

        // C. VIOLACIONES BIOLÓGICAS (WARNING)
        // "Zombie Check": Energía muy negativa y no marcado como muerto
        if (e.energy < -50 && !e.isDead) {
            return {
                type: 'BIOLOGY',
                severity: 'WARNING',
                targetId: e.id,
                details: { issue: 'Zombie Cell (Negative Energy Alive)', energy: e.energy }
            };
        }

        // "Tardis Check": Edad negativa
        if (e.age < 0) {
            return {
                type: 'BIOLOGY',
                severity: 'INFO',
                targetId: e.id,
                details: { issue: 'Negative Age', age: e.age }
            };
        }

        return null; // Todo OK
    }
}
