
/**
 * Diagnostic Script: simulate_lab_scenario.js
 * Mimics the math of ScenarioManager, StratificationManager, and VentFactory
 * to identify why the vent is "missing" or the grid is "black".
 */

// Mock p5.js functions
const floor = Math.floor;
const max = Math.max;
const min = Math.min;

const config = {
    resolution: 60,
    windowWidth: 1000, // Example width
    windowHeight: 800,
    rows: 1,
    cols: 0, // Auto
    sedimentDepth: 1.0,
    atmosphereDepth: 0.0,
    restrictToVents: true,
    vents: [{
        type: 'CENTER',
        subType: 'ALKALINE',
        width: 1
    }]
};

function diagnose() {
    const results = {};

    // 1. Environment Dimension Calculation
    const resolution = config.resolution;
    const cols = config.cols || floor(config.windowWidth / resolution);
    const rows = config.rows;
    results.dimensions = { cols, rows, resolution };

    // 2. Stratification Manager logic
    const stratification = {
        rows, cols,
        atmosphereRow: floor(rows * config.atmosphereDepth),
        sedimentRow: floor(rows * (1 - config.sedimentDepth))
    };

    stratification.waterStartRow = stratification.atmosphereRow;
    stratification.waterEndRow = stratification.sedimentRow;
    stratification.waterStartCol = 0;
    stratification.waterEndCol = cols;

    if (config.restrictToVents) {
        // applyRestrictedBoundaries
        stratification.atmosphereRow = -1;
        stratification.sedimentRow = rows;
        stratification.waterStartRow = 0;
        stratification.waterEndRow = rows;

        if (config.vents && config.vents.length > 0) {
            let vWidth = config.vents[0].width || 1;
            let centerCol = floor(cols / 2);
            let halfWidth = floor(vWidth / 2);

            stratification.waterStartCol = max(0, centerCol - halfWidth);
            stratification.waterEndCol = min(cols, centerCol + halfWidth + 1);
        }
    }
    results.stratification = stratification;

    // 3. Vent Factory logic
    const ventConfigs = config.vents;
    const createdVents = [];

    for (const vConfig of ventConfigs) {
        let x = 0;
        if (vConfig.type === 'CENTER') {
            x = (cols / 2) - (vConfig.width || 1) / 2;
        }

        let sedimentRow = floor(rows * (1 - config.sedimentDepth));
        let y = sedimentRow * resolution;

        createdVents.push({
            id: 'vent_debug',
            x, y,
            width: vConfig.width,
            pos: { x: x * resolution, y: y }
        });
    }
    results.vents = createdVents;
    results.ventCount = createdVents.length;
    results.errorFlags = {
        zeroVents: createdVents.length === 0,
        multipleVents: createdVents.length > 1,
        ventOutsideWater: createdVents.some(v => {
            const gridX = v.x;
            const gridY = floor(v.y / resolution);
            return !(gridX >= stratification.waterStartCol &&
                gridX < stratification.waterEndCol &&
                gridY >= stratification.waterStartRow &&
                gridY < stratification.waterEndRow);
        })
    };

    console.log(JSON.stringify(results, null, 2));
}

diagnose();
