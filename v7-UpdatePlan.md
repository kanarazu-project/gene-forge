# Gene-Forge v7.0 計画: 連鎖遺伝実装

## 背景

現在の独立分離仮定を連鎖遺伝モデルに置き換える。

## 実装すべき組換え率

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

## 遺伝子の物理的配置（Z染色体上）

```
───[cinnamon]────[ino]─────────────────────────[opaline]───
      ←─ 3% ─→   ←────────── 30% ──────────→
      ←──────────────── 33% ────────────────→
```

cinnamonとinoは非常に近い。opalineは離れている。

## 現状の問題

現在のgenetics.phpはino, opaline, cinnamonを**独立した遺伝子座**として計算。
これは最大47ポイントの誤差を生む（cinnamon-inoペアの場合）。

## 実装方針

### 定数追加（AgapornisLociクラス内）

```php
public const LINKAGE_GROUPS = [
    'Z_chromosome' => [
        'loci' => ['cinnamon', 'ino', 'opaline'],
        'recombination' => [
            'cinnamon_ino' => 0.03,
            'cinnamon_opaline' => 0.33,
            'ino_opaline' => 0.30,
        ],
    ],
    'autosomal_1' => [
        'loci' => ['dark', 'parblue'],
        'recombination' => [
            'dark_parblue' => 0.07,
        ],
    ],
];
```

### 修正対象メソッド

1. `calcSLR_Male()` — 連鎖配偶子頻度を考慮
2. `calcSLR_Female()` — メスはヘミ接合なので組換えなし（変更少）
3. `calcAutosomal()` — dark-parblue連鎖対応
4. `calculateOffspring()` — 連鎖グループ単位の処理
5. `enumerateCombinations()` — 配偶子組み合わせロジック改修

### 注意点

- メスのZ染色体は1本（ヘミ接合）なので組換えは起きない
- オスのみ2本のZ染色体間で組換えが起きる
- 連鎖型配偶子と組換え型配偶子の頻度を正確に計算する必要あり

## 優先順位

1. **cinnamon-ino 3%** — 最重要。ほぼ完全連鎖
2. **dark-parblue 7%** — 常染色体で最も影響大
3. **ino-opaline 30%** / **cinnamon-opaline 33%** — 同時実装

## テストケース

### cinnamon-ino連鎖の検証

**交配:** cinnamon/ino ダブルスプリット ♂ × 野生型 ♀

**期待される結果（連鎖考慮）:**
- 48.5% cinnamon-ino連鎖型配偶子
- 48.5% 野生型配偶子
- 1.5% cinnamon単独（組換え）
- 1.5% ino単独（組換え）

**現状の計算（独立分離）:**
- 25% cinnamon+ino
- 25% cinnamonのみ
- 25% inoのみ
- 25% 野生型

## 特記事項

- 組換え率はラブバード固有（セキセイのcinnamon-inoは46.1%）

## ステータス

- [x] 設計完了
- [x] Phase 1: cinnamon-ino 3%
- [x] Phase 2: dark-parblue 7%
- [x] Phase 3: ino-opaline 30%, cinnamon-opaline 33%
- [ ] テスト
- [ ] リリース
