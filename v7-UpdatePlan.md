# Gene-Forge v7.0 計画: 連鎖遺伝と相（Phase）の実装

## 概要

v7.0では、現在の独立分離仮定を**連鎖遺伝モデル**に置き換え、さらに**相（Phase: Cis/Trans）** の概念を導入する。

### 主要な変更点

1. **連鎖遺伝の組み換え率**を計算に反映
2. **相（Cis/Trans）** を個体データに記録
3. **ハプロタイプベース**のデータ構造に移行
4. **UIで相の手動指定と自動推論**の両方を提供

---

## 影響範囲（双方向 + 経路探索）

連鎖遺伝と相は、以下の **4つの計算エンジン全て** に影響する:

```
┌─────────────────────────────────────────────────────────────────┐
│                  v7 Linkage: 影響範囲                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [1] GeneticsCalculator      [2] FamilyEstimatorV3              │
│      親→子 計算                   子→親 推論                     │
│      ─────────────               ─────────────                  │
│      親の相から配偶子確率を計算    子の分布から親の相を逆推論     │
│                                                                  │
│  [3] PathFinder              [4] Planner                        │
│      目標への経路探索              最適ペア選定                   │
│      ─────────────               ─────────────                  │
│      相を考慮した世代数計算        手持ち個体の相を評価           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              共通: GametesGenerator                          ││
│  │                                                              ││
│  │  入力: ハプロタイプ構成 + 相(Phase) + 組み換え率              ││
│  │  出力: 配偶子確率分布                                         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### [1] 親→子 (GeneticsCalculator)

親の相から子の表現型確率を計算。

```
Cis [cin-ino]/[+  +  ] × Normal
→ Lacewing子: 48.5% (cin-ino一緒に遺伝)

Trans [cin +]/[+ ino] × Normal
→ Lacewing子: 1.5% (組み換えでしか揃わない)
```

### [2] 子→親 (FamilyEstimatorV3)

子の表現型分布から親の相を逆推論。

```
子10羽中:
  - Lacewing 5羽 (50%)
  - Cinnamon 0羽
  - INO 0羽
→ 親はCis配置の可能性が高い (Lacewingが多すぎる)

子10羽中:
  - Lacewing 0羽
  - Cinnamon 5羽 (50%)
  - INO 5羽 (50%)
→ 親はTrans配置の可能性が高い
```

### [3] 経路探索 (PathFinder)

目標表現型への最短経路を相を考慮して計算。

```
目標: Lacewing (シナモンイノ)

ルートA: Cis個体が手に入る場合
  → Green/cin-ino (Cis) × Cin♀ = 1世代でLacewing♀ (48.5%)

ルートB: Trans個体しかいない場合
  → Green/cin,ino (Trans) × Cin♀ = 1世代でLacewing♀ (1.5%)
  → 統計的に確実に得るには複数世代必要
```

### [4] 最適ペア選定 (Planner)

手持ち個体の相を評価し、最適なペアを推奨。

```
手持ち:
  ♂A: Green/cin-ino (Cis)   ← 優先使用
  ♂B: Green/cin,ino (Trans) ← 効率悪い
  ♀C: Cinnamon

目標: Lacewing

推奨: ♂A × ♀C
  - 1世代で48.5%の確率でLacewing♀
  - 期待羽数: 2.1羽で1羽のLacewing

非推奨: ♂B × ♀C
  - 1世代で1.5%の確率でしかLacewing♀
  - 期待羽数: 67羽で1羽のLacewing
