# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned Features
- Photosynthesis evolution (oxygenic and anoxygenic)
- Predator-prey dynamics
- Horizontal gene transfer
- Simulation state save/load
- Performance optimizations (spatial indexing)
- Mobile UI optimization
- Interactive tutorial

---

## [1.0.0-alpha] - 2025-12-21

### Added - Core Systems
- **LUCA Simulation**: Last Universal Common Ancestor with primitive metabolism
- **Metabolic Divergence**: Evolution into Fermentation and Chemosynthesis
- **DNA System**: Genetic traits with mutation and inheritance
- **Reproduction System**: Binary fission with resource requirements
- **Environmental Stability**: Mutation rate evolution based on environmental conditions
- **Resource Grids**: O₂, N₂, P, H₂, CO₂, Fe²⁺ with realistic distributions
- **UV Radiation**: Primordial UV exposure without ozone layer
- **Oxygen Tolerance**: SOD enzyme evolution for oxidative stress defense

### Added - Scientific Features
- **23 Peer-Reviewed References**: Complete scientific bibliography
- **Scientifically Accurate Mechanics**: All systems based on published research
- **Comprehensive Documentation**: 17+ markdown files explaining systems
- **Trait Documentation**: Detailed mechanics for each evolutionary trait
- **Scientific Justification**: Rationale for all design decisions

### Added - Visualization
- **Real-time Evolution Tracking**: Mutation rate graph with evolutionary eras
- **Species Notifications**: Alerts when new metabolic types emerge
- **Development Monitor**: Debug panel showing scientific data
- **Color-coded Cells**: Visual distinction between metabolism types
- **Resource Visualization**: Environmental resource distribution display

### Added - Development Tools
- **DevLogger**: Comprehensive logging system for scientific validation
- **Circuit Filtering**: Selective logging of specific events
- **Reproduction Index**: Theoretical vs actual reproduction tracking
- **Download Logs**: Export simulation data for analysis

### Added - Documentation
- **README.md**: Professional project overview
- **CONTRIBUTING.md**: Contribution guidelines
- **DEVELOPMENT.md**: Development status and limitations
- **ATTRIBUTION.md**: AI assistance and code authorship transparency
- **LICENSE**: MIT License
- **Scientific References**: Complete bibliography with citations
- **Architecture Documentation**: System design and mechanics
- **Quick Start Guide**: Beginner-friendly introduction

### Added - Infrastructure
- **GitHub Actions**: Automated deployment to GitHub Pages
- **.gitignore**: Proper exclusion of temporary files
- **package.json**: Project metadata and scripts
- **Modular Architecture**: Clean separation of concerns

### Technical Details
- **Language**: JavaScript (ES6)
- **Graphics**: p5.js v1.9.0
- **Total Lines**: ~8,000 lines of code
- **Files**: 30+ JavaScript modules, 17+ documentation files
- **AI Assistance**: ~85-90% code generation via Antigravity AI
- **Human Oversight**: 100% validation and scientific accuracy

### Scientific Basis
Based on research from:
- **Evolution**: Drake 1991, Eigen 1971, Poole 1998, Forterre 2015
- **LUCA**: Weiss 2016, Koonin 2008, Martin & Russell 2007
- **Metabolism**: Müller 2012, Nakagawa 2008, Lane & Martin 2010
- **Atmosphere**: Kasting 1993, Catling 2005, Holland 2006, Lyons 2014
- **Phosphorus**: Pasek 2005, Filippelli 2008, Redfield 1963
- **Oxygen Toxicity**: Fridovich 1995, Imlay 2013, Raymond 2006
- **And 11 more peer-reviewed publications**

### Known Limitations
- Performance degrades with >200 cells
- Simplified genetics (no actual DNA sequences)
- 2D environment (real ocean is 3D)
- No persistence between sessions
- Limited resource types compared to real biology

---

## Development Notes

### v1.0.0-alpha (Initial Release)
This alpha release represents a functional, scientifically-grounded simulation suitable for educational and research purposes. While the core mechanics are solid and well-documented, the project is still in active development.

**Focus Areas**:
- Scientific accuracy over performance
- Comprehensive documentation
- Transparency about AI assistance
- Educational value

**Next Steps**:
- Community feedback
- Performance optimizations
- Additional metabolic pathways
- Enhanced visualization

---

## Attribution

This project was developed through human-AI collaboration:
- **AI**: Antigravity (Google DeepMind) - Code generation, documentation
- **Human**: David Prieto - Design, validation, scientific accuracy

See [ATTRIBUTION.md](ATTRIBUTION.md) for complete details.

---

**Legend**:
- `Added`: New features
- `Changed`: Changes in existing functionality
- `Deprecated`: Soon-to-be removed features
- `Removed`: Removed features
- `Fixed`: Bug fixes
- `Security`: Security improvements
