class VentControlPanel {
    constructor() {
        this.container = null;
        this.sliders = {};
        this.isVisible = false;
        this.selectedVentId = 'all';
        this.canAddVents = true; // Default

        this.resources = [
            { id: 'h2', label: 'H₂ (Vent Flux)', color: '#4ca1af', default: 100 },
            { id: 'co2', label: 'CO₂ (Ambient)', color: '#9b59b6', default: 100 },
            { id: 'oxygen', label: 'O₂ (Atmosphere)', color: '#3498db', default: 100 },
            { id: 'temperature', label: 'Thermal Basin', color: '#e84393', default: 100 }
        ];
    }

    mount(parentId) {
        const parent = document.getElementById(parentId);
        if (!parent) return;

        let slidersHtml = this.resources.map(res => `
            <div class="stat-row">
                <div class="stat-label">
                    <span style="color: ${res.color}; font-weight: bold; font-size: 0.7rem;">${res.label}</span>
                    <span id="value-${res.id}" class="stat-value">100%</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" id="slider-${res.id}" min="0" max="500" value="${res.default}" class="param-slider" style="margin: 0; flex: 1;">
                </div>
            </div>
        `).join('');

        const html = `
<div id="vent-control-panel" class="panel center-overlay" style="display: none;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
        <span style="font-size: 0.8rem; font-weight: bold; color: #00ffff; letter-spacing: 1px;">ADVANCED VENT CONTROL</span>
        <div id="active-indicator" style="width: 8px; height: 8px; border-radius: 50%; background: #00ff00; box-shadow: 0 0 10px #00ff00;"></div>
    </div>
    
    <div style="margin-bottom: 20px;">
        <label style="font-size: 0.6rem; color: #888; display: block; margin-bottom: 5px; text-transform: uppercase;">Control Focus</label>
        <select id="vent-selection" style="background: rgba(0,0,0,0.3); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; width: 100%; font-family: monospace; font-size: 0.8rem; cursor: pointer; outline: none;">
            <option value="all">GLOBAL MULTIPLIERS</option>
        </select>
    </div>

    <!-- GLOBAL SECTION -->
    <div id="global-controls">
        <div style="font-size: 0.6rem; color: #00ffff; margin-bottom: 10px; opacity: 0.6; text-transform: uppercase;">Environmental Multipliers</div>
        ${slidersHtml}
    </div>

    <!-- INDIVIDUAL SECTION -->
    <div id="individual-controls" style="display: none;">
        <div style="font-size: 0.6rem; color: #ffcc00; margin-bottom: 15px; opacity: 0.6; text-transform: uppercase;">Individual Vent Parameters</div>
        
        <div class="stat-row">
            <div class="stat-label">
                <span>Output Intensity</span>
                <span id="vent-intensity-value" class="stat-value">100%</span>
            </div>
            <input type="range" id="vent-intensity-slider" min="0" max="300" value="100" class="param-slider" style="margin: 0;">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 20px;">
            <button id="btn-reactivate" class="btn-config" style="padding: 10px; font-size: 0.7rem; background: rgba(76, 175, 80, 0.2); width: 100%;">Reactivate</button>
            <button id="btn-extinguish" class="btn-config" style="padding: 10px; font-size: 0.7rem; background: rgba(255, 152, 0, 0.2); width: 100%;">Extinguish</button>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
            <button id="btn-focus-vent" class="btn-config" style="flex: 1; padding: 10px; font-size: 0.7rem; background: rgba(0, 255, 255, 0.2);">🎯 Focus Camera</button>
            <label style="font-size: 0.6rem; display: flex; align-items: center; gap: 5px; cursor: pointer;">
                <input type="checkbox" id="check-track-vent" checked> Auto-Track
            </label>
        </div>
        <button id="btn-remove" class="btn-config" style="padding: 10px; font-size: 0.7rem; background: rgba(231, 76, 60, 0.2); width: 100%; margin-top: 8px;">Deconstruct Vent</button>
    </div>

    <div style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
        <button id="btn-add-vent" class="btn-play" style="width: 100%; font-size: 0.8rem; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>➕</span> <b>DEPLOY EXPERIMENTAL VENT</b>
        </button>
        <p style="font-size: 0.6rem; color: #666; text-align: center; margin-top: 10px; font-style: italic;">
            Note: Global multipliers stack with individual vent intensity.
        </p>
    </div>
</div>`;

        parent.insertAdjacentHTML('beforeend', html);
        this.container = document.getElementById('vent-control-panel');

        this._setupEventListeners();
    }

