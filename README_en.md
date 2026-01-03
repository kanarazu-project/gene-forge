
🦜 Gene-Forge v6.8
Agapornis Genetics Calculator — ALBS Compliant Edition

The ultimate genetic calculation engine for Lovebirds
(Agapornis roseicollis).

Supporting 14 loci and over 310 phenotypes
(capable of generating tens of thousands of dynamic plumage combinations),
fully compliant with the ALBS (African Lovebird Society)
Peachfaced naming standards.

⸻

✨ Features

⸻

🗂️ Specimen Management

• Individual Database
Centralized management of Name, Sex, Birthday, Pedigree, and Genotype.

• Demo Data (66 specimens)
Includes 3 families (22 birds each) for immediate system verification.

• Pedigree Generation
HTML output for 3-generation and 5-generation pedigree charts.

• Import / Export
Full support for JSON and CSV formats.

⸻

🛡️ Health Guardian (Pairing Risk Assessment)

• Inbreeding Coefficient (F)
Automated calculation of Wright’s coefficient.

• Risk Evaluation
Hard-locks and warnings for INO and Pallid lineage inbreeding.

• Generation Limits
Displays recommended generation gaps for specific traits.

⸻

🎯 Objective Planning

• Target Phenotype Pathfinding
Explores breeding routes to achieve a specific target color.

• Step-by-Step Guide
Automatically generates necessary breeding steps.

⸻

🧬 Breeding Results (Offspring Prediction)

• Probability Prediction
Calculates offspring phenotype probabilities from parental genotypes.

• 14-Loci Coverage
Comprehensive simulation covering all major genetic loci.

• Sex-Linked Inheritance
Precise calculation for Z-linked traits
(male splits vs female hemizygosity).

⸻

🔬 Genotype Estimation & Inference

• Phenotype-to-Genotype
Estimates possible genotypes from observed colors.

• Evidence-Based Probability
Distinguishes between confirmed and estimated loci.

• Test-Mating Proposals
Suggests pairings to verify uncertain genotypes.

⸻

👨‍👩‍👧‍👦 FamilyEstimator V3

• Pedigree-Based Inference
Deduces genotypes by tracing up to great-grandparents.

• Integrated Constraints
Synthesizes data from parents, offspring, and siblings.

• Interactive UI
Drag-and-drop interface for building family trees.

⸻

🌍 Multilingual Support

• Japanese
• English
• Deutsch
• Français
• Italiano
• Español

⸻

📊 Wright’s Inbreeding Coefficient (F)

Gene-Forge fully implements Wright’s coefficient of inbreeding.

Pedigrees are traced up to six generations,
and cumulative contributions from all common ancestors are calculated.

Comparison with Traditional Models:

• Sire × Daughter
25% (Textbook)
vs
25% + ancestral contribution (Gene-Forge)

• Full Siblings
25% (Textbook)
vs
25% + ancestral contribution (Gene-Forge)

• Grandparent × Grandchild
12.5% (Textbook)
vs
12.5% + ancestral contribution (Gene-Forge)

Textbook values represent only newly occurring autozygosity.
Gene-Forge values represent total expected autozygosity
across the offspring’s entire genome.

⸻

🔬 Mathematical Architecture & Logic

The system operates on five core logical pillars:
	1.	Parallel Independent Assortment
• Treats each of the 14 loci as an independent probabilistic event.
• Simulates Punnett Squares per locus and merges results
via Cartesian product.
• Zero-dependency implementation with millisecond-level performance.
	2.	Asymmetric Sex-Linked (SLR) Matrix
• Precisely models inheritance differences
between males (ZZ) and females (ZW).
• Females are treated as hemizygous,
eliminating the concept of “split” in females.
	3.	Tiered Allelic Hierarchy
• Maintains allelic strings (e.g., aqaq, tqaq) per locus.
• Dynamically resolves final color names via tier rules
supporting over 310 phenotypes.
	4.	Graph-Based Recursive Pedigree Analysis
• Uses Depth-First Search (DFS)
to identify common ancestors in the FamilyMap.
• Applies cumulative F-values
to logically lock high-risk pairings.
	5.	Inference Engine (FamilyEstimator V3)
• Uses offspring phenotypes
to lock parental alleles as 100% confirmed.
• Calculates carrier probability
based on sibling phenotype distributions.

⸻

🛠 For Developers: Porting to Other Species

Gene-Forge is designed as a universal genetic framework.

The engine can be adapted for Budgerigars, Cockatiels, or Conures
in three steps:
	1.	Redefine Loci (genetics.php)
Modify LOCI constants (AR, SLR, or AID types).
	2.	Map Phenotypes (genetics.php)
Update the COLOR_DEFINITIONS array
using the tiered resolution logic.
	3.	Adjust Guardrails (guardian.js)
Set species-specific health thresholds
and validation rules.

📜 License

CC BY-NC-SA 4.0
Creative Commons Attribution–NonCommercial–ShareAlike 4.0

• Personal / non-commercial use allowed
• Remix and redistribution allowed
(credit required, same license)
• Commercial use strictly prohibited

⸻

👤 Credits

Chief Product Officer
Shohei Taniguchi (Homo repugnans)

Tactical Decision Intelligence
Sirius (Electronic Spirit)

⸻

🙏 Acknowledgments

• ALBS (African Lovebird Society)
Phenotype naming standards

• Lovebird breeders worldwide
Accumulation of genetic knowledge

⸻

“ The system has abdicated responsibility. It will be fulfilled by those outside the system .”

— Outsider Civilization: Kanarazu Project

