/**
 * Agapornis Gene-Forge v6.7.5
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
    
    plan(targetKey) {
        const target = this.TARGET_REQUIREMENTS[targetKey];
        if (!target) return { error: '未対応の目標形質です' };
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
        
        // v6.7.4: 近交係数による推奨メッセージ
        let recommendation;
        if (!canBreed) {
            recommendation = '🚫 繁殖禁止';
        } else if (inbreedingCoef >= this.INBREEDING_THRESHOLD) {
            recommendation = '⚠️ 競走馬では禁忌とされる配合';
        } else if (prob >= 0.5) {
            recommendation = '🌟 最適ペア';
        } else if (prob > 0) {
            recommendation = '✓ 可能';
        } else {
            recommendation = '✗ 目標への貢献度低';
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
        if (!topPairing) return [{ generation: 0, action: '繁殖可能なペアがありません', goal: '健康リスクの低い個体を導入してください' }];
        // v6.7.5: COLOR_LABELSから色名取得
        const targetName = this.getColorName(targetKey);
        return [{ generation: 1, action: `${topPairing.male.name} × ${topPairing.female.name}`, goal: targetName + 'の作出', probability: `${(topPairing.probability * 100).toFixed(1)}%` }];
    }
};

/**
 * v6.7.5: runPlanner() - SSOT対応版
 * 表示時はCOLOR_LABELSから色名を取得
 */
function runPlanner() {
    const targetSelect = document.getElementById('plannerTarget'), resultPanel = document.getElementById('plannerResult');
    if (!targetSelect || !resultPanel) return;
    const targetKey = targetSelect.value;
    if (!targetKey) { alert('目標形質を選択してください'); return; }
    const result = BreedingPlanner.plan(targetKey);
    
    if (result.error) { 
        let errorHtml = `<div class="empty-state"><p>⚠️ ${result.error}</p>`;
        if (result.suggestion) errorHtml += `<p>${result.suggestion}</p>`;
        // v6.7.4: フィルタリングによる候補なしの場合の追加メッセージ
        if (result.filteredOut) {
            errorHtml += `<p style="color: #666; font-size: 0.9em;">※ 近交係数12.5%以上のペアは倫理基準により候補から除外されています</p>`;
        }
        errorHtml += '</div>';
        resultPanel.innerHTML = errorHtml; 
        resultPanel.style.display = 'block'; 
        return; 
    }
    
    // v6.7.5: targetNameはresultから取得（SSOT対応）
    const targetName = result.targetName;
    
    let html = `<div class="output-header"><span class="output-title">🎯 ${targetName} 作出計画</span></div>`;
    html += '<h4>🏆 推奨ペアリング TOP5</h4><div class="pairing-list">';
    result.topPairings.forEach((p, i) => {
        // v6.7.4: 近交係数表示の強化
        const icPercent = (p.inbreedingCoef * 100).toFixed(2);
        const icClass = p.inbreedingCoef >= 0.125 ? 'ic-warning' : (p.inbreedingCoef >= 0.0625 ? 'ic-caution' : 'ic-safe');
        
        html += `<div class="pairing-card ${p.canBreed ? '' : 'pairing-blocked'}">`;
        html += `<div class="pairing-header">#${i+1} ♂${p.male.name} × ♀${p.female.name} ${!p.canBreed ? '🚫' : ''}</div>`;
        html += `<div class="pairing-stats">確率: ${(p.probability*100).toFixed(1)}% | <span class="${icClass}">F値: ${icPercent}%</span></div>`;
        html += `<div class="pairing-recommendation">${p.recommendation}</div>`;
        if (p.warnings.length > 0) {
            html += `<div class="pairing-warnings">${p.warnings.join('<br>')}</div>`;
        }
        html += '</div>';
    });
    html += '</div>';
    
    // v6.7.4: 倫理基準の説明を追加
    html += `<div class="ethics-note" style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-size: 0.85em;">`;
    html += `<p>📋 <strong>倫理基準:</strong> 近交係数12.5%以上のペアは候補から除外されています（サラブレッド規則準拠）</p>`;
    html += `</div>`;
    
    resultPanel.innerHTML = html; 
    resultPanel.style.display = 'block';
}
