# CLAUDE.md - AI Assistant Guide for Gene-Forge

## Project Overview

**Gene-Forge v7.0** is a sophisticated genetic calculation engine for Agapornis roseicollis (Rosy-faced Lovebirds). It supports 14 genetic loci with over 310 phenotype colors, fully compliant with ALBS (African Lovebird Society) naming standards.

**Core Purpose**: Provide scientific breeding tools with ethical guidelines to prevent inbreeding depression through Wright's coefficient calculations.

**License**: CC BY-NC-SA 4.0 (Non-commercial, Attribution required)

---

## Codebase Structure

```
gene-forge/
├── Backend (PHP)
│   ├── genetics.php       # SSOT - Core genetic engine (1728 lines)
│   ├── index.php          # Main UI and form handling (1644 lines)
│   ├── infer.php          # JSON REST API for family inference
│   ├── lang.php           # Multilingual dictionary
│   ├── lang_guardian.php  # Health guardian translations
│   └── lang_pathfinder.php # Pathfinder translations
│
├── Frontend (JavaScript)
│   ├── app.js             # App initialization, tab management, i18n
│   ├── birds.js           # Specimen database (localStorage), demo data
│   ├── family.js          # Family tree UI and management
│   ├── breeding.js        # Breeding validation and results
│   ├── guardian.js        # Health/inbreeding risk evaluation
│   ├── pedigree.js        # Pedigree generation and display
│   └── planner.js         # Breeding path exploration
│
├── Styling
│   └── style.css          # Complete UI styling (2868 lines)
│
└── Documentation
    ├── README.md          # Main project documentation
    ├── gene-forge-ringneck-roadmap.md  # Porting guide for Indian Ringnecks
    ├── v7-UpdatePlan.md   # Future linkage genetics implementation
    └── LICENSE.txt        # CC BY-NC-SA 4.0 license
```

**Total Codebase**: ~11,600 lines of code

---

## Architecture Principles

### Single Source of Truth (SSOT)

All genetic data is centralized in `genetics.php`:

- **Locus Definitions**: `AgapornisLoci::LOCI` - All 14 genetic loci with alleles and inheritance types
- **Color Definitions**: `AgapornisLoci::COLOR_DEFINITIONS` - All 310+ phenotype colors with multilingual names
- **Never hardcode** genetic data in JavaScript - always reference PHP-injected globals

### Inheritance Types

| Type | Description | Example Loci |
|------|-------------|--------------|
| `AR` | Autosomal Recessive | pied_rec, dilute, edged |
| `AD` | Autosomal Dominant | pied_dom |
| `AID` | Autosomal Incomplete Dominant | dark, violet |
| `AR_MULTI` | Multi-allelic AR | parblue (aq, tq alleles) |
| `SLR` | Sex-Linked Recessive (Z chromosome) | opaline, cinnamon |
| `SL_MULTI` | Multi-allelic Sex-Linked | ino (ino, pld alleles) |

### Sex Determination System

Birds use ZZ/ZW (opposite of mammals):
- **Males (ZZ)**: Can carry 2 alleles, can be "split" for sex-linked traits
- **Females (ZW)**: Hemizygous for Z chromosome, no splits possible for sex-linked traits

---

## Key Classes and Functions

### PHP Backend (`genetics.php`)

```php
// Core calculation class
GeneticsCalculator::calculateOffspring($params)  // Main offspring probability calculation

// Color resolution
AgapornisLoci::resolveColor($genotypes)          // Genotype → Phenotype name (multilingual)

// Genotype estimation (reverse inference)
GenotypeEstimator::estimate($sex, $color, $eye, $dark)

// Family tree inference
FamilyEstimatorV3::infer($familyTree)            // Bayesian-like pedigree analysis

// Breeding validation
BreedingValidator::calculateWrightCoefficient()  // Inbreeding risk (Wright's F)

// Breeding path exploration
PathFinder::findPath($start, $target)            // Route to target phenotype
```

### JavaScript Frontend

```javascript
// Specimen management (birds.js)
BirdDB.save(bird)      // Save to localStorage
BirdDB.load()          // Load specimen database
BirdDB.exportJSON()    // Export data
BirdDB.importJSON()    // Import data

// UI Functions (app.js)
showTab(tabId)         // Tab navigation
t(key)                 // Translation lookup
showToast(message)     // User notifications

// Health evaluation (guardian.js)
Guardian.evaluate(sire, dam)  // Inbreeding risk assessment
```

