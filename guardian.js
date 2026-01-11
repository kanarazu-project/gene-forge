/**
 * Agapornis Gene-Forge v7.0
 * 虚弱体質回避ガードレール (Health Guardian)
 *
 * v7.0変更点:
 * - i18n: 不足していた翻訳キー追加（summary_no_breed, summary_caution）
 *
 * v6.7.5変更点:
 * - SSOT化: _getINOTypeName()をCOLOR_LABELS参照に変更
 * - genetics.phpのAgapornisLoci::labels()がSSOT
 * - INO/Creamino/Pure White の健康リスク管理強化
 * - parblue短縮形統一: bb→aqaq, tqb→tqaq, +b→+aq
 */

// ============================================================
// BreedingValidator - 近親交配制御システム
// ============================================================

const BreedingValidator = {
    
    // 閾値定義
    THRESHOLDS: {
        ABSOLUTE: 0.25,    // 親子・全兄弟（絶対禁止）
        HIGH_RISK: 0.125   // 半兄弟・祖父孫（計画モードで禁止）
    },
    
    // v7.0: 翻訳対応メッセージ取得
    _msg(key, fallback) {
        const T = window.T || {};
        return T[key] || fallback;
    },

    // メッセージ定義（翻訳キー対応）
    get MESSAGES() {
        return {
            DANGER: this._msg('bv_danger', 'Dangerous pairing. Reduced survival rate is inevitable.'),
            WARNING: this._msg('bv_warning', 'This pairing is considered taboo in competitive breeding'),
            SEX_MALE: this._msg('bv_sex_male', 'Please select a male for sire'),
            SEX_FEMALE: this._msg('bv_sex_female', 'Please select a female for dam'),
            SAME_BIRD: this._msg('bv_same_bird', 'Same individual'),
            PEDIGREE_CONFLICT: this._msg('bv_pedigree_conflict', 'This bird cannot be placed. Please manually modify the pedigree data.')
        };
    },
    
    /**
     * 交配の妥当性を検証
     * @param {Object} sire - 父個体
     * @param {Object} dam - 母個体
     * @param {string} mode - 'fact' | 'plan'
     * @returns {Object} { allowed, reason?, warning?, type? }
     */
    validate(sire, dam, mode = 'plan') {
        
        // ========================================
        // 事実矛盾チェック（両モード共通）
        // ========================================
        
        if (sire.sex !== 'male') {
            return { allowed: false, reason: this.MESSAGES.SEX_MALE, type: 'fact' };
        }
        if (dam.sex !== 'female') {
            return { allowed: false, reason: this.MESSAGES.SEX_FEMALE, type: 'fact' };
        }
        if (sire.id === dam.id) {
            return { allowed: false, reason: this.MESSAGES.SAME_BIRD, type: 'fact' };
        }
        
        // 循環参照チェック
        if (this._isAncestorOf(sire, dam) || this._isAncestorOf(dam, sire)) {
            return { allowed: false, reason: this.MESSAGES.PEDIGREE_CONFLICT, type: 'fact' };
        }
        
        // ========================================
        // 絶対禁止（両モードで阻止）
        // ========================================
        
        if (this._isParentChild(sire, dam)) {
            return { allowed: false, reason: this.MESSAGES.DANGER, type: 'absolute' };
        }
        if (this._isFullSibling(sire, dam)) {
            return { allowed: false, reason: this.MESSAGES.DANGER, type: 'absolute' };
        }
        
        // ========================================
        // 近交係数チェック
        // ========================================
        
        const ic = this.calcInbreedingCoefficient(sire, dam);
        
        // 25%以上（計算で検出された場合）
        if (ic >= this.THRESHOLDS.ABSOLUTE) {
            return { allowed: false, reason: this.MESSAGES.DANGER, type: 'absolute' };
        }
        
        // 12.5%以上
        if (ic >= this.THRESHOLDS.HIGH_RISK) {
            if (mode === 'fact') {
                return { allowed: true, warning: '⚠️ ' + this.MESSAGES.WARNING };
            } else {
                return { allowed: false, reason: this.MESSAGES.WARNING, type: 'ethics' };
            }
        }
        
        // ========================================
        // 通過
        // ========================================
        return { allowed: true };
    },
    
    /**
     * 遺伝情報推定の可否を判定
     * @param {string} mode - 'fact' | 'plan'
     * @returns {boolean}
     */
    canEstimateGenetics(mode) {
        return mode === 'plan';
    },
    
    /**
     * 近交係数を計算（Wright's F）
     * @param {Object} sire - 父個体
     * @param {Object} dam - 母個体
     * @returns {number} 近交係数（0.0 - 1.0）
     */
    calcInbreedingCoefficient(sire, dam) {
        const sireAncestors = this._getAncestorMap(sire);
        const damAncestors = this._getAncestorMap(dam);
        
        let ic = 0;
        for (const [id, sireGen] of Object.entries(sireAncestors)) {
            if (id && damAncestors[id]) {
                const damGen = damAncestors[id];
                // Wright's F: (1/2)^(n1+n2+1)
                ic += Math.pow(0.5, sireGen + damGen + 1);
            }
        }
        return ic;
    },
    
    /**
     * 近交係数の評価メッセージを取得
     * @param {number} ic - 近交係数
     * @returns {Object} { level, message }
     */
    evaluateInbreeding(ic) {
        if (ic >= this.THRESHOLDS.ABSOLUTE) {
            return { 
                level: 'danger', 
                message: this.MESSAGES.DANGER
            };
        }
        if (ic >= this.THRESHOLDS.HIGH_RISK) {
            return { 
                level: 'warning', 
                message: this.MESSAGES.WARNING
            };
        }
        return { level: 'ok', message: null };
    },
    
    // ========================================
    // 内部メソッド - 血縁関係判定
    // ========================================
    
    _isAncestorOf(ancestor, descendant) {
        if (!descendant.pedigree) return false;
        const ancestorIds = this._getAllAncestorIds(descendant);
        return ancestorIds.includes(ancestor.id);
    },
    
    _getAllAncestorIds(bird) {
        if (!bird.pedigree) return [];
        return [
            bird.pedigree.sire,
            bird.pedigree.dam,
            bird.pedigree.sire_sire,
            bird.pedigree.sire_dam,
            bird.pedigree.dam_sire,
            bird.pedigree.dam_dam,
            bird.pedigree.sire_sire_sire,
            bird.pedigree.sire_sire_dam,
            bird.pedigree.sire_dam_sire,
            bird.pedigree.sire_dam_dam,
            bird.pedigree.dam_sire_sire,
            bird.pedigree.dam_sire_dam,
            bird.pedigree.dam_dam_sire,
            bird.pedigree.dam_dam_dam
        ].filter(Boolean);
    },
    
    _isParentChild(sire, dam) {
        // sireがdamの親、またはdamがsireの親
        const sireParents = [sire.pedigree?.sire, sire.pedigree?.dam].filter(Boolean);
        const damParents = [dam.pedigree?.sire, dam.pedigree?.dam].filter(Boolean);
        
        return sireParents.includes(dam.id) || damParents.includes(sire.id);
    },
    
    _isFullSibling(sire, dam) {
        // 父母が両方同じ
        if (!sire.pedigree?.sire || !sire.pedigree?.dam) return false;
        if (!dam.pedigree?.sire || !dam.pedigree?.dam) return false;
        
        return sire.pedigree.sire === dam.pedigree.sire && 
               sire.pedigree.dam === dam.pedigree.dam;
    },
    
    _isHalfSibling(sire, dam) {
        // 父または母が同じ（全兄弟は除く）
        if (this._isFullSibling(sire, dam)) return false;
        
        const shareSire = sire.pedigree?.sire && sire.pedigree.sire === dam.pedigree?.sire;
        const shareDam = sire.pedigree?.dam && sire.pedigree.dam === dam.pedigree?.dam;
        
        return shareSire || shareDam;
    },
    
    _isGrandparentGrandchild(sire, dam) {
        // sireがdamの祖父母、またはdamがsireの祖父母
        const sireGrandparents = [
            sire.pedigree?.sire_sire, sire.pedigree?.sire_dam,
            sire.pedigree?.dam_sire, sire.pedigree?.dam_dam
        ].filter(Boolean);
        const damGrandparents = [
            dam.pedigree?.sire_sire, dam.pedigree?.sire_dam,
            dam.pedigree?.dam_sire, dam.pedigree?.dam_dam
        ].filter(Boolean);
        
        return sireGrandparents.includes(dam.id) || damGrandparents.includes(sire.id);
    },
    
    _isCousin(sire, dam) {
        // 祖父母を共有（親は共有しない）
        if (this._isHalfSibling(sire, dam)) return false;
        
        const sireGrandparents = [
            sire.pedigree?.sire_sire, sire.pedigree?.sire_dam,
            sire.pedigree?.dam_sire, sire.pedigree?.dam_dam
        ].filter(Boolean);
        const damGrandparents = [
            dam.pedigree?.sire_sire, dam.pedigree?.sire_dam,
            dam.pedigree?.dam_sire, dam.pedigree?.dam_dam
        ].filter(Boolean);
        
        return sireGrandparents.some(gp => damGrandparents.includes(gp));
    },
    
    // ========================================
    // 内部メソッド - 祖先マップ生成
    // ========================================
    
    _getAncestorMap(bird) {
        const map = {};
        if (!bird.pedigree) return map;
        
        // 世代1（親）
        if (bird.pedigree.sire) map[bird.pedigree.sire] = 1;
        if (bird.pedigree.dam) map[bird.pedigree.dam] = 1;
        
        // 世代2（祖父母）
        if (bird.pedigree.sire_sire) map[bird.pedigree.sire_sire] = 2;
        if (bird.pedigree.sire_dam) map[bird.pedigree.sire_dam] = 2;
        if (bird.pedigree.dam_sire) map[bird.pedigree.dam_sire] = 2;
        if (bird.pedigree.dam_dam) map[bird.pedigree.dam_dam] = 2;
        
        // 世代3（曽祖父母）
        if (bird.pedigree.sire_sire_sire) map[bird.pedigree.sire_sire_sire] = 3;
        if (bird.pedigree.sire_sire_dam) map[bird.pedigree.sire_sire_dam] = 3;
        if (bird.pedigree.sire_dam_sire) map[bird.pedigree.sire_dam_sire] = 3;
        if (bird.pedigree.sire_dam_dam) map[bird.pedigree.sire_dam_dam] = 3;
        if (bird.pedigree.dam_sire_sire) map[bird.pedigree.dam_sire_sire] = 3;
        if (bird.pedigree.dam_sire_dam) map[bird.pedigree.dam_sire_dam] = 3;
        if (bird.pedigree.dam_dam_sire) map[bird.pedigree.dam_dam_sire] = 3;
        if (bird.pedigree.dam_dam_dam) map[bird.pedigree.dam_dam_dam] = 3;
        
        return map;
    }
};


