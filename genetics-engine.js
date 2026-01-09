/**
 * Gene-Forge v7.0 GeneticsEngine
 * 遺伝計算エンジン（SSOT準拠）
 *
 * 三層アーキテクチャ:
 * 1. 内部データ層: LOCI_MASTER キー準拠（cinnamon, opaline, etc.）
 * 2. 変換層: 本ファイル（GeneticsEngine）
 * 3. UI表示層: ブリーダー向け短縮表記（cin, op, etc.）
 *
 * @author Sirius / Shohei Taniguchi
 * @license CC BY-NC-SA 4.0
 */

const GeneticsEngine = {
    VERSION: '7.0.0',

    // ========================================
    // キーマッピング定数
    // ========================================

    /**
     * SSOT準拠キー → 短縮表記キー
     * genetics.php の LOCI キーを正規とする
     */
    LOCUS_TO_SHORT: {
        // 常染色体
        parblue: 'parblue',      // 変換なし
        dark: 'dark',            // 変換なし
        violet: 'vio',
        fallow_pale: 'flp',      // v7.0: 分離
        fallow_bronze: 'flb',    // v7.0: 分離
        pied_dom: 'Pi',          // v7.0: 分離（優性Pi）
        pied_rec: 'pi',          // v7.0: 分離（劣性pi）
        dilute: 'dil',
        edged: 'ed',
        orangeface: 'of',
        pale_headed: 'ph',
        // 伴性（Z染色体）
        ino: 'ino',              // 変換なし
        opaline: 'op',
        cinnamon: 'cin',
    },

    /**
     * 短縮表記キー → SSOT準拠キー
     * 逆引き辞書
     */
    SHORT_TO_LOCUS: null,  // 初期化時に生成

    /**
     * 旧キー → SSOT キー（後方互換）
     * birds.js の旧データ形式からの変換用
     */
    LEGACY_KEY_MAP: {
        // 旧短縮キー
        cin: 'cinnamon',
        op: 'opaline',
        vio: 'violet',
        dil: 'dilute',
        // 旧fallowキー（未分化）→ デフォルトでpale
        fl: 'fallow_pale',
        // 旧piedキー（未分化）→ デフォルトでrec
        pi: 'pied_rec',
    },

    /**
     * アレル表記の短縮形マッピング
     * ブリーダー表記 ↔ 内部表記
     */
    ALLELE_NOTATION: {
        // 伴性遺伝子座（オス ZZ / メス ZW）
        cinnamon: {
            homozygous: 'cincin',      // ホモ接合（発現）
            hemizygous: 'cinW',        // ヘミ接合（メス・発現）
            heterozygous: '+cin',      // ヘテロ（スプリット）
            wildtype_male: '++',
            wildtype_female: '+W',
        },
        opaline: {
            homozygous: 'opop',
            hemizygous: 'opW',
            heterozygous: '+op',
            wildtype_male: '++',
            wildtype_female: '+W',
        },
        ino: {
            // 複対立遺伝子: ino > pld > +
            ino_homo: 'inoino',
            ino_hemi: 'inoW',
            pld_homo: 'pldpld',
            pld_hemi: 'pldW',
            ino_pld: 'inopld',        // 複合ヘテロ
            ino_split: '+ino',
            pld_split: '+pld',
            wildtype_male: '++',
            wildtype_female: '+W',
        },
        // 常染色体
        dark: {
            DD: 'DD',                  // ダブルダーク
            Dd: 'Dd',                  // シングルダーク
            dd: 'dd',                  // 野生型
        },
        violet: {
            VV: 'VV',                  // ダブルバイオレット
            Vv: 'Vv',                  // シングルバイオレット
            vv: 'vv',                  // 野生型
        },
        parblue: {
            aqaq: 'aqaq',              // アクアホモ
            tqtq: 'tqtq',              // ターコイズホモ
            tqaq: 'tqaq',              // シーグリーン（複合）
            '+aq': '+aq',              // アクアスプリット
            '+tq': '+tq',              // ターコイズスプリット
            '++': '++',                // 野生型
        },
    },

    // ========================================
    // 初期化
    // ========================================

    init() {
        // 逆引き辞書を生成
        this.SHORT_TO_LOCUS = {};
        for (const [locus, short] of Object.entries(this.LOCUS_TO_SHORT)) {
            this.SHORT_TO_LOCUS[short] = locus;
        }

        console.log('[GeneticsEngine] v' + this.VERSION + ' initialized');
        return this;
    },

    // ========================================
    // キー変換関数
    // ========================================

    /**
     * SSOT座位キー → 短縮表記
     * @param {string} locusKey - SSOT準拠キー（例: 'cinnamon'）
     * @returns {string} 短縮表記（例: 'cin'）
     */
    toShort(locusKey) {
        return this.LOCUS_TO_SHORT[locusKey] || locusKey;
    },

    /**
     * 短縮表記 → SSOT座位キー
     * @param {string} shortKey - 短縮キー（例: 'cin'）
     * @returns {string} SSOT準拠キー（例: 'cinnamon'）
     */
    toLocus(shortKey) {
        // まず新形式の逆引きを試行
        if (this.SHORT_TO_LOCUS && this.SHORT_TO_LOCUS[shortKey]) {
            return this.SHORT_TO_LOCUS[shortKey];
        }
        // 旧形式からの変換
        if (this.LEGACY_KEY_MAP[shortKey]) {
            return this.LEGACY_KEY_MAP[shortKey];
        }
        // 変換不要（すでにSSOT形式）
        return shortKey;
    },

    /**
     * 遺伝子型オブジェクトを SSOT キーに正規化
     * @param {Object} genotype - 旧形式の遺伝子型
     * @returns {Object} SSOT準拠の遺伝子型
     */
    normalizeGenotype(genotype) {
        if (!genotype) return {};

        const normalized = {};
        for (const [key, value] of Object.entries(genotype)) {
            const locusKey = this.toLocus(key);

            // Boolean値の変換（旧形式: { cin: true }）
            if (typeof value === 'boolean') {
                // 伴性遺伝子座のBoolean → アレル表記に変換
                // 注意: 性別情報が必要なため、デフォルトはオス想定
                if (value === true) {
                    normalized[locusKey] = this._booleanToAllele(locusKey, 'male');
                }
                // false は野生型なので省略可
            } else {
                normalized[locusKey] = value;
            }
        }

        return normalized;
    },

    /**
     * Boolean値をアレル表記に変換
     * @private
     */
    _booleanToAllele(locusKey, sex) {
        const notation = this.ALLELE_NOTATION[locusKey];
        if (!notation) return null;

        // 伴性遺伝子座
        if (['cinnamon', 'opaline'].includes(locusKey)) {
            return sex === 'female' ? notation.hemizygous : notation.homozygous;
        }
        // ino座位
        if (locusKey === 'ino') {
            return sex === 'female' ? notation.ino_hemi : notation.ino_homo;
        }

        return null;
    },

    // ========================================
    // 表現型名取得（SSOT参照）
    // ========================================

    /**
     * 色キーから表現型名を取得
     * @param {string} colorKey - 色キー（例: 'cinnamon_aqua'）
     * @param {string} lang - 言語コード（'ja', 'en', 'albs'）
     * @returns {string} 表現型名
     */
    getColorName(colorKey, lang = 'ja') {
        // COLOR_MASTER（PHP注入）を参照
        if (typeof COLOR_MASTER !== 'undefined' && COLOR_MASTER[colorKey]) {
            return COLOR_MASTER[colorKey][lang] ||
                   COLOR_MASTER[colorKey].ja ||
                   COLOR_MASTER[colorKey].en ||
                   colorKey;
        }
        // COLOR_LABELS（レガシー）を参照
        if (typeof COLOR_LABELS !== 'undefined' && COLOR_LABELS[colorKey]) {
            return COLOR_LABELS[colorKey];
        }
        return colorKey;
    },

    /**
     * 座位キーから座位名を取得
     * @param {string} locusKey - 座位キー（例: 'cinnamon'）
     * @param {string} lang - 言語コード
     * @returns {string} 座位名
     */
    getLocusName(locusKey, lang = 'ja') {
        if (typeof LOCI_MASTER !== 'undefined' && LOCI_MASTER[locusKey]) {
            const name = LOCI_MASTER[locusKey].name;
            return name?.[lang] || name?.ja || name?.en || locusKey;
        }
        return locusKey;
    },

    // ========================================
    // ブリーダー向け遺伝子型表記
    // ========================================

    /**
     * 遺伝子型オブジェクトをブリーダー表記に変換
     * @param {Object} genotype - SSOT準拠の遺伝子型
     * @param {string} sex - 性別 ('male' | 'female')
     * @returns {string} ブリーダー表記（例: '+aq/+cin/Dd'）
     */
    formatGenotype(genotype, sex = 'male') {
        if (!genotype) return '';

        const parts = [];
        const normalized = this.normalizeGenotype(genotype);

        // 表示順序（重要な座位から）
        const displayOrder = [
            'parblue', 'dark', 'violet',
            'ino', 'opaline', 'cinnamon',
            'fallow_pale', 'fallow_bronze',
            'pied_dom', 'pied_rec',
            'dilute', 'edged', 'orangeface', 'pale_headed'
        ];

        for (const locus of displayOrder) {
            const allele = normalized[locus];
            if (!allele || this._isWildtype(allele, locus, sex)) continue;

            parts.push(this._formatAllele(allele, locus));
        }

        return parts.join('/') || '野生型';
    },

    /**
     * 野生型かどうか判定
     * @private
     */
    _isWildtype(allele, locus, sex) {
        const wildtypes = ['++', '+W', 'dd', 'vv'];
        return wildtypes.includes(allele);
    },

    /**
     * 単一アレルをフォーマット
     * @private
     */
    _formatAllele(allele, locus) {
        // 短縮形で返す
        const short = this.toShort(locus);

        // 特殊ケース: parblue は allele そのまま
        if (locus === 'parblue') return allele;
        // dark, violet も allele そのまま
        if (['dark', 'violet'].includes(locus)) return allele;

        return allele;
    },

    // ========================================
    // 個体表示ラベル生成
    // ========================================

    /**
     * 個体の表示ラベルを生成
     * @param {Object} bird - 個体データ
     * @param {Object} options - オプション
     * @returns {string} 表示ラベル
     */
    formatBirdLabel(bird, options = {}) {
        const lang = options.lang || 'ja';
        const showLineage = options.showLineage !== false;
        const showGenotype = options.showGenotype !== false;

        const parts = [];

        // 名前
        if (bird.name) parts.push(bird.name);

        // 表現型名
        const phenoName = bird.phenotype ||
                         this.getColorName(bird.observed?.baseColor, lang) ||
                         '不明';
        parts.push(phenoName);

        // 遺伝子型（括弧内）
        if (showGenotype && bird.genotype) {
            const genoStr = this.formatGenotype(bird.genotype, bird.sex);
            if (genoStr && genoStr !== '野生型') {
                parts.push(`(${genoStr})`);
            }
        }

        // 血統（角括弧内）
        if (showLineage && bird.lineage) {
            parts.push(`[${bird.lineage}]`);
        }

        return parts.join(' ');
    },

    // ========================================
    // v7.0 連鎖遺伝関連
    // ========================================

    /**
     * 連鎖グループ情報を取得
     * @returns {Object} LINKAGE_GROUPS
     */
    getLinkageGroups() {
        if (typeof LINKAGE_GROUPS !== 'undefined') {
            return LINKAGE_GROUPS;
        }
        // フォールバック定義
        return {
            Z_chromosome: {
                loci: ['cinnamon', 'ino', 'opaline'],
                recombination: {
                    cinnamon_ino: 0.03,
                    ino_opaline: 0.30,
                    cinnamon_opaline: 0.33,
                },
            },
            autosomal_1: {
                loci: ['dark', 'parblue'],
                recombination: {
                    dark_parblue: 0.07,
                },
            },
        };
    },

    /**
     * 2座位間の組換え率を取得
     * @param {string} locus1 - 座位1
     * @param {string} locus2 - 座位2
     * @returns {number|null} 組換え率（連鎖なしの場合 null）
     */
    getRecombinationRate(locus1, locus2) {
        const groups = this.getLinkageGroups();

        for (const group of Object.values(groups)) {
            if (!group.loci.includes(locus1) || !group.loci.includes(locus2)) {
                continue;
            }

            const key1 = `${locus1}_${locus2}`;
            const key2 = `${locus2}_${locus1}`;

            if (group.recombination[key1] !== undefined) {
                return group.recombination[key1];
            }
            if (group.recombination[key2] !== undefined) {
                return group.recombination[key2];
            }
        }

        return null;  // 連鎖なし（独立分離）
    },

    /**
     * 座位が連鎖グループに属するか判定
     * @param {string} locusKey - 座位キー
     * @returns {string|null} グループ名（属さない場合 null）
     */
    getLinkageGroup(locusKey) {
        const groups = this.getLinkageGroups();

        for (const [groupName, group] of Object.entries(groups)) {
            if (group.loci.includes(locusKey)) {
                return groupName;
            }
        }

        return null;
    },

    // ========================================
    // データマイグレーション
    // ========================================

    /**
     * 旧形式の個体データを v7.0 形式に変換
     * @param {Object} bird - 旧形式の個体データ
     * @returns {Object} v7.0形式の個体データ
     */
    migrateBirdData(bird) {
        if (!bird) return null;

        const migrated = { ...bird };

        // 遺伝子型の正規化
        if (bird.genotype) {
            migrated.genotype = this.normalizeGenotype(bird.genotype);
        }

        // 旧 fl → fallow_pale / fallow_bronze の判定
        // 注意: 旧データでは区別できないため、デフォルトで fallow_pale
        if (bird.genotype?.fl && !bird.genotype?.fallow_pale && !bird.genotype?.fallow_bronze) {
            migrated.genotype.fallow_pale = bird.genotype.fl;
            delete migrated.genotype.fl;
        }

        // 旧 pi → pied_rec / pied_dom の判定
        // 注意: 旧データでは区別できないため、デフォルトで pied_rec
        if (bird.genotype?.pi && !bird.genotype?.pied_rec && !bird.genotype?.pied_dom) {
            migrated.genotype.pied_rec = bird.genotype.pi;
            delete migrated.genotype.pi;
        }

        return migrated;
    },

    /**
     * 個体データベース全体をマイグレーション
     * @param {Array} birds - 旧形式の個体配列
     * @returns {Array} v7.0形式の個体配列
     */
    migrateDatabase(birds) {
        if (!Array.isArray(birds)) return [];
        return birds.map(bird => this.migrateBirdData(bird));
    },
};

// 初期化
GeneticsEngine.init();

// グローバル公開
if (typeof window !== 'undefined') {
    window.GeneticsEngine = GeneticsEngine;
}

console.log('[GeneticsEngine] v' + GeneticsEngine.VERSION + ' loaded (SSOT)');
