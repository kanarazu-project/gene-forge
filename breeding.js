/**
 * Agapornis Gene-Forge v7.0
 * breeding.js - 交配実行・結果生成モジュール
 * 
 * 整合性原理：
 * - genetics.php → LOCI_MASTER / COLOR_MASTER が唯一の真実
 * - 座位定義・色定義のハードコードは一切持たない
 * - GeneticsEngine（PHP側）への委譲を優先
 * 
 * 依存:
 * - guardian.js (BreedingValidator)
 * - birds.js (BirdDB)
 * - index.php (LOCI_MASTER, COLOR_MASTER, COLOR_LABELS)
 */

const BreedingEngine = {
    VERSION: '7.0',
    
    // ========================================
    // SSOT参照
    // ========================================
    
    /**
     * 座位一覧を取得（LOCI_MASTERから動的取得）
     */
    getLoci() {
        if (typeof LOCI_MASTER !== 'undefined') {
            return Object.keys(LOCI_MASTER);
        }
        console.warn('[BreedingEngine] LOCI_MASTER未定義');
        return [];
    },
    
    /**
     * 伴性遺伝座位を取得
     */
    getSexLinkedLoci() {
        if (typeof LOCI_MASTER !== 'undefined') {
            return Object.keys(LOCI_MASTER).filter(k => LOCI_MASTER[k].sex_linked === true);
        }
        return ['ino', 'opaline', 'cinnamon'];
    },
    
    /**
     * 常染色体座位を取得
     */
    getAutosomalLoci() {
        if (typeof LOCI_MASTER !== 'undefined') {
            return Object.keys(LOCI_MASTER).filter(k => LOCI_MASTER[k].sex_linked !== true);
        }
        return ['parblue', 'dark', 'violet', 'fallow_pale', 'fallow_bronze', 
                'pied_dom', 'pied_rec', 'dilute', 'edged', 'orangeface', 'pale_headed'];
    },
    
    /**
     * 色名を取得（v7.3: keyToLabel対応）
     */
    getColorLabel(colorKey) {
        // v7.3: keyToLabel関数でローカライズ（動的変換対応）
        if (typeof keyToLabel === 'function') {
            return keyToLabel(colorKey);
        }
        // フォールバック
        const lang = typeof LANG !== 'undefined' ? LANG : 'ja';
        if (typeof COLOR_MASTER !== 'undefined' && COLOR_MASTER[colorKey]) {
            return COLOR_MASTER[colorKey][lang] || COLOR_MASTER[colorKey].en || COLOR_MASTER[colorKey].ja || colorKey;
        }
        if (typeof COLOR_LABELS !== 'undefined' && COLOR_LABELS[colorKey]) {
            return COLOR_LABELS[colorKey];
        }
        return colorKey;
    },
    
    // ========================================
    // 交配実行
    // ========================================
    
    /**
     * 交配を実行（バリデーション付き）
     */
    execute(sireId, damId, options = {}) {
        const mode = options.mode || 'plan';
        const lang = typeof LANG !== 'undefined' ? LANG : 'ja';
        const errBirdDB = { ja: 'BirdDB未定義', en: 'BirdDB not defined', de: 'BirdDB nicht definiert', fr: 'BirdDB non défini', it: 'BirdDB non definito', es: 'BirdDB no definido' };
        const errSire = { ja: '父個体が見つかりません', en: 'Sire not found', de: 'Vater nicht gefunden', fr: 'Père non trouvé', it: 'Padre non trovato', es: 'Padre no encontrado' };
        const errDam = { ja: '母個体が見つかりません', en: 'Dam not found', de: 'Mutter nicht gefunden', fr: 'Mère non trouvée', it: 'Madre non trovata', es: 'Madre no encontrada' };

        if (typeof BirdDB === 'undefined') {
            return { success: false, error: errBirdDB[lang] || errBirdDB.en };
        }

        const sire = BirdDB.getBird(sireId);
        const dam = BirdDB.getBird(damId);

        if (!sire) return { success: false, error: errSire[lang] || errSire.en };
        if (!dam) return { success: false, error: errDam[lang] || errDam.en };
        
        // BreedingValidator によるチェック
        if (typeof BreedingValidator !== 'undefined' && !options.skipValidation) {
            const validation = BreedingValidator.validate(sire, dam, mode);
            if (!validation.allowed) {
                const errCannotBreed = { ja: '交配できません', en: 'Cannot breed', de: 'Zucht nicht möglich', fr: 'Reproduction impossible', it: 'Riproduzione non possibile', es: 'No se puede criar' };
                return {
                    success: false,
                    error: validation.reason || (errCannotBreed[lang] || errCannotBreed.en),
                    blockType: validation.type
                };
            }
            if (validation.warning) {
                options._warnings = [validation.warning];
            }
        }
        
        const result = this.simulate(sire, dam, options);
        if (options._warnings) result.warnings = options._warnings;
        
        return { success: true, result };
    },
    
    /**
     * 交配シミュレーション
     */
    simulate(sire, dam, options = {}) {
        const offspring = this.calculateOffspring(sire, dam);
        
        let inbreedingCoef = 0;
        if (typeof BreedingValidator !== 'undefined') {
            inbreedingCoef = BreedingValidator.calcInbreedingCoefficient(sire, dam);
        } else if (typeof BirdDB !== 'undefined') {
            const ic = BirdDB.calculateInbreedingCoefficient(sire.id, dam.id);
            inbreedingCoef = ic.coefficient || 0;
        }
        
        return {
            sire: { id: sire.id, name: sire.name, code: sire.code, phenotype: sire.phenotype, genotype: sire.genotype },
            dam: { id: dam.id, name: dam.name, code: dam.code, phenotype: dam.phenotype, genotype: dam.genotype },
            offspring,
            inbreedingCoefficient: inbreedingCoef,
            timestamp: new Date().toISOString()
        };
    },
    
    // ========================================
    // 子孫遺伝子型計算
    // ========================================
    
    /**
     * 子孫の遺伝子型と確率を計算
     */
    calculateOffspring(sire, dam) {
        // PHP側 GeneticsCalculator が利用可能ならそちらを優先
        if (typeof GeneticsEngine !== 'undefined' && GeneticsEngine.crossBirds) {
            return GeneticsEngine.crossBirds(sire, dam);
        }
        
        // フォールバック: JS側で簡易計算
        return this._simpleCross(sire.genotype || {}, dam.genotype || {});
    },
    
    /**
     * 簡易交配計算（SSOT準拠）
     */
    _simpleCross(sireGeno, damGeno) {
        const results = [];
        const autosomalLoci = this.getAutosomalLoci();
        const sexLinkedLoci = this.getSexLinkedLoci();
        
        // 常染色体の組み合わせ
        const autoCombos = this._crossAutosomal(sireGeno, damGeno, autosomalLoci);
        
        // 伴性遺伝の組み合わせ
        const slCombos = this._crossSexLinked(sireGeno, damGeno, sexLinkedLoci);
        
        // 全組み合わせ生成
        for (const auto of autoCombos) {
            for (const sl of slCombos) {
                ['male', 'female'].forEach(sex => {
                    const geno = { ...auto.genotype };
                    
                    sexLinkedLoci.forEach(locus => {
                        geno[locus] = sex === 'male' ? sl.male[locus] : sl.female[locus];
                    });
                    
                    const prob = auto.probability * sl.probability * 0.5;
                    if (prob > 0.001) {
                        results.push({
                            sex,
                            genotype: geno,
                            probability: prob,
                            phenotype: this._inferPhenotype(geno, sex)
                        });
                    }
                });
            }
        }
        
        return this._mergeResults(results);
    },
    
    /**
     * 常染色体交配
     */
    _crossAutosomal(sireGeno, damGeno, loci) {
        let combos = [{ genotype: {}, probability: 1 }];
        
        for (const locus of loci) {
            const sVal = sireGeno[locus] || '++';
            const dVal = damGeno[locus] || '++';
            const crosses = this._punnetSquare(sVal, dVal);
            
            const newCombos = [];
            for (const c of combos) {
                for (const x of crosses) {
                    newCombos.push({
                        genotype: { ...c.genotype, [locus]: x.alleles },
                        probability: c.probability * x.probability
                    });
                }
            }
            combos = newCombos;
        }
        
        return combos;
    },
    
    /**
     * 伴性遺伝交配
     */
    _crossSexLinked(sireGeno, damGeno, loci) {
        let combos = [{ male: {}, female: {}, probability: 1 }];
        
        for (const locus of loci) {
            const sVal = sireGeno[locus] || '++';
            const dVal = damGeno[locus] || '+W';
            const crosses = this._crossSexLinkedLocus(sVal, dVal, locus);
            
            const newCombos = [];
            for (const c of combos) {
                for (const x of crosses) {
                    newCombos.push({
                        male: { ...c.male, [locus]: x.male },
                        female: { ...c.female, [locus]: x.female },
                        probability: c.probability * x.probability
                    });
                }
            }
            combos = newCombos;
        }
        
        return combos;
    },
    
    /**
     * 伴性遺伝単一座位の交配
     * オス: ZZ（2本）、メス: ZW（1本+W）
     */
    _crossSexLinkedLocus(sireVal, damVal, locus) {
        // 父の対立遺伝子を抽出
        const sireAlleles = this._parseSexLinkedAlleles(sireVal, 'male');
        // 母の対立遺伝子を抽出（Wは除外）
        const damAllele = this._parseSexLinkedAlleles(damVal, 'female')[0];
        
        const results = [];
        
        for (const sA of sireAlleles) {
            // オス子: 父から1本 + 母から1本
            const maleGeno = this._normalizeSexLinked(sA, damAllele);
            // メス子: 父から1本 + W
            const femaleGeno = sA + 'W';
            
            results.push({
                male: maleGeno,
                female: femaleGeno,
                probability: 1 / sireAlleles.length
            });
        }
        
        return results;
    },
    
    /**
     * 伴性遺伝対立遺伝子をパース
     */
    _parseSexLinkedAlleles(val, sex) {
        if (!val || val === '++') return ['+', '+'];
        if (val.endsWith('W')) {
            const allele = val.replace('W', '') || '+';
            return [allele];
        }
        // オスの場合（例: +ino, inoino, opop）
        if (val.length <= 2) return [val[0] || '+', val[1] || '+'];
        // 長い形式（例: inoino → ino, ino）
        const half = val.length / 2;
        return [val.substring(0, half), val.substring(half)];
    },
    
    /**
     * 伴性遺伝子型を正規化
     */
    _normalizeSexLinked(a1, a2) {
        if (a1 === '+' && a2 === '+') return '++';
        if (a1 === '+') return '+' + a2;
        if (a2 === '+') return '+' + a1;
        return a1 + a2;
    },
    
    /**
     * パネットスクエア（常染色体）
     */
    _punnetSquare(sVal, dVal) {
        const sAlleles = this._parseAutosomalAlleles(sVal);
        const dAlleles = this._parseAutosomalAlleles(dVal);
        
        const seen = {};
        for (const sA of sAlleles) {
            for (const dA of dAlleles) {
                const alleles = this._normalizeAutosomal(sA, dA);
                if (!seen[alleles]) seen[alleles] = { alleles, probability: 0 };
                seen[alleles].probability += 0.25;
            }
        }
        
        return Object.values(seen);
    },
    
    /**
     * 常染色体対立遺伝子をパース
     */
    _parseAutosomalAlleles(val) {
        if (!val || val === '++' || val === 'dd' || val === 'vv') {
            return [val?.[0] || '+', val?.[1] || '+'];
        }
        // 2文字形式（Dd, DD等）
        if (val.length === 2) return [val[0], val[1]];
        // 4文字形式（aqaq等）
        if (val.length === 4) return [val.substring(0, 2), val.substring(2)];
        // +X形式
        if (val.startsWith('+')) return ['+', val.substring(1)];
        return ['+', '+'];
    },
    
    /**
     * 常染色体遺伝子型を正規化
     */
    _normalizeAutosomal(a1, a2) {
        // 優性を前に
        if (a1 === '+' && a2 !== '+') return '+' + a2;
        if (a2 === '+' && a1 !== '+') return '+' + a1;
        if (a1 === a2) return a1 + a2;
        // アルファベット順
        return [a1, a2].sort().join('');
    },
    
    /**
     * 表現型を推測（SSOT準拠）
     */
    _inferPhenotype(geno, sex) {
        // v7.0: 現在の言語設定を使用
        const lang = typeof LANG !== 'undefined' ? LANG : 'ja';

        // BirdDB.calculatePhenotype があれば使用
        if (typeof BirdDB !== 'undefined' && BirdDB.calculatePhenotype) {
            return BirdDB.calculatePhenotype(geno, sex, null);
        }

        // COLOR_MASTER から逆引き
        if (typeof COLOR_MASTER !== 'undefined') {
            for (const [key, def] of Object.entries(COLOR_MASTER)) {
                if (this._matchesGenotype(geno, def.genotype || {}, sex)) {
                    return def[lang] || def.en || def.ja || key;
                }
            }
        }

        const unknownLabel = { ja: '不明', en: 'Unknown', de: 'Unbekannt', fr: 'Inconnu', it: 'Sconosciuto', es: 'Desconocido' };
        return unknownLabel[lang] || 'Unknown';
    },
    
    /**
     * 遺伝子型が定義にマッチするか
     */
    _matchesGenotype(geno, defGeno, sex) {
        for (const [locus, expected] of Object.entries(defGeno)) {
            const actual = geno[locus];
            if (!actual) continue;
            
            // 伴性遺伝でメスの場合は変換
            if (sex === 'female' && this.getSexLinkedLoci().includes(locus)) {
                const expectedFemale = expected.replace(/(.+)\1/, '$1W');
                if (actual !== expectedFemale && actual !== expected) return false;
            } else {
                if (actual !== expected) return false;
            }
        }
        return true;
    },
    
    /**
     * 同じ表現型をマージ
     */
    _mergeResults(results) {
        const merged = {};
        for (const r of results) {
            const key = `${r.sex}_${r.phenotype}`;
            if (!merged[key]) {
                merged[key] = { ...r };
            } else {
                merged[key].probability += r.probability;
            }
        }
        return Object.values(merged).sort((a, b) => b.probability - a.probability);
    },
    
    // ========================================
    // 保存・登録
    // ========================================
    
    saveResult(result, options = {}) {
        if (typeof BirdDB === 'undefined') {
            return { success: false, error: 'BirdDB未定義' };
        }
        const record = BirdDB.saveBreedingResult({
            sire: result.sire,
            dam: result.dam,
            offspring: result.offspring,
            inbreedingCoefficient: result.inbreedingCoefficient,
            notes: options.notes || ''
        });
        return { success: true, record };
    },
    
    registerOffspring(offspringData, parentResult) {
        const lang = typeof LANG !== 'undefined' ? LANG : 'ja';
        const errMsg = { ja: 'BirdDB未定義', en: 'BirdDB not defined', de: 'BirdDB nicht definiert', fr: 'BirdDB non défini', it: 'BirdDB non definito', es: 'BirdDB no definido' };
        if (typeof BirdDB === 'undefined') {
            return { success: false, error: errMsg[lang] || errMsg.en };
        }
        // v7.0: buildPedigreeFromParents存在チェック
        const pedigree = (typeof BirdDB.buildPedigreeFromParents === 'function')
            ? BirdDB.buildPedigreeFromParents(parentResult.sire.id, parentResult.dam.id)
            : null;
        const offspringLabel = { ja: 'の子', en: ' offspring', de: ' Nachkommen', fr: ' descendant', it: ' discendente', es: ' descendiente' };
        const bird = BirdDB.addBird({
            name: offspringData.name || '',
            sex: offspringData.sex,
            genotype: offspringData.genotype,
            phenotype: offspringData.phenotype,
            sire: { id: parentResult.sire.id, name: parentResult.sire.name },
            dam: { id: parentResult.dam.id, name: parentResult.dam.name },
            pedigree,
            birthDate: offspringData.birthDate || new Date().toISOString().split('T')[0],
            notes: offspringData.notes || `${parentResult.sire.name} × ${parentResult.dam.name}${offspringLabel[lang] || offspringLabel.en}`
        });
        return { success: true, bird };
    },
    
    // ========================================
    // ユーティリティ
    // ========================================
    
    canBreed(sireId, damId, mode = 'plan') {
        if (typeof BirdDB === 'undefined') return false;
        const sire = BirdDB.getBird(sireId);
        const dam = BirdDB.getBird(damId);
        if (!sire || !dam) return false;
        
        if (typeof BreedingValidator !== 'undefined') {
            return BreedingValidator.validate(sire, dam, mode).allowed;
        }
        
        return sire.sex === 'male' && dam.sex === 'female' && sire.id !== dam.id;
    },
    
    getInbreedingCoefficient(sireId, damId) {
        if (typeof BirdDB === 'undefined') return 0;
        const sire = BirdDB.getBird(sireId);
        const dam = BirdDB.getBird(damId);
        if (!sire || !dam) return 0;
        
        if (typeof BreedingValidator !== 'undefined') {
            return BreedingValidator.calcInbreedingCoefficient(sire, dam);
        }
        return BirdDB.calculateInbreedingCoefficient(sireId, damId).coefficient || 0;
    }
};

// グローバル公開
if (typeof window !== 'undefined') {
    window.BreedingEngine = BreedingEngine;
}

console.log('[BreedingEngine] v' + BreedingEngine.VERSION + ' loaded (SSOT)');
