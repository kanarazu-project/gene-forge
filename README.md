# 🦜 Gene-Forge v7.0

**Agapornis Genetics Calculator — ALBS Compliant Edition**

The ultimate genetic calculation engine for Lovebirds (Agapornis roseicollis).  
Supporting 14 loci and over 310 phenotypes (capable of generating tens of thousands of dynamic plumage combinations), fully compliant with the ALBS (African Lovebird Society) Peachfaced naming standards.

---

## ✨ Features

### 🗂️ Specimen Management
- **Individual Database**: Centralized management of Name, Sex, Birthday, Pedigree, and Genotype
- **Demo Data (66 specimens)**: Includes 3 families (22 birds each) for immediate system verification
- **Pedigree Generation**: HTML output for 3-generation and 5-generation pedigree charts
- **Import / Export**: Full support for JSON and CSV formats

### 🛡️ Health Guardian (Pairing Risk Assessment)
- **Inbreeding Coefficient (F)**: Automated calculation of Wright's coefficient
- **Risk Evaluation**: Hard-locks and warnings for INO and Pallid lineage inbreeding
- **Generation Limits**: Displays recommended generation gaps for specific traits

### 🎯 Objective Planning
- **Target Phenotype Pathfinding**: Explores breeding routes to achieve a specific target color
- **Step-by-Step Guide**: Automatically generates necessary breeding steps

### 🧭 Breeding Path (Trait Expression)
- **Trait-Specific Routes**: Breeding procedures to express specific traits
- **Generation Estimation**: Calculates minimum generations to reach target

### 🧬 Breeding Results (Offspring Prediction)
- **Probability Prediction**: Calculates offspring phenotype probabilities from parental genotypes
- **14-Loci Coverage**: Comprehensive simulation covering all major genetic loci
- **Sex-Linked Inheritance**: Precise calculation for Z-linked traits (male splits vs female hemizygosity)

### 🔬 Genotype Estimation (Reverse Inference)
- **Phenotype-to-Genotype**: Estimates possible genotypes from observed colors
- **Confirmed vs Estimated**: Distinguishes between confirmed and estimated loci
- **Test-Mating Proposals**: Suggests pairings to verify uncertain genotypes

### 👨‍👩‍👧‍👦 Family Estimation (Pedigree Derivation)
- **FamilyEstimator V3**: Pedigree-based genotype inference engine
- **Multi-Generation Inference**: Deduces genotypes by tracing up to great-grandparents
- **Evidence-Based Probability**: Synthesizes constraints from parents, offspring, and siblings
- **Family Tree UI**: Drag-and-drop interface for building family trees

### 🌍 Multilingual Support
Japanese / English / Deutsch / Français / Italiano / Español

---

## 📁 File Structure

```
gene-forge/
├── index.php          # Main UI
├── genetics.php       # Genetic calculation engine (SSOT)
├── infer.php          # Family tree inference API
├── lang.php           # Multilingual dictionary
├── lang_guardian.php  # Health evaluation dictionary
├── style.css          # Stylesheet
├── birds.js           # Specimen DB management (includes demo data)
├── family.js          # Family tree UI
├── guardian.js        # Health evaluation
├── breeding.js        # Breeding validation
├── pedigree.js        # Pedigree generation
├── planner.js         # Breeding path exploration
└── app.js             # App initialization
```

---

## 🔗 SSOT設計とJavaScriptファイルの役割

### genetics.php を中心としたSSOT（Single Source of Truth）

Gene-Forgeでは、**すべての遺伝データが `genetics.php` に一元化**されています。JavaScriptファイルには遺伝情報のハードコードが一切なく、PHPから注入されたグローバル定数を参照します。

