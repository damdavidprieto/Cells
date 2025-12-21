# Quick Start Guide - Cells Evolution Simulator

Welcome! This guide will help you get started with the Cells evolution simulator.

## 🎮 What is This?

**Cells** is a simulation of early life evolution, starting from **LUCA** (Last Universal Common Ancestor) - the organism from which all life on Earth descended. You'll watch as primitive cells evolve, compete for resources, and diverge into different species over time.

Think of it as a "primordial soup simulator" based on real science!

## 🚀 How to Run

### Method 1: Direct Open (Simplest)
1. Download or clone this repository
2. Open `index.html` in your web browser
3. That's it! The simulation starts automatically

### Method 2: Local Server (Recommended)
Running a local server prevents some browser security restrictions:

```bash
# Using Python (if installed)
python -m http.server 8080

# Using Node.js
npx http-server -p 8080

# Using npm
npm start
```

Then open `http://localhost:8080` in your browser.

## 👀 What You'll See

### Main Canvas
The large area showing:
- **Gray cells** 🔵 - LUCA (primitive ancestors)
- **Purple cells** 🟣 - Fermentation (evolved, anaerobic)
- **Green cells** 🟢 - Chemosynthesis (evolved, chemical energy)
- **Background gradient** - Water (blue) and sediment (dark)
- **Colored dots** - Resources (oxygen, nitrogen, phosphorus)

### Stats Panel (Left)
- **Population**: Total cells and species count
- **Cell Types**: Count of each metabolism type
- **Resources**: Total resources in environment

### Mutation Rate Graph (Top Right)
Shows how mutation rates evolve over time:
- **Red zone** (>0.15): Primordial era (chaotic)
- **Yellow zone** (0.08-0.15): Transition era
- **Green zone** (<0.08): Modern era (stable)

### Legend (Bottom Right)
Explains what each color means.

## 🎯 What to Watch For

### First 30 Seconds
- **LUCA cells** appear and start moving randomly
- They consume resources and reproduce
- **High mutation rates** - lots of variation
- Population grows rapidly

### 1-5 Minutes
- Watch for **first divergence**! 
- A cell might turn **purple** (fermentation) or **green** (chemosynthesis)
- A notification will appear when this happens
- **Mutation rates start decreasing** as population stabilizes

### 5-15 Minutes
- Multiple species may coexist
- **Resource competition** becomes visible
- Cells cluster near resources they need
- **Mutation rates continue dropping** toward modern levels

### 15+ Minutes
- **Stable ecosystem** with low mutation rates
- Specialized cells dominate specific niches
- Population reaches equilibrium with resources

## 🎨 Understanding Cell Colors

### LUCA (Gray) 🔵
- **Metabolism**: Primitive chemosynthesis
- **Efficiency**: Low (2.0x cost)
- **Habitat**: Anywhere, but prefers sediment (vents)
- **Evolution**: Can evolve into fermentation or chemosynthesis

### Fermentation (Purple) 🟣
- **Metabolism**: Anaerobic (no oxygen needed)
- **Efficiency**: Medium (1.5x cost)
- **Habitat**: Prefers surface (light-rich areas)
- **Special**: Oxygen is toxic at high levels

### Chemosynthesis (Green) 🟢
- **Metabolism**: Chemical energy from nitrogen
- **Efficiency**: High (1.0x cost)
- **Habitat**: Prefers sediment (nitrogen-rich)
- **Special**: Needs nitrogen to survive

## 📊 Understanding Resources

### Oxygen (Blue dots)
- **Distribution**: Random, limited
- **Purpose**: Respiration (all cells need some)
- **Regeneration**: Very slow (photolysis UV)

### Nitrogen (Purple dots)
- **Distribution**: Sediment (bottom 10%)
- **Purpose**: Chemosynthesis fuel
- **Regeneration**: Slow

### Phosphorus (Orange dots)
- **Distribution**: Deep sediment
- **Purpose**: DNA/RNA (required for reproduction)
- **Regeneration**: Very slow
- **Importance**: **Limiting factor** for reproduction

## ⚙️ Adjusting Parameters

Want to experiment? Edit `src/utils/Constants.js`:

### LUCA Variability
```javascript
LUCA_VARIABILITY_LEVEL: 'HIGH'  // NONE, MEDIUM, HIGH
```
- **NONE**: All LUCA identical (boring)
- **MEDIUM**: Some variation
- **HIGH**: Lots of diversity (recommended)

### Evolution Speed
```javascript
LUCA_DIVERGENCE_CHANCE: 0.01  // 1% chance per reproduction
```
- **Lower** (0.005): Slower evolution
- **Higher** (0.02): Faster evolution

### Environmental Stability
```javascript
ENVIRONMENTAL_STABILITY_ENABLED: true
```
- **true**: Mutation rates evolve (realistic)
- **false**: Mutation rates stay constant

See [Configuration Guide](02_configuration_guide.md) for all options.

## 🐛 Troubleshooting

### Simulation runs slowly
- **Cause**: Too many cells (>200)
- **Solution**: Wait for population to stabilize or refresh

### No cells appear
- **Cause**: JavaScript error
- **Solution**: Check browser console (F12), refresh page

### Cells die immediately
- **Cause**: Resource scarcity
- **Solution**: This is normal! Evolution is harsh

### No evolution happening
- **Cause**: Low mutation rates or bad luck
- **Solution**: Wait longer or increase `LUCA_DIVERGENCE_CHANCE`

## 📚 Learn More

- **[Architecture & Mechanics](00_Architecture_and_Mechanics.md)** - How everything works
- **[Scientific References](13_scientific_references.md)** - Research papers used
- **[LUCA Mutation Rate](LUCA_mutationRate.md)** - Why mutation rates matter
- **[Configuration Guide](02_configuration_guide.md)** - All parameters explained

## 🎓 Educational Tips

### For Teachers
- Use to demonstrate **natural selection** and **mutation**
- Show how **environmental pressures** drive evolution
- Discuss **resource competition** and **niche specialization**
- Compare to real evolutionary history

### For Students
- Observe how **random mutations** lead to **adaptation**
- See **trade-offs** (efficiency vs. specialization)
- Understand **limiting resources** (phosphorus)
- Learn about **LUCA** and early life on Earth

## ❓ FAQ

**Q: Is this scientifically accurate?**  
A: Yes! Based on 15+ peer-reviewed papers. See [Scientific References](13_scientific_references.md).

**Q: How long should I run it?**  
A: At least 5-10 minutes to see evolution. Longer is better!

**Q: Can I save my simulation?**  
A: Not yet, but you can download logs using the "Download Logs" button.

**Q: Why do all cells die sometimes?**  
A: Resource depletion! This is realistic - mass extinctions happen.

**Q: Can I add new features?**  
A: Yes! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**Ready to witness evolution?** Open `index.html` and watch life emerge! 🧬

*Questions? Open an issue on [GitHub](https://github.com/damdavidprieto/Cells/issues)*
