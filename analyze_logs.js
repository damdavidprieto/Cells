const fs = require('fs');
const path = require('path');

// Configuration
const LOG_DIR = 'c:/Proyectos/rare/Cells/logs';

// Find latest log file
function getLatestLog() {
    const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) return null;

    return files.map(f => ({
        name: f,
        time: fs.statSync(path.join(LOG_DIR, f)).mtime.getTime()
    })).sort((a, b) => b.time - a.time)[0].name;
}

const latestFile = getLatestLog();
if (!latestFile) {
    console.error("No log files found.");
    process.exit(1);
}

console.log(`Analyzing: ${latestFile}`);
const data = JSON.parse(fs.readFileSync(path.join(LOG_DIR, latestFile), 'utf8'));
const events = data.events;

// 1. LIFESPAN ANALYSIS
const cells = {}; // Map cell_id -> { birthFrame, deathFrame, parentId }

events.forEach(e => {
    if (e.event_type === 'birth' || e.event_type === 'reproduction') {
        // 'reproduction' event implies birth of 'child_id' inside data
        // But 'birth' event might be explicit if logged separately.
        // Based on previous code, 'reproduction' logs the PARENT activity, but contains CHILD ID.

        let childId = null;
        let parentId = null;

        if (e.event_type === 'reproduction') {
            childId = e.data.child_id;
            parentId = e.cell_id;
        }

        if (childId && childId !== 'unknown') {
            if (!cells[childId]) cells[childId] = { birthFrame: e.frame_number, offspring: 0 };
            cells[childId].parentId = parentId;
        }
    }

    if (e.event_type === 'death') {
        const id = e.cell_id;
        if (!cells[id]) cells[id] = { birthFrame: 0, offspring: 0 }; // Assume born a start if unknown
        cells[id].deathFrame = e.frame_number;
        cells[id].cause = e.data ? e.data.cause : 'unknown';
    }
});

events.forEach(e => {
    if (e.event_type === 'reproduction') {
        const parentId = e.cell_id;
        if (cells[parentId]) {
            cells[parentId].offspring++;
            if (!cells[parentId].reproductionFrames) cells[parentId].reproductionFrames = [];
            cells[parentId].reproductionFrames.push(e.frame_number);
        }
    }
});

// Calculate Stats
let totalLifespan = 0;
let deadCount = 0;
let totalGenerations = 0;
let maxGeneration = 0;
let reproductionIntervals = [];

Object.values(cells).forEach(c => {
    if (c.deathFrame) {
        totalLifespan += (c.deathFrame - c.birthFrame);
        deadCount++;
    }

    if (c.reproductionFrames && c.reproductionFrames.length > 0) {
        // Time to first reproduction
        reproductionIntervals.push(c.reproductionFrames[0] - c.birthFrame);
        // Intervals between subsequent
        for (let i = 1; i < c.reproductionFrames.length; i++) {
            reproductionIntervals.push(c.reproductionFrames[i] - c.reproductionFrames[i - 1]);
        }
    }
});

const avgLifespan = deadCount > 0 ? (totalLifespan / deadCount).toFixed(1) : 0;
const avgReproductionTime = reproductionIntervals.length > 0 ? (reproductionIntervals.reduce((a, b) => a + b, 0) / reproductionIntervals.length).toFixed(1) : 0;

console.log("\n--- BIOLOGICAL METRICS ---");
console.log(`Total Cells Tracked: ${Object.keys(cells).length}`);
console.log(`Deaths Recorded: ${deadCount}`);
console.log(`Average Lifespan: ${avgLifespan} frames`);
console.log(`Average Reproduction Interval: ${avgReproductionTime} frames`);
console.log("--------------------------");

if (avgReproductionTime > 0) {
    const ratio = avgLifespan / avgReproductionTime;
    console.log(`Generations per Lifetime: ${ratio.toFixed(2)}`);
    if (ratio < 1) console.log("WARNING: Cells die faster than they reproduce (Extinction Risk)");
    else console.log("STATUS: Population can sustain growth.");
}

console.log("\n--- DEATH CAUSES ---");
const causes = {};
Object.values(cells).filter(c => c.deathFrame).forEach(c => {
    causes[c.cause] = (causes[c.cause] || 0) + 1;
});
console.table(causes);

console.log("\n--- MUTATION ANALYSIS ---");
const mutations = data.mutations || [];
console.log(`Total Mutation Events: ${mutations.length}`);

// Analyze what properties are changing
const propertyChanges = {};
const magnitudeChanges = {}; // Track numeric changes

mutations.forEach(m => {
    // dna_changes is somewhat unstructured logging in current DB logger
    // But based on previous output, it seems to be captured as an object or just logged as parent/child DNA
    // Let's assume for this specific log run, we might need to actually diff the parent/child DNA if the explicit changes aren't detailed
    // However, looking at the previous specific log output:
    // dna_changes  : @{parent_dna=; child_dna=}
    // This looks like PowerShell formatting of a nested object. The JSON should have specific fields.
    // If we assume the JSON has `dna_changes` as an object with keys for changed properties:

    // In our case, `DNAMutator` might return a new DNA object. 
    // The logger `DatabaseLogger.js` receives `dnaChanges`.
    // In `ReproductionSystem.js` we called: 
    // `DNAMutator.mutate(parent.dna, ...)` which returns a NEW DNA object.

    // NOTE: The current implementation of `ReproductionSystem.js` passes `childDNA` (the whole object)
    // or maybe it calculates diffs?
    // Let's look at `ReproductionSystem.js` again? No, we can't.
    // Let's assume we need to infer based on available data.

    // Actually, `ReproductionSystem.js` does NOT log mutations explicitly via `logMutation`.
    // The `DatabaseLogger` has a `logMutation` method, but `ReproductionSystem` uses `logCellEvent` for reproduction.
    // Wait, `DNAMutator` is where mutations happen. Does IT log?
    // If not, we might be missing specific mutation logs and only have reproduction events.

    // Checking the `mutations` array in JSON: it was empty or sparse in previous step?
    // "run_id... frame... dna_changes : @{parent_dna=...}"
    // This suggests `dna_changes` contains the full parent and child DNA?
    // Let's try to parse differences if `dna_changes` has parent_dna and child_dna

    let changes = m.dna_changes;
    // Handle potential stringified JSON or object
    if (typeof changes === 'string') {
        try { changes = JSON.parse(changes); } catch (e) { }
    }

    // If specific changed properties are listed (e.g. { color: 'newColor' })
    // OR if we have parent_dna and child_dna objects
    if (changes && changes.parent_dna && changes.child_dna) {
        const p = changes.parent_dna;
        const c = changes.child_dna;

        for (let key in c) {
            if (JSON.stringify(p[key]) !== JSON.stringify(c[key])) {
                propertyChanges[key] = (propertyChanges[key] || 0) + 1;

                // Track magnitude for numeric values
                if (typeof c[key] === 'number' && typeof p[key] === 'number') {
                    if (!magnitudeChanges[key]) magnitudeChanges[key] = [];
                    magnitudeChanges[key].push(c[key] - p[key]);
                }
            }
        }
    } else if (changes) {
        // Assume keys are the changed properties
        for (let key in changes) {
            propertyChanges[key] = (propertyChanges[key] || 0) + 1;
        }
    }
});

console.log("Mutated Properties (Count):");
console.table(propertyChanges);

console.log("\nMutation Magnitudes (Average Delta):");
for (let key in magnitudeChanges) {
    const deltas = magnitudeChanges[key];
    const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    console.log(`${key}: ${avg.toFixed(4)}`);
}