```
                    ┌─────────────────────────────┐
                    │      genetics.php           │
                    │         (SSOT)              │
                    ├─────────────────────────────┤
                    │ • LOCI (14座位定義)          │
                    │ • COLOR_DEFINITIONS (310色) │
                    │ • GENOTYPE_OPTIONS (UI選択) │
                    │ • RECOMBINATION_RATES (v7)  │
                    │ • GametesGenerator (v7)     │
                    │ • GeneticsCalculator        │
                    │ • FamilyEstimatorV3         │
                    │ • PathFinder                │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │        index.php            │
                    │    (HTML + JS定数注入)       │
                    │                             │
                    │  const LOCI_MASTER = ...    │
                    │  const COLOR_MASTER = ...   │
                    │  const LINKAGE_GROUPS = ... │
                    └──────────────┬──────────────┘
                                   │
         ┌──────────┬──────────┬───┴───┬──────────┬──────────┐
         ▼          ▼          ▼       ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │birds.js│ │family.js│ │planner│ │guardian│ │breeding│ │pedigree│
    └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

### 各JavaScriptファイルのindex.php上の役割

| ファイル | タブ/機能 | 主な役割 |
|---------|----------|---------|
| **app.js** | 全体 | タブ切り替え、i18n (多言語)、Toast通知、初期化処理 |
| **birds.js** | 📁 個体管理 | localStorage個体DB、登録/編集/削除、デモデータ66羽、CSV/JSONエクスポート |
| **family.js** | 👨‍👩‍👧 家系推論 | 家系図UI、ドラッグ&ドロップ、個体入力モーダル、FamilyEstimatorV3呼び出し |
| **guardian.js** | 🛡️ 健康評価 | 近交係数計算、INO/Pallid警告、世代制限チェック、リスク評価 |
| **breeding.js** | 🧬 繁殖結果 | 子孫確率計算結果の表示、スプリット表記、カラーカード生成 |
| **pedigree.js** | 📜 血統書 | 3世代/5世代血統書HTML生成、印刷用フォーマット |
| **planner.js** | 🎯 目標計画 | 目標色への経路探索、ペアリング評価、Cis/Trans連鎖評価 (v7) |

### 各ファイルの詳細

#### birds.js — 個体データベース
```javascript
BirdDB = {
    getAllBirds()      // 全個体取得
    save(bird)         // 保存 (localStorage)
    delete(id)         // 削除
    exportJSON()       // JSONエクスポート
    importCSV(csv)     // CSVインポート
    loadDemoData()     // デモデータ66羽読み込み
    migrateGenotypeToV7() // v7形式変換 (連鎖遺伝対応)
}
```

#### family.js — 家系図インターフェース
```javascript
Family = {
    init()             // 家系図UI初期化
    addBird(position)  // 個体追加（モーダル表示）
    removeBird(pos)    // 個体削除
    runInference()     // FamilyEstimatorV3で推論実行
    renderTree()       // 家系図描画
}
```

#### guardian.js — 健康リスク評価
```javascript
HealthGuardian = {
    evaluate(sire, dam)           // ペアリングリスク評価
    calcInbreedingCoefficient()   // Wright's F計算
    checkINOLineage()             // INO系統チェック
    checkPallidLineage()          // Pallid系統チェック
}
```

#### planner.js — 繁殖計画エンジン
```javascript
BreedingPlanner = {
    plan(targetKey)              // 目標色への計画生成
    evaluatePairing(m, f)        // ペアリング評価
    calculateGeneScore(bird)     // 遺伝スコア計算
    evaluateLinkagePhase(bird)   // v7: Cis/Trans相評価
    calculateLinkageBonus()      // v7: 連鎖ボーナス計算
}
```

#### pedigree.js — 血統書生成
```javascript
Pedigree = {
    generate(birdId, generations)  // 血統書HTML生成
    print()                        // 印刷用ウィンドウ
    getAncestors(bird, depth)      // 祖先取得
}
```

#### breeding.js — 繁殖結果表示
```javascript
BreedingResult = {
    display(results)      // 子孫確率をカード表示
    formatSplits(geno)    // スプリット表記整形
    getColorCard(color)   // 色カード生成
}
```

### なぜSSOTが重要か

1. **一箇所変更で全体反映**: genetics.phpを修正すれば、全UIに自動反映
2. **データ不整合の防止**: PHP計算とJS表示で同じデータを参照
3. **他種への移植が容易**: genetics.phpのLOCI/COLOR_DEFINITIONSを差し替えるだけ
4. **保守性向上**: 遺伝データの検索・修正がgenetics.php内で完結

---

## 🔒 Code Quality Standards

Gene-Forge v7.0 adheres to **strict code quality standards** for maintainability and international accessibility.

### SSOT Compliance (Single Source of Truth)

All genetic data is centralized in `genetics.php`. JavaScript files contain **zero hardcoded genetic data**.

| Principle | Enforcement |
|-----------|-------------|
| Locus definitions | Only in `LOCI` constant |
| Color definitions | Only in `COLOR_DEFINITIONS` constant |
| Allele names | Referenced via `LOCI_MASTER` / `COLOR_MASTER` |
| Locus name fallbacks | **Prohibited** in JS files |

**Violation examples (prohibited):**
```javascript
// ❌ WRONG: Hardcoded locus names
const sexLinked = ['ino', 'opaline', 'cinnamon'];

