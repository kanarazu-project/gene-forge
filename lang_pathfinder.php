<?php
/**
 * PathFinder 翻訳キー
 * Gene-Forge v6.8.2
 * 
 * 対応言語: ja, en, de, fr, it, es
 * 
 * 使用方法:
 * lang.php の末尾で require_once して array_merge
 */

// ============================================================
// 日本語 (Japanese)
// ============================================================
$pf_ja = [
    // ステップタイトル
    'pf_wild_type' => '野生型',
    'pf_wild_type_result' => '基本色は追加因子不要',
    'pf_introduce_slr' => '{locus_name}因子の導入',
    'pf_introduce_ar' => '{locus_name}因子の導入（世代{gen}）',
    'pf_introduce_dominant' => '{locus_name}因子の導入',
    
    // 親の説明
    'pf_expressed_female' => '発現メス',
    
    // 結果説明
    'pf_slr_result' => '♂子は100%スプリット、♀子は50%発現',
    'pf_ar_result' => '子は100%スプリット → 兄妹交配で25%発現',
    'pf_dominant_result' => '子の50%が{locus_name}因子を持つ',
    
    // 警告
    'pf_warning_ino' => '⚠️ INO/パリッド系は近親交配2世代制限があります',
    'pf_warning_fallow' => '⚠️ ファロー系は健康リスクに注意してください',
    'pf_warning_complex' => '⚠️ 複合形質（Tier {tier}）：複数世代が必要です',
    
    // エラー
    'pf_unsupported_target' => '未対応の目標形質です: {target}',
    
    // その他
    'pf_estimated_gen' => '推定世代数',

    // ============================================================
    // BreedingPlanner 翻訳キー
    // ============================================================
    'bp_production_plan' => '生産計画',
    'bp_recommended_top5' => '推奨ペアリング TOP5',
    'bp_probability' => '確率',
    'bp_f_value' => '近交係数',
    'bp_estimated' => '推定',
    'bp_same_sire_warning' => '全ペアリングが同じオスを使用。子同士は半兄弟婚（F=12.5%）になります。新しい血統の導入を検討してください。',
    'bp_low_contribution' => '目標への寄与度が低い',
    'bp_optimal_pair' => '最適ペア',
    'bp_possible' => '可能',
    'bp_breeding_prohibited' => '交配禁止',
    'bp_ethics_warning' => '競走馬では禁忌とされる配合',
    'bp_ethics_standard' => '倫理基準',
    'bp_ethics_description' => '近交係数12.5%以上のペアは除外（競走馬ルール）',
    'bp_filtered_note' => '近交係数12.5%以上のペアは倫理基準により除外されています',
    'bp_select_target' => '目標形質を選択してください',
    'bp_unsupported_target' => '未対応の目標形質です',
    'bp_no_birds' => '登録された個体がありません',
    'bp_register_hint' => '個体管理タブで個体を登録してください',
    'bp_need_both_sex' => '♂と♀の両方が必要です',
    'bp_current_count' => '現在: ♂{m}羽、♀{f}羽',
    'bp_no_ethical_pairs' => '倫理基準を満たすペアがありません',
    'bp_introduce_new_blood' => '近交係数12.5%未満のペアがありません。無関係な血統を導入してください。',
    'bp_no_viable_pairs' => '目標形質を生産できるペアがありません',
    'bp_need_carriers' => '目標に必要な遺伝子を持つ個体を登録してください。',
    'bp_no_breedable_pair' => '交配可能なペアがありません',
    'bp_introduce_healthy' => '健康リスクの低い個体を導入してください',
    'bp_goal_produce' => '{name}を生産',
    'bp_female_hemizygous' => 'メスは相の概念なし',
    'bp_linkage_not_needed' => '連鎖考慮不要',
    'bp_phase_cis' => 'Cis配置（効率的）',
    'bp_phase_trans' => 'Trans配置（非効率）',
    'bp_phase_unknown' => '相不明',
    'bp_phase_cis_inferred' => '複数発現 → Cis推定',
    'bp_phase_no_info' => '相情報なし',
    'bp_autosomal_cis' => 'Dark+Parblue Cis配置',
    'bp_male_cis_efficient' => 'オスがCis配置 → 効率的',
    'bp_male_trans_inefficient' => 'オスがTrans配置 → 非効率（Cis個体推奨）',
    'bp_male_phase_unknown' => 'オスの相不明 → テスト交配で確認推奨',

    // v7.1: 多世代計画キー
    'bp_gene_analysis' => '遺伝子分析',
    'bp_generations_needed' => '必要世代数',
    'bp_missing_genes' => '不足遺伝子',
    'bp_hetero_only' => 'ヘテロのみ（1世代で固定可能）',
    'bp_split_only' => 'スプリット♂のみ（1世代で発現可能）',
    'bp_gene_absent' => '未保有（導入が必要）',
    'bp_one_gen_possible' => '1世代で作出可能！',
    'bp_final_generation' => '最終世代（目標作出）',
    'bp_generation_n' => '第{n}世代',
    'bp_goal' => '目標',
    'bp_use_intermediate' => '前世代で作出した個体を使用',
    'bp_need_new_bird' => 'この遺伝子を持つ個体の導入が必要',
    'bp_fix_gene' => '{gene}を固定（ホモ化）',
    'bp_introduce_gene' => '{gene}遺伝子を導入',
    'bp_express_slr' => '{gene}を♀で発現させる',
    'bp_introduce_slr_gene' => '{gene}（伴性）を導入',
    'bp_breeding_plan' => '配合計画',
    'bp_open_in_familymap' => 'FamilyMapで開く',

    // v7.1.1: 組み合わせ分析
    'bp_combination_needed' => '遺伝子の組み合わせが必要',
    'bp_genes_scattered' => '{scattered}個の遺伝子が別々の個体に存在。組み合わせに{gens}世代追加。',
    'bp_best_foundation' => '最適な基礎個体',
    'bp_genes' => '遺伝子',

    // v7.3.15: 近親交配回避
    'bp_same_parents_warning' => '全ペアリングが同じ両親を使用。最終世代は全兄弟婚（F=25%）になります。新しい血統の導入が必須です。',
    'bp_same_parent_warning' => '全ペアリングが同じ{parent}を使用。最終世代は半兄弟婚（F=12.5%）になります。新しい血統の導入を検討してください。',
    'bp_shared_sire' => '父親',
    'bp_shared_dam' => '母親',
    'bp_half_sibling_warning' => '最終世代は半兄弟婚（F=12.5%）になります。新しい血統の導入を検討してください。',
    'bp_cousin_warning' => '最終世代は従兄弟婚（F≈6.25%）になります。許容範囲ですが、長期繁殖には新しい血統を検討してください。',

    // ============================================================
    // v7.2: 交配シナリオ翻訳キー
    // ============================================================
    'pf_breeding_scenario' => '交配シナリオ',
    'pf_required_genes' => '必要な遺伝子',
    'pf_phase_label' => 'フェーズ {n}',
    'pf_summary' => 'まとめ',

    // 個体表現
    'pf_any_male' => '任意の♂',
    'pf_any_female' => '任意の♀',
    'pf_expressing' => '発現個体',
    'pf_expressing_female' => '発現♀',
    'pf_wildtype' => '野生型',
    'pf_sf_individual' => 'SF個体',
    'pf_df_from_g1' => 'G1から得たDF個体',
    'pf_split_male' => 'スプリット♂',
    'pf_split_from_g1' => 'G1から得たスプリット',
    'pf_split_male_from_g1' => 'G1から得たスプリット♂',
    'pf_split_from_phase1' => 'フェーズ1から得たスプリット',
    'pf_multi_split' => '複数因子スプリット',
    'pf_multi_split_or_expressing' => '複数因子スプリットまたは発現個体',
    'pf_with_genes' => '{genes}を保有',
    'pf_all_required_genes' => '全必要遺伝子を保有',
    'pf_df_individual' => 'DF個体',

    // フェーズタイトル
    'pf_scenario_wildtype' => '野生型の繁殖',
    'pf_scenario_wildtype_desc' => '追加の遺伝子は不要です',
    'pf_scenario_green_result' => '100% グリーン',
    'pf_scenario_wildtype_summary' => 'グリーン同士の交配で100%グリーンが得られます',

    // SLR（伴性劣性）シナリオ
    'pf_scenario_slr_phase1' => '{locus}のスプリット♂を作出',
    'pf_scenario_slr_phase2' => '{locus}発現個体を作出',
    'pf_scenario_slr_result1' => '♂子: 100%スプリット{locus}',
    'pf_scenario_slr_result2' => '♀子の50%が発現、♂子の50%がスプリット',
    'pf_scenario_slr_summary' => '2世代で目標を作出可能。発現♀から始め、スプリット♂を作り、そのスプリット♂から発現個体を得ます。',

    // 優性シナリオ
    'pf_scenario_dom_phase1' => '{locus} DF個体を作出',
    'pf_scenario_dom_phase2' => '目標を作出',
    'pf_scenario_dom_result1' => '25%がDF（ホモ）、50%がSF（ヘテロ）',
    'pf_scenario_dom_result2' => 'DF個体を使用して目標を作出',
    'pf_scenario_dom_summary' => 'SF同士の交配で25%のDF個体が得られ、それを使って目標を作出します。',

    // 単純シナリオ
    'pf_scenario_simple' => '直接交配',
    'pf_scenario_simple_result' => '{prob}%の確率で目標が出現',
    'pf_scenario_simple_summary' => '1世代で目標を作出可能です。',

    // AR（常染色体劣性）シナリオ
    'pf_scenario_ar_phase1' => '{locus}スプリットを作出',
    'pf_scenario_ar_phase2' => '{locus}をホモ化して作出',
    'pf_scenario_ar_result1' => '子は100%スプリット{locus}',
    'pf_scenario_ar_result2' => '25%の確率で目標（ホモ）が出現',
    'pf_scenario_ar_summary' => 'まず発現個体×野生型でスプリットを作り、スプリット同士の交配で25%の確率で目標が得られます。',

    // 複数遺伝子シナリオ
    'pf_phase_intro' => '基礎個体の導入',
    'pf_phase_intro_desc' => '必要な遺伝子（{genes}）を持つ個体を用意します',
    'pf_phase_combine' => '遺伝子の組み合わせ',
    'pf_phase_combine_desc' => '異なる遺伝子を持つ個体を交配し、複数の遺伝子を1個体に集めます',
    'pf_phase_final' => '目標の作出',
    'pf_phase_final_desc' => '全ての遺伝子を持つ個体同士を交配し、目標を作出します',
    'pf_introduce_autosomal' => '{locus}因子の導入（常染色体）',
    'pf_introduce_slr_gene' => '{locus}因子の導入（伴性）',
    'pf_all_split' => '子は100%スプリット',
    'pf_male_split_female_half' => '♂子は100%スプリット{locus}、♀子は50%発現',
    'pf_combine_genes' => '遺伝子を1個体に集める',
    'pf_combine_result' => '複数の遺伝子を持つスプリットが得られる',
    // v7.3.9: 現実的な市場シナリオ（発現個体から開始）
    'pf_phase_n_combine_direct' => 'フェーズ {n}: 発現個体の交配',
    'pf_phase_n_add_gene' => 'フェーズ {n}: {gene}の追加',
    'pf_phase_n_final' => 'フェーズ {n}: 目標の作出',
    'pf_acquire_and_cross_desc' => '{gene1}発現個体と{gene2}発現個体を入手して交配',
    'pf_cross_expressing' => '発現個体同士を交配',
    'pf_expressing_trait' => '{gene}発現',
    'pf_offspring_carry_both' => '子は{gene1}と{gene2}の両方をスプリットで保有',
    'pf_add_expressing_desc' => '前世代の個体に{gene}発現個体を交配',
    'pf_some_carry_genes' => '子の一部が{genes}を保有',
    'pf_add_gene_to_line' => '{gene}を追加',
    'pf_carrying_genes' => '{genes}保有',
    'pf_final_cross' => '最終交配',
    'pf_final_result' => '目標表現型が出現（確率は遺伝子数による）',
    'pf_final_note' => '目標を得るには、全ての必要遺伝子をホモで持つ個体が必要です',
    'pf_scenario_multi_summary' => '{target}の作出には約{gens}世代が必要です。必要遺伝子: {genes}',
    'pf_lineage_advice' => '💡 近親交配回避のヒント: フェーズ1〜2で父方系統と母方系統の2系統を別々に作り、フェーズ3で合流させることで兄弟婚・従兄弟婚を避けられます。',

    // v7.2追加: 計画済み個体
    'bp_planned_bird' => '計画済み',

    // v7.3.8: 市場入手性
    'pf_avail_easy' => '容易',
    'pf_avail_normal' => '普通',
    'pf_avail_difficult' => '困難',
    'pf_avail_warning_difficult' => '⚠️ 入手困難な祖',
    'pf_avail_note_difficult' => '以下の羽色は希少で入手に時間を要する場合があります',
    'pf_avail_warning_normal' => '※ やや希少な祖',
    'pf_avail_note_normal' => '以下の羽色は専門ブリーダーで入手可能ですが、多少の待ち時間があるかもしれません',
    'pf_avail_badge_difficult' => '入手困難',
    'pf_avail_badge_normal' => 'やや希少',

    // v7.3.14: Phase Inference Display (i18n compliant)
    'phase_inference_title' => '連鎖遺伝の相（Phase）推論',
    'phase_z_linked' => 'Z染色体連鎖（cin-ino-op）',
    'phase_result' => '推定結果:',
    'phase_z_cis' => 'Cis（シス）- cin-ino が同一染色体上',
    'phase_z_trans' => 'Trans（トランス）- cin と ino が別染色体上',
    'phase_confidence' => '信頼度:',
    'phase_evidence' => '根拠:',
    'phase_z_cis_tip' => 'Cisの場合、Lacewing（cin+ino同時発現）の子が約24%の確率で生まれます',
    'phase_z_trans_tip' => 'Transの場合、Lacewing子は約1.5%と非常に稀です（組み換えが必要）',
    'phase_auto_linked' => '常染色体連鎖（dark-parblue）',
    'phase_auto_cis' => 'Cis - D-aq/d-+ または d-aq/D-+',
    'phase_auto_trans' => 'Trans - D-+/d-aq',
];

