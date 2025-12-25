const fs = require('fs');
const path = require('path');

const logPath = 'logs/cells_dev_run_2025-12-25T14-02-52.json';

try {
    console.log(`Analyzing: ${logPath}`);
    const rawData = fs.readFileSync(logPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log(`\n=== GENERAL STATS ===`);
    console.log(`Total Frames: ${data.total_frames}`);
    console.log(`Total Events: ${data.events.length}`);
    console.log(`Total Mutations: ${data.mutations ? data.mutations.length : 0}`);

    // 1. METABOLISM ANALYSIS
    console.log(`\n=== 1. METABOLISM & ENERGY ===`);
    // Sample frames to see energy trends
    if (data.frame_stats && data.frame_stats.length > 0) {
        const first = data.frame_stats[0];
        const mid = data.frame_stats[Math.floor(data.frame_stats.length / 2)];
        const last = data.frame_stats[data.frame_stats.length - 1];

        console.log(`Avg Energy (Start): ${first.avg_energy.toFixed(2)}`);
        console.log(`Avg Energy (Mid): ${mid.avg_energy.toFixed(2)}`);
        console.log(`Avg Energy (End): ${last.avg_energy.toFixed(2)}`);
    }

    // 2. REPRODUCTION ANALYSIS
    console.log(`\n=== 2. REPRODUCTION MECHANICS ===`);
    const repros = data.events.filter(e => e.event_type === 'reproduction');
    console.log(`Total Reproductions: ${repros.length}`);
    if (repros.length > 1) {
        // Calculate avg time between reproductions (approximate)
        const times = repros.map(r => r.frame_number);
        let intervals = [];
        for (let i = 1; i < times.length; i++) intervals.push(times[i] - times[i - 1]);
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        console.log(`Avg Frames between global births: ${avgInterval.toFixed(1)}`);

        // Check check generation progression
        const maxGen = repros.reduce((max, r) => Math.max(max, r.data.parent_generation || 0), 0);
        console.log(`Max Generation Reached: ${maxGen + 1}`);
    }

    // 3. EVOLUTION (MUTATION) ANALYSIS
    console.log(`\n=== 3. EVOLUTION & HYSTERESIS ===`);
    if (data.mutations && data.mutations.length > 0) {
        let driftDetected = 0;
        let speciesSwitches = 0;

        data.mutations.forEach(m => {
            const dna = m.dna_changes.child_dna;
            if (dna && dna.metabolismType && dna.metabolismType !== 'luca') {
                speciesSwitches++;
            }
            // Check for efficiency drift
            if (dna && dna.metabolisms && dna.metabolisms.luca) {
                // heuristic: if efficiency is exactly predictable it's distinct from prev? 
                // Hard to check drift without parent reference here, but we can see range.
            }
        });
        console.log(`Potential Species Divergences detected: ${speciesSwitches}`);

        // Show last mutation to see if it's crazy
        const lastMut = data.mutations[data.mutations.length - 1];
        console.log(`Last Mutation (Frame ${lastMut.frame_number}) Type: ${lastMut.dna_changes.child_dna.metabolismType}`);
    } else {
        console.log("No mutations recorded.");
    }

    // 4. DEATH ANALYSIS
    console.log(`\n=== 4. SURVIVAL & DEATHS ===`);
    const deaths = data.events.filter(e => e.event_type === 'death'); // Assuming death events are logged as 'death'
    // Log calls it 'death' in logCellEvent

    // Group by cause
    let causes = {};
    deaths.forEach(d => {
        const c = d.data.cause || 'unknown';
        causes[c] = (causes[c] || 0) + 1;
    });
    console.log("Death Causes:", JSON.stringify(causes, null, 2));

} catch (err) {
    console.error('Error:', err.message);
}