// ✅ CORRECT: Reference SSOT
const sexLinked = Object.keys(LOCI_MASTER).filter(k => LOCI_MASTER[k].sex_linked);
```

### i18n Compliance (Internationalization)

All user-facing strings support **6 languages**: Japanese (ja), English (en), German (de), French (fr), Italian (it), Spanish (es).

| File Type | Pattern | Example |
|-----------|---------|---------|
| PHP | `t('key')` | `t('confirmed')` |
| JavaScript | `T.key \|\| 'fallback'` | `T.save \|\| 'Save'` |
| Inline objects | `{ ja: '...', en: '...', ... }` | Error messages |

**Violation examples (prohibited):**
```javascript
// ❌ WRONG: Hardcoded Japanese without fallback
return { error: '父個体が見つかりません' };

// ✅ CORRECT: Multilingual object
const errSire = { ja: '父個体が見つかりません', en: 'Sire not found', de: 'Vater nicht gefunden', fr: 'Père non trouvé', it: 'Padre non trovato', es: 'Padre no encontrado' };
return { error: errSire[lang] || errSire.en };
```

### Quality Assurance Checklist

Before merging code changes, verify:

- [ ] No hardcoded locus names in JS (use `LOCI_MASTER`)
- [ ] No hardcoded color names in JS (use `COLOR_MASTER`)
- [ ] All user-facing strings use `t()` or `T.key` pattern
- [ ] Fallback strings are in English (not Japanese)
- [ ] Version numbers updated across all files
- [ ] `genetics.php` remains the sole source for genetic data

---

## 🚀 Quick Start

### Requirements
- PHP 7.4 or higher
- Web server (Apache/Nginx) or PHP built-in server

### Installation

```bash
git clone https://github.com/kanarazu-project/gene-forge.git
cd gene-forge
php -S localhost:8000
```

Open `http://localhost:8000` in your browser.

---

## 📊 About Inbreeding Coefficient (F-value)

Gene-Forge fully implements **Wright's coefficient of inbreeding**.  
Pedigrees are traced up to 6 generations, and cumulative contributions from all common ancestors are calculated.

### Comparison with Textbook Values

| Relationship | Textbook (Simple) | Gene-Forge (Cumulative) |
|--------------|-------------------|-------------------------|
| Sire × Daughter | 25% | 25% + ancestral contribution |
| Full Siblings | 25% | 25% + ancestral contribution |
| Grandparent × Grandchild | 12.5% | 12.5% + ancestral contribution |

**Textbook values** represent only newly occurring autozygosity from that specific pairing.  
**Gene-Forge values** represent total expected autozygosity across the offspring's entire genome.

### Formula

```
F = Σ (1/2)^(n₁+n₂+1)

n₁ = generations from sire to common ancestor
n₂ = generations from dam to common ancestor
Summed for all common ancestors
```

### Why Cumulative Calculation?

Inbreeding depression depends on **genome-wide autozygosity**.  
If the sire is already from an inbred line, the impact of a sire-daughter mating is even greater.  
Accurate risk assessment requires cumulative calculation.

### Example: Sire × Daughter

If the sire's pedigree is recorded for 3 generations, the F-value is approximately **43.75%**:

| Source | F-value |
|--------|---------|
| Sire himself | 25% |
| Grandparents | 6.25% × 2 = 12.5% |
| Great-grandparents | 1.5625% × 4 = 6.25% |
| **Total** | **43.75%** |