// ============================================================
// HealthGuardian - 虚弱体質回避ガードレール（既存）
// ============================================================

const HealthGuardian = {
    // v7.0: 翻訳対応ヘルパー
    _t(key, fallback) {
        const T = window.T || {};
        return T[key] || fallback;
    },

    // v7.0: パラメータ置換付き翻訳 (例: "{type}系近親{gen}世代目" → "ルチノー系近親2世代目")
    _tp(key, params, fallback) {
        let text = this._t(key, fallback);
        if (params) {
            Object.keys(params).forEach(k => {
                text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
            });
        }
        return text;
    },

    // v7.0: 翻訳対応 INBREEDING_LIMITS
    get INBREEDING_LIMITS() {
        return {
            ino: { limit: 2, risk: 'critical', reason: this._t('hg_ino_reason', 'Immune vulnerability due to melanin deficiency (Lutino/Creamino/Pure White)'), icon: '🧬' },
            pallid: { limit: 2, risk: 'critical', reason: this._t('hg_pallid_reason', 'Immune vulnerability due to reduced melanin'), icon: '🧬' },
            fallow: { limit: 2, risk: 'high', reason: this._t('hg_fallow_reason', 'Weakness due to melanin synthesis disorder'), icon: '⚗️' },
            dark_df: { limit: 3, risk: 'moderate', reason: this._t('hg_dark_df_reason', 'Reduced body size and breeding capacity'), icon: '📏' },
            general: { limit: 4, risk: 'low', reason: this._t('hg_general_reason', 'Reduced vitality'), icon: '💪' }
        };
    },
    F_THRESHOLDS: { critical: 0.25, high: 0.125, moderate: 0.0625, safe: 0 },
    // v7.0: 翻訳対応 RISK_LEVELS
    get RISK_LEVELS() {
        return {
            critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: '🚫', label: this._t('risk_critical', 'Critical') },
            high: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '⚠️', label: this._t('risk_high', 'High Risk') },
            moderate: { color: '#eab308', bg: 'rgba(234,179,8,0.15)', icon: '⚡', label: this._t('risk_moderate', 'Caution') },
            safe: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '✓', label: this._t('risk_safe', 'Safe') }
        };
    },

    evaluateHealth(male, female, inbreedingCoef, options = {}) {
        const risks = [], warnings = [], blocks = [];
        const mGeno = male.genotype || {}, fGeno = female.genotype || {};
        const mGen = male.inbreedingGen || 0, fGen = female.inbreedingGen || 0;
        this._checkINOLimit(mGeno, fGeno, mGen, fGen, blocks, warnings);
        this._checkPallidLimit(mGeno, fGeno, mGen, fGen, blocks, warnings);
        this._checkFallowLimit(mGeno, fGeno, mGen, fGen, blocks, warnings);
        this._checkDarkDFAccumulation(mGeno, fGeno, warnings);
        this._checkInbreedingCoefficient(inbreedingCoef, blocks, warnings, risks);
        this._checkMultiSplitCross(mGeno, fGeno, warnings);
        this._checkGeneralLimit(mGen, fGen, risks);
        const riskLevel = this._calculateOverallRisk(blocks, warnings, risks);
        return { canBreed: blocks.length === 0, riskLevel, riskStyle: this.RISK_LEVELS[riskLevel], blocks, warnings, risks,
            recommendations: this._generateRecommendations(blocks, warnings, risks, mGeno, fGeno),
            summary: this._generateSummary(blocks.length === 0, riskLevel, blocks, warnings) };
    },

    // v7.0: 翻訳対応チェック関数
    _checkINOLimit(mGeno, fGeno, mGen, fGen, blocks, warnings) {
        if (!this._hasINOGenes(mGeno) || !this._hasINOGenes(fGeno)) return;
        const nextGen = Math.max(mGen, fGen) + 1, limit = this.INBREEDING_LIMITS.ino.limit;
        const inoType = this._getINOTypeName(mGeno, fGeno);
        const p = { type: inoType, gen: nextGen };
        if (nextGen > limit) blocks.push({ type: 'INO_LIMIT_EXCEEDED', severity: 'critical',
            message: this._tp('ino_limit_exceeded', p, `${inoType} lineage generation ${nextGen} - Immune collapse risk`),
            detail: this.INBREEDING_LIMITS.ino.reason,
            action: this._tp('ino_limit_action', p, `Please introduce ${inoType} from a different bloodline`) });
        else if (nextGen === limit) warnings.push({ type: 'INO_LIMIT_WARNING', severity: 'high',
            message: this._tp('ino_limit_warning', p, `${inoType} lineage generation ${nextGen} - Limit reached next generation`),
            detail: this._t('ino_limit_detail', 'Different bloodline required for next generation'),
            action: this._tp('ino_limit_action_plan', p, `Plan to acquire ${inoType} from different bloodline before next breeding`) });
    },
    _checkPallidLimit(mGeno, fGeno, mGen, fGen, blocks, warnings) {
        if (!this._hasPallidGenes(mGeno) || !this._hasPallidGenes(fGeno)) return;
        const nextGen = Math.max(mGen, fGen) + 1, limit = this.INBREEDING_LIMITS.pallid.limit;
        const p = { gen: nextGen };
        if (nextGen > limit) blocks.push({ type: 'PALLID_LIMIT_EXCEEDED', severity: 'critical',
            message: this._tp('pallid_limit_exceeded', p, `Pallid lineage generation ${nextGen} - Weakness risk`),
            detail: this.INBREEDING_LIMITS.pallid.reason,
            action: this._t('pallid_limit_action', 'Please introduce Pallid from a different bloodline') });
        else if (nextGen === limit) warnings.push({ type: 'PALLID_LIMIT_WARNING', severity: 'high',
            message: this._tp('pallid_limit_warning', p, `Pallid lineage generation ${nextGen} - Limit reached next generation`),
            detail: this._t('pallid_limit_detail', 'Different bloodline required for next generation'),
            action: this._t('pallid_limit_action_plan', 'Plan to acquire Pallid from different bloodline before next breeding') });
    },
    _checkFallowLimit(mGeno, fGeno, mGen, fGen, blocks, warnings) {
        if (!this._hasFallowGenes(mGeno) || !this._hasFallowGenes(fGeno)) return;
        const nextGen = Math.max(mGen, fGen) + 1, limit = this.INBREEDING_LIMITS.fallow.limit;
        const p = { gen: nextGen };
        if (nextGen > limit) blocks.push({ type: 'FALLOW_LIMIT_EXCEEDED', severity: 'high',
            message: this._tp('fallow_limit_exceeded', p, `Fallow lineage generation ${nextGen} - Weakness fixation risk`),
            detail: this.INBREEDING_LIMITS.fallow.reason,
            action: this._t('fallow_limit_action', 'Please introduce Fallow from a different bloodline') });
        else if (nextGen === limit) warnings.push({ type: 'FALLOW_LIMIT_WARNING', severity: 'moderate',
            message: this._tp('fallow_limit_warning', p, `Fallow lineage generation ${nextGen} - Limit reached next generation`),
            detail: this._t('fallow_limit_detail', 'Risk of weakness becoming fixed'),
            action: this._t('fallow_limit_action_plan', 'Consider acquiring Fallow from different bloodline') });
    },
    _checkDarkDFAccumulation(mGeno, fGeno, warnings) {
        if (this._hasDarkDF(mGeno) && this._hasDarkDF(fGeno)) warnings.push({ type: 'DARK_DF_ACCUMULATION', severity: 'moderate',
            message: this._t('dark_df_message', 'DF×DF pairing - Reduced body size risk'),
            detail: this._t('dark_df_detail', 'All offspring will be DF(D/D) with tendency for reduced body size'),
            action: this._t('dark_df_action', 'Recommend introducing SF/Light individuals') });
    },
    _checkInbreedingCoefficient(F, blocks, warnings, risks) {
        const pct = (F * 100).toFixed(1);
        // v7.0: プレースホルダーを{f}に統一（lang_guardian.phpと一致）
        if (F >= this.F_THRESHOLDS.critical) blocks.push({ type: 'F_CRITICAL', severity: 'critical',
            message: this._tp('f_critical_message', { f: pct }, `Inbreeding coefficient F=${pct}% - Breeding prohibited`),
            detail: this._t('f_critical_detail', 'Equivalent to parent-child or full siblings'),
            action: this._t('f_critical_action', 'Please introduce individuals from completely different bloodline') });
        else if (F >= this.F_THRESHOLDS.high) warnings.push({ type: 'F_HIGH', severity: 'high',
            message: this._tp('f_high_message', { f: pct }, `Inbreeding coefficient F=${pct}% - High risk`),
            detail: this._t('f_high_detail', 'Equivalent to half-siblings'),
            action: this._t('f_high_action', 'Strongly recommend introducing different bloodline') });
        else if (F >= this.F_THRESHOLDS.moderate) risks.push({ type: 'F_MODERATE', severity: 'moderate',
            message: this._tp('f_moderate_message', { f: pct }, `Inbreeding coefficient F=${pct}%`),
            detail: this._t('f_moderate_detail', 'Equivalent to cousins'),
            action: this._t('f_moderate_action', 'Continuous pedigree management required') });
    },
    _checkMultiSplitCross(mGeno, fGeno, warnings) {
        const mSplits = this._countSplits(mGeno), fSplits = this._countSplits(fGeno);
        if (mSplits >= 3 && fSplits >= 3) warnings.push({ type: 'MULTI_SPLIT_CROSS', severity: 'moderate',
            message: this._tp('multi_split_message', { m: mSplits, f: fSplits }, `Multi-split pairing (${mSplits}×${fSplits})`),
            detail: this._t('multi_split_detail', 'Risk of unpredictable results or weak offspring'),
            action: this._t('multi_split_action', 'Narrow target traits and fix gradually') });
    },
    _checkGeneralLimit(mGen, fGen, risks) {
        const nextGen = Math.max(mGen, fGen) + 1;
        if (nextGen >= this.INBREEDING_LIMITS.general.limit) risks.push({ type: 'GENERAL_LIMIT', severity: 'low',
            message: this._tp('general_limit_message', { gen: nextGen }, `General trait generation ${nextGen}`),
            detail: this._t('general_limit_detail', 'Possible reduced vitality'),
            action: this._t('general_limit_action', 'Consider refreshing entire bloodline') });
    },

    _hasINOGenes(geno) { return (geno.ino || '').includes('ino'); },
    _hasPallidGenes(geno) { return (geno.ino || '').includes('pld'); },
    // SSOT: fallow_pale と fallow_bronze をチェック
    _hasFallowGenes(geno) {
        const fp = geno.fallow_pale || '';
        const fb = geno.fallow_bronze || '';
        return (fp.includes('flp') && fp !== '++') || (fb.includes('flb') && fb !== '++');
    },
    _hasDarkDF(geno) { return geno.dark === 'DD'; },
    
    /**
     * v6.7.5: INO系色名取得（SSOT対応）
     * COLOR_LABELSから色名を取得、フォールバックあり
     * @param {Object} mGeno - オス遺伝子型
     * @param {Object} fGeno - メス遺伝子型
     * @returns {string} INO系色名
     */
    _getINOTypeName(mGeno, fGeno) {
        const mParblue = mGeno.parblue || '++';
        const fParblue = fGeno.parblue || '++';
        
        // 色キーを決定
        let colorKey;
        if (mParblue === 'tqtq' || fParblue === 'tqtq') {
            colorKey = 'pure_white';
        } else if (mParblue === 'aqaq' || fParblue === 'aqaq') {
            colorKey = 'creamino';
        } else if (mParblue === 'tqaq' || fParblue === 'tqaq') {
            colorKey = 'creamino_seagreen';
        } else {
            colorKey = 'lutino';
        }
        
        // v6.7.5: COLOR_LABELSから取得（SSOT）
        if (typeof COLOR_LABELS !== 'undefined' && COLOR_LABELS[colorKey]) {
            return COLOR_LABELS[colorKey];
        }
        
        // フォールバック（COLOR_LABELS未定義時）
        const fallback = {
            'pure_white': 'Pure White',
            'creamino': 'Creamino',
            'creamino_seagreen': 'Creamino Seagreen',
            'lutino': 'Lutino'
        };
        return fallback[colorKey] || colorKey;
    },
    
    // v7.0: 正しい座位名を使用（LOCI準拠）
    _countSplits(geno) {
        let count = 0;
        const checkParblue = (val) => val && (val.includes('aq') || val.includes('tq')) && val.includes('+');
        const check = (val, pats) => pats.some(p => val && val.includes(p) && val.includes('+'));
        // SSOT: genetics.phpのLOCI定義に準拠
        if (checkParblue(geno.parblue)) count++;
        if (check(geno.ino, ['pld', 'ino'])) count++;
        if (check(geno.opaline, ['op'])) count++;
        if (check(geno.cinnamon, ['cin'])) count++;
        if (check(geno.fallow_pale, ['flp'])) count++;
        if (check(geno.fallow_bronze, ['flb'])) count++;
        if (check(geno.dilute, ['dil'])) count++;
        if (check(geno.pied_rec, ['pi'])) count++;
        return count;
    },
    _calculateOverallRisk(blocks, warnings, risks) {
        if (blocks.length > 0) return 'critical';
        if (warnings.some(w => w.severity === 'high')) return 'high';
        if (warnings.length > 0 || risks.length > 0) return 'moderate';
        return 'safe';
    },
    _generateRecommendations(blocks, warnings, risks, mGeno, fGeno) { return []; },
    // v7.0: 翻訳対応サマリー
    _generateSummary(canBreed, riskLevel, blocks, warnings) {
        if (!canBreed) return `⛔ ${this._t('summary_no_breed', 'Breeding not recommended')}: ${blocks[0].message}`;
        if (riskLevel === 'high') return `⚠️ ${this._t('risk_high', 'High Risk')}: ${warnings[0].message}`;
        if (riskLevel === 'moderate') return `⚡ ${this._t('summary_caution', 'Caution')}`;
        return `✓ ${this._t('summary_safe', 'Health Risk: Low')}`;
    },

    // v7.0: 翻訳対応リフレッシュ判定
    needsRefresh(bird) {
        const gen = bird.inbreedingGen || 0, geno = bird.genotype || {};
        if (this._hasINOGenes(geno) && gen >= 2) return { needed: true, reason: this._t('refresh_ino', 'INO lineage (Lutino/Creamino/Pure White) reached 2 generations'), urgency: 'critical' };
        if (this._hasPallidGenes(geno) && gen >= 2) return { needed: true, reason: this._t('refresh_pallid', 'Pallid lineage reached 2 generations'), urgency: 'critical' };
        if (this._hasFallowGenes(geno) && gen >= 2) return { needed: true, reason: this._t('refresh_fallow', 'Fallow lineage reached 2 generations'), urgency: 'high' };
        if (gen >= 4) return { needed: true, reason: this._t('refresh_general', 'General trait reached 4 generations'), urgency: 'moderate' };
        return { needed: false };
    },
    calculateHealthScore(bird) {
        let score = 100;
        const geno = bird.genotype || {}, gen = bird.inbreedingGen || 0;
        if (this._hasINOGenes(geno)) score -= gen * 15;
        if (this._hasPallidGenes(geno)) score -= gen * 12;
        if (this._hasFallowGenes(geno)) score -= gen * 10;
        if (this._hasDarkDF(geno)) score -= 5;
        score -= gen * 3;
        return Math.max(0, Math.min(100, score));
    },
    getRiskStyle(level) { return this.RISK_LEVELS[level] || this.RISK_LEVELS.safe; },
    generateWarningHTML(evaluation) { return ''; },
    generateRecommendationsHTML(recommendations) { return ''; }
};

// グローバル公開
window.BreedingValidator = BreedingValidator;
window.HealthGuardian = HealthGuardian;
