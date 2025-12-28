/**
 * Gestor de Interfaz de Usuario (UIManager)
 * Coordina todos los componentes visuales (Pantalla inicio, Stats, Leyenda).
 */
class UIManager {
    constructor() {
        this.configScreen = new ConfigScreen();
        this.statsPanel = new StatsPanel();
        this.legend = new Legend();
        // this.cellInspector = new CellInspector(); // NEW: Visual Debugger - DISABLED

        // Montar componentes en el DOM (Asíncrono)
        this.mountComponents();
    }

    async mountComponents() {
        // 1. Pantalla de Configuración (Entry Point - va directo al juego)
        await this.configScreen.mount('ui-root');

        // 2. Paneles de Juego (Stats y Leyenda)
        await this.statsPanel.mount('ui-root');
        await this.legend.mount('ui-root');
        // CellInspector is canvas-only, no mount needed
    }

    /**
     * Se llama cuando el usuario pulsa "Jugar"
     */
    onGameStart() {
        // Mostrar paneles de juego
        this.statsPanel.show();
        // (La StartScreen se oculta sola al llamar a startGame)
    }

    /**
     * Actualizar interfaz (llamado cada frame desde Sketch.js)
     */
    update(stats) {
        this.statsPanel.update(stats);
    }

    /**
     * Dibujar componentes sobre el canvas (p5.js)
     */
    render() {
        // if (this.cellInspector) this.cellInspector.draw();
    }
}
