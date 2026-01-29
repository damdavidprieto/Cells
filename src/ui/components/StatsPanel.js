/**
 * Componente: Panel de Estadísticas
 * Muestra información en tiempo real sobre la población y recursos.
 * Creado dinámicamente sin HTML inline.
 */
class StatsPanel {
    constructor() {
        this.container = null;
    }

    mount(parentId) {
        const parent = document.getElementById(parentId);
        if (!parent) return;

        // Solo crear si UIManager lo solicita (respeta configuración del escenario)
        // Para VENT_LABORATORY, este método NO se llama porque showStatsPanel: false

        // Crear contenedor principal
        this.container = document.createElement('div');
        this.container.id = 'stats-panel';
        this.container.className = 'panel side-panel glow-active';
        this.container.style.display = 'none'; // Inicialmente oculto

        // Botón de salida
        const exitBtn = this.createExitButton();
        this.container.appendChild(exitBtn);

        // Header con tiempo
        const header = this.createHeader();
        this.container.appendChild(header);

        // Sección de población
        const populationSection = this.createPopulationSection();
        this.container.appendChild(populationSection);

        // Sección de recursos
        const resourcesSection = this.createResourcesSection();
        this.container.appendChild(resourcesSection);

        // Sección de metabolismo
        const metabolismSection = this.createMetabolismSection();
        this.container.appendChild(metabolismSection);

        // Añadir al DOM
        parent.appendChild(this.container);

        // Crear botón de Vent Laboratory
        this.createVentLabButton();
    }

    createExitButton() {
        const btn = document.createElement('button');
        btn.id = 'exit-btn';
        btn.className = 'btn-exit';
        btn.textContent = '🚪 SALIR DEL ESCENARIO';
        btn.style.cssText = `
            width: 100%;
            margin-bottom: 10px;
            background: #e74c3c;
            border: none;
            padding: 10px;
            color: white;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            display: none;
        `;

        btn.addEventListener('click', () => {
            if (confirm('¿Volver al menú principal? (Se perderá el progreso actual)')) {
                location.reload();
            }
        });

        return btn;
    }

    createHeader() {
        const header = document.createElement('div');
        header.className = 'stats-header';
        header.style.cssText = 'text-align: center; margin-bottom: 20px;';

        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'time-display';
        timeDisplay.textContent = '4.000 Ga';
        timeDisplay.style.cssText = 'font-size: 1.4rem; font-weight: bold; color: #00ffff;';

        const frameInfo = document.createElement('div');
        frameInfo.style.cssText = 'font-size: 0.7rem; color: #556677;';
        frameInfo.innerHTML = 'COSMIC TIME / FRAME: <span id="frame-count">0</span>';

        header.appendChild(timeDisplay);
        header.appendChild(frameInfo);

        return header;
    }

    createPopulationSection() {
        const section = document.createElement('div');

        // Biomasa total
        const biomassRow = this.createStatRow('BIOMASSA TOTAL', 'entity-count', '0', 'pop-bar', 'bar-pop');
        section.appendChild(biomassRow);

        // Grid de especies y adaptación
        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;';

        const speciesBox = this.createInfoBox('ESPECIES', 'species-count', '0', '#00d2ff');
        const sodBox = this.createInfoBox('ADAPTACIÓN', 'sod-count', '0%', '#ffcc00');

        grid.appendChild(speciesBox);
        grid.appendChild(sodBox);
        section.appendChild(grid);

        return section;
    }

    createResourcesSection() {
        const section = document.createElement('div');

        // Header
        const header = document.createElement('div');
        header.className = 'stat-header';
        header.textContent = 'ENVIRONMENTAL FLUX';
        header.style.cssText = 'font-size: 0.7rem; color: #00ffff; letter-spacing: 1px; margin-bottom: 10px;';
        section.appendChild(header);

        // Recursos
        const o2Row = this.createStatRow('TOXICIDAD O₂', 'oxygen-count', '0.00', 'o2-bar', 'bar-o2');
        const n2Row = this.createStatRow('NITRÓGENO (N₂)', 'nitrogen-count', '0.00', 'n2-bar', 'bar-n2');
        const pRow = this.createStatRow('FÓSFORO (PO₄)', 'phosphorus-count', '0.00', 'p-bar', 'bar-p');

        section.appendChild(o2Row);
        section.appendChild(n2Row);
        section.appendChild(pRow);

        return section;
    }

    createMetabolismSection() {
        const section = document.createElement('div');
        section.style.cssText = 'margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;';

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; justify-content: space-between; font-size: 0.7rem; color: #667788;';

        const luca = document.createElement('span');
        luca.innerHTML = 'LUCA: <b id="luca-count" style="color: #fff">0</b>';

        const ferm = document.createElement('span');
        ferm.innerHTML = 'FERM: <b id="fermentation-count" style="color: #fff">0</b>';

        const chem = document.createElement('span');
        chem.innerHTML = 'CHEM: <b id="chemosynthesis-count" style="color: #fff">0</b>';

        container.appendChild(luca);
        container.appendChild(ferm);
        container.appendChild(chem);
        section.appendChild(container);

        return section;
    }

    createStatRow(label, valueId, defaultValue, barId, barClass) {
        const row = document.createElement('div');
        row.className = 'stat-row';

        const labelDiv = document.createElement('div');
        labelDiv.className = 'stat-label';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;

        const valueSpan = document.createElement('span');
        valueSpan.className = 'stat-value';
        valueSpan.id = valueId;
        valueSpan.textContent = defaultValue;

        labelDiv.appendChild(labelSpan);
        labelDiv.appendChild(valueSpan);

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const barFill = document.createElement('div');
        barFill.id = barId;
        barFill.className = `bar-fill ${barClass}`;

        progressBar.appendChild(barFill);

        row.appendChild(labelDiv);
        row.appendChild(progressBar);

        return row;
    }