---

## v7.0 Linkage Genetics

### Overview

v7.0 introduces **linkage genetics** with recombination rates for linked loci:

| Locus Pair | Recombination Rate | Inheritance |
|------------|-------------------|-------------|
| cinnamon-ino | 3% | Z-linked |
| ino-opaline | 30% | Z-linked |
| cinnamon-opaline | 33% | Z-linked |
| dark-parblue | 7% | Autosomal |

### Key Concepts

- **Phase (Cis/Trans)**: Whether linked mutations are on the same chromosome (Cis) or different chromosomes (Trans)
- **Cis advantage**: Cis individuals produce target phenotypes more efficiently
  - Lacewing from Cis parent: 48.5% probability
  - Lacewing from Trans parent: 1.5% probability

### New Classes & Methods

```php
// Gamete generation with recombination
GametesGenerator::generateZLinkedMale($Z1, $Z2)
GametesGenerator::generateZLinkedFemale($Z1)
GametesGenerator::generateAutosomal1($chr1, $chr2)

// Phase inference
FamilyEstimatorV3::inferLinkagePhase()

// Linkage-aware route planning
PathFinder::analyzeLinkageRequirements($genotype)
```

```javascript
// Breeding planner phase evaluation
BreedingPlanner.evaluateLinkagePhase(bird, targetKey)
BreedingPlanner.calculateLinkageBonus(male, female, targetKey)
```

### Data Structures

**v7 Haplotype Format:**
```javascript
{
  Z_linked: {
    Z1: { cinnamon: 'cin', ino: 'ino', opaline: '+' },  // Cis cin-ino
    Z2: { cinnamon: '+', ino: '+', opaline: '+' }       // Wild type
  },
  autosomal_1: {
    chr1: { dark: 'D', parblue: 'aq' },
    chr2: { dark: 'd', parblue: '+' }
  }
}
```

---

## Development Setup

### Requirements
- PHP 7.4 or higher
- Web server (Apache/Nginx) or PHP built-in server
- Modern browser with localStorage support

### Quick Start
```bash
git clone <repo>
cd gene-forge
php -S localhost:8000
# Open http://localhost:8000
```

### No Build Tools Required
This is a pure PHP + vanilla JavaScript project. No npm, webpack, or transpilation needed.

---

## Coding Conventions

### PHP

- Use `declare(strict_types=1)` at the top of PHP files
- Classes should be `final` unless designed for inheritance
- Follow existing array structure patterns for constants
- Multilingual strings use key-value arrays: `['ja' => '...', 'en' => '...']`

### JavaScript

- Module pattern using namespace objects (e.g., `BirdDB`, `Guardian`, `Pedigree`)
- Use vanilla JS - no frameworks or libraries
- Store user data in `localStorage` with `geneforge_` prefix
- Translation function `t(key)` for all user-facing strings

### Naming Conventions

- Locus names: lowercase with underscores (`pale_headed`, `fallow_bronze`)
- Allele symbols: lowercase for recessive (`aq`, `cin`), uppercase for dominant (`D`, `V`, `Pi`)
- Color keys: lowercase with underscores (`cinnamon_aqua_dark`)
- JavaScript functions: camelCase
- PHP methods: camelCase

---

## Data Persistence

- **localStorage key**: `geneforge_birds` - User specimen database
- **localStorage key**: `geneforge_linkage` - Linkage settings
- **Demo data**: Hardcoded 66 specimens in `birds.js` (3 families × 22 birds)
- **Capacity limit**: ~5MB (browser localStorage limit)

---

## Common Tasks

### Adding a New Color

1. Add definition to `COLOR_DEFINITIONS` in `genetics.php`:
```php
'new_color' => [
    'ja' => '日本語名',
    'en' => 'English Name',
    'albs' => 'ALBS Standard Name',
    'genotype' => ['parblue' => '++', 'dark' => 'dd', ...],
    'eye' => 'black',  // or 'red'
    'category' => 'category_name'
],
```

### Adding a New Locus