// ============================================================
// 英語 (English)
// ============================================================
$pf_en = [
    // Step titles
    'pf_wild_type' => 'Wild Type',
    'pf_wild_type_result' => 'Base color requires no additional factors',
    'pf_introduce_slr' => 'Introduce {locus_name}',
    'pf_introduce_ar' => 'Introduce {locus_name} (Gen {gen})',
    'pf_introduce_dominant' => 'Introduce {locus_name}',
    
    // Parent descriptions
    'pf_expressed_female' => 'Expressed Female',
    
    // Result descriptions
    'pf_slr_result' => 'Male offspring: 100% split, Female offspring: 50% expressed',
    'pf_ar_result' => '100% split offspring → sibling cross for 25% expression',
    'pf_dominant_result' => '50% of offspring carry {locus_name}',
    
    // Warnings
    'pf_warning_ino' => '⚠️ INO/Pallid: 2-generation inbreeding limit',
    'pf_warning_fallow' => '⚠️ Fallow: Health risks require attention',
    'pf_warning_complex' => '⚠️ Complex trait (Tier {tier}): Multiple generations required',
    
    // Errors
    'pf_unsupported_target' => 'Unsupported target trait: {target}',
    
    // Other
    'pf_estimated_gen' => 'Estimated generations',

    // ============================================================
    // BreedingPlanner translation keys
    // ============================================================
    'bp_production_plan' => 'Production Plan',
    'bp_recommended_top5' => 'Recommended Pairings TOP5',
    'bp_probability' => 'Probability',
    'bp_f_value' => 'F-value',
    'bp_estimated' => 'Est.',
    'bp_same_sire_warning' => 'All pairings use the same sire. Offspring will be half-siblings (F=12.5%). Consider introducing new bloodlines.',
    'bp_low_contribution' => 'Low contribution to target',
    'bp_optimal_pair' => 'Optimal pair',
    'bp_possible' => 'Possible',
    'bp_breeding_prohibited' => 'Breeding prohibited',
    'bp_ethics_warning' => 'Prohibited in thoroughbred breeding',
    'bp_ethics_standard' => 'Ethical Standards',
    'bp_ethics_description' => 'Pairs with IC ≥12.5% are excluded (Thoroughbred rules)',
    'bp_filtered_note' => 'Pairs with IC ≥12.5% are excluded per ethical standards',
    'bp_select_target' => 'Please select a target trait',
    'bp_unsupported_target' => 'Unsupported target trait',
    'bp_no_birds' => 'No birds registered',
    'bp_register_hint' => 'Register birds in the Bird Management tab first',
    'bp_need_both_sex' => 'Both males and females are required',
    'bp_current_count' => 'Current: {m} males, {f} females',
    'bp_no_ethical_pairs' => 'No pairs meet ethical standards',
    'bp_introduce_new_blood' => 'No pairs with inbreeding coefficient below 12.5%. Introduce unrelated bloodlines.',
    'bp_no_viable_pairs' => 'No pairs can produce target trait',
    'bp_need_carriers' => 'Register birds that carry the required genes for this target.',
    'bp_no_breedable_pair' => 'No breedable pairs available',
    'bp_introduce_healthy' => 'Introduce birds with low health risk',
    'bp_goal_produce' => 'Produce {name}',
    'bp_female_hemizygous' => 'Females are hemizygous (no phase concept)',
    'bp_linkage_not_needed' => 'Linkage consideration not required',
    'bp_phase_cis' => 'Cis arrangement (efficient)',
    'bp_phase_trans' => 'Trans arrangement (inefficient)',
    'bp_phase_unknown' => 'Phase unknown',
    'bp_phase_cis_inferred' => 'Multiple expression → Cis inferred',
    'bp_phase_no_info' => 'No phase information',
    'bp_autosomal_cis' => 'Dark+Parblue Cis arrangement',
    'bp_male_cis_efficient' => 'Male is Cis → Efficient',
    'bp_male_trans_inefficient' => 'Male is Trans → Inefficient (Cis individual recommended)',
    'bp_male_phase_unknown' => 'Male phase unknown → Test breeding recommended',

    // v7.1: Multi-generation planning keys
    'bp_gene_analysis' => 'Gene Analysis',
    'bp_generations_needed' => 'Generations needed',
    'bp_missing_genes' => 'Missing genes',
    'bp_hetero_only' => 'heterozygous only (can fix in 1 gen)',
    'bp_split_only' => 'split males only (can express in 1 gen)',
    'bp_gene_absent' => 'absent (need to introduce)',
    'bp_one_gen_possible' => 'Can be produced in 1 generation!',
    'bp_final_generation' => 'Final Generation (Target)',
    'bp_generation_n' => 'Generation {n}',
    'bp_goal' => 'Goal',
    'bp_use_intermediate' => 'Use birds from previous generations',
    'bp_need_new_bird' => 'Need to acquire bird with this gene',
    'bp_fix_gene' => 'Fix {gene} (homozygous)',
    'bp_introduce_gene' => 'Introduce {gene} gene',
    'bp_express_slr' => 'Express {gene} in female',
    'bp_introduce_slr_gene' => 'Introduce {gene} (sex-linked)',
    'bp_breeding_plan' => 'Breeding Plan',
    'bp_open_in_familymap' => 'Open in FamilyMap',

    // v7.1.1: Combination analysis
    'bp_combination_needed' => 'Gene combination needed',
    'bp_genes_scattered' => '{scattered} genes are on different birds. Need {gens} extra generation(s) to combine.',
    'bp_best_foundation' => 'Best foundation bird',
    'bp_genes' => 'genes',

    // v7.3.15: Inbreeding avoidance
    'bp_same_parents_warning' => 'All pairings use the same parents. Final generation will be full siblings (F=25%). Must introduce new bloodlines.',
    'bp_same_parent_warning' => 'All pairings share the same {parent}. Final generation offspring will be half-siblings (F=12.5%). Consider introducing new bloodlines.',
    'bp_shared_sire' => 'sire',
    'bp_shared_dam' => 'dam',
    'bp_half_sibling_warning' => 'Final generation offspring will be half-siblings (F=12.5%). Consider introducing new bloodlines.',
    'bp_cousin_warning' => 'Final generation offspring will be cousins (F≈6.25%). Acceptable but consider introducing new bloodlines for long-term breeding.',

    // ============================================================
    // v7.2: Breeding Scenario Translation Keys
    // ============================================================
    'pf_breeding_scenario' => 'Breeding Scenario',
    'pf_required_genes' => 'Required Genes',
    'pf_phase_label' => 'Phase {n}',
    'pf_summary' => 'Summary',

    // Individual descriptions
    'pf_any_male' => 'Any male',
    'pf_any_female' => 'Any female',
    'pf_expressing' => 'Expressing individual',
    'pf_expressing_female' => 'Expressing female',
    'pf_wildtype' => 'Wild type',
    'pf_sf_individual' => 'SF individual',
    'pf_df_from_g1' => 'DF from G1',
    'pf_split_male' => 'Split male',
    'pf_split_from_g1' => 'Split from G1',
    'pf_split_male_from_g1' => 'Split male from G1',
    'pf_split_from_phase1' => 'Split from Phase 1',
    'pf_multi_split' => 'Multi-gene split',
    'pf_multi_split_or_expressing' => 'Multi-gene split or expressing',
    'pf_with_genes' => 'carrying {genes}',
    'pf_all_required_genes' => 'Carrying all required genes',
    'pf_df_individual' => 'DF individual',

    // Phase titles
    'pf_scenario_wildtype' => 'Wild Type Breeding',
    'pf_scenario_wildtype_desc' => 'No additional genes required',
    'pf_scenario_green_result' => '100% Green',
    'pf_scenario_wildtype_summary' => 'Breeding green to green produces 100% green offspring',

    // SLR scenarios
    'pf_scenario_slr_phase1' => 'Create split {locus} male',
    'pf_scenario_slr_phase2' => 'Produce expressing {locus}',
    'pf_scenario_slr_result1' => 'Male offspring: 100% split {locus}',
    'pf_scenario_slr_result2' => '50% of females express, 50% of males are split',
    'pf_scenario_slr_summary' => 'Target can be produced in 2 generations. Start with expressing female, create split males, then breed split males to get expressing offspring.',

    // Dominant scenarios
    'pf_scenario_dom_phase1' => 'Create {locus} DF individual',
    'pf_scenario_dom_phase2' => 'Produce target',
    'pf_scenario_dom_result1' => '25% DF (homozygous), 50% SF (heterozygous)',
    'pf_scenario_dom_result2' => 'Use DF individual to produce target',
    'pf_scenario_dom_summary' => 'Breeding SF×SF gives 25% DF offspring, which can be used to produce the target.',

    // Simple scenarios
    'pf_scenario_simple' => 'Direct Cross',
    'pf_scenario_simple_result' => '{prob}% chance of producing target',
    'pf_scenario_simple_summary' => 'Target can be produced in 1 generation.',

    // AR scenarios
    'pf_scenario_ar_phase1' => 'Create {locus} splits',
    'pf_scenario_ar_phase2' => 'Fix {locus} to homozygous',
    'pf_scenario_ar_result1' => 'Offspring: 100% split {locus}',
    'pf_scenario_ar_result2' => '25% chance of target (homozygous)',
    'pf_scenario_ar_summary' => 'First breed expressing × wild type to create splits, then breed splits together for 25% chance of target.',

    // Multi-gene scenarios
    'pf_phase_intro' => 'Introduce Foundation Stock',
    'pf_phase_intro_desc' => 'Acquire birds carrying required genes ({genes})',
    'pf_phase_combine' => 'Combine Genes',
    'pf_phase_combine_desc' => 'Cross birds with different genes to combine multiple genes into one individual',
    'pf_phase_final' => 'Produce Target',
    'pf_phase_final_desc' => 'Cross individuals carrying all required genes to produce target',
    'pf_introduce_autosomal' => 'Introduce {locus} (autosomal)',
    'pf_introduce_slr_gene' => 'Introduce {locus} (sex-linked)',
    'pf_all_split' => 'Offspring: 100% split',
    'pf_male_split_female_half' => 'Male offspring: 100% split {locus}, Female offspring: 50% expressing',
    'pf_combine_genes' => 'Combine genes into single individual',
    'pf_combine_result' => 'Obtain splits carrying multiple genes',
    // v7.3.9: Realistic market scenario (start from expressing birds)
    'pf_phase_n_combine_direct' => 'Phase {n}: Cross Expressing Birds',
    'pf_phase_n_add_gene' => 'Phase {n}: Add {gene}',
    'pf_phase_n_final' => 'Phase {n}: Produce Target',
    'pf_acquire_and_cross_desc' => 'Acquire {gene1} and {gene2} expressing birds and cross',
    'pf_cross_expressing' => 'Cross expressing birds',
    'pf_expressing_trait' => '{gene} expressing',
    'pf_offspring_carry_both' => 'Offspring carry both {gene1} and {gene2} as splits',
    'pf_add_expressing_desc' => 'Cross previous generation with {gene} expressing bird',
    'pf_some_carry_genes' => 'Some offspring carry {genes}',
    'pf_add_gene_to_line' => 'Add {gene}',
    'pf_carrying_genes' => 'Carrying {genes}',
    'pf_final_cross' => 'Final cross',
    'pf_final_result' => 'Target phenotype appears (probability depends on gene count)',
    'pf_final_note' => 'To obtain target, need individuals homozygous for all required genes',
    'pf_scenario_multi_summary' => 'Producing {target} requires approximately {gens} generations. Required genes: {genes}',
    'pf_lineage_advice' => '💡 Inbreeding avoidance tip: Create 2 separate lineages (sire-line and dam-line) in Phase 1-2, then merge them in Phase 3 to avoid sibling/cousin mating.',

    // v7.2: Planned bird
    'bp_planned_bird' => 'Planned',

    // v7.3.8: Market availability
    'pf_avail_easy' => 'Easy',
    'pf_avail_normal' => 'Moderate',
    'pf_avail_difficult' => 'Difficult',
    'pf_avail_warning_difficult' => '⚠️ Difficult to obtain',
    'pf_avail_note_difficult' => 'The following colors are rare and may take time to acquire',
    'pf_avail_warning_normal' => '※ Moderately rare',
    'pf_avail_note_normal' => 'The following colors are available from specialist breeders but may require some waiting time',
    'pf_avail_badge_difficult' => 'Hard to get',
    'pf_avail_badge_normal' => 'Uncommon',

    // v7.3.14: Phase Inference Display (i18n compliant)
    'phase_inference_title' => 'Linkage Phase Inference',
    'phase_z_linked' => 'Z-Linked (cin-ino-op)',
    'phase_result' => 'Result:',
    'phase_z_cis' => 'Cis - cin-ino on same chromosome',
    'phase_z_trans' => 'Trans - cin and ino on separate chromosomes',
    'phase_confidence' => 'Confidence:',
    'phase_evidence' => 'Evidence:',
    'phase_z_cis_tip' => 'With Cis, ~24% chance of Lacewing offspring (cin+ino co-expression)',
    'phase_z_trans_tip' => 'With Trans, Lacewing offspring are rare (~1.5%, requires recombination)',
    'phase_auto_linked' => 'Autosomal Linkage (dark-parblue)',
    'phase_auto_cis' => 'Cis - D-aq/d-+ or d-aq/D-+',
    'phase_auto_trans' => 'Trans - D-+/d-aq',
];