```

---

## 出典

**Lovebirds Compendium: Genus Agapornis**
著者: Dirk Van den Abeele
出版: 2016年
参照ページ: p.228-231 (Crossing-over)

---

## 組み換え率（確定値）

### Z染色体（伴性遺伝子座）

| 遺伝子座ペア | 組換え率 | 親型配偶子 | 組換え型配偶子 |
|-------------|---------|-----------|--------------|
| cinnamon-ino | **3%** | 97% | 3% |
| ino-opaline | **30%** | 70% | 30% |
| cinnamon-opaline | **33%** | 67% | 33% |

### 常染色体

| 遺伝子座ペア | 組換え率 | 親型配偶子 | 組換え型配偶子 |
|-------------|---------|-----------|--------------|
| dark-parblue | **7%** | 93% | 7% |

---

## 遺伝子の物理的配置

### Z染色体上

```
───[cinnamon]────[ino]─────────────────────────[opaline]───
      ←── 3% ──→   ←────────── 30% ──────────→
      ←──────────────── 33% ────────────────→
```

- cinnamonとinoは非常に近い（ほぼ完全連鎖）
- opalineは離れている
- 3% + 30% ≈ 33% で整合性あり

### 常染色体上

```
───[dark]────────[parblue]───
      ←── 7% ──→
```

---

## 相（Phase）の概念

### Cis配置とTrans配置

連鎖した座位が**同じ染色体上**にあるか、**別々の染色体上**にあるかで、子孫の表現型比率が大きく変わる。

```
Cis配置（同一染色体上）:        Trans配置（別々の染色体上）:
Z1: [cin]---[ino]---[+]         Z1: [cin]---[+]---[+]
Z2: [+]-----[+]-----[+]         Z2: [+]-----[ino]---[+]
```

### 組み換え率3%での配偶子比率の違い

| 配偶子 | Cis配置 | Trans配置 |
|--------|---------|-----------|
| cin-ino (両方) | **48.5%** | 1.5% |
| ++ (野生型) | **48.5%** | 1.5% |
| cin のみ | 1.5% | **48.5%** |
| ino のみ | 1.5% | **48.5%** |

**→ 同じダブルスプリット♂でも、相によって結果が真逆になる**

### 用語

- **Linked factors**: 同一染色体上に連鎖した変異の組み合わせ（Cis配置）
- 例: 「cinnamon-SL ino」「opaline-SL ino」

---

## 現状の問題

### v6.8のアーキテクチャ

```
calculateOffspring()
    ├── calcAutosomal() × 11回（独立計算）
    ├── calcSLR_Male/Female() × 3回（独立計算）
    └── enumerateCombinations() → 全座位の直積（独立分離前提）
