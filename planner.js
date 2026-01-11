/**
 * Agapornis Gene-Forge v7.3
 * 目標逆算計画エンジン (Target Breeding Planner)
 *
 * v7.3変更点:
 * - Z_linkedハプロタイプ形式から伴性遺伝子を正しく読み取るよう修正
 * - getSLRGenotypeFromZLinked()ヘルパー追加
 * - calculateGeneScore, calculateTargetProbability, analyzeGeneGap対応
 * - findBestPairingsForGene Z_linked対応
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
     * v7.3: 色名取得ヘルパー（keyToLabel対応）
     * 動的変換で任意のカラーキーをローカライズ
     * @param {string} colorKey - 色キー
     * @returns {string} 表示用色名
     */
    getColorName(colorKey) {
        // v7.3: keyToLabel関数でローカライズ（動的変換対応）
        if (typeof keyToLabel === 'function') {
            return keyToLabel(colorKey);
        }
        // フォールバック
        if (typeof COLOR_LABELS !== 'undefined' && COLOR_LABELS[colorKey]) {
            return COLOR_LABELS[colorKey];
        }
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
    
    /**
     * v7.3: Z_linked形式から伴性遺伝子型を読み取る
     * TARGET_REQUIREMENTS.slr のキー (ino, cin, op) → Z_linked のキー (ino, cinnamon, opaline)
     * @param {Object} geno - bird.genotype
     * @param {string} slrKey - slr座位キー (ino, cin, op)
     * @param {string} sex - 'male' or 'female'
     * @returns {string} 遺伝子型 (e.g., 'inoino', '+ino', '+W', '++')
     */
    getSLRGenotypeFromZLinked(geno, slrKey, sex) {
        // slrキー → Z_linkedキー のマッピング
        const keyMap = {
            'ino': 'ino',
            'cin': 'cinnamon',
            'op': 'opaline'
        };
        const zKey = keyMap[slrKey] || slrKey;

        // v7形式の Z_linked がある場合
        if (geno.Z_linked && geno.Z_linked.Z1) {
            const z1 = geno.Z_linked.Z1 || {};
            const z2 = geno.Z_linked.Z2 || null;

            const a1 = z1[zKey] || '+';

            if (sex === 'female') {
                // メス: ヘミ接合 (ZW)
                // 変異があれば発現、なければ +W
                if (a1 !== '+') {
                    return a1 + 'W';  // e.g., 'inoW', 'cinW', 'opW'
                }
                return '+W';
            } else {
                // オス: 二倍体 (ZZ)
                const a2 = z2 ? (z2[zKey] || '+') : '+';

                // ホモ/ヘテロ/野生型の判定
                if (a1 !== '+' && a2 !== '+') {
                    // 両方変異: ホモまたは複合ヘテロ
                    return a1 + a2;  // e.g., 'inoino', 'cinino'
                } else if (a1 !== '+') {
                    // 片方変異: スプリット
                    return '+' + a1;  // e.g., '+ino', '+cin'
                } else if (a2 !== '+') {
                    return '+' + a2;
                }
                return '++';
            }
        }

        // v7形式がない場合、旧形式にフォールバック
        // 旧形式のキーも試す
        const oldFormatVal = geno[slrKey] || geno[zKey];
        if (oldFormatVal) {
            return oldFormatVal;
        }

        // デフォルト
        return sex === 'male' ? '++' : '+W';
    },

    calculateGeneScore(bird, target) {
        let score = 0;
        const geno = bird.genotype || {};

        // 常染色体遺伝子
        for (const [locus, vals] of Object.entries(target.required)) {
            if (vals.includes(geno[locus])) score += 100;
            else if (geno[locus] && geno[locus] !== '++') score += 50;
        }

        // v7.3: 伴性遺伝子 - Z_linked形式対応
        for (const [locus, vals] of Object.entries(target.slr)) {
            const v = this.getSLRGenotypeFromZLinked(geno, locus, bird.sex);
            if (vals.includes(v)) score += 100;
            else if (v && v !== '++' && v !== '+W') score += 50;
        }
        return score;
    },

    calculateTargetProbability(male, female, target) {
        let prob = 1.0;
        const mGeno = male.genotype || {}, fGeno = female.genotype || {};

        // 常染色体遺伝子
        for (const [locus, vals] of Object.entries(target.required)) {
            const mv = mGeno[locus] || '++', fv = fGeno[locus] || '++';
            if (vals.includes(mv) && vals.includes(fv)) prob *= 1.0;
            else if (vals.includes(mv) || vals.includes(fv)) prob *= 0.5;
            else if (mv !== '++' && fv !== '++') prob *= 0.25;
            else prob *= 0;
        }

        // v7.3: 伴性遺伝子 - Z_linked形式対応
        for (const [locus, vals] of Object.entries(target.slr)) {
            const mv = this.getSLRGenotypeFromZLinked(mGeno, locus, 'male');
            const fv = this.getSLRGenotypeFromZLinked(fGeno, locus, 'female');

            // 伴性遺伝の確率計算:
            // オス発現(ホモ) × メス発現(ヘミ) → 100% 子は発現/スプリット
            // オススプリット × メス発現 → 50% オス発現, 50% メス発現
            // オススプリット × メス野生 → 50% メス発現, 25% オススプリット
            if (vals.includes(mv) && vals.includes(fv)) {
                // 両方発現: 高確率
                prob *= 1.0;
            } else if (vals.includes(fv)) {
                // メスのみ発現
                if (mv !== '++') {
                    // オスがスプリット
                    prob *= 0.5;
                } else {
                    // オス野生型: 子オスはスプリット、メスは発現しない
                    prob *= 0;
                }
            } else if (vals.includes(mv)) {
                // オスのみ発現（ホモ）
                prob *= 0.5;  // 娘は発現（ヘミ接合）
            } else if (mv !== '++') {
                // オスがスプリット
                prob *= 0.25;  // 娘の半分が発現
            } else {
                // 両方野生型
                prob *= 0;
            }
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
    },

    // ========================================
    // v7.1: 多世代計画エンジン
    // 最大4世代の配合計画を FamilyMap 形式で出力
    // ========================================

    /**
     * v7.1: 目標に必要な遺伝子と現在のストック差分を分析
     * @param {string} targetKey - 目標色キー
     * @param {Array} birds - 登録鳥リスト
     * @returns {Object} { required, available, missing, canProduceInOneGen }
     */
    analyzeGeneGap(targetKey, birds) {
        let target = this.TARGET_REQUIREMENTS[targetKey];
        if (!target) {
            target = this.generateRequirementsFromMaster(targetKey);
        }
        if (!target) return { error: 'Unknown target' };

        const required = { ...target.required };
        const slr = { ...target.slr };

        // 現在のストックで利用可能な遺伝子を収集
        const available = { autosomal: {}, slr: {} };
        const males = birds.filter(b => b.sex === 'male');
        const females = birds.filter(b => b.sex === 'female');

        // 常染色体遺伝子
        for (const [locus, vals] of Object.entries(required)) {
            available.autosomal[locus] = { homozygous: [], heterozygous: [], absent: [] };

            birds.forEach(b => {
                const geno = b.genotype || {};
                const val = geno[locus] || '++';

                if (vals.includes(val)) {
                    available.autosomal[locus].homozygous.push(b);
                } else if (val !== '++' && val !== 'dd' && val !== 'vv') {
                    // ヘテロまたはスプリット
                    available.autosomal[locus].heterozygous.push(b);
                } else {
                    available.autosomal[locus].absent.push(b);
                }
            });
        }

        // v7.3: 伴性遺伝子 - Z_linked形式対応
        for (const [locus, vals] of Object.entries(slr)) {
            available.slr[locus] = { expressed: [], split: [], absent: [] };

            birds.forEach(b => {
                const geno = b.genotype || {};
                const val = this.getSLRGenotypeFromZLinked(geno, locus, b.sex);

                if (vals.includes(val)) {
                    available.slr[locus].expressed.push(b);
                } else if (val !== '++' && val !== '+W') {
                    // スプリット (オス only for SLR)
                    available.slr[locus].split.push(b);
                } else {
                    available.slr[locus].absent.push(b);
                }
            });
        }

        // 不足している遺伝子を特定
        const missing = [];

        for (const [locus, vals] of Object.entries(required)) {
            const avail = available.autosomal[locus];
            if (avail.homozygous.length === 0) {
                const hasHetero = avail.heterozygous.length > 0;
                missing.push({
                    type: 'autosomal',
                    locus,
                    required: vals,
                    status: hasHetero ? 'heterozygous_only' : 'absent',
                    heteroCount: avail.heterozygous.length,
                    // Dd × Dd で 25% DD が出る → 2世代で可能
                    generationsNeeded: hasHetero ? 1 : 2
                });
            }
        }

        for (const [locus, vals] of Object.entries(slr)) {
            const avail = available.slr[locus];
            if (avail.expressed.length === 0) {
                const hasSplit = avail.split.length > 0;
                missing.push({
                    type: 'slr',
                    locus,
                    required: vals,
                    status: hasSplit ? 'split_only' : 'absent',
                    splitCount: avail.split.length,
                    // スプリット♂ × 野生型♀ → 50%発現♀ (1世代)
                    generationsNeeded: hasSplit ? 1 : 2
                });
            }
        }

        // 1世代で作出可能か判定
        const canProduceInOneGen = missing.length === 0;

        // v7.1.1: 正確な世代数計算
        // 遺伝子が別々の個体に散在している場合、組み合わせに追加世代が必要
        let maxGenerationsNeeded = 1;
        if (missing.length > 0) {
            // 各遺伝子の固定に必要な世代
            const fixGenerations = Math.max(...missing.map(m => m.generationsNeeded));

            // 遺伝子が既に同一個体に存在するか確認
            const combinationNeeded = this.checkCombinationNeeded(birds, required, slr, available);

            // 基本世代 + 固定世代 + 組み合わせ世代
            maxGenerationsNeeded = fixGenerations + 1;

            // 組み合わせが必要な場合、追加世代
            if (combinationNeeded.needsCombination) {
                maxGenerationsNeeded += combinationNeeded.additionalGenerations;
            }
        }

        return {
            target,
            required,
            slr,
            available,
            missing,
            canProduceInOneGen,
            maxGenerationsNeeded: Math.min(maxGenerationsNeeded, 4),
            combinationAnalysis: missing.length > 0 ?
                this.checkCombinationNeeded(birds, required, slr, available) : null,
            totalBirds: birds.length,
            males: males.length,
            females: females.length
        };
    },

    /**
     * v7.1.1: 遺伝子の組み合わせが必要かチェック
     * 必要な遺伝子が別々の個体に散在している場合、組み合わせ世代が必要
     */
    checkCombinationNeeded(birds, required, slr, available) {
        const requiredGenes = [
            ...Object.keys(required),
            ...Object.keys(slr)
        ];

        if (requiredGenes.length <= 1) {
            return { needsCombination: false, additionalGenerations: 0 };
        }

        // 全ての必要遺伝子を持つ（または持てる）個体を探す
        let bestBird = null;
        let maxGenesInOneBird = 0;

        birds.forEach(bird => {
            const geno = bird.genotype || {};
            let genesPresent = 0;

            // 常染色体遺伝子
            for (const [locus, vals] of Object.entries(required)) {
                const val = geno[locus] || '++';
                // ホモでもヘテロでも「持っている」とカウント
                if (vals.includes(val) || (val !== '++' && val !== 'dd' && val !== 'vv')) {
                    genesPresent++;
                }
            }

            // v7.3: 伴性遺伝子 - Z_linked形式対応
            for (const [locus, vals] of Object.entries(slr)) {
                const val = this.getSLRGenotypeFromZLinked(geno, locus, bird.sex);
                if (vals.includes(val) || (val !== '++' && val !== '+W')) {
                    genesPresent++;
                }
            }

            if (genesPresent > maxGenesInOneBird) {
                maxGenesInOneBird = genesPresent;
                bestBird = bird;
            }
        });

        const totalRequired = requiredGenes.length;
        const genesScattered = totalRequired - maxGenesInOneBird;

        // 散在している遺伝子を組み合わせるのに必要な追加世代
        // 各組み合わせステップで1世代必要
        const additionalGenerations = genesScattered > 0 ? Math.ceil(genesScattered / 2) : 0;

        return {
            needsCombination: genesScattered > 0,
            additionalGenerations,
            totalRequired,
            maxGenesInOneBird,
            genesScattered,
            bestBird: bestBird ? bestBird.name : null
        };
    },

    /**
     * v7.1: 多世代計画を生成
     * @param {string} targetKey - 目標色キー
     * @returns {Object} 多世代計画（FamilyMap互換形式を含む）
     */
    planMultiGeneration(targetKey) {
        const birds = typeof BirdDB !== 'undefined' ? BirdDB.getAllBirds() : [];
        if (birds.length === 0) {
            return {
                error: this._t('bp_no_birds', 'No birds registered'),
                suggestion: this._t('bp_register_hint', 'Register birds first')
            };
        }

        const gap = this.analyzeGeneGap(targetKey, birds);
        if (gap.error) {
            return { error: gap.error };
        }

        const targetName = this.getColorName(targetKey);
        const plan = {
            targetKey,
            targetName,
            analysis: gap,
            generations: [],
            familyMapData: null,
            totalGenerations: gap.maxGenerationsNeeded
        };

        // 1世代で可能な場合は従来のplanを使用
        if (gap.canProduceInOneGen) {
            const singleGenPlan = this.plan(targetKey);
            if (!singleGenPlan.error && singleGenPlan.topPairings.length > 0) {
                plan.generations.push({
                    genNumber: 1,
                    goal: this._tp('bp_goal_produce', { name: targetName }, `Produce ${targetName}`),
                    pairings: singleGenPlan.topPairings,
                    probability: singleGenPlan.topPairings[0].probability
                });
                plan.familyMapData = this.convertToFamilyMapFormat(plan, birds);
                return plan;
            }
        }

        // 多世代計画を構築
        const intermediateGoals = this.generateIntermediateGoals(gap, targetKey);

        let currentGen = gap.maxGenerationsNeeded;

        for (const intGoal of intermediateGoals) {
            const genPlan = {
                genNumber: currentGen,
                goal: intGoal.description,
                targetGene: intGoal.locus,
                targetValue: intGoal.targetValue,
                strategy: intGoal.strategy,
                pairings: this.findBestPairingsForGene(intGoal, birds),
                probability: intGoal.probability
            };
            plan.generations.push(genPlan);
            currentGen--;
        }

        // 最終世代（目標作出）- より具体的な説明を追加
        const finalGenPairings = [];

        // 中間世代で作出する遺伝子型の説明を生成
        const requiredFromPrevious = intermediateGoals.map(g => g.locus.toUpperCase()).join(' + ');

        // 最終世代で必要な親の説明
        const sireDesc = requiredFromPrevious
            ? this._tp('bp_offspring_with_gene', { gene: requiredFromPrevious }, `${requiredFromPrevious} offspring`)
            : this._t('bp_intermediate_bird', 'Intermediate bird');
        const damDesc = requiredFromPrevious
            ? this._tp('bp_offspring_with_gene', { gene: requiredFromPrevious }, `${requiredFromPrevious} offspring`)
            : this._t('bp_intermediate_bird', 'Intermediate bird');

        // プレースホルダーペアリングを追加
        finalGenPairings.push({
            male: { name: `Gen${currentGen + 1} ${sireDesc} ♂`, isPlanned: true, geneLabel: requiredFromPrevious },
            female: { name: `Gen${currentGen + 1} ${damDesc} ♀`, isPlanned: true, geneLabel: requiredFromPrevious },
            probability: this.calculateFinalProbability(intermediateGoals),
            recommendation: this._tp('bp_select_offspring',
                { gene: requiredFromPrevious, gen: currentGen + 1 },
                `Select ${requiredFromPrevious} offspring from Generation ${currentGen + 1}`)
        });

        plan.generations.push({
            genNumber: 1,
            goal: this._tp('bp_goal_produce', { name: targetName }, `Produce ${targetName}`),
            note: this._tp('bp_final_breeding_note',
                { gene: requiredFromPrevious, gen: currentGen + 1 },
                `Breed ${requiredFromPrevious} individuals from Gen ${currentGen + 1} together`),
            pairings: finalGenPairings,
            probability: 'Variable'
        });

        // FamilyMap形式に変換
        plan.familyMapData = this.convertToFamilyMapFormat(plan, birds);

        return plan;
    },

    /**
     * v7.1: 中間目標を生成
     */
    generateIntermediateGoals(gap, targetKey) {
        const goals = [];

        for (const m of gap.missing) {
            if (m.type === 'autosomal') {
                if (m.status === 'heterozygous_only') {
                    // Dd × Dd → DD (25%)
                    goals.push({
                        locus: m.locus,
                        targetValue: m.required[0],
                        description: this._tp('bp_fix_gene', { gene: m.locus.toUpperCase() },
                            `Fix ${m.locus.toUpperCase()} (homozygous)`),
                        strategy: 'hetero_x_hetero',
                        probability: 0.25,
                        generationOffset: 1
                    });
                } else if (m.status === 'absent') {
                    // 遺伝子そのものがない → 導入が必要
                    goals.push({
                        locus: m.locus,
                        targetValue: m.required[0],
                        description: this._tp('bp_introduce_gene', { gene: m.locus.toUpperCase() },
                            `Introduce ${m.locus.toUpperCase()} gene`),
                        strategy: 'need_introduction',
                        probability: 0,
                        generationOffset: 2,
                        needsNewBlood: true
                    });
                }
            } else if (m.type === 'slr') {
                if (m.status === 'split_only') {
                    // スプリット♂ × 野生型♀ → 50%発現♀
                    goals.push({
                        locus: m.locus,
                        targetValue: m.required[0],
                        description: this._tp('bp_express_slr', { gene: m.locus.toUpperCase() },
                            `Express ${m.locus.toUpperCase()} in female`),
                        strategy: 'split_male_x_wild_female',
                        probability: 0.5,
                        generationOffset: 1
                    });
                } else if (m.status === 'absent') {
                    goals.push({
                        locus: m.locus,
                        targetValue: m.required[0],
                        description: this._tp('bp_introduce_slr_gene', { gene: m.locus.toUpperCase() },
                            `Introduce ${m.locus.toUpperCase()} (SLR)`),
                        strategy: 'need_introduction',
                        probability: 0,
                        generationOffset: 2,
                        needsNewBlood: true
                    });
                }
            }
        }

        // 優先度でソート（導入が必要なものを先に）
        goals.sort((a, b) => b.generationOffset - a.generationOffset);

        return goals;
    },

    /**
     * v7.3.2: 最終世代の確率を計算
     * 各中間目標の確率を掛け合わせる
     */
    calculateFinalProbability(intermediateGoals) {
        if (!intermediateGoals || intermediateGoals.length === 0) return 1.0;

        // 各段階の確率を掛け合わせる
        let prob = 1.0;
        for (const goal of intermediateGoals) {
            if (goal.probability > 0) {
                prob *= goal.probability;
            }
        }
        return prob;
    },

    /**
     * v7.1: 特定遺伝子を得るための最適ペアリングを探す
     */
    findBestPairingsForGene(goal, birds) {
        if (goal.needsNewBlood) {
            return [{
                recommendation: '🔴 ' + this._t('bp_need_new_bird', 'Need to acquire bird with this gene'),
                probability: 0
            }];
        }

        const males = birds.filter(b => b.sex === 'male');
        const females = birds.filter(b => b.sex === 'female');
        const pairings = [];

        if (goal.strategy === 'hetero_x_hetero') {
            // Dd × Dd を探す
            const heteroMales = males.filter(b => {
                const val = (b.genotype || {})[goal.locus] || '++';
                return val !== '++' && !goal.targetValue.includes(val);
            });
            const heteroFemales = females.filter(b => {
                const val = (b.genotype || {})[goal.locus] || '++';
                return val !== '++' && !goal.targetValue.includes(val);
            });

            heteroMales.forEach(m => {
                heteroFemales.forEach(f => {
                    // 近交係数チェック
                    let ic = 0;
                    if (typeof BreedingValidator !== 'undefined') {
                        ic = BreedingValidator.calcInbreedingCoefficient(m, f);
                    }
                    if (ic < this.INBREEDING_THRESHOLD) {
                        pairings.push({
                            male: m,
                            female: f,
                            probability: 0.25,
                            inbreedingCoef: ic,
                            recommendation: `${m.name} × ${f.name} → 25% ${goal.locus.toUpperCase()}`
                        });
                    }
                });
            });
        }

        if (goal.strategy === 'split_male_x_wild_female') {
            // v7.3: スプリット♂を探す - Z_linked形式対応
            const splitMales = males.filter(b => {
                const val = this.getSLRGenotypeFromZLinked(b.genotype || {}, goal.locus, 'male');
                return val !== '++' && val !== '+W';
            });

            splitMales.forEach(m => {
                females.forEach(f => {
                    let ic = 0;
                    if (typeof BreedingValidator !== 'undefined') {
                        ic = BreedingValidator.calcInbreedingCoefficient(m, f);
                    }
                    if (ic < this.INBREEDING_THRESHOLD) {
                        pairings.push({
                            male: m,
                            female: f,
                            probability: 0.5,
                            inbreedingCoef: ic,
                            recommendation: `${m.name} (split) × ${f.name} → 50% ${goal.locus.toUpperCase()} ♀`
                        });
                    }
                });
            });
        }

        // スコア順でソート
        pairings.sort((a, b) => b.probability - a.probability || a.inbreedingCoef - b.inbreedingCoef);

        return pairings.slice(0, 3);
    },

    /**
     * v7.1.2: 計画をFamilyMap形式に変換（目標を子として逆算）
     * G0: 目標個体（作出予定）
     * G1: 親（最終交配ペア）
     * G2: 祖父母（中間世代1）
     * G3: 曾祖父母（中間世代2）
     */
    convertToFamilyMapFormat(plan, birds) {
        const data = {
            name: `${plan.targetName} ${this._t('bp_breeding_plan', 'Breeding Plan')}`,
            savedAt: new Date().toISOString(),
            isBreedingPlan: true,
            targetKey: plan.targetKey,
            totalGenerations: plan.totalGenerations,
            // G0: 目標（作出予定）
            offspring: [{
                id: 'plan_target',
                name: `🎯 ${plan.targetName}`,
                sex: 'unknown',
                phenotype: { baseColor: plan.targetKey },
                genotype: plan.analysis.target.required,
                isPlanned: true,
                isTarget: true
            }],
            // G1-G3: 初期化
            sire: null, dam: null,
            sire_sire: null, sire_dam: null,
            dam_sire: null, dam_dam: null,
            sire_sire_sire: null, sire_sire_dam: null,
            sire_dam_sire: null, sire_dam_dam: null,
            dam_sire_sire: null, dam_sire_dam: null,
            dam_dam_sire: null, dam_dam_dam: null
        };

        // 世代ごとのペアリングをFamilyMapの位置にマッピング
        // Gen1 → sire/dam
        // Gen2 → sire_sire/sire_dam (sireを作る) または dam_sire/dam_dam (damを作る)
        // Gen3 → great-grandparents

        const generations = plan.generations || [];

        // 最終世代（Gen1）: 目標を直接作出するペア
        const gen1 = generations.find(g => g.genNumber === 1);
        if (gen1 && gen1.pairings && gen1.pairings.length > 0) {
            const topPair = gen1.pairings[0];
            if (topPair.male) {
                // v7.3.2: isPlanned フラグをチェック
                if (topPair.male.isPlanned) {
                    data.sire = this.createPlannedBird('sire', topPair.male.geneLabel || gen1.targetGene, '♂', 1);
                    data.sire.name = topPair.male.name || data.sire.name;
                } else {
                    data.sire = this.birdToFamilyMapFormat(topPair.male, 'sire', false);
                }
            } else {
                // 中間個体（まだ作出されていない）
                data.sire = this.createPlannedBird('sire', gen1.targetGene, '♂', 1);
            }
            if (topPair.female) {
                // v7.3.2: isPlanned フラグをチェック
                if (topPair.female.isPlanned) {
                    data.dam = this.createPlannedBird('dam', topPair.female.geneLabel || gen1.targetGene, '♀', 1);
                    data.dam.name = topPair.female.name || data.dam.name;
                } else {
                    data.dam = this.birdToFamilyMapFormat(topPair.female, 'dam', false);
                }
            } else {
                data.dam = this.createPlannedBird('dam', gen1.targetGene, '♀', 1);
            }
        }

        // 第2世代（Gen2）: G1の親を作出するペア
        const gen2 = generations.find(g => g.genNumber === 2);
        if (gen2 && gen2.pairings && gen2.pairings.length > 0) {
            const pair = gen2.pairings[0];
            if (pair.male && pair.female) {
                // sireの親として配置
                data.sire_sire = this.birdToFamilyMapFormat(pair.male, 'sire_sire', true);
                data.sire_dam = this.birdToFamilyMapFormat(pair.female, 'sire_dam', true);

                // sireが未作出の場合、プランとしてマーク
                if (data.sire && !data.sire.isExisting) {
                    data.sire.fromPairing = { sire: pair.male.name, dam: pair.female.name };
                }
            } else if (pair.recommendation) {
                // 導入が必要な場合
                data.sire_sire = this.createPlannedBird('sire_sire', gen2.targetGene, '♂', 2, pair.recommendation);
            }
        }

        // 第3世代（Gen3）: G2の親を作出するペア
        const gen3 = generations.find(g => g.genNumber === 3);
        if (gen3 && gen3.pairings && gen3.pairings.length > 0) {
            const pair = gen3.pairings[0];
            if (pair.male && pair.female) {
                data.sire_sire_sire = this.birdToFamilyMapFormat(pair.male, 'sire_sire_sire', true);
                data.sire_sire_dam = this.birdToFamilyMapFormat(pair.female, 'sire_sire_dam', true);
            }
        }

        // 第4世代（Gen4）: 最大4世代
        const gen4 = generations.find(g => g.genNumber === 4);
        if (gen4 && gen4.pairings && gen4.pairings.length > 0) {
            // G4は表示限界外だが、メモとして保存
            data.gen4Note = gen4.goal;
        }

        return data;
    },

    /**
     * v7.1.2: 作出予定の個体を作成
     */
    createPlannedBird(position, targetGene, sex, generation, note) {
        const sexLabel = sex === '♂' ? 'male' : 'female';
        return {
            id: `plan_${position}`,
            name: `📋 ${this._t('bp_planned_bird', 'Planned')} (G${generation})`,
            sex: sexLabel,
            phenotype: { baseColor: 'unknown' },
            genotype: {},
            position: position,
            isPlanned: true,
            isExisting: false,
            targetGene: targetGene,
            generation: generation,
            note: note || null
        };
    },

    /**
     * v7.1.2: 鳥データをFamilyMap用にフォーマット
     */
    birdToFamilyMapFormat(bird, position, isFoundation) {
        // BirdDBのデータは observed に羽色情報を持つ
        const phenotype = bird.phenotype || bird.observed || { baseColor: 'unknown' };
        return {
            id: bird.id,
            name: bird.name,
            sex: bird.sex,
            phenotype: phenotype,
            genotype: bird.genotype || {},
            position: position,
            isExisting: true,
            isFoundation: isFoundation || false
        };
    }
};

/**
 * v7.1: runPlanner() - 多世代計画対応版
 * 1世代で不可能な場合は多世代計画を表示
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

    // v7.1: まず多世代計画を試行
    const multiGenPlan = BreedingPlanner.planMultiGeneration(targetKey);

    if (multiGenPlan.error) {
        let errorHtml = `<div class="empty-state" style="color: #333 !important;"><p style="color: #333 !important;">⚠️ ${multiGenPlan.error}</p>`;
        if (multiGenPlan.suggestion) errorHtml += `<p style="color: #333 !important;">${multiGenPlan.suggestion}</p>`;
        errorHtml += '</div>';
        resultPanel.innerHTML = errorHtml;
        resultPanel.style.display = 'block';
        return;
    }

    const targetName = multiGenPlan.targetName;
    const analysis = multiGenPlan.analysis;

    let html = `<div class="output-header"><span class="output-title" style="color: #4fc3f7 !important;">🎯 ${targetName} ${_t('bp_production_plan', 'Production Plan')}</span></div>`;

    // v7.1: 遺伝子ギャップ分析を表示
    if (analysis && analysis.missing && analysis.missing.length > 0) {
        html += `<div class="gene-gap-analysis" style="background: #fff3cd !important; border: 1px solid #ffc107 !important; padding: 12px; border-radius: 8px; margin-bottom: 15px; color: #333 !important;">`;
        html += `<h4 style="margin-top:0; color: #856404 !important;">📊 ${_t('bp_gene_analysis', 'Gene Analysis')}</h4>`;
        html += `<p style="color: #333 !important;"><strong style="color: #333 !important;">${_t('bp_generations_needed', 'Generations needed')}:</strong> ${multiGenPlan.totalGenerations}</p>`;
        html += `<p style="color: #333 !important;"><strong style="color: #333 !important;">${_t('bp_missing_genes', 'Missing genes')}:</strong></p><ul style="margin: 5px 0; padding-left: 20px; color: #333 !important;">`;

        analysis.missing.forEach(m => {
            const locusName = m.locus.toUpperCase();
            const statusText = m.status === 'heterozygous_only'
                ? _t('bp_hetero_only', 'heterozygous only (can fix in 1 gen)')
                : m.status === 'split_only'
                    ? _t('bp_split_only', 'split males only (can express in 1 gen)')
                    : _t('bp_gene_absent', 'absent (need to introduce)');
            html += `<li style="color: #333 !important;"><strong style="color: #333 !important;">${locusName}</strong>: ${statusText}</li>`;
        });
        html += `</ul>`;

        // v7.1.1: 組み合わせ分析を表示
        if (analysis.combinationAnalysis && analysis.combinationAnalysis.needsCombination) {
            const combo = analysis.combinationAnalysis;
            html += `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ffc107 !important;">`;
            html += `<p style="color: #333 !important;"><strong style="color: #333 !important;">🔗 ${_t('bp_combination_needed', 'Gene combination needed')}:</strong></p>`;
            html += `<p style="font-size: 0.9em; color: #856404 !important;">`;
            html += _t('bp_genes_scattered', '{scattered} genes are on different birds. Need {gens} extra generation(s) to combine.')
                .replace('{scattered}', combo.genesScattered)
                .replace('{gens}', combo.additionalGenerations);
            html += `</p>`;
            if (combo.bestBird) {
                html += `<p style="font-size: 0.9em; color: #333 !important;">`;
                html += `${_t('bp_best_foundation', 'Best foundation bird')}: <strong style="color: #333 !important;">${combo.bestBird}</strong> (${combo.maxGenesInOneBird}/${combo.totalRequired} ${_t('bp_genes', 'genes')})`;
                html += `</p>`;
            }
            html += `</div>`;
        }
        html += `</div>`;
    } else if (analysis && analysis.canProduceInOneGen) {
        html += `<div style="background: #d4edda !important; border: 1px solid #28a745 !important; padding: 10px; border-radius: 8px; margin-bottom: 15px;">`;
        html += `<p style="margin:0; color: #155724 !important;">✅ ${_t('bp_one_gen_possible', 'Can be produced in 1 generation!')}</p>`;
        html += `</div>`;
    }

    // v7.1: 各世代の計画を表示
    if (multiGenPlan.generations && multiGenPlan.generations.length > 0) {
        html += `<div class="generation-plans">`;

        // 世代番号の大きい順（早い世代から）に表示
        const sortedGens = [...multiGenPlan.generations].sort((a, b) => b.genNumber - a.genNumber);

        sortedGens.forEach(gen => {
            const genLabel = gen.genNumber === 1
                ? _t('bp_final_generation', 'Final Generation')
                : _t('bp_generation_n', `Generation ${gen.genNumber}`).replace('{n}', gen.genNumber);

            html += `<div class="generation-card" style="border: 1px solid #dee2e6 !important; border-radius: 8px; padding: 12px; margin-bottom: 10px; background: #fff !important; color: #333 !important;">`;
            html += `<h4 style="margin-top: 0; border-bottom: 1px solid #eee !important; padding-bottom: 8px; color: #333 !important;">📅 ${genLabel}</h4>`;
            html += `<p style="color: #333 !important;"><strong style="color: #333 !important;">${_t('bp_goal', 'Goal')}:</strong> ${gen.goal}</p>`;

            if (gen.note) {
                html += `<p style="color: #666 !important; font-style: italic;">${gen.note}</p>`;
            }

            if (gen.pairings && gen.pairings.length > 0) {
                html += `<div class="pairing-list">`;
                gen.pairings.forEach((p, i) => {
                    if (p.male && p.female) {
                        const icPercent = ((p.inbreedingCoef || 0) * 100).toFixed(2);
                        // インラインスタイルでIC値の色を設定（CSSクラスに依存しない）
                        const icColor = (p.inbreedingCoef || 0) >= 0.125 ? '#d32f2f' : ((p.inbreedingCoef || 0) >= 0.0625 ? '#f57c00' : '#388e3c');

                        html += `<div class="pairing-card" style="background: #f8f9fa !important; padding: 10px; margin: 5px 0; border-radius: 5px; color: #333 !important;">`;
                        html += `<div class="pairing-header" style="color: #333 !important; font-weight: bold;">#${i+1} ♂${p.male.name} × ♀${p.female.name}</div>`;
                        html += `<div class="pairing-stats" style="color: #333 !important;">${_t('bp_probability', 'Probability')}: ${((p.probability || 0)*100).toFixed(1)}% | <span style="color: ${icColor} !important; font-weight: bold;">${_t('bp_f_value', 'F-value')}: ${icPercent}%</span></div>`;
                        if (p.recommendation) {
                            html += `<div class="pairing-recommendation" style="color: #495057 !important;">${p.recommendation}</div>`;
                        }
                        html += '</div>';
                    } else if (p.recommendation) {
                        html += `<div class="pairing-card" style="background: #f8d7da !important; padding: 10px; margin: 5px 0; border-radius: 5px; color: #333 !important;">`;
                        html += `<p style="margin: 0; color: #333 !important;">${p.recommendation}</p>`;
                        html += '</div>';
                    }
                });
                html += '</div>';
            }
            html += '</div>';
        });

        html += '</div>';
    }

    // v7.1: FamilyMapで開くボタン
    if (multiGenPlan.familyMapData) {
        html += `<div style="margin-top: 15px; text-align: center;">`;
        html += `<button onclick="openPlanInFamilyMap()" class="btn btn-primary" style="padding: 10px 20px; background: #1565c0 !important; color: #fff !important; border: none;">`;
        html += `📊 ${_t('bp_open_in_familymap', 'Open in FamilyMap')}</button>`;
        html += `</div>`;

        // グローバルに保存して FamilyMap で使えるように
        window._currentBreedingPlan = multiGenPlan.familyMapData;
    }

    // v6.7.4: 倫理基準の説明を追加
    html += `<div class="ethics-note" style="margin-top: 15px; padding: 10px; background: #f5f5f5 !important; border-radius: 5px; font-size: 0.85em; border: 1px solid #ddd !important; color: #333 !important;">`;
    html += `<p style="margin: 0; color: #333 !important;">📋 <strong style="color: #333 !important;">${_t('bp_ethics_standard', 'Ethical Standards')}:</strong> ${_t('bp_ethics_description', 'Pairs with IC ≥12.5% are excluded (Thoroughbred rules)')}</p>`;
    html += `</div>`;

    resultPanel.innerHTML = html;
    resultPanel.style.display = 'block';
}

/**
 * v7.1: 計画をFamilyMapタブで開く
 */
function openPlanInFamilyMap() {
    if (!window._currentBreedingPlan) {
        alert('No breeding plan available');
        return;
    }

    // FamilyMapにデータをロード
    if (typeof FamilyMap !== 'undefined') {
        FamilyMap.data = window._currentBreedingPlan;
        FamilyMap.familyMode = 'plan';
        FamilyMap.renderUI();

        // FamilyMapタブに切り替え
        if (typeof showTab === 'function') {
            showTab('family');
        }
    }
}
