/**
 * Componente: Panel de Estadísticas
 * Muestra información en tiempo real sobre la población y recursos.
 */
class StatsPanel {
    constructor() {
        this.container = null;
    }

    mount(parentId) {
        const parent = document.getElementById(parentId);
        if (!parent) return;

        // HTML inline (sin necesidad de fetch)
        const html = `
<div id="ui-layer">
    <div id="stats">
        <p><strong>Población</strong></p>
        <p>Células Totales: <span id="entity-count">0</span></p>
        <p>Especies: <span id="species-count">0</span></p>

        <p style="margin-top: 15px;"><strong>Tipos Celulares</strong></p>
        <p>LUCA: <span id="luca-count">0</span></p>
        <p>Fermentación: <span id="fermentation-count">0</span></p>
        <p>Quimiosíntesis: <span id="chemosynthesis-count">0</span></p>

        <p style="margin-top: 15px;"><strong>Recursos Ambientales</strong></p>
        <p>Oxígeno: <span id="oxygen-count">0</span></p>
        <p>Nitrógeno: <span id="nitrogen-count">0</span></p>
        <p>Fósforo: <span id="phosphorus-count">0</span></p>

    </div>
</div>`;

        parent.insertAdjacentHTML('beforeend', html);
        this.container = document.getElementById('ui-layer');

        // Inicialmente oculto
        if (this.container) this.container.style.display = 'none';
    }

    show() {
        if (this.container) this.container.style.display = 'block';
    }

    hide() {
        if (this.container) this.container.style.display = 'none';
    }

    /**
     * Actualiza los valores de la interfaz.
     * Se llama desde el bucle de juego (Sketch.js).
     */
    update(stats) {
        if (!this.container || this.container.style.display === 'none') return;

        this.setSafeText('entity-count', stats.entityCount);
        this.setSafeText('species-count', stats.speciesCount);
        this.setSafeText('luca-count', stats.lucaCount);
        this.setSafeText('fermentation-count', stats.fermentationCount);
        this.setSafeText('chemosynthesis-count', stats.chemosynthesisCount);
        this.setSafeText('oxygen-count', Math.floor(stats.totalOxygen));
        this.setSafeText('nitrogen-count', Math.floor(stats.totalNitrogen));
        this.setSafeText('phosphorus-count', Math.floor(stats.totalPhosphorus));
    }

    setSafeText(id, value) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }
}
