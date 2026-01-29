// Entity - Main cell class (refactored to use modular components)
class Entity {
    constructor(x, y, dna = null) {
        // Unique Identifier for tracing
        this.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cell_${Math.random().toString(36).substr(2, 9)}`;

        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector(0, 0);

        // DNA - use factory for LUCA or provided DNA
        this.dna = dna || window.dnaFactory.createLUCA();

        // Calculate maxSpeed from flagellaLevel AND size
        // LUCA (0) = brownian motion (PHISICS_BROWNIAN), flagella (1-6) = active locomotion
        let baseSpeed = this.dna.flagellaLevel === 0 ? GameConstants.PHYSICS.BROWNIAN_STRENGTH : this.dna.flagellaLevel;
        let sizeModifier = window.membraneSystem.calculateMovementPenalty(this.dna.size);
        this.maxSpeed = baseSpeed * sizeModifier * GameConstants.SPEED_MULTIPLIER;

        // Quadruple resource system (affected by storage capacity AND size)
        this.maxResources = window.membraneSystem.calculateStorageCapacity(
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
        this.oxidativeDamage = 0;  // accumulated damage in this frame
        this.uvDamageFrame = 0;    // accumulated UV damage in this frame
        this.structuralDamage = 0; // NEW: Cumulative Structural Integrity (0-100)

        // ORGANELL SYSTEM INTEGRATION
        this.organelles = [];
        this.initializeOrganelles();

        // REPRODUCTION COOLDOWN (Cell Cycle)
        // Prevents exponential explosions. Time until next division possible.
        this.reproductionCooldown = 0;

        // Movement offset for perlin noise visualization
        this.noiseOffset = random(1000);

        // PROTEOME SYSTEM (Enzymes)
        this.proteome = new Proteome(this);
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
        // Reset per-frame stats
        this.uvDamageFrame = 0;
        this.oxidativeDamage = 0;

        // Apply natural movement behavior (Chemotaxis + Random Walk)
        this.applyNaturalBehavior(environment);

        // Movement
        this.move(environment);

        // Metabolic consumption (Restored)
        // No longer calls this.eat() as consumption is handled in applyMetabolicCosts -> window.metabolicCosts.calculate

        // PASSIVE DIFFUSION (Osmosis) - New Mechanic
        // Free nutrient uptake in rich environments (Vents)
        window.membraneSystem.performPassiveDiffusion(this, environment);

        // Apply all costs
        this.applyMetabolicCosts(environment);
        this.applyFlagellaCosts();

        // Oxygen tolerance system (SOD)
        window.oxygenTolerance.updateSODLevels(this);
        this.oxidativeDamage = window.oxygenTolerance.calculateOxidativeDamage(this, environment);

        // STRUCTURAL INTEGRITY SYSTEM
        // 1. Accumulate Damage (Oxidative Stress)
        this.structuralDamage += this.oxidativeDamage;

        // 2. Active Repair (Spend Energy to fix Damage)
        this.applyRepair();

        // Apply UV damage if enabled
        if (GameConstants.UV_RADIATION_ENABLED) {
            this.applyUVDamage(environment);
        }

        // Apply Oxygen Toxicity (Oxidative Stress)
        this.applyOxygenDamage(environment);

        // Check death
        this.checkDeath();

        // Update Reproduction Cooldown
        if (this.reproductionCooldown > 0) {
            this.reproductionCooldown--;
        }

        // Update Proteome (Degradation)
        this.proteome.update();

        // Express Genes (Synthesize Proteins) - Every 100 frames to avoid spamming synthesis
        if (this.age % 100 === 0 && window.chemistrySystem) {
            GeneticTranslation.expressGenes(this, window.chemistrySystem);
        }

        this.age++;
    }

    applyNaturalBehavior(environment) {
        // 1. Random Brownian Noise (Base movement - "Temperature")
        // This replaces the old external random force in Skecth.js
        let randomForce = p5.Vector.random2D().mult(GameConstants.PHYSICS.BROWNIAN_STRENGTH);
        this.applyForce(randomForce);

        // 2. Chemotaxis (Biased drift towards nutrients - "Smell")
        // Only active if ChemotaxisSystem is available (it should be)
        if (window.chemotaxisSystem) {
            let biasForce = window.chemotaxisSystem.calculateBias(this, environment);
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
                // console.log(`[Boundary] Cell ${this.id} pushed out of atmosphere`);
            }

            // If cell moved into sediment, push back to water
            if (this.pos.y >= waterEndY) {
                this.pos.y = waterEndY - 1;
                this.vel.y = -abs(this.vel.y); // Bounce upward
                // console.log(`[Boundary] Cell ${this.id} pushed out of sediment`);
            }
        }

        // HORIZONTAL BOUNDARY (Walls) - New for Single Vent Mode
        if (typeof environment.waterStartCol !== 'undefined' && typeof environment.waterEndCol !== 'undefined') {
            const waterStartX = environment.waterStartCol * environment.resolution;
            const waterEndX = environment.waterEndCol * environment.resolution;

            if (this.pos.x < waterStartX) {
                this.pos.x = waterStartX + 1;
                this.vel.x = abs(this.vel.x); // Bounce right
            }
            if (this.pos.x >= waterEndX) {
                this.pos.x = waterEndX - 1;
                this.vel.x = -abs(this.vel.x); // Bounce left
            }
        }

        this.edges();
    }

    applyMetabolicCosts(environment) {
        let costs = window.metabolicCosts.calculate(this, environment);

        // Apply size-based cost multiplier
        let sizeMultiplier = window.membraneSystem.calculateMetabolicCost(1.0, this.dna.size);

        // Apply pigment cost (color-based)
        let pigmentCost = window.colorSystem.calculatePigmentCost(this.dna.color);

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

    applyRepair() {
        if (this.structuralDamage <= 0) return;

        // SCIENTIFIC BASIS: Maintenance Energy (Pirt, 1965)
        // ------------------------------------------------
        // Cells dedicate a portion of energy "m" to maintenance functions (turnover, repair, gradients).
        // This cost is prioritized over growth and reproduction.
        // Under stress (oxidative damage), "m" increases, potentially consuming all energy uptake.

        // Repair Capacity (Michaelis-Menten Kinetics)
        // Limited by enzyme concentration (RecA, UvrABCD)
        let repairEfficiency = this.dna.dnaRepairEfficiency || 0.5;
        let baseSpeed = GameConstants.BASE_REPAIR_SPEED || 0.1;

        let repairCapacity = baseSpeed * repairEfficiency;

        // Cap repair at current damage (can't repair what's not broken)
        let damageToFix = Math.min(this.structuralDamage, repairCapacity);

        // Calculate Energy Cost (High thermodynamic cost of re-synthesis)
        let energyCost = damageToFix * GameConstants.REPAIR_ENERGY_COST;

        if (this.energy >= energyCost) {
            // Full repair step
            this.energy -= energyCost;
            this.structuralDamage -= damageToFix;
        } else {
            // Partial repair (Starvation Mode)
            // Can only repair what we have energy for
            let possibleFix = this.energy / GameConstants.REPAIR_ENERGY_COST;
            this.energy = 0;
            this.structuralDamage -= possibleFix;
        }

        // Clamp to 0
        if (this.structuralDamage < 0) this.structuralDamage = 0;
    }

    checkDeath() {
        // Death if ANY critical resource runs out
        if (this.energy <= 0) {
            this.isDead = true;
            // FORENSIC DIAGNOSIS: Why did energy run out?
            // If we are taking oxidative damage, we likely went bankrupt paying for repair.
            if (this.oxidativeDamage > 0) {
                this.deathCause = 'energy_depletion_repair_bankruptcy';
            } else {
                this.deathCause = 'energy_depletion_starvation';
            }
            return;
        }

        if (this.oxygen <= 0) {
            // Anaerobic cells (LUCA) do NOT need internal oxygen stores to survive
            // Only Aerobic cells (respiration) die if they run out of O2
            if (this.dna.metabolismType !== 'luca' && this.dna.metabolismType !== 'fermentation') {
                this.isDead = true;
                this.deathCause = 'oxygen_depletion';
                return;
            }
        }

        if (this.nitrogen <= 0) {
            this.isDead = true;
            this.deathCause = 'nitrogen_depletion';
            return;
        }

        if (this.phosphorus <= 0) {
            this.isDead = true;
            this.deathCause = 'phosphorus_depletion';
            return;
        }

        // NEW: Structural Failure (Lysis)
        if (this.structuralDamage >= GameConstants.MAX_STRUCTURAL_DAMAGE) {
            this.isDead = true;
            // FORENSIC DIAGNOSIS: What broke the cell?
            if (this.oxidativeDamage > this.uvDamageFrame) {
                this.deathCause = 'structural_failure_oxidative';
            } else if (this.uvDamageFrame > 0) {
                this.deathCause = 'structural_failure_uv';
            } else {
                this.deathCause = 'structural_failure_accumulation'; // General decay
            }
        }
    }

    // eat() removed: Resource consumption is handled via window.metabolicCosts.calculate in applyMetabolicCosts()

    reproduce(environmentalStability = 0.5) {
        if (window.reproductionSystem.canReproduce(this)) {
            return window.reproductionSystem.reproduce(this, environmentalStability);
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
            this.energy -= GameConstants.PHYSICS.COLLISION_ENERGY_COST;
        }
    }

    show() {
        window.cellRenderer.render(this);
    }

    // SPECIES DIFFERENTIATION SYSTEM
    // Calculate genetic distance between this cell and another DNA
    calculateGeneticDistance(otherDNA) {
        return window.geneticDistance.calculate(this.dna, otherDNA);
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
        let photoprotection = window.colorSystem.calculatePhotoprotection(this.dna.color);

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
        // 1. Calculate Damage Amount
        // Mapping UV intensity to structural damage points
        let baseDamage = map(
            effectiveUV,
            0, GameConstants.UV_SURFACE_INTENSITY,
            0, 5.0 // Max 5 damage points per hit
        );

        // 2. DNA Repair Efficiency mitigates INITIAL damage impact
        // (Resistance before it even becomes structural damage)
        let resistFactor = this.dna.dnaRepairEfficiency || 0.5;
        let actualDamage = baseDamage * (1.0 - (resistFactor * 0.5)); // Max 50% mitigation

        // 3. Add to Structural Integrity System
        // Instead of just costing energy, it now threatens Lysis
        this.structuralDamage += actualDamage;
        this.uvDamageFrame = actualDamage; // Track for statistics

        // 4. Mutation Risk (Kept separate)
        if (random(1) > this.dna.dnaRepairEfficiency) {
            this.uvMutationPending = true;
        }

        // Removed: Direct Energy Cost (Now handled by applyRepair() in main loop)
        // Removed: Instant UV Death (Now handled by checkDeath via structural_failure)
    }

    // OXYGEN TOXICITY SYSTEM
    // Simulates oxidative stress from O2 radicals
    applyOxygenDamage(environment) {
        // Calculate damage based on O2 level and SOD efficiency
        let damage = window.oxygenTolerance.calculateOxidativeDamage(this, environment);

        if (damage > 0) {
            this.structuralDamage += damage;

            // FORENSIC TRACE: Log mechanism details for Sentinel Cell 0
            if (this.id === 0 && GameConstants.DEBUG_OXYGEN_DAMAGE && window.databaseLogger) {
                // Get local chemicals 
                let o2 = environment.getOxygenLevel(this.pos.x, this.pos.y);
                window.databaseLogger.logCellEvent(frameCount, 'damage_trace', this.id, {
                    o2_level: o2,
                    threshold: GameConstants.OXYGEN_SAFE_THRESHOLD,
                    excess: o2 - GameConstants.OXYGEN_SAFE_THRESHOLD,
                    sod: this.dna.sodEfficiency,
                    damage_amount: damage,
                    structural_total: this.structuralDamage,
                    energy: this.energy // To see if repair can pay for it
                });
            }

            // High oxidative stress can also cause mutations (DNA damage)
            // Mutation chance proportional to damage magnitude
            if (random(1) < damage * 0.1) {
                this.uvMutationPending = true; // Use same flag as UV for DNA damage
            }
        }

        // Update SOD levels to adapt to current pressure
        window.oxygenTolerance.updateSODLevels(this);
    }
}
