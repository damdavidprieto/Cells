// Entity - Main cell class (refactored to use modular components)
class Entity {
    constructor(x, y, dna = null) {
        // Unique Identifier for tracing
        this.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cell_${Math.random().toString(36).substr(2, 9)}`;

        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector(0, 0);

        // DNA - use factory for LUCA or provided DNA
        this.dna = dna || DNAFactory.createLUCA();

        // Calculate maxSpeed from flagellaLevel AND size
        // LUCA (0) = brownian motion (0.1), flagella (1-6) = active locomotion
        let baseSpeed = this.dna.flagellaLevel === 0 ? GameConstants.BROWNIAN_SPEED : this.dna.flagellaLevel;
        let sizeModifier = MembraneSystem.calculateMovementPenalty(this.dna.size);
        this.maxSpeed = baseSpeed * sizeModifier * GameConstants.SPEED_MULTIPLIER;

        // Quadruple resource system (affected by storage capacity AND size)
        this.maxResources = MembraneSystem.calculateStorageCapacity(
            this.dna.storageCapacity,
            this.dna.size
        );
        this.energy = GameConstants.INITIAL_ENERGY;
        this.oxygen = GameConstants.INITIAL_OXYGEN;
        this.nitrogen = GameConstants.INITIAL_NITROGEN;
        this.phosphorus = GameConstants.INITIAL_PHOSPHORUS;

        this.age = 0;
        this.isDead = false;
        this.deathCause = null;  // Track cause of death

        // UV damage tracking
        this.uvMutationPending = false;  // Flag for UV-induced mutations

        // SOD (Superoxide Dismutase) - Oxygen tolerance system
        this.sodProtein = 0.5;  // Current SOD level (0.0 - 1.0)
        this.oxidativeDamage = 0;  // Accumulated oxidative damage

        // ORGANELL SYSTEM INTEGRATION
        this.organelles = [];
        this.initializeOrganelles();

        // REPRODUCTION COOLDOWN (Cell Cycle)
        // Prevents exponential explosions. Time until next division possible.
        this.reproductionCooldown = 0;

        // Movement offset for perlin noise visualization
        this.noiseOffset = random(1000);
    }

    initializeOrganelles() {
        // 1. Ribosomes (Universal) - Always present if LUCA enabled (which is always true for now)
        if (this.dna.metabolisms.luca && this.dna.metabolisms.luca.enabled) {
            this.organelles.push(new Ribosome());
        }

        // 2. Flagella (Locomotion)
        // Explicitly encoded in flagellaLevel
        if (this.dna.flagellaLevel > 0) {
            this.organelles.push(new Flagellum(this.dna.flagellaLevel));
        }

        // 3. Hydrogenosomes (Fermentation)
        // PHENOTYPIC EXPRESSION: Only build if fermentation efficiency > threshold
        if (this.dna.metabolisms.fermentation &&
            this.dna.metabolisms.fermentation.efficiency > GameConstants.ORGANELLE_EFFICIENCY_THRESHOLD) {
            this.organelles.push(new Hydrogenosome());
        }

        // 4. Chemosynthetic Enzymes
        // PHENOTYPIC EXPRESSION: Only build if chemosynthesis efficiency > threshold
        if (this.dna.metabolisms.chemosynthesis &&
            this.dna.metabolisms.chemosynthesis.efficiency > GameConstants.ORGANELLE_EFFICIENCY_THRESHOLD) {
            this.organelles.push(new ChemosyntheticEnzymes());
        }
    }

    update(environment) {
        // Apply natural movement behavior (Chemotaxis + Random Walk)
        this.applyNaturalBehavior(environment);

        // Movement
        this.move(environment);

        // Metabolic consumption (Restored)
        this.eat(environment);

        // PASSIVE DIFFUSION (Osmosis) - New Mechanic
        // Free nutrient uptake in rich environments (Vents)
        MembraneSystem.performPassiveDiffusion(this, environment);

        // Apply all costs
        this.applyMetabolicCosts(environment);
        this.applyFlagellaCosts();

        // Oxygen tolerance system (SOD)
        OxygenTolerance.updateSODLevels(this);
        this.oxidativeDamage = OxygenTolerance.calculateOxidativeDamage(this, environment);
        this.energy -= this.oxidativeDamage;  // Oxidative damage reduces energy

        // Apply UV damage if enabled
        if (GameConstants.UV_RADIATION_ENABLED) {
            this.applyUVDamage(environment);
        }

        // Check death
        this.checkDeath();

        // Update Reproduction Cooldown
        if (this.reproductionCooldown > 0) {
            this.reproductionCooldown--;
        }

        this.age++;
    }

    applyNaturalBehavior(environment) {
        // 1. Random Brownian Noise (Base movement - "Temperature")
        // This replaces the old external random force in Skecth.js
        let randomForce = p5.Vector.random2D().mult(0.1);
        this.applyForce(randomForce);

        // 2. Chemotaxis (Biased drift towards nutrients - "Smell")
        // Only active if ChemotaxisSystem is available (it should be)
        if (typeof ChemotaxisSystem !== 'undefined') {
            let biasForce = ChemotaxisSystem.calculateBias(this, environment);
            this.applyForce(biasForce);
        }
    }

    move(environment) {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);

        // Apply viscosity if in sediment
        let viscosity = environment.getViscosity(this.pos.y);
        this.vel.mult(viscosity);

        this.pos.add(this.vel);
        this.acc.mult(0);

        // BOUNDARY ENFORCEMENT: Keep cells in water zone only
        if (typeof environment.waterStartRow !== 'undefined' && typeof environment.waterEndRow !== 'undefined') {
            const waterStartY = environment.waterStartRow * environment.resolution;
            const waterEndY = environment.waterEndRow * environment.resolution;

            // If cell moved into atmosphere, push back to water
            if (this.pos.y < waterStartY) {
                this.pos.y = waterStartY + 1;
                this.vel.y = abs(this.vel.y); // Bounce downward
                console.log(`[Boundary] Cell ${this.id} pushed out of atmosphere`);
            }

            // If cell moved into sediment, push back to water
            if (this.pos.y >= waterEndY) {
                this.pos.y = waterEndY - 1;
                this.vel.y = -abs(this.vel.y); // Bounce upward
                console.log(`[Boundary] Cell ${this.id} pushed out of sediment`);
            }
        }

        this.edges();
    }

    applyMetabolicCosts(environment) {
        let costs = MetabolicCosts.calculate(this, environment);

        // Apply size-based cost multiplier
        let sizeMultiplier = MembraneSystem.calculateMetabolicCost(1.0, this.dna.size);

        // Apply pigment cost (color-based)
        let pigmentCost = ColorSystem.calculatePigmentCost(this.dna.color);

        // Calculate Organelle Maintenance Costs
        let organelleMaintenance = 0;
        for (let organelle of this.organelles) {
            organelleMaintenance += organelle.getMaintenanceCost();
        }

        this.energy -= (costs.energy * sizeMultiplier) + pigmentCost + organelleMaintenance;
        this.oxygen -= costs.oxygen * sizeMultiplier;
        this.nitrogen -= costs.nitrogen * sizeMultiplier;
    }

    applyFlagellaCosts() {
        // Costs are now handled via Organelle system if Flagellum is present
        // Movement cost is dynamic, so we check for Flagellum organelle(s)
        for (let organelle of this.organelles) {
            if (organelle.name === 'Flagellum') {
                this.energy -= organelle.getMovementCost(this.vel);
            }
        }
    }

    checkDeath() {
        // Death if ANY critical resource runs out
        if (this.energy <= 0 || this.oxygen <= 0 || this.nitrogen <= 0 || this.phosphorus <= 0) {
            this.isDead = true;
        }
    }

    eat(environment) {
        ResourceConsumption.consume(this, environment);
    }

    reproduce(environmentalStability = 0.5) {
        if (ReproductionSystem.canReproduce(this)) {
            return ReproductionSystem.reproduce(this, environmentalStability);
        }
        return null;
    }

    checkCollision(other) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        let minDist = (this.dna.size + other.dna.size) * 0.5;

        if (d < minDist) {
            let angle = p5.Vector.sub(other.pos, this.pos).heading();
            let targetX = this.pos.x + cos(angle) * minDist;
            let targetY = this.pos.y + sin(angle) * minDist;
            let ax = (targetX - other.pos.x) * 0.05;
            let ay = (targetY - other.pos.y) * 0.05;

            this.vel.sub(ax, ay);
            other.vel.add(ax, ay);
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    edges() {
        // BOUNDARY COLLISION: Bounce off edges instead of wrapping
        let bounced = false;

        if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -0.8; // Reverse and dampen
            bounced = true;
        }
        if (this.pos.x > width) {
            this.pos.x = width;
            this.vel.x *= -0.8;
            bounced = true;
        }
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -0.8;
            bounced = true;
        }
        if (this.pos.y > height) {
            this.pos.y = height;
            this.vel.y *= -0.8;
            bounced = true;
        }

        // Small energy cost for collision
        if (bounced) {
            this.energy -= 0.5;
        }
    }

    show() {
        CellRenderer.render(this);
    }

    // SPECIES DIFFERENTIATION SYSTEM
    // Calculate genetic distance between this cell and another DNA
    calculateGeneticDistance(otherDNA) {
        return GeneticDistance.calculate(this.dna, otherDNA);
    }

    // Get species identifier based on genetic traits
    // Species are defined by 30% genetic distance threshold
    getSpeciesId() {
        if (this.dna.speciesId) {
            return this.dna.speciesId;
        }

        // Generate species ID from key genetic traits
        // Format: METABOLISM_GENERATION_TRAITS
        let metabolismCode = this.dna.metabolismType.substring(0, 1).toUpperCase();
        let efficiencyCode = Math.floor(this.dna.metabolicEfficiency * 10);
        let storageCode = Math.floor(this.dna.storageCapacity / 50);

        this.dna.speciesId = `${metabolismCode}${efficiencyCode}${storageCode}`;
        return this.dna.speciesId;
    }

    // UV RADIATION DAMAGE SYSTEM
    // Simulates UV damage from primordial Earth without ozone layer
    applyUVDamage(environment) {
        // Get UV level at current position
        let uvLevel = environment.getUVLevel(this.pos.x, this.pos.y);

        // Calculate photoprotection from color (dark pigments protect)
        let photoprotection = ColorSystem.calculatePhotoprotection(this.dna.color);

        // Effective UV (reduced by protection)
        let effectiveUV = uvLevel / photoprotection;

        // Probability of damage event per frame
        let damageChance = map(
            effectiveUV,
            0, GameConstants.UV_SURFACE_INTENSITY,
            0, GameConstants.UV_DAMAGE_CHANCE_MAX
        );

        if (random(1) < damageChance) {
            this.applyUVDamageEffect(effectiveUV);
        }
    }

    applyUVDamageEffect(effectiveUV) {
        // 1. ENERGY COST for cellular repair
        let baseCost = map(
            effectiveUV,
            0, GameConstants.UV_SURFACE_INTENSITY,
            0, GameConstants.UV_REPAIR_COST_MAX
        );

        // DNA repair efficiency reduces cost
        // High efficiency = cheaper repair
        let repairCost = baseCost / this.dna.dnaRepairEfficiency;
        this.energy -= repairCost;

        // LOG UV DAMAGE (development mode)
        if (typeof developmentMonitor !== 'undefined' && GameConstants.getCurrentMode().LOG_UV_DAMAGE) {
            // REMOVED (DevelopmentMonitor deprecated)
        }

        // 2. IMPERFECT REPAIR may cause mutations
        // Low repair efficiency = more likely to cause mutations
        if (random(1) > this.dna.dnaRepairEfficiency) {
            this.uvMutationPending = true;

            // LOG UV MUTATION
            // REMOVED (DevelopmentMonitor deprecated)
        }

        // 3. LETHAL DAMAGE (rare but possible)
        if (effectiveUV > GameConstants.UV_LETHAL_THRESHOLD &&
            random(1) < GameConstants.UV_LETHAL_CHANCE) {
            this.isDead = true;
            this.deathCause = 'UV_RADIATION';

            // LOG UV DEATH
            // REMOVED (DevelopmentMonitor deprecated)
        }
    }
}