    createInfoBox(label, valueId, defaultValue, color) {
        const box = document.createElement('div');
        box.style.cssText = 'background: rgba(255,255,255,0.03); padding: 8px; border-radius: 4px; text-align: center;';

        const labelDiv = document.createElement('div');
        labelDiv.style.cssText = 'font-size: 0.6rem; color: #888;';
        labelDiv.textContent = label;

        const valueDiv = document.createElement('div');
        valueDiv.id = valueId;
        valueDiv.style.cssText = `font-size: 1rem; color: ${color}; font-weight: bold;`;
        valueDiv.textContent = defaultValue;

        box.appendChild(labelDiv);
        box.appendChild(valueDiv);

        return box;
    }

    createVentLabButton() {
        // Buscar el botón de salida para insertar después
        const exitBtn = document.getElementById('exit-btn');
        if (!exitBtn) return;

        const btnVentLab = document.createElement('button');
        btnVentLab.id = 'vent-lab-btn';
        btnVentLab.innerHTML = '🌋 ADVANCED VENT CONTROL';

        // Styling
        btnVentLab.style.cssText = `
            width: 100%;
            margin-bottom: 20px;
            padding: 12px;
            background: linear-gradient(135deg, #16222a, #3a6073);
            border: 2px solid #00ffff;
            color: #00ffff;
            font-weight: bold;
            font-size: 0.85rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            transition: all 0.3s ease;
            display: none;
        `;

        // Event handlers
        btnVentLab.onmouseenter = () => {
            btnVentLab.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
        };
        btnVentLab.onmouseleave = () => {
            btnVentLab.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
        };

        // Click handler - Delega toda la configuración a ScenarioManager
        btnVentLab.onclick = () => {
            if (confirm('🌋 Entrar al Laboratorio de Vents?\n\nEsto pausará la simulación actual y cargará un entorno de prueba.')) {
                if (window.gameInstance) window.gameInstance.stop();

                setTimeout(() => {
                    if (!window.gameInstance) window.gameInstance = new GameController();
                    // ScenarioManager calcula dimensiones automáticamente en _mergeConfig()
                    window.scenarioManager.loadScenario(ScenarioLibrary.VENT_LABORATORY);
                    GameController.startGame('VENT_LABORATORY_MODE');
                }, 100);
            }
        };

        // Insertar después del botón de salida
        exitBtn.parentNode.insertBefore(btnVentLab, exitBtn.nextSibling);
    }

    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
        // Show exit button
        const btnExit = document.getElementById('exit-btn');
        if (btnExit) btnExit.style.display = 'block';

        // Show vent lab button
        const btnVentLab = document.getElementById('vent-lab-btn');
        if (btnVentLab) btnVentLab.style.display = 'block';
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        // Hide exit button
        const btnExit = document.getElementById('exit-btn');
        if (btnExit) btnExit.style.display = 'none';

        // Hide vent lab button
        const btnVentLab = document.getElementById('vent-lab-btn');
        if (btnVentLab) btnVentLab.style.display = 'none';
    }

    update(stats) {
        if (!this.container || this.container.style.display === 'none') return;

        // TIEMPO GEOLÓGICO
        const gaDisplay = "4.000 Ga";

        this.setSafeText('time-display', gaDisplay);
        this.setSafeText('frame-count', frameCount);

        // POPULATION
        this.setSafeText('entity-count', stats.entityCount);
        this.setSafeText('species-count', stats.speciesCount);

        const popPct = Math.min(100, (stats.entityCount / 500) * 100);
        this.updateBar('pop-bar', popPct);

        // SPECIES & EVOLUTION
        this.setSafeText('luca-count', stats.lucaCount);
        this.setSafeText('fermentation-count', stats.fermentationCount);
        this.setSafeText('chemosynthesis-count', stats.chemosynthesisCount);

        // SOD Adaptation
        const sodPct = stats.sodCount > 0 ? ((stats.sodCount / stats.entityCount) * 100).toFixed(0) + '%' : '0%';
        this.setSafeText('sod-count', sodPct);

        // RESOURCES (Averages)
        const o2Val = stats.totalOxygen !== undefined ? stats.totalOxygen : 0;
        const n2Val = stats.totalNitrogen !== undefined ? stats.totalNitrogen : 0;
        const pVal = stats.totalPhosphorus !== undefined ? stats.totalPhosphorus : 0;

        this.setSafeText('oxygen-count', o2Val.toFixed(2));
        this.setSafeText('nitrogen-count', n2Val.toFixed(2));
        this.setSafeText('phosphorus-count', pVal.toFixed(2));

        // Bars (Max values roughly based on GameConstants thresholds)
        this.updateBar('o2-bar', Math.min(100, (o2Val / 20) * 100)); // 20 is lethal
        this.updateBar('n2-bar', Math.min(100, (n2Val / 50) * 100));
        this.updateBar('p-bar', Math.min(100, (pVal / 10) * 100));
    }

    updateBar(id, percentage) {
        const el = document.getElementById(id);
        if (el) el.style.width = percentage + '%';
    }

    setSafeText(id, value) {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    setSafeTextHTML(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    /**
     * Destruye el componente y lo elimina del DOM
     */
    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}
