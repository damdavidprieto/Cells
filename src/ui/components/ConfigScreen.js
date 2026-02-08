/**
 * Componente: Pantalla de Configuración Ambiental
 * Permite ajustar parámetros del entorno antes de iniciar la simulación.
 * El centro (50%) representa el entorno de LUCA científicamente riguroso.
 */
class ConfigScreen {
    constructor() {
        this.container = null;

        // Valores científicos de LUCA (centro = 50%)
        // Basados en investigación del proyecto (4.0-3.5 Ga)
        this.lucaBaseline = {
            uv_intensity: 100,              // UV 10-100x moderna (sin capa de ozono)
            metabolic_cost: 0.05,           // Metabolismo primitivo
            reproduction_threshold: 0.75,   // Balance supervivencia/reproducción
            membrane_permeability: 0.1,     // Difusión pasiva (membrana primitiva)
            thermal_stress: 0.02,           // 2% por grado (océano cálido 50-80°C)
            oxygen_toxicity: 0.05           // SOD primitivo (ambiente anóxico)
        };

        // Rangos para cada parámetro (min, max)
        this.ranges = {
            uv_intensity: [25, 200],        // 25% a 200% del baseline
            metabolic_cost: [0.02, 0.10],   // Muy lento a muy rápido
            reproduction_threshold: [0.5, 0.95], // Fácil a muy difícil
            membrane_permeability: [0.03, 0.3],  // Poca a mucha absorción
            thermal_stress: [0.005, 0.05],  // Bajo a alto estrés
            oxygen_toxicity: [0.02, 0.15]   // Baja a alta toxicidad
        };

        // Valores actuales (inicializados al baseline)
        this.currentValues = { ...this.lucaBaseline };
    }