// ============================================================
// ドイツ語 (German)
// ============================================================
$pf_de = [
    // Schritttitel
    'pf_wild_type' => 'Wildtyp',
    'pf_wild_type_result' => 'Grundfarbe benötigt keine zusätzlichen Faktoren',
    'pf_introduce_slr' => '{locus_name}-Faktor einführen',
    'pf_introduce_ar' => '{locus_name}-Faktor einführen (Gen {gen})',
    'pf_introduce_dominant' => '{locus_name}-Faktor einführen',
    
    // Elternbeschreibungen
    'pf_expressed_female' => 'Exprimiertes Weibchen',
    
    // Ergebnisbeschreibungen
    'pf_slr_result' => 'Männchen: 100% Spalt, Weibchen: 50% exprimiert',
    'pf_ar_result' => '100% Spalt → Geschwisterpaarung für 25% Expression',
    'pf_dominant_result' => '50% der Nachkommen tragen {locus_name}',
    
    // Warnungen
    'pf_warning_ino' => '⚠️ INO/Pallid: 2-Generationen-Inzuchtlimit',
    'pf_warning_fallow' => '⚠️ Fallow: Gesundheitsrisiken beachten',
    'pf_warning_complex' => '⚠️ Komplexes Merkmal (Tier {tier}): Mehrere Generationen erforderlich',
    
    // Fehler
    'pf_unsupported_target' => 'Nicht unterstütztes Zielmerkmal: {target}',
    
    // Sonstiges
    'pf_estimated_gen' => 'Geschätzte Generationen',

    // BreedingPlanner
    'bp_production_plan' => 'Produktionsplan',
    'bp_recommended_top5' => 'Empfohlene Paarungen TOP5',
    'bp_probability' => 'Wahrscheinlichkeit',
    'bp_f_value' => 'F-Wert',
    'bp_estimated' => 'Gesch.',
    'bp_same_sire_warning' => 'Alle Paarungen verwenden denselben Vater. Nachkommen werden Halbgeschwister (F=12,5%). Erwägen Sie die Einführung neuer Blutlinien.',
    'bp_low_contribution' => 'Geringer Beitrag zum Ziel',
    'bp_optimal_pair' => 'Optimales Paar',
    'bp_possible' => 'Möglich',
    'bp_breeding_prohibited' => 'Zucht verboten',
    'bp_ethics_warning' => 'In der Vollblutzucht verboten',
    'bp_ethics_standard' => 'Ethische Standards',
    'bp_ethics_description' => 'Paare mit IC ≥12,5% werden ausgeschlossen (Vollblutregeln)',

    // v7.1: Mehrgenerationenplanung
    'bp_gene_analysis' => 'Genanalyse',
    'bp_generations_needed' => 'Benötigte Generationen',
    'bp_missing_genes' => 'Fehlende Gene',
    'bp_hetero_only' => 'nur heterozygot (in 1 Gen fixierbar)',
    'bp_split_only' => 'nur Spalt-Männchen (in 1 Gen exprimierbar)',
    'bp_gene_absent' => 'fehlt (Einführung erforderlich)',
    'bp_one_gen_possible' => 'Kann in 1 Generation produziert werden!',
    'bp_final_generation' => 'Letzte Generation (Ziel)',
    'bp_generation_n' => 'Generation {n}',
    'bp_goal' => 'Ziel',
    'bp_use_intermediate' => 'Vögel aus vorherigen Generationen verwenden',
    'bp_need_new_bird' => 'Vogel mit diesem Gen benötigt',
    'bp_fix_gene' => '{gene} fixieren (homozygot)',
    'bp_introduce_gene' => '{gene}-Gen einführen',
    'bp_express_slr' => '{gene} im Weibchen exprimieren',
    'bp_introduce_slr_gene' => '{gene} (geschlechtsgeb.) einführen',
    'bp_breeding_plan' => 'Zuchtplan',
    'bp_open_in_familymap' => 'In FamilyMap öffnen',

    // v7.1.1: Kombinationsanalyse
    'bp_combination_needed' => 'Genkombination erforderlich',
    'bp_genes_scattered' => '{scattered} Gene sind auf verschiedenen Vögeln. {gens} zusätzliche Generation(en) zum Kombinieren benötigt.',
    'bp_best_foundation' => 'Bester Grundvogel',
    'bp_genes' => 'Gene',

    // v7.3.15: Inzuchtvermeidung
    'bp_same_parents_warning' => 'Alle Paarungen verwenden dieselben Eltern. Letzte Generation wird Vollgeschwister (F=25%). Neue Blutlinien müssen eingeführt werden.',
    'bp_same_parent_warning' => 'Alle Paarungen teilen denselben {parent}. Nachkommen der letzten Generation werden Halbgeschwister (F=12,5%). Erwägen Sie die Einführung neuer Blutlinien.',
    'bp_shared_sire' => 'Vater',
    'bp_shared_dam' => 'Mutter',
    'bp_half_sibling_warning' => 'Nachkommen der letzten Generation werden Halbgeschwister (F=12,5%). Erwägen Sie die Einführung neuer Blutlinien.',
    'bp_cousin_warning' => 'Nachkommen der letzten Generation werden Cousins (F≈6,25%). Akzeptabel, aber für Langzeitzucht neue Blutlinien empfohlen.',

    // v7.2: Zucht-Szenario
    'pf_breeding_scenario' => 'Zuchtszenario',
    'pf_required_genes' => 'Benötigte Gene',
    'pf_phase_label' => 'Phase {n}',
    'pf_summary' => 'Zusammenfassung',
    'pf_any_male' => 'Beliebiges Männchen',
    'pf_any_female' => 'Beliebiges Weibchen',
    'pf_expressing' => 'Exprimierendes Tier',
    'pf_expressing_female' => 'Exprimierendes Weibchen',
    'pf_wildtype' => 'Wildtyp',
    'pf_sf_individual' => 'SF-Tier',
    'pf_df_from_g1' => 'DF aus G1',
    'pf_split_male' => 'Spalt-Männchen',
    'pf_split_from_g1' => 'Spalt aus G1',
    'pf_split_male_from_g1' => 'Spalt-Männchen aus G1',
    'pf_split_from_phase1' => 'Spalt aus Phase 1',
    'pf_multi_split' => 'Multi-Gen-Spalt',
    'pf_multi_split_or_expressing' => 'Multi-Gen-Spalt oder exprimierend',
    'pf_with_genes' => 'trägt {genes}',
    'pf_all_required_genes' => 'Trägt alle benötigten Gene',
    'pf_df_individual' => 'DF-Tier',
    'pf_scenario_wildtype' => 'Wildtyp-Zucht',
    'pf_scenario_wildtype_desc' => 'Keine zusätzlichen Gene erforderlich',
    'pf_scenario_green_result' => '100% Grün',
    'pf_scenario_wildtype_summary' => 'Grün × Grün ergibt 100% grüne Nachkommen',
    'pf_scenario_slr_phase1' => 'Spalt-{locus}-Männchen erzeugen',
    'pf_scenario_slr_phase2' => '{locus}-Exprimierende erzeugen',
    'pf_scenario_slr_result1' => 'Männliche Nachkommen: 100% Spalt-{locus}',
    'pf_scenario_slr_result2' => '50% der Weibchen exprimieren, 50% der Männchen sind Spalt',
    'pf_scenario_slr_summary' => 'Ziel in 2 Generationen erreichbar. Mit exprimierendem Weibchen beginnen, Spalt-Männchen erzeugen, dann exprimierende Nachkommen erhalten.',
    'pf_scenario_dom_phase1' => '{locus}-DF-Tier erzeugen',
    'pf_scenario_dom_phase2' => 'Ziel erzeugen',
    'pf_scenario_dom_result1' => '25% DF, 50% SF',
    'pf_scenario_dom_result2' => 'DF-Tier zur Zielerzeugung verwenden',
    'pf_scenario_dom_summary' => 'SF×SF ergibt 25% DF-Nachkommen für die Zielerzeugung.',
    'pf_scenario_simple' => 'Direkte Kreuzung',
    'pf_scenario_simple_result' => '{prob}% Chance auf Ziel',
    'pf_scenario_simple_summary' => 'Ziel in 1 Generation erreichbar.',
    'pf_scenario_ar_phase1' => '{locus}-Spalt erzeugen',
    'pf_scenario_ar_phase2' => '{locus} homozygot fixieren',
    'pf_scenario_ar_result1' => 'Nachkommen: 100% Spalt-{locus}',
    'pf_scenario_ar_result2' => '25% Chance auf Ziel (homozygot)',
    'pf_scenario_ar_summary' => 'Erst Exprimierend × Wildtyp für Spalt, dann Spalt × Spalt für 25% Ziel.',
    'pf_phase_intro' => 'Grundstock einführen',
    'pf_phase_intro_desc' => 'Vögel mit benötigten Genen ({genes}) beschaffen',
    'pf_phase_combine' => 'Gene kombinieren',
    'pf_phase_combine_desc' => 'Vögel mit verschiedenen Genen kreuzen',
    'pf_phase_final' => 'Ziel erzeugen',
    'pf_phase_final_desc' => 'Tiere mit allen Genen kreuzen',
    'pf_introduce_autosomal' => '{locus} einführen (autosomal)',
    'pf_introduce_slr_gene' => '{locus} einführen (geschlechtsgebunden)',
    'pf_all_split' => 'Nachkommen: 100% Spalt',
    'pf_male_split_female_half' => 'Männchen: 100% Spalt-{locus}, Weibchen: 50% exprimierend',
    'pf_combine_genes' => 'Gene in einem Tier vereinen',
    'pf_combine_result' => 'Multi-Gen-Spalt erhalten',
    // v7.3.9: Realistische Marktszenarien (Start mit exprimierenden Tieren)
    'pf_phase_n_combine_direct' => 'Phase {n}: Exprimierende Tiere kreuzen',
    'pf_phase_n_add_gene' => 'Phase {n}: {gene} hinzufügen',
    'pf_phase_n_final' => 'Phase {n}: Zielerzeugung',
    'pf_acquire_and_cross_desc' => '{gene1}- und {gene2}-exprimierende Tiere beschaffen und kreuzen',
    'pf_cross_expressing' => 'Exprimierende Tiere kreuzen',
    'pf_expressing_trait' => '{gene} exprimierend',
    'pf_offspring_carry_both' => 'Nachkommen tragen {gene1} und {gene2} als Spalt',
    'pf_add_expressing_desc' => 'Vorgeneration mit {gene}-exprimierendem Tier kreuzen',
    'pf_some_carry_genes' => 'Einige Nachkommen tragen {genes}',
    'pf_add_gene_to_line' => '{gene} hinzufügen',
    'pf_carrying_genes' => 'Trägt {genes}',
    'pf_final_cross' => 'Finale Kreuzung',
    'pf_final_result' => 'Zielphänotyp erscheint',
    'pf_final_note' => 'Für Ziel: alle Gene homozygot erforderlich',
    'pf_scenario_multi_summary' => '{target} benötigt ca. {gens} Generationen. Gene: {genes}',
    'pf_lineage_advice' => '💡 Inzuchtvermeidung: Erstellen Sie 2 separate Linien (Vater- und Mutterlinie) in Phase 1-2, dann führen Sie sie in Phase 3 zusammen, um Geschwister-/Cousinenpaarung zu vermeiden.',
    'bp_planned_bird' => 'Geplant',

    // v7.3.10: Marktverfügbarkeit
    'pf_avail_easy' => 'Leicht',
    'pf_avail_normal' => 'Mäßig',
    'pf_avail_difficult' => 'Schwierig',
    'pf_avail_warning_difficult' => '⚠️ Schwer zu beschaffen',
    'pf_avail_note_difficult' => 'Die folgenden Farben sind selten und können Zeit zum Erwerben benötigen',
    'pf_avail_warning_normal' => '※ Mäßig selten',
    'pf_avail_note_normal' => 'Die folgenden Farben sind bei spezialisierten Züchtern erhältlich, können aber Wartezeit erfordern',
    'pf_avail_badge_difficult' => 'Schwer erhältlich',
    'pf_avail_badge_normal' => 'Selten',

    // v7.3.14: Phase Inference Display (i18n compliant)
    'phase_inference_title' => 'Kopplungsphase-Inferenz',
    'phase_z_linked' => 'Z-gebunden (cin-ino-op)',
    'phase_result' => 'Ergebnis:',
    'phase_z_cis' => 'Cis - cin-ino auf demselben Chromosom',
    'phase_z_trans' => 'Trans - cin und ino auf verschiedenen Chromosomen',
    'phase_confidence' => 'Konfidenz:',
    'phase_evidence' => 'Nachweis:',
    'phase_z_cis_tip' => 'Bei Cis: ~24% Chance auf Lacewing-Nachkommen (cin+ino Ko-Expression)',
    'phase_z_trans_tip' => 'Bei Trans: Lacewing-Nachkommen sind selten (~1,5%, Rekombination erforderlich)',
    'phase_auto_linked' => 'Autosomale Kopplung (dark-parblue)',
    'phase_auto_cis' => 'Cis - D-aq/d-+ oder d-aq/D-+',
    'phase_auto_trans' => 'Trans - D-+/d-aq',
];