1. Add to `LOCI` constant in `genetics.php`
2. Update calculation methods in `GeneticsCalculator`
3. Add UI elements in `index.php`
4. Update translation files (`lang.php`, etc.)

### Adding a New Language

1. Add language code to all translation arrays in:
   - `lang.php`
   - `lang_guardian.php`
   - `lang_pathfinder.php`
2. Add language option in `index.php` language selector

---

## Testing

### Demo Mode
The app includes 66 pre-loaded specimens for testing:
- 3 families with 4-generation depth
- Test cases for all inheritance patterns
- Inbreeding scenarios (sire×daughter, half-siblings)

### Key Test Scenarios
1. **Sex-linked inheritance**: INO/Opaline/Cinnamon
2. **Multi-allelic loci**: Parblue series (aqua, turquoise, seagreen)
3. **Incomplete dominance**: Dark factor, Violet
4. **Inbreeding calculation**: Wright's F coefficient accuracy
5. **Family inference**: Reverse genotype calculation from offspring

---

## API Endpoint

### `POST /infer.php`
Family tree inference endpoint for external applications.

**Request:**
```json
{
  "target": "sire",
  "birds": [
    {"position": "sire", "sex": "male", "phenotype": {"baseColor": "green"}},
    {"position": "dam", "sex": "female", "phenotype": {"baseColor": "aqua"}},
    {"position": "offspring_0", "sex": "male", "phenotype": {"baseColor": "aqua"}}
  ]
}
```

**Response:** Inferred genotypes with confidence levels.

---

## Important Considerations

### Genetic Accuracy
- All calculations must follow Mendelian genetics principles
- Sex-linked traits follow avian ZZ/ZW system (not mammalian XY)
- Wright's coefficient must account for cumulative ancestral inbreeding

### ALBS Compliance
- Phenotype names must follow African Lovebird Society standards
- The `albs` field in color definitions contains the official name

### Health Guardian Thresholds
- INO lineage: Strict generation limits due to lethal gene risks
- Pallid lineage: Similar restrictions
- Wright's F > 25%: Critical risk warning
- Wright's F > 12.5%: High risk warning

---

## v7.0 Implementation Status ✅

Linkage genetics is fully implemented. See `v7-UpdatePlan.md` for details.

**Implemented Features:**
- GametesGenerator with recombination rate support
- calculateOffspringV7 with linked loci calculations
- Phase (Cis/Trans) inference in FamilyEstimatorV3
- Linkage-aware PathFinder and BreedingPlanner
- UI for linkage mode and phase selection

**Future Enhancements:**
- Lacewing color definitions in COLOR_DEFINITIONS
- More detailed phase visualization in UI
- Linkage-aware demo mode specimens

---

## File Modification Guidelines

### When modifying `genetics.php`:
- Maintain SSOT principle - this is the canonical source for all genetic data
- Preserve multilingual array structure
- Test all calculation methods after changes
- Ensure backward compatibility with existing specimen data

### When modifying JavaScript modules:
- Maintain namespace object pattern
- Use `t(key)` for new user-facing strings
- Test localStorage operations
- Verify demo mode compatibility

### When modifying `style.css`:
- Follow existing class naming conventions
- Ensure responsive design compatibility
- Test in both demo and user modes

---

## Porting to Other Species

Gene-Forge is designed as a genetic framework. To port to another species:

1. **Redefine `LOCI`** in `genetics.php` with target species' genetic loci
2. **Update `COLOR_DEFINITIONS`** with target phenotypes
3. **Adjust Health Guardian** thresholds in `guardian.js`
4. **Update translations** in lang files

See `gene-forge-ringneck-roadmap.md` for a detailed porting example.

---

## Quick Reference

| Task | File | Function/Location |
|------|------|-------------------|
| Offspring calculation | `genetics.php` | `GeneticsCalculator::calculateOffspring()` |
| Color name lookup | `genetics.php` | `AgapornisLoci::resolveColor()` |
| Inbreeding check | `genetics.php` | `BreedingValidator::calculateWrightCoefficient()` |
| Specimen storage | `birds.js` | `BirdDB` namespace |
| Tab navigation | `app.js` | `showTab()` |
| Pedigree display | `pedigree.js` | `Pedigree` namespace |
| Family tree UI | `family.js` | `Family` namespace |
| Health warnings | `guardian.js` | `Guardian` namespace |
