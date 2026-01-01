const fs = require('fs');
// TARGETING THE DUPLICATE FILE WHICH IS LIKELY THE NEWEST ONE
const path = 'c:/Proyectos/rare/Cells/logs/cells_dev_run_PRESSURE_OXYGEN_2025-12-28T21-59-15 (1).json';

try {
    if (!fs.existsSync(path)) {
        console.error("File not found:", path);
        // Fallback to checking ANY json file in the dir to find the newest
        const dir = 'c:/Proyectos/rare/Cells/logs/';
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
        console.log("Available files:", files);
        process.exit(1);
    }

    const raw = fs.readFileSync(path, 'utf8');
    const json = JSON.parse(raw);

    console.log(`\n=== AUDIT TIMESTAMP: ${new Date().toISOString()} ===`);
    console.log(`File: ${path}`);
    console.log(`Run ID: ${json.run_id}`);
    console.log(`Export Time: ${json.export_time}`); // THIS IS THE TRUTH

    // TELEMETRY CHECK
    const sample = json.frame_stats[json.frame_stats.length - 1];
    console.log(`Telemetry Check (Last Frame):`);
    console.log(`- env_max_oxygen: ${sample && sample.env_max_oxygen !== undefined ? 'OK (' + sample.env_max_oxygen + ')' : 'MISSING ❌'}`);

    // O2 RATE CHECK
    if (json.frame_stats.length > 200) {
        const f100 = json.frame_stats.find(f => f.frame_number === 100);
        const f200 = json.frame_stats.find(f => f.frame_number === 200);
        if (f100 && f200 && f100.env_max_oxygen) {
            const rate = (f200.env_max_oxygen - f100.env_max_oxygen) / 100;
            console.log(`Rate Check: ${rate.toFixed(5)} (Target: 0.00200)`);
        }
    }

    // DEATH CHECK
    const deaths = json.events.filter(e => e.event_type === 'death');
    console.log(`Total Deaths: ${deaths.length}`);

} catch (e) {
    console.error("Error:", e.message);
}
