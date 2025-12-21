// Entity - Main cell class (refactored to use modular components)
class Entity {
    constructor(x, y, dna = null) {
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

        // Movement offset for perlin noise visualization
        this.noiseOffset = random(1000);
    }

    update(environment) {
        // Movement
        this.move(environment);

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

        this.age++;
    }

    move(environment) {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);

        // Apply viscosity if in sediment
        let viscosity = environment.getViscosity(this.pos.y);
        this.vel.mult(viscosity);

        this.pos.add(this.vel);
        this.acc.mult(0);

        this.edges();
    }

    applyMetabolicCosts(environment) {
        let costs = MetabolicCosts.calculate(this, environment);

        // Apply size-based cost multiplier
        let sizeMultiplier = MembraneSystem.calculateMetabolicCost(1.0, this.dna.size);

        // Apply pigment cost (color-based)
        let pigmentCost = ColorSystem.calculatePigmentCost(this.dna.color);

        this.energy -= (costs.energy * sizeMultiplier) + pigmentCost;
        this.oxygen -= costs.oxygen * sizeMultiplier;
        this.nitrogen -= costs.nitrogen * sizeMultiplier;
    }

    applyFlagellaCosts() {
        // Maintenance cost
        this.energy -= FlagellaCosts.calculateMaintenance(this.dna.flagellaLevel);

        // Movement cost
        this.energy -= FlagellaCosts.calculateMovementCost(this.vel, this.dna.flagellaLevel);
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

    reproduce() {
        if (ReproductionSystem.canReproduce(this)) {
            return ReproductionSystem.reproduce(this);
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
            let severity = effectiveUV > 60 ? 'HIGH' : effectiveUV > 30 ? 'MED' : 'LOW';
            let depth = floor((this.pos.y / height) * 100);
            developmentMonitor.log('uvDamage',
                `UV ${severity}: ${effectiveUV.toFixed(1)} → ${repairCost.toFixed(2)}`,
                {
                    effectiveUV: effectiveUV,
                    repairCost: repairCost,
                    depth: depth
                }
            );
        }

        // 2. IMPERFECT REPAIR may cause mutations
        // Low repair efficiency = more likely to cause mutations
        if (random(1) > this.dna.dnaRepairEfficiency) {
            this.uvMutationPending = true;

            // LOG UV MUTATION
            if (typeof developmentMonitor !== 'undefined' && GameConstants.getCurrentMode().LOG_MUTATIONS) {
                developmentMonitor.log('mutations',
                    `UV mutation (repair: ${(this.dna.dnaRepairEfficiency * 100).toFixed(0)}%)`,
                    {
                        cause: 'UV_DAMAGE',
                        repairEff: this.dna.dnaRepairEfficiency.toFixed(2)
                    }
                );
            }
        }

        // 3. LETHAL DAMAGE (rare but possible)
        if (effectiveUV > GameConstants.UV_LETHAL_THRESHOLD &&
            random(1) < GameConstants.UV_LETHAL_CHANCE) {
            this.isDead = true;
            this.deathCause = 'UV_RADIATION';

            // LOG UV DEATH
            if (typeof developmentMonitor !== 'undefined' && GameConstants.getCurrentMode().LOG_DEATHS) {
                developmentMonitor.log('deaths',
                    `UV LETHAL: ${effectiveUV.toFixed(1)}`,
                    {
                        cause: 'UV_RADIATION',
                        effectiveUV: effectiveUV
                    }
                );
            }
        }
    }
}
