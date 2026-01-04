# Gene-Forge Ringneck Edition Development Roadmap

A guide for anyone interested in creating an Indian Ringneck (Psittacula krameri) version of Gene-Forge.

## Overview

The core calculation logic (Mendelian inheritance, sex-linked inheritance, etc.) can be reused from the Lovebird version. The main challenge is organizing the loci definitions and color nomenclature, as Ringneck genetics information is more scattered compared to Lovebirds (which has ALBS standardization).

---

## Development Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Gather Reference Materials                         │
├─────────────────────────────────────────────────────────────┤
│  • Terry Martin "A Guide to Colour Mutations and            │
│    Genetics in Parrots"                                     │
│  • Bastiaan "Ringnecked Parakeets and Their Mutations"      │
│  • Phil Robson "The Indian Ringneck Breeders Handbook"      │
│  • Ornitho-Genetics VZW website (ogvzw.org)                 │
│  • Psittacula-world.com mutation database                   │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Organize Genetic Loci                              │
├─────────────────────────────────────────────────────────────┤
│  Identify and define all loci with their alleles:           │
│                                                             │
│  Par-blue series:                                           │
│    • Blue, Turquoise, Indigo, Emerald (multiple alleles?)   │
│                                                             │
│  Sex-linked mutations:                                      │
│    • Lutino (SL ino)                                        │
│    • Cinnamon                                               │
│    • Opaline                                                │
│    • Pallid (Lacewing)                                      │
│                                                             │
│  Autosomal mutations:                                       │
│    • Dark Factor (incomplete dominant)                      │
│    • Violet Factor (incomplete dominant)                    │
│    • Grey / Grey-green                                      │
│    • Cleartail                                              │
│    • Pied (dominant)                                        │
│    • Fallow variants (Bronze, Pale, etc.)                   │
│                                                             │
│  ⚠️ Determine which mutations are allelic (same locus)      │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Confirm Inheritance Patterns                       │
├─────────────────────────────────────────────────────────────┤
│  Map each mutation to its inheritance type:                 │
│                                                             │
│  • AD  - Autosomal Dominant                                 │
│  • AR  - Autosomal Recessive                                │
│  • AID - Autosomal Incomplete Dominant                      │
│  • SLR - Sex-Linked Recessive                               │
│  • SL_MULTI - Sex-Linked with Multiple Alleles              │
│                                                             │
│  Verify with breeding records from literature               │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Standardize Nomenclature                           │
├─────────────────────────────────────────────────────────────┤
│  ⚠️ MAJOR CHALLENGE: No ALBS-equivalent standard exists     │
│                                                             │
│  Tasks:                                                     │
│  • Resolve European vs American naming differences          │
│  • Define internal key names (e.g., 'turquoise', 'violet')  │
│  • Create multilingual name mappings                        │
│  • Document any naming decisions made                       │
│                                                             │
│  Example conflicts to resolve:                              │
│  • "Lacewing" vs "Pallid"                                   │
│  • "Pastel" vs "Turquoise" terminology                      │
│  • Various par-blue combination names                       │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Rewrite genetics.php                               │
├─────────────────────────────────────────────────────────────┤
│  Files to modify/create:                                    │
│                                                             │
│  genetics.php:                                              │
│  • Redefine LOCI constant with Ringneck loci                │
│  • Rewrite COLOR_DEFINITIONS (potentially 200+ colors)      │
│  • Update resolveColor() matching rules                     │
│  • Adjust phenotype naming logic                            │
│                                                             │
│  Reusable components (no changes needed):                   │
│  • Mendelian calculation logic                              │
│  • Sex-linked inheritance calculations                      │
│  • Punnett square generation                                │
│  • Inbreeding coefficient calculations                      │
│                                                             │
│  lang.php:                                                  │
│  • Update all UI strings                                    │
│  • Add Ringneck-specific terminology                        │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Testing & Validation                               │
├─────────────────────────────────────────────────────────────┤
│  • Cross-reference with known breeding outcomes             │
│  • Test all inheritance pattern calculations                │
│  • Verify color naming outputs                              │
│  • Get review from experienced Ringneck breeders            │
│  • Bug fixes and refinements                                │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 7: Release                                            │
├─────────────────────────────────────────────────────────────┤
│  • Publish on GitHub (fork or new repo)                     │
│  • Set up live demo                                         │
│  • Write README documentation                               │
│  • Share with Ringneck breeder communities                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Difficulty Comparison

| Aspect | Lovebird Edition | Ringneck Edition |
|--------|------------------|------------------|
| International Standard | ALBS ✅ | None ❌ |
| Definitive Reference | Dirk's 768p book ✅ | Scattered sources ⚠️ |
| Loci Clarity | 14 loci defined ✅ | Needs organization ⚠️ |
| Naming Convention | ALBS compliant ✅ | EU/US inconsistent ❌ |
| Calculation Logic | — | Reusable ✅ |

---

## Key Challenges

1. **No standardized nomenclature**: Unlike Lovebirds with ALBS, Ringneck naming varies by region. You'll need to make decisions and document them.

2. **Par-blue complexity**: Multiple par-blue mutations (Turquoise, Indigo, Emerald, etc.) and their interactions need careful organization.

3. **Scattered information**: No single authoritative source like Dirk's Compendium exists. Information must be compiled from multiple books and breeder communities.

4. **Validation difficulty**: Without a standard, validating correctness is harder. Building relationships with experienced breeders is essential.

---

## Estimated Effort

| Phase | Time Estimate |
|-------|---------------|
| Step 1: Gather materials | 1-2 weeks |
| Step 2-4: Organize genetics | 2-4 weeks |
| Step 5: Coding | 1-2 weeks |
| Step 6: Testing | 2-4 weeks |
| **Total** | **6-12 weeks** |

---

## Resources

### Books
- Terry Martin - "A Guide to Colour Mutations and Genetics in Parrots" (2002)
- Bastiaan - "Ringnecked Parakeets and Their Mutations"
- Phil Robson - "The Indian Ringneck Breeders Handbook"

### Websites
- https://www.ogvzw.org/ (Ornitho-Genetics VZW)
- http://psittacula-world.com/
- http://www.indianringneck.com/forum/

### Original Gene-Forge Source
- https://github.com/kanarazu-project/gene-forge

---

## License

If you fork Gene-Forge, please comply with the original CC BY-NC-SA license:
- Attribution required
- Non-commercial use only
- Share-alike (same license for derivatives)

---

Good luck! 🦜
