# 🦜 Gene-Forge v7.0

**Agapornis Genetics Calculator — ALBS Compliant Edition**

The ultimate genetic calculation engine for Lovebirds (Agapornis roseicollis).
Supporting 14 loci and over 310 phenotypes (capable of generating tens of thousands of dynamic plumage combinations), fully compliant with the ALBS (African Lovebird Society) Peachfaced naming standards.

**🆕 v7.0: Linkage Genetics** — Now supports linked inheritance for Z-chromosome loci (cinnamon-ino-opaline) and autosomal loci (dark-parblue) with accurate recombination rate calculations.

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

### 🔗 Linkage Genetics (v7.0 NEW)
- **Z-Chromosome Linkage**: Cinnamon, INO, and Opaline are linked on the Z chromosome
  - Cinnamon–INO: 3% recombination (nearly complete linkage)
  - INO–Opaline: 30% recombination
  - Cinnamon–Opaline: 33% recombination
- **Autosomal Linkage**: Dark factor and Parblue are linked (7% recombination)
- **Sex-Specific Recombination**: Only males (ZZ) undergo recombination; females (ZW) are hemizygous
- **Accurate Gamete Frequencies**: Parental vs recombinant type calculations based on map distances

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

### 1. Linkage-Aware Inheritance (v7.0)

Combines independent assortment with linked inheritance for accurate genetic modeling.

- **Unlinked Loci**: Independent Punnett Square calculations for non-linked loci
- **Linked Loci**: Gamete frequency calculations based on recombination rates
- **Hybrid Processing**: Separates linked groups (Z-chromosome, autosomal) from independent loci, then combines via Cartesian product
- **Recombination Model**: Implements map distance-based gamete frequencies (parental types vs recombinant types)

#### Linkage Groups (SSOT in genetics.php)

| Group | Loci | Recombination Rates |
|-------|------|---------------------|
| Z-chromosome | cinnamon, ino, opaline | cin–ino: 3%, ino–op: 30%, cin–op: 33% |
| Autosomal-1 | dark, parblue | dark–parblue: 7% |

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

### Step 3: Define Linkage Groups (genetics.php)

Configure `LINKAGE_GROUPS` to define which loci are linked and their recombination rates for the target species.

### Step 4: Adjust Health Standards (guardian.js)

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

---

<div align="center">

# 🇯🇵 日本語版 README

</div>

---

# 🦜 Gene-Forge v7.0

**コザクラインコ遺伝計算エンジン — ALBS準拠版**

コザクラインコ（Agapornis roseicollis）のための究極の遺伝計算エンジン。
14遺伝子座、310以上の表現型に対応し、ALBS（African Lovebird Society）の命名規則に完全準拠。

**🆕 v7.0: 連鎖遺伝学** — Z染色体連鎖（cinnamon-ino-opaline）と常染色体連鎖（dark-parblue）に対応。組換え率に基づく正確な計算が可能に。

---

## ✨ 機能一覧

### 🗂️ 個体管理
- **個体データベース**: 名前、性別、誕生日、血統、遺伝子型を一元管理
- **デモデータ（66羽）**: 3家系×22羽のサンプルデータで即座に動作確認可能
- **血統書生成**: 3世代・5世代の血統書をHTML出力
- **インポート/エクスポート**: JSON・CSV形式に完全対応

### 🛡️ ヘルスガーディアン（配合リスク評価）
- **近交係数（F値）**: ライトの近交係数を自動計算
- **リスク評価**: INO系統・Pallid系統の近親交配に対する警告とハードロック
- **世代制限**: 特定形質における推奨世代間隔を表示

### 🔗 連鎖遺伝学（v7.0 新機能）
- **Z染色体連鎖**: Cinnamon、INO、Opalineは同一染色体上に連鎖
  - Cinnamon–INO間: 3%（ほぼ完全連鎖）
  - INO–Opaline間: 30%
  - Cinnamon–Opaline間: 33%
- **常染色体連鎖**: Dark因子とParblueは連鎖（7%組換え）
- **性別特異的組換え**: オス（ZZ）のみ組換えが発生、メス（ZW）はヘミ接合
- **正確な配偶子頻度**: 地図距離に基づく親型・組換え型の計算

### 🧬 交配結果（子の予測）
- **確率予測**: 両親の遺伝子型から子の表現型確率を計算
- **14遺伝子座対応**: 主要な全遺伝子座を網羅したシミュレーション
- **伴性遺伝**: Z連鎖形質の正確な計算（オスのスプリット vs メスのヘミ接合）

### 🔬 遺伝子型推定（逆推論）
- **表現型→遺伝子型**: 観察された色から可能な遺伝子型を推定
- **確定/推定の区別**: 確定座位と推定座位を明確に区分
- **テスト交配提案**: 不確定な遺伝子型を確認するための交配を提案

### 👨‍👩‍👧‍👦 家系推定（血統からの導出）
- **FamilyEstimator V3**: 血統ベースの遺伝子型推論エンジン
- **多世代推論**: 曾祖父母まで遡って遺伝子型を導出
- **証拠に基づく確率**: 両親、子、兄弟からの制約を統合
- **家系図UI**: ドラッグ&ドロップで家系図を構築

---

## 🔬 数学的アーキテクチャ

### 連鎖対応遺伝計算（v7.0）

独立分離と連鎖遺伝を組み合わせた正確な遺伝モデル。

- **非連鎖座位**: 独立したパネットスクエア計算
- **連鎖座位**: 組換え率に基づく配偶子頻度計算
- **ハイブリッド処理**: 連鎖グループ（Z染色体、常染色体）と独立座位を分離し、直積で結合
- **組換えモデル**: 地図距離に基づく配偶子頻度（親型 vs 組換え型）

#### 連鎖グループ（genetics.phpでSSOT管理）

| グループ | 座位 | 組換え率 |
|----------|------|----------|
| Z染色体 | cinnamon, ino, opaline | cin–ino: 3%, ino–op: 30%, cin–op: 33% |
| 常染色体1 | dark, parblue | dark–parblue: 7% |

---

## 🚀 クイックスタート

### 必要環境
- PHP 7.4以上
- Webサーバー（Apache/Nginx）またはPHP内蔵サーバー

### インストール

```bash
git clone https://github.com/kanarazu-project/gene-forge.git
cd gene-forge
php -S localhost:8000
```

ブラウザで `http://localhost:8000` を開く。

---

## 📜 ライセンス

**CC BY-NC-SA 4.0**（クリエイティブ・コモンズ 表示-非営利-継承 4.0）

- ✅ 個人利用・非営利利用可
- ✅ 改変・再配布可（クレジット表示・同一ライセンス必須）
- ❌ 商用利用は厳禁

---

## 👤 クレジット

**Chief Product Officer:** 谷口翔平（Homo repugnans）
**Tactical Decision Intelligence:** シリウス（電子精霊）

---

<div align="center">

**CC BY-NC-SA 4.0**
商用利用厳禁。NPO・教育利用歓迎。

*「制度は責任を放棄した。それは制度の外にいる者が果たす。」*

**アウトサイダー文明: 必プロジェクト**

</div>