```

### 問題点

1. **伴性3座位が独立処理**: cinnamon, ino, opaline を個別に計算
2. **相の情報がない**: 遺伝型表記 `+ino` に、どの染色体由来かの情報がない
3. **組み合わせが単純直積**: 連鎖も組み換え率も考慮されていない
4. **最大47ポイントの誤差**: cinnamon-ino ペアの場合

---

## v7.0 データ構造設計

### 後方互換性

**不要**（現時点でユーザーは開発者のみ）

### 個体データの新形式

```javascript
{
    id: "bird_001",
    name: "太郎",
    sex: "male",

    genotype: {
        // 独立座位（従来形式を維持）
        violet: "vv",
        fallow_pale: "++",
        fallow_bronze: "++",
        pied_dom: "++",
        pied_rec: "++",
        dilute: "++",
        edged: "++",
        orangeface: "++",
        pale_headed: "++",

        // Z染色体連鎖グループ（新形式）
        Z_linked: {
            Z1: { cin: "cin", ino: "ino", op: "+" },  // Cis: cin-ino linked
            Z2: { cin: "+",   ino: "+",   op: "+" }
        },

        // 常染色体連鎖グループ（新形式）
        autosomal_1: {
            chr1: { dark: "d", parblue: "aq" },
            chr2: { dark: "d", parblue: "+" }
        }
    }
}
```

### メス（ZW）の場合

```javascript
Z_linked: {
    Z: { cin: "cin", ino: "+", op: "op" },  // Z染色体1本のみ
    W: null                                  // W染色体（座位なし）
}
```

---

## UI設計

### 相の入力方法

**A. 手動指定** と **B. 家系からの自動推論** の両方を提供し、ユーザーが選択可能。

```
┌─────────────────────────────────────────────────┐
│ Z染色体連鎖（cinnamon-ino-opaline）             │
│                                                 │
│  ○ 自動推論  ● 手動指定                         │
│                                                 │
│  Z1: [cin ▼] - [ino ▼] - [ + ▼]                │
│  Z2: [ + ▼] - [ + ▼] - [op ▼]                  │
│                                                 │
│  配置: Trans（cin と op が別染色体）            │
│  ※ cin-ino: Trans, ino-op: Trans               │
│                                                 │
│  [家系から推論] ← クリックで推論結果を反映      │
└─────────────────────────────────────────────────┘
```

### 相が不明な場合の動作

1. **単一変異のみ** → 相の概念なし（そのまま計算）
2. **複数変異あり + 相不明** → `unknown` として、Cis/Trans両方の可能性を組み換え率で重み付けして計算
3. **ユーザー明示指定** → その値を使用

### 表現型からの自動判定

| 表現型 | 判定可能な相 |
|--------|-------------|
| Lacewing（cin + ino 両方発現）| 少なくとも1本はCis (cin-ino) |
| Opaline-Ino（op + ino 両方発現）| 少なくとも1本はCis (op-ino) |
| 単一変異のみ発現 | 相の判定不可 |

---

## 計算ロジック設計

### 配偶子生成（オス）

連鎖グループごとに、組み換え率を考慮した配偶子頻度を計算。

```php
// 例: Cis配置 (cin-ino/++) の場合
// cin-ino: 3% 組み換え
$gametes = [
    ['cin' => 'cin', 'ino' => 'ino', 'op' => '+'] => 0.485,  // 親型
    ['cin' => '+',   'ino' => '+',   'op' => '+'] => 0.485,  // 親型
    ['cin' => 'cin', 'ino' => '+',   'op' => '+'] => 0.015,  // 組換え型
    ['cin' => '+',   'ino' => 'ino', 'op' => '+'] => 0.015,  // 組換え型
];
```

### 配偶子生成（メス）

Z染色体が1本のため、組み換えなし。そのままのハプロタイプが配偶子になる。

```php
// メス Z: [cin, +, op] の場合
$gametes = [
    ['cin' => 'cin', 'ino' => '+', 'op' => 'op'] => 0.5,  // Z染色体
    'W' => 0.5,  // W染色体
];
```

### 3座位の組み換え計算

cin-ino-op の3座位が絡む場合、2重組み換えも考慮。

```
単一組み換え:
- cin-ino 間: 3%
- ino-op 間: 30%

