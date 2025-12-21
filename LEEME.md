# 🧬 Cells - Evolution Simulator

A scientifically-grounded cellular evolution simulator that models the emergence and divergence of life from **LUCA** (Last Universal Common Ancestor) in primordial oceans.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![p5.js](https://img.shields.io/badge/p5.js-1.9.0-ED225D.svg)](https://p5js.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E.svg)](https://www.javascript.com/)
[![Development Status](https://img.shields.io/badge/status-alpha-orange.svg)](DEVELOPMENT.md)
[![AI Assisted](https://img.shields.io/badge/AI-Antigravity-blue.svg)](ATTRIBUTION.md)

> ⚠️ **Development Status**: This project is in active development (v1.0.0-alpha). See [DEVELOPMENT.md](DEVELOPMENT.md) for current status and limitations.

> 🤖 **AI-Assisted Development**: This project was developed with significant AI assistance (~85-90% code generation). See [ATTRIBUTION.md](ATTRIBUTION.md) for full transparency.

## 🎮 [Live Demo](https://damdavidprieto.github.io/Cells/)

> **Note**: The live demo will be available once GitHub Pages is enabled in repository settings.

---

## 📖 Overview

**Cells** simulates the evolution of primitive cellular life in conditions similar to Earth's Archean Eon (4.0-3.5 billion years ago). Starting with LUCA-like organisms, cells evolve through mutation, natural selection, and metabolic divergence into specialized lineages:

- 🔵 **LUCA** - Primitive chemosynthetic ancestor
- 🟣 **Fermentation** - Anaerobic metabolism
- 🟢 **Chemosynthesis** - Specialized chemical energy utilization

The simulation is built on peer-reviewed scientific research, modeling realistic evolutionary pressures, resource competition, and metabolic costs.

---

## ✨ Features

### 🧬 Evolutionary Mechanics
- **Mutation rate evolution**: Cells evolve their mutation rate based on environmental stability
- **Metabolic divergence**: LUCA can evolve into fermentation or chemosynthesis (1% chance per reproduction)
- **Genetic drift**: Population-level evolutionary dynamics
- **Natural selection**: Resource scarcity drives adaptation

### 🔬 Scientific Accuracy
- **Based on peer-reviewed research**: 23 scientific papers from Nature, Science, Cell, etc.
- **Realistic metabolism**: LUCA (2.0x cost) → Fermentation (1.5x) → Chemosynthesis (1.0x)
- **Environmental gradients**: Light, oxygen, nitrogen, phosphorus distribution
- **Mutation rates**: Modeled after real LUCA mutation rates (10⁻⁵ to 10⁻⁴ per base)

### 🎨 Visualization
- **Real-time evolution tracking**: Mutation rate graph with evolutionary eras
- **Species notifications**: Alerts when new metabolic types emerge
- **Color-coded cells**: Visual distinction between metabolism types
- **Resource grids**: See environmental resource distribution
- **Development logs**: Download detailed simulation data

### ⚙️ Configurable Parameters
- LUCA variability levels (NONE, MEDIUM, HIGH)
- Environmental stability pressure
- Metabolic efficiency multipliers
- Resource regeneration rates
- All parameters documented in `src/utils/Constants.js`

---

## 🚀 Quick Start

### Option 1: Open Directly
1. Clone the repository:
   ```bash
   git clone https://github.com/damdavidprieto/Cells.git
   cd Cells
   ```
2. Open `index.html` in your browser

### Option 2: Local Server (Recommended)
1. Clone the repository
2. Run a local server:
   ```bash
   # Using Python 3
   python -m http.server 8080
   
   # Using Node.js (http-server)
   npx http-server -p 8080
   
   # Using npm script
   npm start
   ```
3. Open `http://localhost:8080` in your browser

---

## 📊 What to Observe

### Early Simulation (0-2 minutes)
- **High mutation rates** (0.15-0.25): Chaotic exploration
- **LUCA dominance**: Gray cells exploring the environment
- **Resource competition**: Cells cluster near resources

### Mid Simulation (2-10 minutes)
- **First divergence**: Watch for purple (fermentation) or green (chemosynthesis) cells
- **Mutation rate decrease**: Population stabilizes (0.08-0.12)
- **Lineage emergence**: Distinct metabolic strategies

### Late Simulation (10+ minutes)
- **Specialization**: Cells optimized for specific niches
- **Low mutation rates** (0.04-0.06): Modern-like stability
- **Ecosystem balance**: Multiple species coexisting

---

## 🧪 Scientific Basis

This simulation is grounded in scientific research on early life:

### Key References
- **Weiss et al. (2016)** - LUCA physiology and habitat (*Nature Microbiology*)
- **Poole et al. (1998)** - RNA world and mutation rates (*J. Molecular Evolution*)
- **Martin & Russell (2007)** - Origin of biochemistry (*Phil. Trans. R. Soc. B*)
- **Müller et al. (2012)** - Anaerobic metabolism evolution (*Microbiology Reviews*)
- **Elser et al. (2007)** - Phosphorus limitation (*Ecology Letters*)

See [docs/13_scientific_references.md](docs/13_scientific_references.md) for complete bibliography.

---

## 🏗️ Architecture

```
Cells/
├── index.html              # Entry point
├── style.css               # UI styles
├── src/
│   ├── utils/
│   │   └── Constants.js    # Configuration
│   ├── dna/                # Genetic system
│   ├── metabolism/         # Metabolic costs
│   ├── reproduction/       # Cell division
│   ├── visualization/      # Rendering & tracking
│   ├── cellular_systems/   # Oxygen tolerance, resource consumption
│   ├── ecosystem/          # Environment & regeneration
│   ├── logging/            # Development logging
│   ├── Entity.js           # Cell class
│   ├── Environment.js      # World simulation
│   └── Sketch.js           # Main loop (p5.js)
└── docs/                   # Detailed documentation
    ├── 00_Architecture_and_Mechanics.md
    ├── 13_scientific_references.md
    ├── LUCA_mutationRate.md
    └── traits/             # Trait documentation
```

See [docs/00_Architecture_and_Mechanics.md](docs/00_Architecture_and_Mechanics.md) for complete system documentation.

---

## 🛠️ Technologies

- **[p5.js](https://p5js.org/)** (1.9.0) - Graphics and animation
- **Vanilla JavaScript** (ES6) - Core logic
- **HTML5 Canvas** - Rendering
- **Pure CSS** - UI styling

**No build process required** - runs directly in the browser!

---

## 🔍 Transparency & Development

### Development Status
This project is in **active development** (v1.0.0-alpha). While functional and scientifically grounded, it should be considered experimental/educational software.

- **What works**: Core simulation, evolution, metabolic divergence
- **Limitations**: Performance with >200 cells, simplified biology
- **Planned**: Photosynthesis, predator-prey, horizontal gene transfer

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed status and roadmap.

### AI-Assisted Development
This project was developed through **human-AI collaboration** using Antigravity AI:

- **~85-90% AI-generated code**: Systems, documentation, infrastructure
- **~10-15% Human-directed**: Design, validation, scientific accuracy
- **100% Human oversight**: All decisions validated by human expertise

We believe in radical transparency about AI assistance. See [ATTRIBUTION.md](ATTRIBUTION.md) for complete details on tools, methodology, and code authorship.

---

## 📚 Documentation

- **[Development Status](DEVELOPMENT.md)** - Current status, limitations, and roadmap
- **[Attribution & Tools](ATTRIBUTION.md)** - AI assistance, code authorship, methodology
- **[Architecture & Mechanics](docs/00_Architecture_and_Mechanics.md)** - Complete system documentation
- **[Scientific References](docs/13_scientific_references.md)** - Bibliography (23 papers)
- **[LUCA Mutation Rate](docs/LUCA_mutationRate.md)** - Scientific basis for mutation mechanics
- **[Configuration Guide](docs/02_configuration_guide.md)** - How to adjust parameters
- **[Quick Start Guide](docs/QUICKSTART.md)** - Beginner-friendly introduction
- **[Traits Documentation](docs/traits/)** - Detailed trait mechanics

---

## 🎯 Educational Use

This simulator is ideal for:
- **Biology education**: Visualizing evolution and natural selection
- **Astrobiology**: Understanding early life conditions
- **Computer science**: Genetic algorithms and cellular automata
- **Science communication**: Demonstrating evolutionary principles

Feel free to use in classrooms, presentations, or research. Attribution appreciated!

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional metabolic pathways (photosynthesis, aerobic respiration)
- Predator-prey dynamics
- Horizontal gene transfer
- More sophisticated environmental modeling
- Performance optimizations

Please open an issue to discuss major changes before submitting a PR.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Scientific community for rigorous research on early life
- [p5.js](https://p5js.org/) for making creative coding accessible
- All researchers cited in [scientific references](docs/13_scientific_references.md)

---

## 📧 Contact

**David Prieto**
- GitHub: [@damdavidprieto](https://github.com/damdavidprieto)
- Repository: [Cells](https://github.com/damdavidprieto/Cells)

---

**Made with 🧬 and ☕ by David Prieto**

*Simulating 4 billion years of evolution, one frame at a time.*
