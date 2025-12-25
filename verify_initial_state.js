
// Mock Envorionment for Node.js
// Since Constants.js is likely a class with static properties, we simulate it or read it.
// To be robust, let's hardcode the values we JUST wrote to the file to verify logic,
// OR read the file content and parse it.

const fs = require('fs');
const content = fs.readFileSync('src/utils/Constants.js', 'utf8');

// Regex to extract values
function extract(key) {
    const regex = new RegExp(`${key}:\\s*([0-9.]+)`);
    const match = content.match(regex);
    return match ? parseFloat(match[1]) : null;
}

const INITIAL_ENERGY = extract('INITIAL_ENERGY');
const INITIAL_PHOSPHORUS = extract('INITIAL_PHOSPHORUS');
const REPRODUCTION_PHOSPHORUS_THRESHOLD = extract('REPRODUCTION_PHOSPHORUS_THRESHOLD');

console.log("=== VERIFYING INITIAL CELL STATE ===");
console.log(`INITIAL_ENERGY: ${INITIAL_ENERGY}`);
console.log(`INITIAL_PHOSPHORUS: ${INITIAL_PHOSPHORUS}`);
console.log(`THRESHOLD_RATIO: ${REPRODUCTION_PHOSPHORUS_THRESHOLD}`);

// Logic
const maxResources = 100;
const needed = maxResources * REPRODUCTION_PHOSPHORUS_THRESHOLD;

console.log(`\nPhosphorus Needed: ${needed}`);
console.log(`Phosphorus Have: ${INITIAL_PHOSPHORUS}`);

if (INITIAL_PHOSPHORUS < needed) {
    console.log("RESULT: ✅ Cell matches birth criteria. CANNOT reproduce immediately.");
    console.log(`Deficit: ${needed - INITIAL_PHOSPHORUS}`);
} else {
    console.log("RESULT: ❌ Cell matches 'Explosive Mitosis' criteria.");
}