// ============================================================
// フランス語 (French)
// ============================================================
$pf_fr = [
    // Titres des étapes
    'pf_wild_type' => 'Type Sauvage',
    'pf_wild_type_result' => 'La couleur de base ne nécessite pas de facteurs supplémentaires',
    'pf_introduce_slr' => 'Introduire le facteur {locus_name}',
    'pf_introduce_ar' => 'Introduire le facteur {locus_name} (Gén {gen})',
    'pf_introduce_dominant' => 'Introduire le facteur {locus_name}',
    
    // Descriptions des parents
    'pf_expressed_female' => 'Femelle exprimée',
    
    // Descriptions des résultats
    'pf_slr_result' => 'Mâles: 100% porteurs, Femelles: 50% exprimées',
    'pf_ar_result' => '100% porteurs → croisement fratrie pour 25% expression',
    'pf_dominant_result' => '50% des descendants portent {locus_name}',
    
    // Avertissements
    'pf_warning_ino' => '⚠️ INO/Pallid: Limite de consanguinité 2 générations',
    'pf_warning_fallow' => '⚠️ Fallow: Risques pour la santé à surveiller',
    'pf_warning_complex' => '⚠️ Trait complexe (Tier {tier}): Plusieurs générations nécessaires',
    
    // Erreurs
    'pf_unsupported_target' => 'Trait cible non supporté: {target}',
    
    // Autre
    'pf_estimated_gen' => 'Générations estimées',

    // BreedingPlanner
    'bp_production_plan' => 'Plan de Production',
    'bp_recommended_top5' => 'Accouplements Recommandés TOP5',
    'bp_probability' => 'Probabilité',
    'bp_f_value' => 'Valeur F',
    'bp_estimated' => 'Est.',
    'bp_same_sire_warning' => 'Tous les accouplements utilisent le même père. Les descendants seront demi-frères (F=12,5%). Envisagez d\'introduire de nouvelles lignées.',
    'bp_low_contribution' => 'Faible contribution à l\'objectif',
    'bp_optimal_pair' => 'Paire optimale',
    'bp_possible' => 'Possible',
    'bp_breeding_prohibited' => 'Élevage interdit',
    'bp_ethics_warning' => 'Interdit dans l\'élevage pur-sang',
    'bp_ethics_standard' => 'Normes Éthiques',
    'bp_ethics_description' => 'Les paires avec IC ≥12,5% sont exclues (règles pur-sang)',

    // v7.1: Planification multi-génération
    'bp_gene_analysis' => 'Analyse Génétique',
    'bp_generations_needed' => 'Générations nécessaires',
    'bp_missing_genes' => 'Gènes manquants',
    'bp_hetero_only' => 'hétérozygote seul (fixable en 1 gén)',
    'bp_split_only' => 'mâles porteurs seul (exprimable en 1 gén)',
    'bp_gene_absent' => 'absent (introduction nécessaire)',
    'bp_one_gen_possible' => 'Productible en 1 génération!',
    'bp_final_generation' => 'Génération Finale (Objectif)',
    'bp_generation_n' => 'Génération {n}',
    'bp_goal' => 'Objectif',
    'bp_use_intermediate' => 'Utiliser les oiseaux des générations précédentes',
    'bp_need_new_bird' => 'Besoin d\'acquérir un oiseau avec ce gène',
    'bp_fix_gene' => 'Fixer {gene} (homozygote)',
    'bp_introduce_gene' => 'Introduire le gène {gene}',
    'bp_express_slr' => 'Exprimer {gene} chez la femelle',
    'bp_introduce_slr_gene' => 'Introduire {gene} (lié au sexe)',
    'bp_breeding_plan' => 'Plan d\'Élevage',
    'bp_open_in_familymap' => 'Ouvrir dans FamilyMap',

    // v7.1.1: Analyse de combinaison
    'bp_combination_needed' => 'Combinaison génétique nécessaire',
    'bp_genes_scattered' => '{scattered} gènes sont sur différents oiseaux. {gens} génération(s) supplémentaire(s) nécessaire(s).',
    'bp_best_foundation' => 'Meilleur oiseau de base',
    'bp_genes' => 'gènes',

    // v7.3.15: Évitement de la consanguinité
    'bp_same_parents_warning' => 'Tous les accouplements utilisent les mêmes parents. La dernière génération sera des frères/sœurs complets (F=25%). De nouvelles lignées doivent être introduites.',
    'bp_same_parent_warning' => 'Tous les accouplements partagent le même {parent}. Les descendants de la dernière génération seront des demi-frères/sœurs (F=12,5%). Envisagez d\'introduire de nouvelles lignées.',
    'bp_shared_sire' => 'père',
    'bp_shared_dam' => 'mère',
    'bp_half_sibling_warning' => 'Les descendants de la dernière génération seront des demi-frères/sœurs (F=12,5%). Envisagez d\'introduire de nouvelles lignées.',
    'bp_cousin_warning' => 'Les descendants de la dernière génération seront des cousins (F≈6,25%). Acceptable mais envisagez de nouvelles lignées pour l\'élevage à long terme.',

    // v7.2: Scénario d'élevage
    'pf_breeding_scenario' => 'Scénario d\'élevage',
    'pf_required_genes' => 'Gènes requis',
    'pf_phase_label' => 'Phase {n}',
    'pf_summary' => 'Résumé',
    'pf_any_male' => 'N\'importe quel mâle',
    'pf_any_female' => 'N\'importe quelle femelle',
    'pf_expressing' => 'Individu exprimant',
    'pf_expressing_female' => 'Femelle exprimant',
    'pf_wildtype' => 'Type sauvage',
    'pf_sf_individual' => 'Individu SF',
    'pf_df_from_g1' => 'DF de G1',
    'pf_split_male' => 'Mâle porteur',
    'pf_split_from_g1' => 'Porteur de G1',
    'pf_split_male_from_g1' => 'Mâle porteur de G1',
    'pf_split_from_phase1' => 'Porteur de Phase 1',
    'pf_multi_split' => 'Porteur multi-gène',
    'pf_multi_split_or_expressing' => 'Porteur multi-gène ou exprimant',
    'pf_with_genes' => 'portant {genes}',
    'pf_all_required_genes' => 'Portant tous les gènes requis',
    'pf_df_individual' => 'Individu DF',
    'pf_scenario_wildtype' => 'Élevage type sauvage',
    'pf_scenario_wildtype_desc' => 'Aucun gène supplémentaire requis',
    'pf_scenario_green_result' => '100% Vert',
    'pf_scenario_wildtype_summary' => 'Vert × Vert donne 100% de descendants verts',
    'pf_scenario_slr_phase1' => 'Créer mâle porteur {locus}',
    'pf_scenario_slr_phase2' => 'Produire {locus} exprimant',
    'pf_scenario_slr_result1' => 'Mâles: 100% porteurs {locus}',
    'pf_scenario_slr_result2' => '50% des femelles expriment, 50% des mâles sont porteurs',
    'pf_scenario_slr_summary' => 'Objectif atteignable en 2 générations.',
    'pf_scenario_dom_phase1' => 'Créer individu DF {locus}',
    'pf_scenario_dom_phase2' => 'Produire l\'objectif',
    'pf_scenario_dom_result1' => '25% DF, 50% SF',
    'pf_scenario_dom_result2' => 'Utiliser individu DF pour produire l\'objectif',
    'pf_scenario_dom_summary' => 'SF×SF donne 25% DF pour l\'objectif.',
    'pf_scenario_simple' => 'Croisement direct',
    'pf_scenario_simple_result' => '{prob}% de chance d\'obtenir l\'objectif',
    'pf_scenario_simple_summary' => 'Objectif atteignable en 1 génération.',
    'pf_scenario_ar_phase1' => 'Créer porteurs {locus}',
    'pf_scenario_ar_phase2' => 'Fixer {locus} en homozygote',
    'pf_scenario_ar_result1' => 'Descendants: 100% porteurs {locus}',
    'pf_scenario_ar_result2' => '25% de chance d\'obtenir l\'objectif',
    'pf_scenario_ar_summary' => 'D\'abord exprimant × sauvage pour porteurs, puis porteurs × porteurs pour 25% objectif.',
    'pf_phase_intro' => 'Introduire le stock de base',
    'pf_phase_intro_desc' => 'Acquérir des oiseaux avec les gènes requis ({genes})',
    'pf_phase_combine' => 'Combiner les gènes',
    'pf_phase_combine_desc' => 'Croiser des oiseaux avec différents gènes',
    'pf_phase_final' => 'Produire l\'objectif',
    'pf_phase_final_desc' => 'Croiser les individus avec tous les gènes',
    'pf_introduce_autosomal' => 'Introduire {locus} (autosomal)',
    'pf_introduce_slr_gene' => 'Introduire {locus} (lié au sexe)',
    'pf_all_split' => 'Descendants: 100% porteurs',
    'pf_male_split_female_half' => 'Mâles: 100% porteurs {locus}, Femelles: 50% exprimant',
    'pf_combine_genes' => 'Combiner les gènes en un individu',
    'pf_combine_result' => 'Obtenir porteurs multi-gène',
    // v7.3.9: Scénarios de marché réalistes (commencer avec des individus exprimants)
    'pf_phase_n_combine_direct' => 'Phase {n}: Croiser des individus exprimants',
    'pf_phase_n_add_gene' => 'Phase {n}: Ajouter {gene}',
    'pf_phase_n_final' => 'Phase {n}: Production de l\'objectif',
    'pf_acquire_and_cross_desc' => 'Acquérir et croiser des individus exprimant {gene1} et {gene2}',
    'pf_cross_expressing' => 'Croiser des individus exprimants',
    'pf_expressing_trait' => '{gene} exprimant',
    'pf_offspring_carry_both' => 'Les descendants portent {gene1} et {gene2} comme porteurs',
    'pf_add_expressing_desc' => 'Croiser la génération précédente avec un individu exprimant {gene}',
    'pf_some_carry_genes' => 'Certains descendants portent {genes}',
    'pf_add_gene_to_line' => 'Ajouter {gene}',
    'pf_carrying_genes' => 'Porteur de {genes}',
    'pf_final_cross' => 'Croisement final',
    'pf_final_result' => 'Le phénotype cible apparaît',
    'pf_final_note' => 'Pour l\'objectif: tous les gènes doivent être homozygotes',
    'pf_scenario_multi_summary' => '{target} nécessite environ {gens} générations. Gènes: {genes}',
    'pf_lineage_advice' => '💡 Évitement de la consanguinité: Créez 2 lignées séparées (lignée paternelle et maternelle) en Phase 1-2, puis fusionnez-les en Phase 3 pour éviter l\'accouplement entre frères/sœurs/cousins.',
    'bp_planned_bird' => 'Planifié',

    // v7.3.10: Disponibilité sur le marché
    'pf_avail_easy' => 'Facile',
    'pf_avail_normal' => 'Modéré',
    'pf_avail_difficult' => 'Difficile',
    'pf_avail_warning_difficult' => '⚠️ Difficile à obtenir',
    'pf_avail_note_difficult' => 'Les couleurs suivantes sont rares et peuvent nécessiter du temps pour les acquérir',
    'pf_avail_warning_normal' => '※ Modérément rare',
    'pf_avail_note_normal' => 'Les couleurs suivantes sont disponibles chez les éleveurs spécialisés mais peuvent nécessiter un délai d\'attente',
    'pf_avail_badge_difficult' => 'Rare',
    'pf_avail_badge_normal' => 'Peu courant',

    // v7.3.14: Phase Inference Display (i18n compliant)
    'phase_inference_title' => 'Inférence de Phase de Liaison',
    'phase_z_linked' => 'Liaison Z (cin-ino-op)',
    'phase_result' => 'Résultat:',
    'phase_z_cis' => 'Cis - cin-ino sur le même chromosome',
    'phase_z_trans' => 'Trans - cin et ino sur des chromosomes différents',
    'phase_confidence' => 'Confiance:',
    'phase_evidence' => 'Preuve:',
    'phase_z_cis_tip' => 'Avec Cis: ~24% de chance d\'obtenir des descendants Lacewing (co-expression cin+ino)',
    'phase_z_trans_tip' => 'Avec Trans: les descendants Lacewing sont rares (~1,5%, recombinaison nécessaire)',
    'phase_auto_linked' => 'Liaison Autosomale (dark-parblue)',
    'phase_auto_cis' => 'Cis - D-aq/d-+ ou d-aq/D-+',
    'phase_auto_trans' => 'Trans - D-+/d-aq',
];

