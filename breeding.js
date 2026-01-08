/**
 * Agapornis Gene-Forge v7.0
 * breeding.js - 交配実行・結果生成モジュール（連鎖遺伝対応版）
 *
 * v7.0 連鎖遺伝実装:
 * - Z染色体連鎖: cinnamon-ino (3%), ino-opaline (30%), cinnamon-opaline (33%)
 * - 常染色体連鎖: dark-parblue (7%)
 * - オス（ZZ）のみ組換え発生、メス（ZW）はヘミ接合で組換えなし
 *
 * 整合性原理：
 * - genetics.php → LOCI_MASTER / COLOR_MASTER / LINKAGE_GROUPS が唯一の真実
 * - 座位定義・色定義のハードコードは一切持たない
 * - GeneticsEngine（PHP側）への委譲を優先
 *
 * 依存:
 * - guardian.js (BreedingValidator)
 * - birds.js (BirdDB)
 * - index.php (LOCI_MASTER, COLOR_MASTER, COLOR_LABELS, LINKAGE_GROUPS)
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

    // ========================================
    // 連鎖遺伝 (v7.0)
    // ========================================

    /**
     * 連鎖グループを取得（SSOT）
     */
    getLinkageGroups() {
        if (typeof LINKAGE_GROUPS !== 'undefined') {
            return LINKAGE_GROUPS;
        }
        // フォールバック
        return {
            Z_chromosome: {
                loci: ['cinnamon', 'ino', 'opaline'],
                recombination: {
                    cinnamon_ino: 0.03,
                    cinnamon_opaline: 0.33,
                    ino_opaline: 0.30,
                }
            },
            autosomal_1: {
                loci: ['dark', 'parblue'],
                recombination: {
                    dark_parblue: 0.07,
                }
            }
        };
    },

    /**
     * 2座位間の組換え率を取得
     */
    getRecombinationRate(locus1, locus2) {
        const groups = this.getLinkageGroups();
        for (const group of Object.values(groups)) {
            const key1 = `${locus1}_${locus2}`;
            const key2 = `${locus2}_${locus1}`;
            if (group.recombination[key1] !== undefined) {
                return group.recombination[key1];
            }
            if (group.recombination[key2] !== undefined) {
                return group.recombination[key2];
            }
        }
        return 0.5; // 独立分離（非連鎖）
    },

    /**
     * 座位が連鎖グループに属するか確認
     */
    isLinkedLocus(locus, groupName) {
        const groups = this.getLinkageGroups();
        if (groups[groupName]) {
            return groups[groupName].loci.includes(locus);
        }
        return false;
    },
    
    /**
     * 色名を取得（SSOT）
     */
    getColorLabel(colorKey) {
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
        
        if (typeof BirdDB === 'undefined') {
            return { success: false, error: 'BirdDB未定義' };
        }
        
        const sire = BirdDB.getBird(sireId);
        const dam = BirdDB.getBird(damId);
        
        if (!sire) return { success: false, error: '父個体が見つかりません' };
        if (!dam) return { success: false, error: '母個体が見つかりません' };
        
        // BreedingValidator によるチェック
        if (typeof BreedingValidator !== 'undefined' && !options.skipValidation) {
            const validation = BreedingValidator.validate(sire, dam, mode);
            if (!validation.allowed) {
                return {
                    success: false,
                    error: validation.reason || '交配できません',
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
     * 常染色体交配（連鎖対応 v7.0）
     *
     * dark-parblue間は7%の組換え率で連鎖している。
     * 両親が両座位でヘテロ接合の場合、連鎖を考慮した配偶子頻度で計算。
     */
    _crossAutosomal(sireGeno, damGeno, loci) {
        // 連鎖座位（dark, parblue）を分離
        const linkedLoci = ['dark', 'parblue'].filter(l => loci.includes(l));
        const unlinkedLoci = loci.filter(l => !linkedLoci.includes(l));

        // 連鎖座位の処理
        let linkedCombos = [{ genotype: {}, probability: 1 }];
        if (linkedLoci.length === 2) {
            // dark-parblue両方が存在する場合、連鎖計算
            linkedCombos = this._crossLinkedAutosomal(sireGeno, damGeno, linkedLoci);
        } else {
            // 連鎖座位が1つ以下なら独立分離
            for (const locus of linkedLoci) {
                const sVal = sireGeno[locus] || (locus === 'dark' ? 'dd' : '++');
                const dVal = damGeno[locus] || (locus === 'dark' ? 'dd' : '++');
                const crosses = this._punnetSquare(sVal, dVal);

                const newCombos = [];
                for (const c of linkedCombos) {
                    for (const x of crosses) {
                        newCombos.push({
                            genotype: { ...c.genotype, [locus]: x.alleles },
                            probability: c.probability * x.probability
                        });
                    }
                }
                linkedCombos = newCombos;
            }
        }

        // 非連鎖座位の処理（独立分離）
        let combos = linkedCombos;
        for (const locus of unlinkedLoci) {
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
     * 連鎖した常染色体座位（dark-parblue）の交配
     *
     * 組換え率 7%: 親型配偶子 93%, 組換え型配偶子 7%
     */
    _crossLinkedAutosomal(sireGeno, damGeno, loci) {
        // 父と母の配偶子を生成
        const sireGametes = this._generateLinkedAutosomalGametes(sireGeno, loci);
        const damGametes = this._generateLinkedAutosomalGametes(damGeno, loci);

        const results = [];
        const seen = {};

        for (const sG of sireGametes) {
            for (const dG of damGametes) {
                const genotype = {};
                for (const locus of loci) {
                    genotype[locus] = this._normalizeAutosomal(sG.alleles[locus], dG.alleles[locus]);
                }

                const key = loci.map(l => genotype[l]).join('|');
                if (!seen[key]) {
                    seen[key] = { genotype, probability: 0 };
                }
                seen[key].probability += sG.probability * dG.probability;
            }
        }

        return Object.values(seen);
    },

    /**
     * 連鎖した常染色体の配偶子を生成
     */
    _generateLinkedAutosomalGametes(geno, loci) {
        // 各座位の対立遺伝子を抽出
        const alleles = {};
        for (const locus of loci) {
            const val = geno[locus] || (locus === 'dark' ? 'dd' : '++');
            alleles[locus] = this._parseAutosomalAlleles(val);
        }

        // 両座位がホモ接合なら組換えは無意味
        const hetLoci = loci.filter(l => alleles[l][0] !== alleles[l][1]);
        if (hetLoci.length < 2) {
            // 少なくとも1座位はホモ接合 → 独立分離と同じ
            const gametes = [];
            for (const a1 of alleles[loci[0]]) {
                for (const a2 of alleles[loci[1]]) {
                    gametes.push({
                        alleles: { [loci[0]]: a1, [loci[1]]: a2 },
                        probability: 0.25
                    });
                }
            }
            // 同じ配偶子を統合
            const seen = {};
            for (const g of gametes) {
                const key = loci.map(l => g.alleles[l]).join('|');
                if (!seen[key]) {
                    seen[key] = { alleles: g.alleles, probability: 0 };
                }
                seen[key].probability += g.probability;
            }
            return Object.values(seen);
        }

        // 両座位がヘテロ接合 → 連鎖計算
        const r = this.getRecombinationRate('dark', 'parblue');
        const parentalProb = (1 - r) / 2;  // 各親型配偶子
        const recombinantProb = r / 2;     // 各組換え型配偶子

        // 親型配偶子: chr1からdark+chr1からparblue, chr2からdark+chr2からparblue
        // 組換え型: chr1からdark+chr2からparblue, chr2からdark+chr1からparblue
        const gametes = [
            { alleles: { [loci[0]]: alleles[loci[0]][0], [loci[1]]: alleles[loci[1]][0] }, probability: parentalProb },
            { alleles: { [loci[0]]: alleles[loci[0]][1], [loci[1]]: alleles[loci[1]][1] }, probability: parentalProb },
            { alleles: { [loci[0]]: alleles[loci[0]][0], [loci[1]]: alleles[loci[1]][1] }, probability: recombinantProb },
            { alleles: { [loci[0]]: alleles[loci[0]][1], [loci[1]]: alleles[loci[1]][0] }, probability: recombinantProb }
        ];

        // 同じ配偶子を統合
        const seen = {};
        for (const g of gametes) {
            const key = loci.map(l => g.alleles[l]).join('|');
            if (!seen[key]) {
                seen[key] = { alleles: g.alleles, probability: 0 };
            }
            seen[key].probability += g.probability;
        }

        return Object.values(seen);
    },
    
    /**
     * 伴性遺伝交配（連鎖対応 v7.0）
     *
     * Z染色体上の3座位（cinnamon, ino, opaline）は連鎖している。
     * オス（ZZ）のみ組換えが起きる。メス（ZW）はヘミ接合なので組換えなし。
     */
    _crossSexLinked(sireGeno, damGeno, loci) {
        // 父の配偶子（連鎖考慮）
        const sireGametes = this._generateLinkedSexLinkedGametes(sireGeno, loci);
        // 母の配偶子（ヘミ接合なので単一）
        const damGamete = this._getDamSexLinkedGamete(damGeno, loci);

        const results = [];
        for (const sGamete of sireGametes) {
            // オス子: 父の配偶子 + 母の配偶子
            const maleGeno = {};
            // メス子: 父の配偶子 + W
            const femaleGeno = {};

            for (const locus of loci) {
                maleGeno[locus] = this._normalizeSexLinked(sGamete.alleles[locus], damGamete[locus]);
                femaleGeno[locus] = sGamete.alleles[locus] + 'W';
            }

            results.push({
                male: maleGeno,
                female: femaleGeno,
                probability: sGamete.probability
            });
        }

        return results;
    },

    /**
     * 母の伴性遺伝配偶子を取得（ヘミ接合）
     */
    _getDamSexLinkedGamete(damGeno, loci) {
        const gamete = {};
        for (const locus of loci) {
            const val = damGeno[locus] || '+W';
            // Wを除いた対立遺伝子
            const allele = val.replace('W', '') || '+';
            gamete[locus] = allele;
        }
        return gamete;
    },

    /**
     * 父の伴性遺伝配偶子を生成（連鎖考慮）
     *
     * オス（ZZ）は2本のZ染色体を持ち、減数分裂時に組換えが起きる。
     * 連鎖した座位間では組換え率に応じた配偶子頻度となる。
     */
    _generateLinkedSexLinkedGametes(sireGeno, loci) {
        // 各座位の対立遺伝子を抽出（染色体1, 染色体2）
        const chromosomes = { chr1: {}, chr2: {} };
        for (const locus of loci) {
            const alleles = this._parseSexLinkedAlleles(sireGeno[locus] || '++', 'male');
            chromosomes.chr1[locus] = alleles[0];
            chromosomes.chr2[locus] = alleles[1];
        }

        // 全座位がホモ接合なら組換えは無意味
        const heterozygousLoci = loci.filter(l => chromosomes.chr1[l] !== chromosomes.chr2[l]);
        if (heterozygousLoci.length === 0) {
            return [{ alleles: chromosomes.chr1, probability: 1 }];
        }

        // 連鎖グループの座位順序: cinnamon, ino, opaline
        const orderedLoci = ['cinnamon', 'ino', 'opaline'].filter(l => loci.includes(l));

        // 組換えイベントを考慮した配偶子生成
        return this._generateRecombinantGametes(chromosomes, orderedLoci);
    },

    /**
     * 組換えを考慮した配偶子生成
     *
     * cinnamon-ino間: 3%組換え
     * ino-opaline間: 30%組換え
     *
     * 二重交差（両区間で組換え）は稀だが考慮する
     */
    _generateRecombinantGametes(chromosomes, orderedLoci) {
        const r_cin_ino = this.getRecombinationRate('cinnamon', 'ino');
        const r_ino_op = this.getRecombinationRate('ino', 'opaline');

        // 4つの配偶子タイプ:
        // 1. 非組換え型（両区間とも非組換え）
        // 2. cinnamon-ino間のみ組換え
        // 3. ino-opaline間のみ組換え
        // 4. 両区間で組換え（二重交差）

        const p_no_rec = (1 - r_cin_ino) * (1 - r_ino_op);
        const p_cin_ino_only = r_cin_ino * (1 - r_ino_op);
        const p_ino_op_only = (1 - r_cin_ino) * r_ino_op;
        const p_double = r_cin_ino * r_ino_op;

        const gametes = [];
        const seen = {};

        // 配偶子タイプを生成
        const gameteConfigs = [
            { crossovers: [], probability: p_no_rec },
            { crossovers: ['cin_ino'], probability: p_cin_ino_only },
            { crossovers: ['ino_op'], probability: p_ino_op_only },
            { crossovers: ['cin_ino', 'ino_op'], probability: p_double }
        ];

        for (const config of gameteConfigs) {
            // chr1ベースで配偶子を構築
            const gamete = { ...chromosomes.chr1 };

            // 交差点より後ろは染色体を切り替え
            let useChr2 = false;
            for (let i = 0; i < orderedLoci.length; i++) {
                const locus = orderedLoci[i];

                // 交差点をチェック
                if (i > 0) {
                    const prevLocus = orderedLoci[i - 1];
                    const crossoverKey = `${prevLocus.replace('cinnamon', 'cin').replace('opaline', 'op')}_${locus.replace('cinnamon', 'cin').replace('opaline', 'op')}`;
                    if (config.crossovers.includes(crossoverKey)) {
                        useChr2 = !useChr2;
                    }
                }

                gamete[locus] = useChr2 ? chromosomes.chr2[locus] : chromosomes.chr1[locus];
            }

            // 配偶子の統合（同じ配偶子は確率を合算）
            const key = orderedLoci.map(l => gamete[l]).join('|');
            if (!seen[key]) {
                seen[key] = { alleles: gamete, probability: 0 };
            }
            seen[key].probability += config.probability;
        }

        // 相補的配偶子（chr2ベース）も生成
        for (const config of gameteConfigs) {
            const gamete = { ...chromosomes.chr2 };

            let useChr1 = false;
            for (let i = 0; i < orderedLoci.length; i++) {
                const locus = orderedLoci[i];

                if (i > 0) {
                    const prevLocus = orderedLoci[i - 1];
                    const crossoverKey = `${prevLocus.replace('cinnamon', 'cin').replace('opaline', 'op')}_${locus.replace('cinnamon', 'cin').replace('opaline', 'op')}`;
                    if (config.crossovers.includes(crossoverKey)) {
                        useChr1 = !useChr1;
                    }
                }

                gamete[locus] = useChr1 ? chromosomes.chr1[locus] : chromosomes.chr2[locus];
            }

            const key = orderedLoci.map(l => gamete[l]).join('|');
            if (!seen[key]) {
                seen[key] = { alleles: gamete, probability: 0 };
            }
            seen[key].probability += config.probability;
        }

        // 確率を正規化（合計が1になるように）
        const total = Object.values(seen).reduce((sum, g) => sum + g.probability, 0);
        for (const g of Object.values(seen)) {
            g.probability = g.probability / total;
        }

        return Object.values(seen).filter(g => g.probability > 0.0001);
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
        // ヘテロ形式: +ino, +op, +cin
        if (val.startsWith('+')) {
            return ['+', val.substring(1)];
        }
        // ホモ形式: inoino, opop, cincin
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
        
        return '不明';
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
        if (typeof BirdDB === 'undefined') {
            return { success: false, error: 'BirdDB未定義' };
        }
        const pedigree = BirdDB.buildPedigreeFromParents(parentResult.sire.id, parentResult.dam.id);
        const bird = BirdDB.addBird({
            name: offspringData.name || '',
            sex: offspringData.sex,
            genotype: offspringData.genotype,
            phenotype: offspringData.phenotype,
            sire: { id: parentResult.sire.id, name: parentResult.sire.name },
            dam: { id: parentResult.dam.id, name: parentResult.dam.name },
            pedigree,
            birthDate: offspringData.birthDate || new Date().toISOString().split('T')[0],
            notes: offspringData.notes || `${parentResult.sire.name} × ${parentResult.dam.name} の子`
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

console.log('[BreedingEngine] v' + BreedingEngine.VERSION + ' loaded (SSOT + Linkage Genetics)');
