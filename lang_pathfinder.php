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
    'bp_low_contribution' => 'Geringer Beitrag zum Ziel',
    'bp_optimal_pair' => 'Optimales Paar',
    'bp_possible' => 'Möglich',
    'bp_breeding_prohibited' => 'Zucht verboten',
    'bp_ethics_warning' => 'In der Vollblutzucht verboten',
    'bp_ethics_standard' => 'Ethische Standards',
    'bp_ethics_description' => 'Paare mit IC ≥12,5% werden ausgeschlossen (Vollblutregeln)',
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
    'bp_low_contribution' => 'Faible contribution à l\'objectif',
    'bp_optimal_pair' => 'Paire optimale',
    'bp_possible' => 'Possible',
    'bp_breeding_prohibited' => 'Élevage interdit',
    'bp_ethics_warning' => 'Interdit dans l\'élevage pur-sang',
    'bp_ethics_standard' => 'Normes Éthiques',
    'bp_ethics_description' => 'Les paires avec IC ≥12,5% sont exclues (règles pur-sang)',
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
    'bp_low_contribution' => 'Basso contributo all\'obiettivo',
    'bp_optimal_pair' => 'Coppia ottimale',
    'bp_possible' => 'Possibile',
    'bp_breeding_prohibited' => 'Allevamento vietato',
    'bp_ethics_warning' => 'Vietato nell\'allevamento purosangue',
    'bp_ethics_standard' => 'Standard Etici',
    'bp_ethics_description' => 'Le coppie con IC ≥12,5% sono escluse (regole purosangue)',
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
    'bp_low_contribution' => 'Baja contribución al objetivo',
    'bp_optimal_pair' => 'Pareja óptima',
    'bp_possible' => 'Posible',
    'bp_breeding_prohibited' => 'Cría prohibida',
    'bp_ethics_warning' => 'Prohibido en la cría de pura sangre',
    'bp_ethics_standard' => 'Normas Éticas',
    'bp_ethics_description' => 'Los pares con IC ≥12,5% son excluidos (reglas pura sangre)',
];
