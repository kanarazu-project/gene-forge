/**
 * Agapornis Gene-Forge v7.0.0
 * 個体データベース管理（localStorage）
 *
 * v7.0.0 変更点:
 * - SSOT化: genetics.php COLOR_DEFINITIONS を参照
 * - デモデータ再設計: Constellation一族（24羽）
 *   - 8始祖（Sirius, Vega, Altair, Deneb, Rigel, Capella, Pollux, Spica）
 *   - 4祖父母（Nova, Luna, Atlas, Lyra）
 *   - 2父母（Orion, Aurora）
 *   - 10子（Phoenix, Celeste, Cosmo, Stella, Leo, Diana, Marcus, Helena, Castor, Selene）
 * - F3世代で最大限の羽色多様性を実現
 *
 * v6.7.5 変更点:
 * - デモデータに血統情報（pedigree）をプリセット
 * - FamilyMap デモモード連携
 *
 * v6.7.4 変更点:
 * - pedigree フィールド追加（14枠の祖先ID）
 * - BreedingValidator連携用メソッド追加
 * - 近交係数計算の改善（Wright's F）
 */

const BirdDB = {
    STORAGE_KEY_USER: 'geneforge_birds_user',
    STORAGE_KEY_DEMO: 'geneforge_birds_demo',
    MODE_KEY: 'geneforge_mode',
    VERSION: '7.0.0',
    
    _currentMode: 'user',
    _initialized: false,

    // ========================================
    // デモ始祖8羽定義（v7.0: 一族の祖）
    // F3世代で最大限の羽色多様性を実現する遺伝子構成
    // ========================================
    DEMO_FOUNDERS: [
        // =======================================
        // Pair A: Green系 × Aqua系 (aqua/ino/opaline キャリア)
        // =======================================
        {
            id: 'founder_1',
            name: 'Sirius',
            sex: 'male',
            color: 'green',
            genotype: {
                parblue: '+aq',      // split aqua
                ino: '+ino',         // split ino
                opaline: '+op',      // split opaline
                cinnamon: '++',
                dark: 'dd',
                violet: 'vv',
                fallow_pale: '++',
                pied_rec: '++'
            },
            notes: '始祖♂ - Green /aqua /ino /opaline（多重スプリット）'
        },
        {
            id: 'founder_2',
            name: 'Vega',
            sex: 'female',
            color: 'aqua',
            genotype: {
                parblue: 'aqaq',
                ino: '+W',
                opaline: '+W',
                cinnamon: '+W',
                dark: 'dd',
                violet: 'vv',
                fallow_pale: '++',
                pied_rec: '++'
            },
            notes: '始祖♀ - Aqua（アクア系基盤）'
        },
        // =======================================
        // Pair B: Dark × Turquoise/Cinnamon キャリア
        // =======================================
        {
            id: 'founder_3',
            name: 'Altair',
            sex: 'male',
            color: 'darkgreen',
            genotype: {
                parblue: '+tq',      // split turquoise
                ino: '++',
                opaline: '++',
                cinnamon: '+cin',    // split cinnamon
                dark: 'Dd',          // dark factor
                violet: 'vv',
                fallow_pale: '++',
                pied_rec: '++'
            },
            notes: '始祖♂ - Dark Green /turquoise /cinnamon（ダーク+スプリット）'
        },
        {
            id: 'founder_4',
            name: 'Deneb',
            sex: 'female',
            color: 'cinnamon_turquoise',
            genotype: {
                parblue: 'tqtq',
                ino: '+W',
                opaline: '+W',
                cinnamon: 'cinW',    // visual cinnamon
                dark: 'dd',
                violet: 'vv',
                fallow_pale: '++',
                pied_rec: '++'
            },
            notes: '始祖♀ - Cinnamon Turquoise（シナモン発現）'
        },
        // =======================================
        // Pair C: Seagreen × Lutino (pallid キャリア)
        // =======================================
        {
            id: 'founder_5',
            name: 'Rigel',
            sex: 'male',
            color: 'seagreen',
            genotype: {
                parblue: 'tqaq',     // seagreen
                ino: '+pld',         // split pallid
                opaline: '++',
                cinnamon: '++',
                dark: 'dd',
                violet: 'vv',
                fallow_pale: '++',
                pied_rec: '++'
            },
            notes: '始祖♂ - Seagreen /pallid（シーグリーン+パリッドキャリア）'
        },
        {
            id: 'founder_6',
            name: 'Capella',
            sex: 'female',
            color: 'lutino',
            genotype: {
                parblue: '++',
                ino: 'inoW',         // visual lutino
                opaline: '+W',
                cinnamon: '+W',
                dark: 'dd',
                violet: 'vv',
                fallow_pale: '++',
                pied_rec: '++'
            },
            notes: '始祖♀ - Lutino（INO系赤目）'
        },
        // =======================================
        // Pair D: Olive × Opaline Aqua (violet キャリア)
        // =======================================
        {
            id: 'founder_7',
            name: 'Pollux',
            sex: 'male',
            color: 'olive',
            genotype: {
                parblue: '++',
                ino: '++',
                opaline: '++',
                cinnamon: '++',
                dark: 'DD',          // double dark (olive)
                violet: 'Vv',        // split violet
                fallow_pale: '++',
                pied_rec: '++'
            },
            notes: '始祖♂ - Olive /violet（オリーブ+バイオレットキャリア）'
        },
        {
            id: 'founder_8',
            name: 'Spica',
            sex: 'female',
            color: 'opaline_aqua',
            genotype: {
                parblue: 'aqaq',
                ino: '+W',
                opaline: 'opW',      // visual opaline
                cinnamon: '+W',
                dark: 'dd',
                violet: 'vv',
                fallow_pale: '++',
                pied_rec: '++'
            },
            notes: '始祖♀ - Opaline Aqua（オパーリン発現）'
        }
    ],

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
        } else if (data.version !== this.VERSION) {
            data.version = this.VERSION;
            if (data.birds) {
                data.birds = data.birds.map(bird => this.migrateBird(bird));
            }
            this.save(data);
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
        const demoBirds = this.generateDemoBirds();
        const data = {
            version: this.VERSION,
            birds: demoBirds,
            breedingResults: [],
            settings: {
                defaultLineage: '',
                codePrefix: 'DEMO'
            }
        };
        
        try {
            localStorage.setItem(this.STORAGE_KEY_DEMO, JSON.stringify(data));
            console.log('[BirdDB] Demo data initialized:', demoBirds.length, 'birds');
        } catch (e) {
            console.error('Failed to init demo data:', e);
        }
    },

    /**
     * v7.0: デモ用始祖一族を生成（24羽 = 8始祖 + 4祖父母 + 2父母 + 10子）
     * 3世代後に最大限の羽色多様性を実現する家系図
     */
    generateDemoBirds() {
        const birds = [];
        const now = new Date().toISOString();
        const lineage = 'Constellation'; // 一族名: 星座

        // ========================================
        // GEN 0: 曽祖父母（8羽始祖）
        // ========================================
        this.DEMO_FOUNDERS.forEach((founder, idx) => {
            const eyeColor = ['lutino', 'creamino', 'pure_white', 'fallow_pale_green', 'fallow_pale_aqua'].some(c => founder.color.includes(c) || founder.color === 'lutino') ? 'red' : 'black';
            const darkness = founder.genotype.dark === 'DD' ? 'df' : (founder.genotype.dark === 'Dd' ? 'sf' : 'none');

            birds.push({
                id: founder.id,
                name: founder.name,
                code: `STAR${String(idx + 1).padStart(3, '0')}`,
                sex: founder.sex,
                birthDate: '2020-01-01',
                sire: null,
                dam: null,
                lineage: lineage,
                observed: {
                    baseColor: founder.color,
                    eyeColor: founder.color === 'lutino' ? 'red' : (founder.color.includes('fallow') ? 'red' : 'black'),
                    darkness: darkness
                },
                genotype: founder.genotype,
                pedigree: this.createEmptyPedigree(),
                phase: 'retired',
                phenotype: founder.color,
                inbreedingGen: 0,
                notes: founder.notes,
                createdAt: now,
                updatedAt: now
            });
        });

        // ========================================
        // GEN 1: 祖父母（4羽）
        // ========================================
        const grandparents = [
            // Nova ♂: Sirius × Vega → Aqua /ino /op
            {
                id: 'gen1_nova', name: 'Nova', sex: 'male', color: 'aqua',
                sire: 'founder_1', dam: 'founder_2',
                genotype: { parblue: 'aqaq', ino: '+ino', opaline: '+op', cinnamon: '++', dark: 'dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
                notes: 'GEN1♂ - Aqua /ino /opaline (Sirius×Vega)'
            },
            // Luna ♀: Altair × Deneb → Cinnamon Seagreen (tq from Deneb + tq from Altair = tqtq? No, Altair is +tq)
            // Altair +tq × Deneb tqtq → offspring: tqtq or +tq. Let's say Luna got +tq from Altair and tq from Deneb → seagreen-ish
            // Actually: +tq × tqtq → 50% tqtq, 50% +tq. Let's make Luna tqtq (turquoise) with cinnamon
            {
                id: 'gen1_luna', name: 'Luna', sex: 'female', color: 'cinnamon_turquoise',
                sire: 'founder_3', dam: 'founder_4',
                genotype: { parblue: 'tqtq', ino: '+W', opaline: '+W', cinnamon: 'cinW', dark: 'Dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
                notes: 'GEN1♀ - Cinnamon Turquoise Dark (Altair×Deneb)'
            },
            // Atlas ♂: Rigel × Capella → Green /tq /ino (Rigel tqaq gives tq or aq, Capella ++ gives +)
            {
                id: 'gen1_atlas', name: 'Atlas', sex: 'male', color: 'green',
                sire: 'founder_5', dam: 'founder_6',
                genotype: { parblue: '+tq', ino: '+ino', opaline: '++', cinnamon: '++', dark: 'dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
                notes: 'GEN1♂ - Green /turquoise /ino (Rigel×Capella)'
            },
            // Lyra ♀: Pollux × Spica → Opaline Dark Green /aq /violet
            {
                id: 'gen1_lyra', name: 'Lyra', sex: 'female', color: 'opaline_darkgreen',
                sire: 'founder_7', dam: 'founder_8',
                genotype: { parblue: '+aq', ino: '+W', opaline: 'opW', cinnamon: '+W', dark: 'Dd', violet: 'Vv', fallow_pale: '++', pied_rec: '++' },
                notes: 'GEN1♀ - Opaline Dark Green /aqua /violet (Pollux×Spica)'
            }
        ];

        grandparents.forEach((gp, idx) => {
            birds.push({
                id: gp.id,
                name: gp.name,
                code: `STAR${String(9 + idx).padStart(3, '0')}`,
                sex: gp.sex,
                birthDate: '2022-01-01',
                sire: gp.sire,
                dam: gp.dam,
                lineage: lineage,
                observed: {
                    baseColor: gp.color,
                    eyeColor: 'black',
                    darkness: gp.genotype.dark === 'Dd' ? 'sf' : 'none'
                },
                genotype: gp.genotype,
                pedigree: {
                    sire: gp.sire, dam: gp.dam,
                    sire_sire: null, sire_dam: null, dam_sire: null, dam_dam: null,
                    sire_sire_sire: null, sire_sire_dam: null, sire_dam_sire: null, sire_dam_dam: null,
                    dam_sire_sire: null, dam_sire_dam: null, dam_dam_sire: null, dam_dam_dam: null
                },
                phase: 'breeding',
                phenotype: gp.color,
                inbreedingGen: 0,
                notes: gp.notes,
                createdAt: now,
                updatedAt: now
            });
        });

        // ========================================
        // GEN 2: 父母（2羽）
        // ========================================
        const parents = [
            // Orion ♂: Nova × Luna → Seagreen /ino /op /cin
            {
                id: 'gen2_orion', name: 'Orion', sex: 'male', color: 'seagreen',
                sire: 'gen1_nova', dam: 'gen1_luna',
                genotype: { parblue: 'tqaq', ino: '+ino', opaline: '+op', cinnamon: '+cin', dark: 'Dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
                notes: 'GEN2♂ - Seagreen Dark /ino /opaline /cinnamon (Nova×Luna)'
            },
            // Aurora ♀: Atlas × Lyra → Opaline Seagreen /ino /violet
            {
                id: 'gen2_aurora', name: 'Aurora', sex: 'female', color: 'opaline_seagreen',
                sire: 'gen1_atlas', dam: 'gen1_lyra',
                genotype: { parblue: 'tqaq', ino: '+W', opaline: 'opW', cinnamon: '+W', dark: 'Dd', violet: 'Vv', fallow_pale: '++', pied_rec: '++' },
                notes: 'GEN2♀ - Opaline Seagreen /violet (Atlas×Lyra)'
            }
        ];

        parents.forEach((p, idx) => {
            birds.push({
                id: p.id,
                name: p.name,
                code: `STAR${String(13 + idx).padStart(3, '0')}`,
                sex: p.sex,
                birthDate: '2024-01-01',
                sire: p.sire,
                dam: p.dam,
                lineage: lineage,
                observed: {
                    baseColor: p.color,
                    eyeColor: 'black',
                    darkness: p.genotype.dark === 'Dd' ? 'sf' : 'none'
                },
                genotype: p.genotype,
                pedigree: {
                    sire: p.sire, dam: p.dam,
                    sire_sire: p.sire === 'gen1_nova' ? 'founder_1' : 'founder_5',
                    sire_dam: p.sire === 'gen1_nova' ? 'founder_2' : 'founder_6',
                    dam_sire: p.dam === 'gen1_luna' ? 'founder_3' : 'founder_7',
                    dam_dam: p.dam === 'gen1_luna' ? 'founder_4' : 'founder_8',
                    sire_sire_sire: null, sire_sire_dam: null, sire_dam_sire: null, sire_dam_dam: null,
                    dam_sire_sire: null, dam_sire_dam: null, dam_dam_sire: null, dam_dam_dam: null
                },
                phase: 'breeding',
                phenotype: p.color,
                inbreedingGen: 0,
                notes: p.notes,
                createdAt: now,
                updatedAt: now
            });
        });

        // ========================================
        // GEN 3: 子（10羽）- Orion × Aurora
        // 多様な羽色を表現
        // ========================================
        const children = [
            // 多様な表現型を持つ10羽
            { id: 'gen3_01', name: 'Phoenix', sex: 'male', color: 'opaline_seagreen',
              genotype: { parblue: 'tqaq', ino: '+ino', opaline: '+op', cinnamon: '+cin', dark: 'dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♂ - Opaline Seagreen /ino /cin' },
            { id: 'gen3_02', name: 'Celeste', sex: 'female', color: 'creamino_seagreen',
              genotype: { parblue: 'tqaq', ino: 'inoW', opaline: '+W', cinnamon: '+W', dark: 'dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♀ - Creamino Seagreen (INO発現!)' },
            { id: 'gen3_03', name: 'Cosmo', sex: 'male', color: 'aqua_dark',
              genotype: { parblue: 'aqaq', ino: '++', opaline: '+op', cinnamon: '++', dark: 'Dd', violet: 'Vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♂ - Aqua Dark /opaline /violet' },
            { id: 'gen3_04', name: 'Stella', sex: 'female', color: 'opaline_turquoise',
              genotype: { parblue: 'tqtq', ino: '+W', opaline: 'opW', cinnamon: '+W', dark: 'dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♀ - Opaline Turquoise' },
            { id: 'gen3_05', name: 'Leo', sex: 'male', color: 'seagreen_dark',
              genotype: { parblue: 'tqaq', ino: '++', opaline: '++', cinnamon: '+cin', dark: 'DD', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♂ - Seagreen Olive /cinnamon' },
            { id: 'gen3_06', name: 'Diana', sex: 'female', color: 'cinnamon_aqua',
              genotype: { parblue: 'aqaq', ino: '+W', opaline: '+W', cinnamon: 'cinW', dark: 'dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♀ - Cinnamon Aqua (シナモン発現!)' },
            { id: 'gen3_07', name: 'Marcus', sex: 'male', color: 'violet_seagreen',
              genotype: { parblue: 'tqaq', ino: '+ino', opaline: '++', cinnamon: '++', dark: 'Dd', violet: 'Vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♂ - Violet Seagreen Dark /ino' },
            { id: 'gen3_08', name: 'Helena', sex: 'female', color: 'lutino',
              genotype: { parblue: '++', ino: 'inoW', opaline: 'opW', cinnamon: '+W', dark: 'dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♀ - Lutino (Opaline) - INO発現で黄色!' },
            { id: 'gen3_09', name: 'Castor', sex: 'male', color: 'turquoise',
              genotype: { parblue: 'tqtq', ino: '++', opaline: '+op', cinnamon: '+cin', dark: 'dd', violet: 'vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♂ - Turquoise /opaline /cinnamon' },
            { id: 'gen3_10', name: 'Selene', sex: 'female', color: 'opaline_aqua_dark',
              genotype: { parblue: 'aqaq', ino: '+W', opaline: 'opW', cinnamon: 'cinW', dark: 'Dd', violet: 'Vv', fallow_pale: '++', pied_rec: '++' },
              notes: 'GEN3♀ - Opaline Cinnamon Aqua Dark /violet' }
        ];

        children.forEach((c, idx) => {
            const eyeColor = c.genotype.ino.includes('ino') && c.genotype.ino !== '+ino' && c.genotype.ino !== '++' ? 'red' : 'black';
            birds.push({
                id: c.id,
                name: c.name,
                code: `STAR${String(15 + idx).padStart(3, '0')}`,
                sex: c.sex,
                birthDate: '2025-06-01',
                sire: 'gen2_orion',
                dam: 'gen2_aurora',
                lineage: lineage,
                observed: {
                    baseColor: c.color,
                    eyeColor: eyeColor,
                    darkness: c.genotype.dark === 'DD' ? 'df' : (c.genotype.dark === 'Dd' ? 'sf' : 'none')
                },
                genotype: c.genotype,
                pedigree: {
                    sire: 'gen2_orion', dam: 'gen2_aurora',
                    sire_sire: 'gen1_nova', sire_dam: 'gen1_luna',
                    dam_sire: 'gen1_atlas', dam_dam: 'gen1_lyra',
                    sire_sire_sire: 'founder_1', sire_sire_dam: 'founder_2',
                    sire_dam_sire: 'founder_3', sire_dam_dam: 'founder_4',
                    dam_sire_sire: 'founder_5', dam_sire_dam: 'founder_6',
                    dam_dam_sire: 'founder_7', dam_dam_dam: 'founder_8'
                },
                phase: 'juvenile',
                phenotype: c.color,
                inbreedingGen: 0,
                notes: c.notes,
                createdAt: now,
                updatedAt: now
            });
        });

        return birds;
    },

    /**
     * v7.0: デモ家系図をFamilyMap形式で取得
     * Constellation一族の家系図データを返す
     */
    getDemoPedigreeForFamilyMap() {
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

        // v7.0: 新しいConstellation一族の構造
        // GEN0: 8始祖, GEN1: 4祖父母, GEN2: 2父母, GEN3: 10子
        return {
            name: 'Demo Pedigree (Constellation Family)',
            savedAt: new Date().toISOString(),
            // 曽祖父母（8始祖）
            sire_sire_sire: toBirdData('founder_1'),  // Sirius
            sire_sire_dam: toBirdData('founder_2'),   // Vega
            sire_dam_sire: toBirdData('founder_3'),   // Altair
            sire_dam_dam: toBirdData('founder_4'),    // Deneb
            dam_sire_sire: toBirdData('founder_5'),   // Rigel
            dam_sire_dam: toBirdData('founder_6'),    // Capella
            dam_dam_sire: toBirdData('founder_7'),    // Pollux
            dam_dam_dam: toBirdData('founder_8'),     // Spica
            // 祖父母（4羽）
            sire_sire: toBirdData('gen1_nova'),
            sire_dam: toBirdData('gen1_luna'),
            dam_sire: toBirdData('gen1_atlas'),
            dam_dam: toBirdData('gen1_lyra'),
            // 父母（2羽）
            sire: toBirdData('gen2_orion'),
            dam: toBirdData('gen2_aurora'),
            // 子（10羽）
            offspring: [
                'gen3_01', 'gen3_02', 'gen3_03', 'gen3_04', 'gen3_05',
                'gen3_06', 'gen3_07', 'gen3_08', 'gen3_09', 'gen3_10'
            ].map(id => toBirdData(id)).filter(b => b !== null),
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
        
        return bird;
    },

    inferObservedFromPhenotype(phenotype, genotype) {
        const observed = { baseColor: 'green', eyeColor: 'black', darkness: 'none' };
        if (!phenotype) return observed;

        const p = phenotype.toLowerCase();

        if (p.includes('ルチノー') || p.includes('lutino')) { observed.baseColor = 'lutino'; observed.eyeColor = 'red'; }
        else if (p.includes('クリーミノシーグリーン')) { observed.baseColor = 'creamino_seagreen'; observed.eyeColor = 'red'; }
        else if (p.includes('クリーミノ') || p.includes('creamino')) { observed.baseColor = 'creamino'; observed.eyeColor = 'red'; }
        else if (p.includes('ピュアホワイト') || p.includes('pure white') || p.includes('アルビノ')) { observed.baseColor = 'pure_white'; observed.eyeColor = 'red'; }
        else if ((p.includes('フォロー') || p.includes('fallow')) && p.includes('アクア')) { observed.baseColor = 'fallow_pale_aqua'; observed.eyeColor = 'red'; }
        else if (p.includes('フォロー') || p.includes('fallow')) { observed.baseColor = 'fallow_pale_green'; observed.eyeColor = 'red'; }
        else if (p.includes('パリッド') && p.includes('シーグリーン')) { observed.baseColor = 'pallid_seagreen'; }
        else if (p.includes('パリッド') && p.includes('ターコイズ')) { observed.baseColor = 'pallid_turquoise'; }
        else if (p.includes('パリッド') && p.includes('アクア')) { observed.baseColor = 'pallid_aqua'; }
        else if (p.includes('パリッド')) { observed.baseColor = 'pallid_green'; }
        else if (p.includes('シナモン') && p.includes('シーグリーン')) { observed.baseColor = 'cinnamon_seagreen'; }
        else if (p.includes('シナモン') && p.includes('ターコイズ')) { observed.baseColor = 'cinnamon_turquoise'; }
        else if (p.includes('シナモン') && p.includes('アクア')) { observed.baseColor = 'cinnamon_aqua'; }
        else if (p.includes('シナモン')) { observed.baseColor = 'cinnamon_green'; }
        else if (p.includes('オパーリン') && p.includes('シーグリーン')) { observed.baseColor = 'opaline_seagreen'; }
        else if (p.includes('オパーリン') && p.includes('ターコイズ')) { observed.baseColor = 'opaline_turquoise'; }
        else if (p.includes('オパーリン') && p.includes('アクア')) { observed.baseColor = 'opaline_aqua'; }
        else if (p.includes('オパーリン')) { observed.baseColor = 'opaline_green'; }
        else if (p.includes('パイド') && p.includes('シーグリーン')) { observed.baseColor = 'pied_rec_seagreen'; }
        else if (p.includes('パイド') && p.includes('ターコイズ')) { observed.baseColor = 'pied_rec_turquoise'; }
        else if (p.includes('パイド') && p.includes('アクア')) { observed.baseColor = 'pied_rec_aqua'; }
        else if (p.includes('パイド')) { observed.baseColor = 'pied_rec_green'; }
        else if (p.includes('シーグリーンダーク')) { observed.baseColor = 'seagreen_dark'; observed.darkness = 'sf'; }
        else if (p.includes('シーグリーン')) { observed.baseColor = 'seagreen'; }
        else if (p.includes('ターコイズダーク')) { observed.baseColor = 'turquoise_dark'; observed.darkness = 'sf'; }
        else if (p.includes('ターコイズ')) { observed.baseColor = 'turquoise'; }
        else if (p.includes('アクアdd') || p.includes('モーブ')) { observed.baseColor = 'aqua_dd'; observed.darkness = 'df'; }
        else if (p.includes('アクアダーク') || p.includes('コバルト')) { observed.baseColor = 'aqua_dark'; observed.darkness = 'sf'; }
        else if (p.includes('アクア') || p.includes('ブルー')) { observed.baseColor = 'aqua'; }
        else if (p.includes('オリーブ')) { observed.baseColor = 'olive'; observed.darkness = 'df'; }
        else if (p.includes('ダークグリーン')) { observed.baseColor = 'darkgreen'; observed.darkness = 'sf'; }
        else if (p.includes('グリーン') || p.includes('ノーマル')) { observed.baseColor = 'green'; }

        if (p.includes('df') || p.includes('ダブル')) { observed.darkness = 'df'; }
        else if (p.includes('sf') || p.includes('シングル')) { observed.darkness = 'sf'; }

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

        // v7.0: SSOT準拠キー
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
        // v7.0: i18n対応 - 現在の言語を取得
        const lang = this._getCurrentLang();

        if (observed?.baseColor) return this.getColorLabel(observed.baseColor, lang);

        const parts = [];
        let baseColorKey = 'green';

        if (geno.parblue === 'aqaq' || geno.parblue === 'bb') baseColorKey = 'aqua';
        else if (geno.parblue === 'tqtq') baseColorKey = 'turquoise';
        else if (geno.parblue === 'tqaq' || geno.parblue === 'tqb') baseColorKey = 'seagreen';

        if (['inoino', 'inoW'].includes(geno.ino)) {
            if (baseColorKey === 'aqua') { parts.push(this._getTraitLabel('creamino', lang)); baseColorKey = ''; }
            else if (baseColorKey === 'turquoise') { parts.push(this._getTraitLabel('pure_white', lang)); baseColorKey = ''; }
            else if (baseColorKey === 'seagreen') { parts.push(this._getTraitLabel('creamino_seagreen', lang)); baseColorKey = ''; }
            else { parts.push(this._getTraitLabel('lutino', lang)); baseColorKey = ''; }
        } else if (['pldpld', 'pldino', 'pldW'].includes(geno.ino)) parts.push(this._getTraitLabel('pallid', lang));

        // v7.0: SSOT準拠キー + 旧キー後方互換
        if (['opop', 'opW'].includes(geno.opaline) || ['opop', 'opW'].includes(geno.op)) parts.push(this._getTraitLabel('opaline', lang));
        if (['cincin', 'cinW'].includes(geno.cinnamon) || ['cincin', 'cinW'].includes(geno.cin)) parts.push(this._getTraitLabel('cinnamon', lang));

        if (geno.dark === 'DD') {
            if (baseColorKey === 'green') baseColorKey = 'olive';
            else if (baseColorKey === 'aqua') baseColorKey = 'aqua_dd';
        } else if (geno.dark === 'Dd') {
            if (baseColorKey === 'green') baseColorKey = 'darkgreen';
            else if (baseColorKey === 'aqua') baseColorKey = 'aqua_dark';
        }

        // v7.0: SSOT準拠キー + 旧キー後方互換
        if (['flpflp', 'flfl'].includes(geno.fallow_pale) || geno.fl === 'flfl') parts.push(this._getTraitLabel('fallow', lang));
        if (geno.pied_rec === 'pipi' || geno.pi === 'pipi') parts.push(this._getTraitLabel('pied', lang));

        const baseLabel = baseColorKey ? this.getColorLabel(baseColorKey, lang) : '';
        let result = parts.length > 0 ? parts.join(' ') + ' ' + baseLabel : baseLabel;
        return result.trim();
    },

    // 現在の言語を取得
    _getCurrentLang() {
        if (typeof T !== 'undefined' && T._lang) return T._lang;
        if (typeof LANG !== 'undefined' && LANG._lang) return LANG._lang;
        // URLパラメータまたはcookieから取得
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) return urlLang;
        // cookieから取得
        const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/);
        return match ? match[1] : 'ja';
    },

    // 特性ラベルを取得（パーツ用）- SSOT参照
    _getTraitLabel(key, lang) {
        // SSOT: genetics.php COLOR_DEFINITIONS から取得
        if (window.GENEFORGE_SSOT?.COLOR_DEFINITIONS) {
            const def = window.GENEFORGE_SSOT.COLOR_DEFINITIONS[key];
            if (def) return def.albs || def.en || key;
        }
        // フォールバック: 基本形質名
        const fallbackTraits = {
            pallid: 'Pallid', opaline: 'Opaline', cinnamon: 'Cinnamon',
            fallow: 'Fallow', pied: 'Pied', lutino: 'Lutino',
            creamino: 'Creamino', pure_white: 'Pure White',
        };
        return fallbackTraits[key] || key;
    },

    // v7.0: SSOT参照 - genetics.php COLOR_DEFINITIONS から取得
    getColorLabel(colorKey, lang = 'en') {
        // SSOT: genetics.php から注入された定義を参照
        if (window.GENEFORGE_SSOT?.COLOR_DEFINITIONS) {
            const def = window.GENEFORGE_SSOT.COLOR_DEFINITIONS[colorKey];
            if (def) return def.albs || def[lang] || def.en || colorKey;
        }
        // フォールバック: キーをそのまま返す
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
        if (ic >= 0.25) warningLevel = { level: 'danger', message: 'Danger: Inbreeding coefficient ≥25%' };
        else if (ic >= 0.125) warningLevel = { level: 'warning', message: 'Warning: Inbreeding coefficient ≥12.5%' };
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
                return { success: false, error: 'Invalid data format' };
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