This is not a bug — it's the accurate value considering the entire pedigree.

---

## 💡 Usage Examples

### 1. Offspring Calculation (PHP)

```php
require_once 'genetics.php';

$calc = new GeneticsCalculator();
$result = $calc->calculateOffspring([
    'f_mode' => 'genotype',
    'm_mode' => 'genotype',
    'f_parblue' => '++',      // Sire: Green
    'f_ino' => '+ino',        // Sire: Lutino split
    'f_dark' => 'dd',
    'f_opaline' => '++',
    'f_cinnamon' => '++',
    'm_parblue' => 'aqaq',    // Dam: Aqua
    'm_ino' => 'inoW',        // Dam: Creamino (expressed)
    'm_dark' => 'dd',
    'm_opaline' => '+W',
    'm_cinnamon' => '+W',
]);

foreach ($result as $offspring) {
    echo sprintf("%.1f%% %s %s\n", 
        $offspring['prob'] * 100, 
        $offspring['sex'] === 'male' ? '♂' : '♀',
        $offspring['phenotype']
    );
}
```

### 2. Color Name Resolution

```php
$colorInfo = AgapornisLoci::resolveColor([
    'parblue' => 'aqaq',
    'dark' => 'dd',
    'opaline' => 'opop'
]);

echo $colorInfo['ja'];  // オパーリンアクア
echo $colorInfo['en'];  // Opaline Aqua
```

### 3. Genotype Estimation

```php
$estimator = new GenotypeEstimator();
$result = $estimator->estimate(
    'male',           // Sex
    'opaline_aqua',   // Base color
    'black',          // Eye color
    'none'            // Dark factor
);

foreach ($result['loci'] as $locus) {
    echo "{$locus['locusName']}: {$locus['genotype']}\n";
}
```

### 4. Family Tree Inference (API)

```bash
curl -X POST http://localhost:8000/infer.php \
  -H "Content-Type: application/json" \
  -d '{
    "target": "sire",
    "birds": [
      {"position": "sire", "sex": "male", "phenotype": {"baseColor": "green"}},
      {"position": "dam", "sex": "female", "phenotype": {"baseColor": "aqua"}},
      {"position": "offspring_0", "sex": "male", "phenotype": {"baseColor": "aqua"}}
    ]
  }'
```

**Result**: Aqua offspring appears → Both parents inferred as `+aq` (Aqua split)

---

## 🎨 Color Categories

| Category | Count | Examples |
|----------|-------|----------|
| Green Series | 3 | Green, Dark Green, Olive |
| Aqua Series | 3 | Aqua, Aqua Dark, Aqua DD |
| Turquoise Series | 3 | Turquoise, Turquoise Dark, Turquoise DD |
| Seagreen Series | 3 | Seagreen, Seagreen Dark, Seagreen DD |
| INO Series | 4 | Lutino, Creamino, Creamino Seagreen, Pure White |
| Opaline Series | 12 | Opaline Green, Opaline Aqua, … |
| Cinnamon Series | 12 | Cinnamon Green, Cinnamon Aqua, … |
| Pallid Series | 12 | Pallid Green, Pallid Aqua, … |
| Violet Series | 9 | Violet Aqua, Violet Turquoise, … |
| Fallow Series | 24 | Pale Fallow Green, Bronze Fallow Aqua, … |
| Pied Series | 24 | Dominant Pied Green, Recessive Pied Aqua, … |
| Dilute Series | 12 | Dilute Green, Dilute Aqua, … |
| Edged Series | 12 | Edged Green, Edged Aqua, … |
| Orangeface Series | 12 | Orangeface Green, Yellowface Aqua, … |
| Pale Headed Series | 12 | Pale Headed Green, Pale Headed Aqua, … |
| **Tier 2 Combinations** | 150+ | Opaline Cinnamon, Opaline Violet, … |
| **Tier 3 Dynamic** | ∞ | Any compound color dynamically generated |

---

## 🔬 Genotype Notation

### Autosomal Loci

