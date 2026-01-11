/**
 * Agapornis Gene-Forge v7.0
 * 個体データベース管理（localStorage）
 *
 * v7.0 変更点:
 * - 72羽の新デモデータ（3血族 × 24羽）
 *   - Family A: INO/Opaline/Cinnamon/Pied/Violet系（完全な遺伝型あり）
 *   - Family B: Dilute/Fallow/Edged/Orangeface/Pale Headed系（完全な遺伝型あり）
 *   - Family C: Family Inference用（遺伝型なし、推論対象）
 * - Family A/B間の交配で近親婚を回避可能
 * - Family Cは表現型と血統のみ → Family Inferenceで遺伝型を推論
 * - 全個体にv7.0 Z_linkedハプロタイプ形式を適用（Family C除く）
 * - 全世代に血統情報（pedigree）を完備（近親交配リスク検証用）
 * - i18n対応強化（デモデータ、エラーメッセージ）
 * - inferObservedFromPhenotype を COLOR_MASTER 参照に変更（SSOT）
 */

const BirdDB = {
    STORAGE_KEY_USER: 'geneforge_birds_user',
    STORAGE_KEY_DEMO: 'geneforge_birds_demo',
    MODE_KEY: 'geneforge_mode',
    VERSION: '7.3.13',
    
    _currentMode: 'user',
    _initialized: false,

    get STORAGE_KEY() {
        return this._currentMode === 'demo' ? this.STORAGE_KEY_DEMO : this.STORAGE_KEY_USER;
    },

    // ========================================
    // モード管理
    // ========================================

    isReady() {
        return this._initialized;
    },

    getMode() {
        return this._currentMode;
    },

    setMode(mode) {
        if (mode !== 'demo' && mode !== 'user') {
            console.error('Invalid mode:', mode);
            return;
        }
        
        this._currentMode = mode;
        localStorage.setItem(this.MODE_KEY, mode);
        
        if (mode === 'demo') {
            const demoData = this.load();
            if (!demoData || !demoData.birds || demoData.birds.length === 0) {
                this.initDemoData();
            }
        }
        
        this.updateModeUI();
        
        if (typeof refreshBirdList === 'function') refreshBirdList();
        if (typeof refreshDBSelectors === 'function') refreshDBSelectors();
        if (typeof refreshHealthSelectors === 'function') refreshHealthSelectors();
        
        console.log('[BirdDB] Mode switched to:', mode);
    },

    setModeFromFamilyMap(mode) {
        if (mode !== 'demo' && mode !== 'user') return;
        this._currentMode = mode;
        localStorage.setItem(this.MODE_KEY, mode);
        
        if (mode === 'demo') {
            const demoData = this.load();
            if (!demoData || !demoData.birds || demoData.birds.length === 0) {
                this.initDemoData();
            }
        }
        
        this.updateModeUI();
        if (typeof refreshBirdList === 'function') refreshBirdList();
        if (typeof refreshDBSelectors === 'function') refreshDBSelectors();
        if (typeof refreshHealthSelectors === 'function') refreshHealthSelectors();
    },

    updateModeUI() {
        const demoBtn = document.getElementById('modeBtnDemo');
        const userBtn = document.getElementById('modeBtnUser');
        
        if (demoBtn && userBtn) {
            if (this._currentMode === 'demo') {
                demoBtn.classList.add('active');
                userBtn.classList.remove('active');
            } else {
                demoBtn.classList.remove('active');
                userBtn.classList.add('active');
            }
        }
    },

    init() {
        const savedMode = localStorage.getItem(this.MODE_KEY);
        if (savedMode === 'demo' || savedMode === 'user') {
            this._currentMode = savedMode;
        }

        const data = this.load();
        const needsVersionUpdate = data && data.version !== this.VERSION;

        if (!data) {
            this.save({
                version: this.VERSION,
                birds: [],
                breedingResults: [],
                settings: {
                    defaultLineage: '',
                    codePrefix: this._currentMode === 'demo' ? 'DEMO' : 'GF'
                }
            });
        } else if (needsVersionUpdate) {
            // v7.3.12: デモモードではバージョン変更時にデータを完全再生成
            if (this._currentMode === 'demo') {
                console.log('[BirdDB] Version changed, regenerating demo data');
                this.initDemoData();
            } else {
                // ユーザーモードでは移行のみ
                data.version = this.VERSION;
                if (data.birds) {
                    data.birds = data.birds.map(bird => this.migrateBird(bird));
                }
                this.save(data);
            }
        }

        if (this._currentMode === 'demo') {
            const demoData = this.load();
            if (!demoData.birds || demoData.birds.length === 0) {
                this.initDemoData();
            }
        }

        this.updateModeUI();
        this._initialized = true;

        console.log('[BirdDB] Initialized, mode:', this._currentMode, ', birds:', this.getAllBirds().length);

        return this;
    },

    initDemoData() {
        try {
            const demoBirds = this.generateDemoBirds();
            if (!demoBirds || demoBirds.length === 0) {
                console.error('[BirdDB] generateDemoBirds returned empty array');
                return;
            }
            const data = {
                version: this.VERSION,
                birds: demoBirds,
                breedingResults: [],
                settings: {
                    defaultLineage: '',
                    codePrefix: 'DEMO'
                }
            };

            localStorage.setItem(this.STORAGE_KEY_DEMO, JSON.stringify(data));
            console.log('[BirdDB] Demo data initialized:', demoBirds.length, 'birds');
        } catch (e) {
            console.error('[BirdDB] Failed to init demo data:', e);
        }
    },

    /**
     * v7.0: 24羽の家系図デモデータを生成
     * 曾祖父母8羽 → 祖父母4羽 → 父母2羽 → 子10羽
     * 曾孫の表現型が多様になるよう戦略的に設計
     */
    generateDemoBirds() {
        const birds = [];
        const now = new Date().toISOString();

        // ============================================================
        // v7.0 ヘルパー: 個体生成関数
        // ============================================================
        const createBird = (id, name, sex, colorKey, genotype, pedigree = null, generation = 0, lineage = 'Demo familyA') => {
            const isMale = sex === 'male';
            const colorDef = (typeof COLOR_MASTER !== 'undefined' && COLOR_MASTER[colorKey]) || {};
            const eyeColor = colorDef.eye || 'black';
            const darkVal = genotype.dark || 'dd';
            const darkness = darkVal === 'DD' ? 'df' : (darkVal === 'Dd' ? 'sf' : 'none');

            return {
                id: id,
                name: name,
                code: id.toUpperCase().replace('_', ''),
                sex: sex,
                birthDate: `202${generation}-01-01`,
                sire: null,
                dam: null,
                lineage: lineage,
                observed: {
                    baseColor: colorKey,
                    eyeColor: eyeColor,
                    darkness: darkness
                },
                genotype: genotype,
                pedigree: pedigree || this.createEmptyPedigree(),
                phase: genotype.Z_linked ? 'v7_haplotype' : 'independent',
                phenotype: (typeof keyToLabel === 'function') ? keyToLabel(colorKey) : ((typeof COLOR_LABELS !== 'undefined' && COLOR_LABELS[colorKey]) || colorKey),
                inbreedingGen: generation > 0 ? generation - 1 : 0,
                notes: `Demo G${generation}`,
                createdAt: now,
                updatedAt: now
            };
        };

        // ============================================================
        // G0: 曾祖父母 8羽（4カップル）
        // 子孫の多様性を最大化するよう設計
        // ============================================================

        // Couple 1: George × Helen (INO導入)
        // George: Green /aq /ino - アクアとINO潜性保有
        const george = createBird('g0_m1', 'George', 'male', 'green', {
            parblue: '+aq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: 'ino', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0);

        // Helen: Lutino - INO発現メス
        const helen = createBird('g0_f1', 'Helen', 'female', 'lutino', {
            parblue: '++', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: 'ino', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: '+' }
            }
        }, null, 0);

        // Couple 2: Ivan × Julia (ターコイズ・オパーリン導入)
        // Ivan: Turquoise /op - ターコイズ+オパーリン潜性
        const ivan = createBird('g0_m2', 'Ivan', 'male', 'turquoise', {
            parblue: 'tqtq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: 'op' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'tq' }
            }
        }, null, 0);

        // Julia: Opaline Aqua - オパーリン発現+アクア
        const julia = createBird('g0_f2', 'Julia', 'female', 'opaline_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: 'op' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0);

        // Couple 3: Kevin × Laura (シナモン・ダーク導入)
        // Kevin: Aqua Dark /cin - ダーク因子+シナモン潜性
        const kevin = createBird('g0_m3', 'Kevin', 'male', 'aqua_dark', {
            parblue: 'aqaq', dark: 'Dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: 'cin', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'D', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0);

        // Laura: Cinnamon Green - シナモン発現
        const laura = createBird('g0_f3', 'Laura', 'female', 'cinnamon_green', {
            parblue: '++', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: 'cin', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: '+' }
            }
        }, null, 0);

        // Couple 4: Martin × Nancy (パイド・バイオレット導入)
        // Martin: Seagreen Pied - シーグリーン+パイド
        const martin = createBird('g0_m4', 'Martin', 'male', 'pied_rec_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: 'pipi', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0);

        // Nancy: Violet Aqua - バイオレット因子
        const nancy = createBird('g0_f4', 'Nancy', 'female', 'violet_aqua', {
            parblue: 'aqaq', dark: 'Dd', violet: 'Vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'D', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0);

        // G0を追加
        birds.push(george, helen, ivan, julia, kevin, laura, martin, nancy);

        // ============================================================
        // G1: 祖父母 4羽（2カップル）
        // ============================================================

        // Adam: George × Helen の息子 → Aqua /ino (INO潜性保有オス)
        const adam = createBird('g1_m1', 'Adam', 'male', 'aqua', {
            parblue: '+aq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: 'ino', opaline: '+' },  // Helen由来
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }     // George由来(野生型側)
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'g0_m1', dam: 'g0_f1'
        }, 1);

        // Beth: Ivan × Julia の娘 → Opaline Seagreen
        const beth = createBird('g1_f1', 'Beth', 'female', 'opaline_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: 'op' },  // Ivan由来
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'g0_m2', dam: 'g0_f2'
        }, 1);

        // Chris: Kevin × Laura の息子 → Cinnamon Aqua /dark
        const chris = createBird('g1_m2', 'Chris', 'male', 'cinnamon_aqua', {
            parblue: '+aq', dark: 'Dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: 'cin', ino: '+', opaline: '+' },  // Laura由来
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }     // Kevin野生型側
            },
            autosomal_1: {
                chr1: { dark: 'D', parblue: 'aq' },
                chr2: { dark: 'd', parblue: '+' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'g0_m3', dam: 'g0_f3'
        }, 1);

        // Diana: Martin × Nancy の娘 → Seagreen /pied /violet
        const diana = createBird('g1_f2', 'Diana', 'female', 'seagreen', {
            parblue: 'tqaq', dark: 'Dd', violet: 'Vv',
            pied_rec: '+pi', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'D', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'g0_m4', dam: 'g0_f4'
        }, 1);

        // G1を追加
        birds.push(adam, beth, chris, diana);

        // ============================================================
        // G2: 父母 2羽（1カップル）
        // ============================================================

        // Eric: Adam × Beth の息子 → Opaline Seagreen /ino
        const eric = createBird('g2_m1', 'Eric', 'male', 'opaline_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: 'op' },   // Beth由来
                Z2: { cinnamon: '+', ino: 'ino', opaline: '+' }   // Adam由来(INO側)
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'g1_m1', dam: 'g1_f1',
            sire_sire: 'g0_m1', sire_dam: 'g0_f1',
            dam_sire: 'g0_m2', dam_dam: 'g0_f2'
        }, 2);

        // Fiona: Chris × Diana の娘 → Cinnamon Seagreen /dark /pied /violet
        const fiona = createBird('g2_f1', 'Fiona', 'female', 'cinnamon_seagreen', {
            parblue: 'tqaq', dark: 'Dd', violet: 'Vv',
            pied_rec: '+pi', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: 'cin', ino: '+', opaline: '+' },  // Chris由来
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'D', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'g1_m2', dam: 'g1_f2',
            sire_sire: 'g0_m3', sire_dam: 'g0_f3',
            dam_sire: 'g0_m4', dam_dam: 'g0_f4'
        }, 2);

        // G2を追加
        birds.push(eric, fiona);

        // ============================================================
        // G3: 子 10羽（多様な表現型）
        // Eric × Fiona から遺伝的に可能な子
        // ============================================================

        const fullPedigree = {
            sire: 'g2_m1', dam: 'g2_f1',
            sire_sire: 'g1_m1', sire_dam: 'g1_f1',
            dam_sire: 'g1_m2', dam_dam: 'g1_f2',
            sire_sire_sire: 'g0_m1', sire_sire_dam: 'g0_f1',
            sire_dam_sire: 'g0_m2', sire_dam_dam: 'g0_f2',
            dam_sire_sire: 'g0_m3', dam_sire_dam: 'g0_f3',
            dam_dam_sire: 'g0_m4', dam_dam_dam: 'g0_f4'
        };

        // Child 1: Oscar ♂ Opaline Cinnamon Seagreen (op+cin)
        const oscar = createBird('g3_01', 'Oscar', 'male', 'opaline_cinnamon_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: 'op' },
                Z2: { cinnamon: 'cin', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigree, 3);

        // Child 2: Penny ♀ Creamino Seagreen (ino発現)
        const penny = createBird('g3_02', 'Penny', 'female', 'creamino_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: 'ino', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigree, 3);

        // Child 3: Quinn ♂ Seagreen Dark /cin /ino /op
        const quinn = createBird('g3_03', 'Quinn', 'male', 'seagreen_dark', {
            parblue: 'tqaq', dark: 'Dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: 'op' },
                Z2: { cinnamon: 'cin', ino: 'ino', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'D', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigree, 3);

        // Child 4: Rose ♀ Opaline Turquoise
        const rose = createBird('g3_04', 'Rose', 'female', 'opaline_turquoise', {
            parblue: 'tqtq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: 'op' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'tq' }
            }
        }, fullPedigree, 3);

        // Child 5: Sam ♂ Cinnamon Aqua /op /ino
        const sam = createBird('g3_05', 'Sam', 'male', 'cinnamon_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: 'cin', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: 'ino', opaline: 'op' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigree, 3);

        // Child 6: Tara ♀ Cinnamon Seagreen Dark
        const tara = createBird('g3_06', 'Tara', 'female', 'cinnamon_seagreen_dark', {
            parblue: 'tqaq', dark: 'Dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: 'cin', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'D', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigree, 3);

        // Child 7: Uma ♀ Violet Seagreen
        const uma = createBird('g3_07', 'Uma', 'female', 'violet_seagreen', {
            parblue: 'tqaq', dark: 'Dd', violet: 'Vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'D', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigree, 3);

        // Child 8: Victor ♂ Opaline Aqua /cin /ino
        const victor = createBird('g3_08', 'Victor', 'male', 'opaline_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: 'op' },
                Z2: { cinnamon: 'cin', ino: 'ino', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigree, 3);

        // Child 9: Wendy ♀ Pied Seagreen (pied発現)
        const wendy = createBird('g3_09', 'Wendy', 'female', 'pied_rec_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: 'pipi', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigree, 3);

        // Child 10: Xavier ♂ Turquoise /cin /ino /op /pied
        const xavier = createBird('g3_10', 'Xavier', 'male', 'turquoise', {
            parblue: 'tqtq', dark: 'dd', violet: 'vv',
            pied_rec: '+pi', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: 'ino', opaline: '+' },
                Z2: { cinnamon: 'cin', ino: '+', opaline: 'op' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'tq' }
            }
        }, fullPedigree, 3);

        // G3を追加
        birds.push(oscar, penny, quinn, rose, sam, tara, uma, victor, wendy, xavier);

        // ============================================================
        // FAMILY B: 独立血族（Dilute/Fallow/Edged系）
        // Family Aとは血縁関係なし - 近親婚を避けた交配が可能
        // ============================================================

        // ============================================================
        // Family B - G0: 曾祖父母 8羽（4カップル）
        // ============================================================

        // Couple 1: Aaron × Bella (Dilute導入)
        // Aaron: Dilute Green /aq - ダイリュート+アクア潜性
        const aaron = createBird('b0_m1', 'Aaron', 'male', 'dilute_green', {
            parblue: '+aq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: 'dildil',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0, 'Demo familyB');

        // Bella: Dilute Aqua - ダイリュートアクア
        const bella = createBird('b0_f1', 'Bella', 'female', 'dilute_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: 'dildil',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0, 'Demo familyB');

        // Couple 2: Carl × Daisy (Fallow Pale導入)
        // Carl: Fallow Green /tq - フォローペール+ターコイズ潜性
        const carl = createBird('b0_m2', 'Carl', 'male', 'fallow_green', {
            parblue: '+tq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: 'flpflp', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: 'tq' }
            }
        }, null, 0, 'Demo familyB');

        // Daisy: Fallow Turquoise - フォローターコイズ
        const daisy = createBird('b0_f2', 'Daisy', 'female', 'fallow_turquoise', {
            parblue: 'tqtq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: 'flpflp', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'tq' }
            }
        }, null, 0, 'Demo familyB');

        // Couple 3: Edward × Flora (Edged + Bronze Fallow導入)
        // Edward: Edged Green /aq /fallow_bronze - エッジド+ブロンズフォロー潜性
        const edward = createBird('b0_m3', 'Edward', 'male', 'edged_green', {
            parblue: '+aq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '+flb',
            edged: 'eded', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0, 'Demo familyB');

        // Flora: Edged Aqua - エッジドアクア
        const flora = createBird('b0_f3', 'Flora', 'female', 'edged_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '+flb',
            edged: 'eded', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0, 'Demo familyB');

        // Couple 4: Gary × Holly (Orangeface + Pale Headed導入)
        // Gary: Orangeface Green /aq /pale_headed - オレンジフェイス+ペールヘッド潜性
        const gary = createBird('b0_m4', 'Gary', 'male', 'orangeface_green', {
            parblue: '+aq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: 'ofof', pale_headed: '+ph',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0, 'Demo familyB');

        // Holly: Pale Headed Aqua - ペールヘッドアクア
        const holly = createBird('b0_f4', 'Holly', 'female', 'pale_headed_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '+of', pale_headed: 'phph',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, null, 0, 'Demo familyB');

        // Family B G0を追加
        birds.push(aaron, bella, carl, daisy, edward, flora, gary, holly);

        // ============================================================
        // Family B - G1: 祖父母 4羽（2カップル）
        // ============================================================

        // Ian: Aaron × Bella の息子 → Dilute Aqua
        const ian = createBird('b1_m1', 'Ian', 'male', 'dilute_aqua', {
            parblue: '+aq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: 'dildil',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'b0_m1', dam: 'b0_f1'
        }, 1, 'Demo familyB');

        // Jane: Carl × Daisy の娘 → Fallow Seagreen
        const jane = createBird('b1_f1', 'Jane', 'female', 'fallow_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: 'flpflp', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'b0_m2', dam: 'b0_f2'
        }, 1, 'Demo familyB');

        // Kyle: Edward × Flora の息子 → Edged Aqua /fallow_bronze
        const kyle = createBird('b1_m2', 'Kyle', 'male', 'edged_aqua', {
            parblue: '+aq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '+flb',
            edged: 'eded', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'b0_m3', dam: 'b0_f3'
        }, 1, 'Demo familyB');

        // Lisa: Gary × Holly の娘 → Orangeface Pale Headed Aqua
        const lisa = createBird('b1_f2', 'Lisa', 'female', 'orangeface_pale_headed_aqua', {
            parblue: '+aq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '++',
            edged: '++', orangeface: '+of', pale_headed: '+ph',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: '+' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'b0_m4', dam: 'b0_f4'
        }, 1, 'Demo familyB');

        // Family B G1を追加
        birds.push(ian, jane, kyle, lisa);

        // ============================================================
        // Family B - G2: 父母 2羽（1カップル）
        // ============================================================

        // Mike: Ian × Jane の息子 → Dilute Fallow Seagreen
        const mike = createBird('b2_m1', 'Mike', 'male', 'dilute_fallow_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'b1_m1', dam: 'b1_f1',
            sire_sire: 'b0_m1', sire_dam: 'b0_f1',
            dam_sire: 'b0_m2', dam_dam: 'b0_f2'
        }, 2, 'Demo familyB');

        // Nina: Kyle × Lisa の娘 → Edged Aqua /orangeface /pale_headed
        const nina = createBird('b2_f1', 'Nina', 'female', 'edged_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '++',
            fallow_pale: '++', fallow_bronze: '+flb',
            edged: '+ed', orangeface: '+of', pale_headed: '+ph',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, {
            ...this.createEmptyPedigree(),
            sire: 'b1_m2', dam: 'b1_f2',
            sire_sire: 'b0_m3', sire_dam: 'b0_f3',
            dam_sire: 'b0_m4', dam_dam: 'b0_f4'
        }, 2, 'Demo familyB');

        // Family B G2を追加
        birds.push(mike, nina);

        // ============================================================
        // Family B - G3: 子 10羽（多様な表現型）
        // Mike × Nina から遺伝的に可能な子
        // ============================================================

        const fullPedigreeB = {
            sire: 'b2_m1', dam: 'b2_f1',
            sire_sire: 'b1_m1', sire_dam: 'b1_f1',
            dam_sire: 'b1_m2', dam_dam: 'b1_f2',
            sire_sire_sire: 'b0_m1', sire_sire_dam: 'b0_f1',
            sire_dam_sire: 'b0_m2', sire_dam_dam: 'b0_f2',
            dam_sire_sire: 'b0_m3', dam_sire_dam: 'b0_f3',
            dam_dam_sire: 'b0_m4', dam_dam_dam: 'b0_f4'
        };

        // Child 1: Andy ♂ Dilute Seagreen /fallow /edged
        const andy = createBird('b3_01', 'Andy', 'male', 'dilute_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '++',
            edged: '+ed', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Child 2: Bonnie ♀ Fallow Aqua /dilute
        const bonnie = createBird('b3_02', 'Bonnie', 'female', 'fallow_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Child 3: Cody ♂ Edged Seagreen /dilute /fallow
        const cody = createBird('b3_03', 'Cody', 'male', 'edged_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '+flb',
            edged: '+ed', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Child 4: Dawn ♀ Dilute Aqua /fallow /edged
        const dawn = createBird('b3_04', 'Dawn', 'female', 'dilute_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '+flb',
            edged: '+ed', orangeface: '+of', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Child 5: Ethan ♂ Seagreen /dilute /fallow /edged /orangeface
        const ethan = createBird('b3_05', 'Ethan', 'male', 'seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '+flb',
            edged: '+ed', orangeface: '+of', pale_headed: '+ph',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Child 6: Grace ♀ Orangeface Aqua /dilute /fallow
        const grace = createBird('b3_06', 'Grace', 'female', 'orangeface_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '++',
            edged: '++', orangeface: '+of', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Child 7: Henry ♂ Turquoise /dilute /fallow /edged
        const henry = createBird('b3_07', 'Henry', 'male', 'turquoise', {
            parblue: 'tqtq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '++',
            edged: '+ed', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'tq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Child 8: Iris ♀ Pale Headed Seagreen /dilute /fallow
        const iris = createBird('b3_08', 'Iris', 'female', 'pale_headed_seagreen', {
            parblue: 'tqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '++',
            edged: '++', orangeface: '++', pale_headed: '+ph',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'tq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Child 9: Jake ♂ Aqua /dilute /fallow /edged /pale_headed
        const jake = createBird('b3_09', 'Jake', 'male', 'aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '+flp', fallow_bronze: '+flb',
            edged: '+ed', orangeface: '++', pale_headed: '+ph',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: { cinnamon: '+', ino: '+', opaline: '+' }
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Child 10: Kate ♀ Bronze Fallow Aqua /dilute /edged
        const kate = createBird('b3_10', 'Kate', 'female', 'fallow_bronze_aqua', {
            parblue: 'aqaq', dark: 'dd', violet: 'vv',
            pied_rec: '++', pied_dom: '++', dilute: '+dil',
            fallow_pale: '++', fallow_bronze: 'flbflb',
            edged: '+ed', orangeface: '++', pale_headed: '++',
            Z_linked: {
                Z1: { cinnamon: '+', ino: '+', opaline: '+' },
                Z2: null
            },
            autosomal_1: {
                chr1: { dark: 'd', parblue: 'aq' },
                chr2: { dark: 'd', parblue: 'aq' }
            }
        }, fullPedigreeB, 3, 'Demo familyB');

        // Family B G3を追加
        birds.push(andy, bonnie, cody, dawn, ethan, grace, henry, iris, jake, kate);

        // ============================================================
        // FAMILY C: Family Inference デモ用血族
        // 遺伝型は「空」- 表現型と血統情報から推論する練習用
        // ============================================================
        //
        // 【整合性担保のための内部設計メモ】
        // この24羽は以下の遺伝型から生成されたが、リリース時は遺伝型を削除する
        //
        // G0 (曽祖父母) - 真の遺伝型:
        // Couple 1: Leo × Maria (Z連鎖cis/trans相推論用)
        //   Leo: Green ♂ - Z1:{cin:'cin',ino:'ino'} cis, Z2:{+,+} → /cin-ino(cis)
        //   Maria: Lutino ♀ - Z1:{ino:'ino'}
        //
        // Couple 2: Nathan × Olive (Opaline + Parblue推論用)
        //   Nathan: Opaline Green ♂ - Z1:{op:'op'}, parblue:'+tq' → /op /tq
        //   Olive: Aqua ♀ - parblue:'aqaq'
        //
        // Couple 3: Peter × Rita (Dark-Parblue連鎖推論用)
        //   Peter: Aqua SF Dark ♂ - autosomal_1:{D-aq, d-aq}
        //   Rita: Turquoise SF Dark ♀ - autosomal_1:{D-tq, d-tq}
        //
        // Couple 4: Simon × Tina (複合形質推論用)
        //   Simon: Cinnamon Green ♂ - Z1:{cin:'cin'}, parblue:'+aq', violet:'Vv'
        //   Tina: Violet Aqua ♀ - parblue:'aqaq', dark:'Dd', violet:'Vv'
        // ============================================================

        // Family C用ヘルパー: 遺伝型なし（推論用）で個体生成
        const createInferenceBird = (id, name, sex, colorKey, pedigree = null, generation = 0) => {
            const colorDef = (typeof COLOR_MASTER !== 'undefined' && COLOR_MASTER[colorKey]) || {};
            const eyeColor = colorDef.eye || 'black';
            // ダーク因子は表現型名から推測
            let darkness = 'none';
            if (colorKey.includes('_olive') || colorKey.includes('_df')) {
                darkness = 'df';
            } else if (colorKey.includes('_dark') || colorKey.includes('violet')) {
                darkness = 'sf';
            }

            return {
                id: id,
                name: name,
                code: id.toUpperCase().replace('_', ''),
                sex: sex,
                birthDate: `202${generation}-01-01`,
                sire: null,
                dam: null,
                lineage: 'Demo familyC',
                observed: {
                    baseColor: colorKey,
                    eyeColor: eyeColor,
                    darkness: darkness
                },
                genotype: {},  // 空 - Family Inference で推論する
                pedigree: pedigree || this.createEmptyPedigree(),
                phase: 'unknown',  // 推論対象
                phenotype: (typeof keyToLabel === 'function') ? keyToLabel(colorKey) : ((typeof COLOR_LABELS !== 'undefined' && COLOR_LABELS[colorKey]) || colorKey),
                notes: `Demo G${generation} - For Inference`,
                createdAt: now,
                updatedAt: now
            };
        };

        // ============================================================
        // Family C - G0: 曾祖父母 8羽（4カップル）
        // ============================================================

        // Couple 1: Leo × Maria (Z連鎖cis相推論)
        const leo = createInferenceBird('c0_m1', 'Leo', 'male', 'green', null, 0);
        const maria = createInferenceBird('c0_f1', 'Maria', 'female', 'lutino', null, 0);

        // Couple 2: Nathan × Olive (Opaline + Parblue推論)
        const nathan = createInferenceBird('c0_m2', 'Nathan', 'male', 'opaline_green', null, 0);
        const olive = createInferenceBird('c0_f2', 'Olive', 'female', 'aqua', null, 0);

        // Couple 3: Peter × Rita (Dark-Parblue連鎖推論)
        const peter = createInferenceBird('c0_m3', 'Peter', 'male', 'aqua_dark', null, 0);
        const rita = createInferenceBird('c0_f3', 'Rita', 'female', 'turquoise_dark', null, 0);

        // Couple 4: Simon × Tina (複合形質推論)
        const simon = createInferenceBird('c0_m4', 'Simon', 'male', 'cinnamon_green', null, 0);
        const tina = createInferenceBird('c0_f4', 'Tina', 'female', 'violet_aqua', null, 0);

        birds.push(leo, maria, nathan, olive, peter, rita, simon, tina);

        // ============================================================
        // Family C - G1: 祖父母 4羽（2カップル）
        // ============================================================

        // Warren: Leo × Maria の息子 → Lutino /cin (Z1からcin-ino cis継承)
        // 【推論ポイント】表現型はLutinoだが、子孫にCinnamonが出れば/cinが推論できる
        const warren = createInferenceBird('c1_m1', 'Warren', 'male', 'lutino', {
            ...this.createEmptyPedigree(),
            sire: 'c0_m1', dam: 'c0_f1'
        }, 1);

        // Yolanda: Nathan × Olive の娘 → Opaline Seagreen
        // 【推論ポイント】父がOpaline Green/tqなら、tqを継承+母のaqでSeagreen
        const yolanda = createInferenceBird('c1_f1', 'Yolanda', 'female', 'opaline_seagreen', {
            ...this.createEmptyPedigree(),
            sire: 'c0_m2', dam: 'c0_f2'
        }, 1);

        // Zeke: Peter × Rita の息子 → Seagreen SF Dark
        // 【推論ポイント】Dark-Parblue連鎖から、どの染色体を継承したか推論
        const zeke = createInferenceBird('c1_m2', 'Zeke', 'male', 'seagreen_dark', {
            ...this.createEmptyPedigree(),
            sire: 'c0_m3', dam: 'c0_f3'
        }, 1);

        // Abby: Simon × Tina の娘 → Cinnamon Aqua (Violetはモディファイア)
        // 【推論ポイント】複合形質の推論（cin + aqua）
        const abby = createInferenceBird('c1_f2', 'Abby', 'female', 'cinnamon_aqua', {
            ...this.createEmptyPedigree(),
            sire: 'c0_m4', dam: 'c0_f4'
        }, 1);

        birds.push(warren, yolanda, zeke, abby);

        // ============================================================
        // Family C - G2: 父母 2羽（1カップル）
        // ============================================================

        // Blake: Warren × Yolanda の息子 → Green (多数のスプリット保有)
        // 【推論ポイント】表現型はGreenだが、子孫の表現型から/cin /ino /op /tqを推論
        const blake = createInferenceBird('c2_m1', 'Blake', 'male', 'green', {
            ...this.createEmptyPedigree(),
            sire: 'c1_m1', dam: 'c1_f1',
            sire_sire: 'c0_m1', sire_dam: 'c0_f1',
            dam_sire: 'c0_m2', dam_dam: 'c0_f2'
        }, 2);

        // Carmen: Zeke × Abby の娘 → Seagreen SF Dark
        // 【推論ポイント】Violet不発現なのでvvか、Darkなしか推論
        const carmen = createInferenceBird('c2_f1', 'Carmen', 'female', 'seagreen_dark', {
            ...this.createEmptyPedigree(),
            sire: 'c1_m2', dam: 'c1_f2',
            sire_sire: 'c0_m3', sire_dam: 'c0_f3',
            dam_sire: 'c0_m4', dam_dam: 'c0_f4'
        }, 2);

        birds.push(blake, carmen);

        // ============================================================
        // Family C - G3: 子 10羽（多様な表現型）
        // Blake × Carmen から遺伝的に可能な子
        // ============================================================

        const fullPedigreeC = {
            sire: 'c2_m1', dam: 'c2_f1',
            sire_sire: 'c1_m1', sire_dam: 'c1_f1',
            dam_sire: 'c1_m2', dam_dam: 'c1_f2',
            sire_sire_sire: 'c0_m1', sire_sire_dam: 'c0_f1',
            sire_dam_sire: 'c0_m2', sire_dam_dam: 'c0_f2',
            dam_sire_sire: 'c0_m3', dam_sire_dam: 'c0_f3',
            dam_dam_sire: 'c0_m4', dam_dam_dam: 'c0_f4'
        };

        // Child 1: Derek ♂ → Dark Green (SF Dark)
        // 【推論】表現型Dark Greenだが、血統から/cin /ino等が推論可能
        const derek = createInferenceBird('c3_01', 'Derek', 'male', 'darkgreen', fullPedigreeC, 3);

        // Child 2: Ellie ♀ → Lutino
        // 【推論】ino発現メス。父Blakeの/inoが証明される
        const ellie = createInferenceBird('c3_02', 'Ellie', 'female', 'lutino', fullPedigreeC, 3);

        // Child 3: Felix ♂ → Seagreen SF Dark
        // 【推論】parblueがtqaq、darkがDd
        const felix = createInferenceBird('c3_03', 'Felix', 'male', 'seagreen_dark', fullPedigreeC, 3);

        // Child 4: Gia ♀ → Opaline Seagreen SF Dark
        // 【推論】父Blakeの/opが証明される
        const gia = createInferenceBird('c3_04', 'Gia', 'female', 'opaline_seagreen_dark', fullPedigreeC, 3);

        // Child 5: Harvey ♂ → Turquoise
        // 【推論】parblue=tqtq、父からtq、母からtq(seagreenのtq側)
        const harvey_c = createInferenceBird('c3_05', 'Harvey', 'male', 'turquoise', fullPedigreeC, 3);

        // Child 6: Ivy ♀ → Creamino Seagreen
        // 【推論】ino発現 + seagreen。父の/ino + 両親のparblue
        const ivy_c = createInferenceBird('c3_06', 'Ivy', 'female', 'creamino_seagreen', fullPedigreeC, 3);

        // Child 7: Jordan ♂ → Green
        // 【推論】野生型表現だが、多数のスプリット保有
        const jordan = createInferenceBird('c3_07', 'Jordan', 'male', 'green', fullPedigreeC, 3);

        // Child 8: Kira ♀ → Opaline Turquoise
        // 【推論】opaline発現 + turquoise
        const kira = createInferenceBird('c3_08', 'Kira', 'female', 'opaline_turquoise', fullPedigreeC, 3);

        // Child 9: Liam ♂ → Seagreen
        // 【推論】parblue=tqaq、darkなし
        const liam = createInferenceBird('c3_09', 'Liam', 'male', 'seagreen', fullPedigreeC, 3);

        // Child 10: Nadia ♀ → Pure White (Turquoise + INO)
        // 【推論】ino発現 + turquoise = pure_white
        const nadia = createInferenceBird('c3_10', 'Nadia', 'female', 'pure_white', fullPedigreeC, 3);

        birds.push(derek, ellie, felix, gia, harvey_c, ivy_c, jordan, kira, liam, nadia);

        return birds;
    },

    /**
     * v7.0: デモ家系図をFamilyMap形式で取得
     * 72羽の家系図データを返す（3血族 × 24羽）
     * @param {string} family - 'A', 'B', または 'C'（デフォルト: 'A'）
     */
    getDemoPedigreeForFamilyMap(family = 'A') {
        const birds = this.getAllBirds();
        const findBird = (id) => birds.find(b => b.id === id);

        const toBirdData = (id) => {
            const bird = findBird(id);
            if (!bird) return null;
            return {
                id: bird.id,
                dbId: bird.id,
                name: bird.name,
                sex: bird.sex,
                phenotype: bird.observed || { baseColor: 'green' },
                genotype: bird.genotype || {},
                fromDB: true
            };
        };

        // Family A IDs (INO/Opaline/Cinnamon/Pied/Violet系)
        const idsA = {
            sire_sire_sire: 'g0_m1', sire_sire_dam: 'g0_f1',
            sire_dam_sire: 'g0_m2', sire_dam_dam: 'g0_f2',
            dam_sire_sire: 'g0_m3', dam_sire_dam: 'g0_f3',
            dam_dam_sire: 'g0_m4', dam_dam_dam: 'g0_f4',
            sire_sire: 'g1_m1', sire_dam: 'g1_f1',
            dam_sire: 'g1_m2', dam_dam: 'g1_f2',
            sire: 'g2_m1', dam: 'g2_f1',
        };
        const offspringA = ['g3_01', 'g3_02', 'g3_03', 'g3_04', 'g3_05',
                           'g3_06', 'g3_07', 'g3_08', 'g3_09', 'g3_10'];

        // Family B IDs (Dilute/Fallow/Edged/Orangeface/Pale Headed系)
        const idsB = {
            sire_sire_sire: 'b0_m1', sire_sire_dam: 'b0_f1',
            sire_dam_sire: 'b0_m2', sire_dam_dam: 'b0_f2',
            dam_sire_sire: 'b0_m3', dam_sire_dam: 'b0_f3',
            dam_dam_sire: 'b0_m4', dam_dam_dam: 'b0_f4',
            sire_sire: 'b1_m1', sire_dam: 'b1_f1',
            dam_sire: 'b1_m2', dam_dam: 'b1_f2',
            sire: 'b2_m1', dam: 'b2_f1',
        };
        const offspringB = ['b3_01', 'b3_02', 'b3_03', 'b3_04', 'b3_05',
                           'b3_06', 'b3_07', 'b3_08', 'b3_09', 'b3_10'];

        // Family C IDs (Inference用 - 遺伝型なし)
        const idsC = {
            sire_sire_sire: 'c0_m1', sire_sire_dam: 'c0_f1',
            sire_dam_sire: 'c0_m2', sire_dam_dam: 'c0_f2',
            dam_sire_sire: 'c0_m3', dam_sire_dam: 'c0_f3',
            dam_dam_sire: 'c0_m4', dam_dam_dam: 'c0_f4',
            sire_sire: 'c1_m1', sire_dam: 'c1_f1',
            dam_sire: 'c1_m2', dam_dam: 'c1_f2',
            sire: 'c2_m1', dam: 'c2_f1',
        };
        const offspringC = ['c3_01', 'c3_02', 'c3_03', 'c3_04', 'c3_05',
                           'c3_06', 'c3_07', 'c3_08', 'c3_09', 'c3_10'];

        let ids, offspringIds, familyName;
        if (family === 'C') {
            ids = idsC;
            offspringIds = offspringC;
            familyName = 'Demo familyC';
        } else if (family === 'B') {
            ids = idsB;
            offspringIds = offspringB;
            familyName = 'Demo familyB';
        } else {
            ids = idsA;
            offspringIds = offspringA;
            familyName = 'Demo familyA';
        }

        return {
            name: (window.T && T.demo_family_name) || familyName,
            savedAt: new Date().toISOString(),
            sire_sire_sire: toBirdData(ids.sire_sire_sire),
            sire_sire_dam: toBirdData(ids.sire_sire_dam),
            sire_dam_sire: toBirdData(ids.sire_dam_sire),
            sire_dam_dam: toBirdData(ids.sire_dam_dam),
            dam_sire_sire: toBirdData(ids.dam_sire_sire),
            dam_sire_dam: toBirdData(ids.dam_sire_dam),
            dam_dam_sire: toBirdData(ids.dam_dam_sire),
            dam_dam_dam: toBirdData(ids.dam_dam_dam),
            sire_sire: toBirdData(ids.sire_sire),
            sire_dam: toBirdData(ids.sire_dam),
            dam_sire: toBirdData(ids.dam_sire),
            dam_dam: toBirdData(ids.dam_dam),
            sire: toBirdData(ids.sire),
            dam: toBirdData(ids.dam),
            offspring: offspringIds.map(id => toBirdData(id)).filter(b => b !== null),
        };
    },

    createEmptyPedigree() {
        return {
            sire: null, dam: null,
            sire_sire: null, sire_dam: null, dam_sire: null, dam_dam: null,
            sire_sire_sire: null, sire_sire_dam: null, sire_dam_sire: null, sire_dam_dam: null,
            dam_sire_sire: null, dam_sire_dam: null, dam_dam_sire: null, dam_dam_dam: null
        };
    },

    buildPedigreeFromParents(sireId, damId) {
        const pedigree = this.createEmptyPedigree();
        
        pedigree.sire = sireId || null;
        pedigree.dam = damId || null;
        
        if (sireId) {
            const sire = this.getBird(sireId);
            if (sire && sire.pedigree) {
                pedigree.sire_sire = sire.pedigree.sire || null;
                pedigree.sire_dam = sire.pedigree.dam || null;
                pedigree.sire_sire_sire = sire.pedigree.sire_sire || null;
                pedigree.sire_sire_dam = sire.pedigree.sire_dam || null;
                pedigree.sire_dam_sire = sire.pedigree.dam_sire || null;
                pedigree.sire_dam_dam = sire.pedigree.dam_dam || null;
            }
        }
        
        if (damId) {
            const dam = this.getBird(damId);
            if (dam && dam.pedigree) {
                pedigree.dam_sire = dam.pedigree.sire || null;
                pedigree.dam_dam = dam.pedigree.dam || null;
                pedigree.dam_sire_sire = dam.pedigree.sire_sire || null;
                pedigree.dam_sire_dam = dam.pedigree.sire_dam || null;
                pedigree.dam_dam_sire = dam.pedigree.dam_sire || null;
                pedigree.dam_dam_dam = dam.pedigree.dam_dam || null;
            }
        }
        
        return pedigree;
    },

    migrateBird(bird) {
        if (!bird.observed) {
            bird.observed = this.inferObservedFromPhenotype(bird.phenotype, bird.genotype);
        }

        if (!bird.pedigree) {
            bird.pedigree = this.createEmptyPedigree();
            if (bird.sire?.id || bird.dam?.id) {
                bird.pedigree.sire = bird.sire?.id || null;
                bird.pedigree.dam = bird.dam?.id || null;
            }
        }

        // v7.0: 連鎖遺伝子座のハプロタイプ形式への移行
        if (!bird.genotype.Z_linked) {
            bird.genotype = this.migrateGenotypeToV7(bird.genotype, bird.sex, bird.observed?.baseColor);
        }

        return bird;
    },

    /**
     * v7.0: 遺伝型をハプロタイプベース形式に変換
     * @param {Object} oldGenotype - 旧形式の遺伝型
     * @param {string} sex - 'male' | 'female'
     * @param {string} baseColor - 表現型（相の推論に使用）
     * @returns {Object} 新形式の遺伝型
     */
    migrateGenotypeToV7(oldGenotype, sex, baseColor) {
        const isMale = sex === 'male';

        // 旧形式の値をパース
        const parseZLinkedAllele = (value, locusKey) => {
            if (!value) return { a1: '+', a2: isMale ? '+' : null };

            // メス形式: 'cinW', 'opW', 'inoW', 'pldW', '+W'
            if (value.endsWith('W')) {
                const allele = value.slice(0, -1);
                return { a1: allele === '+' ? '+' : allele, a2: null };
            }

            // オス形式
            if (value === '++') return { a1: '+', a2: '+' };
            if (value === 'opop') return { a1: 'op', a2: 'op' };
            if (value === 'cincin') return { a1: 'cin', a2: 'cin' };
            if (value === 'inoino') return { a1: 'ino', a2: 'ino' };
            if (value === 'pldpld') return { a1: 'pld', a2: 'pld' };
            if (value === 'pldino') return { a1: 'pld', a2: 'ino' };
            if (value === '+op') return { a1: 'op', a2: '+' };
            if (value === '+cin') return { a1: 'cin', a2: '+' };
            if (value === '+ino') return { a1: 'ino', a2: '+' };
            if (value === '+pld') return { a1: 'pld', a2: '+' };

            return { a1: '+', a2: isMale ? '+' : null };
        };

        const parseAutosomalAllele = (value, locusKey) => {
            if (!value) return { a1: '+', a2: '+' };

            // dark: 'dd', 'Dd', 'DD'
            if (locusKey === 'dark') {
                if (value === 'dd') return { a1: 'd', a2: 'd' };
                if (value === 'Dd') return { a1: 'D', a2: 'd' };
                if (value === 'DD') return { a1: 'D', a2: 'D' };
            }

            // parblue: '++', '+aq', '+tq', 'aqaq', 'tqtq', 'tqaq'
            if (locusKey === 'parblue') {
                if (value === '++') return { a1: '+', a2: '+' };
                if (value === '+aq') return { a1: 'aq', a2: '+' };
                if (value === '+tq') return { a1: 'tq', a2: '+' };
                if (value === 'aqaq') return { a1: 'aq', a2: 'aq' };
                if (value === 'tqtq') return { a1: 'tq', a2: 'tq' };
                if (value === 'tqaq') return { a1: 'tq', a2: 'aq' };
            }

            return { a1: '+', a2: '+' };
        };

        // Z連鎖座位のパース
        const cin = parseZLinkedAllele(oldGenotype.cin, 'cinnamon');
        const ino = parseZLinkedAllele(oldGenotype.ino, 'ino');
        const op = parseZLinkedAllele(oldGenotype.op, 'opaline');

        // 常染色体連鎖座位のパース
        const dark = parseAutosomalAllele(oldGenotype.dark, 'dark');
        const parblue = parseAutosomalAllele(oldGenotype.parblue, 'parblue');

        // 相の推論（表現型から）
        // Lacewing (cinnamon + ino) → cin-ino は Cis
        const isLacewing = baseColor && (
            baseColor.includes('lacewing') ||
            (baseColor.includes('cinnamon') && baseColor.includes('ino'))
        );

        // ハプロタイプ構築
        // デフォルト: 変異アレルをZ1に配置
        // 相が推論可能な場合はそれに従う
        let Z_linked;
        if (isMale) {
            Z_linked = {
                Z1: { cinnamon: cin.a1, ino: ino.a1, opaline: op.a1 },
                Z2: { cinnamon: cin.a2, ino: ino.a2, opaline: op.a2 }
            };
        } else {
            Z_linked = {
                Z1: { cinnamon: cin.a1, ino: ino.a1, opaline: op.a1 },
                Z2: null
            };
        }

        const autosomal_1 = {
            chr1: { dark: dark.a1, parblue: parblue.a1 },
            chr2: { dark: dark.a2, parblue: parblue.a2 }
        };

        // 相の確定状態を記録
        const hasMultipleZMutations =
            (cin.a1 !== '+' || cin.a2 !== '+') &&
            (ino.a1 !== '+' || ino.a2 !== '+' || op.a1 !== '+' || op.a2 !== '+');

        const phaseKnown = isLacewing || !hasMultipleZMutations;

        // 新形式の遺伝型を構築
        // 独立座位は旧形式を維持（キー名を正規化）
        return {
            // 独立座位（LOCI準拠キー名）
            violet: oldGenotype.vio || 'vv',
            fallow_pale: oldGenotype.fl || '++',
            fallow_bronze: '++',
            pied_dom: '++',
            pied_rec: oldGenotype.pi || '++',
            dilute: oldGenotype.dil || '++',
            edged: '++',
            orangeface: '++',
            pale_headed: '++',

            // Z染色体連鎖グループ（v7新形式）
            Z_linked: Z_linked,

            // 常染色体連鎖グループ（v7新形式）
            autosomal_1: autosomal_1,

            // 相の確定状態
            phase_known: phaseKnown,

            // 後方互換性のため旧キーも維持（読み取り専用）
            _legacy: {
                parblue: oldGenotype.parblue,
                ino: oldGenotype.ino,
                op: oldGenotype.op,
                cin: oldGenotype.cin,
                dark: oldGenotype.dark,
                vio: oldGenotype.vio,
                fl: oldGenotype.fl,
                dil: oldGenotype.dil,
                pi: oldGenotype.pi
            }
        };
    },

    /**
     * 表現型文字列から観察情報を推定（SSOT: COLOR_MASTER使用）
     * COLOR_MASTERが利用可能な場合、ja/en両方の名前でマッチング
     */
    inferObservedFromPhenotype(phenotype, genotype) {
        const observed = { baseColor: 'green', eyeColor: 'black', darkness: 'none' };
        if (!phenotype) return observed;

        const p = phenotype.toLowerCase();

        // SSOT: COLOR_MASTERからマッチング（利用可能な場合）
        if (typeof COLOR_MASTER !== 'undefined') {
            // 長い名前を先にチェック（部分一致対策）
            const sortedKeys = Object.keys(COLOR_MASTER).sort((a, b) => {
                const aLen = Math.max((COLOR_MASTER[a].ja || '').length, (COLOR_MASTER[a].en || '').length);
                const bLen = Math.max((COLOR_MASTER[b].ja || '').length, (COLOR_MASTER[b].en || '').length);
                return bLen - aLen;
            });

            for (const key of sortedKeys) {
                const def = COLOR_MASTER[key];
                const jaName = (def.ja || '').toLowerCase();
                const enName = (def.en || '').toLowerCase();
                if ((jaName && p.includes(jaName)) || (enName && p.includes(enName))) {
                    observed.baseColor = key;
                    observed.eyeColor = def.eye || 'black';
                    // ダーク因子の推定
                    const geno = def.genotype || {};
                    if (geno.dark === 'DD') observed.darkness = 'df';
                    else if (geno.dark === 'Dd') observed.darkness = 'sf';
                    break;
                }
            }
        } else {
            // フォールバック: COLOR_MASTER未定義時
            if (p.includes('lutino')) { observed.baseColor = 'lutino'; observed.eyeColor = 'red'; }
            else if (p.includes('creamino') && p.includes('seagreen')) { observed.baseColor = 'creamino_seagreen'; observed.eyeColor = 'red'; }
            else if (p.includes('creamino')) { observed.baseColor = 'creamino'; observed.eyeColor = 'red'; }
            else if (p.includes('pure') && p.includes('white')) { observed.baseColor = 'pure_white'; observed.eyeColor = 'red'; }
            else if (p.includes('fallow') && p.includes('aqua')) { observed.baseColor = 'fallow_aqua'; observed.eyeColor = 'red'; }
            else if (p.includes('fallow')) { observed.baseColor = 'fallow_green'; observed.eyeColor = 'red'; }
            else if (p.includes('pallid') && p.includes('seagreen')) { observed.baseColor = 'pallid_seagreen'; }
            else if (p.includes('pallid') && p.includes('turquoise')) { observed.baseColor = 'pallid_turquoise'; }
            else if (p.includes('pallid') && p.includes('aqua')) { observed.baseColor = 'pallid_aqua'; }
            else if (p.includes('pallid')) { observed.baseColor = 'pallid_green'; }
            else if (p.includes('cinnamon') && p.includes('seagreen')) { observed.baseColor = 'cinnamon_seagreen'; }
            else if (p.includes('cinnamon') && p.includes('turquoise')) { observed.baseColor = 'cinnamon_turquoise'; }
            else if (p.includes('cinnamon') && p.includes('aqua')) { observed.baseColor = 'cinnamon_aqua'; }
            else if (p.includes('cinnamon')) { observed.baseColor = 'cinnamon_green'; }
            else if (p.includes('opaline') && p.includes('seagreen')) { observed.baseColor = 'opaline_seagreen'; }
            else if (p.includes('opaline') && p.includes('turquoise')) { observed.baseColor = 'opaline_turquoise'; }
            else if (p.includes('opaline') && p.includes('aqua')) { observed.baseColor = 'opaline_aqua'; }
            else if (p.includes('opaline')) { observed.baseColor = 'opaline_green'; }
            else if (p.includes('seagreen') && p.includes('dark')) { observed.baseColor = 'seagreen_dark'; observed.darkness = 'sf'; }
            else if (p.includes('seagreen')) { observed.baseColor = 'seagreen'; }
            else if (p.includes('turquoise') && p.includes('dark')) { observed.baseColor = 'turquoise_dark'; observed.darkness = 'sf'; }
            else if (p.includes('turquoise')) { observed.baseColor = 'turquoise'; }
            else if (p.includes('aqua') && (p.includes('olive') || p.includes('dd'))) { observed.baseColor = 'aqua_dd'; observed.darkness = 'df'; }
            else if (p.includes('aqua') && (p.includes('dark') || p.includes('cobalt'))) { observed.baseColor = 'aqua_dark'; observed.darkness = 'sf'; }
            else if (p.includes('aqua') || p.includes('blue')) { observed.baseColor = 'aqua'; }
            else if (p.includes('olive')) { observed.baseColor = 'olive'; observed.darkness = 'df'; }
            else if (p.includes('dark') && p.includes('green')) { observed.baseColor = 'darkgreen'; observed.darkness = 'sf'; }
            else if (p.includes('green') || p.includes('normal')) { observed.baseColor = 'green'; }
        }

        // ダーク因子の追加判定
        if (p.includes('df') || p.includes('double')) { observed.darkness = 'df'; }
        else if (p.includes('sf') || p.includes('single')) { observed.darkness = 'sf'; }

        return observed;
    },

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error('BirdDB load error:', e);
            return null;
        }
    },

    save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('BirdDB save error:', e);
            return false;
        }
    },

    generateId() {
        const prefix = this._currentMode === 'demo' ? 'demo_' : 'bird_';
        return prefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    generateCode(sex) {
        const data = this.load();
        const prefix = this._currentMode === 'demo' ? 'DEMO' : (data?.settings?.codePrefix || 'GF');
        const year = new Date().getFullYear().toString().slice(-2);
        const sexCode = sex === 'male' ? 'M' : 'F';
        const count = (data?.birds || []).filter(b => b.code?.startsWith(`${prefix}${year}`)).length + 1;
        return `${prefix}${year}${sexCode}${String(count).padStart(3, '0')}`;
    },

    getAllBirds() {
        const data = this.load();
        return data?.birds || [];
    },

    getBird(id) {
        const birds = this.getAllBirds();
        return birds.find(b => b.id === id) || null;
    },

    addBird(bird) {
        const data = this.load();
        if (!data) {
            this.init();
            return this.addBird(bird);
        }

        const now = new Date().toISOString();
        const observed = bird.observed || {
            baseColor: bird.baseColor || 'green',
            eyeColor: bird.eyeColor || 'black',
            darkness: bird.darkness || 'none'
        };

        // v7.0: 正しい座位名を使用
        const defaultGenotype = {
            parblue: '++',
            ino: bird.sex === 'female' ? '+W' : '++',
            opaline: bird.sex === 'female' ? '+W' : '++',
            cinnamon: bird.sex === 'female' ? '+W' : '++',
            dark: 'dd', violet: 'vv', fallow_pale: '++', dilute: '++', pied_rec: '++'
        };

        const pedigree = bird.pedigree || this.buildPedigreeFromParents(
            bird.sire?.id || bird.sire || null,
            bird.dam?.id || bird.dam || null
        );

        const newBird = {
            id: this.generateId(),
            name: bird.name || '',
            code: bird.code || this.generateCode(bird.sex),
            sex: bird.sex || 'unknown',
            birthDate: bird.birthDate || '',
            sire: bird.sire || null,
            dam: bird.dam || null,
            lineage: bird.lineage || '',
            observed: observed,
            genotype: { ...defaultGenotype, ...bird.genotype },
            pedigree: pedigree,
            phase: bird.phase || 'independent',
            phenotype: bird.phenotype || '',
            inbreedingGen: bird.inbreedingGen || 0,
            notes: bird.notes || '',
            createdAt: now,
            updatedAt: now
        };

        if (!newBird.phenotype) {
            newBird.phenotype = this.calculatePhenotype(newBird.genotype, newBird.sex, newBird.observed);
        }

        data.birds.push(newBird);
        this.save(data);
        return newBird;
    },

    updateBird(id, updates) {
        const data = this.load();
        const index = data.birds.findIndex(b => b.id === id);
        if (index === -1) return null;

        if (updates.baseColor || updates.eyeColor || updates.darkness) {
            updates.observed = {
                ...data.birds[index].observed,
                baseColor: updates.baseColor || data.birds[index].observed?.baseColor,
                eyeColor: updates.eyeColor || data.birds[index].observed?.eyeColor,
                darkness: updates.darkness || data.birds[index].observed?.darkness
            };
        }

        if (updates.sire !== undefined || updates.dam !== undefined) {
            const newSire = updates.sire !== undefined ? updates.sire : data.birds[index].sire;
            const newDam = updates.dam !== undefined ? updates.dam : data.birds[index].dam;
            updates.pedigree = this.buildPedigreeFromParents(newSire?.id || newSire, newDam?.id || newDam);
        }

        data.birds[index] = { ...data.birds[index], ...updates, updatedAt: new Date().toISOString() };

        if (updates.genotype || updates.observed) {
            data.birds[index].phenotype = this.calculatePhenotype(
                data.birds[index].genotype, data.birds[index].sex, data.birds[index].observed
            );
        }

        this.save(data);
        return data.birds[index];
    },

    deleteBird(id) {
        const data = this.load();
        const index = data.birds.findIndex(b => b.id === id);
        if (index === -1) return false;
        data.birds.splice(index, 1);
        this.save(data);
        return true;
    },

    searchBirds(criteria) {
        let birds = this.getAllBirds();
        if (criteria.sex) birds = birds.filter(b => b.sex === criteria.sex);
        if (criteria.lineage) birds = birds.filter(b => b.lineage === criteria.lineage);
        if (criteria.phenotype) birds = birds.filter(b => b.phenotype?.toLowerCase().includes(criteria.phenotype.toLowerCase()));
        if (criteria.baseColor) birds = birds.filter(b => b.observed?.baseColor === criteria.baseColor);
        if (criteria.query) {
            const q = criteria.query.toLowerCase();
            birds = birds.filter(b => (b.name || '').toLowerCase().includes(q) || (b.code || '').toLowerCase().includes(q) || (b.phenotype || '').toLowerCase().includes(q));
        }
        return birds;
    },

    calculatePhenotype(geno, sex, observed) {
        // v7.3.11: SSOT - 色キーを構築してkeyToLabelで変換（ハードコード排除）
        if (observed?.baseColor) return this.getColorLabel(observed.baseColor);

        // 色キーを構築（英語キー形式: cinnamon_aqua_dark）
        const keyParts = [];
        let baseKey = 'green';

        // パーブルー系列
        if (geno.parblue === 'aqaq' || geno.parblue === 'bb') baseKey = 'aqua';
        else if (geno.parblue === 'tqtq') baseKey = 'turquoise';
        else if (geno.parblue === 'tqaq' || geno.parblue === 'tqb') baseKey = 'seagreen';

        // INO系（特殊な色名を持つ）
        if (['inoino', 'inoW'].includes(geno.ino)) {
            if (baseKey === 'aqua') { keyParts.push('creamino'); baseKey = ''; }
            else if (baseKey === 'turquoise') { keyParts.push('pure_white'); baseKey = ''; }
            else if (baseKey === 'seagreen') { keyParts.push('creamino_seagreen'); baseKey = ''; }
            else { keyParts.push('lutino'); baseKey = ''; }
        } else if (['pldpld', 'pldino', 'pldW'].includes(geno.ino)) keyParts.push('pallid');

        // 性連鎖形質
        if (['opop', 'opW'].includes(geno.opaline)) keyParts.push('opaline');
        if (['cincin', 'cinW'].includes(geno.cinnamon)) keyParts.push('cinnamon');

        // ダーク因子（全パーブルー系列に対応）
        if (geno.dark === 'DD') {
            if (baseKey === 'green') baseKey = 'olive';
            else if (baseKey === 'aqua') baseKey = 'aqua_dd';
            else if (baseKey === 'turquoise') baseKey = 'turquoise_olive';
            else if (baseKey === 'seagreen') baseKey = 'seagreen_olive';
        } else if (geno.dark === 'Dd') {
            if (baseKey === 'green') baseKey = 'darkgreen';
            else if (baseKey === 'aqua') baseKey = 'aqua_dark';
            else if (baseKey === 'turquoise') baseKey = 'turquoise_dark';
            else if (baseKey === 'seagreen') baseKey = 'seagreen_dark';
        }

        // その他の形質
        if (['flpflp', 'flfl'].includes(geno.fallow_pale)) keyParts.push('fallow');
        if (geno.pied_rec === 'pipi') keyParts.push('pied');
        if (geno.violet === 'Vv' || geno.violet === 'VV') keyParts.push('violet');
        if (geno.dilute === 'dildil') keyParts.push('dilute');
        if (geno.edged === 'eded') keyParts.push('edged');

        // キーを構築してkeyToLabelで変換
        const colorKey = baseKey ? [...keyParts, baseKey].join('_') : keyParts.join('_');
        return this.getColorLabel(colorKey);
    },

    getColorLabel(colorKey, lang = 'ja') {
        // v7.3: keyToLabel関数でローカライズ（動的変換対応）
        if (typeof keyToLabel === 'function') {
            return keyToLabel(colorKey);
        }
        // フォールバック
        return colorKey || '?';
    },

    getAncestors(id, generations = 3) {
        const bird = this.getBird(id);
        if (!bird) return null;

        const buildTree = (b, gen) => {
            if (!b || gen <= 0) return null;
            const sire = b.pedigree?.sire ? this.getBird(b.pedigree.sire) : null;
            const dam = b.pedigree?.dam ? this.getBird(b.pedigree.dam) : null;
            return {
                bird: { id: b.id, name: b.name, code: b.code, sex: b.sex, phenotype: b.phenotype, observed: b.observed },
                sire: sire ? buildTree(sire, gen - 1) : (b.pedigree?.sire ? { id: b.pedigree.sire } : null),
                dam: dam ? buildTree(dam, gen - 1) : (b.pedigree?.dam ? { id: b.pedigree.dam } : null)
            };
        };

        return buildTree(bird, generations);
    },

    getOffspring(id) {
        const birds = this.getAllBirds();
        return birds.filter(b => b.pedigree?.sire === id || b.pedigree?.dam === id);
    },

    // ========================================
    // 循環参照検出（v7.0追加）
    // ========================================

    /**
     * 指定した鳥のすべての祖先IDを取得（再帰的に6世代まで）
     * @param {string} birdId - 対象の鳥ID
     * @param {Set} visited - 訪問済みID（無限ループ防止）
     * @returns {Set} 祖先IDのセット
     */
    getAllAncestorIds(birdId, visited = new Set()) {
        if (!birdId || visited.has(birdId)) return visited;
        visited.add(birdId);

        const bird = this.getBird(birdId);
        if (!bird || !bird.pedigree) return visited;

        // 直接の親
        if (bird.pedigree.sire) this.getAllAncestorIds(bird.pedigree.sire, visited);
        if (bird.pedigree.dam) this.getAllAncestorIds(bird.pedigree.dam, visited);

        // pedigreeに記録された祖先
        const ancestorFields = ['sire_sire', 'sire_dam', 'dam_sire', 'dam_dam',
            'sire_sire_sire', 'sire_sire_dam', 'sire_dam_sire', 'sire_dam_dam',
            'dam_sire_sire', 'dam_sire_dam', 'dam_dam_sire', 'dam_dam_dam'];
        for (const field of ancestorFields) {
            if (bird.pedigree[field]) visited.add(bird.pedigree[field]);
        }

        return visited;
    },

    /**
     * 指定した鳥のすべての子孫IDを取得（再帰的に6世代まで）
     * @param {string} birdId - 対象の鳥ID
     * @param {Set} visited - 訪問済みID（無限ループ防止）
     * @param {number} depth - 現在の深さ
     * @returns {Set} 子孫IDのセット
     */
    getAllDescendantIds(birdId, visited = new Set(), depth = 0) {
        if (!birdId || visited.has(birdId) || depth > 6) return visited;
        visited.add(birdId);

        const offspring = this.getOffspring(birdId);
        for (const child of offspring) {
            this.getAllDescendantIds(child.id, visited, depth + 1);
        }

        return visited;
    },

    // 循環参照エラーメッセージ（6言語対応: ja, en, de, fr, es, it）
    _loopMessages: {
        parentLabel: {
            sire: { ja: '父親', en: 'Sire', de: 'Vater', fr: 'Père', es: 'Padre', it: 'Padre' },
            dam: { ja: '母親', en: 'Dam', de: 'Mutter', fr: 'Mère', es: 'Madre', it: 'Madre' }
        },
        selfAsParent: {
            ja: '自分自身を親に設定することはできません',
            en: 'Cannot set self as parent',
            de: 'Kann sich selbst nicht als Elternteil festlegen',
            fr: 'Impossible de se définir comme parent',
            es: 'No se puede establecer a sí mismo como padre',
            it: 'Non è possibile impostare se stesso come genitore'
        },
        selfAsParentDetail: {
            ja: '{parent}に自分自身が選択されています',
            en: 'Self selected as {parent}',
            de: 'Selbst als {parent} ausgewählt',
            fr: 'Soi-même sélectionné comme {parent}',
            es: 'Seleccionado a sí mismo como {parent}',
            it: 'Selezionato se stesso come {parent}'
        },
        descendantAsParent: {
            ja: 'この個体は既にあなたの子孫として登録されています',
            en: 'This bird is already registered as your descendant',
            de: 'Dieser Vogel ist bereits als Ihr Nachkomme registriert',
            fr: 'Cet oiseau est déjà enregistré comme votre descendant',
            es: 'Esta ave ya está registrada como su descendiente',
            it: 'Questo uccello è già registrato come tuo discendente'
        },
        descendantAsParentDetail: {
            ja: '{name}はこの鳥の子孫です。親に設定すると循環参照が発生します。',
            en: '{name} is a descendant of this bird. Setting as parent creates a loop.',
            de: '{name} ist ein Nachkomme dieses Vogels. Als Elternteil entsteht eine Schleife.',
            fr: '{name} est un descendant de cet oiseau. Le définir comme parent crée une boucle.',
            es: '{name} es un descendiente de esta ave. Establecerlo como padre crea un bucle.',
            it: '{name} è un discendente di questo uccello. Impostarlo come genitore crea un ciclo.'
        },
        ancestorLoop: {
            ja: 'この個体の血統情報にあなたが祖先として記録されています',
            en: 'You are recorded as an ancestor in this bird\'s pedigree',
            de: 'Sie sind im Stammbaum dieses Vogels als Vorfahre verzeichnet',
            fr: 'Vous êtes enregistré comme ancêtre dans le pedigree de cet oiseau',
            es: 'Usted está registrado como ancestro en el pedigrí de esta ave',
            it: 'Sei registrato come antenato nel pedigree di questo uccello'
        },
        ancestorLoopDetail: {
            ja: '{name}の血統書にこの鳥が祖先として登録されています。',
            en: 'This bird is listed as an ancestor in {name}\'s pedigree.',
            de: 'Dieser Vogel ist im Stammbaum von {name} als Vorfahre aufgeführt.',
            fr: 'Cet oiseau est listé comme ancêtre dans le pedigree de {name}.',
            es: 'Esta ave está listada como ancestro en el pedigrí de {name}.',
            it: 'Questo uccello è elencato come antenato nel pedigree di {name}.'
        }
    },

    _getLoopMsg(key, lang) {
        const msgs = this._loopMessages[key];
        return msgs ? (msgs[lang] || msgs['en']) : key;
    },

    /**
     * 親設定時の循環参照をチェック
     * @param {string|null} currentBirdId - 編集中の鳥ID（新規の場合はnull）
     * @param {string} parentId - 設定しようとしている親のID
     * @param {string} parentType - 'sire' または 'dam'
     * @returns {object|null} エラーがあれば {error: string, details: string}、なければnull
     */
    checkPedigreeLoop(currentBirdId, parentId, parentType) {
        if (!parentId) return null;

        const lang = (typeof LANG !== 'undefined') ? LANG : 'en';
        const parentLabel = this._loopMessages.parentLabel[parentType]?.[lang] || parentType;

        // 1. 自分自身を親に設定しようとしている
        if (currentBirdId && currentBirdId === parentId) {
            return {
                error: this._getLoopMsg('selfAsParent', lang),
                details: this._getLoopMsg('selfAsParentDetail', lang).replace('{parent}', parentLabel)
            };
        }

        // 2. 自分の子孫を親に設定しようとしている（編集時のみ）
        if (currentBirdId) {
            const descendants = this.getAllDescendantIds(currentBirdId, new Set());
            descendants.delete(currentBirdId);

            if (descendants.has(parentId)) {
                const parent = this.getBird(parentId);
                const name = parent?.name || parentId;
                return {
                    error: this._getLoopMsg('descendantAsParent', lang),
                    details: this._getLoopMsg('descendantAsParentDetail', lang).replace('{name}', name)
                };
            }
        }

        // 3. 選択した親の祖先に自分がいる
        if (currentBirdId) {
            const parentAncestors = this.getAllAncestorIds(parentId, new Set());
            if (parentAncestors.has(currentBirdId)) {
                const parent = this.getBird(parentId);
                const name = parent?.name || parentId;
                return {
                    error: this._getLoopMsg('ancestorLoop', lang),
                    details: this._getLoopMsg('ancestorLoopDetail', lang).replace('{name}', name)
                };
            }
        }

        return null;
    },

    /**
     * 鳥の保存前に循環参照をチェック（addBird/updateBird用）
     * @param {string|null} currentBirdId - 編集中の鳥ID
     * @param {string|null} sireId - 父親ID
     * @param {string|null} damId - 母親ID
     * @returns {object|null} エラーがあれば {error: string, details: string}、なければnull
     */
    validatePedigree(currentBirdId, sireId, damId) {
        const sireCheck = this.checkPedigreeLoop(currentBirdId, sireId, 'sire');
        if (sireCheck) return sireCheck;

        const damCheck = this.checkPedigreeLoop(currentBirdId, damId, 'dam');
        if (damCheck) return damCheck;

        return null;
    },

    calculateInbreedingCoefficient(sireId, damId, generations = 3) {
        if (!sireId || !damId) return { coefficient: 0, warningLevel: { level: 'safe' } };

        const sire = this.getBird(sireId);
        const dam = this.getBird(damId);
        if (!sire || !dam) return { coefficient: 0, warningLevel: { level: 'safe' } };

        if (typeof BreedingValidator !== 'undefined') {
            const ic = BreedingValidator.calcInbreedingCoefficient(sire, dam);
            const evaluation = BreedingValidator.evaluateInbreeding(ic);
            return {
                coefficient: ic,
                warningLevel: { 
                    level: evaluation.level === 'danger' ? 'critical' : evaluation.level === 'warning' ? 'high' : 'safe',
                    message: evaluation.message
                }
            };
        }

        const getAncestorIds = (bird, gen, result = new Map()) => {
            if (!bird || !bird.pedigree || gen <= 0) return result;
            const ancestorFields = ['sire', 'dam', 'sire_sire', 'sire_dam', 'dam_sire', 'dam_dam',
                'sire_sire_sire', 'sire_sire_dam', 'sire_dam_sire', 'sire_dam_dam',
                'dam_sire_sire', 'dam_sire_dam', 'dam_dam_sire', 'dam_dam_dam'];
            
            ancestorFields.forEach((field, idx) => {
                const ancestorId = bird.pedigree[field];
                if (ancestorId) {
                    const generation = idx < 2 ? 1 : (idx < 6 ? 2 : 3);
                    if (generation <= gen) {
                        if (!result.has(ancestorId) || result.get(ancestorId) > generation) {
                            result.set(ancestorId, generation);
                        }
                    }
                }
            });
            return result;
        };

        const sireAncestors = getAncestorIds(sire, generations);
        const damAncestors = getAncestorIds(dam, generations);

        let ic = 0;
        sireAncestors.forEach((sireGen, ancestorId) => {
            if (damAncestors.has(ancestorId)) {
                const damGen = damAncestors.get(ancestorId);
                ic += Math.pow(0.5, sireGen + damGen + 1);
            }
        });

        let warningLevel;
        if (ic >= 0.25) warningLevel = { level: 'danger', message: '危険: 近交係数25%以上' };
        else if (ic >= 0.125) warningLevel = { level: 'warning', message: '警告: 近交係数12.5%以上' };
        else warningLevel = { level: 'safe', message: null };

        return { coefficient: ic, warningLevel };
    },

    saveBreedingResult(result) {
        const data = this.load();
        const record = {
            id: 'result_' + Date.now(),
            date: new Date().toISOString(),
            sire: result.sire || null,
            dam: result.dam || null,
            offspring: result.offspring || [],
            notes: result.notes || '',
            savedAt: new Date().toISOString()
        };
        data.breedingResults = data.breedingResults || [];
        data.breedingResults.push(record);
        this.save(data);
        return record;
    },

    getBreedingResults() {
        const data = this.load();
        return data?.breedingResults || [];
    },

    exportJSON() {
        const data = this.load();
        return JSON.stringify(data, null, 2);
    },

    importJSON(jsonString, mode = 'merge') {
        try {
            const imported = JSON.parse(jsonString);
            if (!imported.birds || !Array.isArray(imported.birds)) {
                return { success: false, error: '無効なデータ形式です' };
            }
            const currentData = this.load() || { birds: [], breedingResults: [], version: this.VERSION };
            imported.birds = imported.birds.map(bird => this.migrateBird(bird));

            if (mode === 'replace') {
                imported.version = this.VERSION;
                this.save(imported);
                return { success: true, count: imported.birds.length, mode: 'replace' };
            } else {
                const existingIds = new Set(currentData.birds.map(b => b.id));
                const newBirds = imported.birds.filter(b => !existingIds.has(b.id));
                currentData.birds = [...currentData.birds, ...newBirds];
                if (imported.breedingResults) {
                    const existingResultIds = new Set((currentData.breedingResults || []).map(r => r.id));
                    const newResults = imported.breedingResults.filter(r => !existingResultIds.has(r.id));
                    currentData.breedingResults = [...(currentData.breedingResults || []), ...newResults];
                }
                this.save(currentData);
                return { success: true, count: newBirds.length, mode: 'merge' };
            }
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.init();
    },

    resetDemoData() {
        if (this._currentMode === 'demo') {
            localStorage.removeItem(this.STORAGE_KEY_DEMO);
            this.initDemoData();
            if (typeof refreshBirdList === 'function') refreshBirdList();
            if (typeof refreshDBSelectors === 'function') refreshDBSelectors();
            if (typeof refreshHealthSelectors === 'function') refreshHealthSelectors();
        }
    },

    getStats() {
        const birds = this.getAllBirds();
        const results = this.getBreedingResults();
        const males = birds.filter(b => b.sex === 'male').length;
        const females = birds.filter(b => b.sex === 'female').length;
        const lineages = [...new Set(birds.map(b => b.lineage).filter(l => l))];
        const phenotypes = {};
        birds.forEach(b => { const p = b.phenotype || 'Unknown'; phenotypes[p] = (phenotypes[p] || 0) + 1; });
        const colors = {};
        birds.forEach(b => { const c = b.observed?.baseColor || 'unknown'; colors[c] = (colors[c] || 0) + 1; });
        return { totalBirds: birds.length, males, females, lineages, phenotypes, colors, breedingResults: results.length, mode: this._currentMode };
    }
};

BirdDB.init();