2重組み換え:
- cin-ino 間 AND ino-op 間: 3% × 30% = 0.9%
```

---

## 実装フェーズ

### Phase 1: データ構造移行（SSOT）
- [ ] genetics.php に LINKAGE_GROUPS 定数追加
- [ ] genetics.php に RECOMBINATION_RATES 定数追加
- [ ] birds.js のデータ構造を新形式に移行（Z_linked, autosomal_1）
- [ ] 既存データのマイグレーション関数作成

### Phase 2: 共通エンジン実装
- [ ] GametesGenerator クラス新規作成
  - [ ] generateFromHaplotype() - ハプロタイプから配偶子確率分布
  - [ ] applyRecombination() - 組み換え率適用
  - [ ] handleDoubleRecombination() - 二重組み換え処理
- [ ] 配偶子生成の単体テスト

### Phase 3: 親→子 計算 (GeneticsCalculator)
- [ ] calcLinkedSLR_Male() 新規作成（3座位同時処理）
- [ ] calcLinkedSLR_Female() 新規作成
- [ ] calcLinkedAutosomal() 新規作成（dark-parblue）
- [ ] calculateOffspring() の改修
- [ ] 計算結果の検証（文献値との照合）

### Phase 4: 子→親 推論 (FamilyEstimatorV3)
- [ ] 相の推論ロジック追加
- [ ] 子の表現型分布からの相の逆推論
- [ ] 表現型からの自動判定（Lacewing→Cis確定等）
- [ ] 信頼度計算の更新

### Phase 5: 経路探索 (PathFinder)
- [ ] 相を考慮した経路コスト計算
- [ ] Cis/Trans別の世代数推定
- [ ] 「Cis個体入手」を中間ステップとして提案
- [ ] 期待羽数（何羽で目標が得られるか）の計算

### Phase 6: 最適ペア選定 (Planner)
- [ ] 手持ち個体の相を評価
- [ ] 相に基づくペアリングスコア計算
- [ ] 「Cis個体を優先使用」の推奨ロジック
- [ ] 不明な相の場合の両方向計算

### Phase 7: UI実装
- [ ] index.php に相の入力UI追加
- [ ] 手動指定モード（Z1/Z2のドロップダウン）
- [ ] 家系推論モード（ボタンで推論結果を反映）
- [ ] 相の表示（Cis/Trans のビジュアル表現）

### Phase 8: テストとリリース
- [ ] 全4エンジンの統合テスト
- [ ] 文献値との照合（Lovebirds Compendium）
- [ ] ドキュメント更新
- [ ] CLAUDE.md 更新
- [ ] リリース

---

## テストケース

### Case 1: Cis配置 cin-ino/++ ♂ × 野生型 ♀

**期待される結果（3% 組み換え）:**

| 子孫 | 確率 |
|------|------|
| green/cin-ino (linked) ♂ | 24.25% |
| green ♂ | 24.25% |
| green/cin ♂ | 0.75% |
| green/ino ♂ | 0.75% |
| cin-ino (linked) ♀ | 24.25% |
| green ♀ | 24.25% |
| cin ♀ | 0.75% |
| ino ♀ | 0.75% |

### Case 2: Trans配置 cin-+/+-ino ♂ × 野生型 ♀

**期待される結果（3% 組み換え）:**

| 子孫 | 確率 |
|------|------|
| green/cin ♂ | 24.25% |
| green/ino ♂ | 24.25% |
| green/cin-ino (linked) ♂ | 0.75% |
| green ♂ | 0.75% |
| cin ♀ | 24.25% |
| ino ♀ | 24.25% |
| cin-ino (linked) ♀ | 0.75% |
| green ♀ | 0.75% |

### Case 3: ino-op連鎖（30%組み換え）

Lovebirds Compendium p.230-231 の例に準拠。

**Trans配置 +ino/op+ ♂ × 野生型 ♀:**

| 子孫 | 確率 |
|------|------|
| green/ino ♂ | 17.5% |
| green/op ♂ | 17.5% |
| green ♂ | 7.5% |
| green/ino-op (linked) ♂ | 7.5% |
| ino ♀ | 17.5% |
| op ♀ | 17.5% |
| green ♀ | 7.5% |
| ino-op (linked) ♀ | 7.5% |

---

## 特記事項

- 組換え率はラブバード（Agapornis roseicollis）固有
- セキセイインコの cinnamon-ino は 46.1%（異なる）
- 他種への移植時は組換え率の再調査が必要

---

## ステータス

### 設計フェーズ ✅
- [x] 組み換え率の文献調査（Lovebirds Compendium p.228-231）
- [x] 相（Phase）の概念設計
- [x] データ構造設計（ハプロタイプベース）
- [x] UI設計（手動指定 + 自動推論）
- [x] 計算ロジック設計（GametesGenerator）
- [x] 影響範囲の特定（4エンジン: Calculator, Estimator, PathFinder, Planner）
- [x] v6.8 整合性検証（全31テストパス）

### 実装フェーズ 🔲
- [ ] Phase 1: データ構造移行（SSOT）
- [ ] Phase 2: 共通エンジン実装（GametesGenerator）
- [ ] Phase 3: 親→子 計算（GeneticsCalculator）
- [ ] Phase 4: 子→親 推論（FamilyEstimatorV3）
- [ ] Phase 5: 経路探索（PathFinder）
- [ ] Phase 6: 最適ペア選定（Planner）
- [ ] Phase 7: UI実装
- [ ] Phase 8: テストとリリース
