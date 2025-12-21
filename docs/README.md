# Cells Documentation

Welcome to the Cells Evolution Simulator documentation! This directory contains detailed technical and scientific documentation.

## 📖 Documentation Index

### Getting Started
- **[Quick Start Guide](QUICKSTART.md)** - Beginner-friendly introduction
- **[Configuration Guide](02_configuration_guide.md)** - How to adjust simulation parameters
- **[Current Status](01_current_status.md)** - Latest features and changes

### Core Mechanics
- **[Architecture & Mechanics](00_Architecture_and_Mechanics.md)** - Complete system documentation
  - Project structure
  - Game loop (60 FPS)
  - All systems explained
  - DNA traits
  - Configuration options

### Scientific Foundation
- **[Scientific References](13_scientific_references.md)** - Complete bibliography
  - Evolution & mutation rates
  - LUCA & early life
  - Metabolism & bioenergetics
  - Cell division & nutrients
  - References by file

- **[LUCA Mutation Rate](LUCA_mutationRate.md)** - Detailed scientific analysis
  - What is LUCA?
  - Mutation rate research
  - Implementation rationale
  - Scientific justification

- **[LUCA Implementation Plan](LUCA_implementation_plan.md)** - Original design document

### Traits Documentation
Detailed documentation for each DNA trait:
- **[Mutation Rate](traits/04_mutationRate.md)** - Evolution of mutation rates
- **[Metabolic Efficiency](traits/05_metabolicEfficiency.md)** - Resource usage optimization

### Evolution & Analysis
- **[Evolutionary Diary](03_evolutionary_diary.md)** - Observed evolutionary patterns
- **[Evolution Analysis](04_evolution_analysis.md)** - Population dynamics analysis
- **[Visibility Analysis](07_visibility_analysis.md)** - UI and visualization design

### Development History
- **[Dynamic Start Options](05_dynamic_start_options.md)** - LUCA variability implementation
- **[Future Evolution Options](06_future_evolution_options.md)** - Planned features
- **[Restructuring Proposal](08_restructuring_proposal.md)** - Code organization
- **[Restructuring Status](09_restructuring_status.md)** - Implementation progress
- **[Color Plan Summary](10_color_plan_summary.md)** - Color system design
- **[Verification Report](11_verification_report.md)** - Testing results
- **[Final Structure](12_final_structure.md)** - Current architecture
- **[Cleanup Summary](14_cleanup_summary.md)** - Code cleanup notes

## 🎯 Documentation by Use Case

### "I want to understand how the simulation works"
1. Start with [Quick Start Guide](QUICKSTART.md)
2. Read [Architecture & Mechanics](00_Architecture_and_Mechanics.md)
3. Explore [Scientific References](13_scientific_references.md)

### "I want to modify simulation parameters"
1. Read [Configuration Guide](02_configuration_guide.md)
2. Check `src/utils/Constants.js`
3. See [Architecture & Mechanics](00_Architecture_and_Mechanics.md) for effects

### "I want to understand the science"
1. Read [LUCA Mutation Rate](LUCA_mutationRate.md)
2. Check [Scientific References](13_scientific_references.md)
3. Explore trait documentation in `traits/`

### "I want to contribute code"
1. Read [Architecture & Mechanics](00_Architecture_and_Mechanics.md)
2. Check [Final Structure](12_final_structure.md)
3. See [Restructuring Status](09_restructuring_status.md)

## 📊 Documentation Statistics

- **Total documents**: 17 markdown files
- **Scientific references**: 15+ peer-reviewed papers
- **Code files documented**: All major systems
- **Last updated**: 2025-12-19

## 🔗 External Resources

- **Main README**: [../README.md](../README.md)
- **Source Code**: [../src/](../src/)
- **Contributing**: [../CONTRIBUTING.md](../CONTRIBUTING.md)
- **License**: [../LICENSE](../LICENSE)

---

*Documentation maintained by David Prieto*
