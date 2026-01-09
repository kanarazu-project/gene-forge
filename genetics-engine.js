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
     * ハプロタイプデータモデル v7.0
     *
     * 連鎖座位のアレルを染色体単位で管理
     *
     * ## Z染色体（伴性遺伝子座）
     * - 座位順序: [cinnamon, ino, opaline]
     * - オス(ZZ): 2本のハプロタイプ
     * - メス(ZW): 1本のハプロタイプ（W染色体は遺伝子なし）
     *
     * ## 常染色体連鎖群1
     * - 座位順序: [dark, parblue]
     * - 両性とも: 2本のハプロタイプ
     *
     * ## 相（Phase）
     * - cis（シス）: 変異が同一染色体上 → 連鎖遺伝
     * - trans（トランス）: 変異が異なる染色体上 → 組換えで連鎖型出現
     *
     * @example オス cinnamon/ino ダブルスプリット（cis相）
     * {
     *   Z_haplotypes: [
     *     { cinnamon: 'cin', ino: 'ino', opaline: '+' },  // Z¹: cin-ino 連鎖
     *     { cinnamon: '+', ino: '+', opaline: '+' }       // Z²: 野生型
     *   ],
     *   phase: 'cis'
     * }
     *
     * @example オス cinnamon/ino ダブルスプリット（trans相）
     * {
     *   Z_haplotypes: [
     *     { cinnamon: 'cin', ino: '+', opaline: '+' },    // Z¹: cin のみ
     *     { cinnamon: '+', ino: 'ino', opaline: '+' }     // Z²: ino のみ
     *   ],
     *   phase: 'trans'
     * }
     *
     * @example メス cinnamon ino（ヘミ接合）
     * {
     *   Z_haplotypes: [
     *     { cinnamon: 'cin', ino: 'ino', opaline: '+' }   // Z: 唯一のZ染色体
     *   ],
     *   phase: null  // メスは相の概念なし
     * }
     */
    HAPLOTYPE_MODEL: {
        // Z染色体連鎖群の座位順序
        Z_LOCI_ORDER: ['cinnamon', 'ino', 'opaline'],

        // 常染色体連鎖群1の座位順序
        AUTOSOMAL_1_LOCI_ORDER: ['dark', 'parblue'],

        // 野生型アレル定義
        WILDTYPE: {
            cinnamon: '+',
            ino: '+',
            opaline: '+',
            dark: 'd',
            parblue: '+',
        },

        // 変異型アレル（座位ごとの可能なアレル）
        MUTANT_ALLELES: {
            cinnamon: ['cin'],
            ino: ['ino', 'pld'],      // 複対立: ino > pld > +
            opaline: ['op'],
            dark: ['D'],              // 不完全優性
            parblue: ['aq', 'tq'],    // 複対立: aq, tq
        },
    },

    /**
     * 空のハプロタイプを生成
     * @param {string} group - 連鎖グループ ('Z_chromosome' | 'autosomal_1')
     * @returns {Object} 野生型ハプロタイプ
     */
    createEmptyHaplotype(group) {
        const lociOrder = group === 'Z_chromosome'
            ? this.HAPLOTYPE_MODEL.Z_LOCI_ORDER
            : this.HAPLOTYPE_MODEL.AUTOSOMAL_1_LOCI_ORDER;

        const haplotype = {};
        for (const locus of lociOrder) {
            haplotype[locus] = this.HAPLOTYPE_MODEL.WILDTYPE[locus];
        }
        return haplotype;
    },

    /**
     * ハプロタイプセットを生成
     * @param {string} sex - 性別 ('male' | 'female')
     * @param {string} group - 連鎖グループ
     * @returns {Object} { haplotypes: [], phase: null }
     */
    createHaplotypeSet(sex, group = 'Z_chromosome') {
        const count = (group === 'Z_chromosome' && sex === 'female') ? 1 : 2;
        const haplotypes = [];

        for (let i = 0; i < count; i++) {
            haplotypes.push(this.createEmptyHaplotype(group));
        }

        return {
            haplotypes,
            phase: count === 2 ? 'unknown' : null,  // メスは相なし
        };
    },

    /**
     * 従来の遺伝子型からハプロタイプセットに変換
     * @param {Object} genotype - 従来形式の遺伝子型
     * @param {string} sex - 性別
     * @param {string} phase - 相 ('cis' | 'trans' | 'unknown')
     * @returns {Object} ハプロタイプセット
     */
    genotypeToHaplotypes(genotype, sex, phase = 'unknown') {
        const result = {
            Z_chromosome: this.createHaplotypeSet(sex, 'Z_chromosome'),
            autosomal_1: this.createHaplotypeSet(sex, 'autosomal_1'),
        };

        // Z染色体連鎖群の変換
        this._convertToHaplotype(
            genotype,
            result.Z_chromosome,
            this.HAPLOTYPE_MODEL.Z_LOCI_ORDER,
            sex,
            phase
        );

        // 常染色体連鎖群1の変換
        this._convertToHaplotype(
            genotype,
            result.autosomal_1,
            this.HAPLOTYPE_MODEL.AUTOSOMAL_1_LOCI_ORDER,
            sex,
            phase
        );

        return result;
    },

    /**
     * ハプロタイプ変換の内部処理
     * @private
     */
    _convertToHaplotype(genotype, haplotypeSet, lociOrder, sex, phase) {
        for (const locus of lociOrder) {
            const alleleStr = genotype[locus];
            if (!alleleStr) continue;

            const alleles = this._parseAlleleString(alleleStr, locus, sex);
            if (!alleles) continue;

            if (haplotypeSet.haplotypes.length === 1) {
                // メス（ヘミ接合）: 1本のハプロタイプ
                haplotypeSet.haplotypes[0][locus] = alleles[0];
            } else {
                // オスまたは常染色体: 2本のハプロタイプ
                haplotypeSet.haplotypes[0][locus] = alleles[0];
                haplotypeSet.haplotypes[1][locus] = alleles[1] || this.HAPLOTYPE_MODEL.WILDTYPE[locus];
            }
        }

        haplotypeSet.phase = haplotypeSet.haplotypes.length === 2 ? phase : null;
    },

    /**
     * アレル文字列をパース
     * @private
     * @param {string} alleleStr - 例: 'cincin', '+cin', 'cinW', 'DD', 'Dd'
     * @param {string} locus - 座位名
     * @param {string} sex - 性別
     * @returns {Array} [allele1, allele2] または [allele1] (ヘミ接合)
     */
    _parseAlleleString(alleleStr, locus, sex) {
        if (!alleleStr) return null;

        const wildtype = this.HAPLOTYPE_MODEL.WILDTYPE[locus];

        // 伴性遺伝子座（cinnamon, ino, opaline）
        if (['cinnamon', 'ino', 'opaline'].includes(locus)) {
            // ヘミ接合（メス）
            if (alleleStr.endsWith('W')) {
                const mutant = alleleStr.replace('W', '');
                return [mutant || wildtype];
            }
            // ホモ接合（例: cincin, opop, inoino）
            if (/^(\w+)\1$/.test(alleleStr)) {
                const mutant = alleleStr.slice(0, alleleStr.length / 2);
                return [mutant, mutant];
            }
            // ヘテロ接合（例: +cin, +op, +ino）
            if (alleleStr.startsWith('+')) {
                const mutant = alleleStr.slice(1);
                return [wildtype, mutant];
            }
            // 複合ヘテロ（ino座位: inopld）
            if (locus === 'ino' && alleleStr === 'inopld') {
                return ['ino', 'pld'];
            }
            // 野生型
            if (alleleStr === '++' || alleleStr === '+W') {
                return sex === 'female' ? [wildtype] : [wildtype, wildtype];
            }
        }

        // dark座位（不完全優性）
        if (locus === 'dark') {
            if (alleleStr === 'DD') return ['D', 'D'];
            if (alleleStr === 'Dd') return ['D', 'd'];
            if (alleleStr === 'dd') return ['d', 'd'];
        }

        // parblue座位（複対立）
        if (locus === 'parblue') {
            if (alleleStr === 'aqaq') return ['aq', 'aq'];
            if (alleleStr === 'tqtq') return ['tq', 'tq'];
            if (alleleStr === 'tqaq' || alleleStr === 'aqtq') return ['tq', 'aq'];
            if (alleleStr === '+aq') return ['+', 'aq'];
            if (alleleStr === '+tq') return ['+', 'tq'];
            if (alleleStr === '++') return ['+', '+'];
        }

        return null;
    },

    /**
     * ハプロタイプセットから従来の遺伝子型に変換
     * @param {Object} haplotypeData - ハプロタイプセット
     * @param {string} sex - 性別
     * @returns {Object} 従来形式の遺伝子型
     */
    haplotypesToGenotype(haplotypeData, sex) {
        const genotype = {};

        // Z染色体連鎖群
        if (haplotypeData.Z_chromosome) {
            const haps = haplotypeData.Z_chromosome.haplotypes;
            for (const locus of this.HAPLOTYPE_MODEL.Z_LOCI_ORDER) {
                genotype[locus] = this._formatAlleleFromHaplotypes(
                    haps, locus, sex, 'Z_chromosome'
                );
            }
        }

        // 常染色体連鎖群1
        if (haplotypeData.autosomal_1) {
            const haps = haplotypeData.autosomal_1.haplotypes;
            for (const locus of this.HAPLOTYPE_MODEL.AUTOSOMAL_1_LOCI_ORDER) {
                genotype[locus] = this._formatAlleleFromHaplotypes(
                    haps, locus, sex, 'autosomal_1'
                );
            }
        }

        return genotype;
    },

    /**
     * ハプロタイプからアレル文字列を生成
     * @private
     */
    _formatAlleleFromHaplotypes(haplotypes, locus, sex, group) {
        const wildtype = this.HAPLOTYPE_MODEL.WILDTYPE[locus];

        if (haplotypes.length === 1) {
            // ヘミ接合（メス Z染色体）
            const allele = haplotypes[0][locus] || wildtype;
            return allele === wildtype ? '+W' : `${allele}W`;
        }

        const a1 = haplotypes[0][locus] || wildtype;
        const a2 = haplotypes[1][locus] || wildtype;

        // 伴性・常染色体共通の整形
        if (['cinnamon', 'ino', 'opaline'].includes(locus)) {
            if (a1 === wildtype && a2 === wildtype) return '++';
            if (a1 === a2) return `${a1}${a1}`;  // ホモ
            if (a1 === wildtype) return `+${a2}`;
            if (a2 === wildtype) return `+${a1}`;
            return `${a1}${a2}`;  // 複合ヘテロ
        }

        if (locus === 'dark') {
            return `${a1}${a2}`;  // DD, Dd, dd
        }

        if (locus === 'parblue') {
            if (a1 === '+' && a2 === '+') return '++';
            if (a1 === a2) return `${a1}${a1}`;
            if (a1 === '+') return `+${a2}`;
            if (a2 === '+') return `+${a1}`;
            // tq > aq の優先度で表記
            return a1 === 'tq' ? `${a1}${a2}` : `${a2}${a1}`;
        }

        return '++';
    },

    /**
     * 相（phase）を推定
     * 2つ以上の変異が同一連鎖群にある場合、cis/trans を判定
     * @param {Object} haplotypeSet - ハプロタイプセット
     * @returns {string} 'cis' | 'trans' | 'homozygous' | 'single' | null
     */
    inferPhase(haplotypeSet) {
        if (!haplotypeSet || haplotypeSet.haplotypes.length < 2) {
            return null;  // ヘミ接合（メス）は相なし
        }

        const [hap1, hap2] = haplotypeSet.haplotypes;
        const loci = Object.keys(hap1);

        // 各座位の変異状態をカウント
        let mutantLoci1 = [];  // hap1の変異座位
        let mutantLoci2 = [];  // hap2の変異座位

        for (const locus of loci) {
            const wildtype = this.HAPLOTYPE_MODEL.WILDTYPE[locus];
            if (hap1[locus] !== wildtype) mutantLoci1.push(locus);
            if (hap2[locus] !== wildtype) mutantLoci2.push(locus);
        }

        // 変異が1つ以下なら相の概念なし
        const totalMutants = new Set([...mutantLoci1, ...mutantLoci2]).size;
        if (totalMutants <= 1) return 'single';

        // 両ハプロタイプが同一なら homozygous
        if (mutantLoci1.length === mutantLoci2.length &&
            mutantLoci1.every(l => mutantLoci2.includes(l))) {
            return 'homozygous';
        }

        // 複数変異が同一ハプロタイプに集中 → cis
        if (mutantLoci1.length >= 2 && mutantLoci2.length === 0) return 'cis';
        if (mutantLoci2.length >= 2 && mutantLoci1.length === 0) return 'cis';

        // 変異が両ハプロタイプに分散 → trans
        if (mutantLoci1.length >= 1 && mutantLoci2.length >= 1) {
            // 重複がなければ明確に trans
            const overlap = mutantLoci1.filter(l => mutantLoci2.includes(l));
            if (overlap.length === 0) return 'trans';
        }

        return 'unknown';
    },

    /**
     * 配偶子（gamete）頻度を計算
     * 連鎖と組換えを考慮した配偶子生成
     * @param {Object} haplotypeSet - ハプロタイプセット
     * @param {string} group - 連鎖グループ名
     * @returns {Array} [{ haplotype: {...}, frequency: 0.485 }, ...]
     */
    calculateGameteFrequencies(haplotypeSet, group = 'Z_chromosome') {
        if (!haplotypeSet || haplotypeSet.haplotypes.length < 2) {
            // ヘミ接合: 1種類の配偶子のみ（組換えなし）
            return [{
                haplotype: haplotypeSet.haplotypes[0],
                frequency: 1.0,
            }];
        }

        const [hap1, hap2] = haplotypeSet.haplotypes;
        const lociOrder = group === 'Z_chromosome'
            ? this.HAPLOTYPE_MODEL.Z_LOCI_ORDER
            : this.HAPLOTYPE_MODEL.AUTOSOMAL_1_LOCI_ORDER;

        // 単純ケース: 連鎖座位が2つの場合
        if (lociOrder.length === 2) {
            return this._calculateTwoLocusGametes(hap1, hap2, lociOrder, group);
        }

        // Z染色体: 3座位（cinnamon, ino, opaline）
        return this._calculateThreeLocusGametes(hap1, hap2, lociOrder, group);
    },

    /**
     * 2座位の配偶子頻度計算
     * @private
     */
    _calculateTwoLocusGametes(hap1, hap2, lociOrder, group) {
        const [locus1, locus2] = lociOrder;
        const recombRate = this.getRecombinationRate(locus1, locus2) || 0.5;

        // 親型配偶子: 1 - r
        const parentalFreq = (1 - recombRate) / 2;
        // 組換え型配偶子: r
        const recombFreq = recombRate / 2;

        const gametes = [
            // 親型1: hap1そのまま
            { haplotype: { ...hap1 }, frequency: parentalFreq },
            // 親型2: hap2そのまま
            { haplotype: { ...hap2 }, frequency: parentalFreq },
            // 組換え型1: hap1[locus1] + hap2[locus2]
            {
                haplotype: { [locus1]: hap1[locus1], [locus2]: hap2[locus2] },
                frequency: recombFreq
            },
            // 組換え型2: hap2[locus1] + hap1[locus2]
            {
                haplotype: { [locus1]: hap2[locus1], [locus2]: hap1[locus2] },
                frequency: recombFreq
            },
        ];

        // 重複ハプロタイプをマージ
        return this._mergeIdenticalGametes(gametes);
    },

    /**
     * 3座位の配偶子頻度計算（Z染色体用）
     * cin-ino: 3%, ino-op: 30%, cin-op: 33%
     * @private
     */
    _calculateThreeLocusGametes(hap1, hap2, lociOrder, group) {
        // 各区間の組換え率
        const r_cin_ino = this.getRecombinationRate('cinnamon', 'ino') || 0.03;
        const r_ino_op = this.getRecombinationRate('ino', 'opaline') || 0.30;

        // 干渉なし（独立）の仮定で二重組換え率を計算
        const r_double = r_cin_ino * r_ino_op;

        // 配偶子クラスの頻度
        // 親型: (1 - r₁)(1 - r₂)
        // 単一組換え（cin-ino間）: r₁(1 - r₂)
        // 単一組換え（ino-op間）: (1 - r₁)r₂
        // 二重組換え: r₁r₂

        const freqParental = (1 - r_cin_ino) * (1 - r_ino_op) / 2;
        const freqRecomb1 = r_cin_ino * (1 - r_ino_op) / 2;
        const freqRecomb2 = (1 - r_cin_ino) * r_ino_op / 2;
        const freqDouble = r_double / 2;

        const gametes = [];

        // 親型配偶子
        gametes.push({ haplotype: { ...hap1 }, frequency: freqParental });
        gametes.push({ haplotype: { ...hap2 }, frequency: freqParental });

        // 単一組換え（cin-ino間）: cinのみ入れ替え
        gametes.push({
            haplotype: { cinnamon: hap2.cinnamon, ino: hap1.ino, opaline: hap1.opaline },
            frequency: freqRecomb1
        });
        gametes.push({
            haplotype: { cinnamon: hap1.cinnamon, ino: hap2.ino, opaline: hap2.opaline },
            frequency: freqRecomb1
        });

        // 単一組換え（ino-op間）: opのみ入れ替え
        gametes.push({
            haplotype: { cinnamon: hap1.cinnamon, ino: hap1.ino, opaline: hap2.opaline },
            frequency: freqRecomb2
        });
        gametes.push({
            haplotype: { cinnamon: hap2.cinnamon, ino: hap2.ino, opaline: hap1.opaline },
            frequency: freqRecomb2
        });

        // 二重組換え: cin, op入れ替え（inoはそのまま）
        gametes.push({
            haplotype: { cinnamon: hap2.cinnamon, ino: hap1.ino, opaline: hap2.opaline },
            frequency: freqDouble
        });
        gametes.push({
            haplotype: { cinnamon: hap1.cinnamon, ino: hap2.ino, opaline: hap1.opaline },
            frequency: freqDouble
        });

        return this._mergeIdenticalGametes(gametes);
    },

    /**
     * 同一ハプロタイプの配偶子をマージ
     * @private
     */
    _mergeIdenticalGametes(gametes) {
        const merged = new Map();

        for (const gamete of gametes) {
            const key = JSON.stringify(gamete.haplotype);
            if (merged.has(key)) {
                merged.get(key).frequency += gamete.frequency;
            } else {
                merged.set(key, { ...gamete });
            }
        }

        return Array.from(merged.values())
            .filter(g => g.frequency > 0.0001)  // 極小頻度は除外
            .sort((a, b) => b.frequency - a.frequency);
    },

    /**
     * ハプロタイプを人間可読形式で表示
     * @param {Object} haplotype - ハプロタイプオブジェクト
     * @param {string} group - 連鎖グループ
     * @returns {string} 例: "cin-ino-+" または "D-aq"
     */
    formatHaplotype(haplotype, group = 'Z_chromosome') {
        const lociOrder = group === 'Z_chromosome'
            ? this.HAPLOTYPE_MODEL.Z_LOCI_ORDER
            : this.HAPLOTYPE_MODEL.AUTOSOMAL_1_LOCI_ORDER;

        const parts = lociOrder.map(locus => {
            const allele = haplotype[locus];
            const wildtype = this.HAPLOTYPE_MODEL.WILDTYPE[locus];
            return allele === wildtype ? '+' : allele;
        });

        return parts.join('-');
    },

    /**
     * ハプロタイプセットを人間可読形式で表示
     * @param {Object} haplotypeSet - ハプロタイプセット
     * @param {string} group - 連鎖グループ
     * @returns {string} 例: "[cin-ino-+]/[+-+-+]" または "[cin-ino-+]W"
     */
    formatHaplotypeSet(haplotypeSet, group = 'Z_chromosome') {
        if (!haplotypeSet || !haplotypeSet.haplotypes) return '';

        const haps = haplotypeSet.haplotypes;

        if (haps.length === 1) {
            // ヘミ接合（メス）
            return `[${this.formatHaplotype(haps[0], group)}]W`;
        }

        const h1 = this.formatHaplotype(haps[0], group);
        const h2 = this.formatHaplotype(haps[1], group);

        const phase = haplotypeSet.phase;
        const phaseIndicator = phase === 'cis' ? '(cis)' :
                               phase === 'trans' ? '(trans)' : '';

        return `[${h1}]/[${h2}]${phaseIndicator}`;
    },

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
