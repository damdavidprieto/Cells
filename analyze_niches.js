
const fs = require('fs');

// --- SIMULATION CONFIG ---
const ROWS = 100; // 100 units of depth (0=Surface, 100=Bottom)
const COLS = 5;   // Minimal width (gradients are vertical)
const FRAMES = 1000; // Frames to stabilize
const ATMOSPHERE_ROW = 10;
const SEDIMENT_ROW = 90;

// --- MOCK ENVIRONMENT ---
const h2Grid = createGrid(COLS, ROWS);
const oxygenGrid = createGrid(COLS, ROWS);
const lightGrid = createGrid(COLS, ROWS);
// Assume CO2 is abundant/constant for now or diffuse it too
const co2Grid = createGrid(COLS, ROWS); // Initialize with 100

function createGrid(cols, rows) {
    return Array(cols).fill(0).map(() => Array(rows).fill(0));
}

// --- DIFFUSION RATES (Approximated from GameConstants) ---
const RATE_AIR = 0.6;
const RATE_WATER = 0.2;
const RATE_SEDIMENT = 0.05;

function getRate(y) {
    if (y < ATMOSPHERE_ROW) return RATE_AIR;
    if (y >= SEDIMENT_ROW) return RATE_SEDIMENT;
    return RATE_WATER;
}

// --- METABOLIC CONSTANTS ---
const BASE_COST = 0.2; // Base maintenance
const EFFICIENCY = 0.85; // Standard efficiency

// --- SIMULATION LOOP ---
console.log(`Running Niche Analysis for ${FRAMES} frames...`);

for (let f = 0; f < FRAMES; f++) {

    // 1. REGENERATION (Sources)
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            // Light (Instant calculation)
            let depthRatio = y / ROWS;
            let maxLight = 100 * Math.exp(-4 * depthRatio);
            if (lightGrid[x][y] < maxLight) lightGrid[x][y] += 0.5;

            // H2 (Vents in Sediment)
            if (y >= SEDIMENT_ROW) {
                h2Grid[x][y] += 2.0;
                if (h2Grid[x][y] > 250) h2Grid[x][y] = 250;
            }

            // O2 (Atmospheric Source)
            if (y < ATMOSPHERE_ROW) {
                oxygenGrid[x][y] = 20; // Constant atmospheric O2 (20%)
            }

            // CO2 (Atmospheric Source)
            if (y < ATMOSPHERE_ROW) {
                co2Grid[x][y] = 100; // Saturation
            } else {
                // Background CO2 in water
                if (co2Grid[x][y] < 10) co2Grid[x][y] += 0.1;
            }
        }
    }

    // 2. DIFFUSION (Simple 1D Vertical for speed, since X is uniform)
    // Actually, let's do 2D to be safe, but X is periodic or irrelevant
    diffuse(h2Grid);
    diffuse(oxygenGrid);
    diffuse(co2Grid);
}

function diffuse(grid) {
    // Clone grid for next state
    const nextGrid = grid.map(col => [...col]);

    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            let rate = getRate(y);
            let val = grid[x][y];

            let sum = 0;
            let count = 0;

            // Simple Vertical Neighbors (dominates vertical gradient)
            if (y > 0) { sum += grid[x][y - 1]; count++; }
            if (y < ROWS - 1) { sum += grid[x][y + 1]; count++; }

            // Horizontal (just to mix)
            // if (x > 0) { sum += grid[x-1][y]; count++; }
            // if (x < COLS-1) { sum += grid[x+1][y]; count++; }

            if (count > 0) {
                let avg = sum / count;
                nextGrid[x][y] += (avg - val) * rate;
            }
        }
    }
    // Update original
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) curRow = grid[x][y] = nextGrid[x][y];
    }
}

// --- NICHE CALCULATION ---
console.log("\n=== ECOLOGICAL NICHE REPORT ===");
console.log("| Zone | Depth (m) | Light | H2 | O2 | LUCA Net | Photo Net | Resp Net | Dominant |");
console.log("|---|---|---|---|---|---|---|---|---|");

const centerCol = Math.floor(COLS / 2);
const reportRows = [];

for (let y = 0; y < ROWS; y += 5) { // Sample every 5%
    let h2 = h2Grid[centerCol][y];
    let light = lightGrid[centerCol][y];
    let o2 = oxygenGrid[centerCol][y];
    let co2 = co2Grid[centerCol][y];

    // -- YIELDS --

    // 1. LUCA (H2 + CO2)
    // Availability
    let availH2 = Math.min(h2 / 0.4, 1.0);
    // CO2 is usually abundant, assume 1.0 for simplicity or min(co2/0.2, 1)
    let availCO2 = Math.min(co2 / 0.2, 1.0);
    let lucaYield = 1.5 * EFFICIENCY * Math.min(availH2, availCO2);
    let lucaBonus = (y >= SEDIMENT_ROW) ? 0.5 * EFFICIENCY : 0;
    let lucaNet = (lucaYield + lucaBonus) - BASE_COST * EFFICIENCY; // Simple cost model

    // 2. Photosynthesis (Light + CO2) - Anoxigenic
    let availLight = Math.min(light / 50, 1.0); // Anoxigenic threshold
    let photoYield = 6.0 * 0.2 * Math.min(availLight, availCO2); // 0.2 efficiency factor approx
    let photoNet = photoYield - BASE_COST * EFFICIENCY;

    // 3. Respiration (Energy + O2) - Not autotrophic!
    // Respiration requires FOOD (Energy). It's a consumer strategy.
    // For this niche map, we compare Primary Producers.
    // So compare LUCA vs PHOTOSYNTHESIS.

    let dominant = "Dead Zone";
    if (lucaNet > 0 && lucaNet > photoNet) dominant = "LUCA (Chemo)";
    if (photoNet > 0 && photoNet > lucaNet) dominant = "Photo (Solar)";
    if (lucaNet < 0 && photoNet < 0) dominant = "Death Zone";
    if (lucaNet > 0 && photoNet > 0 && Math.abs(lucaNet - photoNet) < 0.1) dominant = "Competition";

    let zoneName = "Water";
    if (y < ATMOSPHERE_ROW) zoneName = "Surface";
    if (y >= SEDIMENT_ROW) zoneName = "Sediment";

    const row = `| ${zoneName} | ${y}% | ${light.toFixed(1)} | ${h2.toFixed(1)} | ${o2.toFixed(1)} | ${lucaNet.toFixed(3)} | ${photoNet.toFixed(3)} | - | **${dominant}** |`;
    console.log(row);
    reportRows.push(row);
}
