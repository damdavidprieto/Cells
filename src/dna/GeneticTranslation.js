/**
 * GeneticTranslation.js
 * ====================
 * El puente entre el genoma (ADN) y el proteoma (Enzimas).
 * Determina qué proteínas sintetiza la célula basándose en sus rasgos.
 */

class GeneticTranslation {
    /**
     * Revisa el ADN de una célula y decide qué enzimas necesita sintetizar.
     * @param {Entity} entity - La célula
     * @param {ChemistrySystem} chemistryRef - Referencia al sistema químico
     */
    static expressGenes(entity, chemistryRef) {
        if (!entity.proteome || !chemistryRef.initialized) return;

        // 1. Expresión Basal: Si tiene un metabolismo habilitado, intenta sintetizar la enzima clave
        const metabolisms = entity.dna.metabolisms;

        for (let metaboId in metabolisms) {
            const config = metabolisms[metaboId];
            if (config.enabled && config.efficiency > 0.5) {
                // Mapear metabolismo a enzima
                const enzymeId = this._mapMetabolismToEnzyme(metaboId);
                const enzyme = chemistryRef.getEnzyme(enzymeId);

                if (enzyme) {
                    // Si tiene poca cantidad de la enzima, intenta sintetizar más
                    const current = entity.proteome.proteins.get(enzyme.id);
                    const currentCount = current ? current.count : 0;

                    // Lógica simple: mantener un pool de N enzimas según eficiencia
                    const targetCount = Math.floor(config.efficiency * 20);

                    if (currentCount < targetCount) {
                        entity.proteome.synthesize(enzyme);
                    }
                }
            }
        }
    }

    /**
     * Mapeo de rasgos metabólicos a IDs de enzimas científicas
     */
    static _mapMetabolismToEnzyme(metabolismId) {
        const mapping = {
            'luca': 'hydrogenase',
            'methanogenesis': 'hydrogenase', // Simplificado
            'oxigenicPhotosynthesis': 'rubisco',
            'aerobicRespiration': 'cytochrome_oxidase',
            'sulfurOxidation': 'hydrogenase' // Falta enzima específica
        };
        return mapping[metabolismId] || null;
    }
}