    mount(parentId) {
        const parent = document.getElementById(parentId);
        if (!parent) return;
        //este es el que tiene que ir directamente al juego
        const html = `
<div id="config-screen" class="config-screen">
    <div class="config-content">
        <h1>⚙️ Configuración Ambiental</h1>
        <p class="subtitle">Ajusta las condiciones del entorno primordial</p>
        
        <div class="config-info">
            <strong>🔬 Referencia Científica:</strong> El centro (50%) representa el entorno de LUCA 
            (Last Universal Common Ancestor) hace 4.0-3.5 Ga, basado en evidencia geológica y bioquímica.
        </div>

        <div class="config-actions">
            <!-- PRODUCTION / STANDARD CONTROLS -->
            <div class="production-controls" style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button id="reset-btn" class="btn-secondary" style="flex: 1;">
                    🔄 Restaurar LUCA
                </button>
                <button id="start-production-btn" class="btn-play" style="flex: 1;">
                    ▶️ Iniciar Estándar
                </button>
            </div>

            <!-- DEVELOPMENT CONTROLS (Hidden in Production) -->
            <div id="dev-controls-container" style="display: none; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 20px;">
                <p style="font-size: 0.8em; text-transform: uppercase; color: #666; margin-bottom: 10px; font-weight: bold;">
                    🛠️ Zona de Ingeniería (Local/Dev)
                </p>
                
                <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 20px;">
                    <!-- General Dev Mode -->
                    <button id="start-dev-btn" class="btn-dev" style="flex: 1; min-width: 150px;">
                        🛠️ Modo Desarrollo
                    </button>

                    <!-- Single Cell Cluster (Grouped) -->
                    <div class="single-cell-cluster" style="flex: 2; min-width: 300px; background: rgba(230, 126, 34, 0.1); border: 1px solid rgba(230, 126, 34, 0.3); padding: 10px; border-radius: 6px; display: flex; gap: 10px; align-items: center;">
                        <div style="flex-grow: 1;">
                            <select id="scenario-select" style="width: 100%; padding: 8px; background: #222; color: #ecf0f1; border: 1px solid #555; border-radius: 4px; font-size: 0.9em;">
                                <option value="STANDARD">🔵 Estándar (Ideal)</option>
                                <option value="EMPTY_GRID">⬜ Grid Vacío (Testing)</option>
                                <option value="SINGLE_VENT_DEV">🛠️ Dev: Vent Central (Sinergia)</option>
                                <option value="HYDROTHERMAL_COLONIZATION">🌋 Evolución Hidrotermal</option>
                                <option value="PRESSURE_OXYGEN">💀 Toxicidad O₂</option>
                                <option value="PRESSURE_LIGHT">☀️ Alta radiación UV</option>
                                <option value="PRESSURE_SCARCITY">📉 Escasez Recursos</option>
                                <option value="PRESSURE_THERMAL">🌋 Hipertermia</option>
                            </select>
                        </div>
                        <button id="start-single-btn" class="btn-secondary" style="background: #e67e22; border-color: #d35400; color: white; white-space: nowrap; padding: 8px 15px;">
                            🔬 Single Cell
                        </button>
                    </div>
                </div>

                <!-- NEW: Single Vent Mode Laboratory (Relocated to Dev) -->
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                    <button id="start-vent-btn" class="btn-play" style="width: 100%; background: linear-gradient(135deg, #16222a, #3a6073); border-left: 4px solid #3a6073; border-radius: 4px; padding: 12px; font-size: 1.0em; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                        <span class="icon">🧪</span>
                        <span class="text">Laboratorio de Vent Singular</span>
                    </button>
                    
                    <div style="display: flex; gap: 20px; align-items: flex-end;">
                        <div style="flex: 1;">
                            <label style="font-size: 0.75em; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 5px; display: block;">Ancho del Vent (Cols)</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="range" id="vent-width-slider" min="1" max="10" value="1" step="1" style="flex: 1; accent-color: #3a6073;">
                                <span id="vent-width-val" style="width: 25px; text-align: right; color: #3a6073; font-weight: bold; font-family: monospace;">1</span>
                            </div>
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 0.75em; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 5px; display: block;">Alto del Grid (Filas)</label>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="range" id="vent-height-slider" min="1" max="100" value="1" step="1" style="flex: 1; accent-color: #e67e22;">
                                <span id="vent-height-val" style="width: 35px; text-align: right; color: #e67e22; font-weight: bold; font-family: monospace;">1</span>
                            </div>
                        </div>
                    </div>
                    <p style="font-size: 0.7em; color: #666; margin-top: 10px; font-style: italic;">
                        Usa este modo para validar la estabilidad del entorno y el comportamiento del grid.
                    </p>
                </div>
            </div>
        </div>

        <div class="parameters-grid">
            <!-- UV Radiation -->
            <div class="parameter-group">
                <div class="parameter-header">
                    <span class="param-icon">☀️</span>
                    <span class="param-name">Radiación UV</span>
                    <span class="param-value" id="uv-value">100</span>
                </div>
                <input type="range" id="uv-slider" class="param-slider" 
                    min="0" max="100" value="50" step="1">
                <div class="param-labels">
                    <span>Protegido</span>
                    <span class="baseline">LUCA</span>
                    <span>Letal</span>
                </div>
                <p class="param-desc">Intensidad UV sin capa de ozono. LUCA: 10-100x moderna</p>
            </div>

            <!-- Metabolic Cost -->
            <div class="parameter-group">
                <div class="parameter-header">
                    <span class="param-icon">⚡</span>
                    <span class="param-name">Costo Metabólico</span>
                    <span class="param-value" id="metabolic-value">0.05</span>
                </div>
                <input type="range" id="metabolic-slider" class="param-slider" 
                    min="0" max="100" value="50" step="1">
                <div class="param-labels">
                    <span>Eficiente</span>
                    <span class="baseline">LUCA</span>
                    <span>Costoso</span>
                </div>
                <p class="param-desc">Energía consumida por frame. LUCA: metabolismo primitivo</p>
            </div>

            <!-- Reproduction Threshold -->
            <div class="parameter-group">
                <div class="parameter-header">
                    <span class="param-icon">🧬</span>
                    <span class="param-name">Umbral Reproducción</span>
                    <span class="param-value" id="reproduction-value">75%</span>
                </div>
                <input type="range" id="reproduction-slider" class="param-slider" 
                    min="0" max="100" value="50" step="1">
                <div class="param-labels">
                    <span>Fácil</span>
                    <span class="baseline">LUCA</span>
                    <span>Difícil</span>
                </div>
                <p class="param-desc">% de recursos necesarios para reproducirse</p>
            </div>

            <!-- Membrane Permeability -->
            <div class="parameter-group">
                <div class="parameter-header">
                    <span class="param-icon">💧</span>
                    <span class="param-name">Permeabilidad Membrana</span>
                    <span class="param-value" id="membrane-value">0.10</span>
                </div>
                <input type="range" id="membrane-slider" class="param-slider" 
                    min="0" max="100" value="50" step="1">
                <div class="param-labels">
                    <span>Impermeable</span>
                    <span class="baseline">LUCA</span>
                    <span>Permeable</span>
                </div>
                <p class="param-desc">Difusión pasiva de nutrientes. LUCA: membrana primitiva</p>
            </div>

            <!-- Thermal Stress -->
            <div class="parameter-group">
                <div class="parameter-header">
                    <span class="param-icon">🌡️</span>
                    <span class="param-name">Estrés Térmico</span>
                    <span class="param-value" id="thermal-value">2.0%</span>
                </div>
                <input type="range" id="thermal-slider" class="param-slider" 
                    min="0" max="100" value="50" step="1">
                <div class="param-labels">
                    <span>Tolerante</span>
                    <span class="baseline">LUCA</span>
                    <span>Sensible</span>
                </div>
                <p class="param-desc">Costo por desviación térmica. LUCA: océano 50-80°C</p>
            </div>

            <!-- Oxygen Toxicity -->
            <div class="parameter-group">
                <div class="parameter-header">
                    <span class="param-icon">💀</span>
                    <span class="param-name">Toxicidad O₂</span>
                    <span class="param-value" id="oxygen-value">0.05</span>
                </div>
                <input type="range" id="oxygen-slider" class="param-slider" 
                    min="0" max="100" value="50" step="1">
                <div class="param-labels">
                    <span>Tolerante</span>
                    <span class="baseline">LUCA</span>
                    <span>Tóxico</span>
                </div>
                <p class="param-desc">Daño oxidativo. LUCA: SOD primitivo, ambiente anóxico</p>
            </div>
        </div>

        <div class="version-info">
            v1.0.0-alpha • <a href="https://github.com/damdavidprieto/Cells" target="_blank">Ver en GitHub</a>
        </div>
    </div>
</div>`;

        parent.insertAdjacentHTML('beforeend', html);
        this.container = document.getElementById('config-screen');

        // Inicializar eventos
        this.initializeSliders();
        this.initializeButtons();
    }

