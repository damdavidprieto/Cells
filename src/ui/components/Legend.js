/**
 * Componente: Leyenda
 * Muestra la guía de colores para identificar células y recursos.
 */
class Legend {
    constructor() { }

    mount(parentId) {
        const parent = document.getElementById(parentId);
        if (!parent) return;

        // HTML inline (sin necesidad de fetch)
        const html = `
<div id="legend">
    <h2>Leyenda</h2>

    <div class="legend-section">
        <h3>Tipos Celulares (Metabolismo)</h3>
        <div class="legend-item">
            <div class="legend-color" style="background-color: rgb(200, 200, 220);"></div>
            <span>LUCA - Heterótrofo</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: rgb(180, 100, 150);"></div>
            <span>Fermentación (Anaeróbico)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: rgb(150, 200, 100);"></div>
            <span>Quimiosíntesis (H₂ + CO₂)</span>
        </div>
    </div>

    <div class="legend-section">
        <h3>Orgánulos (Puntos Internos)</h3>
        <div class="legend-item">
            <div class="legend-color" style="background-color: rgba(255, 255, 255, 0.8); border: 1px solid #666; width: 10px; height: 10px; border-radius: 50%;"></div>
            <span>Ribosomas (Universal)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: rgba(180, 80, 200, 0.8); border: 1px solid #666; width: 10px; height: 10px; border-radius: 50%;"></div>
            <span>Hidrogenosomas (Ferm.)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: rgba(200, 220, 100, 0.8); border: 1px solid #666; width: 10px; height: 10px; border-radius: 50%;"></div>
            <span>Enzimas Quimio (Quimio.)</span>
        </div>
    </div>

    <div class="legend-section">
        <h3>Recursos (Ambiente)</h3>
        <div class="legend-item">
            <div class="legend-color" style="background: linear-gradient(to right, transparent, rgba(0, 255, 255, 0.5)); border: 1px solid #333;"></div>
            <span>Oxígeno (Cian)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: linear-gradient(to right, transparent, rgba(0, 255, 0, 0.5)); border: 1px solid #333;"></div>
            <span>Hidrógeno - H₂ (Verde)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: linear-gradient(to right, transparent, rgba(160, 0, 160, 0.5)); border: 1px solid #333;"></div>
            <span>CO₂ (Púrpura)</span>
        </div>
    </div>

    <div class="legend-section">
        <h3>Zonas</h3>
        <div class="legend-item">
            <div class="legend-color" style="background-color: rgb(200, 230, 255);"></div>
            <span>Atmósfera (Gas)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: linear-gradient(to bottom, rgb(20, 60, 120), rgb(5, 15, 30));"></div>
            <span>Agua (Habitable)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background-color: rgb(50, 20, 10);"></div>
            <span>Sedimento (Residuos)</span>
        </div>
    </div>
</div>`;

        parent.insertAdjacentHTML('beforeend', html);
    }

    show() {
        const el = document.getElementById('legend');
        if (el) el.style.display = 'block';
    }

    hide() {
        const el = document.getElementById('legend');
        if (el) el.style.display = 'none';
    }

    /**
     * Destruye el componente y lo elimina del DOM
     */
    destroy() {
        const el = document.getElementById('legend');
        if (el) {
            el.remove();
        }
    }
}