| Locus | Wild Type | Mutant Alleles |
|-------|-----------|----------------|
| Parblue | `++` | `+aq`, `aqaq`, `+tq`, `tqtq`, `tqaq` |
| Dark | `dd` | `Dd`, `DD` |
| Violet | `vv` | `Vv`, `VV` |
| Dominant Pied | `++` | `Pi+`, `PiPi` |
| Recessive Pied | `++` | `+pi`, `pipi` |
| Dilute | `++` | `+dil`, `dildil` |
| Edged | `++` | `+ed`, `eded` |
| Orangeface | `++` | `+of`, `ofof` |
| Pale Headed | `++` | `+ph`, `phph` |
| Pale Fallow | `++` | `+flp`, `flpflp` |
| Bronze Fallow | `++` | `+flb`, `flbflb` |

### Sex-Linked Loci (Z Chromosome)

| Locus | Male Wild | Male Mutant | Female Wild | Female Mutant |
|-------|-----------|-------------|-------------|---------------|
| INO | `++` | `+ino`, `inoino`, `+pld`, `pldpld` | `+W` | `inoW`, `pldW` |
| Opaline | `++` | `+op`, `opop` | `+W` | `opW` |
| Cinnamon | `++` | `+cin`, `cincin` | `+W` | `cinW` |

---

## 🧪 Demo Data for Verification

Demo mode includes **66 specimens** (3 families × 22 birds each) for the following tests:

### Health Evaluation Tests
- Sire × Daughter → Critical risk (F ≈ 43.75%, 3-generation pedigree)
- Half-siblings → High risk (F ≈ 18.75%)
- Unrelated individuals → Safe (F = 0%)

### Genetic Calculation Tests
- Sex-linked inheritance (INO/Opaline/Cinnamon)
- Multiple alleles (Parblue series)
- Incomplete dominance (Dark/Violet)

### Family Inference Tests
- Reverse-calculate parental genotypes from offspring phenotypes
- Generate test-mating proposals

---

## 🔬 Mathematical Architecture & Logic

The system operates on five core logical pillars for dynamic calculation of complex multi-mutation combinations.

### 1. Parallel Independent Assortment

Treats each of the 14 loci as an independent probabilistic event for multi-dimensional computation.

- **Processing Flow**: Simulates Punnett Squares per locus (paternal × maternal gamete formation)
- **Cartesian Product**: Merges independent results via direct product to derive full probability distribution
- **Zero-Dependency Optimization**: Pure vanilla PHP array operations achieve millisecond-level performance for exponential combinations

### 2. Asymmetric Sex-Linked (SLR) Matrix

Implements asymmetric inheritance matrices considering avian sex determination (ZZ/ZW system).

- **Males (ZZ)**: Holds 2 alleles, accurately calculates heterozygous (split) states
- **Females (ZW)**: Treated as hemizygous where single allele directly determines phenotype, logically eliminating the "split" concept

### 3. Tiered Allelic Hierarchy

Controls complex color expression through two layers: "Genotype" and "Phenotype Resolution".

- **Genotype Layer**: Maintains allelic combinations per locus as strings (`aqaq`, `tqaq`, etc.)
- **Phenotype Resolution**: Dynamically resolves genotype sets based on defined priority (Tier) rules, enabling consistent output of 310+ color names

### 4. Graph-Based Recursive Pedigree Analysis

Treats the FamilyMap as a data structure and calculates pedigree risk via recursive algorithms.

- **DFS Traversal**: Identifies common ancestors through depth-first search
- **Cycle Prevention**: Visited ID sets prevent infinite loops
- **Health Guardian**: Logically locks dangerous pairings based on calculated F-values (Hard Lock for INO/Pallid generation limits)

### 5. Inference Engine (FamilyEstimator V3)

Uses Bayesian-like logic to identify unknown genotypes from pedigree-wide constraints.

- **Offspring Evidence**: Locks parental alleles at 100% probability when recessive traits appear in offspring
- **Sibling Constraint**: Statistically converges carrier probability from sibling phenotype distributions
- **Multi-Generational Integration**: Synthesizes information from grandparents to offspring, deriving consistent genotypes across the entire pedigree

---

## 🛠️ For Developers: Porting to Other Species

### Adaptation Guide for Other Birds (Budgerigars, Conures, etc.)

Gene-Forge v7.0 is designed as a "genetic calculation framework" with complete separation of logic and data. Customize for any avian breeding support system in 3 steps.