// ============================================================
// イタリア語 (Italian)
// ============================================================
$pf_it = [
    // Titoli dei passaggi
    'pf_wild_type' => 'Tipo Selvatico',
    'pf_wild_type_result' => 'Il colore base non richiede fattori aggiuntivi',
    'pf_introduce_slr' => 'Introdurre fattore {locus_name}',
    'pf_introduce_ar' => 'Introdurre fattore {locus_name} (Gen {gen})',
    'pf_introduce_dominant' => 'Introdurre fattore {locus_name}',
    
    // Descrizioni dei genitori
    'pf_expressed_female' => 'Femmina espressa',
    
    // Descrizioni dei risultati
    'pf_slr_result' => 'Maschi: 100% portatori, Femmine: 50% espresse',
    'pf_ar_result' => '100% portatori → incrocio fratelli per 25% espressione',
    'pf_dominant_result' => '50% dei discendenti portano {locus_name}',
    
    // Avvertenze
    'pf_warning_ino' => '⚠️ INO/Pallid: Limite consanguineità 2 generazioni',
    'pf_warning_fallow' => '⚠️ Fallow: Rischi per la salute da monitorare',
    'pf_warning_complex' => '⚠️ Tratto complesso (Tier {tier}): Richiede più generazioni',
    
    // Errori
    'pf_unsupported_target' => 'Tratto obiettivo non supportato: {target}',
    
    // Altro
    'pf_estimated_gen' => 'Generazioni stimate',

    // BreedingPlanner
    'bp_production_plan' => 'Piano di Produzione',
    'bp_recommended_top5' => 'Accoppiamenti Consigliati TOP5',
    'bp_probability' => 'Probabilità',
    'bp_f_value' => 'Valore F',
    'bp_estimated' => 'Stim.',
    'bp_same_sire_warning' => 'Tutti gli accoppiamenti usano lo stesso padre. I discendenti saranno fratellastri (F=12,5%). Considera l\'introduzione di nuove linee di sangue.',
    'bp_low_contribution' => 'Basso contributo all\'obiettivo',
    'bp_optimal_pair' => 'Coppia ottimale',
    'bp_possible' => 'Possibile',
    'bp_breeding_prohibited' => 'Allevamento vietato',
    'bp_ethics_warning' => 'Vietato nell\'allevamento purosangue',
    'bp_ethics_standard' => 'Standard Etici',
    'bp_ethics_description' => 'Le coppie con IC ≥12,5% sono escluse (regole purosangue)',

    // v7.1: Pianificazione multi-generazione
    'bp_gene_analysis' => 'Analisi Genetica',
    'bp_generations_needed' => 'Generazioni necessarie',
    'bp_missing_genes' => 'Geni mancanti',
    'bp_hetero_only' => 'solo eterozigote (fissabile in 1 gen)',
    'bp_split_only' => 'solo maschi portatori (esprimibile in 1 gen)',
    'bp_gene_absent' => 'assente (introduzione necessaria)',
    'bp_one_gen_possible' => 'Producibile in 1 generazione!',
    'bp_final_generation' => 'Generazione Finale (Obiettivo)',
    'bp_generation_n' => 'Generazione {n}',
    'bp_goal' => 'Obiettivo',
    'bp_use_intermediate' => 'Utilizzare uccelli delle generazioni precedenti',
    'bp_need_new_bird' => 'Necessario acquisire uccello con questo gene',
    'bp_fix_gene' => 'Fissare {gene} (omozigote)',
    'bp_introduce_gene' => 'Introdurre gene {gene}',
    'bp_express_slr' => 'Esprimere {gene} nella femmina',
    'bp_introduce_slr_gene' => 'Introdurre {gene} (legato al sesso)',
    'bp_breeding_plan' => 'Piano di Allevamento',
    'bp_open_in_familymap' => 'Apri in FamilyMap',

    // v7.1.1: Analisi combinazione
    'bp_combination_needed' => 'Combinazione genetica necessaria',
    'bp_genes_scattered' => '{scattered} geni sono su uccelli diversi. {gens} generazione(i) extra necessaria(e).',
    'bp_best_foundation' => 'Miglior uccello base',
    'bp_genes' => 'geni',

    // v7.3.15: Evitare la consanguineità
    'bp_same_parents_warning' => 'Tutti gli accoppiamenti usano gli stessi genitori. L\'ultima generazione sarà fratelli pieni (F=25%). Devono essere introdotte nuove linee di sangue.',
    'bp_same_parent_warning' => 'Tutti gli accoppiamenti condividono lo stesso {parent}. I discendenti dell\'ultima generazione saranno mezzi fratelli (F=12,5%). Considerare l\'introduzione di nuove linee di sangue.',
    'bp_shared_sire' => 'padre',
    'bp_shared_dam' => 'madre',
    'bp_half_sibling_warning' => 'I discendenti dell\'ultima generazione saranno mezzi fratelli (F=12,5%). Considerare l\'introduzione di nuove linee di sangue.',
    'bp_cousin_warning' => 'I discendenti dell\'ultima generazione saranno cugini (F≈6,25%). Accettabile ma considerare nuove linee di sangue per l\'allevamento a lungo termine.',

    // v7.2: Scenario di allevamento
    'pf_breeding_scenario' => 'Scenario di allevamento',
    'pf_required_genes' => 'Geni richiesti',
    'pf_phase_label' => 'Fase {n}',
    'pf_summary' => 'Riepilogo',
    'pf_any_male' => 'Qualsiasi maschio',
    'pf_any_female' => 'Qualsiasi femmina',
    'pf_expressing' => 'Individuo esprimente',
    'pf_expressing_female' => 'Femmina esprimente',
    'pf_wildtype' => 'Tipo selvatico',
    'pf_sf_individual' => 'Individuo SF',
    'pf_df_from_g1' => 'DF da G1',
    'pf_split_male' => 'Maschio portatore',
    'pf_split_from_g1' => 'Portatore da G1',
    'pf_split_male_from_g1' => 'Maschio portatore da G1',
    'pf_split_from_phase1' => 'Portatore da Fase 1',
    'pf_multi_split' => 'Portatore multi-gene',
    'pf_multi_split_or_expressing' => 'Portatore multi-gene o esprimente',
    'pf_with_genes' => 'portando {genes}',
    'pf_all_required_genes' => 'Portando tutti i geni richiesti',
    'pf_df_individual' => 'Individuo DF',
    'pf_scenario_wildtype' => 'Allevamento tipo selvatico',
    'pf_scenario_wildtype_desc' => 'Nessun gene aggiuntivo richiesto',
    'pf_scenario_green_result' => '100% Verde',
    'pf_scenario_wildtype_summary' => 'Verde × Verde dà 100% discendenti verdi',
    'pf_scenario_slr_phase1' => 'Creare maschio portatore {locus}',
    'pf_scenario_slr_phase2' => 'Produrre {locus} esprimente',
    'pf_scenario_slr_result1' => 'Maschi: 100% portatori {locus}',
    'pf_scenario_slr_result2' => '50% delle femmine esprime, 50% dei maschi sono portatori',
    'pf_scenario_slr_summary' => 'Obiettivo raggiungibile in 2 generazioni.',
    'pf_scenario_dom_phase1' => 'Creare individuo DF {locus}',
    'pf_scenario_dom_phase2' => 'Produrre l\'obiettivo',
    'pf_scenario_dom_result1' => '25% DF, 50% SF',
    'pf_scenario_dom_result2' => 'Usare individuo DF per produrre l\'obiettivo',
    'pf_scenario_dom_summary' => 'SF×SF dà 25% DF per l\'obiettivo.',
    'pf_scenario_simple' => 'Incrocio diretto',
    'pf_scenario_simple_result' => '{prob}% di possibilità di ottenere l\'obiettivo',
    'pf_scenario_simple_summary' => 'Obiettivo raggiungibile in 1 generazione.',
    'pf_scenario_ar_phase1' => 'Creare portatori {locus}',
    'pf_scenario_ar_phase2' => 'Fissare {locus} in omozigote',
    'pf_scenario_ar_result1' => 'Discendenti: 100% portatori {locus}',
    'pf_scenario_ar_result2' => '25% di possibilità di ottenere l\'obiettivo',
    'pf_scenario_ar_summary' => 'Prima esprimente × selvatico per portatori, poi portatori × portatori per 25% obiettivo.',
    'pf_phase_intro' => 'Introdurre stock di base',
    'pf_phase_intro_desc' => 'Acquisire uccelli con i geni richiesti ({genes})',
    'pf_phase_combine' => 'Combinare i geni',
    'pf_phase_combine_desc' => 'Incrociare uccelli con geni diversi',
    'pf_phase_final' => 'Produrre l\'obiettivo',
    'pf_phase_final_desc' => 'Incrociare individui con tutti i geni',
    'pf_introduce_autosomal' => 'Introdurre {locus} (autosomico)',
    'pf_introduce_slr_gene' => 'Introdurre {locus} (legato al sesso)',
    'pf_all_split' => 'Discendenti: 100% portatori',
    'pf_male_split_female_half' => 'Maschi: 100% portatori {locus}, Femmine: 50% esprimenti',
    'pf_combine_genes' => 'Combinare geni in un individuo',
    'pf_combine_result' => 'Ottenere portatori multi-gene',
    // v7.3.9: Scenari di mercato realistici (iniziare con individui esprimenti)
    'pf_phase_n_combine_direct' => 'Fase {n}: Incrociare individui esprimenti',
    'pf_phase_n_add_gene' => 'Fase {n}: Aggiungere {gene}',
    'pf_phase_n_final' => 'Fase {n}: Produzione dell\'obiettivo',
    'pf_acquire_and_cross_desc' => 'Acquisire e incrociare individui che esprimono {gene1} e {gene2}',
    'pf_cross_expressing' => 'Incrociare individui esprimenti',
    'pf_expressing_trait' => '{gene} esprimente',
    'pf_offspring_carry_both' => 'I discendenti portano {gene1} e {gene2} come portatori',
    'pf_add_expressing_desc' => 'Incrociare la generazione precedente con un individuo che esprime {gene}',
    'pf_some_carry_genes' => 'Alcuni discendenti portano {genes}',
    'pf_add_gene_to_line' => 'Aggiungere {gene}',
    'pf_carrying_genes' => 'Portatore di {genes}',
    'pf_final_cross' => 'Incrocio finale',
    'pf_final_result' => 'Appare il fenotipo obiettivo',
    'pf_final_note' => 'Per l\'obiettivo: tutti i geni devono essere omozigoti',
    'pf_scenario_multi_summary' => '{target} richiede circa {gens} generazioni. Geni: {genes}',
    'pf_lineage_advice' => '💡 Evitare la consanguineità: Crea 2 linee separate (linea paterna e materna) nella Fase 1-2, poi uniscile nella Fase 3 per evitare accoppiamenti tra fratelli/cugini.',
    'bp_planned_bird' => 'Pianificato',

    // v7.3.10: Disponibilità sul mercato
    'pf_avail_easy' => 'Facile',
    'pf_avail_normal' => 'Moderato',
    'pf_avail_difficult' => 'Difficile',
    'pf_avail_warning_difficult' => '⚠️ Difficile da ottenere',
    'pf_avail_note_difficult' => 'I seguenti colori sono rari e potrebbero richiedere tempo per l\'acquisizione',
    'pf_avail_warning_normal' => '※ Moderatamente raro',
    'pf_avail_note_normal' => 'I seguenti colori sono disponibili presso allevatori specializzati ma potrebbero richiedere tempi di attesa',
    'pf_avail_badge_difficult' => 'Raro',
    'pf_avail_badge_normal' => 'Non comune',

    // v7.3.14: Phase Inference Display (i18n compliant)
    'phase_inference_title' => 'Inferenza della Fase di Linkage',
    'phase_z_linked' => 'Linkage Z (cin-ino-op)',
    'phase_result' => 'Risultato:',
    'phase_z_cis' => 'Cis - cin-ino sullo stesso cromosoma',
    'phase_z_trans' => 'Trans - cin e ino su cromosomi diversi',
    'phase_confidence' => 'Confidenza:',
    'phase_evidence' => 'Evidenza:',
    'phase_z_cis_tip' => 'Con Cis: ~24% di probabilità di ottenere discendenti Lacewing (co-espressione cin+ino)',
    'phase_z_trans_tip' => 'Con Trans: i discendenti Lacewing sono rari (~1,5%, richiede ricombinazione)',
    'phase_auto_linked' => 'Linkage Autosomico (dark-parblue)',
    'phase_auto_cis' => 'Cis - D-aq/d-+ o d-aq/D-+',
    'phase_auto_trans' => 'Trans - D-+/d-aq',
];

