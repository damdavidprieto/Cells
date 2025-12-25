/**
 * Componente: Pantalla de Inicio
 * Se encarga de mostrar la bienvenida y permitir la selección de modo.
 */
class StartScreen {
    constructor(gameController) {
        this.gameController = gameController;
        this.container = null;
    }

    mount(parentId) {
        const parent = document.getElementById(parentId);
        if (!parent) return;
        //este es el que me refiero que sobra
        // HTML inline (sin necesidad de fetch)
        const html = `
<div id="start-screen">
    <div class="start-content">
        <h1>Cells</h1>
        <p class="subtitle">Simulador de Evolución</p>

        <div class="mode-selection">
            <button id="btn-play" class="btn-play">
                <span class="icon">▶️</span>
                <span class="text">Jugar Simulación</span>
                <span class="desc">Velocidad normal, UI limpia</span>
            </button>

            <button id="btn-dev" class="btn-dev">
                <span class="icon">🛠️</span>
                <span class="text">Modo Desarrollo</span>
                <span class="desc">2x Velocidad, Monitor Debug, Logs</span>
            </button>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
            <button id="btn-config" class="btn-config">
                ⚙️ Configuración Avanzada
            </button>
        </div>

        <div class="version-info">
            v1.0.0-alpha • <a href="https://github.com/damdavidprieto/Cells" target="_blank">Ver en GitHub</a>
        </div>
    </div>
</div>`;

        // Inyectar HTML
        parent.insertAdjacentHTML('beforeend', html);
        this.container = document.getElementById('start-screen');

        // Asignar eventos
        const btnPlay = document.getElementById('btn-play');
        const btnDev = document.getElementById('btn-dev');
        const btnConfig = document.getElementById('btn-config');

        if (btnPlay) btnPlay.addEventListener('click', () => this.onStart('PRODUCTION'));
        if (btnDev) btnDev.addEventListener('click', () => this.onStart('DEVELOPMENT'));
        if (btnConfig) btnConfig.addEventListener('click', () => this.showConfig());
    }

    showConfig() {
        // Ocultar StartScreen y mostrar ConfigScreen
        this.hide();
        if (window.uiManager && window.uiManager.configScreen) {
            window.uiManager.configScreen.show();
        }
    }

    onStart(mode) {
        console.log(`[StartScreen] Modo seleccionado: ${mode}`);
        if (this.gameController) {
            this.gameController.startGame(mode);
        }
        this.hide();
    }

    hide() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }

    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    }
}
