/**
 * Agapornis Gene-Forge v7.0.0
 * 個体データベース管理（localStorage）
 * 
 * v6.7.5 変更点:
 * - デモデータに血統情報（pedigree）をプリセット
 * - 44羽の家系図構築（曽祖父母8 + 祖父母4 + 父母2 + 子30）
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
    // デモ家系図プリセット定義
    // ========================================
    DEMO_PEDIGREE_CONFIG: {
        // 曽祖父母8羽（pedigree: 全てnull）
        greatGrandparents: {
            sire_sire_sire: { id: 'demo_41', name: 'Jack', color: 'lutino' },           // ルチノー♂
            sire_sire_dam:  { id: 'demo_47', name: 'Chloe', color: 'creamino' },        // クリーミノ♀
            sire_dam_sire:  { id: 'demo_65', name: 'Paul', color: 'pallid_turquoise' }, // パリッドターコイズ♂
            sire_dam_dam:   { id: 'demo_51', name: 'Victoria', color: 'pure_white' },  // ピュアホワイト♀
            dam_sire_sire:  { id: 'demo_85', name: 'Sean', color: 'cinnamon_seagreen' }, // シナモンシーグリーン♂
            dam_sire_dam:   { id: 'demo_95', name: 'Riley', color: 'opaline_aqua' },    // オパーリンアクア♀
            dam_dam_sire:   { id: 'demo_125', name: 'Troy', color: 'pied_rec_seagreen' },   // パイドシーグリーン♂
            dam_dam_dam:    { id: 'demo_111', name: 'Hazel', color: 'fallow_pale_aqua' },    // フォローアクア♀
        },
        // 祖父母4羽（pedigree: 親2羽のみ）
        grandparents: {
            sire_sire: { id: 'demo_45', name: 'Adam', color: 'creamino' },              // クリーミノ♂（Jack×Chloe）
            sire_dam:  { id: 'demo_52', name: 'Aurora', color: 'pure_white' },          // ピュアホワイト♀（Paul×Victoria）
            dam_sire:  { id: 'demo_101', name: 'Zack', color: 'opaline_seagreen' },     // オパーリンシーグリーン♂（Sean×Riley）
            dam_dam:   { id: 'demo_119', name: 'Eleanor', color: 'pied_rec_aqua' },         // パイドアクア♀（Troy×Hazel）
        },
        // 父母2羽（pedigree: 親2 + 祖父母4）
        parents: {
            sire: { id: 'demo_53', name: 'Eric', color: 'creamino_seagreen' },          // クリーミノシーグリーン♂（Adam×Aurora）
            dam:  { id: 'demo_99', name: 'Zoey', color: 'opaline_turquoise' },          // オパーリンターコイズ♀（Zack×Eleanor）
        },
        // 子30羽（pedigree: 全14枠）
        offspring: [
            // 多様な色を選択（Eric×Zoeyの子として設定）
            { id: 'demo_33', name: 'Finn', color: 'seagreen' },
            { id: 'demo_34', name: 'Noah', color: 'seagreen' },
            { id: 'demo_37', name: 'Isabella', color: 'seagreen' },
            { id: 'demo_38', name: 'Mia', color: 'seagreen' },
            { id: 'demo_25', name: 'Tom', color: 'turquoise' },
            { id: 'demo_26', name: 'Ben', color: 'turquoise' },
            { id: 'demo_27', name: 'Charlotte', color: 'turquoise' },
            { id: 'demo_28', name: 'Amelia', color: 'turquoise' },
            { id: 'demo_29', name: 'Luke', color: 'turquoise_dark' },
            { id: 'demo_30', name: 'Owen', color: 'turquoise_dark' },
            { id: 'demo_31', name: 'Harper', color: 'turquoise_dark' },
            { id: 'demo_32', name: 'Evelyn', color: 'turquoise_dark' },
            { id: 'demo_93', name: 'Hugo', color: 'opaline_aqua' },
            { id: 'demo_94', name: 'Ivan', color: 'opaline_aqua' },
            { id: 'demo_96', name: 'Aria', color: 'opaline_aqua' },
            { id: 'demo_97', name: 'Kent', color: 'opaline_turquoise' },
            { id: 'demo_98', name: 'Neil', color: 'opaline_turquoise' },
            { id: 'demo_100', name: 'Lily', color: 'opaline_turquoise' },
            { id: 'demo_102', name: 'Jude', color: 'opaline_seagreen' },
            { id: 'demo_103', name: 'Nora', color: 'opaline_seagreen' },
            { id: 'demo_104', name: 'Hannah', color: 'opaline_seagreen' },
            { id: 'demo_117', name: 'Brad', color: 'pied_rec_aqua' },
            { id: 'demo_118', name: 'Drew', color: 'pied_rec_aqua' },
            { id: 'demo_120', name: 'Stella', color: 'pied_rec_aqua' },
            { id: 'demo_121', name: 'Carl', color: 'pied_rec_turquoise' },
            { id: 'demo_122', name: 'Dale', color: 'pied_rec_turquoise' },
            { id: 'demo_123', name: 'Lucy', color: 'pied_rec_turquoise' },
            { id: 'demo_124', name: 'Maya', color: 'pied_rec_turquoise' },
            { id: 'demo_126', name: 'Earl', color: 'pied_rec_seagreen' },
            { id: 'demo_128', name: 'Alice', color: 'pied_rec_seagreen' },
        ]
    },

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
     * デモ用サンプル鳥を生成（128羽）+ 血統情報付き
     */
    generateDemoBirds() {
        const birds = [];
        const now = new Date().toISOString();
        
        const maleNames = [
            'John', 'Sam', 'Ron', 'Max', 'Leo', 'Jack', 'Tom', 'Ben',
            'Luke', 'Owen', 'Finn', 'Noah', 'Liam', 'Evan', 'Ryan', 'Cole',
            'Adam', 'Eric', 'Paul', 'Mark', 'Sean', 'Dean', 'Kyle', 'Troy',
            'Zack', 'Jude', 'Hugo', 'Ivan', 'Kent', 'Neil', 'Brad', 'Drew',
            'Carl', 'Dale', 'Earl', 'Fred', 'Gary', 'Hans', 'Igor', 'Jake',
            'Kirk', 'Lane', 'Mike', 'Nick', 'Omar', 'Pete', 'Reed', 'Seth',
            'Todd', 'Vick', 'Wade', 'Xavi', 'Yuri', 'Zane', 'Abel', 'Axel',
            'Bart', 'Cody', 'Dane', 'Enzo', 'Gabe', 'Hugh', 'Joel', 'Knox'
        ];
        
        const femaleNames = [
            'Elizabeth', 'Catherine', 'Megan', 'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella',
            'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Ella',
            'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Aria', 'Lily', 'Aurora',
            'Zoey', 'Nora', 'Hannah', 'Hazel', 'Eleanor', 'Stella', 'Lucy', 'Maya',
            'Alice', 'Bella', 'Clara', 'Diana', 'Elena', 'Fiona', 'Gloria', 'Helen',
            'Irene', 'Julia', 'Karen', 'Laura', 'Marie', 'Nancy', 'Opal', 'Paula',
            'Quinn', 'Rosa', 'Sarah', 'Tina', 'Uma', 'Vera', 'Wendy', 'Xena',
            'Yolanda', 'Zara', 'Amy', 'Beth', 'Cara', 'Dina', 'Eva', 'Gwen'
        ];
        
        // v7.0: ALBS標準名を全言語共通で使用
        const colors = [
            { key: 'green', name: 'Green', eye: 'black', parblue: '++', ino: '++', dark: 'dd' },
            { key: 'darkgreen', name: 'Dark Green', eye: 'black', parblue: '++', ino: '++', dark: 'Dd' },
            { key: 'olive', name: 'Olive', eye: 'black', parblue: '++', ino: '++', dark: 'DD' },
            { key: 'aqua', name: 'Aqua', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'dd' },
            { key: 'aqua_dark', name: 'Aqua Dark', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'Dd' },
            { key: 'aqua_dd', name: 'Aqua DD', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'DD' },
            { key: 'turquoise', name: 'Turquoise', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'dd' },
            { key: 'turquoise_dark', name: 'Turquoise Dark', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'Dd' },
            { key: 'seagreen', name: 'Sea Green', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'dd' },
            { key: 'seagreen_dark', name: 'Sea Green Dark', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'Dd' },
            { key: 'lutino', name: 'Lutino', eye: 'red', parblue: '++', ino: 'inoino', dark: 'dd' },
            { key: 'creamino', name: 'Creamino', eye: 'red', parblue: 'aqaq', ino: 'inoino', dark: 'dd' },
            { key: 'pure_white', name: 'Pure White', eye: 'red', parblue: 'tqtq', ino: 'inoino', dark: 'dd' },
            { key: 'creamino_seagreen', name: 'Creamino Sea Green', eye: 'red', parblue: 'tqaq', ino: 'inoino', dark: 'dd' },
            { key: 'pallid_green', name: 'Pallid Green', eye: 'black', parblue: '++', ino: 'pldpld', dark: 'dd' },
            { key: 'pallid_aqua', name: 'Pallid Aqua', eye: 'black', parblue: 'aqaq', ino: 'pldpld', dark: 'dd' },
            { key: 'pallid_turquoise', name: 'Pallid Turquoise', eye: 'black', parblue: 'tqtq', ino: 'pldpld', dark: 'dd' },
            { key: 'pallid_seagreen', name: 'Pallid Sea Green', eye: 'black', parblue: 'tqaq', ino: 'pldpld', dark: 'dd' },
            // v7.0: SSOT準拠キー (cinnamon, opaline, fallow_pale, pied_rec)
            { key: 'cinnamon_green', name: 'Cinnamon Green', eye: 'black', parblue: '++', ino: '++', dark: 'dd', cinnamon: true },
            { key: 'cinnamon_aqua', name: 'Cinnamon Aqua', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'dd', cinnamon: true },
            { key: 'cinnamon_turquoise', name: 'Cinnamon Turquoise', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'dd', cinnamon: true },
            { key: 'cinnamon_seagreen', name: 'Cinnamon Sea Green', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'dd', cinnamon: true },
            { key: 'opaline_green', name: 'Opaline Green', eye: 'black', parblue: '++', ino: '++', dark: 'dd', opaline: true },
            { key: 'opaline_aqua', name: 'Opaline Aqua', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'dd', opaline: true },
            { key: 'opaline_turquoise', name: 'Opaline Turquoise', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'dd', opaline: true },
            { key: 'opaline_seagreen', name: 'Opaline Sea Green', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'dd', opaline: true },
            { key: 'fallow_pale_green', name: 'Pale Fallow Green', eye: 'red', parblue: '++', ino: '++', dark: 'dd', fallow_pale: true },
            { key: 'fallow_pale_aqua', name: 'Pale Fallow Aqua', eye: 'red', parblue: 'aqaq', ino: '++', dark: 'dd', fallow_pale: true },
            { key: 'pied_rec_green', name: 'Recessive Pied Green', eye: 'black', parblue: '++', ino: '++', dark: 'dd', pied_rec: true },
            { key: 'pied_rec_aqua', name: 'Recessive Pied Aqua', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'dd', pied_rec: true },
            { key: 'pied_rec_turquoise', name: 'Recessive Pied Turquoise', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'dd', pied_rec: true },
            { key: 'pied_rec_seagreen', name: 'Recessive Pied Seagreen', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'dd', pied_rec: true },
        ];
        
        let idCounter = 1;
        let maleIndex = 0;
        let femaleIndex = 0;
        
        // まず128羽を生成（pedigreeは空）
        colors.forEach(color => {
            ['male', 'female'].forEach(sex => {
                for (let i = 0; i < 2; i++) {
                    const isMale = sex === 'male';
                    const birdName = isMale ? maleNames[maleIndex++] : femaleNames[femaleIndex++];
                    
                    // v7.0: SSOT準拠キー
                    const geno = {
                        parblue: color.parblue,
                        ino: isMale ? color.ino : (color.ino === 'inoino' ? 'inoW' : (color.ino === 'pldpld' ? 'pldW' : '+W')),
                        opaline: color.opaline ? (isMale ? 'opop' : 'opW') : (isMale ? '++' : '+W'),
                        cinnamon: color.cinnamon ? (isMale ? 'cincin' : 'cinW') : (isMale ? '++' : '+W'),
                        dark: color.dark,
                        violet: 'vv',
                        fallow_pale: color.fallow_pale ? 'flpflp' : '++',
                        dilute: '++',
                        pied_rec: color.pied_rec ? 'pipi' : '++'
                    };
                    
                    const darkness = color.dark === 'DD' ? 'df' : (color.dark === 'Dd' ? 'sf' : 'none');
                    
                    birds.push({
                        id: 'demo_' + idCounter,
                        name: birdName,
                        code: `DEMO${String(idCounter).padStart(3, '0')}`,
                        sex: sex,
                        birthDate: '2024-01-01',
                        sire: null,
                        dam: null,
                        lineage: '',
                        observed: {
                            baseColor: color.key,
                            eyeColor: color.eye,
                            darkness: darkness
                        },
                        genotype: geno,
                        pedigree: this.createEmptyPedigree(),
                        phase: 'independent',
                        phenotype: color.name,
                        inbreedingGen: 0,
                        notes: `Demo specimen (${color.name})`,
                        createdAt: now,
                        updatedAt: now
                    });
                    
                    idCounter++;
                }
            });
        });
        
        // 血統情報を書き込む
        this.applyDemoPedigree(birds);
        
        return birds;
    },

    /**
     * v6.7.5: デモデータに血統情報を適用
     */
    applyDemoPedigree(birds) {
        const cfg = this.DEMO_PEDIGREE_CONFIG;
        const findBird = (id) => birds.find(b => b.id === id);
        
        // ========================================
        // 曽祖父母8羽: pedigree は全てnull（変更なし）
        // ========================================
        
        // ========================================
        // 祖父母4羽: 親2羽のIDを設定
        // ========================================
        
        // sire_sire（父方祖父）: Jack×Chloe の息子
        const sire_sire = findBird(cfg.grandparents.sire_sire.id);
        if (sire_sire) {
            sire_sire.pedigree = {
                ...this.createEmptyPedigree(),
                sire: cfg.greatGrandparents.sire_sire_sire.id,  // demo_41 Jack
                dam: cfg.greatGrandparents.sire_sire_dam.id,    // demo_47 Chloe
            };
        }
        
        // sire_dam（父方祖母）: Paul×Victoria の娘
        const sire_dam = findBird(cfg.grandparents.sire_dam.id);
        if (sire_dam) {
            sire_dam.pedigree = {
                ...this.createEmptyPedigree(),
                sire: cfg.greatGrandparents.sire_dam_sire.id,   // demo_65 Paul
                dam: cfg.greatGrandparents.sire_dam_dam.id,     // demo_51 Victoria
            };
        }
        
        // dam_sire（母方祖父）: Sean×Riley の息子
        const dam_sire = findBird(cfg.grandparents.dam_sire.id);
        if (dam_sire) {
            dam_sire.pedigree = {
                ...this.createEmptyPedigree(),
                sire: cfg.greatGrandparents.dam_sire_sire.id,   // demo_85 Sean
                dam: cfg.greatGrandparents.dam_sire_dam.id,     // demo_95 Riley
            };
        }
        
        // dam_dam（母方祖母）: Troy×Hazel の娘
        const dam_dam = findBird(cfg.grandparents.dam_dam.id);
        if (dam_dam) {
            dam_dam.pedigree = {
                ...this.createEmptyPedigree(),
                sire: cfg.greatGrandparents.dam_dam_sire.id,    // demo_125 Troy
                dam: cfg.greatGrandparents.dam_dam_dam.id,      // demo_111 Hazel
            };
        }
        
        // ========================================
        // 父母2羽: 親2 + 祖父母4 のIDを設定
        // ========================================
        
        // sire（父）: Adam×Aurora の息子
        const sire = findBird(cfg.parents.sire.id);
        if (sire) {
            sire.pedigree = {
                sire: cfg.grandparents.sire_sire.id,            // demo_45 Adam
                dam: cfg.grandparents.sire_dam.id,              // demo_52 Aurora
                sire_sire: cfg.greatGrandparents.sire_sire_sire.id, // demo_41 Jack
                sire_dam: cfg.greatGrandparents.sire_sire_dam.id,   // demo_47 Chloe
                dam_sire: cfg.greatGrandparents.sire_dam_sire.id,   // demo_65 Paul
                dam_dam: cfg.greatGrandparents.sire_dam_dam.id,     // demo_51 Victoria
                sire_sire_sire: null,
                sire_sire_dam: null,
                sire_dam_sire: null,
                sire_dam_dam: null,
                dam_sire_sire: null,
                dam_sire_dam: null,
                dam_dam_sire: null,
                dam_dam_dam: null,
            };
        }
        
        // dam（母）: Zack×Eleanor の娘
        const dam = findBird(cfg.parents.dam.id);
        if (dam) {
            dam.pedigree = {
                sire: cfg.grandparents.dam_sire.id,             // demo_101 Zack
                dam: cfg.grandparents.dam_dam.id,               // demo_119 Eleanor
                sire_sire: cfg.greatGrandparents.dam_sire_sire.id, // demo_85 Sean
                sire_dam: cfg.greatGrandparents.dam_sire_dam.id,   // demo_95 Riley
                dam_sire: cfg.greatGrandparents.dam_dam_sire.id,   // demo_125 Troy
                dam_dam: cfg.greatGrandparents.dam_dam_dam.id,     // demo_111 Hazel
                sire_sire_sire: null,
                sire_sire_dam: null,
                sire_dam_sire: null,
                sire_dam_dam: null,
                dam_sire_sire: null,
                dam_sire_dam: null,
                dam_dam_sire: null,
                dam_dam_dam: null,
            };
        }
        
        // ========================================
        // 子30羽: 全14枠のIDを設定
        // ========================================
        
        const childPedigree = {
            // 親
            sire: cfg.parents.sire.id,                          // demo_53 Eric
            dam: cfg.parents.dam.id,                            // demo_99 Zoey
            // 祖父母
            sire_sire: cfg.grandparents.sire_sire.id,           // demo_45 Adam
            sire_dam: cfg.grandparents.sire_dam.id,             // demo_52 Aurora
            dam_sire: cfg.grandparents.dam_sire.id,             // demo_101 Zack
            dam_dam: cfg.grandparents.dam_dam.id,               // demo_119 Eleanor
            // 曽祖父母（父方）
            sire_sire_sire: cfg.greatGrandparents.sire_sire_sire.id, // demo_41 Jack
            sire_sire_dam: cfg.greatGrandparents.sire_sire_dam.id,   // demo_47 Chloe
            sire_dam_sire: cfg.greatGrandparents.sire_dam_sire.id,   // demo_65 Paul
            sire_dam_dam: cfg.greatGrandparents.sire_dam_dam.id,     // demo_51 Victoria
            // 曽祖父母（母方）
            dam_sire_sire: cfg.greatGrandparents.dam_sire_sire.id,   // demo_85 Sean
            dam_sire_dam: cfg.greatGrandparents.dam_sire_dam.id,     // demo_95 Riley
            dam_dam_sire: cfg.greatGrandparents.dam_dam_sire.id,     // demo_125 Troy
            dam_dam_dam: cfg.greatGrandparents.dam_dam_dam.id,       // demo_111 Hazel
        };
        
        cfg.offspring.forEach(childCfg => {
            const child = findBird(childCfg.id);
            if (child) {
                child.pedigree = { ...childPedigree };
            }
        });
    },

    /**
     * v6.7.5: デモ家系図をFamilyMap形式で取得
     */
    getDemoPedigreeForFamilyMap() {
        const cfg = this.DEMO_PEDIGREE_CONFIG;
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
        
        return {
            name: 'Demo Pedigree (Rare Color Family)',
            savedAt: new Date().toISOString(),
            // 曽祖父母
            sire_sire_sire: toBirdData(cfg.greatGrandparents.sire_sire_sire.id),
            sire_sire_dam: toBirdData(cfg.greatGrandparents.sire_sire_dam.id),
            sire_dam_sire: toBirdData(cfg.greatGrandparents.sire_dam_sire.id),
            sire_dam_dam: toBirdData(cfg.greatGrandparents.sire_dam_dam.id),
            dam_sire_sire: toBirdData(cfg.greatGrandparents.dam_sire_sire.id),
            dam_sire_dam: toBirdData(cfg.greatGrandparents.dam_sire_dam.id),
            dam_dam_sire: toBirdData(cfg.greatGrandparents.dam_dam_sire.id),
            dam_dam_dam: toBirdData(cfg.greatGrandparents.dam_dam_dam.id),
            // 祖父母
            sire_sire: toBirdData(cfg.grandparents.sire_sire.id),
            sire_dam: toBirdData(cfg.grandparents.sire_dam.id),
            dam_sire: toBirdData(cfg.grandparents.dam_sire.id),
            dam_dam: toBirdData(cfg.grandparents.dam_dam.id),
            // 父母
            sire: toBirdData(cfg.parents.sire.id),
            dam: toBirdData(cfg.parents.dam.id),
            // 子30羽
            offspring: cfg.offspring.map(c => toBirdData(c.id)).filter(b => b !== null),
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

    // 特性ラベルを取得（パーツ用）- ALBS標準名を使用
    _getTraitLabel(key, lang) {
        // v7.0: ALBS標準名を全言語共通で使用
        const traits = {
            pallid: 'Pallid',
            opaline: 'Opaline',
            cinnamon: 'Cinnamon',
            fallow: 'Fallow',
            pied: 'Pied',
            lutino: 'Lutino',
            creamino: 'Creamino',
            pure_white: 'Pure White',
            creamino_seagreen: 'Creamino Sea Green',
        };
        return traits[key] || key;
    },

    // v7.0: ALBS標準名を全言語共通で使用
    getColorLabel(colorKey, lang = 'en') {
        const labels = {
            green: 'Green',
            darkgreen: 'Dark Green',
            olive: 'Olive',
            aqua: 'Aqua',
            aqua_dark: 'Aqua Dark',
            aqua_dd: 'Aqua DD',
            turquoise: 'Turquoise',
            turquoise_dark: 'Turquoise Dark',
            seagreen: 'Sea Green',
            seagreen_dark: 'Sea Green Dark',
            lutino: 'Lutino',
            creamino: 'Creamino',
            pure_white: 'Pure White',
            creamino_seagreen: 'Creamino Sea Green',
            pallid_green: 'Pallid Green',
            pallid_aqua: 'Pallid Aqua',
            pallid_turquoise: 'Pallid Turquoise',
            pallid_seagreen: 'Pallid Sea Green',
            cinnamon_green: 'Cinnamon Green',
            cinnamon_aqua: 'Cinnamon Aqua',
            cinnamon_turquoise: 'Cinnamon Turquoise',
            cinnamon_seagreen: 'Cinnamon Sea Green',
            opaline_green: 'Opaline Green',
            opaline_aqua: 'Opaline Aqua',
            opaline_turquoise: 'Opaline Turquoise',
            opaline_seagreen: 'Opaline Sea Green',
            // SSOT準拠キー (fallow_pale_*, pied_rec_*)
            fallow_pale_green: 'Pale Fallow Green',
            fallow_pale_aqua: 'Pale Fallow Aqua',
            pied_rec_green: 'Recessive Pied Green',
            pied_rec_aqua: 'Recessive Pied Aqua',
            pied_rec_turquoise: 'Recessive Pied Turquoise',
            pied_rec_seagreen: 'Recessive Pied Seagreen',
        };
        return labels[colorKey] || colorKey || '?';
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
