/**
 * FamilyMap V3.6 - 一族マップUI
 * Build: 2024-v674-ALBS-FIXED
 */
if (typeof customConfirm === 'undefined') {
    window.customConfirm = function(msg) { return Promise.resolve(confirm(msg)); };
}

const FamilyMap = {
    demoMode: false,
    familyMode: 'plan',
    FAMILY_MODES: { FACT: 'fact', PLAN: 'plan' },
    data: {
        name: '', savedAt: null,
        sire: null, sire_sire: null, sire_dam: null,
        sire_sire_sire: null, sire_sire_dam: null, sire_dam_sire: null, sire_dam_dam: null,
        dam: null, dam_sire: null, dam_dam: null,
        dam_sire_sire: null, dam_sire_dam: null, dam_dam_sire: null, dam_dam_dam: null,
        offspring: [],
    },
    targetPosition: null,

    // SSOT参照: genetics.php COLOR_OPTIONS からオプションを生成
    get baseColorOptions() {
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const ssot = window.GENEFORGE_SSOT;

        // SSOT COLOR_OPTIONS が利用可能な場合
        if (ssot?.COLOR_OPTIONS) {
            const categoryGroups = {
                green: isJa ? 'グリーン系（野生型）' : 'Green (Wild)',
                aqua: isJa ? 'アクア系' : 'Aqua',
                turquoise: isJa ? 'ターコイズ系（Whitefaced）' : 'Turquoise (Whitefaced)',
                seagreen: isJa ? 'シーグリーン系' : 'Seagreen',
                ino: isJa ? 'INO系（メラニン欠落・赤目）' : 'INO (Melanin Absent)',
                pallid: isJa ? 'パリッド系（メラニン減少）' : 'Pallid (Melanin Reduced)',
                cinnamon: isJa ? 'シナモン系（茶色メラニン）' : 'Cinnamon',
                opaline: isJa ? 'オパーリン系（模様変化）' : 'Opaline',
                fallow_pale: isJa ? 'フォロー系（赤目）' : 'Fallow',
                pied_rec: isJa ? 'パイド系（まだら模様）' : 'Pied',
                pied_dom: isJa ? 'ドミナントパイド系' : 'Dominant Pied',
            };
            // Tier 1 のみをFamilyMap用に抽出
            return ssot.COLOR_OPTIONS
                .filter(opt => !opt.tier || opt.tier === 1)
                .map(opt => ({
                    value: opt.value,
                    label: opt.albs || opt.label,
                    group: categoryGroups[opt.category] || opt.category
                }));
        }
        // フォールバック: 最小限のオプション
        return [
            { value: 'green', label: 'Green', group: 'Green' },
            { value: 'aqua', label: 'Aqua', group: 'Aqua' },
            { value: 'turquoise', label: 'Turquoise', group: 'Turquoise' },
            { value: 'lutino', label: 'Lutino', group: 'INO' },
        ];
    },

    // SSOT参照: genetics.php PHENOTYPE_OPTIONS.darkness から取得
    get darknessOptions() {
        const ssot = window.GENEFORGE_SSOT;
        if (ssot?.PHENOTYPE_OPTIONS?.darkness) {
            return ssot.PHENOTYPE_OPTIONS.darkness;
        }
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        return [
            { value: 'normal', label: isJa ? 'ノーマル (dd)' : 'Normal (dd)' },
            { value: 'dark', label: isJa ? 'ダーク (Dd)' : 'Dark (Dd)' },
            { value: 'olive', label: isJa ? 'オリーブ (DD)' : 'Olive (DD)' },
        ];
    },

    // SSOT参照: genetics.php PHENOTYPE_OPTIONS.eyeColor から取得
    get eyeColorOptions() {
        const ssot = window.GENEFORGE_SSOT;
        if (ssot?.PHENOTYPE_OPTIONS?.eyeColor) {
            return ssot.PHENOTYPE_OPTIONS.eyeColor;
        }
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        return [
            { value: 'black', label: isJa ? '黒目' : 'Black' },
            { value: 'red', label: isJa ? '赤目' : 'Red' },
        ];
    },

    // SSOT参照: genetics.php PHENOTYPE_OPTIONS.melanin から取得
    get melaninOptions() {
        const ssot = window.GENEFORGE_SSOT;
        if (ssot?.PHENOTYPE_OPTIONS?.melanin) {
            return ssot.PHENOTYPE_OPTIONS.melanin;
        }
        return [
            { value: '', label: T?.unknown || 'Unknown' },
            { value: 'normal', label: T?.normal || 'Normal' },
            { value: 'diluted', label: T?.diluted || 'Diluted' },
            { value: 'absent', label: T?.absent || 'Absent' },
            { value: 'brown', label: T?.brown || 'Brown' },
        ];
    },

    get patternOptions() {
        return [
            { value: '', label: T?.unknown || 'Unknown' },
            { value: 'normal', label: T?.normal || 'Normal' },
            { value: 'opaline', label: T?.opaline || 'Opaline' },
            { value: 'pied', label: T?.pied || 'Pied' },
        ];
    },

    init() {
        this.restoreAfterInference();
        
        // BirdDB のモードを同期
        if (typeof BirdDB !== 'undefined' && BirdDB.getMode) {
            this.demoMode = (BirdDB.getMode() === 'demo');
        }
        
        if (this.demoMode) {

            this.loadDemoPedigree();
        }

        this.renderUI();
        this.loadSavedMaps();
        this.bindEvents();
    },

    restoreAfterInference() {
        const saved = localStorage.getItem('familyMapBeforeInfer');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.data = state.data;
                this.targetPosition = state.targetPosition;
                this.demoMode = state.demoMode || false;
                this.familyMode = state.familyMode || 'plan';
                localStorage.removeItem('familyMapBeforeInfer');
            } catch (e) {
                console.error('Failed to restore state:', e);
            }
        }
    },

    toggleMode() { this.setDemoMode(!this.demoMode); },

    /**
     * v3.7: デモ用プリセット家系図をロード
     */
    loadDemoPedigree() {
        if (typeof BirdDB !== 'undefined' && BirdDB.getDemoPedigreeForFamilyMap) {
            const demoData = BirdDB.getDemoPedigreeForFamilyMap();
            if (demoData) {
                this.data = demoData;
                this.targetPosition = null;
                console.log('[FamilyMap] Demo pedigree loaded');
            }
        }
    },


    setFamilyMode(mode) {
        if (mode !== this.FAMILY_MODES.FACT && mode !== this.FAMILY_MODES.PLAN) {
            console.error('Invalid family mode:', mode);
            return;
        }
        this.familyMode = mode;
        this.renderUI();
    },

    toggleFamilyMode() {
        const newMode = this.familyMode === this.FAMILY_MODES.FACT ? this.FAMILY_MODES.PLAN : this.FAMILY_MODES.FACT;
        this.setFamilyMode(newMode);
    },

    canUseGeneticEstimation() {
        if (this.familyMode === this.FAMILY_MODES.FACT) return false;
        if (typeof BreedingValidator !== 'undefined') return BreedingValidator.canEstimateGenetics(this.familyMode);
        return true;
    },

    validateBreeding(sire, dam) {
        if (!sire || !dam) return { allowed: true };
        if (typeof BreedingValidator !== 'undefined') return BreedingValidator.validate(sire, dam, this.familyMode);
        const _t = (k, fb) => (typeof T !== 'undefined' && T[k]) ? T[k] : fb;
        if (sire.sex !== 'male') return { allowed: false, reason: _t('bv_sex_male', 'Please specify a male for the sire'), type: 'fact' };
        if (dam.sex !== 'female') return { allowed: false, reason: _t('bv_sex_female', 'Please specify a female for the dam'), type: 'fact' };
        if (sire.id === dam.id) return { allowed: false, reason: _t('bv_same_bird', 'Same individual'), type: 'fact' };
        return { allowed: true };
    },

    setDemoMode(isDemo) {
        if (this.demoMode === isDemo) return;
        this.demoMode = isDemo;
        const newMode = isDemo ? 'demo' : 'user';
        if (typeof BirdDB !== 'undefined' && BirdDB.setModeFromFamilyMap) BirdDB.setModeFromFamilyMap(newMode);
        if (isDemo) {
            this.loadDemoPedigree();
        } else {
            this.data = {
                name: '', savedAt: null,
                sire: null, sire_sire: null, sire_dam: null,
                sire_sire_sire: null, sire_sire_dam: null, sire_dam_sire: null, sire_dam_dam: null,
                dam: null, dam_sire: null, dam_dam: null,
                dam_sire_sire: null, dam_sire_dam: null, dam_dam_sire: null, dam_dam_dam: null,
                offspring: [],
            };
            this.targetPosition = null;
        }
        this.renderUI();
    },


    renderUI() {
        const container = document.getElementById('familyMapContainer');
        if (!container) return;
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const familyModeLabel = this.familyMode === this.FAMILY_MODES.FACT
            ? (isJa ? '📝 事実モード' : '📝 Fact Mode')
            : (isJa ? '🎯 倫理計画モード' : '🎯 Ethics Plan Mode');
        const familyModeClass = this.familyMode === this.FAMILY_MODES.FACT ? 'fact-mode' : 'plan-mode';
        const canInfer = this.canUseGeneticEstimation();
        const inferBtnDisabled = !canInfer || !this.targetPosition;
        const inferBtnClass = canInfer ? '' : 'disabled-mode';
        const inferBtnTitle = canInfer ? '' : (isJa ? '事実モードでは遺伝推定は利用できません' : 'Genetic estimation is not available in Fact Mode');

        container.innerHTML = `
            <div class="family-map-header">
                <h2>🦜 ${T.family_map}</h2>
                <div class="family-mode-toggle">
                    <button class="fmap-btn ${familyModeClass}" onclick="FamilyMap.toggleFamilyMode()" title="${isJa ? 'クリックでモード切替' : 'Click to toggle mode'}">${familyModeLabel}</button>
                    <span class="mode-hint">${this.familyMode === this.FAMILY_MODES.FACT ? (isJa ? '※遺伝推定不可・近親交配記録可' : '※No inference, inbreeding recordable') : (isJa ? '※遺伝推定可・近親交配12.5%未満のみ' : '※Inference OK, <12.5% inbreeding only')}</span>
                </div>
                <div class="family-map-actions-grid">
                    <button class="fmap-btn fmap-btn-outline" onclick="FamilyMap.clearAll()">🗑️ ${T.clear}</button>
                    <button class="fmap-btn fmap-btn-primary" onclick="FamilyMap.finalizeFamilyMap()">✅ ${isJa ? '決定' : 'Finalize'}</button>
                    <button class="fmap-btn fmap-btn-outline" onclick="FamilyMap.saveSnapshot()">💾 ${T.save}</button>
                    <button class="fmap-btn fmap-btn-outline" onclick="FamilyMap.showLoadModal()">📂 ${T.load}</button>
                    <button class="fmap-btn fmap-btn-outline" onclick="FamilyMap.exportJSON()">📤 JSON</button>
                </div>
            </div>
            <div class="pedigree-chart">
                <section class="lineage paternal-lineage">
                    <div class="lineage-label">${T.paternal_line}</div>
                    <div class="gen-row ggp-row">
                        ${this.renderCard('sire_sire_sire', T.gf_father, 'male')}
                        ${this.renderCard('sire_sire_dam', T.gf_mother, 'female')}
                        <div class="gen-spacer"></div>
                        ${this.renderCard('sire_dam_sire', T.gm_father, 'male')}
                        ${this.renderCard('sire_dam_dam', T.gm_mother, 'female')}
                    </div>
                    <div class="tree-lines dual"><div class="branch left"></div><div class="branch right"></div></div>
                    <div class="gen-row gp-row">
                        ${this.renderCard('sire_sire', T.grandfather, 'male')}
                        ${this.renderCard('sire_dam', T.grandmother, 'female')}
                    </div>
                    <div class="tree-lines single"></div>
                    <div class="gen-row parent-row">${this.renderCard('sire', T.sire, 'male', true)}</div>
                </section>
                <div class="main-stem top"></div>
                <section class="offspring-strip">
                    <div class="offspring-label">🐣 ${T.offspring}</div>
                    <div class="offspring-scroll"><div class="offspring-row" id="offspringGrid">${this.renderOffspringSlots()}</div></div>
                    <button class="btn-add-child" onclick="FamilyMap.addOffspring()">➕</button>
                </section>
                <div class="main-stem bottom"></div>
                <section class="lineage maternal-lineage">
                    <div class="gen-row parent-row">${this.renderCard('dam', T.dam, 'female', true)}</div>
                    <div class="tree-lines single"></div>
                    <div class="gen-row gp-row">
                        ${this.renderCard('dam_sire', T.grandfather, 'male')}
                        ${this.renderCard('dam_dam', T.grandmother, 'female')}
                    </div>
                    <div class="tree-lines dual"><div class="branch left"></div><div class="branch right"></div></div>
                    <div class="gen-row ggp-row">
                        ${this.renderCard('dam_sire_sire', T.gf_father, 'male')}
                        ${this.renderCard('dam_sire_dam', T.gf_mother, 'female')}
                        <div class="gen-spacer"></div>
                        ${this.renderCard('dam_dam_sire', T.gm_father, 'male')}
                        ${this.renderCard('dam_dam_dam', T.gm_mother, 'female')}
                    </div>
                    <div class="lineage-label">${T.maternal_line}</div>
                </section>
            </div>
            <div class="inference-panel">
                <div class="target-info"><span class="target-label">${T.target}:</span><strong id="targetDisplay" class="target-name">${T.not_selected}</strong></div>
                <button class="btn btn-primary btn-infer ${inferBtnClass}" onclick="FamilyMap.runInference()" id="inferBtn" ${inferBtnDisabled ? 'disabled' : ''} title="${inferBtnTitle}">🔬 ${T.run_inference}</button>
                ${!canInfer ? `<div class="infer-mode-notice">${isJa ? '※事実モードでは遺伝推定は利用できません' : '※Inference not available in Fact Mode'}</div>` : ''}
            </div>
            <div id="inferenceResult" class="inference-result"></div>
            <div id="inbreedingWarning" class="inbreeding-warning"></div>
        `;
        this.checkParentInbreeding();
    },

    checkParentInbreeding() {
        const sire = this.data.sire, dam = this.data.dam;
        if (!sire || !dam) return;
        const validation = this.validateBreeding(sire, dam);
        if (!validation.allowed) this.displayBreedingWarning(validation);
        else if (validation.warning) this.displayBreedingWarning({ warning: validation.warning });
    },

    displayBreedingWarning(validation) {
        const warningEl = document.getElementById('inbreedingWarning');
        if (!warningEl) return;
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        if (validation.reason) {
            const typeLabel = validation.type === 'absolute' ? (isJa ? '🚫 絶対禁止' : '🚫 Absolutely Prohibited') : validation.type === 'ethics' ? (isJa ? '⚠️ 倫理基準違反' : '⚠️ Ethics Violation') : (isJa ? '❌ エラー' : '❌ Error');
            warningEl.innerHTML = `<div class="breeding-block ${validation.type}"><div class="block-header">${typeLabel}</div><div class="block-message">${validation.reason}</div>${this.familyMode === this.FAMILY_MODES.FACT && validation.type !== 'absolute' ? `<div class="block-hint">${isJa ? '※事実モードでは警告のみで記録可能です' : '※Recordable with warning in Fact Mode'}</div>` : ''}</div>`;
            warningEl.style.display = 'block';
        } else if (validation.warning) {
            warningEl.innerHTML = `<div class="breeding-warning"><div class="warning-message">${validation.warning}</div></div>`;
            warningEl.style.display = 'block';
        } else {
            warningEl.innerHTML = '';
            warningEl.style.display = 'none';
        }
    },

    renderCard(position, label, defaultSex, isParent = false) {
        const bird = this.data[position];
        const isTarget = this.targetPosition === position;
        const isEmpty = !bird;
        const sexSymbol = defaultSex === 'male' ? '♂' : '♀';
        let content = '';
        if (isEmpty) {
            content = `<div class="card-empty"><span class="sex-icon">${sexSymbol}</span><span class="empty-text">${T.click_to_input}</span></div>`;
        } else {
            const pheno = bird.phenotype || {}, geno = bird.genotype || {};
            let colorLabel;
            if (Object.keys(geno).length > 0 && typeof BirdDB !== 'undefined' && BirdDB.calculatePhenotype) colorLabel = BirdDB.calculatePhenotype(geno, bird.sex);
            else colorLabel = this.baseColorOptions.find(o => o.value === pheno.baseColor)?.label || '?';
            const idDisplay = bird.dbId ? `<span class="bird-id">#${bird.dbId}</span>` : '';
            content = `<div class="card-filled"><span class="sex-icon">${bird.sex === 'male' ? '♂' : '♀'}</span><span class="pheno-color">${colorLabel}</span>${bird.name ? `<span class="bird-name">${bird.name}</span>` : ''}${idDisplay}</div>`;
        }
        const canSetTarget = this.canUseGeneticEstimation();
        const targetBtnDisabled = !canSetTarget ? 'disabled' : '';
        const targetBtnClass = !canSetTarget ? 'target-btn-disabled' : '';
        return `<div class="bird-card ${isEmpty ? 'empty' : 'filled'} ${isTarget ? 'target' : ''} ${isParent ? 'parent' : ''}" data-position="${position}">
            <div class="card-header" onclick="FamilyMap.selectSlot('${position}')"><span class="card-label">${label}${sexSymbol}</span><div class="card-actions"><button class="act-btn" onclick="event.stopPropagation(); FamilyMap.loadFromDB('${position}')" title="DB">📂</button>${!isEmpty ? `<button class="act-btn del" onclick="event.stopPropagation(); FamilyMap.clearSlot('${position}')" title="${T.clear}">×</button>` : ''}</div></div>
            <div class="card-body" onclick="FamilyMap.selectSlot('${position}')">${content}</div>
            <button class="target-select-btn ${isTarget ? 'active' : ''} ${targetBtnClass}" onclick="event.stopPropagation(); FamilyMap.setAsTarget('${position}')" ${targetBtnDisabled}>🎯 ${isTarget ? (T.inference_target || 'Target') : (T.set_as_target || 'Set Target')}</button>
        </div>`;
    },

    renderOffspringSlots() {
        let html = '';
        const offspring = this.data.offspring || [];
        const canSetTarget = this.canUseGeneticEstimation();
        const targetBtnDisabled = !canSetTarget ? 'disabled' : '';
        const targetBtnClass = !canSetTarget ? 'target-btn-disabled' : '';
        offspring.forEach((bird, idx) => {
            const isTarget = this.targetPosition === `offspring_${idx}`;
            const pheno = bird.phenotype || {}, geno = bird.genotype || {};
            let colorLabel;
            if (Object.keys(geno).length > 0 && typeof BirdDB !== 'undefined' && BirdDB.calculatePhenotype) colorLabel = BirdDB.calculatePhenotype(geno, bird.sex);
            else colorLabel = this.baseColorOptions.find(o => o.value === pheno.baseColor)?.label || '?';
            const idDisplay = bird.dbId ? `<span class="bird-id">#${bird.dbId}</span>` : '';
            html += `<div class="child-card ${isTarget ? 'target' : ''}" data-position="offspring_${idx}">
                <div class="child-header" onclick="FamilyMap.selectSlot('offspring_${idx}')"><span>${T.child}${idx + 1}</span><button class="act-btn del" onclick="event.stopPropagation(); FamilyMap.removeOffspring(${idx})">×</button></div>
                <div class="child-body" onclick="FamilyMap.selectSlot('offspring_${idx}')"><span class="sex-icon">${bird.sex === 'male' ? '♂' : '♀'}</span><span class="pheno-color">${colorLabel}</span>${bird.name ? `<span class="bird-name">${bird.name}</span>` : ''}${idDisplay}</div>
                <button class="child-target-btn ${isTarget ? 'active' : ''} ${targetBtnClass}" onclick="event.stopPropagation(); FamilyMap.setAsTarget('offspring_${idx}')" ${targetBtnDisabled}>🎯${isTarget ? (T.target || 'Target') : ''}</button>
            </div>`;
        });
        return html;
    },

    setAsTarget(position) {
        if (!this.canUseGeneticEstimation()) {
            const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
            alert(isJa ? '事実モードでは遺伝推定は利用できません' : 'Genetic estimation is not available in Fact Mode');
            return;
        }
        this.targetPosition = position;
        this.renderUI();
        const inferBtn = document.getElementById('inferBtn');
        if (inferBtn) inferBtn.disabled = !this.targetPosition || !this.canUseGeneticEstimation();
        const targetDisplay = document.getElementById('targetDisplay');
        if (targetDisplay) targetDisplay.textContent = this.getPositionLabelDetailed(position);
    },

    selectSlot(position) { this.openInputModal(position); },

    openInputModal(position) {
        const bird = position.startsWith('offspring_') ? this.data.offspring[parseInt(position.split('_')[1])] : this.data[position];
        let modal = document.getElementById('birdInputModal');
        if (!modal) { modal = this.createInputModal(); document.body.appendChild(modal); }
        modal.dataset.position = position;
        const form = modal.querySelector('form');
        const defaultSex = this.getDefaultSex(position);
        const sexSelect = form.elements['bird_sex'];
        const sexDisplay = document.getElementById('sexDisplayOnly');
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        if (sexSelect && sexDisplay) {
            sexSelect.value = defaultSex;
            if (position.startsWith('offspring_')) { sexSelect.style.display = 'block'; sexDisplay.style.display = 'none'; }
            else { sexSelect.style.display = 'none'; sexDisplay.style.display = 'block'; sexDisplay.textContent = defaultSex === 'male' ? `♂ ${isJa ? 'オス（固定）' : 'Male (fixed)'}` : `♀ ${isJa ? 'メス（固定）' : 'Female (fixed)'}`; }
        }
        this.updateModalGenotypeOptions();
        this.updateModalPedigreeFields();
        if (bird) {
            if (form.elements['bird_name']) form.elements['bird_name'].value = bird.name || '';
            if (form.elements['bird_baseColor']) form.elements['bird_baseColor'].value = bird.phenotype?.baseColor || 'green';
            if (form.elements['bird_darkness']) form.elements['bird_darkness'].value = bird.phenotype?.darkness || 'none';
            if (form.elements['bird_eyeColor']) form.elements['bird_eyeColor'].value = bird.phenotype?.eyeColor || 'black';
            const geno = bird.genotype || {};
            // v7.0: SSOT準拠キー + 旧キー後方互換
            ['parblue', 'ino', 'opaline', 'cinnamon', 'dark', 'violet', 'fallow_pale', 'dilute', 'pied_rec'].forEach(key => { const el = form.elements['geno_' + key]; if (el && geno[key]) el.value = geno[key]; });
            // v7.0: 血統フィールドの値を設定
            const ped = bird.pedigree || {};
            ['sire', 'dam', 'sire_sire', 'sire_dam', 'dam_sire', 'dam_dam', 'sire_sire_sire', 'sire_sire_dam', 'sire_dam_sire', 'sire_dam_dam', 'dam_sire_sire', 'dam_sire_dam', 'dam_dam_sire', 'dam_dam_dam'].forEach(key => { const el = form.elements['ped_' + key]; if (el) el.value = ped[key] || ''; });
        } else {
            if (form.elements['bird_name']) form.elements['bird_name'].value = '';
            if (form.elements['bird_baseColor']) form.elements['bird_baseColor'].value = 'green';
            if (form.elements['bird_darkness']) form.elements['bird_darkness'].value = 'none';
            if (form.elements['bird_eyeColor']) form.elements['bird_eyeColor'].value = 'black';
        }
        modal.classList.add('active');
    },

    getDefaultSex(position) {
        if (position === 'sire') return 'male';
        if (position === 'dam') return 'female';
        if (position.endsWith('_sire')) return 'male';
        if (position.endsWith('_dam')) return 'female';
        return 'male';
    },

    createInputModal() {
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const modal = document.createElement('div');
        modal.id = 'birdInputModal';
        modal.className = 'modal';
        const baseColorOptions = this.baseColorOptions;
        const groups = {};
        baseColorOptions.forEach(opt => { if (!groups[opt.group]) groups[opt.group] = []; groups[opt.group].push(opt); });
        let baseColorHTML = '<select name="bird_baseColor" class="form-select">';
        for (const [groupName, opts] of Object.entries(groups)) {
            baseColorHTML += `<optgroup label="${groupName}">`;
            opts.forEach(opt => { baseColorHTML += `<option value="${opt.value}">${opt.label}</option>`; });
            baseColorHTML += '</optgroup>';
        }
        baseColorHTML += '</select>';
        let eyeColorHTML = '<select name="bird_eyeColor" class="form-select">';
        this.eyeColorOptions.forEach(opt => { eyeColorHTML += `<option value="${opt.value}">${opt.label}</option>`; });
        eyeColorHTML += '</select>';
        let darknessHTML = '<select name="bird_darkness" class="form-select">';
        this.darknessOptions.forEach(opt => { darknessHTML += `<option value="${opt.value}">${opt.label}</option>`; });
        darknessHTML += '</select>';
        modal.innerHTML = `<div class="modal-content"><div class="modal-header"><h3>🐦 ${isJa ? '個体情報入力' : 'Bird Information'}</h3><button class="modal-close" onclick="FamilyMap.closeInputModal()">×</button></div>
            <form onsubmit="FamilyMap.saveBirdInput(event)"><div class="form-grid"><div class="form-group" id="sexFieldContainer"><label>${isJa ? '性別' : 'Sex'}</label><select name="bird_sex" class="form-select" onchange="FamilyMap.updateModalGenotypeOptions()"><option value="male">♂ ${isJa ? 'オス' : 'Male'}</option><option value="female">♀ ${isJa ? 'メス' : 'Female'}</option></select><div id="sexDisplayOnly" style="display:none;padding:.5rem;background:var(--bg-secondary);border-radius:4px;font-size:1.1rem;"></div></div>
            <div class="form-group"><label>${isJa ? '名前（任意）' : 'Name (optional)'}</label><input type="text" name="bird_name" class="form-input" placeholder="${isJa ? '例: 太郎' : 'e.g. Taro'}"></div></div>
            <h4 class="section-title">👁️ ${isJa ? '観察情報（表現型）' : 'Observed (Phenotype)'}</h4><div class="form-grid"><div class="form-group"><label>${isJa ? '基本色（観察した羽の色）' : 'Base Color'}</label>${baseColorHTML}</div><div class="form-group"><label>${isJa ? '眼の色' : 'Eye Color'}</label>${eyeColorHTML}</div><div class="form-group"><label>${isJa ? 'ダーク因子（色の濃さ）' : 'Dark Factor'}</label>${darknessHTML}</div></div>
            <h4 class="section-title">🧬 ${isJa ? '遺伝子型（判明している場合）' : 'Genotype (if known)'}</h4><div class="form-grid genotype-grid" id="familyGenotypeFields"></div>
            <details class="pedigree-section"><summary class="section-title clickable">📋 ${isJa ? '血統情報（14枠）' : 'Pedigree (14 slots)'}</summary><div class="pedigree-grid" id="familyPedigreeFields"></div></details>
            <div class="btn-group"><button type="submit" class="btn btn-primary">✓ ${isJa ? '保存' : 'Save'}</button><button type="button" class="btn btn-outline" onclick="FamilyMap.closeInputModal()">${isJa ? 'キャンセル' : 'Cancel'}</button></div></form></div>`;
        return modal;
    },

    updateModalGenotypeOptions() {
        const modal = document.getElementById('birdInputModal');
        if (!modal) return;
        const container = modal.querySelector('#familyGenotypeFields');
        if (!container) return;
        const sex = modal.querySelector('[name="bird_sex"]')?.value || 'male';
        // v7.0: SSOT準拠キー, i18n対応
        const unk = '-- ' + (T.unknown || 'Unknown') + ' --';
        const loci = [
            { key: 'parblue', label: 'Parblue', options: [['', unk], ['++', 'B⁺/B⁺'], ['+aq', 'B⁺/b^aq'], ['+tq', 'B⁺/b^tq'], ['aqaq', 'b^aq/b^aq'], ['tqtq', 'b^tq/b^tq'], ['tqaq', 'b^tq/b^aq']]},
            { key: 'ino', label: 'INO', options: sex === 'male' ? [['', unk], ['++', 'Z⁺/Z⁺'], ['+pld', 'Z⁺/Z^pld'], ['+ino', 'Z⁺/Z^ino'], ['pldpld', 'Z^pld/Z^pld'], ['inoino', 'Z^ino/Z^ino'], ['pldino', 'Z^pld/Z^ino']] : [['', unk], ['+W', 'Z⁺/W'], ['pldW', 'Z^pld/W'], ['inoW', 'Z^ino/W']]},
            { key: 'opaline', label: 'Opaline', options: sex === 'male' ? [['', unk], ['++', 'Z⁺/Z⁺'], ['+op', 'Z⁺/Z^op'], ['opop', 'Z^op/Z^op']] : [['', unk], ['+W', 'Z⁺/W'], ['opW', 'Z^op/W']]},
            { key: 'cinnamon', label: 'Cinnamon', options: sex === 'male' ? [['', unk], ['++', 'Z⁺/Z⁺'], ['+cin', 'Z⁺/Z^cin'], ['cincin', 'Z^cin/Z^cin']] : [['', unk], ['+W', 'Z⁺/W'], ['cinW', 'Z^cin/W']]},
            { key: 'dark', label: 'Dark', options: [['', unk], ['dd', 'd/d'], ['Dd', 'D/d (SF)'], ['DD', 'D/D (DF)']]},
            { key: 'violet', label: 'Violet', options: [['', unk], ['vv', 'v/v'], ['Vv', 'V/v (SF)'], ['VV', 'V/V (DF)']]},
            { key: 'fallow_pale', label: 'Fallow', options: [['', unk], ['++', 'Fl⁺/Fl⁺'], ['+flp', 'Fl⁺/flp'], ['flpflp', 'flp/flp']]},
            { key: 'dilute', label: 'Dilute', options: [['', unk], ['++', 'Dil⁺/Dil⁺'], ['+dil', 'Dil⁺/dil'], ['dildil', 'dil/dil']]},
            { key: 'pied_rec', label: 'Pied', options: [['', unk], ['++', 'Pi⁺/Pi⁺'], ['+pi', 'Pi⁺/pi'], ['pipi', 'pi/pi']]}
        ];
        container.innerHTML = loci.map(locus => `<div class="form-group"><label class="form-label">${locus.label}</label><select name="geno_${locus.key}" class="form-select">${locus.options.map(([val, label]) => `<option value="${val}">${label}</option>`).join('')}</select></div>`).join('');
    },

    /**
     * 血統フィールドを更新（14枠の祖先ID選択）
     */
    updateModalPedigreeFields() {
        const modal = document.getElementById('birdInputModal');
        if (!modal) return;
        const container = modal.querySelector('#familyPedigreeFields');
        if (!container) return;
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');

        // BirdDBから選択肢を生成
        const birds = typeof BirdDB !== 'undefined' ? BirdDB.getAllBirds() : [];
        const none = isJa ? '-- 未設定 --' : '-- None --';

        const makeBirdOption = (b) => {
            const colorLabel = typeof BirdDB !== 'undefined' ? BirdDB.getColorLabel(b.phenotype?.baseColor) : b.phenotype?.baseColor;
            const sexIcon = b.sex === 'male' ? '♂' : '♀';
            return `${b.name || b.id} (${sexIcon} ${colorLabel})`;
        };

        const maleOptions = birds.filter(b => b.sex === 'male');
        const femaleOptions = birds.filter(b => b.sex === 'female');

        const createSelect = (name, options) => {
            let html = `<select name="ped_${name}" class="form-select form-select-sm"><option value="">${none}</option>`;
            options.forEach(b => { html += `<option value="${b.id}">${makeBirdOption(b)}</option>`; });
            html += '</select>';
            return html;
        };

        // 14枠の定義（関係ラベル付き）
        const pedigreeSlots = [
            { key: 'sire', label: isJa ? '父 ♂' : 'Sire ♂', sex: 'male' },
            { key: 'dam', label: isJa ? '母 ♀' : 'Dam ♀', sex: 'female' },
            { key: 'sire_sire', label: isJa ? '父方祖父 ♂' : 'Paternal G.Sire ♂', sex: 'male' },
            { key: 'sire_dam', label: isJa ? '父方祖母 ♀' : 'Paternal G.Dam ♀', sex: 'female' },
            { key: 'dam_sire', label: isJa ? '母方祖父 ♂' : 'Maternal G.Sire ♂', sex: 'male' },
            { key: 'dam_dam', label: isJa ? '母方祖母 ♀' : 'Maternal G.Dam ♀', sex: 'female' },
            { key: 'sire_sire_sire', label: isJa ? '父父父 ♂' : 'Pat. GG.Sire ♂', sex: 'male' },
            { key: 'sire_sire_dam', label: isJa ? '父父母 ♀' : 'Pat. GG.Dam ♀', sex: 'female' },
            { key: 'sire_dam_sire', label: isJa ? '父母父 ♂' : 'Pat. GM.Sire ♂', sex: 'male' },
            { key: 'sire_dam_dam', label: isJa ? '父母母 ♀' : 'Pat. GM.Dam ♀', sex: 'female' },
            { key: 'dam_sire_sire', label: isJa ? '母父父 ♂' : 'Mat. GG.Sire ♂', sex: 'male' },
            { key: 'dam_sire_dam', label: isJa ? '母父母 ♀' : 'Mat. GG.Dam ♀', sex: 'female' },
            { key: 'dam_dam_sire', label: isJa ? '母母父 ♂' : 'Mat. GM.Sire ♂', sex: 'male' },
            { key: 'dam_dam_dam', label: isJa ? '母母母 ♀' : 'Mat. GM.Dam ♀', sex: 'female' },
        ];

        container.innerHTML = pedigreeSlots.map(slot => {
            const options = slot.sex === 'male' ? maleOptions : femaleOptions;
            return `<div class="form-group form-group-sm"><label class="form-label form-label-sm">${slot.label}</label>${createSelect(slot.key, options)}</div>`;
        }).join('');
    },

    closeInputModal() { const modal = document.getElementById('birdInputModal'); if (modal) modal.classList.remove('active'); },

    saveBirdInput(event) {
        event.preventDefault();
        const modal = document.getElementById('birdInputModal');
        const position = modal.dataset.position;
        const form = event.target;
        let sex;
        if (position.startsWith('offspring_')) sex = form.elements['bird_sex'].value;
        else sex = this.getDefaultSex(position);
        const inputName = form.elements['bird_name'].value.trim();
        const genotype = {};
        // v7.0: SSOT準拠キー
        ['parblue', 'ino', 'opaline', 'cinnamon', 'dark', 'violet', 'fallow_pale', 'dilute', 'pied_rec'].forEach(key => { const el = form.elements['geno_' + key]; if (el && el.value) genotype[key] = el.value; });
        const phenotype = { baseColor: form.elements['bird_baseColor'].value, darkness: form.elements['bird_darkness'].value, eyeColor: form.elements['bird_eyeColor'].value };
        const geneticError = this.checkGeneticConsistency(position, phenotype, genotype);
        if (geneticError) { alert(geneticError); return; }
        // v7.0: 血統データを取得（14枠）
        const pedigree = {};
        ['sire', 'dam', 'sire_sire', 'sire_dam', 'dam_sire', 'dam_dam', 'sire_sire_sire', 'sire_sire_dam', 'sire_dam_sire', 'sire_dam_dam', 'dam_sire_sire', 'dam_sire_dam', 'dam_dam_sire', 'dam_dam_dam'].forEach(key => { const el = form.elements['ped_' + key]; pedigree[key] = (el && el.value) ? el.value : null; });
        // v7.0: 血統整合性チェック（遺伝的に不可能な親子関係を検出）
        const pedigreeError = this.checkPedigreeConsistency(phenotype, genotype, pedigree);
        if (pedigreeError) { alert(pedigreeError); return; }
        const bird = { sex: sex, name: inputName, phenotype: phenotype, genotype: genotype, pedigree: pedigree, tentativeGeno: {} };
        if (position === 'sire' || position === 'dam') {
            const otherParent = position === 'sire' ? this.data.dam : this.data.sire;
            if (otherParent) {
                const sire = position === 'sire' ? bird : otherParent;
                const dam = position === 'dam' ? bird : otherParent;
                const validation = this.validateBreeding(sire, dam);
                if (!validation.allowed) {
                    const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
                    if (validation.type === 'absolute') { alert(validation.reason); return; }
                    if (validation.type === 'ethics' && this.familyMode === this.FAMILY_MODES.PLAN) { alert(validation.reason); return; }
                    if (this.familyMode === this.FAMILY_MODES.FACT) {
                        const proceed = confirm(`${validation.reason}\n\n${isJa ? '事実モードでは記録できます。続行しますか？' : 'Recordable in Fact Mode. Continue?'}`);
                        if (!proceed) return;
                    }
                }
            }
        }
        if (position.startsWith('offspring_')) { const idx = parseInt(position.split('_')[1]); if (!this.data.offspring) this.data.offspring = []; this.data.offspring[idx] = bird; }
        else this.data[position] = bird;
        this.closeInputModal();
        this.renderUI();
    },

    addOffspring() {
        if (!this.data.offspring) this.data.offspring = [];
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        if (this.data.offspring.length >= 30) { alert(isJa ? '子供は最大30羽までです' : 'Maximum 30 offspring'); return; }
        this.data.offspring.push({ sex: 'male', name: '', phenotype: {}, tentativeGeno: {} });
        this.renderUI();
        const idx = this.data.offspring.length - 1;
        this.openInputModal(`offspring_${idx}`);
    },

    async removeOffspring(idx) {
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const msg = isJa ? `子${idx + 1}を削除しますか？` : `Delete ${T.child}${idx + 1}?`;
        if (await customConfirm(msg)) {
            this.data.offspring.splice(idx, 1);
            if (this.targetPosition === `offspring_${idx}`) this.targetPosition = null;
            this.renderUI();
        }
    },

    clearSlot(position) {
        if (position.startsWith('offspring_')) this.removeOffspring(parseInt(position.split('_')[1]));
        else { this.data[position] = null; if (this.targetPosition === position) this.targetPosition = null; this.renderUI(); }
    },

    loadFromDB(position) {
        if (typeof BirdDB === 'undefined') { alert(T.health_guardian_missing || 'BirdDB not available'); return; }
        const birds = BirdDB.getAllBirds();
        if (!birds || birds.length === 0) { alert(T.no_birds || 'No birds registered'); return; }
        let expectedSex = null;
        if (position === 'sire' || position.endsWith('_sire')) expectedSex = 'male';
        else if (position === 'dam' || position.endsWith('_dam')) expectedSex = 'female';
        const filtered = expectedSex ? birds.filter(b => b.sex === expectedSex) : birds;
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        if (filtered.length === 0) { alert(isJa ? `該当する${expectedSex === 'male' ? 'オス' : 'メス'}がいません` : `No ${expectedSex} birds found`); return; }
        const overlay = document.createElement('div');
        overlay.className = 'custom-confirm-overlay';
        overlay.id = 'birdSelectOverlay';
        const sexLabel = expectedSex === 'male' ? (isJa ? 'オス' : 'Male') : expectedSex === 'female' ? (isJa ? 'メス' : 'Female') : '';
        overlay.innerHTML = `<div class="custom-confirm-modal" style="width:360px;max-height:80vh;"><div class="custom-confirm-message">${isJa ? `${sexLabel}個体を選択` : `Select ${sexLabel} bird`}</div><div style="max-height:50vh;overflow-y:auto;margin-bottom:1rem;">${filtered.map((b, i) => { const pheno = typeof b.phenotype === 'string' ? b.phenotype : this.getColorLabel(b.observed?.baseColor || b.phenotype?.baseColor) || '?'; return `<div class="custom-select-option" data-index="${i}" style="padding:0.75rem 1rem;border-radius:8px;cursor:pointer;margin-bottom:0.25rem;border:1px solid rgba(255,255,255,0.1);"><strong>${b.name || b.code || b.id}</strong><span style="color:#aaa;margin-left:0.5rem;">- ${pheno}</span></div>`; }).join('')}</div><div class="custom-confirm-buttons"><button type="button" class="btn-confirm-cancel">${isJa ? 'キャンセル' : 'Cancel'}</button></div></div>`;
        document.body.appendChild(overlay);
        const self = this;
        overlay.querySelectorAll('.custom-select-option').forEach(el => {
            el.addEventListener('click', function() {
                const idx = parseInt(this.dataset.index);
                const selected = filtered[idx];
                const birdData = { id: selected.id, dbId: selected.id, name: selected.name || '', sex: selected.sex, phenotype: typeof selected.phenotype === 'string' ? { baseColor: selected.phenotype } : (selected.observed || selected.phenotype || { baseColor: 'green' }), genotype: selected.genotype || {}, pedigree: selected.pedigree || {}, fromDB: true };
                if (position.startsWith('offspring_')) { const offIdx = parseInt(position.split('_')[1]); if (!self.data.offspring) self.data.offspring = []; self.data.offspring[offIdx] = birdData; }
                else self.data[position] = birdData;
                overlay.remove();
                self.renderUI();
            });
            el.addEventListener('mouseenter', function() { this.style.background = 'rgba(0,229,255,0.15)'; this.style.borderColor = '#00e5ff'; });
            el.addEventListener('mouseleave', function() { this.style.background = ''; this.style.borderColor = 'rgba(255,255,255,0.1)'; });
        });
        overlay.querySelector('.btn-confirm-cancel').addEventListener('click', () => { overlay.remove(); });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    },

    async clearAll() {
        if (await customConfirm(T.confirm_clear)) {
            this.data = { name: '', savedAt: null, sire: null, sire_sire: null, sire_dam: null, sire_sire_sire: null, sire_sire_dam: null, sire_dam_sire: null, sire_dam_dam: null, dam: null, dam_sire: null, dam_dam: null, dam_sire_sire: null, dam_sire_dam: null, dam_dam_sire: null, dam_dam_dam: null, offspring: [] };
            this.targetPosition = null;
            this.renderUI();
        }
    },

    /**
     * v7.0: 家系図決定 - 全体の遺伝整合性をチェックして確定
     */
    finalizeFamilyMap() {
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const sire = this.data.sire;
        const dam = this.data.dam;

        // 両親が揃っているか確認
        if (!sire || !dam) {
            alert(isJa ? '❌ 父と母の両方を配置してください' : '❌ Please place both sire and dam');
            return;
        }

        // 子がいるか確認
        const offspring = (this.data.offspring || []).filter(c => c && c.phenotype);
        if (offspring.length === 0) {
            alert(isJa ? '❌ 少なくとも1羽の子を配置してください' : '❌ Please place at least one offspring');
            return;
        }

        // 親の遺伝情報を取得
        const getParblue = (bird) => {
            if (bird.genotype?.parblue) return bird.genotype.parblue;
            const c = bird.phenotype?.baseColor || 'green';
            if (['aqua', 'aqua_dark', 'aqua_olive', 'creamino'].includes(c)) return 'aqaq';
            if (['turquoise', 'turquoise_dark', 'turquoise_olive', 'pure_white'].includes(c)) return 'tqtq';
            if (['seagreen', 'seagreen_dark', 'seagreen_olive', 'creamino_seagreen'].includes(c)) return 'tqaq';
            return '++';
        };

        const getIno = (bird, sex) => {
            if (bird.genotype?.ino) return bird.genotype.ino;
            const c = bird.phenotype?.baseColor || 'green';
            if (['lutino', 'creamino', 'pure_white', 'creamino_seagreen'].includes(c))
                return sex === 'female' ? 'inoW' : 'inoino';
            if (c.includes('pallid')) return sex === 'female' ? 'pldW' : 'pldpld';
            return sex === 'female' ? '+W' : '++';
        };

        const fParblue = getParblue(sire), mParblue = getParblue(dam);
        const fIno = getIno(sire, 'male');
        const possibleParblue = this.getPossibleParblueAlleles(fParblue, mParblue);

        // 全ての子の整合性をチェック
        const errors = [];
        offspring.forEach((child, idx) => {
            const childC = child.phenotype?.baseColor || 'green';
            const childParblue = child.genotype?.parblue || getParblue(child);
            const childName = child.name || `${isJa ? '子' : 'Child'}${idx + 1}`;

            // パーブルー系チェック
            if (childParblue === 'aqaq' && !possibleParblue.includes('aqaq') && !possibleParblue.includes('+aq')) {
                errors.push(`${childName}: ${isJa ? 'アクア系は生まれません' : 'Aqua cannot be produced'}`);
            }
            if (childParblue === 'tqtq' && !possibleParblue.includes('tqtq') && !possibleParblue.includes('+tq')) {
                errors.push(`${childName}: ${isJa ? 'ターコイズ系は生まれません' : 'Turquoise cannot be produced'}`);
            }
            if (childParblue === '++' && !possibleParblue.includes('++') && !possibleParblue.includes('+aq') && !possibleParblue.includes('+tq')) {
                errors.push(`${childName}: ${isJa ? 'グリーン系は生まれません' : 'Green cannot be produced'}`);
            }

            // INO系チェック
            const childIsIno = ['lutino', 'creamino', 'pure_white', 'creamino_seagreen'].includes(childC);
            if (childIsIno && !fIno.includes('ino')) {
                errors.push(`${childName}: ${isJa ? 'INO系は父がino持ちでないと生まれません' : 'INO requires father to carry ino gene'}`);
            }
        });

        // エラーがあれば拒否
        if (errors.length > 0) {
            alert(`❌ ${isJa ? 'この家系図は成立しません' : 'This pedigree is invalid'}:\n\n${errors.join('\n')}`);
            return;
        }

        // 整合性OK: 各子のpedigreeを設定
        const sireId = sire.dbId || sire.id || null;
        const damId = dam.dbId || dam.id || null;

        this.data.offspring.forEach(child => {
            if (!child) return;
            child.pedigree = child.pedigree || {};
            child.pedigree.sire = sireId;
            child.pedigree.dam = damId;
            // 祖父母以降も設定（親のpedigreeから継承）
            if (sire.pedigree) {
                child.pedigree.sire_sire = sire.pedigree.sire || null;
                child.pedigree.sire_dam = sire.pedigree.dam || null;
                child.pedigree.sire_sire_sire = sire.pedigree.sire_sire || null;
                child.pedigree.sire_sire_dam = sire.pedigree.sire_dam || null;
                child.pedigree.sire_dam_sire = sire.pedigree.dam_sire || null;
                child.pedigree.sire_dam_dam = sire.pedigree.dam_dam || null;
            }
            if (dam.pedigree) {
                child.pedigree.dam_sire = dam.pedigree.sire || null;
                child.pedigree.dam_dam = dam.pedigree.dam || null;
                child.pedigree.dam_sire_sire = dam.pedigree.sire_sire || null;
                child.pedigree.dam_sire_dam = dam.pedigree.sire_dam || null;
                child.pedigree.dam_dam_sire = dam.pedigree.dam_sire || null;
                child.pedigree.dam_dam_dam = dam.pedigree.dam_dam || null;
            }
        });

        // 成功メッセージ
        const msg = isJa
            ? `✅ 家系図が確定しました\n\n${offspring.length}羽の子に血統情報を設定しました`
            : `✅ Pedigree finalized\n\nPedigree set for ${offspring.length} offspring`;
        alert(msg);
        this.renderUI();
    },

    getPositionLabel(position) {
        const labels = { 'sire': T.sire, 'dam': T.dam, 'sire_sire': T.paternal_gf, 'sire_dam': T.paternal_gm, 'dam_sire': T.maternal_gf, 'dam_dam': T.maternal_gm };
        if (position.startsWith('offspring_')) return `${T.child}${parseInt(position.split('_')[1]) + 1}`;
        return labels[position] || position;
    },

    getPositionLabelDetailed(position) {
        const bird = position.startsWith('offspring_') ? this.data.offspring[parseInt(position.split('_')[1])] : this.data[position];
        const posLabel = this.getPositionLabel(position);
        if (!bird) return posLabel;
        let detail = posLabel;
        if (bird.name) detail += ` (${bird.name})`;
        if (bird.dbId) detail += ` #${bird.dbId}`;
        return detail;
    },

    async runInference() {
        if (!this.canUseGeneticEstimation()) { const isJa = (typeof LANG !== 'undefined' && LANG === 'ja'); alert(isJa ? '事実モードでは遺伝推定は利用できません' : 'Genetic estimation is not available in Fact Mode'); return; }
        if (!this.targetPosition) { alert(T.select_target); return; }
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const inferData = { target: this.targetPosition, birds: this.collectBirdsForInference() };
        if (inferData.birds.length < 2) { alert(isJa ? '推論には対象と最低1羽の親または子の情報が必要です' : 'At least the target and one parent or child is required'); return; }
        const resultEl = document.getElementById('inferenceResult');
        resultEl.innerHTML = `<div class="loading">🔬 ${T.inferring}...</div>`;
        try {
            localStorage.setItem('familyMapBeforeInfer', JSON.stringify({ data: this.data, targetPosition: this.targetPosition, demoMode: this.demoMode, familyMode: this.familyMode }));
            const response = await fetch('infer.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inferData) });
            const result = await response.json();
            if (result.success) this.displayInferenceResult(result);
            else resultEl.innerHTML = `<div class="error">❌ ${result.error || T.inference_error}</div>`;
        } catch (e) { resultEl.innerHTML = `<div class="error">❌ ${T.inference_error}: ${e.message}</div>`; }
    },

    collectBirdsForInference() {
        const birds = [];
        const positions = ['sire', 'dam', 'sire_sire', 'sire_dam', 'dam_sire', 'dam_dam', 'sire_sire_sire', 'sire_sire_dam', 'sire_dam_sire', 'sire_dam_dam', 'dam_sire_sire', 'dam_sire_dam', 'dam_dam_sire', 'dam_dam_dam'];
        positions.forEach(pos => { if (this.data[pos]) birds.push({ position: pos, ...this.data[pos] }); });
        (this.data.offspring || []).forEach((bird, idx) => { if (bird) birds.push({ position: `offspring_${idx}`, ...bird }); });
        return birds;
    },

    displayInferenceResult(result) {
        const resultEl = document.getElementById('inferenceResult');
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        let html = `<div class="inference-success"><h3>🔬 ${isJa ? '推論結果' : 'Inference Result'}</h3><div class="target-info"><strong>${isJa ? '対象' : 'Target'}:</strong> ${this.getPositionLabelDetailed(this.targetPosition)}</div>`;
        if (result.possibleGenotypes && result.possibleGenotypes.length > 0) {
            html += `<h4>${isJa ? '可能な遺伝子型' : 'Possible Genotypes'}</h4><ul>`;
            result.possibleGenotypes.forEach(g => { html += `<li>${this.formatGenotype(g.genotype)} <span class="prob">(${(g.probability * 100).toFixed(1)}%)</span></li>`; });
            html += '</ul>';
        }
        if (result.confirmedAlleles) html += `<h4>${isJa ? '確定アレル' : 'Confirmed Alleles'}</h4><div class="confirmed">${this.formatConfirmedAlleles(result.confirmedAlleles)}</div>`;
        html += '</div>';
        resultEl.innerHTML = html;
    },

    formatGenotype(geno) { return Object.entries(geno).map(([locus, alleles]) => `${locus}: ${alleles}`).join(', '); },
    formatConfirmedAlleles(alleles) { return Object.entries(alleles).map(([locus, val]) => `<span class="allele">${locus}=${val}</span>`).join(' '); },

    async saveSnapshot() {
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const name = await customPrompt(isJa ? 'スナップショット名を入力:' : 'Enter snapshot name:');
        if (!name) return;
        const snapshot = { name: name, savedAt: new Date().toISOString(), ...this.data, targetPosition: this.targetPosition, familyMode: this.familyMode };
        const maps = JSON.parse(localStorage.getItem('familyMaps') || '[]');
        maps.push(snapshot);
        localStorage.setItem('familyMaps', JSON.stringify(maps));
        alert(isJa ? '保存しました' : 'Saved!');
        this.loadSavedMaps();
    },

    showLoadModal() {
        const maps = JSON.parse(localStorage.getItem('familyMaps') || '[]');
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        if (maps.length === 0) { alert(isJa ? '保存されたマップがありません' : 'No saved maps'); return; }
        const options = maps.map((m, i) => { const date = m.savedAt ? new Date(m.savedAt).toLocaleString() : ''; return { label: `${m.name || '(無題)'} - ${date}`, value: i }; });
        customSelect(isJa ? '読み込むマップを選択:' : 'Select map to load:', options).then(idx => { if (idx !== null) this.loadSnapshot(idx); });
    },

    loadSnapshot(idx) {
        const maps = JSON.parse(localStorage.getItem('familyMaps') || '[]');
        const snapshot = maps[idx];
        if (!snapshot) return;
        this.data = { name: snapshot.name || '', savedAt: snapshot.savedAt, sire: snapshot.sire, sire_sire: snapshot.sire_sire, sire_dam: snapshot.sire_dam, sire_sire_sire: snapshot.sire_sire_sire, sire_sire_dam: snapshot.sire_sire_dam, sire_dam_sire: snapshot.sire_dam_sire, sire_dam_dam: snapshot.sire_dam_dam, dam: snapshot.dam, dam_sire: snapshot.dam_sire, dam_dam: snapshot.dam_dam, dam_sire_sire: snapshot.dam_sire_sire, dam_sire_dam: snapshot.dam_sire_dam, dam_dam_sire: snapshot.dam_dam_sire, dam_dam_dam: snapshot.dam_dam_dam, offspring: snapshot.offspring || [] };
        this.targetPosition = snapshot.targetPosition || null;
        this.familyMode = snapshot.familyMode || 'plan';
        this.renderUI();
    },

    loadSavedMaps() {},

    exportJSON() {
        const json = JSON.stringify({ ...this.data, familyMode: this.familyMode }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `family_map_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    checkCircularReference(position, dbId) {
        if (!dbId) return null;
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const getDescendantPositions = (pos) => {
            const map = { 'sire_sire_sire': ['sire_sire', 'sire', 'offspring'], 'sire_sire_dam': ['sire_sire', 'sire', 'offspring'], 'sire_dam_sire': ['sire_dam', 'sire', 'offspring'], 'sire_dam_dam': ['sire_dam', 'sire', 'offspring'], 'dam_sire_sire': ['dam_sire', 'dam', 'offspring'], 'dam_sire_dam': ['dam_sire', 'dam', 'offspring'], 'dam_dam_sire': ['dam_dam', 'dam', 'offspring'], 'dam_dam_dam': ['dam_dam', 'dam', 'offspring'], 'sire_sire': ['sire', 'offspring'], 'sire_dam': ['sire', 'offspring'], 'dam_sire': ['dam', 'offspring'], 'dam_dam': ['dam', 'offspring'], 'sire': ['offspring'], 'dam': ['offspring'] };
            return map[pos] || [];
        };
        const descendantPositions = getDescendantPositions(position);
        for (const descPos of descendantPositions) {
            if (descPos === 'offspring') { for (const child of (this.data.offspring || [])) { if (child?.dbId === dbId) return isJa ? 'この個体は既に子孫として登録されています' : 'This bird is already registered as a descendant'; } }
            else { if (this.data[descPos]?.dbId === dbId) return isJa ? `この個体は既に${this.getPositionLabel(descPos)}として登録されています` : `This bird is already registered as ${this.getPositionLabel(descPos)}`; }
        }
        return null;
    },

    getColorLabel(colorCode) {
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const colorMap = { 'green': isJa ? 'グリーン' : 'Green', 'darkgreen': isJa ? 'ダークグリーン' : 'Dark Green', 'olive': isJa ? 'オリーブ' : 'Olive', 'aqua': isJa ? 'アクア' : 'Aqua', 'aqua_dark': isJa ? 'アクアダーク' : 'Aqua Dark', 'aqua_dd': isJa ? 'アクアDD' : 'Aqua DD', 'turquoise': isJa ? 'ターコイズ' : 'Turquoise', 'turquoise_dark': isJa ? 'ターコイズダーク' : 'Turquoise Dark', 'seagreen': isJa ? 'シーグリーン' : 'Sea Green', 'seagreen_dark': isJa ? 'シーグリーンダーク' : 'Sea Green Dark', 'lutino': isJa ? 'ルチノー' : 'Lutino', 'creamino': isJa ? 'クリーミノ' : 'Creamino', 'pure_white': isJa ? 'ピュアホワイト' : 'Pure White', 'creamino_seagreen': isJa ? 'クリーミノシーグリーン' : 'Creamino Sea Green', 'pallid_green': isJa ? 'パリッドグリーン' : 'Pallid Green', 'pallid_aqua': isJa ? 'パリッドアクア' : 'Pallid Aqua', 'pallid_turquoise': isJa ? 'パリッドターコイズ' : 'Pallid Turquoise', 'pallid_seagreen': isJa ? 'パリッドシーグリーン' : 'Pallid Sea Green', 'cinnamon_green': isJa ? 'シナモングリーン' : 'Cinnamon Green', 'cinnamon_aqua': isJa ? 'シナモンアクア' : 'Cinnamon Aqua', 'cinnamon_turquoise': isJa ? 'シナモンターコイズ' : 'Cinnamon Turquoise', 'cinnamon_seagreen': isJa ? 'シナモンシーグリーン' : 'Cinnamon Sea Green', 'opaline_green': isJa ? 'オパーリングリーン' : 'Opaline Green', 'opaline_aqua': isJa ? 'オパーリンアクア' : 'Opaline Aqua', 'opaline_turquoise': isJa ? 'オパーリンターコイズ' : 'Opaline Turquoise', 'opaline_seagreen': isJa ? 'オパーリンシーグリーン' : 'Opaline Sea Green', 'fallow_green': isJa ? 'フォローグリーン' : 'Fallow Green', 'fallow_aqua': isJa ? 'フォローアクア' : 'Fallow Aqua', 'pied_green': isJa ? 'パイドグリーン' : 'Pied Green', 'pied_aqua': isJa ? 'パイドアクア' : 'Pied Aqua', 'pied_turquoise': isJa ? 'パイドターコイズ' : 'Pied Turquoise', 'pied_seagreen': isJa ? 'パイドシーグリーン' : 'Pied Sea Green', 'blue': isJa ? 'アクア（旧:ブルー）' : 'Aqua (legacy: Blue)', 'cobalt': isJa ? 'アクアダーク（旧:コバルト）' : 'Aqua Dark (legacy: Cobalt)', 'mauve': isJa ? 'アクアDD（旧:モーブ）' : 'Aqua DD (legacy: Mauve)', 'albino': isJa ? 'ピュアホワイト（旧:アルビノ）' : 'Pure White (legacy: Albino)', 'pallid_blue': isJa ? 'パリッドアクア（旧:パリッドブルー）' : 'Pallid Aqua (legacy: Pallid Blue)', 'cinnamon_blue': isJa ? 'シナモンアクア（旧:シナモンブルー）' : 'Cinnamon Aqua (legacy: Cinnamon Blue)', 'opaline_blue': isJa ? 'オパーリンアクア（旧:オパーリンブルー）' : 'Opaline Aqua (legacy: Opaline Blue)', 'fallow_blue': isJa ? 'フォローアクア（旧:フォローブルー）' : 'Fallow Aqua (legacy: Fallow Blue)', 'pied_blue': isJa ? 'パイドアクア（旧:パイドブルー）' : 'Pied Aqua (legacy: Pied Blue)' };
        return colorMap[colorCode] || colorCode;
    },

    formatGenotypeShort(geno) {
        if (!geno || typeof geno !== 'object') return '';
        // v7.0: SSOT準拠キー + 旧キー後方互換
        const parts = [];
        if (geno.parblue && geno.parblue !== '++') parts.push(`pb:${geno.parblue}`);
        if (geno.ino && geno.ino !== '++' && geno.ino !== '+W') parts.push(`ino:${geno.ino}`);
        if (geno.dark && geno.dark !== 'dd') parts.push(`D:${geno.dark}`);
        const vio = geno.violet || geno.vio;
        if (vio && vio !== 'vv') parts.push(`vi:${vio}`);
        const op = geno.opaline || geno.op;
        if (op && op !== '++' && op !== '+W') parts.push(`op:${op}`);
        const cin = geno.cinnamon || geno.cin;
        if (cin && cin !== '++' && cin !== '+W') parts.push(`cin:${cin}`);
        const fl = geno.fallow_pale || geno.fl;
        if (fl && fl !== '++') parts.push(`fl:${fl}`);
        const dil = geno.dilute || geno.dil;
        if (dil && dil !== '++') parts.push(`dil:${dil}`);
        const pi = geno.pied_rec || geno.pi;
        if (pi && pi !== '++') parts.push(`pi:${pi}`);
        return parts.join(' ');
    },

    checkGeneticConsistency(position, phenotype, genotype = {}) {
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        const parentPositions = { 'sire_sire': ['sire_sire_sire', 'sire_sire_dam'], 'sire_dam': ['sire_dam_sire', 'sire_dam_dam'], 'dam_sire': ['dam_sire_sire', 'dam_sire_dam'], 'dam_dam': ['dam_dam_sire', 'dam_dam_dam'], 'sire': ['sire_sire', 'sire_dam'], 'dam': ['dam_sire', 'dam_dam'] };
        let parents;
        if (position.startsWith('offspring_')) parents = [this.data.sire, this.data.dam];
        else if (parentPositions[position]) { const [fatherPos, motherPos] = parentPositions[position]; parents = [this.data[fatherPos], this.data[motherPos]]; }
        else return null;
        if (!parents[0] || !parents[1]) return null;
        const father = parents[0], mother = parents[1];
        const getParblue = (bird) => { if (bird.genotype?.parblue) return bird.genotype.parblue; if (bird.tentativeGeno?.parblue) return bird.tentativeGeno.parblue; const c = bird.phenotype?.baseColor || 'green'; if (['aqua', 'aqua_dark', 'aqua_dd', 'blue', 'cobalt', 'mauve', 'pure_white', 'albino', 'creamino'].includes(c)) return 'aqaq'; if (['turquoise', 'turquoise_dark'].includes(c)) return 'tqtq'; if (['seagreen', 'seagreen_dark', 'creamino_seagreen'].includes(c)) return 'tqaq'; return '++'; };
        const getIno = (bird, sex) => { if (bird.genotype?.ino) return bird.genotype.ino; if (bird.tentativeGeno?.ino) return bird.tentativeGeno.ino; const c = bird.phenotype?.baseColor || 'green'; const eye = bird.phenotype?.eyeColor || 'black'; if (['lutino', 'creamino', 'pure_white', 'creamino_seagreen', 'albino'].includes(c) || eye === 'red') return sex === 'female' ? 'inoW' : 'inoino'; if (c.includes('pallid')) return sex === 'female' ? 'pldW' : 'pldpld'; return sex === 'female' ? '+W' : '++'; };
        const fParblue = getParblue(father), mParblue = getParblue(mother);
        const fIno = getIno(father, 'male'), mIno = getIno(mother, 'female');
        const childParblue = genotype?.parblue || getParblue({ phenotype, genotype });
        const childSex = position.startsWith('offspring_') ? (this.data.offspring?.[parseInt(position.split('_')[1])]?.sex || 'male') : this.getDefaultSex(position);
        const childIno = genotype?.ino || getIno({ phenotype, genotype }, childSex);
        const possibleChildParblue = this.getPossibleParblueAlleles(fParblue, mParblue);
        if (childParblue === 'aqaq' && !possibleChildParblue.includes('aqaq')) return isJa ? '前世代の構成からはアクア系（aqaq）は生まれません' : 'Aqua (aqaq) cannot be produced from this parent combination';
        if (childParblue === '++' && !possibleChildParblue.includes('++')) return isJa ? '前世代の構成からはグリーン系（++）は生まれません' : 'Green (++) cannot be produced from this parent combination';
        if (childSex === 'male' && childIno === 'inoino') { const fatherHasIno = fIno.includes('ino'), motherIsIno = mIno === 'inoW'; if (!fatherHasIno || !motherIsIno) return isJa ? '前世代の構成からはオスのルチノー/クリーミノ/ピュアホワイトは生まれません（父がino持ち＋母がino発現必須）' : 'Male Lutino/Creamino/Pure White cannot be produced'; }
        if (childSex === 'female' && childIno === 'inoW') { const fatherHasIno = fIno.includes('ino'); if (!fatherHasIno) return isJa ? '前世代の構成からはメスのルチノー/クリーミノ/ピュアホワイトは生まれません（父がino持ち必須）' : 'Female Lutino/Creamino/Pure White cannot be produced'; }
        return null;
    },

    getPossibleParblueAlleles(fatherParblue, motherParblue) {
        const getAlleles = (geno) => { if (geno === '++') return ['+', '+']; if (geno === '+aq') return ['+', 'aq']; if (geno === 'aqaq') return ['aq', 'aq']; if (geno === '+tq') return ['+', 'tq']; if (geno === 'tqtq') return ['tq', 'tq']; if (geno === 'tqaq') return ['tq', 'aq']; return ['+', '+']; };
        const fAlleles = getAlleles(fatherParblue), mAlleles = getAlleles(motherParblue);
        const results = new Set();
        for (const fa of fAlleles) { for (const ma of mAlleles) { const pair = [fa, ma].sort().join(''); if (pair === '++') results.add('++'); else if (pair === '+aq') results.add('+aq'); else if (pair === 'aqaq') results.add('aqaq'); else if (pair === '+tq') results.add('+tq'); else if (pair === 'aqtq') results.add('tqaq'); else if (pair === 'tqtq') results.add('tqtq'); } }
        return Array.from(results);
    },

    /**
     * v7.0: 血統整合性チェック
     * 親子関係が遺伝的に可能かどうかを検証
     */
    checkPedigreeConsistency(childPhenotype, childGenotype, pedigree) {
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        if (typeof BirdDB === 'undefined') return null;

        const sireId = pedigree.sire;
        const damId = pedigree.dam;
        if (!sireId && !damId) return null; // 親が未設定なら検証不要

        const sire = sireId ? BirdDB.getBird(sireId) : null;
        const dam = damId ? BirdDB.getBird(damId) : null;

        // 両親が揃っている場合のみ遺伝整合性をチェック
        if (sire && dam) {
            const getParblue = (bird) => {
                if (bird.genotype?.parblue) return bird.genotype.parblue;
                const c = bird.phenotype?.baseColor || 'green';
                if (['aqua', 'aqua_dark', 'aqua_olive', 'creamino'].includes(c)) return 'aqaq';
                if (['turquoise', 'turquoise_dark', 'turquoise_olive', 'pure_white'].includes(c)) return 'tqtq';
                if (['seagreen', 'seagreen_dark', 'seagreen_olive', 'creamino_seagreen'].includes(c)) return 'tqaq';
                return '++';
            };

            const getIno = (bird, sex) => {
                if (bird.genotype?.ino) return bird.genotype.ino;
                const c = bird.phenotype?.baseColor || 'green';
                if (['lutino', 'creamino', 'pure_white', 'creamino_seagreen'].includes(c))
                    return sex === 'female' ? 'inoW' : 'inoino';
                if (c.includes('pallid')) return sex === 'female' ? 'pldW' : 'pldpld';
                return sex === 'female' ? '+W' : '++';
            };

            const fParblue = getParblue(sire), mParblue = getParblue(dam);
            const childParblue = childGenotype?.parblue || getParblue({ phenotype: childPhenotype });
            const possibleParblue = this.getPossibleParblueAlleles(fParblue, mParblue);

            // パーブルー系の整合性チェック
            if (childParblue === 'aqaq' && !possibleParblue.includes('aqaq') && !possibleParblue.includes('+aq')) {
                return isJa ? '⚠️ この親の組み合わせからアクア系（aqaq）は生まれません。血統を確認してください。'
                           : '⚠️ Aqua (aqaq) cannot be produced from this parent combination. Please check pedigree.';
            }
            if (childParblue === 'tqtq' && !possibleParblue.includes('tqtq') && !possibleParblue.includes('+tq')) {
                return isJa ? '⚠️ この親の組み合わせからターコイズ系（tqtq）は生まれません。血統を確認してください。'
                           : '⚠️ Turquoise (tqtq) cannot be produced from this parent combination. Please check pedigree.';
            }
            if (childParblue === '++' && !possibleParblue.includes('++') && !possibleParblue.includes('+aq') && !possibleParblue.includes('+tq')) {
                return isJa ? '⚠️ この親の組み合わせからグリーン系（++）は生まれません。血統を確認してください。'
                           : '⚠️ Green (++) cannot be produced from this parent combination. Please check pedigree.';
            }

            // INO系の整合性チェック（伴性遺伝）
            const fIno = getIno(sire, 'male'), mIno = getIno(dam, 'female');
            const childC = childPhenotype?.baseColor || 'green';
            const childIsIno = ['lutino', 'creamino', 'pure_white', 'creamino_seagreen'].includes(childC);

            if (childIsIno) {
                const fatherHasIno = fIno.includes('ino');
                if (!fatherHasIno) {
                    return isJa ? '⚠️ INO系（ルチノー等）の子が生まれるには父がino遺伝子を持っている必要があります。血統を確認してください。'
                               : '⚠️ INO offspring requires father to carry ino gene. Please check pedigree.';
                }
            }
        }

        return null;
    },

    analyzeInbreeding() {
        const ancestorPositions = ['sire_sire_sire', 'sire_sire_dam', 'sire_dam_sire', 'sire_dam_dam', 'dam_sire_sire', 'dam_sire_dam', 'dam_dam_sire', 'dam_dam_dam'];
        const idOccurrences = {};
        ancestorPositions.forEach(pos => { const id = this.data[pos]?.dbId; if (id) { if (!idOccurrences[id]) idOccurrences[id] = []; idOccurrences[id].push(pos); } });
        const gpPositions = ['sire_sire', 'sire_dam', 'dam_sire', 'dam_dam'];
        gpPositions.forEach(pos => { const id = this.data[pos]?.dbId; if (id) { if (!idOccurrences[id]) idOccurrences[id] = []; idOccurrences[id].push(pos); } });
        const crossings = [];
        for (const [id, positions] of Object.entries(idOccurrences)) {
            if (positions.length > 1) {
                const bird = this.data[positions[0]];
                const name = bird?.name || `#${id}`;
                const fatherSide = positions.filter(p => p.startsWith('sire_'));
                const motherSide = positions.filter(p => p.startsWith('dam_'));
                if (fatherSide.length > 0 && motherSide.length > 0) crossings.push({ id, name, positions, type: 'cross', severity: positions.length });
            }
        }
        let inbreedingCoef = 0;
        crossings.forEach(c => { const n = c.positions[0].split('_').length; inbreedingCoef += Math.pow(0.5, 2 * n + 1) * (c.severity - 1); });
        this.displayInbreedingAnalysis(crossings, inbreedingCoef);
    },

    displayInbreedingAnalysis(crossings, coef) {
        const warningEl = document.getElementById('inbreedingWarning');
        if (!warningEl) return;
        if (crossings.length === 0) { warningEl.innerHTML = ''; warningEl.style.display = 'none'; return; }
        const isJa = (typeof LANG !== 'undefined' && LANG === 'ja');
        let riskLevel, riskLabel, riskClass;
        if (coef >= 0.25) { riskLevel = 'critical'; riskLabel = isJa ? '🚫 危険な配合です。生存率低下は不可避です。' : '🚫 Dangerous. Survival rate decline is inevitable.'; riskClass = 'risk-critical'; }
        else if (coef >= 0.125) { riskLevel = 'high'; riskLabel = isJa ? '⚠️ 競走馬では禁忌とされる配合です' : '⚠️ Prohibited in thoroughbred breeding'; riskClass = 'risk-high'; }
        else if (coef >= 0.0625) { riskLevel = 'moderate'; riskLabel = isJa ? '⚡ 注意が必要です' : '⚡ Caution required'; riskClass = 'risk-moderate'; }
        else { riskLevel = 'low'; riskLabel = isJa ? '💡 低リスク' : '💡 Low risk'; riskClass = 'risk-low'; }
        let modeNote = '';
        if (this.familyMode === this.FAMILY_MODES.FACT) modeNote = `<div class="mode-note">${isJa ? '※事実モード: 記録可能ですが遺伝推定は利用できません' : '※Fact Mode: Recordable but no inference'}</div>`;
        else if (coef >= 0.125) modeNote = `<div class="mode-note">${isJa ? '※倫理計画モード: この配合は許可されません' : '※Plan Mode: This breeding is not allowed'}</div>`;
        let html = `<div class="inbreeding-alert ${riskClass}"><h4>🧬 ${isJa ? '近交分析' : 'Inbreeding Analysis'}</h4><div class="coef">${isJa ? '近交係数' : 'Inbreeding Coefficient'} F = ${(coef * 100).toFixed(2)}%</div><div class="risk">${riskLabel}</div>${modeNote}<div class="crossings"><strong>${isJa ? '共通祖先' : 'Common Ancestors'}:</strong><ul>${crossings.map(c => `<li>${c.name} ${isJa ? 'が' : 'appears in'} ${c.positions.map(p => this.getPositionLabel(p)).join('、')}</li>`).join('')}</ul></div></div>`;
        warningEl.innerHTML = html;
        warningEl.style.display = 'block';
    },

    registerToDB() {
        const modal = document.getElementById('birdInputModal');
        const form = modal.querySelector('form');
        if (typeof BirdDB === 'undefined') { alert('個体DBが読み込まれていません'); return; }
        const bird = { name: form.elements['bird_name'].value || `個体_${Date.now()}`, sex: form.elements['bird_sex'].value, phenotype: form.elements['bird_baseColor'].value };
        BirdDB.addBird(bird);
        alert(`「${bird.name}」をDBに登録しました`);
    },

    bindEvents() {}
};

document.addEventListener('DOMContentLoaded', () => { if (document.getElementById('familyMapContainer')) FamilyMap.init(); });
