# 🦜 Gene-Forge v6.8

**Agapornis Genetics Calculator — ALBS Compliant Edition**

ラブバード（コザクラインコ / Agapornis roseicollis）の遺伝計算エンジン。  
14座位・310色以上に対応(動的羽色出力能は数万通り)し、ALBS（African Lovebird Society）Peachfaced部門の命名規則に準拠。

---

## ✨ 機能一覧

### 🗂️ 個体管理（個別登録）
- **個体データベース**: 名前・性別・誕生日・血統・遺伝子型を一元管理
- **66羽デモデータ(1家族22羽×3家族)**: 検証用のサンプル個体を搭載
- **血統書生成**: 3世代・5世代の血統書をHTML出力
- **インポート/エクスポート**: JSON・CSV形式に対応

### 🛡️ 健康評価（交配リスク判定）
- **近交係数計算**: F値の自動計算
- **リスク評価**: INO系・パリッド系の近親交配制限チェック
- **世代制限**: 形質別の推奨世代制限を表示

### 🎯 目標計画（交配経路）
- **目標色経路探索**: 目標の表現型への育成経路を探索
- **ステップガイド**: 必要な交配ステップを自動生成

### 🧭 育成経路（形質発現）
- **形質別ルート**: 特定の形質を発現させるための交配手順
- **世代数見積もり**: 目標達成までの最短世代数を計算

### 🧬 配合結果（交配期待）
- **子孫予測**: 親の遺伝子型から子の表現型確率を計算
- **14座位対応**: 全座位の組み合わせを網羅
- **伴性遺伝計算**: Z染色体連鎖遺伝の正確な計算（オスのスプリット、メスのヘミ接合）

### 🔬 遺伝推計（親型逆推）
- **表現型→遺伝子型**: 観察された色から可能な遺伝子型を推定
- **確定/推定の区別**: 確実に判定できる座位と推定の座位を明示
- **テスト交配提案**: 不確定な座位を確定するための交配提案

### 👨‍👩‍👧‍👦 一族推計（血統導出）
- **FamilyEstimator V3**: 家系図ベースの遺伝子型推論エンジン
- **多世代推論**: 祖父母まで遡った遺伝子型推論
- **証拠ベース確率**: 親・子・兄弟からの拘束条件を統合
- **家系図UI**: ドラッグ&ドロップで血縁関係を構築

### 🌍 多言語対応
- 日本語 / English / Deutsch / Français / Italiano / Español

---

## 📁 ファイル構成

```
gene-forge/
├── index.php          # メインUI
├── genetics.php       # 遺伝計算エンジン（SSOT）
├── infer.php          # 家系図推論API
├── lang.php           # 多言語辞書
├── style.css          # スタイルシート
├── birds.js           # 個体DB管理（デモデータ含む）
├── family.js          # 家系図UI
├── guardian.js        # 健康評価
├── breeding.js        # 繁殖バリデーション
├── pedigree.js        # 血統書生成
├── planner.js         # 育成経路探索
└── app.js             # アプリ初期化
```

---

## 🚀 クイックスタート

### 動作要件
- PHP 7.4以上
- Webサーバー（Apache/Nginx）またはPHP内蔵サーバー

### インストール

```bash
git clone https://github.com/YOUR_USERNAME/gene-forge.git
cd gene-forge
php -S localhost:8000
```

ブラウザで `http://localhost:8000` を開く。

---

## 💡 使用例

### 1. 子孫計算（PHP）

```php
require_once 'genetics.php';

$calc = new GeneticsCalculator();
$result = $calc->calculateOffspring([
    'f_mode' => 'genotype',
    'm_mode' => 'genotype',
    'f_parblue' => '++',      // 父: グリーン
    'f_ino' => '+ino',        // 父: ルチノースプリット
    'f_dark' => 'dd',
    'f_opaline' => '++',
    'f_cinnamon' => '++',
    'm_parblue' => 'aqaq',    // 母: アクア
    'm_ino' => 'inoW',        // 母: クリーミノ（発現）
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

### 2. 色名取得

```php
// 遺伝子型から色名を取得
$colorInfo = AgapornisLoci::resolveColor([
    'parblue' => 'aqaq',
    'dark' => 'dd',
    'opaline' => 'opop'
]);

