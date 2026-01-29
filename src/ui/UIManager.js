/**
 * Gestor de Interfaz de Usuario (UIManager)
 * Coordina todos los componentes visuales (Pantalla inicio, Stats, Leyenda).
 * 
 * REFACTORIZACIÓN: Los componentes se crean CONDICIONALMENTE basándose en
 * la configuración del escenario, en lugar de crear todos y luego ocultarlos.
 */
class UIManager {
    constructor() {
        // ConfigScreen siempre existe (pantalla inicial)
        this.configScreen = new ConfigScreen();

        // Componentes opcionales - se crean bajo demanda
        this.statsPanel = null;
        this.legend = null;
        this.cellInspector = null;
        this.ventInspector = null;
        this.moleculeInspector = null;
        this.exitButton = null;
        this.showLabels = true; // Default to true

        // Montar componentes básicos en el DOM
        this.mountComponents();
    }

    /**
     * Monta solo los componentes esenciales.
     * Los componentes específicos del escenario se crean en configureForScenario()
     */
    async mountComponents() {
        // Solo montar ConfigScreen (pantalla inicial)
        await this.configScreen.mount('ui-root');
    }

    /**
     * Configura UI basándose en la configuración del escenario.
     * CREA o DESTRUYE componentes según sea necesario.
     * 
     * VENT_LABORATORY: Solo crea exitButton
     * STANDARD: Crea statsPanel, legend, inspectores, exitButton
     */
    configureForScenario(scenarioConfig) {
        const ui = scenarioConfig.ui;
        console.log(`[UIManager] Configuring UI for scenario: ${scenarioConfig.id}`, ui);

        this.showLabels = ui.showVentLabels !== undefined ? ui.showVentLabels : true;

        // 1. Stats Panel
        if (ui.showStatsPanel) {
            console.log('[UIManager] Creating/showing StatsPanel');
            if (!this.statsPanel) {
                this.statsPanel = new StatsPanel();
                this.statsPanel.mount('ui-root');
            }
            this.statsPanel.show();
        } else {
            console.log('[UIManager] Destroying StatsPanel');
            if (this.statsPanel) {
                this.statsPanel.destroy();
                this.statsPanel = null;
            }
        }

        // 2. Legend
        if (ui.showLegend) {
            if (!this.legend) {
                this.legend = new Legend();
                this.legend.mount('ui-root');
            }
            this.legend.show();
        } else {
            if (this.legend) {
                this.legend.destroy();
                this.legend = null;
            }
        }

        // 3. Cell Inspector
        if (ui.showCellInspector) {
            if (!this.cellInspector) {
                this.cellInspector = new CellInspector();
            }
            this.cellInspector.enable();
        } else {
            if (this.cellInspector) {
                this.cellInspector.disable();
                this.cellInspector = null;
            }
        }

        // 4. Vent Inspector
        if (ui.showVentMonitor) {
            if (!this.ventInspector) {
                this.ventInspector = new VentInspector();
            }
            this.ventInspector.enable();
        } else {
            if (this.ventInspector) {
                this.ventInspector.disable();
                this.ventInspector = null;
            }
        }

        // 5. Molecule Inspector
        if (ui.showChemistryInspector) {
            if (!this.moleculeInspector) {
                this.moleculeInspector = new MoleculeInspector();
            }
            this.moleculeInspector.enable();
        } else {
            if (this.moleculeInspector) {
                this.moleculeInspector.disable();
                this.moleculeInspector = null;
            }
        }

        // 6. Exit Button
        if (ui.exitButton) {
            if (!this.exitButton) {
                this.createExitButton();
            }
            this.exitButton.style.display = 'block';
        } else {
            if (this.exitButton) {
                this.exitButton.remove();
                this.exitButton = null;
            }
        }
    }

    createExitButton() {
        if (document.getElementById('exit-scenario-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'exit-scenario-btn';
        btn.innerHTML = '⬅ Salir de Prueba';
        btn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #e74c3c;
            color: white;
            border: 2px solid #c0392b;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 0 #c0392b;
            transition: transform 0.1s;
            display: none;
        `;

        btn.onmousedown = () => btn.style.transform = 'translateY(2px)';
        btn.onmouseup = () => btn.style.transform = 'translateY(0)';

        btn.onclick = () => {
            if (window.gameInstance) window.gameInstance.stop();
            this.resetUI();
            btn.style.display = 'none';
        };

        document.body.appendChild(btn);
        this.exitButton = btn;
    }

    /**
     * Se llama cuando el usuario pulsa "Jugar"
     * NOTE: UI configuration is now handled by ScenarioManager via configureForScenario()
     */
    onGameStart() {
        // UI is now configured by ScenarioManager
        // No need to show/hide panels here
    }

    /**
     * Actualizar interfaz (llamado cada frame desde Sketch.js)
     */
    update(stats) {
        if (this.statsPanel) {
            this.statsPanel.update(stats);
        }
    }

    /**
     * Renderizar componentes de canvas (inspectores)
     */
    render() {
        // Skip rendering inspectors in Laboratory modes
        const scenarioId = window.scenarioManager?.currentScenario?.id;
        const isLabMode = scenarioId === 'VENT_LABORATORY' || scenarioId === 'LAB_SINGLE_VENT';
        if (isLabMode) return;

        if (this.cellInspector) this.cellInspector.draw();
        if (this.ventInspector) this.ventInspector.draw();
        if (this.moleculeInspector) this.moleculeInspector.draw();
    }

    resetUI() {
        // Destruir todos los componentes del escenario
        if (this.statsPanel) {
            this.statsPanel.destroy();
            this.statsPanel = null;
        }
        if (this.legend) {
            this.legend.destroy();
            this.legend = null;
        }

        this.cellInspector = null;
        this.ventInspector = null;
        this.moleculeInspector = null;

        // Mostrar ConfigScreen
        if (this.configScreen) {
            this.configScreen.show();
            this.configScreen.initializeButtons();
        }
    }

}
