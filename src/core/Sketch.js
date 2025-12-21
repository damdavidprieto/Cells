let environment;
let entities = [];
let lucaBaseDNA = null; // Store the first LUCA DNA as reference
let mutationTracker;  // Track mutation rate evolution
let speciesNotifier;  // Notify when new species emerge
let developmentMonitor;  // Development debug monitor
let devLogger;  // Development logging system
let deathCountThisFrame = 0;  // Track deaths for stability calculation

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');

    environment = new Environment();
    mutationTracker = new MutationRateTracker();
    speciesNotifier = new SpeciesNotifier();

    // Initialize development monitor if in dev mode
    if (GameConstants.getCurrentMode().SHOW_DEBUG_MONITOR) {
        developmentMonitor = new DevelopmentMonitor();
    }

    // Initialize development logger
    devLogger = new DevLogger();
    devLogger.initializeMetadata();

    // Spawn initial entities (all LUCA)
    for (let i = 0; i < 20; i++) {
        let entity = new Entity(random(width), random(height));
        entity.id = i;  // Assign ID for logging
        entity.reproductionCount = 0;  // Track reproductions
        if (i === 0) {
            lucaBaseDNA = entity.dna; // Store first LUCA as reference
        }
        entities.push(entity);
    }
}

function draw() {
    // Reset death counter
    deathCountThisFrame = 0;

    // Increment frame counter for logging
    if (typeof devLogger !== 'undefined') {
        devLogger.incrementFrame();
    }

    // Draw Environment first
    environment.update();
    environment.show();

    // Update environmental stability (every N frames)
    if (frameCount % GameConstants.STABILITY_CALCULATION_INTERVAL === 0) {
        environment.currentStability = environment.calculateEnvironmentalStability(entities, deathCountThisFrame);
    }

    // Process Entities
    for (let i = entities.length - 1; i >= 0; i--) {
        let e = entities[i];

        // Behaviors
        e.applyForce(p5.Vector.random2D().mult(0.1));
        e.eat(environment);
        e.update(environment); // Pass environment for viscosity
        e.show();

        // Collision with others
        for (let j = 0; j < entities.length; j++) {
            if (i !== j) {
                e.checkCollision(entities[j]);
            }
        }

        // Reproduction (pass environmental stability for evolutionary pressure)
        let child = e.reproduce(environment.currentStability);
        if (child != null) {
            child.id = entities.length;  // Assign unique ID
            child.reproductionCount = 0;
            e.reproductionCount = (e.reproductionCount || 0) + 1;
            devLogger.logReproduction(e, child);
            entities.push(child);
        }

        if (e.isDead) {
            // Determine death cause
            let cause = 'unknown';
            if (e.energy <= 0) cause = 'energy_depletion';
            else if (e.oxygen <= 0) cause = 'oxygen_depletion';
            else if (e.phosphorus <= 0) cause = 'phosphorus_depletion';
            else if (e.nitrogen <= 0) cause = 'nitrogen_depletion';
            else if (e.deathCause) cause = e.deathCause;  // UV or other

            devLogger.logDeath(e, cause);

            // RECICLAJE BIOLÓGICO DE FÓSFORO (CRÍTICO para sostenibilidad)
            // Cuando célula muere, libera 80% de su P acumulado
            // Sin esto, P se agota en ~268 frames (población colapsa)
            // Con esto, ciclo biogeoquímico cerrado (sostenible)
            PhosphorusRegeneration.reciclarFosforo(environment, e.pos.x, e.pos.y, e.phosphorus);

            entities.splice(i, 1);
            deathCountThisFrame++;
        }
    }

    // Update mutation rate tracker
    mutationTracker.update(entities);

    // Check for new species and update notifications
    speciesNotifier.checkForNewSpecies(entities);
    speciesNotifier.update();

    // Spawn new entities if population drops too low (Conservation)
    if (entities.length < 5 && random(1) < 0.05) {
        entities.push(new Entity(random(width), random(height)));
    }

    // Calculate total resources for stats (all FOUR grids)
    let totalLight = 0;
    let totalOxygen = 0;
    let totalNitrogen = 0;
    let totalPhosphorus = 0;

    for (let i = 0; i < environment.cols; i++) {
        for (let j = 0; j < environment.rows; j++) {
            totalLight += environment.lightGrid[i][j];
            totalOxygen += environment.oxygenGrid[i][j];
            totalNitrogen += environment.nitrogenGrid[i][j];
            totalPhosphorus += environment.phosphorusGrid[i][j];
        }
    }

    // SPECIES TRACKING
    // Count unique metabolism types as species
    let metabolismCounts = { luca: 0, fermentation: 0, chemosynthesis: 0 };
    let uniqueSpecies = new Set();

    for (let entity of entities) {
        // Count metabolism types
        metabolismCounts[entity.dna.metabolismType]++;
        uniqueSpecies.add(entity.dna.metabolismType);
    }

    // Update UI
    let entityCountEl = document.getElementById('entity-count');
    let lightCountEl = document.getElementById('light-count');
    let oxygenCountEl = document.getElementById('oxygen-count');
    let nitrogenCountEl = document.getElementById('nitrogen-count');
    let phosphorusCountEl = document.getElementById('phosphorus-count');
    let speciesCountEl = document.getElementById('species-count');
    let lucaCountEl = document.getElementById('luca-count');
    let fermentationCountEl = document.getElementById('fermentation-count');
    let chemosynthesisCountEl = document.getElementById('chemosynthesis-count');

    if (entityCountEl) entityCountEl.innerText = entities.length;
    if (lightCountEl) lightCountEl.innerText = floor(totalLight);
    if (oxygenCountEl) oxygenCountEl.innerText = floor(totalOxygen);
    if (nitrogenCountEl) nitrogenCountEl.innerText = floor(totalNitrogen);
    if (phosphorusCountEl) phosphorusCountEl.innerText = floor(totalPhosphorus);
    if (speciesCountEl) speciesCountEl.innerText = uniqueSpecies.size; // Count unique metabolism types
    if (lucaCountEl) lucaCountEl.innerText = metabolismCounts.luca;
    if (fermentationCountEl) fermentationCountEl.innerText = metabolismCounts.fermentation;
    if (chemosynthesisCountEl) chemosynthesisCountEl.innerText = metabolismCounts.chemosynthesis;

    // Render mutation rate tracker (position depends on mode)
    // In DEVELOPMENT mode: left side to avoid monitor overlap
    // In PRODUCTION mode: right side (normal position)
    if (GameConstants.getCurrentMode().SHOW_DEBUG_MONITOR) {
        mutationTracker.render(10, 10, 220, 180);  // Left side
    } else {
        mutationTracker.render(width - 230, 10, 220, 180);  // Right side
    }

    // Render species notifications (center bottom)
    speciesNotifier.render();

    // Render development monitor (right panel) if in dev mode
    if (developmentMonitor) {
        developmentMonitor.render();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    environment = new Environment(); // Re-init grid
}

// Global function to download development logs
function downloadDevLogs() {
    if (typeof devLogger !== 'undefined' && devLogger.enabled) {
        console.log('[DevLogger] Downloading logs...');
        devLogger.downloadLogs(entities);
    } else {
        console.warn('[DevLogger] Logging is not enabled or devLogger not initialized');
        alert('Logging is not enabled. Set DEVELOPMENT_LOGGING.enabled = true in Constants.js');
    }
}
