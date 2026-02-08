/**
 * VentMonitorPanel.js
 * ===================
 * Real-time monitoring panel for vent data in LAB scenarios
 * Extends MonitorPanel for reusability
 */
class VentMonitorPanel extends MonitorPanel {
    constructor(vent, x, y, width, height) {
        super(x, y, width, height, '🔬 VENT MONITOR', vent.type.color);
        this.vent = vent;
        this.lineHeight = 18; // More compact
    }

    renderContent(environment) {
        let currentY = this.y + this.padding + 30;
        const halfWidth = this.width / 2;

        // LUCA Suitability Score (Full Width)
        currentY = this._renderSuitabilityScore(currentY);

        const col1Y = currentY;
        const col2Y = currentY;

        // LEFT COLUMN (0 offset)
        let y1 = this._renderBasicInfo(col1Y, 0);
        y1 = this._renderEnvironmentalContext(y1, 0);
        y1 = this._renderCellMonitor(y1, 0, environment); // NEW: Cell monitoring

        // RIGHT COLUMN (halfWidth offset) - Starting at same height as left
        let y2 = col2Y;
        y2 = this._renderChemicalComposition(y2, environment, halfWidth);
        y2 = this._renderCofactors(y2, halfWidth);
        y2 = this._renderColorAnalysis(y2, halfWidth);
        y2 = this._renderPosition(y2, halfWidth);
        y2 = this._renderExportButton(y2, halfWidth);
    }

    _renderSuitabilityScore(startY) {
        let y = startY;

        const h2Score = Math.max(0, 100 - Math.abs((this.vent.type.h2Output || 0.8) * 100 - 70) * 2);
        const pHScore = Math.max(0, 100 - Math.abs((this.vent.type.pH || 9) - 9) * 20);
        const tempScore = Math.max(0, 100 - Math.abs((this.vent.type.temperature || 60) - 60) * 2);

        // Mechanical integration: Atomic Shield (Photoprotection) is vital in archaic environments
        const photop = window.colorSystem ? window.colorSystem.calculatePhotoprotection(this.vent.type.color) : 1.0;
        const photoScore = Math.min(100, photop * 60); // Bonus for darker/appropriate colors

        const overall = (h2Score + pHScore + tempScore + photoScore) / 4;

        let scoreColor;
        if (overall >= 70) scoreColor = [100, 255, 100];      // Balanced for 4 factors
        else if (overall >= 50) scoreColor = [255, 200, 100];
        else scoreColor = [255, 100, 100];

        const label = `🧬 Idoneidad LUCA: ${overall.toFixed(1)}% (Id: >80%)`;
        this.registerTooltip(this.x + this.padding, y, textWidth(label), 15, "Grado de idoneidad biogénica. Incluye energía redox, pH, temperatura y el Escudo Atómico (protección UV por color).");

        fill(scoreColor[0], scoreColor[1], scoreColor[2]);
        textSize(13);
        textFont('Verdana');
        textStyle(BOLD);
        textAlign(LEFT, TOP);
        text(label, this.x + this.padding, y);

        fill(180, 180, 190);
        textSize(9);
        textStyle(NORMAL);
        y += 18;
        text('(Sinergia entre química redox y fotoprotección ambiental)', this.x + this.padding, y);

        return y + 22;
    }

