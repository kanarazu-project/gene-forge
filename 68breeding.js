/**
 * @license CC BY-NC-SA 4.0
 * Commercial use strictly prohibited.
 * NPO/Educational use welcome.
 * 
 * 「制度は責任を放棄した。制度外がそれを果たす。」
 * 制度外文明・かならづプロジェクト
 *
 * Agapornis Gene-Forge v6.8
 * breeding.js - 交配実行・結果生成モジュール
 * 
 * v6.8変更点:
 * - SSOT化: 座位定義をLOCI_MASTERから動的取得
 * - 14座位対応（旧9座位から拡張）
 * - 全機能保持（元v6.7.4から劣化なし）
 * 
 * 依存:
 * - guardian.js (BreedingValidator)
 * - birds.js (BirdDB)
 * - index.php (LOCI_MASTER, COLOR_MASTER, COLOR_LABELS)
 */

const BreedingEngine = {
    VERSION: '6.8',
    
    // ========================================
    // SSOT参照（座位定義）
    // ========================================
    
    /**
     * 全座位を取得（LOCI_MASTERから動的取得）
     */
    getAllLoci() {
        if (typeof LOCI_MASTER !== 'undefined') {
            return Object.keys(LOCI_MASTER);
        }
        // フォールバック（LOCI_MASTER未定義時）
        console.warn('[BreedingEngine] LOCI_MASTER未定義、フォールバック使用');
        return [
            'parblue', 'dark', 'violet', 
            'ino', 'opaline', 'cinnamon',
            'fallow_pale', 'fallow_bronze', 
            'pied_dom', 'pied_rec', 
            'dilute', 'edged', 'orangeface', 'pale_headed'
        ];
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
     * 伴性遺伝座位を取得
     */
    getSexLinkedLoci() {
        if (typeof LOCI_MASTER !== 'undefined') {
            return Object.keys(LOCI_MASTER).filter(k => LOCI_MASTER[k].sex_linked === true);
        }
        return ['ino', 'opaline', 'cinnamon'];
    },
    
    /**
     * 座位が伴性遺伝かどうか
     */
    isSexLinked(locus) {
        if (typeof LOCI_MASTER !== 'undefined' && LOCI_MASTER[locus]) {
            return LOCI_MASTER[locus].sex_linked === true;
        }
        return ['ino', 'opaline', 'cinnamon'].includes(locus);
    },
    
    // ========================================
    // 交配実行
    // ========================================
    
    /**
     * 交配を実行（バリデーション付き）
     * @param {string} sireId - 父個体ID
     * @param {string} damId - 母個体ID
     * @param {Object} options - オプション
     * @returns {Object} { success, result?, error?, warning? }
     */
    execute(sireId, damId, options = {}) {
        const mode = options.mode || 'plan';
        const skipValidation = options.skipValidation || false;
        
        // 個体取得
        const sire = BirdDB.getBird(sireId);
        const dam = BirdDB.getBird(damId);
        
        if (!sire) {
            return { success: false, error: '父個体が見つかりません' };
        }
        if (!dam) {
            return { success: false, error: '母個体が見つかりません' };
        }
        
        // バリデーション
        if (!skipValidation && typeof BreedingValidator !== 'undefined') {
            const validation = BreedingValidator.validate(sire, dam, mode);
            
            if (!validation.allowed) {
                return {
                    success: false,
                    error: validation.reason || '交配できません',
                    blockType: validation.type,
                    warnings: validation.warning ? [validation.warning] : []
                };
            }
            
            // 警告がある場合は結果に含める
            if (validation.warning) {
                options._warnings = [validation.warning];
            }
        }
        
        // 交配シミュレーション実行
        const result = this.simulate(sire, dam, options);
        
        // 警告を結果に追加
        if (options._warnings) {
            result.warnings = options._warnings;
        }
        
        return { success: true, result };
    },
    
    /**
     * 交配シミュレーション（バリデーションなし）
     * @param {Object} sire - 父個体
     * @param {Object} dam - 母個体
     * @param {Object} options - オプション
     * @returns {Object} シミュレーション結果
     */
    simulate(sire, dam, options = {}) {
        const offspring = this.calculateOffspring(sire, dam);
        
        // 近交係数を計算
        let inbreedingCoef = 0;
        if (typeof BreedingValidator !== 'undefined') {
            inbreedingCoef = BreedingValidator.calcInbreedingCoefficient(sire, dam);
        } else if (typeof BirdDB !== 'undefined') {
            const icResult = BirdDB.calculateInbreedingCoefficient(sire.id, dam.id);
            inbreedingCoef = icResult.coefficient || 0;
        }
        
        return {
            sire: {
                id: sire.id,
                name: sire.name,
                code: sire.code,
                phenotype: sire.phenotype,
                genotype: sire.genotype
            },
            dam: {
                id: dam.id,
                name: dam.name,
                code: dam.code,
                phenotype: dam.phenotype,
                genotype: dam.genotype
            },
            offspring: offspring,
            inbreedingCoefficient: inbreedingCoef,
            timestamp: new Date().toISOString()
        };
    },
    
    // ========================================
    // 子孫遺伝子型計算
    // ========================================
    
    /**
     * 子孫の遺伝子型と確率を計算
     * @param {Object} sire - 父個体
     * @param {Object} dam - 母個体
     * @returns {Array} 子孫パターン配列
     */
    calculateOffspring(sire, dam) {
        // GeneticsEngine が利用可能な場合はそちらを使用
        if (typeof GeneticsEngine !== 'undefined' && GeneticsEngine.crossBirds) {
            return GeneticsEngine.crossBirds(sire, dam);
        }
        
        // フォールバック: 簡易計算
        return this._simpleCross(sire.genotype, dam.genotype, dam.sex);
    },
    
    /**
     * 簡易交配計算（GeneticsEngine未ロード時）
     * v6.8: LOCI_MASTERから座位を動的取得
     */
    _simpleCross(sireGeno, damGeno, damSex) {
        if (!sireGeno || !damGeno) {
            return [];
        }
        
        const results = [];
        const autosomalLoci = this.getAutosomalLoci();
        const xLinkedLoci = this.getSexLinkedLoci();
        
        // 常染色体遺伝子座の交配
        const autosomalCombos = this._crossAutosomal(sireGeno, damGeno, autosomalLoci);
        
        // X連鎖遺伝子座の交配
        const xLinkedCombos = this._crossXLinked(sireGeno, damGeno, xLinkedLoci);
        
        // 組み合わせを生成
        for (const auto of autosomalCombos) {
            for (const xLinked of xLinkedCombos) {
                // オス・メス両方の結果を生成
                ['male', 'female'].forEach(sex => {
                    const geno = { ...auto.genotype };
                    
                    // X連鎖遺伝子座を性別に応じて設定
                    xLinkedLoci.forEach(locus => {
                        if (sex === 'male') {
                            geno[locus] = xLinked.male[locus];
                        } else {
                            geno[locus] = xLinked.female[locus];
                        }
                    });
                    
                    const prob = auto.probability * xLinked.probability * 0.5; // 性別50%
                    
                    if (prob > 0) {
                        results.push({
                            sex: sex,
                            genotype: geno,
                            probability: prob,
                            phenotype: this._inferPhenotype(geno, sex)
                        });
                    }
                });
            }
        }
        
        // 確率でソート（降順）
        results.sort((a, b) => b.probability - a.probability);
        
        // 同じ表現型をマージ
        return this._mergeResults(results);
    },
    
    /**
     * 常染色体遺伝子座の交配
     */
    _crossAutosomal(sireGeno, damGeno, loci) {
        let combos = [{ genotype: {}, probability: 1 }];
        
        for (const locus of loci) {
            const sireAlleles = this._parseAlleles(sireGeno[locus] || this._getDefaultAllele(locus, 'male'));
            const damAlleles = this._parseAlleles(damGeno[locus] || this._getDefaultAllele(locus, 'female'));
            
            const newCombos = [];
            for (const combo of combos) {
                // パネットスクエア
                const crosses = this._punnetSquare(sireAlleles, damAlleles);
                for (const cross of crosses) {
                    newCombos.push({
                        genotype: { ...combo.genotype, [locus]: cross.alleles },
                        probability: combo.probability * cross.probability
                    });
                }
            }
            combos = newCombos;
        }
        
        return combos;
    },
    
    /**
     * X連鎖遺伝子座の交配
     */
    _crossXLinked(sireGeno, damGeno, loci) {
        let combos = [{ male: {}, female: {}, probability: 1 }];
        
        for (const locus of loci) {
            const sireAlleles = sireGeno[locus] || '++';
            const damAlleles = damGeno[locus] || '+W';
            
            const newCombos = [];
            for (const combo of combos) {
                const crosses = this._crossXLinkedLocus(sireAlleles, damAlleles, locus);
                for (const cross of crosses) {
                    newCombos.push({
                        male: { ...combo.male, [locus]: cross.male },
                        female: { ...combo.female, [locus]: cross.female },
                        probability: combo.probability * cross.probability
                    });
                }
            }
            combos = newCombos;
        }
        
        return combos;
    },
    
    /**
     * X連鎖遺伝子座の交配（単一座位）
     * v6.8: 完全なパネットスクエア実装
     */
    _crossXLinkedLocus(sireAlleles, damAlleles, locus) {
        const results = [];
        
        // 父の対立遺伝子をパース（オスはZZ）
        const sireZ = this._parseXLinkedAlleles(sireAlleles);
        
        // 母の対立遺伝子をパース（メスはZW）
        const damZ = this._parseXLinkedDamAllele(damAlleles);
        
        // パネットスクエア
        const seen = { male: {}, female: {} };
        
        for (const sz of sireZ) {
            for (const dz of [damZ]) {
                // オス子: 父のZ + 母のZ
                const maleGeno = this._normalizeXLinked(sz, dz);
                if (!seen.male[maleGeno]) {
                    seen.male[maleGeno] = 0;
                }
                seen.male[maleGeno] += 1 / (sireZ.length);
                
                // メス子: 父のZ + W
                const femaleGeno = sz + 'W';
                if (!seen.female[femaleGeno]) {
                    seen.female[femaleGeno] = 0;
                }
                seen.female[femaleGeno] += 1 / (sireZ.length);
            }
        }
        
        // 組み合わせを生成
        for (const [maleG, maleP] of Object.entries(seen.male)) {
            for (const [femaleG, femaleP] of Object.entries(seen.female)) {
                results.push({
                    male: maleG,
                    female: femaleG,
                    probability: maleP * femaleP
                });
            }
        }
        
        return results.length > 0 ? results : [{ male: '++', female: '+W', probability: 1 }];
    },
    
    /**
     * 父の伴性遺伝子をパース
     */
    _parseXLinkedAlleles(alleles) {
        if (!alleles || alleles === '++') return ['+', '+'];
        
        // inoino, opop, cincin 形式
        if (alleles.length >= 4 && !alleles.includes('+')) {
            const half = alleles.length / 2;
            return [alleles.substring(0, half), alleles.substring(half)];
        }
        
        // +ino, +op, +cin 形式
        if (alleles.startsWith('+') && alleles.length > 1) {
            return ['+', alleles.substring(1)];
        }
        
        // pldino 等の複合形式
        if (alleles.length === 6) {
            return [alleles.substring(0, 3), alleles.substring(3)];
        }
        
        return ['+', '+'];
    },
    
    /**
     * 母の伴性遺伝子をパース（ZW）
     */
    _parseXLinkedDamAllele(alleles) {
        if (!alleles || alleles === '+W') return '+';
        
        // inoW, opW, cinW, pldW 形式
        if (alleles.endsWith('W')) {
            const z = alleles.slice(0, -1);
            return z || '+';
        }
        
        return '+';
    },
    
    /**
     * 伴性遺伝子型を正規化
     */
    _normalizeXLinked(a1, a2) {
        if (a1 === '+' && a2 === '+') return '++';
        if (a1 === '+') return '+' + a2;
        if (a2 === '+') return '+' + a1;
        // 両方変異の場合（例: ino + pld → pldino）
        if (a1 === a2) return a1 + a2;
        // 異なる変異の組み合わせ（アルファベット順）
        return [a1, a2].sort().join('');
    },
    
    /**
     * デフォルトアレルを取得
     */
    _getDefaultAllele(locus, sex) {
        if (this.isSexLinked(locus)) {
            return sex === 'female' ? '+W' : '++';
        }
        if (locus === 'dark') return 'dd';
        if (locus === 'violet') return 'vv';
        return '++';
    },
    
    /**
     * 対立遺伝子をパース
     */
    _parseAlleles(genoStr) {
        if (!genoStr) return ['+', '+'];
        
        // 特殊形式
        if (genoStr === 'dd') return ['d', 'd'];
        if (genoStr === 'Dd') return ['D', 'd'];
        if (genoStr === 'DD') return ['D', 'D'];
        if (genoStr === 'vv') return ['v', 'v'];
        if (genoStr === 'Vv') return ['V', 'v'];
        if (genoStr === 'VV') return ['V', 'V'];
        if (genoStr === '++') return ['+', '+'];
        
        // 4文字形式（aqaq, tqtq, pipi等）
        if (genoStr.length === 4) {
            return [genoStr.substring(0, 2), genoStr.substring(2, 4)];
        }
        
        // 6文字形式（flpflp, flbflb等）
        if (genoStr.length === 6) {
            return [genoStr.substring(0, 3), genoStr.substring(3, 6)];
        }
        
        // +X形式（+aq, +tq, +pi等）
        if (genoStr.startsWith('+') && genoStr.length >= 3) {
            return ['+', genoStr.substring(1)];
        }
        
        // Pi+, PiPi形式
        if (genoStr === 'Pi+') return ['Pi', '+'];
        if (genoStr === 'PiPi') return ['Pi', 'Pi'];
        
        // 2文字形式
        if (genoStr.length === 2) return [genoStr[0], genoStr[1]];
        
        return ['+', '+'];
    },
    
    /**
     * パネットスクエア
     */
    _punnetSquare(sireAlleles, damAlleles) {
        const results = [];
        const seen = {};
        
        for (const sA of sireAlleles) {
            for (const dA of damAlleles) {
                // 正規化（優性を前に）
                const alleles = this._normalizeAlleles(sA, dA);
                const key = alleles;
                
                if (!seen[key]) {
                    seen[key] = { alleles, probability: 0 };
                }
                seen[key].probability += 0.25;
            }
        }
        
        return Object.values(seen);
    },
    
    /**
     * 対立遺伝子を正規化
     */
    _normalizeAlleles(a1, a2) {
        // 同じ場合
        if (a1 === a2) return a1 + a2;
        
        // 野生型を後ろに
        if (a1 === '+') return '+' + a2;
        if (a2 === '+') return '+' + a1;
        
        // ダーク因子
        if ((a1 === 'D' || a1 === 'd') && (a2 === 'D' || a2 === 'd')) {
            if (a1 === 'D' && a2 === 'd') return 'Dd';
            if (a1 === 'd' && a2 === 'D') return 'Dd';
            return a1 + a2;
        }
        
        // バイオレット因子
        if ((a1 === 'V' || a1 === 'v') && (a2 === 'V' || a2 === 'v')) {
            if (a1 === 'V' && a2 === 'v') return 'Vv';
            if (a1 === 'v' && a2 === 'V') return 'Vv';
            return a1 + a2;
        }
        
        // 優性パイド
        if (a1 === 'Pi' || a2 === 'Pi') {
            if (a1 === '+') return 'Pi+';
            if (a2 === '+') return 'Pi+';
            return 'PiPi';
        }
        
        // その他（アルファベット順）
        return [a1, a2].sort().join('');
    },
    
    /**
     * 表現型を推測
     * v6.8: COLOR_MASTER参照 + フォールバック
     */
    _inferPhenotype(geno, sex) {
        // BirdDB.calculatePhenotype があれば優先
        if (typeof BirdDB !== 'undefined' && BirdDB.calculatePhenotype) {
            return BirdDB.calculatePhenotype(geno, sex, null);
        }
        
        // フォールバック: 簡易推測
        const parts = [];
        
        // INO系
        if (this._isExpressed(geno.ino, sex, true)) {
            if (geno.parblue === 'aqaq') parts.push('クリーミノ');
            else if (geno.parblue === 'tqtq') parts.push('ピュアホワイト');
            else if (geno.parblue === 'tqaq') parts.push('クリーミノシーグリーン');
            else parts.push('ルチノー');
            return parts.join(' ');
        }
        
        // パリッド系
        if (this._isExpressed(geno.ino, sex, true, 'pld')) {
            parts.push('パリッド');
        }
        
        // ベースカラー
        let base = 'グリーン';
        if (geno.parblue === 'aqaq') base = 'アクア';
        else if (geno.parblue === 'tqtq') base = 'ターコイズ';
        else if (geno.parblue === 'tqaq') base = 'シーグリーン';
        
        // ダーク因子
        if (geno.dark === 'DD') {
            if (base === 'グリーン') base = 'オリーブ';
            else if (base === 'アクア') base = 'アクアDD';
            else if (base === 'ターコイズ') base = 'ターコイズDD';
            else if (base === 'シーグリーン') base = 'シーグリーンDD';
        } else if (geno.dark === 'Dd') {
            if (base === 'グリーン') base = 'ダークグリーン';
            else if (base === 'アクア') base = 'アクアダーク';
            else if (base === 'ターコイズ') base = 'ターコイズダーク';
            else if (base === 'シーグリーン') base = 'シーグリーンダーク';
        }
        
        // バイオレット
        if (geno.violet === 'Vv' || geno.violet === 'VV') {
            parts.push('バイオレット');
        }
        
        // 修飾遺伝子（伴性）
        if (this._isExpressed(geno.opaline, sex, true)) parts.push('オパーリン');
        if (this._isExpressed(geno.cinnamon, sex, true)) parts.push('シナモン');
        
        // 修飾遺伝子（常染色体）
        if (geno.fallow_pale === 'flpflp') parts.push('ペールファロー');
        if (geno.fallow_bronze === 'flbflb') parts.push('ブロンズファロー');
        if (geno.pied_rec === 'pipi') parts.push('レセッシブパイド');
        if (geno.pied_dom === 'PiPi' || geno.pied_dom === 'Pi+') parts.push('ドミナントパイド');
        if (geno.dilute === 'dildil') parts.push('ダイリュート');
        if (geno.edged === 'eded') parts.push('エッジド');
        if (geno.orangeface === 'ofof') parts.push('オレンジフェイス');
        if (geno.pale_headed === 'phph') parts.push('ペールヘッド');
        
        parts.push(base);
        return parts.join(' ');
    },
    
    /**
     * X連鎖遺伝子の発現チェック
     * @param {string} alleles - 遺伝子型
     * @param {string} sex - 性別
     * @param {boolean} isXLinked - 伴性遺伝か
     * @param {string} targetAllele - チェック対象アレル（省略時は野生型以外すべて）
     */
    _isExpressed(alleles, sex, isXLinked, targetAllele) {
        if (!alleles) return false;
        
        if (isXLinked && sex === 'female') {
            // メスはヘミ接合で発現
            if (!alleles.endsWith('W')) return false;
            const z = alleles.slice(0, -1);
            if (targetAllele) {
                return z.includes(targetAllele);
            }
            return z !== '+' && z !== '';
        }
        
        // オス・常染色体はホモで発現
        if (targetAllele) {
            return alleles.includes(targetAllele) && !alleles.includes('+');
        }
        return !alleles.includes('+');
    },
    
    /**
     * 同じ表現型の結果をマージ
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
    // 交配結果の保存
    // ========================================
    
    /**
     * 交配結果をDBに保存
     * @param {Object} result - シミュレーション結果
     * @param {Object} options - オプション
     * @returns {Object} 保存結果
     */
    saveResult(result, options = {}) {
        if (typeof BirdDB === 'undefined') {
            return { success: false, error: 'BirdDB が利用できません' };
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
    
    /**
     * 子孫を個体として登録
     * @param {Object} offspringData - 子孫データ
     * @param {Object} parentResult - 親の交配結果
     * @returns {Object} 登録結果
     */
    registerOffspring(offspringData, parentResult) {
        if (typeof BirdDB === 'undefined') {
            return { success: false, error: 'BirdDB が利用できません' };
        }
        
        // pedigree を構築
        const pedigree = BirdDB.buildPedigreeFromParents(
            parentResult.sire.id,
            parentResult.dam.id
        );
        
        const bird = BirdDB.addBird({
            name: offspringData.name || '',
            sex: offspringData.sex,
            genotype: offspringData.genotype,
            phenotype: offspringData.phenotype,
            sire: { id: parentResult.sire.id, name: parentResult.sire.name },
            dam: { id: parentResult.dam.id, name: parentResult.dam.name },
            pedigree: pedigree,
            birthDate: offspringData.birthDate || new Date().toISOString().split('T')[0],
            notes: offspringData.notes || `${parentResult.sire.name} × ${parentResult.dam.name} の子`
        });
        
        return { success: true, bird };
    },
    
    // ========================================
    // ユーティリティ
    // ========================================
    
    /**
     * 交配可否をクイックチェック
     */
    canBreed(sireId, damId, mode = 'plan') {
        const sire = BirdDB.getBird(sireId);
        const dam = BirdDB.getBird(damId);
        
        if (!sire || !dam) return false;
        
        if (typeof BreedingValidator !== 'undefined') {
            const validation = BreedingValidator.validate(sire, dam, mode);
            return validation.allowed;
        }
        
        // フォールバック: 基本チェックのみ
        if (sire.sex !== 'male') return false;
        if (dam.sex !== 'female') return false;
        if (sire.id === dam.id) return false;
        
        return true;
    },
    
    /**
     * 近交係数を取得
     */
    getInbreedingCoefficient(sireId, damId) {
        const sire = BirdDB.getBird(sireId);
        const dam = BirdDB.getBird(damId);
        
        if (!sire || !dam) return 0;
        
        if (typeof BreedingValidator !== 'undefined') {
            return BreedingValidator.calcInbreedingCoefficient(sire, dam);
        }
        
        const result = BirdDB.calculateInbreedingCoefficient(sireId, damId);
        return result.coefficient || 0;
    },
    
    /**
     * 交配警告を取得
     */
    getBreedingWarnings(sireId, damId, mode = 'plan') {
        const sire = BirdDB.getBird(sireId);
        const dam = BirdDB.getBird(damId);
        
        if (!sire || !dam) return [];
        
        if (typeof BreedingValidator !== 'undefined') {
            const validation = BreedingValidator.validate(sire, dam, mode);
            return validation.warning ? [validation.warning] : [];
        }
        
        return [];
    }
};

// グローバル公開
if (typeof window !== 'undefined') {
    window.BreedingEngine = BreedingEngine;
}

console.log('[BreedingEngine] v' + BreedingEngine.VERSION + ' loaded (SSOT)');
