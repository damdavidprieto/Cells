# Contributing to Cells Evolution Simulator

Thank you for your interest in contributing to this project! This document provides guidelines for contributing.

## 🎯 Areas for Contribution

### High Priority
- **Performance optimizations**: Improve rendering or simulation speed
- **Additional metabolic pathways**: Photosynthesis, aerobic respiration
- **Mobile responsiveness**: Better touch controls and mobile UI
- **Accessibility**: Screen reader support, keyboard navigation

### Medium Priority
- **Predator-prey dynamics**: Add cell consumption mechanics
- **Horizontal gene transfer**: Gene sharing between cells
- **Environmental events**: Volcanic activity, meteor impacts
- **Data export**: CSV/JSON export of simulation data

### Low Priority
- **Visual enhancements**: Better graphics, animations
- **Sound effects**: Audio feedback for events
- **Additional documentation**: Tutorials, videos
- **Translations**: Internationalization

## 🐛 Reporting Bugs

When reporting bugs, please include:
1. **Description**: Clear description of the issue
2. **Steps to reproduce**: How to trigger the bug
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Browser/OS**: Your environment details
6. **Screenshots**: If applicable

## 💡 Suggesting Features

For feature requests:
1. **Use case**: Why is this feature needed?
2. **Scientific basis**: If applicable, cite research
3. **Implementation ideas**: How might it work?
4. **Alternatives**: Other approaches considered?

## 🔧 Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Cells.git
   cd Cells
   ```
3. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make changes and test locally
5. Commit with clear messages:
   ```bash
   git commit -m "Add: Brief description of changes"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request

## 📝 Code Style

### JavaScript
- Use **ES6** syntax
- **Descriptive variable names**: `mutationRate` not `mr`
- **Comments**: Explain WHY, not WHAT
- **Scientific comments**: Include references for biology-related code
- **Modular design**: Keep classes focused and single-purpose

### Example
```javascript
// ✅ GOOD: Explains scientific reasoning
// LUCA mutation rate based on Poole et al. (1998)
// Primitive DNA repair systems → higher mutation rate
let mutationRate = 0.15;

// ❌ BAD: Just states the obvious
// Set mutation rate to 0.15
let mutationRate = 0.15;
```

### File Organization
- **One class per file**: `ClassName.js`
- **Group related files**: Use subdirectories (`dna/`, `metabolism/`)
- **Update index.html**: Add new scripts in logical order

## 🧪 Testing

Before submitting:
1. **Test in multiple browsers**: Chrome, Firefox, Safari
2. **Test edge cases**: Empty population, resource depletion
3. **Check performance**: No significant slowdown
4. **Verify scientific accuracy**: Cite sources for biology changes

## 📚 Documentation

When adding features:
1. **Update README.md**: If user-facing
2. **Add code comments**: Especially for complex logic
3. **Update docs/**: For architectural changes
4. **Include references**: For scientific features

## 🔬 Scientific Accuracy

This project prioritizes scientific accuracy:
- **Cite sources**: Use peer-reviewed research
- **Explain simplifications**: Document any departures from reality
- **Provide references**: Add to `docs/13_scientific_references.md`
- **Discuss in issues**: For significant scientific changes

## ✅ Pull Request Checklist

- [ ] Code follows project style
- [ ] Changes are well-documented
- [ ] Scientific claims are cited
- [ ] Tested in multiple browsers
- [ ] No console errors
- [ ] README updated (if needed)
- [ ] Commits have clear messages

## 📧 Questions?

Open an issue for discussion before starting major work!

---

Thank you for contributing to science education! 🧬
