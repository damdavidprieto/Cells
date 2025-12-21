# Scientific References - Cells Simulation

Complete bibliography of scientific research used to inform the simulation mechanics.

---

## Evolution & Mutation Rates

### Drake, J. W. (1991)
**A constant rate of spontaneous mutation in DNA-based microbes**
- *Proceedings of the National Academy of Sciences*, 88(16), 7160-7164
- **Key finding**: Mutation rates are subject to natural selection
- **Application**: Evolutionary pressure on mutation rate in `DNAMutator.js`

### Eigen, M. (1971)
**Selforganization of matter and the evolution of biological macromolecules**
- *Naturwissenschaften*, 58(10), 465-523
- **Key finding**: Error threshold theory - mutation rate must balance fidelity and adaptability
- **Application**: Target mutation rates based on environmental stability

### Poole, A. M., Jeffares, D. C., & Penny, D. (1998)
**The path from the RNA world**
- *Journal of Molecular Evolution*, 46(1), 1-17
- **Key finding**: LUCA had high mutation rates (10^-5 to 10^-4 per base)
- **Application**: Initial LUCA mutation rate configuration (0.15-0.25)

### Forterre, P. (2015)
**The universal tree of life: an update**
- *Frontiers in Microbiology*, 6, 717
- **Key finding**: LUCA characteristics and phylogenetic position
- **Application**: LUCA genome properties and evolutionary timeline

---

## LUCA & Early Life

### Weiss, M. C., Sousa, F. L., Mrnjavac, N., et al. (2016)
**The physiology and habitat of the last universal common ancestor**
- *Nature Microbiology*, 1(9), 16116
- **Key findings**:
  - LUCA lived in hydrothermal vents
  - Small genome (~500-1000 genes)
  - Primitive metabolism
  - Resource distribution in primordial oceans
- **Application**: Environment resource grids, LUCA characteristics, metabolic types

### Martin, W. & Russell, M. J. (2007)
**On the origin of biochemistry at an alkaline hydrothermal vent**
- *Philosophical Transactions of the Royal Society B*, 362(1486), 1887-1925
- **Key findings**:
  - Chemiosmotic energy generation
  - Hydrothermal vent chemistry
  - Primitive metabolism inefficiency
- **Application**: Environment sediment zones, LUCA metabolism (2x cost), resource gradients

### Koonin, E. V. & Martin, W. (2005)
**On the origin of genomes and cells within inorganic compartments**
- *Trends in Genetics*, 21(12), 647-654
- **Key finding**: Environmental stability affects evolutionary dynamics
- **Application**: Environmental stability system in `Environment.js`

### Koonin, E. V. & Wolf, Y. I. (2008)
**Genomics of bacteria and archaea: the emerging dynamic view of the prokaryotic world**
- *Nucleic Acids Research*, 36(21), 6688-6719
- **Key finding**: Early genetic diversity and horizontal gene transfer
- **Application**: LUCA variability levels in `DNAFactory.js`

---

## Metabolism & Bioenergetics

### Müller, M., Mentel, M., van Hellemond, J. J., et al. (2012)
**Biochemistry and evolution of anaerobic energy metabolism in eukaryotes**
- *Microbiology and Molecular Biology Reviews*, 76(2), 444-495
- **Key findings**:
  - Fermentation efficiency (ATP yield 4-6)
  - Hydrogenosomes evolution
  - Oxygen toxicity in anaerobes
- **Application**: Fermentation metabolism (1.5x cost), oxygen stress

### Nakagawa, S. & Takai, K. (2008)
**Deep-sea vent chemoautotrophs: diversity, biochemistry and ecological significance**
- *FEMS Microbiology Ecology*, 65(1), 1-14
- **Key findings**:
  - Chemosynthesis efficiency (ATP yield 8-12)
  - Habitat preferences (deep zones)
  - Nitrogen compound utilization
- **Application**: Chemosynthesis metabolism (1.0x cost), sediment preference

### Lane, N. & Martin, W. F. (2010)
**The origin of membrane bioenergetics**
- *Cell*, 151(7), 1406-1416
- **Key findings**:
  - Energy requirements for cell division
  - Membrane potential importance
  - Metabolic constraints
- **Application**: Reproduction energy thresholds, metabolic requirements

---

## Cell Division & Nutrients

### Elser, J. J., Bracken, M. E., Cleland, E. E., et al. (2007)
**Global analysis of nitrogen and phosphorus limitation of primary producers in freshwater, marine and terrestrial ecosystems**
- *Ecology Letters*, 10(12), 1135-1142
- **Key findings**:
  - Phosphorus is THE limiting nutrient
  - P required for DNA/RNA synthesis
  - Controls population growth
- **Application**: Phosphorus as critical reproduction resource (60% threshold)

### Margolin, W. (2005)
**FtsZ and the division of prokaryotic cells and organelles**
- *Nature Reviews Microbiology*, 3(8), 586-597
- **Key findings**:
  - Binary fission mechanics
  - Resource requirements for division
  - 50/50 resource split
- **Application**: Reproduction system binary fission, resource splitting

---

## Summary by File

| File                      | Primary References                                            |
| ------------------------- | ------------------------------------------------------------- |
| **DNAMutator.js**         | Drake 1991, Eigen 1971, Poole 1998, Forterre 2015, Weiss 2016 |
| **DNAFactory.js**         | Weiss 2016, Koonin & Wolf 2008                                |
| **Environment.js**        | Weiss 2016, Martin & Russell 2007, Koonin & Martin 2005       |
| **MetabolicCosts.js**     | Martin & Russell 2007, Müller 2012, Nakagawa 2008             |
| **ReproductionSystem.js** | Elser 2007, Margolin 2005, Lane & Martin 2010                 |

---

## Key Concepts Applied

1. **Mutation Rate Evolution**: Cells evolve their mutation rate based on environmental stability (Drake 1991, Eigen 1971)

2. **LUCA Characteristics**: High mutation rate, primitive metabolism, small genome, hydrothermal vent habitat (Weiss 2016, Poole 1998)

3. **Metabolic Efficiency**: LUCA (2x cost) → Fermentation (1.5x) → Chemosynthesis (1.0x) based on ATP yields (Martin & Russell 2007, Müller 2012, Nakagawa 2008)

4. **Resource Limitation**: Phosphorus limits reproduction, nitrogen varies by metabolism (Elser 2007, Lane & Martin 2010)

5. **Environmental Gradients**: Light (surface), Oxygen (patchy), Nitrogen (sediment), Phosphorus (deep sediment) (Weiss 2016, Martin & Russell 2007)

---

*All references are peer-reviewed scientific publications from high-impact journals*
*Last updated: 2025-12-19*