echo $colorInfo['ja'];  // オパーリンアクア
echo $colorInfo['en'];  // Opaline Aqua
```

### 3. 遺伝子型推定

```php
$estimator = new GenotypeEstimator();
$result = $estimator->estimate(
    'male',           // 性別
    'opaline_aqua',   // 基本色
    'black',          // 眼の色
    'none'            // ダーク因子
);

foreach ($result['loci'] as $locus) {
    echo "{$locus['locusName']}: {$locus['genotype']}\n";
}
```

### 4. 家系図推論（API）

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

**結果例**: 子にアクアが出現 → 両親とも `+aq`（アクアスプリット）と推論

---

## 🎨 色カテゴリ一覧

| カテゴリ | 色数 | 例 |
|----------|------|-----|
| グリーン系 | 3 | グリーン, ダークグリーン, オリーブ |
| アクア系 | 3 | アクア, アクアダーク, アクアDD |
| ターコイズ系 | 3 | ターコイズ, ターコイズダーク, ターコイズDD |
| シーグリーン系 | 3 | シーグリーン, シーグリーンダーク, シーグリーンDD |
| INO系 | 4 | ルチノー, クリーミノ, クリーミノシーグリーン, ピュアホワイト |
| オパーリン系 | 12 | オパーリングリーン, オパーリンアクア, … |
| シナモン系 | 12 | シナモングリーン, シナモンアクア, … |
| パリッド系 | 12 | パリッドグリーン, パリッドアクア, … |
| バイオレット系 | 9 | バイオレットアクア, バイオレットターコイズ, … |
| ファロー系 | 24 | ペールファローグリーン, ブロンズファローアクア, … |
| パイド系 | 24 | ドミナントパイドグリーン, レセッシブパイドアクア, … |
| ダイリュート系 | 12 | ダイリュートグリーン, ダイリュートアクア, … |
| エッジド系 | 12 | エッジドグリーン, エッジドアクア, … |
| オレンジフェイス系 | 12 | オレンジフェイスグリーン, イエローフェイスアクア, … |
| ペールヘッド系 | 12 | ペールヘッドグリーン, ペールヘッドアクア, … |
| **Tier 2 複合色** | 150+ | オパーリンシナモン, オパーリンバイオレット, … |
| **Tier 3 動的生成** | ∞ | 任意の複合色を動的生成 |

---

## 🔬 遺伝子型表記法

### 常染色体座位

| 座位 | 野生型 | 変異型アレル |
|------|--------|--------------|
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

### 伴性座位（Z染色体）

| 座位 | オス野生型 | オス変異型 | メス野生型 | メス変異型 |
|------|------------|------------|------------|------------|
| INO | `++` | `+ino`, `inoino`, `+pld`, `pldpld` | `+W` | `inoW`, `pldW` |
| Opaline | `++` | `+op`, `opop` | `+W` | `opW` |
| Cinnamon | `++` | `+cin`, `cincin` | `+W` | `cinW` |

---

## 🧪 検証用デモデータ

デモモードには128羽のサンプル個体が含まれており、以下の検証が可能：

### 健康評価テスト
- 父娘交配 → 危険判定（F=25%）
- 半兄妹交配 → 高リスク判定（F=12.5%）
- 無関係個体 → 安全判定（F=0%）

### 遺伝計算テスト
- 伴性遺伝（INO/Opaline/Cinnamon）
- 複対立遺伝子（Parblue系）
- 不完全優性（Dark/Violet）

### 家系図推論テスト
- 子の表現型から親の遺伝子型を逆算
- テスト交配提案の生成

---

## 📜 ライセンス

**CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0)

- ✅ 個人利用・非商用OK
- ✅ 改変・再配布OK（同一ライセンス・クレジット表記必須）
- ❌ 商用利用は要相談

---

## 🤝 コントリビューション

Issue・Pull Request 歓迎。

特に以下の貢献を募集中：
- 追加言語の翻訳
- UI/UX改善
- 遺伝学的知見のフィードバック

---

## 👤 作者

制作総指揮:**Shohei Taniguchi**（Homo repugnans）
開発戦術核:**Sirius**（電子精霊 )

---

## 🙏 謝辞

- **ALBS (African Lovebird Society)** — 色名命名規則の参照
- **世界中のコザクラインコブリーダー** — 遺伝学的知見の蓄積

--------------------------------------------------
 * @license CC BY-NC-SA 4.0
 * Commercial use strictly prohibited.
 * NPO/Educational use welcome.
 
「 制度は責任を放棄した。制度外がそれを果たす。 」
*制度外文明・かならづプロジェクト*
