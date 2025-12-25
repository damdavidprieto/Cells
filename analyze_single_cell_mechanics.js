const fs = require('fs');
const path = require('path');

// Auto-detect newest log
const logsDir = 'logs';
const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.json'));
files.sort((a, b) => {
    return fs.statSync(path.join(logsDir, b)).mtime.getTime() -
        fs.statSync(path.join(logsDir, a)).mtime.getTime();
});

if (files.length === 0) {
    console.error("No logs found.");
    process.exit(1);
}

const logPath = path.join(logsDir, files[0]);
console.log(`Analyzing: ${logPath}`);

const data = JSON.parse(fs.readFileSync(logPath, 'utf8'));

// CORRECTION: Single Cell logs are stored in 'cell_events' store with event_type 'single_cell_analysis'
const cellLogs = data.events ? data.events.filter(e => e.event_type === 'single_cell_analysis') : [];

console.log(`Deep Analysis Frames found: ${cellLogs.length}`);
console.log(`Execution Mode in Log: ${data.execution_mode || "Unknown"}`);
console.log(`Scenario: ${data.config?.scenario || "UNDEFINED (Pre-Feature)"}`);
console.log(`Run ID: ${data.run_id}`);
console.log(`Total Frames: ${data.total_frames}`);
console.log(`Top Keys: ${Object.keys(data).join(', ')}`);

if (cellLogs.length === 0) {
    console.log("No single cell detailed logs found. Checking 'frame_stats'...");
    // Fallback to events if detailed logs missing (though they should be there in SINGLE_CELL_MODE)
} else {
    try {
        // Analyze mechanics Frame by Frame
        console.log("\n=== MECHANICS HEALTH CHECK (Pre-Mitosis) ===");

        let prev = cellLogs[0];
        let p_uptake_detected = false;
        let energy_gain_detected = false;
        let moved = false;

        // Check first 100 frames or until first reproduction
        const limit = Math.min(cellLogs.length, 500);

        console.log(`Analyzing first ${limit} frames...`);

        for (let i = 1; i < limit; i++) {
            const curr = cellLogs[i].data;
            const prevData = prev.data;

            if (!curr || !prevData) {
                console.log(`Missing data at frame ${i}`);
                continue;
            }

            // 1. RESOURCE UPTAKE CHECK
            const p_diff = curr.phosphorus - prevData.phosphorus;
            if (p_diff > 0.0001) p_uptake_detected = true;

            const e_diff = curr.energy - prevData.energy;
            // Energy fluctuates due to costs, but should see jumps
            if (e_diff > 0.1) energy_gain_detected = true;

            // 2. MOVEMENT CHECK
            const dist = Math.sqrt(
                Math.pow(curr.pos.x - prevData.pos.x, 2) +
                Math.pow(curr.pos.y - prevData.pos.y, 2)
            );
            if (dist > 0.01) moved = true;

            prev = cellLogs[i];
        }

        const first = cellLogs[0].data;
        const lastPreMitosis = cellLogs[limit - 1].data;

        console.log(`\n1. PHOSPHORUS UPTAKE (The Bottleneck):`);
        console.log(`   Start: ${first.phosphorus.toFixed(4)}`);
        console.log(`   End (Frame ${limit}): ${lastPreMitosis.phosphorus.toFixed(4)}`);
        console.log(`   Detailed Uptake Detected? ${p_uptake_detected ? "✅ YES" : "❌ NO (CRITICAL FAILURE)"}`);
        console.log(`   Rate: ${((lastPreMitosis.phosphorus - first.phosphorus) / limit).toFixed(6)} per frame`);

        console.log(`\n2. ENERGY METABOLISM:`);
        console.log(`   Start: ${first.energy.toFixed(2)}`);
        console.log(`   End: ${lastPreMitosis.energy.toFixed(2)}`);
        console.log(`   Metabolic Gain Detected? ${energy_gain_detected ? "✅ YES" : "❌ NO"}`);

        console.log(`\n3. LOCOMOTION/PHYSICS:`);
        console.log(`   Movement Detected? ${moved ? "✅ YES" : "⚠️ NO (Stationary/Sedentary)"}`);

        console.log(`\n4. THRESHOLDS CHECKS:`);
        console.log(`   Current P: ${lastPreMitosis.phosphorus.toFixed(2)}`);

        console.log("\n=== CONCLUSION ===");
        if (p_uptake_detected && energy_gain_detected) {
            console.log("✅ All internal systems nominal. Cell is eating and breathing.");
        } else {
            console.log("⚠️ ISSUES DETECTED. See above.");
        }
    } catch (e) {
        console.error("CRASH IN ANALYSIS:", e);
    }
}
