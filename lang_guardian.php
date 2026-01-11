<?php
/**
 * @license CC BY-NC-SA 4.0
 * Commercial use strictly prohibited.
 * NPO/Educational use welcome.
 * 
 * 「制度は責任を放棄した。制度外がそれを果たす。」
 * 制度外文明・かならづプロジェクト
 *
 * Agapornis Gene-Forge v6.8
 * guardian.js専用 多言語辞書
 * 
 * @author Shohei Taniguchi
 */

$guardian_translations = [

// ============================================================
// 日本語 (Japanese)
// ============================================================
'ja' => [
    // --- BreedingValidator メッセージ ---
    'bv_danger' => '危険な配合です。生存率低下は不可避です。',
    'bv_warning' => '競走馬では禁忌とされる配合です',
    'bv_sex_male' => '父には♂を指定してください',
    'bv_sex_female' => '母には♀を指定してください',
    'bv_same_bird' => '同一個体です',
    'bv_pedigree_conflict' => 'その鳥は配置できません。個体の血統データを手動で変更してください。',
    
    // --- HealthGuardian INBREEDING_LIMITS reason ---
    'hg_ino_reason' => 'メラニン欠損による免疫脆弱化（ルチノー/クリーミノ/ピュアホワイト共通）',
    'hg_pallid_reason' => 'メラニン減少による免疫脆弱化',
    'hg_fallow_reason' => 'メラニン合成異常による虚弱化',
    'hg_dark_df_reason' => '体格縮小・繁殖能力低下',
    'hg_general_reason' => '活力低下',
    
    // --- HealthGuardian RISK_LEVELS label ---
    'risk_critical' => '危険',
    'risk_high' => '高リスク',
    'risk_moderate' => '注意',
    'risk_safe' => '安全',
    
    // --- INO系チェックメッセージ ---
    'ino_limit_exceeded' => '{type}系近親{gen}世代目 - 免疫崩壊リスク',
    'ino_limit_warning' => '{type}系近親{gen}世代目 - 次世代で限界到達',
    'ino_limit_detail' => '子の世代では別血統導入が必須',
    'ino_limit_action' => '別血統の{type}個体を導入してください',
    'ino_limit_action_plan' => '次世代繁殖前に別血統{type}個体の入手を計画',
    
    // --- パリッド系チェックメッセージ ---
    'pallid_limit_exceeded' => 'パリッド系近親{gen}世代目 - 虚弱化リスク',
    'pallid_limit_warning' => 'パリッド系近親{gen}世代目 - 次世代で限界',
    'pallid_limit_detail' => '子の世代では別血統導入が必須',
    'pallid_limit_action' => '別血統のパリッド個体を導入してください',
    'pallid_limit_action_plan' => '次世代繁殖前に別血統パリッド個体の入手を計画',
    
    // --- ファロー系チェックメッセージ ---
    'fallow_limit_exceeded' => 'Fallow系近親{gen}世代目 - 虚弱化固定リスク',
    'fallow_limit_warning' => 'Fallow系近親{gen}世代目 - 次世代で限界',
    'fallow_limit_detail' => '虚弱化が固定するリスク',
    'fallow_limit_action' => '別血統のFallow個体を導入してください',
    'fallow_limit_action_plan' => '別血統Fallow個体の入手を検討',
    
    // --- ダークDF蓄積チェック ---
    'dark_df_message' => 'DF×DF交配 - 体格縮小リスク',
    'dark_df_detail' => '全ての子がDF(D/D)となり、体格縮小の傾向',
    'dark_df_action' => 'SF/ライト個体の導入を推奨',
    
    // --- 近交係数チェック ---
    'f_critical_message' => '近交係数 F={f}% - 繁殖禁止レベル',
    'f_critical_detail' => '親子または全兄弟間に相当',
    'f_critical_action' => '完全に異なる血統の個体を導入してください',
    'f_high_message' => '近交係数 F={f}% - 高リスク',
    'f_high_detail' => '半兄弟間に相当',
    'f_high_action' => '別血統の導入を強く推奨',
    'f_moderate_message' => '近交係数 F={f}%',
    'f_moderate_detail' => 'いとこ間に相当',
    'f_moderate_action' => '継続的な血統管理が必要',
    
    // --- 多重スプリット交配 ---
    'multi_split_message' => '多重スプリット交配 ({m}×{f})',
    'multi_split_detail' => '予測困難な結果や虚弱個体が生じるリスク',
    'multi_split_action' => '目標形質を絞り込み、段階的に固定化',
    
    // --- 一般形質制限 ---
    'general_limit_message' => '一般形質{gen}世代目',
    'general_limit_detail' => '活力低下の可能性',
    'general_limit_action' => '血統全体のリフレッシュを検討',
    
    // --- サマリー ---
    'summary_blocked' => '⛔ 繁殖非推奨: {msg}',
    'summary_no_breed' => '繁殖非推奨',
    'summary_caution' => '注意',
    'summary_high' => '⚠️ 高リスク: {msg}',
    'summary_moderate' => '⚡ 注意事項あり',
    'summary_safe' => '✓ 健康リスク: 低',
    
    // --- needsRefresh ---
    'refresh_ino' => 'INO系（ルチノー/クリーミノ/ピュアホワイト）2世代到達',
    'refresh_pallid' => 'パリッド系2世代到達',
    'refresh_fallow' => 'Fallow系2世代到達',
    'refresh_general' => '一般形質4世代到達',
    
    // --- INO系色名フォールバック ---
    'color_pure_white' => 'ピュアホワイト',
    'color_creamino' => 'クリーミノ',
    'color_creamino_seagreen' => 'クリーミノシーグリーン',
    'color_lutino' => 'ルチノー',
    
    // --- 確定/推定ステータス ---
    'status_confirmed' => '✓確定',
    'status_estimated' => '?推定',
],

// ============================================================
// 英語 (English)
// ============================================================
'en' => [
    // --- BreedingValidator メッセージ ---
    'bv_danger' => 'Dangerous pairing. Survival rate reduction is inevitable.',
    'bv_warning' => 'This pairing is prohibited in thoroughbred breeding',
    'bv_sex_male' => 'Please specify a male for the sire',
    'bv_sex_female' => 'Please specify a female for the dam',
    'bv_same_bird' => 'Same individual',
    'bv_pedigree_conflict' => 'Cannot place this bird. Please manually modify the pedigree data.',
    
    // --- HealthGuardian INBREEDING_LIMITS reason ---
    'hg_ino_reason' => 'Immune weakness due to melanin deficiency (Lutino/Creamino/Pure White)',
    'hg_pallid_reason' => 'Immune weakness due to melanin reduction',
    'hg_fallow_reason' => 'Weakness due to melanin synthesis abnormality',
    'hg_dark_df_reason' => 'Size reduction and decreased breeding ability',
    'hg_general_reason' => 'Decreased vitality',
    
    // --- HealthGuardian RISK_LEVELS label ---
    'risk_critical' => 'Critical',
    'risk_high' => 'High Risk',
    'risk_moderate' => 'Caution',
    'risk_safe' => 'Safe',
    
    // --- INO系チェックメッセージ ---
    'ino_limit_exceeded' => '{type} line inbreeding gen {gen} - Immune collapse risk',
    'ino_limit_warning' => '{type} line inbreeding gen {gen} - Limit reached next generation',
    'ino_limit_detail' => 'Introducing different bloodline is mandatory for offspring',
    'ino_limit_action' => 'Please introduce {type} birds from a different bloodline',
    'ino_limit_action_plan' => 'Plan to acquire {type} birds from different bloodline before next breeding',
    
    // --- パリッド系チェックメッセージ ---
    'pallid_limit_exceeded' => 'Pallid line inbreeding gen {gen} - Weakness risk',
    'pallid_limit_warning' => 'Pallid line inbreeding gen {gen} - Limit next generation',
    'pallid_limit_detail' => 'Introducing different bloodline is mandatory for offspring',
    'pallid_limit_action' => 'Please introduce Pallid birds from a different bloodline',
    'pallid_limit_action_plan' => 'Plan to acquire Pallid birds from different bloodline',
    
    // --- ファロー系チェックメッセージ ---
    'fallow_limit_exceeded' => 'Fallow line inbreeding gen {gen} - Weakness fixation risk',
    'fallow_limit_warning' => 'Fallow line inbreeding gen {gen} - Limit next generation',
    'fallow_limit_detail' => 'Risk of weakness becoming fixed',
    'fallow_limit_action' => 'Please introduce Fallow birds from a different bloodline',
    'fallow_limit_action_plan' => 'Consider acquiring Fallow birds from different bloodline',
    
    // --- ダークDF蓄積チェック ---
    'dark_df_message' => 'DF×DF breeding - Size reduction risk',
    'dark_df_detail' => 'All offspring will be DF (D/D) with size reduction tendency',
    'dark_df_action' => 'Recommend introducing SF/Light birds',
    
    // --- 近交係数チェック ---
    'f_critical_message' => 'Inbreeding coefficient F={f}% - Breeding prohibited level',
    'f_critical_detail' => 'Equivalent to parent-child or full siblings',
    'f_critical_action' => 'Please introduce birds from completely different bloodline',
    'f_high_message' => 'Inbreeding coefficient F={f}% - High risk',
    'f_high_detail' => 'Equivalent to half siblings',
    'f_high_action' => 'Strongly recommend introducing different bloodline',
    'f_moderate_message' => 'Inbreeding coefficient F={f}%',
    'f_moderate_detail' => 'Equivalent to cousins',
    'f_moderate_action' => 'Continuous bloodline management required',
    
    // --- 多重スプリット交配 ---
    'multi_split_message' => 'Multi-split breeding ({m}×{f})',
    'multi_split_detail' => 'Risk of unpredictable results or weak individuals',
    'multi_split_action' => 'Narrow down target traits and fix gradually',
    
    // --- 一般形質制限 ---
    'general_limit_message' => 'General traits gen {gen}',
    'general_limit_detail' => 'Possible decrease in vitality',
    'general_limit_action' => 'Consider refreshing the entire bloodline',
    
    // --- サマリー ---
    'summary_blocked' => '⛔ Breeding not recommended: {msg}',
    'summary_no_breed' => 'Breeding not recommended',
    'summary_caution' => 'Caution',
    'summary_high' => '⚠️ High risk: {msg}',
    'summary_moderate' => '⚡ Caution required',
    'summary_safe' => '✓ Health risk: Low',
    
    // --- needsRefresh ---
    'refresh_ino' => 'INO line (Lutino/Creamino/Pure White) reached 2 generations',
    'refresh_pallid' => 'Pallid line reached 2 generations',
    'refresh_fallow' => 'Fallow line reached 2 generations',
    'refresh_general' => 'General traits reached 4 generations',
    
    // --- INO系色名フォールバック ---
    'color_pure_white' => 'Pure White',
    'color_creamino' => 'Creamino',
    'color_creamino_seagreen' => 'Creamino Seagreen',
    'color_lutino' => 'Lutino',
    
    // --- 確定/推定ステータス ---
    'status_confirmed' => '✓Confirmed',
    'status_estimated' => '?Estimated',
],

// ============================================================
// ドイツ語 (German)
// ============================================================
'de' => [
    // --- BreedingValidator メッセージ ---
    'bv_danger' => 'Gefährliche Verpaarung. Reduzierung der Überlebensrate ist unvermeidlich.',
    'bv_warning' => 'Diese Verpaarung ist in der Vollblutzucht verboten',
    'bv_sex_male' => 'Bitte geben Sie ein Männchen als Vater an',
    'bv_sex_female' => 'Bitte geben Sie ein Weibchen als Mutter an',
    'bv_same_bird' => 'Gleiches Individuum',
    'bv_pedigree_conflict' => 'Dieser Vogel kann nicht platziert werden. Bitte ändern Sie die Stammbaumdaten manuell.',
    
    // --- HealthGuardian INBREEDING_LIMITS reason ---
    'hg_ino_reason' => 'Immunschwäche durch Melaninmangel (Lutino/Creamino/Reinweiß)',
    'hg_pallid_reason' => 'Immunschwäche durch Melaninreduktion',
    'hg_fallow_reason' => 'Schwäche durch Melaninsynthesestörung',
    'hg_dark_df_reason' => 'Größenreduktion und verminderte Zuchtfähigkeit',
    'hg_general_reason' => 'Verminderte Vitalität',
    
    // --- HealthGuardian RISK_LEVELS label ---
    'risk_critical' => 'Kritisch',
    'risk_high' => 'Hohes Risiko',
    'risk_moderate' => 'Vorsicht',
    'risk_safe' => 'Sicher',
    
    // --- INO系チェックメッセージ ---
    'ino_limit_exceeded' => '{type}-Linie Inzucht Gen {gen} - Immunkollapsgefahr',
    'ino_limit_warning' => '{type}-Linie Inzucht Gen {gen} - Limit nächste Generation erreicht',
    'ino_limit_detail' => 'Einführung anderer Blutlinie für Nachkommen obligatorisch',
    'ino_limit_action' => 'Bitte führen Sie {type}-Vögel aus anderer Blutlinie ein',
    'ino_limit_action_plan' => 'Planen Sie den Erwerb von {type}-Vögeln aus anderer Blutlinie vor der nächsten Zucht',
    
    // --- パリッド系チェックメッセージ ---
    'pallid_limit_exceeded' => 'Pallid-Linie Inzucht Gen {gen} - Schwächerisiko',
    'pallid_limit_warning' => 'Pallid-Linie Inzucht Gen {gen} - Limit nächste Generation',
    'pallid_limit_detail' => 'Einführung anderer Blutlinie für Nachkommen obligatorisch',
    'pallid_limit_action' => 'Bitte führen Sie Pallid-Vögel aus anderer Blutlinie ein',
    'pallid_limit_action_plan' => 'Planen Sie den Erwerb von Pallid-Vögeln aus anderer Blutlinie',
    
    // --- ファロー系チェックメッセージ ---
    'fallow_limit_exceeded' => 'Fallow-Linie Inzucht Gen {gen} - Schwächefixierungsrisiko',
    'fallow_limit_warning' => 'Fallow-Linie Inzucht Gen {gen} - Limit nächste Generation',
    'fallow_limit_detail' => 'Risiko der Schwächefixierung',
    'fallow_limit_action' => 'Bitte führen Sie Fallow-Vögel aus anderer Blutlinie ein',
    'fallow_limit_action_plan' => 'Erwägen Sie den Erwerb von Fallow-Vögeln aus anderer Blutlinie',
    
    // --- ダークDF蓄積チェック ---
    'dark_df_message' => 'DF×DF Zucht - Größenreduktionsrisiko',
    'dark_df_detail' => 'Alle Nachkommen werden DF (D/D) mit Größenreduktionstendenz',
    'dark_df_action' => 'Empfehlen Sie die Einführung von SF/Light-Vögeln',
    
    // --- 近交係数チェック ---
    'f_critical_message' => 'Inzuchtkoeffizient F={f}% - Zuchtverbot',
    'f_critical_detail' => 'Entspricht Eltern-Kind oder Vollgeschwistern',
    'f_critical_action' => 'Bitte führen Sie Vögel aus völlig anderer Blutlinie ein',
    'f_high_message' => 'Inzuchtkoeffizient F={f}% - Hohes Risiko',
    'f_high_detail' => 'Entspricht Halbgeschwistern',
    'f_high_action' => 'Dringend empfohlen andere Blutlinie einzuführen',
    'f_moderate_message' => 'Inzuchtkoeffizient F={f}%',
    'f_moderate_detail' => 'Entspricht Cousins',
    'f_moderate_action' => 'Kontinuierliche Blutlinienführung erforderlich',
    
    // --- 多重スプリット交配 ---
    'multi_split_message' => 'Multi-Split-Zucht ({m}×{f})',
    'multi_split_detail' => 'Risiko unvorhersehbarer Ergebnisse oder schwacher Individuen',
    'multi_split_action' => 'Zielmerkmal eingrenzen und schrittweise fixieren',
    
    // --- 一般形質制限 ---
    'general_limit_message' => 'Allgemeine Merkmale Gen {gen}',
    'general_limit_detail' => 'Mögliche Vitalitätsabnahme',
    'general_limit_action' => 'Erwägen Sie eine Auffrischung der gesamten Blutlinie',
    
    // --- サマリー ---
    'summary_blocked' => '⛔ Zucht nicht empfohlen: {msg}',
    'summary_no_breed' => 'Zucht nicht empfohlen',
    'summary_caution' => 'Vorsicht',
    'summary_high' => '⚠️ Hohes Risiko: {msg}',
    'summary_moderate' => '⚡ Vorsicht erforderlich',
    'summary_safe' => '✓ Gesundheitsrisiko: Niedrig',
    
    // --- needsRefresh ---
    'refresh_ino' => 'INO-Linie (Lutino/Creamino/Reinweiß) hat 2 Generationen erreicht',
    'refresh_pallid' => 'Pallid-Linie hat 2 Generationen erreicht',
    'refresh_fallow' => 'Fallow-Linie hat 2 Generationen erreicht',
    'refresh_general' => 'Allgemeine Merkmale haben 4 Generationen erreicht',
    
    // --- INO系色名フォールバック ---
    'color_pure_white' => 'Reinweiß',
    'color_creamino' => 'Creamino',
    'color_creamino_seagreen' => 'Creamino Seagrün',
    'color_lutino' => 'Lutino',
    
    // --- 確定/推定ステータス ---
    'status_confirmed' => '✓Bestätigt',
    'status_estimated' => '?Geschätzt',
],

// ============================================================
// フランス語 (French)
// ============================================================
'fr' => [
    // --- BreedingValidator メッセージ ---
    'bv_danger' => 'Accouplement dangereux. La réduction du taux de survie est inévitable.',
    'bv_warning' => 'Cet accouplement est interdit dans l\'élevage de pur-sang',
    'bv_sex_male' => 'Veuillez spécifier un mâle comme père',
    'bv_sex_female' => 'Veuillez spécifier une femelle comme mère',
    'bv_same_bird' => 'Même individu',
    'bv_pedigree_conflict' => 'Impossible de placer cet oiseau. Veuillez modifier manuellement les données du pedigree.',
    
    // --- HealthGuardian INBREEDING_LIMITS reason ---
    'hg_ino_reason' => 'Faiblesse immunitaire due à une déficience en mélanine (Lutino/Creamino/Blanc pur)',
    'hg_pallid_reason' => 'Faiblesse immunitaire due à une réduction de mélanine',
    'hg_fallow_reason' => 'Faiblesse due à une anomalie de synthèse de mélanine',
    'hg_dark_df_reason' => 'Réduction de taille et diminution de la capacité de reproduction',
    'hg_general_reason' => 'Diminution de la vitalité',
    
    // --- HealthGuardian RISK_LEVELS label ---
    'risk_critical' => 'Critique',
    'risk_high' => 'Risque élevé',
    'risk_moderate' => 'Prudence',
    'risk_safe' => 'Sûr',
    
    // --- INO系チェックメッセージ ---
    'ino_limit_exceeded' => 'Lignée {type} consanguinité gén {gen} - Risque d\'effondrement immunitaire',
    'ino_limit_warning' => 'Lignée {type} consanguinité gén {gen} - Limite atteinte prochaine génération',
    'ino_limit_detail' => 'L\'introduction d\'une autre lignée est obligatoire pour la descendance',
    'ino_limit_action' => 'Veuillez introduire des oiseaux {type} d\'une autre lignée',
    'ino_limit_action_plan' => 'Planifiez l\'acquisition d\'oiseaux {type} d\'une autre lignée avant la prochaine reproduction',
    
    // --- パリッド系チェックメッセージ ---
    'pallid_limit_exceeded' => 'Lignée Pallid consanguinité gén {gen} - Risque de faiblesse',
    'pallid_limit_warning' => 'Lignée Pallid consanguinité gén {gen} - Limite prochaine génération',
    'pallid_limit_detail' => 'L\'introduction d\'une autre lignée est obligatoire pour la descendance',
    'pallid_limit_action' => 'Veuillez introduire des oiseaux Pallid d\'une autre lignée',
    'pallid_limit_action_plan' => 'Planifiez l\'acquisition d\'oiseaux Pallid d\'une autre lignée',
    
    // --- ファロー系チェックメッセージ ---
    'fallow_limit_exceeded' => 'Lignée Fallow consanguinité gén {gen} - Risque de fixation de faiblesse',
    'fallow_limit_warning' => 'Lignée Fallow consanguinité gén {gen} - Limite prochaine génération',
    'fallow_limit_detail' => 'Risque de fixation de la faiblesse',
    'fallow_limit_action' => 'Veuillez introduire des oiseaux Fallow d\'une autre lignée',
    'fallow_limit_action_plan' => 'Envisagez l\'acquisition d\'oiseaux Fallow d\'une autre lignée',
    
    // --- ダークDF蓄積チェック ---
    'dark_df_message' => 'Élevage DF×DF - Risque de réduction de taille',
    'dark_df_detail' => 'Toute la descendance sera DF (D/D) avec tendance à la réduction de taille',
    'dark_df_action' => 'Recommandé d\'introduire des oiseaux SF/Light',
    
    // --- 近交係数チェック ---
    'f_critical_message' => 'Coefficient de consanguinité F={f}% - Niveau d\'interdiction de reproduction',
    'f_critical_detail' => 'Équivalent à parent-enfant ou frères/sœurs complets',
    'f_critical_action' => 'Veuillez introduire des oiseaux d\'une lignée complètement différente',
    'f_high_message' => 'Coefficient de consanguinité F={f}% - Risque élevé',
    'f_high_detail' => 'Équivalent à demi-frères/sœurs',
    'f_high_action' => 'Fortement recommandé d\'introduire une lignée différente',
    'f_moderate_message' => 'Coefficient de consanguinité F={f}%',
    'f_moderate_detail' => 'Équivalent à cousins',
    'f_moderate_action' => 'Gestion continue de la lignée requise',
    
    // --- 多重スプリット交配 ---
    'multi_split_message' => 'Élevage multi-split ({m}×{f})',
    'multi_split_detail' => 'Risque de résultats imprévisibles ou d\'individus faibles',
    'multi_split_action' => 'Affiner les traits cibles et fixer progressivement',
    
    // --- 一般形質制限 ---
    'general_limit_message' => 'Traits généraux gén {gen}',
    'general_limit_detail' => 'Possible diminution de la vitalité',
    'general_limit_action' => 'Envisagez de rafraîchir toute la lignée',
    
    // --- サマリー ---
    'summary_blocked' => '⛔ Élevage non recommandé: {msg}',
    'summary_no_breed' => 'Élevage non recommandé',
    'summary_caution' => 'Prudence',
    'summary_high' => '⚠️ Risque élevé: {msg}',
    'summary_moderate' => '⚡ Prudence requise',
    'summary_safe' => '✓ Risque santé: Faible',
    
    // --- needsRefresh ---
    'refresh_ino' => 'Lignée INO (Lutino/Creamino/Blanc pur) a atteint 2 générations',
    'refresh_pallid' => 'Lignée Pallid a atteint 2 générations',
    'refresh_fallow' => 'Lignée Fallow a atteint 2 générations',
    'refresh_general' => 'Traits généraux ont atteint 4 générations',
    
    // --- INO系色名フォールバック ---
    'color_pure_white' => 'Blanc pur',
    'color_creamino' => 'Creamino',
    'color_creamino_seagreen' => 'Creamino Vert de mer',
    'color_lutino' => 'Lutino',
    
    // --- 確定/推定ステータス ---
    'status_confirmed' => '✓Confirmé',
    'status_estimated' => '?Estimé',
],

// ============================================================
// イタリア語 (Italian)
// ============================================================
'it' => [
    // --- BreedingValidator メッセージ ---
    'bv_danger' => 'Accoppiamento pericoloso. La riduzione del tasso di sopravvivenza è inevitabile.',
    'bv_warning' => 'Questo accoppiamento è vietato nell\'allevamento di purosangue',
    'bv_sex_male' => 'Per favore specifica un maschio come padre',
    'bv_sex_female' => 'Per favore specifica una femmina come madre',
    'bv_same_bird' => 'Stesso individuo',
    'bv_pedigree_conflict' => 'Impossibile posizionare questo uccello. Per favore modifica manualmente i dati del pedigree.',
    
    // --- HealthGuardian INBREEDING_LIMITS reason ---
    'hg_ino_reason' => 'Debolezza immunitaria per carenza di melanina (Lutino/Creamino/Bianco puro)',
    'hg_pallid_reason' => 'Debolezza immunitaria per riduzione di melanina',
    'hg_fallow_reason' => 'Debolezza per anomalia nella sintesi della melanina',
    'hg_dark_df_reason' => 'Riduzione delle dimensioni e diminuzione della capacità riproduttiva',
    'hg_general_reason' => 'Diminuzione della vitalità',
    
    // --- HealthGuardian RISK_LEVELS label ---
    'risk_critical' => 'Critico',
    'risk_high' => 'Alto rischio',
    'risk_moderate' => 'Cautela',
    'risk_safe' => 'Sicuro',
    
    // --- INO系チェックメッセージ ---
    'ino_limit_exceeded' => 'Linea {type} consanguineità gen {gen} - Rischio di collasso immunitario',
    'ino_limit_warning' => 'Linea {type} consanguineità gen {gen} - Limite raggiunto prossima generazione',
    'ino_limit_detail' => 'L\'introduzione di altra linea è obbligatoria per la prole',
    'ino_limit_action' => 'Per favore introduci uccelli {type} da un\'altra linea',
    'ino_limit_action_plan' => 'Pianifica l\'acquisizione di uccelli {type} da altra linea prima del prossimo allevamento',
    
    // --- パリッド系チェックメッセージ ---
    'pallid_limit_exceeded' => 'Linea Pallid consanguineità gen {gen} - Rischio di debolezza',
    'pallid_limit_warning' => 'Linea Pallid consanguineità gen {gen} - Limite prossima generazione',
    'pallid_limit_detail' => 'L\'introduzione di altra linea è obbligatoria per la prole',
    'pallid_limit_action' => 'Per favore introduci uccelli Pallid da un\'altra linea',
    'pallid_limit_action_plan' => 'Pianifica l\'acquisizione di uccelli Pallid da altra linea',
    
    // --- ファロー系チェックメッセージ ---
    'fallow_limit_exceeded' => 'Linea Fallow consanguineità gen {gen} - Rischio di fissazione debolezza',
    'fallow_limit_warning' => 'Linea Fallow consanguineità gen {gen} - Limite prossima generazione',
    'fallow_limit_detail' => 'Rischio di fissazione della debolezza',
    'fallow_limit_action' => 'Per favore introduci uccelli Fallow da un\'altra linea',
    'fallow_limit_action_plan' => 'Considera l\'acquisizione di uccelli Fallow da altra linea',
    
    // --- ダークDF蓄積チェック ---
    'dark_df_message' => 'Allevamento DF×DF - Rischio riduzione dimensioni',
    'dark_df_detail' => 'Tutta la prole sarà DF (D/D) con tendenza alla riduzione delle dimensioni',
    'dark_df_action' => 'Raccomandato introdurre uccelli SF/Light',
    
    // --- 近交係数チェック ---
    'f_critical_message' => 'Coefficiente consanguineità F={f}% - Livello di divieto riproduzione',
    'f_critical_detail' => 'Equivalente a genitore-figlio o fratelli pieni',
    'f_critical_action' => 'Per favore introduci uccelli da linea completamente diversa',
    'f_high_message' => 'Coefficiente consanguineità F={f}% - Alto rischio',
    'f_high_detail' => 'Equivalente a mezzi fratelli',
    'f_high_action' => 'Fortemente raccomandato introdurre linea diversa',
    'f_moderate_message' => 'Coefficiente consanguineità F={f}%',
    'f_moderate_detail' => 'Equivalente a cugini',
    'f_moderate_action' => 'Richiesta gestione continua della linea',
    
    // --- 多重スプリット交配 ---
    'multi_split_message' => 'Allevamento multi-split ({m}×{f})',
    'multi_split_detail' => 'Rischio di risultati imprevedibili o individui deboli',
    'multi_split_action' => 'Restringere i tratti obiettivo e fissare gradualmente',
    
    // --- 一般形質制限 ---
    'general_limit_message' => 'Tratti generali gen {gen}',
    'general_limit_detail' => 'Possibile diminuzione della vitalità',
    'general_limit_action' => 'Considera di rinfrescare l\'intera linea',
    
    // --- サマリー ---
    'summary_blocked' => '⛔ Allevamento non raccomandato: {msg}',
    'summary_no_breed' => 'Allevamento non raccomandato',
    'summary_caution' => 'Cautela',
    'summary_high' => '⚠️ Alto rischio: {msg}',
    'summary_moderate' => '⚡ Cautela richiesta',
    'summary_safe' => '✓ Rischio salute: Basso',
    
    // --- needsRefresh ---
    'refresh_ino' => 'Linea INO (Lutino/Creamino/Bianco puro) ha raggiunto 2 generazioni',
    'refresh_pallid' => 'Linea Pallid ha raggiunto 2 generazioni',
    'refresh_fallow' => 'Linea Fallow ha raggiunto 2 generazioni',
    'refresh_general' => 'Tratti generali hanno raggiunto 4 generazioni',
    
    // --- INO系色名フォールバック ---
    'color_pure_white' => 'Bianco puro',
    'color_creamino' => 'Creamino',
    'color_creamino_seagreen' => 'Creamino Verde mare',
    'color_lutino' => 'Lutino',
    
    // --- 確定/推定ステータス ---
    'status_confirmed' => '✓Confermato',
    'status_estimated' => '?Stimato',
],

// ============================================================
// スペイン語 (Spanish)
// ============================================================
'es' => [
    // --- BreedingValidator メッセージ ---
    'bv_danger' => 'Apareamiento peligroso. La reducción de la tasa de supervivencia es inevitable.',
    'bv_warning' => 'Este apareamiento está prohibido en la cría de pura sangre',
    'bv_sex_male' => 'Por favor especifique un macho como padre',
    'bv_sex_female' => 'Por favor especifique una hembra como madre',
    'bv_same_bird' => 'Mismo individuo',
    'bv_pedigree_conflict' => 'No se puede colocar este ave. Por favor modifique manualmente los datos del pedigrí.',
    
    // --- HealthGuardian INBREEDING_LIMITS reason ---
    'hg_ino_reason' => 'Debilidad inmune por deficiencia de melanina (Lutino/Creamino/Blanco puro)',
    'hg_pallid_reason' => 'Debilidad inmune por reducción de melanina',
    'hg_fallow_reason' => 'Debilidad por anomalía en la síntesis de melanina',
    'hg_dark_df_reason' => 'Reducción de tamaño y disminución de la capacidad reproductiva',
    'hg_general_reason' => 'Disminución de la vitalidad',
    
    // --- HealthGuardian RISK_LEVELS label ---
    'risk_critical' => 'Crítico',
    'risk_high' => 'Alto riesgo',
    'risk_moderate' => 'Precaución',
    'risk_safe' => 'Seguro',
    
    // --- INO系チェックメッセージ ---
    'ino_limit_exceeded' => 'Línea {type} consanguinidad gen {gen} - Riesgo de colapso inmune',
    'ino_limit_warning' => 'Línea {type} consanguinidad gen {gen} - Límite alcanzado próxima generación',
    'ino_limit_detail' => 'Introducir otra línea es obligatorio para la descendencia',
    'ino_limit_action' => 'Por favor introduzca aves {type} de otra línea',
    'ino_limit_action_plan' => 'Planifique adquirir aves {type} de otra línea antes de la próxima cría',
    
    // --- パリッド系チェックメッセージ ---
    'pallid_limit_exceeded' => 'Línea Pallid consanguinidad gen {gen} - Riesgo de debilidad',
    'pallid_limit_warning' => 'Línea Pallid consanguinidad gen {gen} - Límite próxima generación',
    'pallid_limit_detail' => 'Introducir otra línea es obligatorio para la descendencia',
    'pallid_limit_action' => 'Por favor introduzca aves Pallid de otra línea',
    'pallid_limit_action_plan' => 'Planifique adquirir aves Pallid de otra línea',
    
    // --- ファロー系チェックメッセージ ---
    'fallow_limit_exceeded' => 'Línea Fallow consanguinidad gen {gen} - Riesgo de fijación de debilidad',
    'fallow_limit_warning' => 'Línea Fallow consanguinidad gen {gen} - Límite próxima generación',
    'fallow_limit_detail' => 'Riesgo de fijación de la debilidad',
    'fallow_limit_action' => 'Por favor introduzca aves Fallow de otra línea',
    'fallow_limit_action_plan' => 'Considere adquirir aves Fallow de otra línea',
    
    // --- ダークDF蓄積チェック ---
    'dark_df_message' => 'Cría DF×DF - Riesgo de reducción de tamaño',
    'dark_df_detail' => 'Toda la descendencia será DF (D/D) con tendencia a reducción de tamaño',
    'dark_df_action' => 'Recomendado introducir aves SF/Light',
    
    // --- 近交係数チェック ---
    'f_critical_message' => 'Coeficiente consanguinidad F={f}% - Nivel de prohibición de cría',
    'f_critical_detail' => 'Equivalente a padre-hijo o hermanos completos',
    'f_critical_action' => 'Por favor introduzca aves de línea completamente diferente',
    'f_high_message' => 'Coeficiente consanguinidad F={f}% - Alto riesgo',
    'f_high_detail' => 'Equivalente a medio hermanos',
    'f_high_action' => 'Fuertemente recomendado introducir línea diferente',
    'f_moderate_message' => 'Coeficiente consanguinidad F={f}%',
    'f_moderate_detail' => 'Equivalente a primos',
    'f_moderate_action' => 'Requiere gestión continua de línea',
    
    // --- 多重スプリット交配 ---
    'multi_split_message' => 'Cría multi-split ({m}×{f})',
    'multi_split_detail' => 'Riesgo de resultados impredecibles o individuos débiles',
    'multi_split_action' => 'Reducir rasgos objetivo y fijar gradualmente',
    
    // --- 一般形質制限 ---
    'general_limit_message' => 'Rasgos generales gen {gen}',
    'general_limit_detail' => 'Posible disminución de la vitalidad',
    'general_limit_action' => 'Considere refrescar toda la línea',
    
    // --- サマリー ---
    'summary_blocked' => '⛔ Cría no recomendada: {msg}',
    'summary_no_breed' => 'Cría no recomendada',
    'summary_caution' => 'Precaución',
    'summary_high' => '⚠️ Alto riesgo: {msg}',
    'summary_moderate' => '⚡ Precaución requerida',
    'summary_safe' => '✓ Riesgo salud: Bajo',
    
    // --- needsRefresh ---
    'refresh_ino' => 'Línea INO (Lutino/Creamino/Blanco puro) alcanzó 2 generaciones',
    'refresh_pallid' => 'Línea Pallid alcanzó 2 generaciones',
    'refresh_fallow' => 'Línea Fallow alcanzó 2 generaciones',
    'refresh_general' => 'Rasgos generales alcanzaron 4 generaciones',
    
    // --- INO系色名フォールバック ---
    'color_pure_white' => 'Blanco puro',
    'color_creamino' => 'Creamino',
    'color_creamino_seagreen' => 'Creamino Verde mar',
    'color_lutino' => 'Lutino',
    
    // --- 確定/推定ステータス ---
    'status_confirmed' => '✓Confirmado',
    'status_estimated' => '?Estimado',
],

];

/**
 * Guardian用言語辞書を取得
 * @return array 現在の言語のGuardian翻訳辞書
 */
function getGuardianLangDict(): array {
    global $guardian_translations;
    $lang = getLang();
    return $guardian_translations[$lang] ?? $guardian_translations['ja'];
}

/**
 * Guardian用翻訳を取得
 * @param string $key 翻訳キー
 * @return string 翻訳されたテキスト
 */
function tg(string $key): string {
    global $guardian_translations;
    $lang = getLang();
    return $guardian_translations[$lang][$key] ?? $guardian_translations['ja'][$key] ?? $key;
}
