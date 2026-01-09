/**
 * Agapornis Gene-Forge v7.0.0
 * 目標逆算計画エンジン (Target Breeding Planner)
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
 * 
 * v6.7.3変更点:
 * - 32色対応
 * - blue系→aqua系に改名
 * - albino→pure_white
 * - creamino追加（INO系・赤目）- パリッドブルーとは別物
 * - ALBS Peachfaced部門準拠
 * - parblue短縮形統一: bb→aqaq, tqb→tqaq, +b→+aq
 */
const BreedingPlanner = {
    
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
        
        // シナモン系（茶色メラニン）4色 - v7.0: SSOT準拠キー
        cinnamon_green: { required: { parblue: ['++'] }, slr: { cinnamon: ['cincin', 'cinW'] }, minGen: 2, difficulty: 'mid' },
        cinnamon_aqua: { required: { parblue: ['aqaq'] }, slr: { cinnamon: ['cincin', 'cinW'] }, minGen: 3, difficulty: 'mid' },
        cinnamon_turquoise: { required: { parblue: ['tqtq'] }, slr: { cinnamon: ['cincin', 'cinW'] }, minGen: 3, difficulty: 'mid' },
        cinnamon_seagreen: { required: { parblue: ['tqaq'] }, slr: { cinnamon: ['cincin', 'cinW'] }, minGen: 3, difficulty: 'mid' },

        // オパーリン系（模様変化）4色 - v7.0: SSOT準拠キー
        opaline_green: { required: { parblue: ['++'] }, slr: { opaline: ['opop', 'opW'] }, minGen: 2, difficulty: 'mid' },
        opaline_aqua: { required: { parblue: ['aqaq'] }, slr: { opaline: ['opop', 'opW'] }, minGen: 3, difficulty: 'mid' },
        opaline_turquoise: { required: { parblue: ['tqtq'] }, slr: { opaline: ['opop', 'opW'] }, minGen: 3, difficulty: 'mid' },
        opaline_seagreen: { required: { parblue: ['tqaq'] }, slr: { opaline: ['opop', 'opW'] }, minGen: 3, difficulty: 'mid' },

        // フォロー系（赤目）2色 - v7.0: SSOT準拠キー
        fallow_green: { required: { parblue: ['++'], fallow_pale: ['flpflp'] }, slr: {}, minGen: 2, difficulty: 'mid', inbreedingLimit: 2 },
        fallow_aqua: { required: { parblue: ['aqaq'], fallow_pale: ['flpflp'] }, slr: {}, minGen: 3, difficulty: 'mid', inbreedingLimit: 2 },

        // パイド系（まだら模様）4色 - v7.0: SSOT準拠キー
        pied_green: { required: { parblue: ['++'], pied_rec: ['pipi'] }, slr: {}, minGen: 2, difficulty: 'mid' },
        pied_aqua: { required: { parblue: ['aqaq'], pied_rec: ['pipi'] }, slr: {}, minGen: 3, difficulty: 'mid' },
        pied_turquoise: { required: { parblue: ['tqtq'], pied_rec: ['pipi'] }, slr: {}, minGen: 3, difficulty: 'mid' },
        pied_seagreen: { required: { parblue: ['tqaq'], pied_rec: ['pipi'] }, slr: {}, minGen: 3, difficulty: 'mid' },
        
        // レガシー互換（旧版からの移行用）- v7.0: SSOT準拠キー
        blue: { required: { parblue: ['aqaq'], dark: ['dd'] }, slr: {}, minGen: 1, difficulty: 'low', legacy: true },
        cobalt: { required: { parblue: ['aqaq'], dark: ['Dd'] }, slr: {}, minGen: 2, difficulty: 'mid', legacy: true },
        mauve: { required: { parblue: ['aqaq'], dark: ['DD'] }, slr: {}, minGen: 3, difficulty: 'mid', legacy: true },
        albino: { required: { parblue: ['tqtq'] }, slr: { ino: ['inoino', 'inoW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2, legacy: true },
        pallid_blue: { required: { parblue: ['aqaq'] }, slr: { ino: ['pldpld', 'pldW'] }, minGen: 3, difficulty: 'high', inbreedingLimit: 2, legacy: true },
        cinnamon_blue: { required: { parblue: ['aqaq'] }, slr: { cinnamon: ['cincin', 'cinW'] }, minGen: 3, difficulty: 'mid', legacy: true },
        opaline_blue: { required: { parblue: ['aqaq'] }, slr: { opaline: ['opop', 'opW'] }, minGen: 3, difficulty: 'mid', legacy: true },
        fallow_blue: { required: { parblue: ['aqaq'], fallow_pale: ['flpflp'] }, slr: {}, minGen: 3, difficulty: 'mid', inbreedingLimit: 2, legacy: true },
        pied_blue: { required: { parblue: ['aqaq'], pied_rec: ['pipi'] }, slr: {}, minGen: 3, difficulty: 'mid', legacy: true }
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
     * v7.0: COLOR_MASTERのgenotypeから要件を動的生成
     * TARGET_REQUIREMENTSに定義がない色に対応
     */
    deriveRequirementsFromGenotype(targetKey) {
        if (typeof COLOR_MASTER === 'undefined') return null;
        const colorDef = COLOR_MASTER[targetKey];
        if (!colorDef || !colorDef.genotype) return null;

        const geno = colorDef.genotype;
        const required = {};
        const slr = {};
        let minGen = 0;
        let inbreedingLimit = null;

        // 常染色体遺伝子座
        const autosomalLoci = ['parblue', 'dark', 'violet', 'pied_dom', 'pied_rec', 'dilute', 'edged', 'orangeface', 'pale_headed', 'fallow_pale', 'fallow_bronze'];
        // 伴性遺伝子座
        const sexLinkedLoci = ['ino', 'opaline', 'cinnamon'];

        autosomalLoci.forEach(locus => {
            const val = geno[locus];
            if (val && val !== '++' && val !== 'dd' && val !== 'vv') {
                required[locus] = [val];
                minGen = Math.max(minGen, val.includes('D') ? 1 : 2);
            }
        });

        sexLinkedLoci.forEach(locus => {
            const val = geno[locus];
            if (val && val !== '++' && val !== '+W') {
                slr[locus] = [val];
                minGen = Math.max(minGen, 2);
                // INO/パリッド系は近親制限
                if (locus === 'ino' && (val.includes('ino') || val.includes('pld'))) {
                    inbreedingLimit = 2;
                }
            }
        });

        // darkの処理
        if (geno.dark === 'Dd') {
            required.dark = ['Dd'];
            minGen = Math.max(minGen, 1);
        } else if (geno.dark === 'DD') {
            required.dark = ['DD'];
            minGen = Math.max(minGen, 2);
        }

        return {
            required,
            slr,
            minGen,
            difficulty: minGen <= 1 ? 'low' : minGen <= 2 ? 'mid' : 'high',
            inbreedingLimit,
            derived: true  // 動的生成フラグ
        };
    },

    plan(targetKey) {
        let target = this.TARGET_REQUIREMENTS[targetKey];

        // v7.0: TARGET_REQUIREMENTSにない場合、COLOR_MASTERから動的生成
        if (!target) {
            target = this.deriveRequirementsFromGenotype(targetKey);
            if (!target) {
                return { error: '未対応の目標形質です' };
            }
        }
        const birds = typeof BirdDB !== 'undefined' ? BirdDB.getAllBirds() : [];
        if (birds.length === 0) return { error: '個体が登録されていません', suggestion: '「個体管理」タブで手持ち個体を登録してください' };
        const males = birds.filter(b => b.sex === 'male'), females = birds.filter(b => b.sex === 'female');
        if (males.length === 0 || females.length === 0) return { error: 'オスとメスが両方必要です', suggestion: `現在: オス ${males.length}羽, メス ${females.length}羽` };
        
        let pairings = [];
        males.forEach(m => females.forEach(f => pairings.push(this.evaluatePairing(m, f, target, targetKey))));
        
        // v6.7.4: 近親交配フィルタリング
        pairings = this.filterByInbreeding(pairings);
        
        pairings.sort((a, b) => b.score - a.score);
        
        // v6.7.4: フィルタリング後に候補がない場合
        if (pairings.length === 0) {
            return { 
                error: '倫理基準を満たすペアがありません', 
                suggestion: '近交係数12.5%未満のペアが存在しません。別血統の個体を導入してください。',
                filteredOut: true
            };
        }
        
        // v6.7.5: targetNameをCOLOR_LABELSから取得
        const targetName = this.getColorName(targetKey);
        
        return { 
            target, 
            targetKey,
            targetName,  // v6.7.5: SSOT対応
            topPairings: pairings.slice(0, 5), 
            allPairings: pairings, 
            roadmap: this.generateRoadmap(pairings[0], target, targetKey, []), 
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
        
        // v6.7.4: 近交係数による推奨メッセージ (v7.0 i18n対応)
        let recommendation;
        const _t = (k, fb) => (typeof T !== 'undefined' && T[k]) ? T[k] : fb;
        if (!canBreed) {
            recommendation = '🚫 ' + _t('planner_breeding_prohibited', 'Breeding Prohibited');
        } else if (inbreedingCoef >= this.INBREEDING_THRESHOLD) {
            recommendation = '⚠️ ' + _t('planner_ethics_warning', 'Prohibited in thoroughbred breeding');
        } else if (prob >= 0.5) {
            recommendation = '🌟 ' + _t('planner_optimal_pair', 'Optimal Pair');
        } else if (prob > 0) {
            recommendation = '✓ ' + _t('planner_possible', 'Possible');
        } else {
            recommendation = '✗ ' + _t('planner_low_contribution', 'Low contribution to goal');
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
    
    generateRoadmap(topPairing, target, targetKey, missingGenes) {
        const _t = (k, fb) => (typeof T !== 'undefined' && T[k]) ? T[k] : fb;
        if (!topPairing) return [{ generation: 0, action: _t('planner_no_pairs', 'No breedable pairs available'), goal: _t('planner_introduce_healthy', 'Please introduce healthy individuals') }];
        // v6.7.5: COLOR_LABELSから色名取得
        const targetName = this.getColorName(targetKey);
        const goalText = _t('planner_produce_goal', 'Produce {target}').replace('{target}', targetName);
        return [{ generation: 1, action: `${topPairing.male.name} × ${topPairing.female.name}`, goal: goalText, probability: `${(topPairing.probability * 100).toFixed(1)}%` }];
    }
};

/**
 * v6.7.5: runPlanner() - SSOT対応版
 * 表示時はCOLOR_LABELSから色名を取得
 */
function runPlanner() {
    const _t = (k, fb) => (typeof T !== 'undefined' && T[k]) ? T[k] : fb;
    const targetSelect = document.getElementById('plannerTarget'), resultPanel = document.getElementById('plannerResult');
    if (!targetSelect || !resultPanel) return;
    const targetKey = targetSelect.value;
    if (!targetKey) { alert(_t('planner_select_target', 'Please select a target trait')); return; }
    const result = BreedingPlanner.plan(targetKey);

    if (result.error) {
        let errorHtml = `<div class="empty-state"><p>⚠️ ${result.error}</p>`;
        if (result.suggestion) errorHtml += `<p>${result.suggestion}</p>`;
        // v6.7.4: フィルタリングによる候補なしの場合の追加メッセージ
        if (result.filteredOut) {
            errorHtml += `<p style="color: #666; font-size: 0.9em;">※ ${_t('planner_filtered_note', 'Pairs with inbreeding coefficient ≥12.5% are excluded per ethics standards')}</p>`;
        }
        errorHtml += '</div>';
        resultPanel.innerHTML = errorHtml;
        resultPanel.style.display = 'block';
        return;
    }
    
    // v6.7.5: targetNameはresultから取得（SSOT対応）
    const targetName = result.targetName;
    const planTitle = _t('planner_plan_title', '{target} Breeding Plan').replace('{target}', targetName);
    const topPairingsLabel = _t('planner_top_pairings', 'Recommended Pairings TOP5');
    const probLabel = _t('planner_probability', 'Prob');
    const fValueLabel = _t('planner_f_value', 'F-value');

    let html = `<div class="output-header"><span class="output-title">🎯 ${planTitle}</span></div>`;
    html += `<h4>🏆 ${topPairingsLabel}</h4><div class="pairing-list">`;
    result.topPairings.forEach((p, i) => {
        // v6.7.4: 近交係数表示の強化
        const icPercent = (p.inbreedingCoef * 100).toFixed(2);
        const icClass = p.inbreedingCoef >= 0.125 ? 'ic-warning' : (p.inbreedingCoef >= 0.0625 ? 'ic-caution' : 'ic-safe');

        html += `<div class="pairing-card ${p.canBreed ? '' : 'pairing-blocked'}">`;
        html += `<div class="pairing-header">#${i+1} ♂${p.male.name} × ♀${p.female.name} ${!p.canBreed ? '🚫' : ''}</div>`;
        html += `<div class="pairing-stats">${probLabel}: ${(p.probability*100).toFixed(1)}% | <span class="${icClass}">${fValueLabel}: ${icPercent}%</span></div>`;
        html += `<div class="pairing-recommendation">${p.recommendation}</div>`;
        if (p.warnings.length > 0) {
            html += `<div class="pairing-warnings">${p.warnings.join('<br>')}</div>`;
        }
        html += '</div>';
    });
    html += '</div>';

    // v6.7.4: 倫理基準の説明を追加
    const ethicsLabel = _t('planner_ethics_label', 'Ethics Standard');
    const ethicsNote = _t('planner_ethics_note', 'Pairs with inbreeding coefficient ≥12.5% are excluded (Thoroughbred rules)');
    html += `<div class="ethics-note" style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-size: 0.85em;">`;
    html += `<p>📋 <strong>${ethicsLabel}:</strong> ${ethicsNote}</p>`;
    html += `</div>`;
    
    resultPanel.innerHTML = html; 
    resultPanel.style.display = 'block';
}