    initializeSliders() {
        const sliders = {
            'uv': { param: 'uv_intensity', format: (v) => v.toFixed(0) },
            'metabolic': { param: 'metabolic_cost', format: (v) => v.toFixed(3) },
            'reproduction': { param: 'reproduction_threshold', format: (v) => (v * 100).toFixed(0) + '%' },
            'membrane': { param: 'membrane_permeability', format: (v) => v.toFixed(2) },
            'thermal': { param: 'thermal_stress', format: (v) => (v * 100).toFixed(1) + '%' },
            'oxygen': { param: 'oxygen_toxicity', format: (v) => v.toFixed(3) }
        };

        for (let [key, config] of Object.entries(sliders)) {
            const slider = document.getElementById(`${key}-slider`);
            const valueDisplay = document.getElementById(`${key}-value`);

            if (slider && valueDisplay) {
                slider.addEventListener('input', (e) => {
                    const percent = parseFloat(e.target.value) / 100;
                    const [min, max] = this.ranges[config.param];
                    const value = min + (max - min) * percent;

                    this.currentValues[config.param] = value;
                    valueDisplay.textContent = config.format(value);
                });
            }
        }
    }

    initializeButtons() {
        const resetBtn = document.getElementById('reset-btn');
        const productionBtn = document.getElementById('start-production-btn');
        const devBtn = document.getElementById('start-dev-btn');
        const singleBtn = document.getElementById('start-single-btn');
        const devContainer = document.getElementById('dev-controls-container');

        // Check for local environment
        const isLocal = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:';

        if (devContainer && isLocal) {
            devContainer.style.display = 'block';
        } else if (devContainer) {
            // Ensure hidden in production (redundant as it's hidden by default, but safe)
            devContainer.style.display = 'none';
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log('🔄 [ConfigScreen] Restaurando valores de LUCA...');
                this.resetToLUCA();
                console.log('✅ [ConfigScreen] Valores restaurados al baseline científico');

                // Feedback visual
                resetBtn.textContent = '✅ Restaurado';
                setTimeout(() => {
                    resetBtn.textContent = '🔄 Restaurar LUCA';
                }, 1000);
            });
        }

        if (productionBtn) {
            productionBtn.addEventListener('click', () => {
                console.log('═══════════════════════════════════════════════════════');
                console.log('▶️ [ConfigScreen] Iniciando modo PRODUCTION...');
                console.log('═══════════════════════════════════════════════════════');

                // Deshabilitar botones
                this.disableButtons();

                // Feedback visual
                productionBtn.innerHTML = '⏳ Cargando...';

                // Iniciar juego con ScenarioManager
                setTimeout(() => {
                    if (!window.gameInstance) window.gameInstance = new GameController();
                    window.scenarioManager.loadScenario(ScenarioLibrary.STANDARD);
                    this.startGame('PRODUCTION');
                }, 100);
            });
        }

        if (devBtn) {
            devBtn.addEventListener('click', () => {
                console.log('═══════════════════════════════════════════════════════');
                console.log('🛠️ [ConfigScreen] Iniciando modo DEVELOPMENT...');
                console.log('📊 Configuración aplicada:');
                console.log('  - UV Intensity:', this.currentValues.uv_intensity);
                console.log('  - Metabolic Cost:', this.currentValues.metabolic_cost);
                console.log('  - Reproduction Threshold:', this.currentValues.reproduction_threshold);
                console.log('  - Membrane Permeability:', this.currentValues.membrane_permeability);
                console.log('  - Thermal Stress:', this.currentValues.thermal_stress);
                console.log('  - Oxygen Toxicity:', this.currentValues.oxygen_toxicity);
                console.log('═══════════════════════════════════════════════════════');

                // Deshabilitar botones
                this.disableButtons();

                // Feedback visual
                devBtn.innerHTML = '⏳ Cargando...';

                // Iniciar juego con ScenarioManager (Development default = Standard/Full Grid)
                setTimeout(() => {
                    if (!window.gameInstance) window.gameInstance = new GameController();
                    window.scenarioManager.loadScenario(ScenarioLibrary.STANDARD);
                    this.startGame('DEVELOPMENT');
                }, 100);
            });
        }

        if (singleBtn) {
            singleBtn.addEventListener('click', () => {
                const scenarioSelect = document.getElementById('scenario-select');
                const scenario = scenarioSelect ? scenarioSelect.value : 'STANDARD';

                console.log('═══════════════════════════════════════════════════════');
                console.log(`🔬 [ConfigScreen] Iniciando SINGLE CELL MODE (${scenario})...`);
                console.log('═══════════════════════════════════════════════════════');

                // Deshabilitar botones
                this.disableButtons();

                // Feedback visual
                singleBtn.innerHTML = '⏳ Cargando...';

                // Iniciar juego
                setTimeout(() => {
                    // Load specific scenario via Manager
                    let scenarioDef = ScenarioLibrary.STANDARD;
                    if (ScenarioLibrary[scenario]) {
                        scenarioDef = ScenarioLibrary[scenario];
                    }

                    if (!window.gameInstance) window.gameInstance = new GameController();
                    window.scenarioManager.loadScenario(scenarioDef);

                    // Start loop (Manager handles setup)
                    this.startGame('SINGLE_CELL_MODE');
                }, 100);
            });
        }

        const ventBtn = document.getElementById('start-vent-btn');
        const ventWidthSlider = document.getElementById('vent-width-slider');
        const ventWidthVal = document.getElementById('vent-width-val');
        const ventHeightSlider = document.getElementById('vent-height-slider');
        const ventHeightVal = document.getElementById('vent-height-val');

        // Defaults (Flux 1.0 = Standard, user modifies via runtime controls)
        this.ventParams = { width: 1, height: 1, flux: 1.0 }; // Default height 1

        if (ventWidthSlider && ventWidthVal) {
            ventWidthSlider.addEventListener('input', (e) => {
                this.ventParams.width = parseInt(e.target.value);
                ventWidthVal.textContent = this.ventParams.width;
            });
        }

        if (ventHeightSlider && ventHeightVal) {
            ventHeightSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                this.ventParams.height = val;
                ventHeightVal.textContent = val;
            });
        }

        if (ventBtn) {
            ventBtn.addEventListener('click', () => {
                this.disableButtons();
                ventBtn.innerHTML = '⏳ Configurando Laboratorio...';

                // 1. Preparar Overrides desde la UI
                const overrides = {
                    world: {
                        rows: this.ventParams.height,
                        // El ancho (cols) se calcula auto en ScenarioLibrary/Manager, 
                        // pero los vents específicos sí los pasamos
                        vents: [{
                            width: this.ventParams.width,
                            intensity: this.ventParams.flux || 1.0,
                            type: 'CENTER', // Asegurar tipo
                            subType: 'ALKALINE'
                        }]
                    }
                };

                // 2. Asegurar que el Motor existe antes de configurarlo
                if (!window.gameInstance) {
                    window.gameInstance = new GameController();
                }

                // 3. Delegar al ScenarioManager
                // Usa el preset LAB_SINGLE_VENT como base
                window.scenarioManager.loadScenario(ScenarioLibrary.LAB_SINGLE_VENT, overrides);

                // 4. Iniciar el Loop del Juego
                setTimeout(() => {
                    this.startGame('SINGLE_VENT_MODE');
                }, 100);
            });
        }
    }

    disableButtons() {
        const buttons = ['reset-btn', 'start-production-btn', 'start-dev-btn', 'start-single-btn', 'start-vent-btn'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            }
        });
    }

    resetToLUCA() {
        // Resetear todos los sliders al 50%
        const sliders = ['uv', 'metabolic', 'reproduction', 'membrane', 'thermal', 'oxygen'];
        sliders.forEach(key => {
            const slider = document.getElementById(`${key}-slider`);
            if (slider) {
                slider.value = 50;
                slider.dispatchEvent(new Event('input'));
            }
        });
    }

    startGame(mode, scenario = 'STANDARD') {
        // Aplicar configuración a GameConstants
        GameConstants.UV_SURFACE_INTENSITY = this.currentValues.uv_intensity;
        GameConstants.BASE_METABOLIC_COST = this.currentValues.metabolic_cost;
        GameConstants.REPRODUCTION_THRESHOLD = this.currentValues.reproduction_threshold;
        GameConstants.MEMBRANE_PERMEABILITY = this.currentValues.membrane_permeability;
        GameConstants.THERMAL_STRESS_MULTIPLIER = this.currentValues.thermal_stress;
        GameConstants.OXIDATIVE_DAMAGE_RATE = this.currentValues.oxygen_toxicity;

        GameConstants.OXIDATIVE_DAMAGE_RATE = this.currentValues.oxygen_toxicity;

        GameConstants.SCENARIO = scenario;

        console.log('✅ [ConfigScreen] Configuración aplicada a GameConstants');
        console.log('🎮 [ConfigScreen] Iniciando simulación...');

        // Mostrar alerta visual
        let modeText = 'Producción';
        if (mode === 'DEVELOPMENT') modeText = 'Desarrollo';
        if (mode === 'SINGLE_CELL_MODE') modeText = `Single Cell (${scenario})`;
        if (mode === 'SINGLE_VENT_MODE') modeText = 'Single Vent (Manual)';

        window.modalManager.show({
            title: 'Iniciando Simulación',
            message: `🎮 Iniciando simulación en modo ${modeText}...\n\n⚠️ El navegador puede tardar unos segundos en cargar.\n\nMira la consola (F12) para ver el progreso.`,
            type: 'info'
        });

        // Iniciar juego
        if (typeof GameController !== 'undefined' && GameController.startGame) {
            GameController.startGame(mode);
            this.hide();
            console.log('✅ [ConfigScreen] Simulación iniciada correctamente');
        } else {
            console.error('❌ [ConfigScreen] GameController.startGame no está disponible');
            window.modalManager.show({
                title: 'Error de Sistema',
                message: '❌ Error: No se pudo iniciar el juego. Recarga la página (F5).',
                type: 'error'
            });
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    show() {
        if (this.container) {
            this.container.style.display = 'flex';
        }
    }
}
