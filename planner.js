/**
 * Agapornis Gene-Forge v7.0
 * 目標逆算計画エンジン (Target Breeding Planner)
 *
 * v7.0変更点:
 * - 連鎖遺伝対応: 相（Phase: Cis/Trans）を考慮したペアリング評価
 * - Cis配置個体優先推奨ロジック追加
 * - 組み換え率を考慮した確率計算
 * - LINKAGE_GROUPS, RECOMBINATION_RATES参照
 *
 * v6.7.5変更点:
 * - SSOT化: TARGET_REQUIREMENTSからnameフィールド削除
 * - 表示時はCOLOR_LABELS参照に統一
 * - genetics.phpのAgapornisLoci::labels()がSSOT
 *
 * v6.7.4変更点:
 * - 近親交配フィルタリング追加（12.5%未満のみ出力）
 * - BreedingValidator連携
 * - ルート全世代の近交係数チェック
 */
const BreedingPlanner = {

    // v7.0: 翻訳対応ヘルパー
    _t(key, fallback) {
        const T = window.T || {};
        return T[key] || fallback;
    },
    _tp(key, params, fallback) {
        let text = this._t(key, fallback);
        if (params) {
            Object.keys(params).forEach(k => {
                text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
            });
        }
        return text;
    },

    // v6.7.4: 近交係数閾値
    INBREEDING_THRESHOLD: 0.125,  // 12.5%
    
    // v6.7.5: SSOT化 - nameフィールド削除、表示時はCOLOR_LABELS参照
    // parblue短縮形: ++ (野生型), +aq (アクアヘテロ), +tq (ターコイズヘテロ), aqaq (アクアホモ), tqtq (ターコイズホモ), tqaq (シーグリーン複合)
    TARGET_REQUIREMENTS: {
        // グリーン系（野生型）3色
        green: { required: { parblue: ['++'], dark: ['dd'] }, slr: {}, minGen: 0, difficulty: 'none' },
        darkgreen: { required: { parblue: ['++'], dark: ['Dd'] }, slr: {}, minGen: 1, difficulty: 'low' },
        olive: { required: { parblue: ['++'], dark: ['DD'] }, slr: {}, minGen: 2, difficulty: 'mid' },
        
        // アクア系（旧ブルー系）3色
        aqua: { required: { parblue: ['aqaq'], dark: ['dd'] }, slr: {}, minGen: 1, difficulty: 'low' },
        aqua_dark: { required: { parblue: ['aqaq'], dark: ['Dd'] }, slr: {}, minGen: 2, difficulty: 'mid' },
        aqua_dd: { required: { parblue: ['aqaq'], dark: ['DD'] }, slr: {}, minGen: 3, difficulty: 'mid' },
        
        // ターコイズ系（Whitefaced）4色
        turquoise: { required: { parblue: ['tqtq'], dark: ['dd'] }, slr: {}, minGen: 2, difficulty: 'mid' },
        turquoise_dark: { required: { parblue: ['tqtq'], dark: ['Dd', 'DD'] }, slr: {}, minGen: 3, difficulty: 'mid' },
        seagreen: { required: { parblue: ['tqaq'], dark: ['dd'] }, slr: {}, minGen: 1, difficulty: 'low' },
        seagreen_dark: { required: { parblue: ['tqaq'], dark: ['Dd', 'DD'] }, slr: {}, minGen: 2, difficulty: 'mid' },
        
        // INO系（メラニン欠落・赤目）4色
        lutino: { required: { parblue: ['++', '+aq', '+tq'] }, slr: { ino: ['inoino', 'inoW'] }, minGen: 2, difficulty: 'high', inbreedingLimit: 2 },
        creamino: { required: { parblue: ['aqaq'] }, slr: { ino: ['inoino', 'inoW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2 },
        pure_white: { required: { parblue: ['tqtq'] }, slr: { ino: ['inoino', 'inoW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2 },
        creamino_seagreen: { required: { parblue: ['tqaq'] }, slr: { ino: ['inoino', 'inoW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2 },
        
        // パリッド系（メラニン減少・黒目）4色
        pallid_green: { required: { parblue: ['++'] }, slr: { ino: ['pldpld', 'pldW'] }, minGen: 2, difficulty: 'high', inbreedingLimit: 2 },
        pallid_aqua: { required: { parblue: ['aqaq'] }, slr: { ino: ['pldpld', 'pldW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2 },
        pallid_turquoise: { required: { parblue: ['tqtq'] }, slr: { ino: ['pldpld', 'pldW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2 },
        pallid_seagreen: { required: { parblue: ['tqaq'] }, slr: { ino: ['pldpld', 'pldW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2 },
        
        // シナモン系（茶色メラニン）4色
        cinnamon_green: { required: { parblue: ['++'] }, slr: { cin: ['cincin', 'cinW'] }, minGen: 2, difficulty: 'mid' },
        cinnamon_aqua: { required: { parblue: ['aqaq'] }, slr: { cin: ['cincin', 'cinW'] }, minGen: 3, difficulty: 'mid' },
        cinnamon_turquoise: { required: { parblue: ['tqtq'] }, slr: { cin: ['cincin', 'cinW'] }, minGen: 3, difficulty: 'mid' },
        cinnamon_seagreen: { required: { parblue: ['tqaq'] }, slr: { cin: ['cincin', 'cinW'] }, minGen: 3, difficulty: 'mid' },
        
        // オパーリン系（模様変化）4色
        opaline_green: { required: { parblue: ['++'] }, slr: { op: ['opop', 'opW'] }, minGen: 2, difficulty: 'mid' },
        opaline_aqua: { required: { parblue: ['aqaq'] }, slr: { op: ['opop', 'opW'] }, minGen: 3, difficulty: 'mid' },
        opaline_turquoise: { required: { parblue: ['tqtq'] }, slr: { op: ['opop', 'opW'] }, minGen: 3, difficulty: 'mid' },
        opaline_seagreen: { required: { parblue: ['tqaq'] }, slr: { op: ['opop', 'opW'] }, minGen: 3, difficulty: 'mid' },
        
        // フォロー系（赤目）2色
        fallow_green: { required: { parblue: ['++'], fl: ['flfl'] }, slr: {}, minGen: 2, difficulty: 'mid', inbreedingLimit: 2 },
        fallow_aqua: { required: { parblue: ['aqaq'], fl: ['flfl'] }, slr: {}, minGen: 3, difficulty: 'mid', inbreedingLimit: 2 },
        
        // パイド系（まだら模様）4色
        pied_green: { required: { parblue: ['++'], pi: ['pipi'] }, slr: {}, minGen: 2, difficulty: 'mid' },
        pied_aqua: { required: { parblue: ['aqaq'], pi: ['pipi'] }, slr: {}, minGen: 3, difficulty: 'mid' },
        pied_turquoise: { required: { parblue: ['tqtq'], pi: ['pipi'] }, slr: {}, minGen: 3, difficulty: 'mid' },
        pied_seagreen: { required: { parblue: ['tqaq'], pi: ['pipi'] }, slr: {}, minGen: 3, difficulty: 'mid' },
        
        // レガシー互換（旧版からの移行用）
        blue: { required: { parblue: ['aqaq'], dark: ['dd'] }, slr: {}, minGen: 1, difficulty: 'low', legacy: true },
        cobalt: { required: { parblue: ['aqaq'], dark: ['Dd'] }, slr: {}, minGen: 2, difficulty: 'mid', legacy: true },
        mauve: { required: { parblue: ['aqaq'], dark: ['DD'] }, slr: {}, minGen: 3, difficulty: 'mid', legacy: true },
        albino: { required: { parblue: ['tqtq'] }, slr: { ino: ['inoino', 'inoW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2, legacy: true },
        pallid_blue: { required: { parblue: ['aqaq'] }, slr: { ino: ['pldpld', 'pldW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2, legacy: true },
        cinnamon_blue: { required: { parblue: ['aqaq'] }, slr: { cin: ['cincin', 'cinW'] }, minGen: 3, difficulty: 'mid', legacy: true },
        opaline_blue: { required: { parblue: ['aqaq'] }, slr: { op: ['opop', 'opW'] }, minGen: 3, difficulty: 'mid', legacy: true },
        fallow_blue: { required: { parblue: ['aqaq'], fl: ['flfl'] }, slr: {}, minGen: 3, difficulty: 'mid', inbreedingLimit: 2, legacy: true },
        pied_blue: { required: { parblue: ['aqaq'], pi: ['pipi'] }, slr: {}, minGen: 3, difficulty: 'mid', legacy: true }
    },
    
    /**
     * v6.7.5: 色名取得ヘルパー（SSOT対応）
     * COLOR_LABELSから取得、なければキーをそのまま返す
     * @param {string} colorKey - 色キー
     * @returns {string} 表示用色名
     */
    getColorName(colorKey) {
        if (typeof COLOR_LABELS !== 'undefined' && COLOR_LABELS[colorKey]) {
            return COLOR_LABELS[colorKey];
        }
        // フォールバック: キーをそのまま返す
        return colorKey;
    },

    /**
     * v7.0: COLOR_MASTERから動的に要件を生成
     * TARGET_REQUIREMENTSにない色でもCOLOR_MASTERから計算可能
     * @param {string} colorKey - 色キー
     * @returns {object|null} 要件オブジェクト
     */
    generateRequirementsFromMaster(colorKey) {
        if (typeof COLOR_MASTER === 'undefined' || !COLOR_MASTER[colorKey]) {
            return null;
        }
        const colorDef = COLOR_MASTER[colorKey];
        const genotype = colorDef.genotype || {};

        // 常染色体要件を構築
        const required = {};
        const slr = {};

        // parblue
        if (genotype.parblue) {
            required.parblue = [genotype.parblue];
        }
        // dark
        if (genotype.dark) {
            required.dark = [genotype.dark];
        }
        // violet
        if (genotype.violet && genotype.violet !== 'vv') {
            required.violet = [genotype.violet];
        }
        // pied_rec
        if (genotype.pied_rec && genotype.pied_rec !== '++') {
            required.pied_rec = [genotype.pied_rec];
        }
        // pied_dom
        if (genotype.pied_dom && genotype.pied_dom !== '++') {
            required.pied_dom = [genotype.pied_dom];
        }
        // dilute
        if (genotype.dilute && genotype.dilute !== '++') {
            required.dilute = [genotype.dilute];
        }
        // edged
        if (genotype.edged && genotype.edged !== '++') {
            required.edged = [genotype.edged];
        }
        // orangeface
        if (genotype.orangeface && genotype.orangeface !== '++') {
            required.orangeface = [genotype.orangeface];
        }
        // pale_headed
        if (genotype.pale_headed && genotype.pale_headed !== '++') {
            required.pale_headed = [genotype.pale_headed];
        }
        // fallow_pale
        if (genotype.fallow_pale && genotype.fallow_pale !== '++') {
            required.fallow_pale = [genotype.fallow_pale];
        }
        // fallow_bronze
        if (genotype.fallow_bronze && genotype.fallow_bronze !== '++') {
            required.fallow_bronze = [genotype.fallow_bronze];
        }

        // 伴性遺伝要件
        if (genotype.ino && genotype.ino !== '++' && genotype.ino !== '+W') {
            slr.ino = [genotype.ino, genotype.ino.replace(/(.+)\1/, '$1W')]; // ホモ + ヘミ
        }
        if (genotype.opaline && genotype.opaline !== '++' && genotype.opaline !== '+W') {
            slr.op = [genotype.opaline, genotype.opaline.replace(/(.+)\1/, '$1W')];
        }
        if (genotype.cinnamon && genotype.cinnamon !== '++' && genotype.cinnamon !== '+W') {
            slr.cin = [genotype.cinnamon, genotype.cinnamon.replace(/(.+)\1/, '$1W')];
        }

        // 難易度と世代数を推定
        const locusCount = Object.keys(required).length + Object.keys(slr).length;
        let difficulty = 'low';
        let minGen = 1;
        if (locusCount >= 4) { difficulty = 'extreme'; minGen = 5; }
        else if (locusCount >= 3) { difficulty = 'high'; minGen = 4; }
        else if (locusCount >= 2) { difficulty = 'mid'; minGen = 2; }

        // INO/Pallid系は近親交配制限
        const hasIno = slr.ino && (slr.ino.includes('inoino') || slr.ino.includes('pldpld'));
        const inbreedingLimit = hasIno ? 2 : undefined;

        return {
            required,
            slr,
            minGen,
            difficulty,
            inbreedingLimit,
            tier: colorDef.tier || 1
        };
    },

    // v7.0: 翻訳対応plan関数
    plan(targetKey) {
        // TARGET_REQUIREMENTSを優先、なければCOLOR_MASTERから動的生成
        let target = this.TARGET_REQUIREMENTS[targetKey];
        if (!target) {
            target = this.generateRequirementsFromMaster(targetKey);
        }
        if (!target) return { error: this._t('bp_unsupported_target', 'Unsupported target trait') };
        const birds = typeof BirdDB !== 'undefined' ? BirdDB.getAllBirds() : [];
        if (birds.length === 0) return { error: this._t('bp_no_birds', 'No birds registered'), suggestion: this._t('bp_register_hint', 'Register birds in the Bird Management tab first') };
        const males = birds.filter(b => b.sex === 'male'), females = birds.filter(b => b.sex === 'female');
        if (males.length === 0 || females.length === 0) return { error: this._t('bp_need_both_sex', 'Both males and females are required'), suggestion: this._tp('bp_current_count', { m: males.length, f: females.length }, `Current: ${males.length} males, ${females.length} females`) };

        let pairings = [];
        males.forEach(m => females.forEach(f => pairings.push(this.evaluatePairing(m, f, target, targetKey))));

        // v6.7.4: 近親交配フィルタリング
        pairings = this.filterByInbreeding(pairings);

        // v7.0: 確率0%のペアを除外（貢献度がないペアは推奨しない）
        const viablePairings = pairings.filter(p => p.probability > 0);

        pairings.sort((a, b) => b.score - a.score);
        viablePairings.sort((a, b) => b.score - a.score);

        // v6.7.4: フィルタリング後に候補がない場合
        if (pairings.length === 0) {
            return {
                error: this._t('bp_no_ethical_pairs', 'No pairs meet ethical standards'),
                suggestion: this._t('bp_introduce_new_blood', 'No pairs with inbreeding coefficient below 12.5%. Introduce unrelated bloodlines.'),
                filteredOut: true
            };
        }

        // v7.0: 確率>0のペアがない場合
        if (viablePairings.length === 0) {
            return {
                error: this._t('bp_no_viable_pairs', 'No pairs can produce target trait'),
                suggestion: this._t('bp_need_carriers', 'Register birds that carry the required genes for this target.'),
                noViable: true
            };
        }
        
        // v6.7.5: targetNameをCOLOR_LABELSから取得
        const targetName = this.getColorName(targetKey);
        
        return {
            target,
            targetKey,
            targetName,  // v6.7.5: SSOT対応
            topPairings: viablePairings.slice(0, 5),  // v7.0: 確率>0のみ
            allPairings: pairings,
            roadmap: this.generateRoadmap(viablePairings[0], target, targetKey, []),
            totalBirds: birds.length,
            maleCount: males.length,
            femaleCount: females.length
        };
    },
    
    /**
     * v6.7.4: 近親交配フィルタリング
     * 近交係数12.5%以上のペアを除外
     * @param {Array} pairings - ペアリング候補
     * @returns {Array} フィルタリング済みペアリング
     */
    filterByInbreeding(pairings) {
        return pairings.filter(pairing => {
            // 近交係数が閾値未満のみ許可
            if (pairing.inbreedingCoef >= this.INBREEDING_THRESHOLD) {
                return false;
            }
            
            // BreedingValidator が利用可能な場合は追加チェック
            if (typeof BreedingValidator !== 'undefined') {
                const validation = BreedingValidator.validate(pairing.male, pairing.female, 'plan');
                if (!validation.allowed) {
                    return false;
                }
            }
            
            return true;
        });
    },
    
    /**
     * v6.7.4: ルート全体の近親交配チェック
     * 複数世代のルートで1回でも12.5%以上があればNG
     * @param {Array} route - 交配ルート（breedings配列を含む）
     * @returns {boolean} 許可されるか
     */
    validateRoute(route) {
        if (!route.breedings || !Array.isArray(route.breedings)) {
            return true;
        }
        
        for (const breeding of route.breedings) {
            let ic;
            
            // BreedingValidator が利用可能な場合
            if (typeof BreedingValidator !== 'undefined') {
                ic = BreedingValidator.calcInbreedingCoefficient(breeding.sire, breeding.dam);
            } else if (typeof BirdDB !== 'undefined') {
                const result = BirdDB.calculateInbreedingCoefficient(breeding.sire.id, breeding.dam.id);
                ic = result.coefficient;
            } else {
                ic = 0;
            }
            
            if (ic >= this.INBREEDING_THRESHOLD) {
                return false;
            }
        }
        
        return true;
    },
    
    /**
     * v6.7.4: 複数ルートのフィルタリング
     * @param {Array} routes - ルート候補
     * @returns {Array} フィルタリング済みルート
     */
    filterRoutes(routes) {
        return routes.filter(route => this.validateRoute(route));
    },
    
    evaluatePairing(male, female, target, targetKey) {
        let score = this.calculateGeneScore(male, target) + this.calculateGeneScore(female, target);
        const prob = this.calculateTargetProbability(male, female, target);
        score += prob * 100;

        // v7.0: 連鎖遺伝ボーナス
        const linkageBonus = this.calculateLinkageBonus(male, female, targetKey);
        score += linkageBonus;

        // 近交係数計算
        let inbreedingCoef = 0;
        let warningLevel = { level: 'safe' };
        
        // BreedingValidator優先、なければBirdDB
        if (typeof BreedingValidator !== 'undefined') {
            inbreedingCoef = BreedingValidator.calcInbreedingCoefficient(male, female);
        } else if (typeof BirdDB !== 'undefined') {
            const result = BirdDB.calculateInbreedingCoefficient(male.id, female.id);
            inbreedingCoef = result.coefficient;
            warningLevel = result.warningLevel;
        }
        
        let canBreed = true, healthRisk = 'safe', warnings = [];
        
        // v6.7.4: BreedingValidator による検証
        if (typeof BreedingValidator !== 'undefined') {
            const validation = BreedingValidator.validate(male, female, 'plan');
            if (!validation.allowed) {
                canBreed = false;
                warnings.push('🚫 ' + validation.reason);
                score = -1000;
            } else if (validation.warning) {
                warnings.push(validation.warning);
            }
        }
        
        // HealthGuardian による追加チェック
        if (canBreed && typeof HealthGuardian !== 'undefined') {
            const health = HealthGuardian.evaluateHealth(male, female, inbreedingCoef);
            if (!health.canBreed) {
                canBreed = false;
                score = -1000;
            }
            healthRisk = health.riskLevel;
            health.blocks.forEach(b => warnings.push('🚫 ' + b.message));
            health.warnings.forEach(w => warnings.push('⚠️ ' + w.message));
        }
        
        // v7.0: 翻訳対応推奨メッセージ
        let recommendation;
        if (!canBreed) {
            recommendation = '🚫 ' + this._t('bp_breeding_prohibited', 'Breeding prohibited');
        } else if (inbreedingCoef >= this.INBREEDING_THRESHOLD) {
            recommendation = '⚠️ ' + this._t('bp_ethics_warning', 'Prohibited in thoroughbred breeding');
        } else if (prob >= 0.5) {
            recommendation = '🌟 ' + this._t('bp_optimal_pair', 'Optimal pair');
        } else if (prob > 0) {
            recommendation = '✓ ' + this._t('bp_possible', 'Possible');
        } else {
            recommendation = '✗ ' + this._t('bp_low_contribution', 'Low contribution to target');
        }

        // v7.0: 連鎖遺伝に関する推奨
        const linkageRec = this.generateLinkageRecommendation(male, female, targetKey);
        if (linkageRec) {
            warnings.push(linkageRec);
        }

        return {
            male,
            female,
            score,
            probability: prob,
            estimatedGenerations: target.minGen + (prob < 0.5 ? 1 : 0),
            inbreedingCoef,
            canBreed,
            healthRisk,
            warnings,
            recommendation,
            targetKey,  // v6.7.5: targetKeyを保持
            linkageBonus,  // v7.0: 連鎖ボーナス
            maleGenes: { hasRequired: [], carrierOf: [], missing: [] },
            femaleGenes: { hasRequired: [], carrierOf: [], missing: [] }
        };
    },
    
    calculateGeneScore(bird, target) {
        let score = 0;
        const geno = bird.genotype || {};
        for (const [locus, vals] of Object.entries(target.required)) { 
            if (vals.includes(geno[locus])) score += 100; 
            else if (geno[locus] && geno[locus] !== '++') score += 50; 
        }
        for (const [locus, vals] of Object.entries(target.slr)) { 
            const v = geno[locus] || (bird.sex === 'male' ? '++' : '+W'); 
            if (vals.includes(v)) score += 100; 
            else if (v && v !== '++' && v !== '+W') score += 50; 
        }
        return score;
    },
    
    calculateTargetProbability(male, female, target) {
        let prob = 1.0;
        const mGeno = male.genotype || {}, fGeno = female.genotype || {};
        for (const [locus, vals] of Object.entries(target.required)) {
            const mv = mGeno[locus] || '++', fv = fGeno[locus] || '++';
            if (vals.includes(mv) && vals.includes(fv)) prob *= 1.0;
            else if (vals.includes(mv) || vals.includes(fv)) prob *= 0.5;
            else if (mv !== '++' && fv !== '++') prob *= 0.25;
            else prob *= 0;
        }
        for (const [locus, vals] of Object.entries(target.slr)) {
            const mv = mGeno[locus] || '++', fv = fGeno[locus] || '+W';
            if (vals.includes(mv)) prob *= 0.5;
            else if (mv !== '++') prob *= 0.25;
            else prob *= 0;
        }
        return prob;
    },
    
    // v7.0: 翻訳対応
    generateRoadmap(topPairing, target, targetKey, missingGenes) {
        if (!topPairing) return [{ generation: 0, action: this._t('bp_no_breedable_pair', 'No breedable pairs available'), goal: this._t('bp_introduce_healthy', 'Introduce birds with low health risk') }];
        // v6.7.5: COLOR_LABELSから色名取得
        const targetName = this.getColorName(targetKey);
        const goalText = this._tp('bp_goal_produce', { name: targetName }, 'Produce ' + targetName);
        return [{ generation: 1, action: `${topPairing.male.name} × ${topPairing.female.name}`, goal: goalText, probability: `${(topPairing.probability * 100).toFixed(1)}%` }];
    },

    // ========================================
    // v7.0: 連鎖遺伝（相/Phase）評価
    // ========================================

    /**
     * v7.0: 個体の連鎖座位の相を評価
     * @param {Object} bird - 個体データ
     * @param {string} targetKey - 目標色キー
     * @returns {Object} 連鎖情報 { phase, advantage, loci }
     */
    evaluateLinkagePhase(bird, targetKey) {
        // LINKAGE_GROUPS/RECOMBINATION_RATES が未定義なら空を返す
        if (typeof LINKAGE_GROUPS === 'undefined' || typeof RECOMBINATION_RATES === 'undefined') {
            return { available: false };
        }

        const target = this.TARGET_REQUIREMENTS[targetKey];
        if (!target) return { available: false };

        const geno = bird.genotype || {};
        const result = {
            available: true,
            Z_linked: this.evaluateZLinkedPhase(bird, geno, target),
            autosomal_1: this.evaluateAutosomal1Phase(bird, geno, target)
        };

        return result;
    },

    /**
     * v7.0: Z染色体連鎖座位の相評価
     */
    evaluateZLinkedPhase(bird, geno, target) {
        const sex = bird.sex;

        // メスはヘミ接合（相の概念なし）
        if (sex === 'female') {
            return { phase: 'hemizygous', note: this._t('bp_female_hemizygous', 'メスは相の概念なし') };
        }

        // 必要な伴性座位を特定
        const slr = target.slr || {};
        const neededLoci = [];
        if (slr.ino) neededLoci.push('ino');
        if (slr.cin) neededLoci.push('cinnamon');
        if (slr.op) neededLoci.push('opaline');

        if (neededLoci.length < 2) {
            return { phase: 'not_applicable', note: this._t('bp_linkage_not_needed', '連鎖考慮不要') };
        }

        // v7形式のZ_linkedハプロタイプがあれば使用
        if (geno.Z_linked && geno.Z_linked.Z1) {
            return this.detectPhaseFromV7Format(geno.Z_linked, neededLoci);
        }

        // 旧形式から推論
        return this.inferPhaseFromOldFormat(geno, neededLoci, sex);
    },

    /**
     * v7.0: v7形式からCis/Trans検出
     */
    detectPhaseFromV7Format(zLinked, neededLoci) {
        const z1 = zLinked.Z1 || {};
        const z2 = zLinked.Z2 || {};

        // Z1とZ2の両方に変異があるか確認
        let z1Mutations = 0, z2Mutations = 0;
        neededLoci.forEach(loc => {
            if (z1[loc] && z1[loc] !== '+') z1Mutations++;
            if (z2[loc] && z2[loc] !== '+') z2Mutations++;
        });

        if (z1Mutations >= 2 && z2Mutations === 0) {
            return {
                phase: 'cis',
                Z1: z1,
                Z2: z2,
                advantage: true,
                note: this._t('bp_phase_cis', 'Cis配置（効率的）')
            };
        }

        if (z1Mutations === 1 && z2Mutations === 1) {
            return {
                phase: 'trans',
                Z1: z1,
                Z2: z2,
                advantage: false,
                note: this._t('bp_phase_trans', 'Trans配置（非効率）')
            };
        }

        return { phase: 'unknown', note: this._t('bp_phase_unknown', '相不明') };
    },

    /**
     * v7.0: 旧形式から相を推論
     */
    inferPhaseFromOldFormat(geno, neededLoci, sex) {
        // 複数伴性形質が同時発現していればCis
        // (表現型からの推論は限定的)
        let expressedCount = 0;
        neededLoci.forEach(loc => {
            const val = geno[loc] || '++';
            if (val !== '++' && val !== '+W' && !val.startsWith('+')) {
                expressedCount++;
            }
        });

        if (expressedCount >= 2) {
            return {
                phase: 'cis_inferred',
                advantage: true,
                note: this._t('bp_phase_cis_inferred', '複数発現 → Cis推定')
            };
        }

        return { phase: 'unknown', note: this._t('bp_phase_no_info', '相情報なし') };
    },

    /**
     * v7.0: 常染色体連鎖座位の相評価
     */
    evaluateAutosomal1Phase(bird, geno, target) {
        const req = target.required || {};

        // dark + parblue の両方が必要か
        const needsDark = req.dark && !req.dark.includes('dd');
        const needsParblue = req.parblue && !req.parblue.includes('++');

        if (!needsDark || !needsParblue) {
            return { phase: 'not_applicable', note: this._t('bp_linkage_not_needed', '連鎖考慮不要') };
        }

        // v7形式確認
        if (geno.autosomal_1 && geno.autosomal_1.chr1) {
            const chr1 = geno.autosomal_1.chr1;
            const chr2 = geno.autosomal_1.chr2;

            const chr1HasBoth = chr1.dark === 'D' && chr1.parblue !== '+';
            const chr2Wild = chr2.dark === 'd' && chr2.parblue === '+';

            if (chr1HasBoth && chr2Wild) {
                return {
                    phase: 'cis',
                    advantage: true,
                    note: this._t('bp_autosomal_cis', 'Dark+Parblue Cis配置')
                };
            }
        }

        return { phase: 'unknown', note: this._t('bp_phase_no_info', '相情報なし') };
    },

    /**
     * v7.0: 連鎖を考慮したスコアボーナス
     * Cis配置の個体には追加スコア
     */
    calculateLinkageBonus(male, female, targetKey) {
        let bonus = 0;

        const mPhase = this.evaluateLinkagePhase(male, targetKey);
        const fPhase = this.evaluateLinkagePhase(female, targetKey);

        // オスのCis配置にボーナス（オスの相が効率に影響）
        if (mPhase.available && mPhase.Z_linked) {
            if (mPhase.Z_linked.phase === 'cis' || mPhase.Z_linked.phase === 'cis_inferred') {
                bonus += 50;  // Cis優位性ボーナス
            } else if (mPhase.Z_linked.phase === 'trans') {
                bonus -= 30;  // Trans非効率ペナルティ
            }
        }

        // 常染色体も同様
        if (mPhase.available && mPhase.autosomal_1) {
            if (mPhase.autosomal_1.phase === 'cis') {
                bonus += 30;
            }
        }

        return bonus;
    },

    /**
     * v7.0: 連鎖を考慮した確率修正
     * @param {number} baseProb - 基本確率（独立分離仮定）
     * @param {Object} male - オス個体
     * @param {string} targetKey - 目標色
     * @returns {number} 修正後確率
     */
    adjustProbabilityForLinkage(baseProb, male, targetKey) {
        if (typeof RECOMBINATION_RATES === 'undefined') {
            return baseProb;
        }

        const mPhase = this.evaluateLinkagePhase(male, targetKey);
        if (!mPhase.available) return baseProb;

        // Z連鎖の修正
        if (mPhase.Z_linked && mPhase.Z_linked.phase !== 'not_applicable') {
            const target = this.TARGET_REQUIREMENTS[targetKey];
            const slr = target?.slr || {};

            // cin + ino 両方必要な場合（Lacewing系）
            if (slr.ino && slr.cin) {
                const rate = RECOMBINATION_RATES['cinnamon-ino'] || 0.03;
                if (mPhase.Z_linked.phase === 'cis' || mPhase.Z_linked.phase === 'cis_inferred') {
                    // Cis: 97%が連鎖遺伝
                    baseProb *= (1 - rate);
                } else if (mPhase.Z_linked.phase === 'trans') {
                    // Trans: 3%でしか揃わない
                    baseProb *= rate;
                }
            }

            // ino + opaline 両方必要な場合
            if (slr.ino && slr.op) {
                const rate = RECOMBINATION_RATES['ino-opaline'] || 0.30;
                if (mPhase.Z_linked.phase === 'cis' || mPhase.Z_linked.phase === 'cis_inferred') {
                    baseProb *= (1 - rate);
                } else if (mPhase.Z_linked.phase === 'trans') {
                    baseProb *= rate;
                }
            }
        }

        return baseProb;
    },

    /**
     * v7.0: 連鎖に関する推奨メッセージ生成
     */
    generateLinkageRecommendation(male, female, targetKey) {
        const mPhase = this.evaluateLinkagePhase(male, targetKey);

        if (!mPhase.available || !mPhase.Z_linked) {
            return null;
        }

        if (mPhase.Z_linked.phase === 'cis' || mPhase.Z_linked.phase === 'cis_inferred') {
            return '✓ ' + this._t('bp_male_cis_efficient', 'オスがCis配置 → 効率的');
        }

        if (mPhase.Z_linked.phase === 'trans') {
            return '⚠ ' + this._t('bp_male_trans_inefficient', 'オスがTrans配置 → 非効率（Cis個体推奨）');
        }

        if (mPhase.Z_linked.phase === 'unknown') {
            return '? ' + this._t('bp_male_phase_unknown', 'オスの相不明 → テスト交配で確認推奨');
        }

        return null;
    }
};

/**
 * v7.0: runPlanner() - 翻訳対応版
 * 表示時はCOLOR_LABELSから色名を取得
 */
function runPlanner() {
    const T = window.T || {};
    const _t = (key, fallback) => T[key] || fallback;

    const targetSelect = document.getElementById('plannerTarget');
    const resultPanel = document.getElementById('plannerResult');
    const emptyPanel = document.getElementById('plannerEmpty');
    if (!targetSelect || !resultPanel) return;
    const targetKey = targetSelect.value;
    if (!targetKey) { alert(_t('bp_select_target', 'Please select a target trait')); return; }

    // v7.0: 空パネルを非表示
    if (emptyPanel) emptyPanel.style.display = 'none';
    const result = BreedingPlanner.plan(targetKey);

    if (result.error) {
        let errorHtml = `<div class="empty-state"><p>⚠️ ${result.error}</p>`;
        if (result.suggestion) errorHtml += `<p>${result.suggestion}</p>`;
        // v6.7.4: フィルタリングによる候補なしの場合の追加メッセージ
        if (result.filteredOut) {
            errorHtml += `<p style="color: #666; font-size: 0.9em;">※ ${_t('bp_filtered_note', 'Pairs with IC ≥12.5% are excluded per ethical standards')}</p>`;
        }
        errorHtml += '</div>';
        resultPanel.innerHTML = errorHtml;
        resultPanel.style.display = 'block';
        return;
    }

    // v6.7.5: targetNameはresultから取得（SSOT対応）
    const targetName = result.targetName;

    let html = `<div class="output-header"><span class="output-title">🎯 ${targetName} ${_t('bp_production_plan', 'Production Plan')}</span></div>`;
    html += `<h4>🏆 ${_t('bp_recommended_top5', 'Recommended Pairings TOP5')}</h4><div class="pairing-list">`;
    result.topPairings.forEach((p, i) => {
        // v6.7.4: 近交係数表示の強化
        const icPercent = (p.inbreedingCoef * 100).toFixed(2);
        const icClass = p.inbreedingCoef >= 0.125 ? 'ic-warning' : (p.inbreedingCoef >= 0.0625 ? 'ic-caution' : 'ic-safe');

        html += `<div class="pairing-card ${p.canBreed ? '' : 'pairing-blocked'}">`;
        html += `<div class="pairing-header">#${i+1} ♂${p.male.name} × ♀${p.female.name} ${!p.canBreed ? '🚫' : ''}</div>`;
        html += `<div class="pairing-stats">${_t('bp_probability', 'Probability')}: ${(p.probability*100).toFixed(1)}% | <span class="${icClass}">${_t('bp_f_value', 'F-value')}: ${icPercent}%</span></div>`;
        html += `<div class="pairing-recommendation">${p.recommendation}</div>`;
        if (p.warnings.length > 0) {
            html += `<div class="pairing-warnings">${p.warnings.join('<br>')}</div>`;
        }
        html += '</div>';
    });
    html += '</div>';

    // v6.7.4: 倫理基準の説明を追加
    html += `<div class="ethics-note" style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-size: 0.85em;">`;
    html += `<p>📋 <strong>${_t('bp_ethics_standard', 'Ethical Standards')}:</strong> ${_t('bp_ethics_description', 'Pairs with IC ≥12.5% are excluded (Thoroughbred rules)')}</p>`;
    html += `</div>`;
    
    resultPanel.innerHTML = html; 
    resultPanel.style.display = 'block';
}
