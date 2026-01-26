/**
 * Gestor de Interfaz de Usuario (UIManager)
 * Coordina todos los componentes visuales (Pantalla inicio, Stats, Leyenda).
 */
class UIManager {
    constructor() {
        this.configScreen = new ConfigScreen();
        this.statsPanel = new StatsPanel();
        this.legend = new Legend();
        this.cellInspector = new CellInspector(); // NEW: Visual Debugger - ENABLED
        this.ventInspector = new VentInspector(); // NEW: Vent Data Monitor

        // Montar componentes en el DOM (Asíncrono)
        this.mountComponents();
    }
    // ...
    render() {
        if (this.cellInspector) this.cellInspector.draw();
        if (this.ventInspector) this.ventInspector.draw();
    }

    async mountComponents() {
        // 1. Pantalla de Configuración (Entry Point - va directo al juego)
        await this.configScreen.mount('ui-root');

        // 2. Paneles de Juego (Stats y Leyenda)
        await this.statsPanel.mount('ui-root');
        await this.legend.mount('ui-root');

        // 3. Panel de Vent (Single Vent Mode) - Oculto por defecto
        this.ventControl = new VentControlPanel();
        await this.ventControl.mount('ui-root');
    }

    /**
     * Se llama cuando el usuario pulsa "Jugar"
     */
    onGameStart() {
        // Mostrar paneles de juego
        this.statsPanel.show();

        // Mostrar Panel Vent SOLO en Single Vent Mode
        if (GameConstants.EXECUTION_MODE === 'SINGLE_VENT_MODE' && this.ventControl) {
            this.ventControl.show();
        }
        // (La StartScreen se oculta sola al llamar a startGame)
    }

    /**
     * Actualizar interfaz (llamado cada frame desde Sketch.js)
     */
    update(stats) {
        this.statsPanel.update(stats);
    }

    resetUI() {
        // Ocultar paneles de juego
        this.statsPanel.hide();
        this.legend.hide();
        if (this.ventControl) this.ventControl.hide();

        // Mostrar StartScreen (a través de reload o reconstrucción)
        // Since we don't have a reference to StartScreen here (it was in index/Sketch/GameController flow),
        // we might need to recreate it or just reload the page for a clean state.
        // Actually, StartScreen is often self-contained or part of the initial logic.
        // Let's check constructor. UIManager HAS configScreen!
        // We can show configScreen again.
        if (this.configScreen) {
            this.configScreen.show();
            this.configScreen.initializeButtons(); // Re-bind if needed or just show
        }
    }

    /**
     * Dibujar componentes sobre el canvas (p5.js)
     */
    render() {
        if (this.cellInspector) this.cellInspector.draw();
    }
}
