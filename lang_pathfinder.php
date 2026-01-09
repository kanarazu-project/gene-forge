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
    'pf_target' => '目標',
    'pf_min_generations' => '最短世代数',
    'pf_no_steps' => 'ノーマル（green）から直接得られます',
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
    'pf_target' => 'Target',
    'pf_min_generations' => 'Minimum generations',
    'pf_no_steps' => 'Achievable directly from Normal (green)',
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
    'pf_target' => 'Ziel',
    'pf_min_generations' => 'Mindestgenerationen',
    'pf_no_steps' => 'Direkt vom Wildtyp (Grün) erreichbar',
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
    'pf_target' => 'Cible',
    'pf_min_generations' => 'Générations minimum',
    'pf_no_steps' => 'Réalisable directement à partir du type sauvage (vert)',
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
    'pf_target' => 'Obiettivo',
    'pf_min_generations' => 'Generazioni minime',
    'pf_no_steps' => 'Raggiungibile direttamente dal tipo selvatico (verde)',
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
    'pf_target' => 'Objetivo',
    'pf_min_generations' => 'Generaciones mínimas',
    'pf_no_steps' => 'Alcanzable directamente desde tipo salvaje (verde)',
];
