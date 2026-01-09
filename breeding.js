/**
 * Agapornis Gene-Forge v7.0
 * breeding.js - 交配実行・結果生成モジュール
 *
 * 整合性原理：
 * - genetics.php → LOCI_MASTER / COLOR_MASTER が唯一の真実
 * - 座位定義・色定義のハードコードは一切持たない
 * - GeneticsEngine（JS側）の連鎖計算を利用
 *
 * v7.0 連鎖遺伝対応:
 * - Z染色体連鎖: cinnamon-ino (3%), ino-opaline (30%), cinnamon-opaline (33%)
 * - 常染色体連鎖: dark-parblue (7%)
 * - Cis/Trans 相を考慮した配偶子頻度計算
 *
 * 依存:
 * - guardian.js (BreedingValidator)
 * - birds.js (BirdDB)
 * - genetics-engine.js (GeneticsEngine) - v7.0連鎖計算
 * - index.php (LOCI_MASTER, COLOR_MASTER, COLOR_LABELS, LINKAGE_GROUPS)
 */

const BreedingEngine = {
    VERSION: '7.0.0',

    // v7.0: 連鎖計算を有効化するフラグ
    useLinkage: true,
    
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
     * 伴性遺伝座位を取得（SSOT参照）
     */
    getSexLinkedLoci() {
        // SSOT参照: genetics.php LOCI
        const ssot = window.GENEFORGE_SSOT?.LOCI;
        if (ssot) {
            return Object.keys(ssot).filter(k => ssot[k].sex_linked === true);
        }
        // 旧形式フォールバック
        if (typeof LOCI_MASTER !== 'undefined') {
            return Object.keys(LOCI_MASTER).filter(k => LOCI_MASTER[k].sex_linked === true);
        }
        return ['ino', 'opaline', 'cinnamon'];
    },

    /**
     * 常染色体座位を取得（SSOT参照）
     */
    getAutosomalLoci() {
        // SSOT参照: genetics.php LOCI
        const ssot = window.GENEFORGE_SSOT?.LOCI;
        if (ssot) {
            return Object.keys(ssot).filter(k => ssot[k].sex_linked !== true);
        }
        // 旧形式フォールバック
        if (typeof LOCI_MASTER !== 'undefined') {
            return Object.keys(LOCI_MASTER).filter(k => LOCI_MASTER[k].sex_linked !== true);
        }
        return ['parblue', 'dark', 'violet', 'fallow_pale', 'fallow_bronze',
                'pied_dom', 'pied_rec', 'dilute', 'edged', 'orangeface', 'pale_headed'];
    },

    /**
     * 色名を取得（SSOT参照）
     */
    getColorLabel(colorKey) {
        // SSOT参照: genetics.php COLOR_DEFINITIONS
        const ssot = window.GENEFORGE_SSOT?.COLOR_DEFINITIONS;
        if (ssot?.[colorKey]) {
            const lang = window.GENEFORGE_SSOT?.lang || 'ja';
            return ssot[colorKey].albs || ssot[colorKey][lang] || ssot[colorKey].en || colorKey;
        }
        // 旧形式フォールバック
        if (typeof COLOR_MASTER !== 'undefined' && COLOR_MASTER[colorKey]) {
            return COLOR_MASTER[colorKey].ja || COLOR_MASTER[colorKey].en || colorKey;
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
        const _t = (k, fb) => (typeof T !== 'undefined' && T[k]) ? T[k] : fb;

        if (typeof BirdDB === 'undefined') {
            return { success: false, error: _t('birddb_undefined', 'BirdDB not loaded') };
        }

        const sire = BirdDB.getBird(sireId);
        const dam = BirdDB.getBird(damId);

        if (!sire) return { success: false, error: _t('sire_not_found', 'Sire not found') };
        if (!dam) return { success: false, error: _t('dam_not_found', 'Dam not found') };

        // BreedingValidator によるチェック
        if (typeof BreedingValidator !== 'undefined' && !options.skipValidation) {
            const validation = BreedingValidator.validate(sire, dam, mode);
            if (!validation.allowed) {
                return {
                    success: false,
                    error: validation.reason || _t('breeding_not_allowed', 'Breeding not allowed'),
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
     * v7.0: 連鎖計算対応
     */
    _simpleCross(sireGeno, damGeno) {
        const results = [];
        const autosomalLoci = this.getAutosomalLoci();
        const sexLinkedLoci = this.getSexLinkedLoci();

        // v7.0: 連鎖計算が有効な場合
        if (this.useLinkage && typeof GeneticsEngine !== 'undefined' &&
            typeof GeneticsEngine.genotypeToHaplotypes === 'function') {
            return this._linkageCross(sireGeno, damGeno, autosomalLoci, sexLinkedLoci);
        }

        // フォールバック: 独立分離仮定
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

    // ========================================
    // v7.0 連鎖遺伝計算
    // ========================================

    /**
     * 連鎖計算を使用した交配（v7.0）
     */
    _linkageCross(sireGeno, damGeno, autosomalLoci, sexLinkedLoci) {
        const results = [];

        // 父のハプロタイプセット生成
        const sireHaps = GeneticsEngine.genotypeToHaplotypes(sireGeno, 'male', sireGeno._phase || 'unknown');
        // 母のハプロタイプセット生成
        const damHaps = GeneticsEngine.genotypeToHaplotypes(damGeno, 'female', damGeno._phase || 'unknown');

        // Z染色体（伴性遺伝）の配偶子頻度計算
        const sireZGametes = GeneticsEngine.calculateGameteFrequencies(sireHaps.Z_chromosome, 'Z_chromosome');
        const damZGametes = GeneticsEngine.calculateGameteFrequencies(damHaps.Z_chromosome, 'Z_chromosome');

        // 常染色体連鎖群1の配偶子頻度計算
        const sireA1Gametes = GeneticsEngine.calculateGameteFrequencies(sireHaps.autosomal_1, 'autosomal_1');
        const damA1Gametes = GeneticsEngine.calculateGameteFrequencies(damHaps.autosomal_1, 'autosomal_1');

        // 独立座位（連鎖グループに属さない常染色体）
        const linkedAutosomal = ['dark', 'parblue'];
        const independentLoci = autosomalLoci.filter(l => !linkedAutosomal.includes(l));
        const independentCombos = this._crossAutosomal(sireGeno, damGeno, independentLoci);

        // 全組み合わせ生成
        for (const sireZ of sireZGametes) {
            for (const damZ of damZGametes) {
                for (const sireA1 of sireA1Gametes) {
                    for (const damA1 of damA1Gametes) {
                        for (const indep of independentCombos) {

                            // オス子孫
                            const maleGeno = this._buildOffspringGenotype(
                                sireZ.haplotype, damZ.haplotype,
                                sireA1.haplotype, damA1.haplotype,
                                indep.genotype, 'male'
                            );
                            const maleProb = sireZ.frequency * damZ.frequency *
                                            sireA1.frequency * damA1.frequency *
                                            indep.probability * 0.5;

                            if (maleProb > 0.0001) {
                                results.push({
                                    sex: 'male',
                                    genotype: maleGeno,
                                    probability: maleProb,
                                    phenotype: this._inferPhenotype(maleGeno, 'male')
                                });
                            }

                            // メス子孫（Zは父由来のみ、W染色体を持つ）
                            const femaleGeno = this._buildOffspringGenotype(
                                sireZ.haplotype, null,  // 母からはW
                                sireA1.haplotype, damA1.haplotype,
                                indep.genotype, 'female'
                            );
                            const femaleProb = sireZ.frequency * 1.0 *  // 母のZ配偶子は無関係
                                              sireA1.frequency * damA1.frequency *
                                              indep.probability * 0.5;

                            if (femaleProb > 0.0001) {
                                results.push({
                                    sex: 'female',
                                    genotype: femaleGeno,
                                    probability: femaleProb,
                                    phenotype: this._inferPhenotype(femaleGeno, 'female')
                                });
                            }
                        }
                    }
                }
            }
        }

        return this._mergeResults(results);
    },

    /**
     * 子孫の遺伝子型を構築
     */
    _buildOffspringGenotype(sireZHap, damZHap, sireA1Hap, damA1Hap, independentGeno, sex) {
        const geno = { ...independentGeno };

        // Z染色体座位
        const zLoci = ['cinnamon', 'ino', 'opaline'];
        for (const locus of zLoci) {
            if (sex === 'male') {
                // オス: 父Z + 母Z
                const a1 = sireZHap[locus] || '+';
                const a2 = damZHap ? (damZHap[locus] || '+') : '+';
                geno[locus] = this._formatSexLinkedAlleles(a1, a2, locus);
            } else {
                // メス: 父Z + W（ヘミ接合）
                const a1 = sireZHap[locus] || '+';
                geno[locus] = a1 === '+' ? '+W' : `${a1}W`;
            }
        }

        // 常染色体連鎖群1座位
        const a1Loci = ['dark', 'parblue'];
        for (const locus of a1Loci) {
            const a1 = sireA1Hap[locus] || GeneticsEngine.HAPLOTYPE_MODEL.WILDTYPE[locus];
            const a2 = damA1Hap[locus] || GeneticsEngine.HAPLOTYPE_MODEL.WILDTYPE[locus];
            geno[locus] = this._formatAutosomalAlleles(a1, a2, locus);
        }

        return geno;
    },

    /**
     * 伴性遺伝子型文字列を生成
     */
    _formatSexLinkedAlleles(a1, a2, locus) {
        if (a1 === '+' && a2 === '+') return '++';
        if (a1 === a2) return `${a1}${a1}`;
        if (a1 === '+') return `+${a2}`;
        if (a2 === '+') return `+${a1}`;
        return `${a1}${a2}`;
    },

    /**
     * 常染色体遺伝子型文字列を生成
     */
    _formatAutosomalAlleles(a1, a2, locus) {
        if (locus === 'dark') {
            // D > d の優先度
            if (a1 === 'D' && a2 === 'D') return 'DD';
            if (a1 === 'd' && a2 === 'd') return 'dd';
            return 'Dd';
        }
        if (locus === 'parblue') {
            if (a1 === '+' && a2 === '+') return '++';
            if (a1 === a2) return `${a1}${a2}`;
            if (a1 === '+') return `+${a2}`;
            if (a2 === '+') return `+${a1}`;
            // tq > aq
            return a1 === 'tq' ? `${a1}${a2}` : `${a2}${a1}`;
        }
        return `${a1}${a2}`;
    },

    /**
     * 連鎖遺伝に関する注記を生成
     */
    getLinkageNotes(sireGeno, damGeno) {
        const notes = [];

        if (!this.useLinkage || typeof GeneticsEngine === 'undefined') {
            return notes;
        }

        const sireHaps = GeneticsEngine.genotypeToHaplotypes(sireGeno, 'male');
        const damHaps = GeneticsEngine.genotypeToHaplotypes(damGeno, 'female');

        // Z染色体の相を推定
        const sireZPhase = GeneticsEngine.inferPhase(sireHaps.Z_chromosome);
        const sireA1Phase = GeneticsEngine.inferPhase(sireHaps.autosomal_1);

        if (sireZPhase === 'cis') {
            const hapStr = GeneticsEngine.formatHaplotypeSet(sireHaps.Z_chromosome, 'Z_chromosome');
            notes.push(`父のZ染色体: ${hapStr} - 連鎖遺伝型（cis相）`);
        } else if (sireZPhase === 'trans') {
            const hapStr = GeneticsEngine.formatHaplotypeSet(sireHaps.Z_chromosome, 'Z_chromosome');
            notes.push(`父のZ染色体: ${hapStr} - 組換え必要型（trans相）`);
        }

        if (sireA1Phase === 'cis' || sireA1Phase === 'trans') {
            const hapStr = GeneticsEngine.formatHaplotypeSet(sireHaps.autosomal_1, 'autosomal_1');
            notes.push(`父の常染色体連鎖: ${hapStr} (${sireA1Phase}相)`);
        }

        // 母のZ染色体（ヘミ接合なので相はない）
        const damZStr = GeneticsEngine.formatHaplotypeSet(damHaps.Z_chromosome, 'Z_chromosome');
        if (damZStr && !damZStr.includes('+-+-+')) {
            notes.push(`母のZ染色体: ${damZStr}`);
        }

        return notes;
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
        // BirdDB.calculatePhenotype があれば使用
        if (typeof BirdDB !== 'undefined' && BirdDB.calculatePhenotype) {
            return BirdDB.calculatePhenotype(geno, sex, null);
        }
        
        // COLOR_MASTER から逆引き
        if (typeof COLOR_MASTER !== 'undefined') {
            for (const [key, def] of Object.entries(COLOR_MASTER)) {
                if (this._matchesGenotype(geno, def.genotype || {}, sex)) {
                    return def.ja || def.en || key;
                }
            }
        }
        
        return (typeof T !== 'undefined' && T.unknown) ? T.unknown : 'Unknown';
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
        const _t = (k, fb) => (typeof T !== 'undefined' && T[k]) ? T[k] : fb;
        if (typeof BirdDB === 'undefined') {
            return { success: false, error: _t('birddb_undefined', 'BirdDB not loaded') };
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
        const _t = (k, fb) => (typeof T !== 'undefined' && T[k]) ? T[k] : fb;
        if (typeof BirdDB === 'undefined') {
            return { success: false, error: _t('birddb_undefined', 'BirdDB not loaded') };
        }
        const pedigree = BirdDB.buildPedigreeFromParents(parentResult.sire.id, parentResult.dam.id);
        const offspringNote = _t('offspring_of', 'Offspring of {sire} × {dam}')
            .replace('{sire}', parentResult.sire.name)
            .replace('{dam}', parentResult.dam.name);
        const bird = BirdDB.addBird({
            name: offspringData.name || '',
            sex: offspringData.sex,
            genotype: offspringData.genotype,
            phenotype: offspringData.phenotype,
            sire: { id: parentResult.sire.id, name: parentResult.sire.name },
            dam: { id: parentResult.dam.id, name: parentResult.dam.name },
            pedigree,
            birthDate: offspringData.birthDate || new Date().toISOString().split('T')[0],
            notes: offspringData.notes || offspringNote
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

console.log('[BreedingEngine] v' + BreedingEngine.VERSION + ' loaded (SSOT + Linkage)');
