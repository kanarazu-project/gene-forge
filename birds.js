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
            dam_dam_sire:   { id: 'demo_125', name: 'Troy', color: 'pied_seagreen' },   // パイドシーグリーン♂
            dam_dam_dam:    { id: 'demo_111', name: 'Hazel', color: 'fallow_aqua' },    // フォローアクア♀
        },
        // 祖父母4羽（pedigree: 親2羽のみ）
        grandparents: {
            sire_sire: { id: 'demo_45', name: 'Adam', color: 'creamino' },              // クリーミノ♂（Jack×Chloe）
            sire_dam:  { id: 'demo_52', name: 'Aurora', color: 'pure_white' },          // ピュアホワイト♀（Paul×Victoria）
            dam_sire:  { id: 'demo_101', name: 'Zack', color: 'opaline_seagreen' },     // オパーリンシーグリーン♂（Sean×Riley）
            dam_dam:   { id: 'demo_119', name: 'Eleanor', color: 'pied_aqua' },         // パイドアクア♀（Troy×Hazel）
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
            { id: 'demo_117', name: 'Brad', color: 'pied_aqua' },
            { id: 'demo_118', name: 'Drew', color: 'pied_aqua' },
            { id: 'demo_120', name: 'Stella', color: 'pied_aqua' },
            { id: 'demo_121', name: 'Carl', color: 'pied_turquoise' },
            { id: 'demo_122', name: 'Dale', color: 'pied_turquoise' },
            { id: 'demo_123', name: 'Lucy', color: 'pied_turquoise' },
            { id: 'demo_124', name: 'Maya', color: 'pied_turquoise' },
            { id: 'demo_126', name: 'Earl', color: 'pied_seagreen' },
            { id: 'demo_128', name: 'Alice', color: 'pied_seagreen' },
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
        
        const colors = [
            { key: 'green', name: 'グリーン', eye: 'black', parblue: '++', ino: '++', dark: 'dd' },
            { key: 'darkgreen', name: 'ダークグリーン', eye: 'black', parblue: '++', ino: '++', dark: 'Dd' },
            { key: 'olive', name: 'オリーブ', eye: 'black', parblue: '++', ino: '++', dark: 'DD' },
            { key: 'aqua', name: 'アクア', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'dd' },
            { key: 'aqua_dark', name: 'アクアダーク', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'Dd' },
            { key: 'aqua_dd', name: 'アクアDD', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'DD' },
            { key: 'turquoise', name: 'ターコイズ', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'dd' },
            { key: 'turquoise_dark', name: 'ターコイズダーク', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'Dd' },
            { key: 'seagreen', name: 'シーグリーン', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'dd' },
            { key: 'seagreen_dark', name: 'シーグリーンダーク', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'Dd' },
            { key: 'lutino', name: 'ルチノー', eye: 'red', parblue: '++', ino: 'inoino', dark: 'dd' },
            { key: 'creamino', name: 'クリーミノ', eye: 'red', parblue: 'aqaq', ino: 'inoino', dark: 'dd' },
            { key: 'pure_white', name: 'ピュアホワイト', eye: 'red', parblue: 'tqtq', ino: 'inoino', dark: 'dd' },
            { key: 'creamino_seagreen', name: 'クリーミノシーグリーン', eye: 'red', parblue: 'tqaq', ino: 'inoino', dark: 'dd' },
            { key: 'pallid_green', name: 'パリッドグリーン', eye: 'black', parblue: '++', ino: 'pldpld', dark: 'dd' },
            { key: 'pallid_aqua', name: 'パリッドアクア', eye: 'black', parblue: 'aqaq', ino: 'pldpld', dark: 'dd' },
            { key: 'pallid_turquoise', name: 'パリッドターコイズ', eye: 'black', parblue: 'tqtq', ino: 'pldpld', dark: 'dd' },
            { key: 'pallid_seagreen', name: 'パリッドシーグリーン', eye: 'black', parblue: 'tqaq', ino: 'pldpld', dark: 'dd' },
            // v7.0: SSOT準拠キー (cinnamon, opaline, fallow_pale, pied_rec)
            { key: 'cinnamon_green', name: 'シナモングリーン', eye: 'black', parblue: '++', ino: '++', dark: 'dd', cinnamon: true },
            { key: 'cinnamon_aqua', name: 'シナモンアクア', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'dd', cinnamon: true },
            { key: 'cinnamon_turquoise', name: 'シナモンターコイズ', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'dd', cinnamon: true },
            { key: 'cinnamon_seagreen', name: 'シナモンシーグリーン', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'dd', cinnamon: true },
            { key: 'opaline_green', name: 'オパーリングリーン', eye: 'black', parblue: '++', ino: '++', dark: 'dd', opaline: true },
            { key: 'opaline_aqua', name: 'オパーリンアクア', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'dd', opaline: true },
            { key: 'opaline_turquoise', name: 'オパーリンターコイズ', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'dd', opaline: true },
            { key: 'opaline_seagreen', name: 'オパーリンシーグリーン', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'dd', opaline: true },
            { key: 'fallow_green', name: 'フォローグリーン', eye: 'red', parblue: '++', ino: '++', dark: 'dd', fallow_pale: true },
            { key: 'fallow_aqua', name: 'フォローアクア', eye: 'red', parblue: 'aqaq', ino: '++', dark: 'dd', fallow_pale: true },
            { key: 'pied_green', name: 'パイドグリーン', eye: 'black', parblue: '++', ino: '++', dark: 'dd', pied_rec: true },
            { key: 'pied_aqua', name: 'パイドアクア', eye: 'black', parblue: 'aqaq', ino: '++', dark: 'dd', pied_rec: true },
            { key: 'pied_turquoise', name: 'パイドターコイズ', eye: 'black', parblue: 'tqtq', ino: '++', dark: 'dd', pied_rec: true },
            { key: 'pied_seagreen', name: 'パイドシーグリーン', eye: 'black', parblue: 'tqaq', ino: '++', dark: 'dd', pied_rec: true },
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
                        notes: `デモ用サンプル個体 (${color.name})`,
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
            name: 'デモ家系図（希少色ファミリー）',
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
        else if ((p.includes('フォロー') || p.includes('fallow')) && p.includes('アクア')) { observed.baseColor = 'fallow_aqua'; observed.eyeColor = 'red'; }
        else if (p.includes('フォロー') || p.includes('fallow')) { observed.baseColor = 'fallow_green'; observed.eyeColor = 'red'; }
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
        else if (p.includes('パイド') && p.includes('シーグリーン')) { observed.baseColor = 'pied_seagreen'; }
        else if (p.includes('パイド') && p.includes('ターコイズ')) { observed.baseColor = 'pied_turquoise'; }
        else if (p.includes('パイド') && p.includes('アクア')) { observed.baseColor = 'pied_aqua'; }
        else if (p.includes('パイド')) { observed.baseColor = 'pied_green'; }
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
        if (observed?.baseColor) return this.getColorLabel(observed.baseColor, 'ja');

        const parts = [];
        let baseColor = 'グリーン';

        if (geno.parblue === 'aqaq' || geno.parblue === 'bb') baseColor = 'アクア';
        else if (geno.parblue === 'tqtq') baseColor = 'ターコイズ';
        else if (geno.parblue === 'tqaq' || geno.parblue === 'tqb') baseColor = 'シーグリーン';

        if (['inoino', 'inoW'].includes(geno.ino)) {
            if (baseColor === 'アクア') { parts.push('クリーミノ'); baseColor = ''; }
            else if (baseColor === 'ターコイズ') { parts.push('ピュアホワイト'); baseColor = ''; }
            else if (baseColor === 'シーグリーン') { parts.push('クリーミノシーグリーン'); baseColor = ''; }
            else { parts.push('ルチノー'); baseColor = ''; }
        } else if (['pldpld', 'pldino', 'pldW'].includes(geno.ino)) parts.push('パリッド');

        // v7.0: SSOT準拠キー + 旧キー後方互換
        if (['opop', 'opW'].includes(geno.opaline) || ['opop', 'opW'].includes(geno.op)) parts.push('オパーリン');
        if (['cincin', 'cinW'].includes(geno.cinnamon) || ['cincin', 'cinW'].includes(geno.cin)) parts.push('シナモン');

        if (geno.dark === 'DD') {
            if (baseColor === 'グリーン') baseColor = 'オリーブ';
            else if (baseColor === 'アクア') baseColor = 'アクアDD';
        } else if (geno.dark === 'Dd') {
            if (baseColor === 'グリーン') baseColor = 'ダークグリーン';
            else if (baseColor === 'アクア') baseColor = 'アクアダーク';
        }

        // v7.0: SSOT準拠キー + 旧キー後方互換
        if (['flpflp', 'flfl'].includes(geno.fallow_pale) || geno.fl === 'flfl') parts.push('フォロー');
        if (geno.pied_rec === 'pipi' || geno.pi === 'pipi') parts.push('パイド');

        let result = parts.length > 0 ? parts.join(' ') + ' ' + baseColor : baseColor;
        return result.trim();
    },

    getColorLabel(colorKey, lang = 'ja') {
        const labels = {
            green: lang === 'ja' ? 'グリーン' : 'Green',
            darkgreen: lang === 'ja' ? 'ダークグリーン' : 'Dark Green',
            olive: lang === 'ja' ? 'オリーブ' : 'Olive',
            aqua: lang === 'ja' ? 'アクア' : 'Aqua',
            aqua_dark: lang === 'ja' ? 'アクアダーク' : 'Aqua Dark',
            aqua_dd: lang === 'ja' ? 'アクアDD' : 'Aqua DD',
            turquoise: lang === 'ja' ? 'ターコイズ' : 'Turquoise',
            turquoise_dark: lang === 'ja' ? 'ターコイズダーク' : 'Turquoise Dark',
            seagreen: lang === 'ja' ? 'シーグリーン' : 'Sea Green',
            seagreen_dark: lang === 'ja' ? 'シーグリーンダーク' : 'Sea Green Dark',
            lutino: lang === 'ja' ? 'ルチノー' : 'Lutino',
            creamino: lang === 'ja' ? 'クリーミノ' : 'Creamino',
            pure_white: lang === 'ja' ? 'ピュアホワイト' : 'Pure White',
            creamino_seagreen: lang === 'ja' ? 'クリーミノシーグリーン' : 'Creamino Sea Green',
            pallid_green: lang === 'ja' ? 'パリッドグリーン' : 'Pallid Green',
            pallid_aqua: lang === 'ja' ? 'パリッドアクア' : 'Pallid Aqua',
            pallid_turquoise: lang === 'ja' ? 'パリッドターコイズ' : 'Pallid Turquoise',
            pallid_seagreen: lang === 'ja' ? 'パリッドシーグリーン' : 'Pallid Sea Green',
            cinnamon_green: lang === 'ja' ? 'シナモングリーン' : 'Cinnamon Green',
            cinnamon_aqua: lang === 'ja' ? 'シナモンアクア' : 'Cinnamon Aqua',
            cinnamon_turquoise: lang === 'ja' ? 'シナモンターコイズ' : 'Cinnamon Turquoise',
            cinnamon_seagreen: lang === 'ja' ? 'シナモンシーグリーン' : 'Cinnamon Sea Green',
            opaline_green: lang === 'ja' ? 'オパーリングリーン' : 'Opaline Green',
            opaline_aqua: lang === 'ja' ? 'オパーリンアクア' : 'Opaline Aqua',
            opaline_turquoise: lang === 'ja' ? 'オパーリンターコイズ' : 'Opaline Turquoise',
            opaline_seagreen: lang === 'ja' ? 'オパーリンシーグリーン' : 'Opaline Sea Green',
            fallow_green: lang === 'ja' ? 'フォローグリーン' : 'Fallow Green',
            fallow_aqua: lang === 'ja' ? 'フォローアクア' : 'Fallow Aqua',
            pied_green: lang === 'ja' ? 'パイドグリーン' : 'Pied Green',
            pied_aqua: lang === 'ja' ? 'パイドアクア' : 'Pied Aqua',
            pied_turquoise: lang === 'ja' ? 'パイドターコイズ' : 'Pied Turquoise',
            pied_seagreen: lang === 'ja' ? 'パイドシーグリーン' : 'Pied Sea Green',
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