    _setupEventListeners() {
        // Resource sliders (Global)
        this.resources.forEach(res => {
            const slider = document.getElementById(`slider-${res.id}`);
            const label = document.getElementById(`value-${res.id}`);
            if (slider && label) {
                this.sliders[res.id] = { slider, label };
                slider.addEventListener('input', (e) => {
                    const val = parseInt(e.target.value);
                    this.updateGlobalMultiplier(res.id, val);
                });
            }
        });

        const selector = document.getElementById('vent-selection');
        selector.addEventListener('change', (e) => this._onVentSelectionChange(e.target.value));

        document.getElementById('vent-intensity-slider').addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            this._onVentIntensityChange(val);
        });

        document.getElementById('btn-reactivate').addEventListener('click', () => this._handleVentAction('reactivate'));
        document.getElementById('btn-extinguish').addEventListener('click', () => this._handleVentAction('extinguish'));
        document.getElementById('btn-remove').addEventListener('click', () => this._handleVentAction('remove'));
        document.getElementById('btn-focus-vent').addEventListener('click', () => this._handleVentAction('focus'));
        document.getElementById('check-track-vent').addEventListener('change', (e) => {
            if (window.viewport) window.viewport.isHoming = e.target.checked;
        });
        document.getElementById('btn-add-vent').addEventListener('click', () => this._addNewVent());

        // Update vent list periodically when visible
        setInterval(() => {
            if (this.isVisible) this._updateVentList();
        }, 1000);
    }

    _updateVentList() {
        const selector = document.getElementById('vent-selection');
        if (!selector || !window.environment?.ventSystem) return;

        const currentVents = window.environment.ventSystem.getVentData();
        const currentValue = selector.value;

        // Keep 'all' option
        let html = '<option value="all">GLOBAL MULTIPLIERS</option>';
        currentVents.forEach(v => {
            html += `<option value="${v.id}">${v.type} @ Col ${v.position.x}</option>`;
        });

        selector.innerHTML = html;
        selector.value = currentValue;

        // AUTO-SELECT: If only one vent and we are on 'all', select it
        if (currentVents.length === 1 && currentValue === 'all') {
            this.selectVent(currentVents[0].id);
        }
    }

    setCanAddVents(allowed) {
        this.canAddVents = allowed;
        const btn = document.getElementById('btn-add-vent');
        if (btn) {
            btn.style.display = allowed ? 'flex' : 'none';
        }
    }

    _onVentSelectionChange(val) {
        this.selectedVentId = val;
        const individual = document.getElementById('individual-controls');
        const global = document.getElementById('global-controls');
        const indicator = document.getElementById('active-indicator');

        if (val === 'all') {
            individual.style.display = 'none';
            global.style.display = 'block';
            if (indicator) indicator.style.background = '#00ff00';
            if (indicator) indicator.style.boxShadow = '0 0 10px #00ff00';
        } else {
            individual.style.display = 'block';
            global.style.display = 'none';
            if (indicator) indicator.style.background = '#ffcc00';
            if (indicator) indicator.style.boxShadow = '0 0 10px #ffcc00';

            // Sync slider to current vent intensity
            const vent = window.environment?.ventSystem?.getVentById(val);
            if (vent) {
                const slider = document.getElementById('vent-intensity-slider');
                slider.value = vent.intensity * 100;
                document.getElementById('vent-intensity-value').textContent = `${slider.value}% `;
            }
        }
    }

    /**
     * Public method to select a vent from the canvas
     */
    selectVent(ventId) {
        const selector = document.getElementById('vent-selection');
        if (selector) {
            selector.value = ventId;
            this._onVentSelectionChange(ventId);
        }
    }

    _onVentIntensityChange(percent) {
        if (this.selectedVentId === 'all') return;

        const vent = window.environment?.ventSystem?.getVentById(this.selectedVentId);
        if (vent) {
            vent.setIntensity(percent / 100);
            document.getElementById('vent-intensity-value').textContent = `${percent}% `;
        }
    }

    _handleVentAction(action) {
        if (this.selectedVentId === 'all') return;
        const vent = window.environment?.ventSystem?.getVentById(this.selectedVentId);
        if (!vent) return;

        if (action === 'reactivate') vent.lifecycle.reactivate();
        if (action === 'extinguish') vent.lifecycle.extinguish();
        if (action === 'focus') {
            if (window.viewport) {
                window.viewport.targetX = vent.pos.x;
                window.viewport.targetY = vent.pos.y;
                window.viewport.isHoming = true;
                // Sync checkbox
                const check = document.getElementById('check-track-vent');
                if (check) check.checked = true;
            }
        }
        if (action === 'remove') {
            window.environment.ventSystem.removeVent(this.selectedVentId);
            this.selectVent('all');
        }
    }

    _addNewVent() {
        if (!window.environment?.ventSystem) return;

        const types = ['ALKALINE', 'BLACK_SMOKER', 'DIFFUSE', 'COLD_SEEP'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomX = Math.floor(Math.random() * window.environment.cols);

        const newVent = window.environment.ventSystem.addVent({
            type: randomType,
            x: randomX,
            intensity: 1.0
        });

        // Auto-select the new vent
        setTimeout(() => this.selectVent(newVent.id), 100);
    }

    updateGlobalMultiplier(resourceId, percent) {
        if (this.sliders[resourceId]) {
            this.sliders[resourceId].label.textContent = `${percent}% `;
        }
        if (window.environment && window.environment.fluxMultipliers) {
            window.environment.fluxMultipliers[resourceId] = percent / 100.0;
        }
    }

    show() { if (this.container) { this.container.style.display = 'block'; this.isVisible = true; } }
    hide() { if (this.container) { this.container.style.display = 'none'; this.isVisible = false; } }
}
