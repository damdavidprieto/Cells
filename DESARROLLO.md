# 🚧 Development Status

**Current Version**: 1.0.0-alpha  
**Status**: Active Development  
**Last Updated**: 2025-12-21

---

## ⚠️ Project Status

This project is currently in **active development** and should be considered **experimental/educational software**.

### What Works
- ✅ Core simulation mechanics (LUCA cells, evolution, reproduction)
- ✅ Metabolic divergence (Fermentation, Chemosynthesis)
- ✅ Environmental resource systems (O₂, N₂, P, H₂, CO₂, Fe²⁺)
- ✅ Mutation rate evolution based on environmental stability
- ✅ Scientific accuracy (23 peer-reviewed references)
- ✅ Real-time visualization and tracking

### Known Limitations
- ⚠️ **Not production-ready**: This is a research/educational tool
- ⚠️ **Performance**: May slow down with >200 cells
- ⚠️ **Browser-only**: Requires modern browser with JavaScript enabled
- ⚠️ **No persistence**: Simulation state is not saved between sessions
- ⚠️ **Simplified model**: Real biology is infinitely more complex

### Planned Features
- 🔜 Photosynthesis evolution
- 🔜 Predator-prey dynamics
- 🔜 Horizontal gene transfer
- 🔜 More sophisticated environmental modeling
- 🔜 Simulation state save/load
- 🔜 Performance optimizations

---

## 🎯 Intended Use

### ✅ Appropriate Uses
- **Education**: Teaching evolutionary biology concepts
- **Research**: Exploring evolutionary dynamics
- **Demonstration**: Visualizing natural selection
- **Learning**: Understanding cellular metabolism
- **Experimentation**: Testing evolutionary hypotheses

### ❌ Not Suitable For
- Production scientific research (use specialized tools)
- Accurate predictions of real evolutionary outcomes
- High-performance computing applications
- Critical systems or decision-making

---

## 📊 Development Approach

This project follows an **iterative, research-driven development** approach:

1. **Scientific Research**: Review peer-reviewed literature
2. **Design**: Plan mechanics based on scientific findings
3. **Implementation**: Code with extensive documentation
4. **Validation**: Test against known biological principles
5. **Iteration**: Refine based on observations

All major mechanics are documented with scientific references and rationale.

---

## 🔄 Version History

### v1.0.0-alpha (2025-12-21)
- Initial public release
- Core LUCA simulation
- Metabolic divergence (3 types)
- Environmental stability system
- UV radiation and oxygen tolerance
- Comprehensive scientific documentation (23 references)

---

## 🐛 Known Issues

### Performance
- Simulation may slow down with large populations (>200 cells)
- No spatial optimization (all cells checked against all resources)

### Scientific Simplifications
- Simplified genetics (no actual DNA sequences)
- Discrete time steps (not continuous)
- 2D environment (real ocean is 3D)
- Limited resource types (real cells need 20+ elements)

### UI/UX
- No mobile optimization
- Limited configuration UI (must edit Constants.js)
- No tutorial or guided experience

---

## 📝 Reporting Issues

If you find bugs or have suggestions:

1. **Check existing issues**: https://github.com/damdavidprieto/Cells/issues
2. **Open new issue**: Provide clear description and steps to reproduce
3. **Scientific feedback**: Include references if suggesting changes to mechanics

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Priority areas**:
- Performance optimizations
- Additional metabolic pathways
- Better visualization
- Mobile support
- Scientific accuracy improvements

---

## ⚖️ Disclaimer

This software is provided "as is" without warranty of any kind. It is intended for educational and research purposes only. The simulation is a simplified model and should not be used as a basis for scientific conclusions without proper validation.

---

**Remember**: This is a learning tool, not a replacement for rigorous scientific research! 🧬