// ============================================================
// スペイン語 (Spanish)
// ============================================================
$pf_es = [
    // Títulos de pasos
    'pf_wild_type' => 'Tipo Salvaje',
    'pf_wild_type_result' => 'El color base no requiere factores adicionales',
    'pf_introduce_slr' => 'Introducir factor {locus_name}',
    'pf_introduce_ar' => 'Introducir factor {locus_name} (Gen {gen})',
    'pf_introduce_dominant' => 'Introducir factor {locus_name}',
    
    // Descripciones de padres
    'pf_expressed_female' => 'Hembra expresada',
    
    // Descripciones de resultados
    'pf_slr_result' => 'Machos: 100% portadores, Hembras: 50% expresadas',
    'pf_ar_result' => '100% portadores → cruce hermanos para 25% expresión',
    'pf_dominant_result' => '50% de descendientes portan {locus_name}',
    
    // Advertencias
    'pf_warning_ino' => '⚠️ INO/Pallid: Límite consanguinidad 2 generaciones',
    'pf_warning_fallow' => '⚠️ Fallow: Riesgos de salud a vigilar',
    'pf_warning_complex' => '⚠️ Rasgo complejo (Tier {tier}): Requiere múltiples generaciones',
    
    // Errores
    'pf_unsupported_target' => 'Rasgo objetivo no soportado: {target}',
    
    // Otro
    'pf_estimated_gen' => 'Generaciones estimadas',

    // BreedingPlanner
    'bp_production_plan' => 'Plan de Producción',
    'bp_recommended_top5' => 'Apareamientos Recomendados TOP5',
    'bp_probability' => 'Probabilidad',
    'bp_f_value' => 'Valor F',
    'bp_estimated' => 'Est.',
    'bp_same_sire_warning' => 'Todos los apareamientos usan el mismo padre. Los descendientes serán medio hermanos (F=12,5%). Considere introducir nuevas líneas de sangre.',
    'bp_low_contribution' => 'Baja contribución al objetivo',
    'bp_optimal_pair' => 'Pareja óptima',
    'bp_possible' => 'Posible',
    'bp_breeding_prohibited' => 'Cría prohibida',
    'bp_ethics_warning' => 'Prohibido en la cría de pura sangre',
    'bp_ethics_standard' => 'Normas Éticas',
    'bp_ethics_description' => 'Los pares con IC ≥12,5% son excluidos (reglas pura sangre)',

    // v7.1: Planificación multi-generación
    'bp_gene_analysis' => 'Análisis Genético',
    'bp_generations_needed' => 'Generaciones necesarias',
    'bp_missing_genes' => 'Genes faltantes',
    'bp_hetero_only' => 'solo heterocigoto (fijable en 1 gen)',
    'bp_split_only' => 'solo machos portadores (expresable en 1 gen)',
    'bp_gene_absent' => 'ausente (introducción necesaria)',
    'bp_one_gen_possible' => '¡Producible en 1 generación!',
    'bp_final_generation' => 'Generación Final (Objetivo)',
    'bp_generation_n' => 'Generación {n}',
    'bp_goal' => 'Objetivo',
    'bp_use_intermediate' => 'Usar aves de generaciones anteriores',
    'bp_need_new_bird' => 'Necesario adquirir ave con este gen',
    'bp_fix_gene' => 'Fijar {gene} (homocigoto)',
    'bp_introduce_gene' => 'Introducir gen {gene}',
    'bp_express_slr' => 'Expresar {gene} en hembra',
    'bp_introduce_slr_gene' => 'Introducir {gene} (ligado al sexo)',
    'bp_breeding_plan' => 'Plan de Cría',
    'bp_open_in_familymap' => 'Abrir en FamilyMap',

    // v7.1.1: Análisis de combinación
    'bp_combination_needed' => 'Combinación genética necesaria',
    'bp_genes_scattered' => '{scattered} genes están en diferentes aves. {gens} generación(es) extra necesaria(s).',
    'bp_best_foundation' => 'Mejor ave base',
    'bp_genes' => 'genes',

    // v7.3.15: Evitar consanguinidad
    'bp_same_parents_warning' => 'Todos los apareamientos usan los mismos padres. La última generación serán hermanos completos (F=25%). Se deben introducir nuevas líneas de sangre.',
    'bp_same_parent_warning' => 'Todos los apareamientos comparten el mismo {parent}. Los descendientes de la última generación serán medio hermanos (F=12,5%). Considere introducir nuevas líneas de sangre.',
    'bp_shared_sire' => 'padre',
    'bp_shared_dam' => 'madre',
    'bp_half_sibling_warning' => 'Los descendientes de la última generación serán medio hermanos (F=12,5%). Considere introducir nuevas líneas de sangre.',
    'bp_cousin_warning' => 'Los descendientes de la última generación serán primos (F≈6,25%). Aceptable pero considere nuevas líneas de sangre para cría a largo plazo.',

    // v7.2: Escenario de cría
    'pf_breeding_scenario' => 'Escenario de cría',
    'pf_required_genes' => 'Genes requeridos',
    'pf_phase_label' => 'Fase {n}',
    'pf_summary' => 'Resumen',
    'pf_any_male' => 'Cualquier macho',
    'pf_any_female' => 'Cualquier hembra',
    'pf_expressing' => 'Individuo expresando',
    'pf_expressing_female' => 'Hembra expresando',
    'pf_wildtype' => 'Tipo salvaje',
    'pf_sf_individual' => 'Individuo SF',
    'pf_df_from_g1' => 'DF de G1',
    'pf_split_male' => 'Macho portador',
    'pf_split_from_g1' => 'Portador de G1',
    'pf_split_male_from_g1' => 'Macho portador de G1',
    'pf_split_from_phase1' => 'Portador de Fase 1',
    'pf_multi_split' => 'Portador multi-gen',
    'pf_multi_split_or_expressing' => 'Portador multi-gen o expresando',
    'pf_with_genes' => 'portando {genes}',
    'pf_all_required_genes' => 'Portando todos los genes requeridos',
    'pf_df_individual' => 'Individuo DF',
    'pf_scenario_wildtype' => 'Cría tipo salvaje',
    'pf_scenario_wildtype_desc' => 'No se requieren genes adicionales',
    'pf_scenario_green_result' => '100% Verde',
    'pf_scenario_wildtype_summary' => 'Verde × Verde da 100% descendientes verdes',
    'pf_scenario_slr_phase1' => 'Crear macho portador {locus}',
    'pf_scenario_slr_phase2' => 'Producir {locus} expresando',
    'pf_scenario_slr_result1' => 'Machos: 100% portadores {locus}',
    'pf_scenario_slr_result2' => '50% de las hembras expresan, 50% de los machos son portadores',
    'pf_scenario_slr_summary' => 'Objetivo alcanzable en 2 generaciones.',
    'pf_scenario_dom_phase1' => 'Crear individuo DF {locus}',
    'pf_scenario_dom_phase2' => 'Producir el objetivo',
    'pf_scenario_dom_result1' => '25% DF, 50% SF',
    'pf_scenario_dom_result2' => 'Usar individuo DF para producir el objetivo',
    'pf_scenario_dom_summary' => 'SF×SF da 25% DF para el objetivo.',
    'pf_scenario_simple' => 'Cruce directo',
    'pf_scenario_simple_result' => '{prob}% de probabilidad de obtener el objetivo',
    'pf_scenario_simple_summary' => 'Objetivo alcanzable en 1 generación.',
    'pf_scenario_ar_phase1' => 'Crear portadores {locus}',
    'pf_scenario_ar_phase2' => 'Fijar {locus} en homocigoto',
    'pf_scenario_ar_result1' => 'Descendientes: 100% portadores {locus}',
    'pf_scenario_ar_result2' => '25% de probabilidad de obtener el objetivo',
    'pf_scenario_ar_summary' => 'Primero expresando × salvaje para portadores, luego portadores × portadores para 25% objetivo.',
    'pf_phase_intro' => 'Introducir stock base',
    'pf_phase_intro_desc' => 'Adquirir aves con los genes requeridos ({genes})',
    'pf_phase_combine' => 'Combinar los genes',
    'pf_phase_combine_desc' => 'Cruzar aves con genes diferentes',
    'pf_phase_final' => 'Producir el objetivo',
    'pf_phase_final_desc' => 'Cruzar individuos con todos los genes',
    'pf_introduce_autosomal' => 'Introducir {locus} (autosómico)',
    'pf_introduce_slr_gene' => 'Introducir {locus} (ligado al sexo)',
    'pf_all_split' => 'Descendientes: 100% portadores',
    'pf_male_split_female_half' => 'Machos: 100% portadores {locus}, Hembras: 50% expresando',
    'pf_combine_genes' => 'Combinar genes en un individuo',
    'pf_combine_result' => 'Obtener portadores multi-gen',
    // v7.3.9: Escenarios de mercado realistas (comenzar con individuos expresando)
    'pf_phase_n_combine_direct' => 'Fase {n}: Cruzar individuos expresando',
    'pf_phase_n_add_gene' => 'Fase {n}: Agregar {gene}',
    'pf_phase_n_final' => 'Fase {n}: Producción del objetivo',
    'pf_acquire_and_cross_desc' => 'Adquirir y cruzar individuos que expresan {gene1} y {gene2}',
    'pf_cross_expressing' => 'Cruzar individuos expresando',
    'pf_expressing_trait' => '{gene} expresando',
    'pf_offspring_carry_both' => 'Los descendientes portan {gene1} y {gene2} como portadores',
    'pf_add_expressing_desc' => 'Cruzar la generación anterior con un individuo que expresa {gene}',
    'pf_some_carry_genes' => 'Algunos descendientes portan {genes}',
    'pf_add_gene_to_line' => 'Agregar {gene}',
    'pf_carrying_genes' => 'Portador de {genes}',
    'pf_final_cross' => 'Cruce final',
    'pf_final_result' => 'Aparece el fenotipo objetivo',
    'pf_final_note' => 'Para el objetivo: todos los genes deben ser homocigotos',
    'pf_scenario_multi_summary' => '{target} requiere aproximadamente {gens} generaciones. Genes: {genes}',
    'pf_lineage_advice' => '💡 Evitar endogamia: Cree 2 líneas separadas (línea paterna y materna) en la Fase 1-2, luego fusiónelas en la Fase 3 para evitar apareamiento entre hermanos/primos.',
    'bp_planned_bird' => 'Planificado',

    // v7.3.10: Disponibilidad en el mercado
    'pf_avail_easy' => 'Fácil',
    'pf_avail_normal' => 'Moderado',
    'pf_avail_difficult' => 'Difícil',
    'pf_avail_warning_difficult' => '⚠️ Difícil de obtener',
    'pf_avail_note_difficult' => 'Los siguientes colores son raros y pueden requerir tiempo para adquirirlos',
    'pf_avail_warning_normal' => '※ Moderadamente raro',
    'pf_avail_note_normal' => 'Los siguientes colores están disponibles en criadores especializados pero pueden requerir tiempo de espera',
    'pf_avail_badge_difficult' => 'Raro',
    'pf_avail_badge_normal' => 'Poco común',

    // v7.3.14: Phase Inference Display (i18n compliant)
    'phase_inference_title' => 'Inferencia de Fase de Ligamiento',
    'phase_z_linked' => 'Ligamiento Z (cin-ino-op)',
    'phase_result' => 'Resultado:',
    'phase_z_cis' => 'Cis - cin-ino en el mismo cromosoma',
    'phase_z_trans' => 'Trans - cin e ino en cromosomas diferentes',
    'phase_confidence' => 'Confianza:',
    'phase_evidence' => 'Evidencia:',
    'phase_z_cis_tip' => 'Con Cis: ~24% de probabilidad de obtener descendientes Lacewing (co-expresión cin+ino)',
    'phase_z_trans_tip' => 'Con Trans: los descendientes Lacewing son raros (~1,5%, requiere recombinación)',
    'phase_auto_linked' => 'Ligamiento Autosómico (dark-parblue)',
    'phase_auto_cis' => 'Cis - D-aq/d-+ o d-aq/D-+',
    'phase_auto_trans' => 'Trans - D-+/d-aq',
];
