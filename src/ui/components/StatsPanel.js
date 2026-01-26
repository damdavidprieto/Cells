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
<div id="stats-panel" class="panel stats-panel">
    <!-- EXIT BUTTON (Top Right) -->
    <button id="exit-btn" class="btn-danger" style="position: fixed; top: 15px; right: 20px; z-index: 10000; padding: 8px 15px; background: #e74c3c; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
        🚪 SALIR
    </button>

    <div class="stats-header">
        <span class="icon">⏳</span> <span id="time-display">4.000 Ga</span>
    </div>
        
        <div style="font-size: 0.8em; color: #888; margin-bottom: 5px;">Frame: <span id="frame-count">0</span></div>

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
        
        <p style="margin-top: 15px;"><strong>Evolución</strong></p>
        <p>SOD Medio: <span id="sod-count">0</span></p>
    </div>
</div>`;

        parent.insertAdjacentHTML('beforeend', html);
        this.container = document.getElementById('stats-panel');

        // Inicialmente oculto
        if (this.container) this.container.style.display = 'none';

        // Hide Exit Button initially (Only for in-game)
        const btnExit = document.getElementById('exit-btn');
        if (btnExit) btnExit.style.display = 'none';

        if (btnExit) {
            btnExit.addEventListener('click', () => {
                // Return to Main Menu
                if (confirm('¿Volver al menú principal? (Se perderá el progreso actual)')) {
                    location.reload();
                }
            });
        }
    }

    show() {
        if (this.container) this.container.style.display = 'block';
        const btnExit = document.getElementById('exit-btn');
        if (btnExit) btnExit.style.display = 'block';
    }

    hide() {
        if (this.container) this.container.style.display = 'none';
        const btnExit = document.getElementById('exit-btn');
        if (btnExit) btnExit.style.display = 'none';
    }

    /**
     * Actualiza los valores de la interfaz.
     * Se llama desde el bucle de juego (Sketch.js).
     */
    update(stats) {
        if (!this.container || this.container.style.display === 'none') return;

        // TIEMPO GEOLÓGICO
        // Inicio: 4.0 Ga (4,000 Millones de años)
        // Velocidad: 1,000 años por frame
        const startYear = 4000000000;
        const yearsPassed = frameCount * 1000;
        const currentYear = startYear - yearsPassed;
        const gaDisplay = (currentYear / 1000000000).toFixed(3) + " Ga";

        this.setSafeText('time-display', gaDisplay);
        this.setSafeText('frame-count', frameCount);

        this.setSafeText('entity-count', stats.entityCount);
        this.setSafeText('species-count', stats.speciesCount);
        this.setSafeText('luca-count', stats.lucaCount);
        this.setSafeText('fermentation-count', stats.fermentationCount);
        this.setSafeText('chemosynthesis-count', stats.chemosynthesisCount);
        // Resources are now passed as AVERAGES (floats), so we need decimals
        let o2Val = typeof stats.totalOxygen === 'number' ? stats.totalOxygen : 0;

        // SEMÁFORO DE LETALIDAD (O2)
        // SEMÁFORO DE LETALIDAD (O2)
        let semaphor = '🟢'; // Safe (<10)
        let title = 'Tolerable (Safe Zone)';

        if (o2Val >= 20) {
            semaphor = '<span style="color: #ff3333; text-shadow: 0 0 5px red;">🔴 LETHAL</span>';
            title = 'STERILIZATION ZONE';
        } else if (o2Val >= 10) {
            semaphor = '<span style="color: #ffaa00; text-shadow: 0 0 5px orange;">🟠 WARNING</span>';
            title = 'Adaptation Required';
        } else {
            semaphor = '<span style="color: #33ff33; text-shadow: 0 0 5px green;">🟢 SAFE</span>';
        }

        this.setSafeTextHTML('oxygen-count', `${o2Val.toFixed(2)} ${semaphor}`);

        // Optional: Update tooltip or title if possible, but innerText is simple
        const o2El = document.getElementById('oxygen-count');
        if (o2El) o2El.title = title;

        this.setSafeText('nitrogen-count', typeof stats.totalNitrogen === 'number' ? stats.totalNitrogen.toFixed(2) : '0.00');
        this.setSafeText('phosphorus-count', typeof stats.totalPhosphorus === 'number' ? stats.totalPhosphorus.toFixed(2) : '0.00');

        // New: Average SOD
        // New: Average SOD
        let sodVal = typeof stats.avg_sod === 'number' ? stats.avg_sod : 0;
        this.setSafeText('sod-count', (sodVal * 100).toFixed(1) + '%');
    }

    setSafeText(id, value) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    setSafeTextHTML(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }
}