    _renderBasicInfo(startY, xOffset) {
        let y = this.renderSectionHeader('INFO BÁSICA / GÉNESIS', startY, '📋', xOffset);
        const drawX = this.x + this.padding + xOffset;

        // Vent Identity
        const typeLabel = `TIPO: ${this.vent.type.id.toUpperCase()}`;
        this.registerTooltip(drawX, y, 150, 15, "Clasificación geoquímica del vent basada en su temperatura y composición mineral.");
        fill(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
        textSize(11); textStyle(BOLD);
        text(typeLabel, drawX, y);
        textStyle(NORMAL); y += this.lineHeight;

        const Ga = (this.vent.lifecycle.age / 100000).toFixed(3);
        const era = Ga < 0.5 ? 'Eoarcaico' : 'Paleoarcaico';

        const tooltips = {
            redox: "Potencial Redox: Mide la capacidad del vent para donar electrones. Un valor negativo indica un fuerte potencial reductor.",
            age: "Edad de la Simulación convertida a Giga-años (Ga). 1.0 Ga = 100.000 unidades de tiempo.",
            geol: "Clasificación de la era geológica según la simulación actual."
        };

        this.registerTooltip(drawX, y, 200, 15, "Origen geológico y proceso químico dominante (ej: serpentinización).");
        y = this.renderText('Id. Evol.', `Alcalino / serpentinización`, y, 10, xOffset);

        this.registerTooltip(drawX, y, 200, 15, tooltips.redox);
        y = this.renderText('Pot. Redox', `${this.vent.type.redox || -400} mV (Id: -700)`, y, 10, xOffset);

        this.registerTooltip(drawX, y, 200, 15, tooltips.age);
        y = this.renderText('Edad Sim', `${this.vent.lifecycle.age} f (${Ga} Ga)`, y, 10, xOffset);

        this.registerTooltip(drawX, y, 200, 15, tooltips.geol);
        y = this.renderText('Era Geol.', era, y, 10, xOffset);

        return y + 5;
    }

    _renderEnvironmentalContext(startY, xOffset) {
        let y = this.renderSectionHeader('OCÉANO ARCAICO', startY, '🌊', xOffset);
        const drawX = this.x + this.padding + xOffset;

        const depth = 50;
        const lumens = Math.floor(450 * Math.exp(-0.05 * depth)); // Exponential light decay

        // UV Calculation (Beer-Lambert Law)
        // Surface UV was high (~100 W/m²) but attenuates rapidly in water (k ~ 0.1-0.2)
        // At 50m, it should be negligible (< 1.0) to allow life (LUCA)
        const uvSurface = 100;
        const attenuationK = 0.1; // Attenuation coefficient
        const uvRadiation = (uvSurface * Math.exp(-attenuationK * depth)).toFixed(2);

        const pressure = (1 + (depth * 0.1) + 0.8).toFixed(1);

        this.registerTooltip(drawX, y, 200, 15, "Profundidad del vent en la columna de agua. Afecta a la luz y la presión.");
        y = this.renderText('Profund.', `~${depth} m (Id: 100m)`, y, 10, xOffset);

        this.registerTooltip(drawX, y, 200, 15, "Intensidad lumínica en la zona fótica. Un valor de ~500 lm es ideal para la visibilidad celular.");
        y = this.renderText('Luz Phot.', `${lumens} lm (Id: ~500)`, y, 10, xOffset);

        this.registerTooltip(drawX, y, 200, 15, "Radiación UV nociva. Muy alta en el Arcaico por la ausencia de ozono, pero bloqueada por la profundidad.");
        y = this.renderText('Rad. UV', `${uvRadiation} W/m² (Id: <1.0)`, y, 10, xOffset);

        this.registerTooltip(drawX, y, 200, 15, "Presión atmosférica combinada con la hidrostática. Incluye el efecto de la densa atmósfera de CO2.");
        y = this.renderText('Atmosfera', `Anóxica (P: ${pressure} bar)`, y, 10, xOffset);

        return y + 5;
    }

    _renderChemicalComposition(startY, environment, xOffset) {
        let y = this.renderSectionHeader('QUÍMICA Y TERO', startY, '📊', xOffset);
        const drawX = this.x + this.padding + xOffset;

        const chemicals = this.vent.type.chemicals || {};
        const labels = { h2: 'H₂', co2: 'CO₂', ch4: 'CH₄', nh3: 'NH₃', h2s: 'H₂S', fe2: 'Fe²⁺' };
        const ideals = { h2: 0.7, co2: 0.5, o2: 0.05, ph: 9.0, temp: 60, ch4: 0.4, nh3: 0.2, h2s: 0.0, fe2: 0.5 };
        const desc = {
            h2: "Hidrógeno: Base energética principal para LUCA (Vía Wood-Ljungdahl).",
            co2: "Dióxido de Carbono: Fuente inorgánica de carbono para la biosíntesis.",
            ch4: "Metano: Producto biogénico o geológico; fuente de carbono reducida.",
            nh3: "Amoniaco: Fuente de nitrógeno esencial para aminoácidos.",
            h2s: "Sulfuro de Hidrógeno: Donante de electrones común en fuentes ácidas.",
            fe2: "Hierro Ferroso: Abundante en el Arcaico; cofactor metálico clave."
        };

        const sortedChems = Object.keys(chemicals).sort((a, b) => chemicals[b] - chemicals[a]);
        for (let i = 0; i < Math.min(sortedChems.length, 5); i++) {
            const chem = sortedChems[i];
            this.registerTooltip(drawX, y, 150, 12, desc[chem] || "Concentración química relativa.");
            y = this._renderBarWithIdeal(labels[chem] || chem.toUpperCase(), chemicals[chem], ideals[chem] || 0.5, y, [120, 180, 255], xOffset);
        }

        const pH = this.vent.type.ph || 9.0;
        const temp = this.vent.type.temperature || 70;

        y += 4;
        this.registerTooltip(drawX, y, 150, 12, "Acidez/Alcalinidad. LUCA prefiere un gradiente cercano a pH 9.0.");
        y = this.renderText('pH', `${pH.toFixed(1)} (Id: 9.0)`, y, 10, xOffset);

        this.registerTooltip(drawX, y, 150, 12, "Temperatura del fluido emitido. Afecta a la estabilidad de proteínas.");
        y = this.renderText('Temp', `${temp}°C (Id: 60°C)`, y, 10, xOffset);

        // DYNAMIC ENVIRONMENTAL GRIDS (These DO vary!)
        y += 8;
        fill(200, 200, 220, 150);
        textSize(8);
        textStyle(BOLD);
        text('GRIDS AMBIENTALES (DINÁMICOS):', drawX, y);
        y += 12;
        textStyle(NORMAL);

        // Get grid values at vent position
        const gridX = Math.floor(this.vent.pos.x / environment.resolution);
        const gridY = Math.floor(this.vent.y / environment.resolution);

        if (gridX >= 0 && gridX < environment.cols && gridY >= 0 && gridY < environment.rows) {
            const h2Val = environment.h2Grid[gridX][gridY];
            const o2Val = environment.oxygenGrid[gridX][gridY];
            const nVal = environment.nitrogenGrid[gridX][gridY];
            const pVal = environment.phosphorusGrid[gridX][gridY];

            fill(100, 200, 255);
            text(`H₂: ${h2Val.toFixed(1)} (consumido por células)`, drawX, y);
            y += 10;

            fill(255, 150, 150);
            text(`O₂: ${o2Val.toFixed(1)}`, drawX, y);
            y += 10;

            fill(200, 150, 255);
            text(`N: ${nVal.toFixed(1)}`, drawX, y);
            y += 10;

            fill(255, 200, 100);
            text(`P: ${pVal.toFixed(1)}`, drawX, y);
            y += 10;
        }

        return y + 5;
    }

    _renderCofactors(startY, xOffset) {
        let y = this.renderSectionHeader('COFACTORES (TRAZA)', startY, '🧬', xOffset);
        const drawX = this.x + this.padding + xOffset;

        let traits = [];
        if (this.vent.type.id === 'ALKALINE') traits = [
            { id: 'Ni', name: 'Níquel', tooltip: "Vital para las hidrogenasas de LUCA." },
            { id: 'Mg', name: 'Magnesio', tooltip: "Estabiliza el ADN y cofactor general." },
            { id: 'Ca', name: 'Calcio', tooltip: "Importante para señales y estructura." }
        ];
        else if (this.vent.type.id === 'BLACK_SMOKER') traits = [
            { id: 'Fe', name: 'Hierro', tooltip: "Base de ferredoxinas y transporte de electrones." },
            { id: 'Zn', name: 'Zinc', tooltip: "Esencial para el plegamiento de proteínas." },
            { id: 'Cu', name: 'Cobre', tooltip: "Catalizador en reacciones REDOX." }
        ];
        else traits = [
            { id: 'Mn', name: 'Manganeso', tooltip: "Protección contra estrés oxidativo." },
            { id: 'Mo', name: 'Molibdeno', tooltip: "Fixación de nitrógeno y metabolismo central." }
        ];

        for (let trait of traits) {
            this.registerTooltip(drawX, y, 150, 12, trait.tooltip);
            y = this.renderText(`${trait.id} (${trait.name})`, 'Ok', y, 9, xOffset);
        }

        return y + 5;
    }

    _renderColorAnalysis(startY, xOffset) {
        let y = this.renderSectionHeader('GEOLOGÍA Y ÓPTICA', startY, '💧', xOffset);
        const drawX = this.x + this.padding + xOffset;

        // 1. Mineral Swatches (The "Legend")
        if (this.vent.type.minerals) {
            for (let m of this.vent.type.minerals) {
                this.registerTooltip(drawX, y, 100, 12, m.desc || "Mineral sedimentado.");
                this._renderColorSwatch(m.color, m.name, y, xOffset);
                y += 12;
            }
        }
        y += 8;

        // 2. Optical Breakdown
        const vcs = window.ventColorSystem;
        if (!vcs) return y;

        fill(200, 200, 220, 150);
        textSize(8); textStyle(BOLD);
        text('COMPOSICIÓN ÓPTICA AMBIENTE:', drawX, y);
        y += 12; textStyle(NORMAL);

        const depth = this.vent.y / (window.environment?.resolution || 1);
        const chemicals = this.vent.type.chemicals || {};
        const temperature = this.vent.type.temperature || 70;

        const breakdown = vcs.getColorBreakdown(chemicals, temperature);

        for (let item of breakdown) {
            this.registerTooltip(drawX, y, 180, 12, item.tooltip);

            // Consistent Swatch Style
            fill(item.color);
            noStroke();
            rect(drawX, y, 15, 8, 1);

            // Labels
            fill(255);
            textSize(9);
            const labelText = item.contribution !== 'Base' ?
                `${item.name} (${item.contribution})` : item.name;
            text(labelText, drawX + 20, y);

            fill(180, 180, 190);
            textAlign(RIGHT, TOP);
            text(`${item.effect}`, drawX + 180, y);
            textAlign(LEFT, TOP);

            y += 12;
        }

        y += 8;
        const finalColor = vcs.getAmbientColor(this.vent.y, chemicals);
        this.registerTooltip(drawX, y, 180, 20, "Síntesis cromática final del agua circundante (H2O + Fe2+).");
        this._renderColorSwatch(finalColor, 'AGUA ARCAICA (SÍNTESIS)', y, xOffset);
        y += 15;

        return y + 5;
    }

    _renderCellMonitor(startY, xOffset, environment) {
        let y = this.renderSectionHeader('CÉLULAS ACTIVAS', startY, '🦠', xOffset);
        const drawX = this.x + this.padding + xOffset;

        // Get cells from environment
        const entities = window.entities || [];

        if (entities.length === 0) {
            fill(150, 150, 150);
            textSize(9);
            text('No hay células', drawX, y);
            return y + 15;
        }

        // Show first cell (or average of all cells)
        const cell = entities[0];

        // Position
        this.registerTooltip(drawX, y, 150, 12, "Posición actual de la célula en píxeles.");
        y = this.renderText('Posición', `[${cell.pos.x.toFixed(0)}, ${cell.pos.y.toFixed(0)}]`, y, 9, xOffset);

        // Velocity
        const velMag = cell.vel.mag();
        this.registerTooltip(drawX, y, 150, 12, "Velocidad actual de la célula.");
        y = this.renderText('Velocidad', `${velMag.toFixed(2)} px/f`, y, 9, xOffset);

        // Resources (Dynamic!)
        fill(200, 200, 220, 150);
        textSize(8);
        textStyle(BOLD);
        text('RECURSOS INTERNOS:', drawX, y);
        y += 12;
        textStyle(NORMAL);

        // Energy (color-coded)
        const energyPercent = (cell.energy / cell.maxResources) * 100;
        const energyColor = energyPercent < 20 ? [255, 100, 100] : [100, 255, 100];
        fill(energyColor[0], energyColor[1], energyColor[2]);
        text(`⚡ Energy: ${cell.energy.toFixed(1)} / ${cell.maxResources.toFixed(1)}`, drawX, y);
        y += 10;

        // Oxygen
        fill(150, 200, 255);
        text(`💨 O₂: ${cell.oxygen.toFixed(1)} / ${cell.maxResources.toFixed(1)}`, drawX, y);
        y += 10;

        // Nitrogen
        fill(200, 150, 255);
        text(`🧬 N: ${cell.nitrogen.toFixed(1)} / ${cell.maxResources.toFixed(1)}`, drawX, y);
        y += 10;

        // Phosphorus
        fill(255, 200, 100);
        text(`🔬 P: ${cell.phosphorus.toFixed(1)} / ${cell.maxResources.toFixed(1)}`, drawX, y);
        y += 10;

        // Age
        fill(200, 200, 220);
        text(`⏱️ Edad: ${cell.age} frames`, drawX, y);
        y += 10;

        // Structural Damage
        const damagePercent = (cell.structuralDamage / GameConstants.MAX_STRUCTURAL_DAMAGE) * 100;
        const damageColor = damagePercent > 50 ? [255, 100, 100] : [100, 255, 100];
        fill(damageColor[0], damageColor[1], damageColor[2]);
        text(`🛡️ Daño: ${cell.structuralDamage.toFixed(1)} / ${GameConstants.MAX_STRUCTURAL_DAMAGE}`, drawX, y);
        y += 15;

        return y;
    }

    _renderPosition(startY, xOffset) {
        let y = this.renderSectionHeader('SISTEMA NAV', startY, '📍', xOffset);
        const drawX = this.x + this.padding + xOffset;

        this.registerTooltip(drawX, y, 150, 12, "Columna de la cuadrícula de simulación.");
        y = this.renderText('Grid Col', `${this.vent.x}`, y, 10, xOffset);

        this.registerTooltip(drawX, y, 150, 12, "Coordenada vertical en píxeles.");
        y = this.renderText('Depth Px', `${this.vent.y.toFixed(0)}`, y, 10, xOffset);

        this.registerTooltip(drawX, y, 150, 12, "Ancho del vent en unidades de cuadrícula.");
        y = this.renderText('Ancho', `${this.vent.width}c`, y, 10, xOffset);

        return y;
    }

    _getColorName(rgb) {
        const [r, g, b] = rgb;
        if (g > r && g > b && b > r) return 'Cyan/Azul (Ideal)';
        if (r > g && r > b) return 'Rojo (Ácido)';
        if (g > r && g > b) return 'Verde';
        if (b > r && b > g) return 'Azul';
        return 'Mixto';
    }

    _renderColorSwatch(rgb, label, y, xOffset = 0) {
        const drawX = this.x + this.padding + xOffset;
        fill(rgb[0], rgb[1], rgb[2]);
        noStroke();
        rect(drawX, y, 20, 10, 2);

        fill(200, 200, 210);
        textSize(10);
        text(label, drawX + 30, y);

        return y + this.lineHeight;
    }

    _renderBarWithIdeal(label, actual, ideal, y, color, xOffset) {
        const drawX = this.x + this.padding + xOffset;
        const barWidth = 100;
        const barHeight = 7;
        const actualPercent = Math.min(actual * 100, 100);
        const idealPercent = Math.min(ideal * 100, 100);

        fill(220, 220, 230);
        textSize(9);
        text(label, drawX, y);

        fill(40, 40, 50);
        rect(drawX + 45, y, barWidth, barHeight, 1);

        stroke(100, 255, 100, 200);
        strokeWeight(1);
        const idealX = drawX + 45 + (barWidth * idealPercent / 100);
        line(idealX, y - 2, idealX, y + barHeight + 2);

        noStroke();
        fill(color[0], color[1], color[2], 200);
        rect(drawX + 45, y, (barWidth * actualPercent / 100), barHeight, 1);

        return y + barHeight + 5;
    }

    _renderExportButton(startY, xOffset) {
        let y = startY + 10;
        const drawX = this.x + this.padding + xOffset;
        const btnWidth = 140;
        const btnHeight = 25;

        // Check for hover
        const mx = mouseX;
        const my = mouseY;
        const isHover = mx >= drawX && mx <= drawX + btnWidth && my >= y && my <= y + btnHeight;

        // Button Background
        if (isHover) {
            fill(this.accentColor[0], this.accentColor[1], this.accentColor[2], 200);
            if (mouseIsPressed && !this.wasPressed) {
                this.wasPressed = true;
                if (window.databaseLogger) {
                    console.log('[VentMonitor] Exportando datos...');
                    window.databaseLogger.exportToJSON();
                } else {
                    console.warn('[VentMonitor] DatabaseLogger no disponible');
                }
            }
        } else {
            fill(this.accentColor[0], this.accentColor[1], this.accentColor[2], 50);
            this.wasPressed = false;
        }

        stroke(this.accentColor[0], this.accentColor[1], this.accentColor[2]);
        strokeWeight(1);
        rect(drawX, y, btnWidth, btnHeight, 4);

        // Button Text
        fill(255);
        noStroke();
        textSize(10);
        textAlign(CENTER, CENTER);
        text('💾 EXPORTAR DATOS', drawX + btnWidth / 2, y + btnHeight / 2);
        textAlign(LEFT, TOP);

        return y + btnHeight + 10;
    }
}
