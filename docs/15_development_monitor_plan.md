# Implementation Plan: Development Monitor System

## Goal
Create a development monitor that logs mechanic events with filtering, and dual execution modes (development/production).

---

## Proposed Changes

### 1. Execution Mode Configuration

#### [MODIFY] `Constants.js`
Add execution mode configuration:
```javascript
// ===== EXECUTION MODE =====
// DEVELOPMENT: Accelerated simulation, debug monitor visible
// PRODUCTION: Normal speed, user-friendly UI only
EXECUTION_MODE: 'DEVELOPMENT',  // 'DEVELOPMENT' or 'PRODUCTION'

// Development mode settings
DEVELOPMENT: {
    SIMULATION_SPEED: 2.0,        // 2x speed
    SHOW_DEBUG_MONITOR: true,
    LOG_UV_DAMAGE: true,
    LOG_MUTATIONS: true,
    LOG_DEATHS: true,
    LOG_REPRODUCTIONS: false      // Too frequent
},

// Production mode settings
PRODUCTION: {
    SIMULATION_SPEED: 1.0,        // Normal speed
    SHOW_DEBUG_MONITOR: false,
    LOG_UV_DAMAGE: false,
    LOG_MUTATIONS: false,
    LOG_DEATHS: false,
    LOG_REPRODUCTIONS: false
}
```

---

### 2. Development Monitor Component

#### [NEW] `src/visualization/DevelopmentMonitor.js`
Create monitor component:
```javascript
class DevelopmentMonitor {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;  // Keep last 100 events
        this.filters = {
            uvDamage: true,
            mutations: true,
            deaths: true,
            reproductions: false
        };
    }

    log(category, message, data = {}) {
        if (!this.filters[category]) return;
        
        this.logs.push({
            frame: frameCount,
            category: category,
            message: message,
            data: data,
            timestamp: Date.now()
        });
        
        // Keep only last maxLogs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    render() {
        // Render monitor panel on right side
        push();
        fill(0, 0, 0, 200);
        rect(width - 300, 0, 300, height);
        
        fill(255);
        textSize(12);
        text('DEVELOPMENT MONITOR', width - 290, 20);
        
        // Render last 20 logs
        let y = 40;
        for (let i = this.logs.length - 1; i >= max(0, this.logs.length - 20); i--) {
            let log = this.logs[i];
            this.renderLog(log, y);
            y += 30;
        }
        pop();
    }

    renderLog(log, y) {
        // Color by category
        let color = this.getCategoryColor(log.category);
        fill(color);
        text(`[${log.frame}] ${log.category}`, width - 290, y);
        
        fill(200);
        textSize(10);
        text(log.message, width - 290, y + 12);
    }

    getCategoryColor(category) {
        const colors = {
            uvDamage: [255, 200, 0],
            mutations: [255, 100, 255],
            deaths: [255, 50, 50],
            reproductions: [100, 255, 100]
        };
        return colors[category] || [255, 255, 255];
    }
}
```

---

### 3. UV Damage Logging

#### [MODIFY] `Entity.js`
Add logging to UV damage:
```javascript
applyUVDamageEffect(effectiveUV) {
    // ... existing damage code ...
    
    // LOG UV DAMAGE (development mode)
    if (GameConstants.getCurrentMode().LOG_UV_DAMAGE) {
        let severity = effectiveUV > 60 ? 'HIGH' : effectiveUV > 30 ? 'MED' : 'LOW';
        developmentMonitor.log('uvDamage', 
            `UV ${severity}: ${effectiveUV.toFixed(1)} → Cost: ${repairCost.toFixed(2)}`,
            {
                effectiveUV: effectiveUV,
                repairCost: repairCost,
                repairEfficiency: this.dna.dnaRepairEfficiency,
                position: {x: this.pos.x, y: this.pos.y}
            }
        );
    }
    
    // ... rest of damage code ...
}
```

---

### 4. Main Sketch Integration

#### [MODIFY] `Sketch.js`
Integrate monitor and execution mode:
```javascript
let developmentMonitor;

function setup() {
    // ... existing setup ...
    
    // Initialize development monitor if in dev mode
    if (GameConstants.getCurrentMode().SHOW_DEBUG_MONITOR) {
        developmentMonitor = new DevelopmentMonitor();
    }
}

function draw() {
    // Apply simulation speed multiplier
    let speedMultiplier = GameConstants.getCurrentMode().SIMULATION_SPEED;
    
    for (let s = 0; s < speedMultiplier; s++) {
        // ... existing game loop ...
    }
    
    // Render development monitor
    if (developmentMonitor) {
        developmentMonitor.render();
    }
}
```

---

## Initial Monitoring: UV Damage System

### Events to Log
1. **UV Damage Events**
   - Effective UV level
   - Repair cost
   - DNA repair efficiency
   - Cell position (depth)

2. **UV-Induced Mutations**
   - When uvMutationPending is set
   - Which trait was mutated
   - Mutation magnitude

3. **UV Deaths**
   - When cell dies from UV
   - UV level at death
   - Cell characteristics

### Filters
- Toggle each category on/off
- Severity thresholds (only log HIGH severity)
- Frame range (only log every N frames)

---

## Verification Plan

### Test Cases
1. **Mode Switching:** Verify DEVELOPMENT vs PRODUCTION modes work
2. **Speed Multiplier:** Confirm 2x speed in development
3. **UV Logging:** Check UV damage events appear in monitor
4. **Filtering:** Verify filters work correctly
5. **Performance:** Ensure monitor doesn't slow simulation

### Expected Results
- Development mode: Monitor visible, 2x speed, UV events logged
- Production mode: No monitor, 1x speed, clean UI

---

## Future Extensions

### Additional Mechanics to Monitor
- Metabolic divergence (LUCA → Fermentation/Chemosynthesis)
- Mutation rate evolution (environmental pressure)
- Resource depletion patterns
- Population crashes
- Species emergence

### Advanced Features
- Export logs to JSON
- Search/filter by keywords
- Pause on specific events
- Visual highlights (flash cells on event)

---

*Development monitor for scientific validation and debugging*
