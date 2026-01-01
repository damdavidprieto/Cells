const fs = require('fs');
const path = 'c:/Proyectos/rare/Cells/logs/cells_dev_run_PRESSURE_OXYGEN_2025-12-28T21-54-15.json';

try {
    const raw = fs.readFileSync(path, 'utf8');
    const json = JSON.parse(raw);

    console.log(`Run ID: ${json.run_id}`);
    console.log(`Total Frames Recorded: ${json.frame_stats.length}`);

    // Sample Frames
    const f100 = json.frame_stats.find(f => f.frame_number === 100);
    const f500 = json.frame_stats.find(f => f.frame_number === 500);
    const f1000 = json.frame_stats.find(f => f.frame_number === 1000);
    const last = json.frame_stats[json.frame_stats.length - 1];

    console.log('\n=== O2 SAMPLES ===');
    if (f100) console.log(`Frame 100: MaxO2=${f100.env_max_oxygen}, Pop=${f100.population}`);
    if (f500) console.log(`Frame 500: MaxO2=${f500.env_max_oxygen}, Pop=${f500.population}`);
    if (f1000) console.log(`Frame 1000: MaxO2=${f1000.env_max_oxygen}, Pop=${f1000.population}`);
    if (last) console.log(`Last Frame (${last.frame_number}): MaxO2=${last.env_max_oxygen}, Pop=${last.population}`);

    // Death Analysis
    const deaths = json.events.filter(e => e.event_type === 'death');
    console.log(`\n=== DEATHS (${deaths.length}) ===`);
    if (deaths.length > 0) {
        console.log(`First Death Reason: ${deaths[0].data.death_reason}`);
        console.log(`First Death Data:`, JSON.stringify(deaths[0].data));
    }

    // Damage Trace Analysis
    const traces = json.events.filter(e => e.event_type === 'damage_trace');
    console.log(`\n=== DAMAGE TRACES (${traces.length}) ===`);
    if (traces.length > 0) {
        console.log(`First Trace:`, JSON.stringify(traces[0].data));
    }

} catch (e) {
    console.error("Error parsing log:", e.message);
}
