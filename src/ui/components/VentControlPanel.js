/**
 * Componente: Panel de Control del Vent (VentControlPanel)
 * Permite controlar la intensidad del flujo de TODOS los recursos en el modo Single Vent.
 */
class VentControlPanel {
    constructor() {
        this.container = null;
        this.sliders = {};
        this.isVisible = false;

        // Configuration for all sliders
        this.resources = [
            { id: 'h2', label: 'H₂ (Vents)', color: '#4ca1af', default: 100 },
            { id: 'co2', label: 'CO₂ (Atm)', color: '#9b59b6', default: 100 },
            { id: 'oxygen', label: 'O₂ (Air)', color: '#3498db', default: 100 },
            { id: 'nitrogen', label: 'N (Sedi)', color: '#e67e22', default: 100 },
            { id: 'phosphorus', label: 'P (Rock)', color: '#e74c3c', default: 100 },
            { id: 'light', label: 'Light', color: '#f1c40f', default: 100 },
            { id: 'temperature', label: 'Temp', color: '#e84393', default: 100 }
        ];
    }

    mount(parentId) {
        const parent = document.getElementById(parentId);
        if (!parent) return;

        let slidersHtml = this.resources.map(res => `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-size: 11px; width: 70px; text-align: left; color: ${res.color};">${res.label}</span>
                <input type="range" id="slider-${res.id}" min="0" max="500" value="${res.default}" style="width: 120px; height: 4px;">
                <span id="value-${res.id}" style="font-size: 11px; font-weight: bold; width: 40px; text-align: right; color: #555;">${res.default}%</span>
            </div>
        `).join('');

        const html = `
<div id="vent-control-panel" class="panel stats-panel" style="top: 10px; left: 50%; transform: translateX(-50%); width: 280px; text-align: center; display: none; background: rgba(20, 30, 45, 0.95); border: 1px solid rgba(100, 200, 255, 0.4); border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); padding: 10px; z-index: 1000; position: absolute;">
    <h3 style="margin: 0 0 10px 0; font-size: 13px; color: #eee; border-bottom: 1px solid #555; padding-bottom: 5px;">ENVIRONMENT CONTROL</h3>
    ${slidersHtml}
    <div style="font-size: 9px; color: #888; margin-top: 8px;">
        Adjust sliders (0-500%) to modify resource flux.
    </div>
</div>`;

        parent.insertAdjacentHTML('beforeend', html);
        this.container = document.getElementById('vent-control-panel');

        // Bind Events
        this.resources.forEach(res => {
            const slider = document.getElementById(`slider-${res.id}`);
            const label = document.getElementById(`value-${res.id}`);

            if (slider && label) {
                this.sliders[res.id] = { slider, label };
                slider.addEventListener('input', (e) => {
                    const val = parseInt(e.target.value);
                    this.updateValue(res.id, val);
                });
            }
        });
    }

    updateValue(resourceId, percent) {
        if (this.sliders[resourceId]) {
            this.sliders[resourceId].label.textContent = `${percent}%`;
        }

        // Update Environment logic
        if (window.environment && window.environment.fluxMultipliers) {
            // 100% = 1.0 multiplier
            window.environment.fluxMultipliers[resourceId] = percent / 100.0;
        }
    }

    show() {
        if (this.container) {
            this.container.style.display = 'block';
            this.isVisible = true;
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
            this.isVisible = false;
        }
    }
}