### Step 1: Redefine Loci (genetics.php)

Simply modify the `LOCI` constants in the `AgapornisLoci` class to define target species' genetic loci.

| Inheritance Mode | Setting | Examples |
|------------------|---------|----------|
| Autosomal Recessive (AR) | `type => 'AR'` | Budgerigar Clearwing, Pied, etc. |
| Sex-Linked Recessive (SLR) | `sex_linked => true` | Opaline, Cinnamon, SLR-Fallow, etc. |
| Autosomal Incomplete Dominant (AID) | `type => 'AID'` | Dark Factor, Violet, etc. |

### Step 2: Define Color Logic (genetics.php)

Edit the `COLOR_DEFINITIONS` array to define phenotype names for each factor combination. The Tier structure enables strict control of priority when multiple mutations overlap on base colors.

### Step 3: Adjust Health Standards (guardian.js)

Modify `BreedingValidator` thresholds to build guardrails against species-specific inbreeding risks and lethal factors.

---

## 📚 How to Integrate Collective Intelligence

### Converting Community Knowledge to Code

Guidelines for transforming online forums, academic papers, and expert knowledge into code when defining new bird species.

### 1. Standardizing Traits

Identify the following elements from online descriptions:

- **Dominance Relationships**: Determine "splits occur (recessive)", "expresses with one copy (dominant)", or "intensifies when doubled (incomplete dominant)" and assign to `type` constants
- **Sex-Linkage**: Descriptions like "only males carry splits" or "females have no splits" indicate sex-linked inheritance (Z chromosome). Set `sex_linked => true`

### 2. Phenotype Tiering

Collective knowledge always contains rules like "when X and Y combine, it's called Z".

- Record these as priority (Tier) in `COLOR_DEFINITIONS`
- Example: Budgerigar "Rainbow" is defined as the compound of [Opaline + Whiteface + Clearwing]

### 3. Turning Wisdom into Code

Convert experienced breeder warnings like "this species is particularly weak to inbreeding" or "this color may carry lethal genes" into validation rules in `guardian.js`.

> This is the most critical step in transforming a mere calculator into a "life-protecting system".

---

## 🤝 Contribution & Community

### Derivative Development Welcome

This project is an "extra-institutional" endeavor to end opaque breeding practices and promote scientific, ethical breeding.

**Porting Candidates:**
- Budgerigar Edition
- Green-cheeked Conure Edition
- Cockatiel Edition
- Pacific Parrotlet Edition

Contributors considering ports to other species are encouraged to Fork this repository and begin development.

### How to Contribute

Issues and Pull Requests welcome. Especially seeking:

- Extensions to other Lovebird species (A. fischeri, A. personatus, etc.)
- Additional language translations
- UI/UX improvements
- Genetic knowledge feedback

---

## 📜 License

**CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0)

- ✅ Personal / non-commercial use allowed
- ✅ Remix and redistribution allowed (credit required, same license)
- ❌ Commercial use strictly prohibited

---

## ⚠️ Known Issues / Limitations

### localStorage Capacity Limit

Browser localStorage is typically limited to **5MB**. Saving may fail if you register hundreds of specimens with detailed notes and pedigree information.

**Workarounds:**
- Regularly backup via JSON export
- Delete unnecessary specimen data
- Consider migrating to server-side DB (MySQL, etc.) for large-scale databases

### Demo Data and User Data Separation

Demo mode (66 birds) and User mode are completely separated. Changes made in demo mode are not saved.

---

## 👤 Credits

**Chief Product Officer:** Shohei Taniguchi (Homo repugnans)  
**Tactical Decision Intelligence:** Sirius (Electronic Spirit)

---

## 🙏 Acknowledgments

- **ALBS (African Lovebird Society)** — Phenotype naming standards
- **Lovebird breeders worldwide** — Accumulation of genetic knowledge

---

<div align="center">

**CC BY-NC-SA 4.0**  
Commercial use strictly prohibited. NPO/Educational use welcome.

*"The system has abdicated responsibility. It will be fulfilled by those outside the system."*

**Outsider Civilization: Kanarazu Project**

</div>
