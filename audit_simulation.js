const fs = require('fs');
const path = 'c:/Proyectos/rare/Cells/logs/cells_dev_run_PRESSURE_OXYGEN_2025-12-28T21-59-15.json';

try {
    const raw = fs.readFileSync(path, 'utf8');
    const json = JSON.parse(raw);

    console.log(`\n=== 1. LOG INTEGRITY ===`);
    console.log(`Run ID: ${json.run_id}`);
    console.log(`Total Frames: ${json.frame_stats.length}`);
    const sampleFrame = json.frame_stats[50] || json.frame_stats[0];
    console.log(`Telemetry Check (Frame 50):`);
    console.log(`- env_max_oxygen: ${sampleFrame.env_max_oxygen !== undefined ? 'OK (' + sampleFrame.env_max_oxygen + ')' : 'MISSING ❌'}`);
    console.log(`- victims_oxidative: ${sampleFrame.victims_oxidative !== undefined ? 'OK' : 'MISSING ❌'}`);

    console.log(`\n=== 2. INITIAL STATE (Frame 0) ===`);
    const genesis = json.events.find(e => e.event_type === 'birth' && e.cell_id === 0);
    if (genesis) {
        console.log(`- Energy: ${genesis.data.energy} ${genesis.data.energy >= 499 ? '✅' : '❌ (Expected 500)'}`);
        console.log(`- SOD Efficiency: ${genesis.data.dna.sodEfficiency}`);
        console.log(`- Position: [${genesis.data.position.x.toFixed(0)}, ${genesis.data.position.y.toFixed(0)}]`);
    } else {
        console.log(`❌ No Genesis Event Found for Cell 0`);
    }

    console.log(`\n=== 3. MECHANICS CHECK (O2 Rise) ===`);
    // Check O2 rise between Frame 100 and Frame 200
    const f100 = json.frame_stats.find(f => f.frame_number === 100);
    const f200 = json.frame_stats.find(f => f.frame_number === 200);

    if (f100 && f200 && f100.env_max_oxygen && f200.env_max_oxygen) {
        const delta = f200.env_max_oxygen - f100.env_max_oxygen;
        const rate = delta / 100; // per frame
        console.log(`- O2 at Frame 100: ${f100.env_max_oxygen}`);
        console.log(`- O2 at Frame 200: ${f200.env_max_oxygen}`);
        console.log(`- Rise per 100 frames: ${delta.toFixed(4)}`);
        console.log(`- Rate per Frame: ${rate.toFixed(5)} ${Math.abs(rate - 0.002) < 0.0001 ? '✅ (Matches 0.002)' : '⚠️ (Mismatch)'}`);
    } else {
        console.log(`⚠️ Insufficient data for Rate check (Telemetry missing?)`);
    }

    console.log(`\n=== 4. DEATH ANALYSIS ===`);
    const deaths = json.events.filter(e => e.event_type === 'death');
    console.log(`Total Deaths: ${deaths.length}`);

    if (deaths.length > 0) {
        // Group by Cause
        const causes = {};
        deaths.forEach(d => {
            const reason = d.data.death_reason || 'unknown';
            causes[reason] = (causes[reason] || 0) + 1;
        });
        console.table(causes);

        // First 3 Deaths Detail
        deaths.slice(0, 3).forEach((d, i) => {
            // Find frame stats for context
            const frameCtx = json.frame_stats.find(f => f.frame_number === d.frame_number);
            const o2Ctx = frameCtx ? frameCtx.env_max_oxygen : '???';
            console.log(`#${i + 1} Frame ${d.frame_number}: ${d.data.death_reason} (O2=${o2Ctx})`);
        });
    }

    console.log(`\n=== 5. SIMULATION ENDGAME ===`);
    const last = json.frame_stats[json.frame_stats.length - 1];
    console.log(`Final Frame: ${last.frame_number}`);
    console.log(`Final O2: ${last.env_max_oxygen}`);
    console.log(`Final Pop: ${last.population}`);

} catch (e) {
    console.error("FATAL PARSE ERROR:", e.message);
}
