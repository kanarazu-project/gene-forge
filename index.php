<?php
/**
 * @license CC BY-NC-SA 4.0
 * Commercial use strictly prohibited.
 * NPO/Educational use welcome.
 * 
 * 「制度は責任を放棄した。制度外がそれを果たす。」
 * 制度外文明・かならづプロジェクト
 *
 * Agapornis Gene-Forge v7.0
 * 連鎖遺伝（Linkage Genetics）対応版
 * FamilyEstimator V3 搭載
 * ALBS Peachfaced部門準拠版
 * 
 * v6.7.3 → v6.7.4 変更点:
 * - 全ハードコードをt()関数呼び出しに統一
 * - 多言語対応基盤整備
 */
require_once 'genetics.php';
require_once 'lang.php';

$lang = getLang();
// セキュリティ: langパラメータをホワイトリストで検証
if (isset($_GET['lang']) && in_array($_GET['lang'], ['ja', 'en', 'de', 'fr', 'it', 'es'], true)) {
    setcookie('lang', $_GET['lang'], [
        'expires' => time() + 86400 * 365,
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

/**
 * 共通：表現型選択肢を生成
 * 全画面で統一された選択肢を使用
 * v6.7.4: 全ラベルをt()関数経由に変更
 */
function renderPhenotypeSelect(string $prefix, string $field, bool $isJa = true, string $selected = ''): string {
    if ($field === 'baseColor') {
        $grouped = AgapornisLoci::groupedByCategory();
        $html = '<select name="' . $prefix . '_' . $field . '" class="form-select">';
        foreach ($grouped as $category => $colors) {
            $html .= '<optgroup label="' . htmlspecialchars(AgapornisLoci::categoryLabel($category, $isJa)) . '">';
            foreach ($colors as $key => $data) {
                $label = $isJa ? $data['ja'] : $data['en'];
                $sel = ($selected === $key) ? ' selected' : '';
                $html .= '<option value="' . $key . '"' . $sel . '>' . htmlspecialchars($label) . '</option>';
            }
            $html .= '</optgroup>';
        }
        $html .= '</select>';
        return $html;
    }    
    switch ($field) {
        case 'eyeColor':
            $sel = function($v) use ($selected) { return $selected === $v ? ' selected' : ''; };
            return '<select name="' . $prefix . '_eyeColor" class="form-select">
                <option value="black"' . $sel('black') . '>' . t('eye_black') . '</option>
                <option value="red"' . $sel('red') . '>' . t('eye_red') . '</option>
                <option value="plum"' . $sel('plum') . '>' . t('eye_plum') . '</option>
            </select>';
            
        case 'darkness':
            $sel = function($v) use ($selected) { return $selected === $v ? ' selected' : ''; };
            return '<select name="' . $prefix . '_darkness" class="form-select">
                <option value="none"' . $sel('none') . '>' . t('dark_none') . '</option>
                <option value="sf"' . $sel('sf') . '>' . t('dark_sf') . '</option>
                <option value="df"' . $sel('df') . '>' . t('dark_df') . '</option>
                <option value="unknown"' . $sel('unknown') . '>' . t('unknown') . '</option>
            </select>';
    }
    return '';
}
$result = null;
$familyResult = null;
$action = $_POST['action'] ?? '';
$activeTab = 'birddb';

if ($action === 'calculate') {
    $calculator = new GeneticsCalculator();
    $result = $calculator->calculateOffspring($_POST);
    $activeTab = 'feasibility';
} elseif ($action === 'pathfind') {
    $pathfinder = new PathFinder();
    $result = $pathfinder->findPath($_POST['target'] ?? '');
    $activeTab = 'pathfinder';
} elseif ($action === 'estimate') {
    $estimator = new GenotypeEstimator();
    $result = $estimator->estimate(
        $_POST['sex'] ?? 'male',
        $_POST['est_baseColor'] ?? 'green',
        $_POST['est_eyeColor'] ?? 'black',
        $_POST['est_darkness'] ?? 'none',
        $lang === 'ja'
    );
    $activeTab = 'estimator';
} elseif ($action === 'family_infer') {
    $familyEstimator = new FamilyEstimatorV3();
    $rawJson = $_POST['familyData'] ?? '{}';
    $familyData = json_decode($rawJson, true);
    $targetPosition = $_POST['targetPosition'] ?? '';
    // JSON検証: デコード失敗または不正な構造をチェック
    if (json_last_error() !== JSON_ERROR_NONE) {
        $familyResult = ['error' => 'Invalid JSON data'];
    } elseif (!is_array($familyData)) {
        $familyResult = ['error' => 'Invalid data structure'];
    } elseif ($familyData && $targetPosition) {
        $familyResult = $familyEstimator->estimate($familyData, $targetPosition);
    } else {
        $familyResult = ['error' => t('select_target')];
    }
    $activeTab = 'family';
}
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>🦜 Gene-Forge v7.0</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Noto+Sans+JP:wght@300;400;500;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css?v=674">
    <style>
        /* ロービジ対策：明るい文字色 */
        .guide-item p{color:#b8c0cc !important}
        .guide-item strong{color:#fff !important}
        .section-label{color:#b8c0cc !important}
        .slot-label{color:#99aabb !important}
        .bird-details{color:#aabbcc !important}
        .empty-hint{color:#99aabb !important}
        .target-display{color:#b8c0cc !important}
        .connector-row{color:#8899aa !important}
        
        /* グローバルモード切替（アプリ全体のヘッダー直下） */
        .global-mode-switch{display:flex;align-items:center;justify-content:center;gap:1rem;padding:1rem 1.5rem;background:#1a1f26;border-radius:10px;margin:0 auto 1.5rem;max-width:400px;border:2px solid #444}
        .global-mode-switch .mode-label{font-size:1.1rem;color:#fff;font-weight:bold}
        .global-mode-switch .mode-btn{padding:.7rem 1.5rem;border-radius:8px;font-size:1rem;font-weight:bold;cursor:pointer;border:2px solid #666;transition:all .2s;background:#2d333b;color:#fff}
        .global-mode-switch .mode-btn:hover{background:#3d444d;border-color:#888}
        .global-mode-switch .mode-btn.active{background:linear-gradient(135deg,#00ffcc,#00d4aa);color:#000;border-color:#00ffcc;box-shadow:0 0 12px rgba(0,255,204,.5);font-weight:900}
        
        /* モード切替バー（最上段） - 明るく見やすく */
        .mode-switch-bar{display:flex;align-items:center;gap:1rem;padding:1rem 1.5rem;background:#1a1f26;border-radius:10px;margin-bottom:1.5rem;border:2px solid #444}
        .mode-switch-bar .mode-label{font-size:1.1rem;color:#fff;font-weight:bold}
        .mode-switch-bar .mode-btn{padding:.7rem 1.5rem;border-radius:8px;font-size:1rem;font-weight:bold;cursor:pointer;border:2px solid #666;transition:all .2s;background:#2d333b;color:#fff}
        .mode-switch-bar .mode-btn:hover{background:#3d444d;border-color:#888}
        .mode-switch-bar .mode-btn.active{background:linear-gradient(135deg,#00ffcc,#00d4aa);color:#000;border-color:#00ffcc;box-shadow:0 0 12px rgba(0,255,204,.5);font-weight:900}
        
        .family-map-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem}
        .family-map-header h2{margin:0}
        .family-map-actions-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.4rem;max-width:220px}
        .family-section{padding:1rem;background:var(--bg-tertiary);border-radius:8px;margin-bottom:1rem}
        .family-section.paternal{border-top:3px solid #4a90d9}
        .family-section.maternal{border-bottom:3px solid #d94a8c}
        .family-section.offspring{border-left:3px solid var(--accent-turquoise)}
        .section-label{font-weight:bold;font-size:.85rem;margin-bottom:.5rem}
        .generation{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;margin:.5rem 0}
        .connector-row{text-align:center;font-size:.9rem}
        .bird-slot{background:var(--bg-card);border:1px solid var(--border-color);border-radius:6px;padding:.5rem;min-width:100px;max-width:140px;cursor:pointer;transition:all .2s;position:relative}
        .bird-slot:hover{border-color:var(--accent-turquoise)}
        .bird-slot.is-target{border-color:gold;box-shadow:0 0 8px rgba(255,215,0,.5)}
        .bird-slot.empty{border-style:dashed;opacity:.7}
        .slot-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.25rem}
        .slot-label{font-size:.7rem}
        .btn-clear{background:none;border:none;color:#e74c3c;cursor:pointer;font-size:.8rem;padding:0}
        .slot-empty-content{text-align:center;padding:.5rem 0}
        .slot-empty-content select{font-size:.75rem;padding:.2rem}
        .empty-hint{display:block;font-size:.65rem;margin-top:.25rem}
        .slot-filled-content{text-align:center}
        .bird-sex{font-size:1.2rem;color:#fff}
        .bird-pheno{font-size:.8rem;font-weight:bold;color:#e8e8e8}
        .bird-details{font-size:.65rem}
        .bird-name{font-size:.7rem;color:var(--accent-turquoise);margin-top:.2rem}
        .slot-actions{display:flex;justify-content:center;gap:.25rem;margin-top:.3rem}
        .btn-mini{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:4px;padding:.15rem .3rem;font-size:.7rem;cursor:pointer;color:#ccc}
        .btn-mini:hover{background:var(--bg-tertiary)}
        .offspring-grid{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center}
        .family-map-footer{margin-top:1rem;text-align:center}
        .target-display{margin-bottom:.5rem}
        .target-display strong{color:gold}
        .result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem}
        .locus-card{background:var(--bg-tertiary);border-radius:8px;padding:.75rem}
        .locus-card.confirmed{border-left:3px solid var(--success)}
        .locus-card.uncertain{border-left:3px solid var(--warning)}
        .locus-name{font-weight:bold;color:var(--accent-blue);font-size:.85rem}
        .candidate-item{display:flex;justify-content:space-between;font-size:.8rem;padding:.2rem 0;border-bottom:1px solid var(--border-color);color:#e0e0e0}
        .candidate-item:last-child{border-bottom:none}
        .candidate-geno{font-family:'JetBrains Mono',monospace;color:#fff}
        .candidate-prob{color:#aaa}
        .candidate-prob.high{color:var(--success);font-weight:bold}
        .candidate-item.low-prob{opacity:.6;font-size:.75rem}
        .test-item{background:var(--bg-tertiary);border-radius:6px;padding:.75rem;margin-bottom:.5rem;color:#e0e0e0}
        .test-locus{font-weight:bold;color:var(--accent-turquoise)}
        .modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);z-index:1000;justify-content:center;align-items:center}
        .modal.active{display:flex}
        .modal-content{background:var(--bg-card);border-radius:12px;padding:1.5rem;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;color:#e0e0e0}
        .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
        .modal-close{background:none;border:none;font-size:1.5rem;cursor:pointer;color:#aaa}
        .modal-content .form-group{margin-bottom:1rem}
        .modal-content .form-group label{display:block;margin-bottom:.3rem;color:#e0e0e0;font-size:.9rem}
        .modal-content .form-group select,.modal-content .form-group input{width:100%;padding:.6rem;background:#1a2535;border:1px solid #3a4555;border-radius:6px;color:#fff;font-size:1rem}
        .modal-content .form-group select:focus,.modal-content .form-group input:focus{border-color:var(--accent-turquoise);outline:none}
        .modal-content .btn-group{display:flex;gap:.5rem;margin-top:1.5rem}
        .modal-content .btn{padding:.6rem 1.2rem;border-radius:6px;cursor:pointer;font-size:.9rem}
        .modal-content .btn-primary{background:var(--accent-turquoise);color:#000;border:none}
        .modal-content .btn-outline{background:transparent;color:#aaa;border:1px solid #555}
        .saved-map-item{display:flex;justify-content:space-between;align-items:center;padding:.5rem;border-bottom:1px solid var(--border-color);color:#e0e0e0}
        
        /* 親型配合結果推論用 */
        .parent-block{margin-bottom:1.5rem;padding:1rem;background:rgba(255,255,255,.03);border-radius:8px}
        .parent-block h3{margin:0 0 .75rem 0;color:#fff}
        .input-mode-toggle{display:flex;gap:1.5rem;margin-bottom:1rem}
        .input-mode-toggle label{display:flex;align-items:center;gap:.4rem;color:#ccc;cursor:pointer;font-size:.9rem}
        .input-mode-toggle input[type="radio"]{accent-color:var(--accent-turquoise)}
        .input-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.75rem}
        .input-panel .form-group{margin:0}
        .input-panel .form-group label{display:block;font-size:.8rem;color:#aaa;margin-bottom:.25rem}
        .input-panel .form-group select{width:100%;padding:.5rem;background:#1a2535;border:1px solid #3a4555;border-radius:4px;color:#fff;font-size:.85rem}
        
        /* フッター */
        .footer-credits{margin-top:2rem;padding:1rem;text-align:center}
        .footer-credits summary{cursor:pointer;color:#888;font-size:.9rem}
        .footer-credits summary:hover{color:#4ecdc4}
        .credits-content{margin-top:1rem;padding:1rem;background:var(--bg-card);border-radius:8px;text-align:left}
        .credits-content p{margin:.3rem 0;color:#ccc;font-size:.85rem}
        
        /* 健康評価 */
        .health-recommendations ul{list-style:none;padding:0}
        .health-recommendations li{padding:.75rem;margin:.5rem 0;background:var(--bg-tertiary);border-radius:6px;border-left:3px solid #666}
        .health-recommendations li.urgency-critical{border-left-color:#ef4444}
        .health-recommendations li.urgency-high{border-left-color:#f59e0b}
        .health-recommendations li.urgency-moderate{border-left-color:#eab308}
        .health-recommendations strong{color:#fff}
        .rec-detail{display:block;font-size:.85rem;color:#888;margin-top:.25rem}
        
        /* 個体管理 */
        .header-actions{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0}
        .db-stats{margin:1rem 0;padding:.75rem;background:var(--bg-tertiary);border-radius:6px}
        .search-bar{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0}
        .search-bar input,.search-bar select{padding:.5rem;background:#1a2535;border:1px solid #3a4555;border-radius:4px;color:#fff}
        .bird-list{display:grid;gap:.5rem}
        .dropdown{position:relative;display:inline-block}
        .dropdown-menu{display:none;position:absolute;background:var(--bg-card);border:1px solid var(--border-color);border-radius:4px;z-index:100}
        .dropdown:hover .dropdown-menu{display:block}
        .dropdown-menu button{display:block;width:100%;padding:.5rem 1rem;background:none;border:none;color:#fff;text-align:left;cursor:pointer}
        .dropdown-menu button:hover{background:var(--bg-tertiary)}
        .section-title{color:#4ecdc4;margin:1rem 0 .5rem;font-size:.9rem}
        .genotype-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:.5rem}
        
        /* 言語切り替え - 左上固定 */
        .lang-switch{position:absolute;top:1rem;left:1rem;display:flex;gap:.25rem;background:var(--bg-surface);border-radius:8px;padding:4px;border:1px solid var(--border-subtle);z-index:10}
        .lang-switch a{color:#888;text-decoration:none;padding:.4rem .8rem;border-radius:6px;font-size:.8rem}
        .lang-switch a:hover{color:#4ecdc4;background:rgba(78,205,196,.1)}
        .lang-switch a.active{color:#000;background:linear-gradient(135deg,#00e5ff,#00ffc8)}
        header{position:relative;padding-top:4.5rem}
        
        /* カスタム確認ダイアログ */
        .custom-confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;justify-content:center;align-items:center;z-index:10000}
        .custom-confirm-modal{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:1.5rem;max-width:90%;width:320px;box-shadow:0 8px 32px rgba(0,0,0,.5)}
        .custom-confirm-message{color:var(--text-primary);margin-bottom:1.5rem;line-height:1.5;white-space:pre-line}
        .custom-confirm-buttons{display:flex;gap:.75rem;justify-content:flex-end}
        .custom-confirm-buttons button{padding:.6rem 1.2rem;border-radius:8px;font-size:.9rem;cursor:pointer;border:none;transition:all .2s}
        .btn-confirm-ok{background:linear-gradient(135deg,#00e5ff,#00ffc8);color:#000}
        .btn-confirm-ok:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,229,255,.4)}
        .btn-confirm-cancel{background:var(--bg-elevated);color:var(--text-secondary);border:1px solid var(--border-subtle)}
        .btn-confirm-cancel:hover{background:var(--bg-surface)}
        .custom-prompt-input{width:100%;padding:.75rem;border-radius:8px;border:1px solid var(--border-subtle);background:var(--bg-elevated);color:var(--text-primary);font-size:1rem;margin-bottom:1rem}
        .custom-prompt-input:focus{outline:none;border-color:#00e5ff}
        .custom-select-modal{width:360px}
        .custom-select-options{max-height:300px;overflow-y:auto;margin-bottom:1rem}
        .custom-select-option{padding:.75rem 1rem;border-radius:8px;cursor:pointer;transition:all .2s;color:var(--text-primary)}
        .custom-select-option:hover{background:rgba(0,229,255,.15);color:#00e5ff}
        .version-tag{position:absolute;top:1rem;right:1rem;font-size:.75rem;color:#888;font-family:'JetBrains Mono',monospace}
    </style>
    <script>
    // フォーム送信制御フラグ
    window._allowSubmit = false;
    
    /**
     * グローバル確認ダイアログ（ブラウザのconfirm()を置き換え）
     * 「ダイアログを表示しない」オプションを排除
     * v6.7.4: ボタンラベルをT辞書から取得
     */
    function customConfirm(message) {
        return new Promise((resolve) => {
            const existing = document.getElementById('customConfirmOverlay');
            if (existing) existing.remove();
            
            const overlay = document.createElement('div');
            overlay.id = 'customConfirmOverlay';
            overlay.className = 'custom-confirm-overlay';
            overlay.innerHTML = `
                <div class="custom-confirm-modal">
                    <div class="custom-confirm-message">${message}</div>
                    <div class="custom-confirm-buttons">
                        <button type="button" class="btn-confirm-cancel">${T.cancel}</button>
                        <button type="button" class="btn-confirm-ok">${T.ok}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            const okBtn = overlay.querySelector('.btn-confirm-ok');
            const cancelBtn = overlay.querySelector('.btn-confirm-cancel');
            
            const cleanup = (result) => {
                overlay.remove();
                resolve(result);
            };
            
            okBtn.addEventListener('click', () => cleanup(true));
            cancelBtn.addEventListener('click', () => cleanup(false));
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cleanup(false);
            });
            
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', escHandler);
                    cleanup(false);
                }
            };
            document.addEventListener('keydown', escHandler);
            
            okBtn.focus();
        });
    }
    
    /**
     * グローバル入力ダイアログ（ブラウザのprompt()を置き換え）
     * v6.7.4: ボタンラベルをT辞書から取得
     */
    function customPrompt(message, defaultValue = '') {
        return new Promise((resolve) => {
            const existing = document.getElementById('customPromptOverlay');
            if (existing) existing.remove();
            
            const overlay = document.createElement('div');
            overlay.id = 'customPromptOverlay';
            overlay.className = 'custom-confirm-overlay';
            overlay.innerHTML = `
                <div class="custom-confirm-modal custom-prompt-modal">
                    <div class="custom-confirm-message">${message}</div>
                    <input type="text" class="custom-prompt-input" value="${defaultValue.replace(/"/g, '&quot;')}">
                    <div class="custom-confirm-buttons">
                        <button type="button" class="btn-confirm-cancel">${T.cancel}</button>
                        <button type="button" class="btn-confirm-ok">${T.ok}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            const input = overlay.querySelector('.custom-prompt-input');
            const okBtn = overlay.querySelector('.btn-confirm-ok');
            const cancelBtn = overlay.querySelector('.btn-confirm-cancel');
            
            const cleanup = (result) => {
                overlay.remove();
                resolve(result);
            };
            
            okBtn.addEventListener('click', () => cleanup(input.value));
            cancelBtn.addEventListener('click', () => cleanup(null));
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cleanup(null);
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') cleanup(input.value);
                if (e.key === 'Escape') cleanup(null);
            });
            
            input.focus();
            input.select();
        });
    }
    
    /**
     * グローバル選択ダイアログ（リストから選択）
     * v6.7.4: ボタンラベルをT辞書から取得
     */
    function customSelect(message, options) {
        return new Promise((resolve) => {
            const existing = document.getElementById('customSelectOverlay');
            if (existing) existing.remove();
            
            const overlay = document.createElement('div');
            overlay.id = 'customSelectOverlay';
            overlay.className = 'custom-confirm-overlay';
            
            const optionsHtml = options.map((opt, i) => 
                `<div class="custom-select-option" data-index="${i}">${i + 1}. ${opt.label || opt}</div>`
            ).join('');
            
            overlay.innerHTML = `
                <div class="custom-confirm-modal custom-select-modal">
                    <div class="custom-confirm-message">${message}</div>
                    <div class="custom-select-options">${optionsHtml}</div>
                    <div class="custom-confirm-buttons">
                        <button type="button" class="btn-confirm-cancel">${T.cancel}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            const cancelBtn = overlay.querySelector('.btn-confirm-cancel');
            const optionEls = overlay.querySelectorAll('.custom-select-option');
            
            const cleanup = (result) => {
                overlay.remove();
                resolve(result);
            };
            
            optionEls.forEach(el => {
                el.addEventListener('click', () => {
                    cleanup(parseInt(el.dataset.index));
                });
            });
            
            cancelBtn.addEventListener('click', () => cleanup(null));
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cleanup(null);
            });
            
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', escHandler);
                    cleanup(null);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    }
    </script>
    <script>
    // v6.8修正: T辞書を先に定義（customConfirm等で使用）
    const LANG = '<?= $lang ?>';
    const T = <?= json_encode(getLangDict()) ?>;
    // v7.0: guardian.js等からwindow.Tでアクセス可能にする
    window.T = T;

    // XSS対策: HTMLエスケープ関数
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
    }

    // SSOT: genetics.php から注入
    const COLOR_LABELS = <?= json_encode(AgapornisLoci::labels($lang === 'ja')) ?>;
    const COLOR_MASTER = <?= json_encode(AgapornisLoci::COLOR_DEFINITIONS) ?>;
    const LABEL_TO_KEY = <?= json_encode(AgapornisLoci::labelToKey($lang === 'ja')) ?>;
const COLOR_GROUPED = <?= json_encode(AgapornisLoci::groupedKeys()) ?>;
const CATEGORY_LABELS = <?= json_encode(AgapornisLoci::categoryLabels($lang === 'ja')) ?>;
const LOCI_MASTER = <?= json_encode(AgapornisLoci::LOCI) ?>;
const GENOTYPE_OPTIONS = <?= json_encode(AgapornisLoci::GENOTYPE_OPTIONS) ?>;
const UI_GENOTYPE_LOCI = <?= json_encode(AgapornisLoci::UI_GENOTYPE_LOCI) ?>;
// v7.0: 連鎖遺伝用定数
const LINKAGE_GROUPS = <?= json_encode(AgapornisLoci::LINKAGE_GROUPS) ?>;
const RECOMBINATION_RATES = <?= json_encode(AgapornisLoci::RECOMBINATION_RATES) ?>;
const INDEPENDENT_LOCI = <?= json_encode(AgapornisLoci::INDEPENDENT_LOCI) ?>;
</script>
</head>

<body>

    <div class="bg-grid"></div>
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>
    <div id="app-container">
        <header>
<div class="lang-switch">
    <a href="?lang=ja" class="<?= $lang === 'ja' ? 'active' : '' ?>">日本語</a>
    <a href="?lang=en" class="<?= $lang === 'en' ? 'active' : '' ?>">EN</a>
    <a href="?lang=de" class="<?= $lang === 'de' ? 'active' : '' ?>">DE</a>
    <a href="?lang=fr" class="<?= $lang === 'fr' ? 'active' : '' ?>">FR</a>
    <a href="?lang=it" class="<?= $lang === 'it' ? 'active' : '' ?>">IT</a>
    <a href="?lang=es" class="<?= $lang === 'es' ? 'active' : '' ?>">ES</a>
</div>
                        <span class="version-tag"><?= t('version') ?><br><a href="README.md" style="color:#666;font-size:.65rem;text-decoration:none;">README</a></span>
            <h1 class="logo">🦜 GENE-FORGE</h1>
<p class="app-subtitle"><?= t('subtitle') ?></p>
<span class="version-badge"><?= t('coming_soon') ?> | ALBS<?= t('compliant') ?></span>
        </header>
        <!-- アプリ全体のモード切替（アカウント相当） -->
        <div id="globalModeSwitch" class="global-mode-switch">
            <span class="mode-label"><?= t('mode') ?>:</span>
            <button id="modeBtnDemo" class="mode-btn" onclick="BirdDB.setMode('demo')">🎮 <?= t('demo_mode') ?></button>
            <button id="modeBtnUser" class="mode-btn active" onclick="BirdDB.setMode('user')">👤 <?= t('user_mode') ?></button>
        </div>
        
        <div class="card guide-card">
            <div class="guide-grid">
                <div class="guide-item clickable" onclick="showTab('birddb')"><strong>📁 <?= t('tab0') ?></strong><p><?= t('tab0_func') ?></p></div>
                <div class="guide-item clickable" onclick="showTab('health')"><strong>🛡️ <?= t('tab6') ?></strong><p><?= t('tab6_func') ?></p></div>
                <div class="guide-item clickable" onclick="showTab('planner')"><strong>🎯 <?= t('tab5') ?></strong><p><?= t('tab5_func') ?></p></div>
                <div class="guide-item clickable" onclick="showTab('pathfinder')"><strong>🧭 <?= t('tab1') ?></strong><p><?= t('tab1_func') ?></p></div>
                <div class="guide-item clickable" onclick="showTab('feasibility')"><strong>🧬 <?= t('tab2') ?></strong><p><?= t('tab2_func') ?></p></div>
                <div class="guide-item clickable" onclick="showTab('estimator')"><strong>🔬 <?= t('tab3') ?></strong><p><?= t('tab3_func') ?></p></div>
                <div class="guide-item clickable" onclick="showTab('family')"><strong>👨‍👩‍👧‍👦 <?= t('tab7') ?></strong><p><?= t('tab7_func') ?></p></div>
            </div>
        </div>
        <main>
            <section id="family" class="tab-content<?= $activeTab === 'family' ? ' active' : '' ?>">
                <div class="card"><div id="familyMapContainer"></div></div>
                <div id="inbreedingWarning"></div>
                <div id="family-result">
                <?php if ($familyResult && !isset($familyResult['error'])): ?>
                <div class="output-panel" style="margin-top:1rem;">
                    <div class="output-header"><span class="output-title">🧬 <?= t('result_title') ?></span></div>
                    <div style="text-align:center;padding:1rem;"><div><?= t('overall_confidence') ?></div><div style="font-size:2rem;font-family:Orbitron;color:var(--accent-turquoise);"><?= $familyResult['overallConfidence'] ?>%</div></div>
                    <div class="result-grid">
                        <?php foreach ($familyResult['loci'] as $locus): ?>
                        <div class="locus-card <?= $locus['isConfirmed']?'confirmed':'uncertain' ?>">
                            <div class="locus-name"><?= htmlspecialchars($locus['locusName']) ?></div>
                        <?php foreach ($locus['candidates'] as $c): ?>
                            <div class="candidate-item <?= $c['probability']<5?'low-prob':'' ?>">
                                <span class="candidate-geno"><?= htmlspecialchars($c['genotype']) ?></span>
                                <span class="candidate-prob <?= $c['probability']>=90?'high':'' ?>"><?= $c['probability'] ?>%<?= !empty($c['expectedRatio']) ? ' ('.$c['expectedRatio'].')' : '' ?></span>
                            </div>
                            <?php endforeach; ?>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php if (!empty($familyResult['testBreedings'])): ?>
                    <h4 style="margin-top:1.5rem;color:#fff;">🧪 <?= t('test_breeding_proposal') ?></h4>
                    <?php foreach ($familyResult['testBreedings'] as $tb): ?>
                    <div class="test-item">
                        <div class="test-locus"><?= htmlspecialchars(t($tb['locus']) ?: ucfirst($tb['locus'])) ?></div>
                        <div style="margin:.5rem 0;">
                            <strong style="color:#4ecdc4;"><?= t('recommendation') ?>:</strong>
                            <span style="color:#ddd;"><?= htmlspecialchars($tb['recommendation'] ?? '') ?></span>
                        </div>
                        <div style="margin-top:.75rem;padding:.5rem;background:rgba(0,0,0,.2);border-radius:4px;">
                            <div style="font-size:.85rem;color:#aaa;margin-bottom:.3rem;"><?= t('determination_by_offspring') ?>:</div>
                            <div style="font-size:.85rem;color:#ddd;padding:.2rem 0;"><?= htmlspecialchars($tb['expectedResult'] ?? '') ?></div>
                            <?php if (!empty($tb['minOffspring'])): ?>
                            <div style="font-size:.8rem;color:#888;margin-top:.3rem;">
                                (<?= $lang === 'ja' ? '推奨子数: ' . $tb['minOffspring'] . '羽以上' : 'Recommended offspring: ' . $tb['minOffspring'] . '+' ?>)
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                    <?php endif; ?>
                </div>
                <?php elseif ($familyResult && isset($familyResult['error'])): ?>
                <div class="output-panel"><div class="warning-box"><?= htmlspecialchars($familyResult['error']) ?></div></div>
                <?php endif; ?>
                </div>
            </section>

            <!-- Tab 0: 個体DB (v5.15.1完全復元) -->
            <section id="birddb" class="tab-content<?= $activeTab === 'birddb' ? ' active' : '' ?>">
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🗂️</div>
                        <div>
                            <h2 class="card-title"><?= t('bird_management') ?></h2>
                            <p class="card-subtitle"><?= t('bird_management_desc') ?></p>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button type="button" class="btn btn-small btn-primary" onclick="openBirdForm()">➕ <?= t('add_bird') ?></button>
                        <div class="dropdown">
                            <button type="button" class="btn btn-small btn-outline dropdown-toggle">📤 <?= t('export') ?> ▾</button>
                            <div class="dropdown-menu">
                                <button type="button" onclick="exportBirdDB()">📁 JSON</button>
                                <button type="button" onclick="exportBirdsCSV()">📊 CSV</button>
                            </div>
                        </div>
                        <button type="button" class="btn btn-small btn-outline" onclick="document.getElementById('importFile').click()">📥 <?= t('import') ?></button>
                        <input type="file" id="importFile" accept=".json" style="display:none" onchange="importBirdDB(this)">
                    </div>
                    <div class="db-stats" id="dbStats"></div>
                    <div class="search-bar">
                        <input type="text" id="birdSearch" placeholder="<?= t('search_placeholder') ?>" oninput="filterBirds()">
                        <select id="birdFilterSex" onchange="filterBirds()">
                            <option value=""><?= t('all_sex') ?></option>
                            <option value="male">♂ <?= t('male') ?></option>
                            <option value="female">♀ <?= t('female') ?></option>
                        </select>
                        <select id="birdFilterLineage" onchange="filterBirds()">
                            <option value=""><?= t('all_lineage') ?></option>
                        </select>
                    </div>
                    <div class="bird-list" id="birdList"></div>
                </div>

                <!-- 個体モーダル -->
                <div id="birdModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="birdModalTitle"><?= t('add_bird') ?></h3>
                            <button type="button" class="modal-close" onclick="closeBirdForm()">×</button>
                        </div>
                        <form id="birdForm" onsubmit="saveBird(event)">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label"><?= t('name') ?> *</label>
                                    <input type="text" id="birdName" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label"><?= t('code') ?></label>
                                    <input type="text" id="birdCode" placeholder="<?= t('auto_generate') ?>">
                                </div>
                                <div class="form-group">
                                    <label class="form-label"><?= t('sex') ?> *</label>
                                    <select id="birdSex" required onchange="updateGenotypeOptions()">
                                        <option value="male">♂ <?= t('male') ?></option>
                                        <option value="female">♀ <?= t('female') ?></option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label"><?= t('birth_date') ?></label>
                                    <input type="date" id="birdBirthDate">
                                </div>
                                <div class="form-group">
                                    <label class="form-label"><?= t('lineage') ?></label>
                                    <input type="text" id="birdLineage" list="lineageList">
                                    <datalist id="lineageList"></datalist>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">🛡️ <?= t('inbreeding_gen') ?></label>
                                    <input type="number" id="birdInbreedingGen" min="0" max="10" value="0">
                                </div>
                            </div>
                            
                            <h4 class="section-title">👁️ <?= t('observed_info') ?></h4>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label"><?= t('base_color_observed') ?></label>
                                    <?= renderPhenotypeSelect('bird', 'baseColor', $lang === 'ja') ?>
                                </div>
                                <div class="form-group">
                                    <label class="form-label"><?= t('eye_color') ?></label>
                                    <?= renderPhenotypeSelect('bird', 'eyeColor', $lang === 'ja') ?>
                                </div>
                                <div class="form-group">
                                    <label class="form-label"><?= t('dark_factor') ?></label>
                                    <?= renderPhenotypeSelect('bird', 'darkness', $lang === 'ja') ?>
                                </div>
                            </div>
                            
                            <h4 class="section-title"><?= t('parent_info') ?></h4>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label"><?= t('sire') ?></label>
                                    <select id="birdSire"><option value=""><?= t('unknown_or_external') ?></option></select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label"><?= t('dam') ?></label>
                                    <select id="birdDam"><option value=""><?= t('unknown_or_external') ?></option></select>
                                </div>
                            </div>
                            <h4 class="section-title"><?= t('genotype_info') ?></h4>
                            <div class="form-grid genotype-grid" id="genotypeFields"></div>
                            <div class="form-group">
                                <label class="form-label"><?= t('phase') ?></label>
                                <select id="birdPhase">
                                    <option value="independent"><?= t('phase_independent') ?></option>
                                    <option value="cis_pld_cin">Z^pld,cin (cis)</option>
                                    <option value="trans_pld_cin">Z^pld / Z^cin (trans)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label"><?= t('notes') ?></label>
                                <textarea id="birdNotes" rows="2"></textarea>
                            </div>
                            <div class="btn-group">
                                <button type="submit" class="btn btn-primary"><?= t('save') ?></button>
                                <button type="button" class="btn btn-outline" onclick="closeBirdForm()"><?= t('cancel') ?></button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- 血統書モーダル -->
                <div id="pedigreeModal" class="modal">
                    <div class="modal-content modal-large">
                        <div class="modal-header">
                            <h3><?= t('pedigree_preview') ?></h3>
                            <button type="button" class="modal-close" onclick="closePedigreeModal()">×</button>
                        </div>
                        <div class="pedigree-options">
                            <label><input type="radio" name="pedigreeGen" value="3" checked> 3<?= t('generation') ?></label>
                            <label><input type="radio" name="pedigreeGen" value="5"> 5<?= t('generation') ?></label>
                        </div>
                        <div id="pedigreePreview"></div>
                        <div class="btn-group">
                            <button type="button" class="btn btn-primary" onclick="printPedigree()">🖨️ <?= t('print') ?></button>
                            <button type="button" class="btn btn-secondary" onclick="downloadPedigreeHTML()">📄 HTML</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tab: 健康評価 (v5.15.1完全復元) -->
            <section id="health" class="tab-content">
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🛡️</div>
                        <div>
                            <h2 class="card-title">Health Guardian v7.0</h2>
                            <p class="card-subtitle"><?= t('health_guardian_desc') ?></p>
                        </div>
                    </div>
                    
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label"><?= t('sire') ?> (DB)</label>
                            <select id="healthSire"><option value=""><?= t('select_placeholder') ?></option></select>
                        </div>
                        <div class="form-group">
                            <label class="form-label"><?= t('dam') ?> (DB)</label>
                            <select id="healthDam"><option value=""><?= t('select_placeholder') ?></option></select>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="checkPairingHealth()"><?= t('btn_health_check') ?></button>
                    
                    <div id="healthCheckResult" style="margin-top:1.5rem"></div>
                    <div id="healthEvalResult"></div>
                </div>

                <div class="card">
                    <h3 class="card-title"><?= t('inbreeding_limit') ?></h3>
                    <div class="health-recommendations">
                        <ul>
                            <li class="urgency-critical"><strong>INO (<?= t('lutino') ?>/<?= t('creamino') ?>/<?= t('pure_white') ?>): 2 <?= t('generation') ?></strong><span class="rec-detail"><?= t('ino_limit_warning') ?></span></li>
                            <li class="urgency-critical"><strong><?= t('pallid') ?>: 2 <?= t('generation') ?></strong><span class="rec-detail"><?= t('pallid_limit_warning') ?></span></li>
                            <li class="urgency-high"><strong><?= t('fallow') ?>: 2 <?= t('generation') ?></strong><span class="rec-detail"><?= t('fallow_limit_warning') ?></span></li>
                            <li class="urgency-moderate"><strong>Dark DF: 3 <?= t('generation') ?></strong><span class="rec-detail"><?= t('dark_df_warning') ?></span></li>
                            <li><strong><?= t('general_limit') ?></strong></li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Tab: Target Planner (v6.7.3: 32色対応) -->
            <section id="planner" class="tab-content<?= $activeTab === 'planner' ? ' active' : '' ?>">
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🎯</div>
                        <div>
                            <h2 class="card-title"><?= t('tab5') ?></h2>
                            <p class="card-subtitle"><?= t('tab5_desc') ?></p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label"><?= t('target_trait') ?></label>
                    <select id="plannerTarget">
                        <option value=""><?= t('select_placeholder') ?></option>
                        <?php foreach (AgapornisLoci::groupedByCategory() as $cat => $colors): ?>
                        <optgroup label="<?= htmlspecialchars(AgapornisLoci::categoryLabel($cat, $lang === 'ja')) ?>">
                            <?php foreach ($colors as $key => $def): ?>
                            <option value="<?= $key ?>"><?= htmlspecialchars($lang === 'ja' ? $def['ja'] : $def['en']) ?></option>
                            <?php endforeach; ?>
                        </optgroup>
                        <?php endforeach; ?>
                    </select>
                    <button type="button" class="btn btn-primary" onclick="runPlanner()">🔍 <?= t('btn_plan') ?></button>
                                    </div>
                </div>
                <div id="plannerResult" class="output-panel" style="display:none;"></div>
                <div id="plannerEmpty" class="output-panel">
                    <div class="empty-state"><div class="empty-icon">🗺️</div><p><?= t('empty_planner') ?></p></div>
                </div>
            </section>

            <section id="pathfinder" class="tab-content<?= $activeTab === 'pathfinder' ? ' active' : '' ?>">
                <?php $pathTarget = $_POST['target'] ?? ''; ?>
                <form method="POST" action="#pathfinder-result" class="card"><input type="hidden" name="action" value="pathfind">
                    <h3>🧭 <?= t('target_trait') ?></h3>
                    <select name="target" required style="width:100%;padding:.5rem;margin-bottom:1rem;">
                        <option value=""><?= t('select_placeholder') ?></option>
                        <?php foreach (AgapornisLoci::groupedByCategory() as $cat => $colors): ?>
                        <optgroup label="<?= htmlspecialchars(AgapornisLoci::categoryLabel($cat, $lang === 'ja')) ?>">
                            <?php foreach ($colors as $key => $def): ?>
                            <option value="<?= $key ?>"<?= ($pathTarget ?? '') === $key ? ' selected' : '' ?>><?= htmlspecialchars($lang === 'ja' ? $def['ja'] : $def['en']) ?></option>
                            <?php endforeach; ?>
                        </optgroup>
                        <?php endforeach; ?>
                    </select>

                    <button type="submit" class="btn btn-primary"><?= t('btn_pathfind') ?></button>
                </form>
                <div id="pathfinder-result">
                <?php if ($action === 'pathfind' && $result && !isset($result['error'])): ?>
                <?php
                // 目標色名を取得
                $targetKey = $result['targetKey'] ?? '';
                $targetColorDef = AgapornisLoci::COLOR_DEFINITIONS[$targetKey] ?? null;
                $targetName = $targetColorDef ? ($lang === 'ja' ? $targetColorDef['ja'] : $targetColorDef['en']) : $targetKey;

                // ヘルパー関数: 色キーから翻訳済み名称を取得
                $getColorName = function($colorKey) use ($lang) {
                    $colorDef = AgapornisLoci::COLOR_DEFINITIONS[$colorKey] ?? null;
                    if ($colorDef) {
                        return $lang === 'ja' ? $colorDef['ja'] : $colorDef['en'];
                    }
                    return t($colorKey) ?: ucfirst($colorKey);
                };
                ?>
                <div class="output-panel" style="margin-top:1rem;">
                    <h4>🎯 <?= htmlspecialchars($targetName) ?></h4>
                    <p style="color:var(--text-secondary);margin-bottom:1rem;"><?= t_pf('pf_estimated_gen') ?>: <?= count($result['steps']) ?></p>

                    <?php // 警告表示 ?>
                    <?php if(!empty($result['warnings'])): ?>
                    <?php foreach($result['warnings'] as $warnKey): ?>
                    <div class="warning-box" style="margin-bottom:.5rem;"><?= htmlspecialchars(t_pf($warnKey)) ?></div>
                    <?php endforeach; ?>
                    <?php endif; ?>

                    <?php // ステップ表示 ?>
                    <?php foreach($result['steps'] as $stepIndex => $s): ?>
                    <?php
                    // タイトル翻訳
                    $titleParams = $s['title_params'] ?? [];
                    $stepTitle = t_pf($s['title_key'] ?? 'pf_wild_type', $titleParams);

                    // オス親の色名
                    $maleColorName = $getColorName($s['male_key'] ?? 'green');
                    $maleSuffix = isset($s['male_suffix_key']) ? ' (' . t_pf($s['male_suffix_key']) . ')' : '';

                    // メス親の色名
                    $femaleColorName = $getColorName($s['female_key'] ?? 'green');
                    $femaleSuffix = isset($s['female_suffix_key']) ? ' (' . t_pf($s['female_suffix_key']) . ')' : '';

                    // 結果翻訳
                    $resultParams = $s['result_params'] ?? [];
                    $resultText = t_pf($s['result_key'] ?? '', $resultParams);
                    ?>
                    <div style="margin:.5rem 0;padding:.75rem;background:var(--bg-tertiary);border-radius:4px;border-left:3px solid var(--accent-primary);">
                        <div style="font-weight:bold;margin-bottom:.5rem;">Step <?= $stepIndex + 1 ?>: <?= htmlspecialchars($stepTitle) ?></div>
                        <div style="margin:.25rem 0;">♂ <?= htmlspecialchars($maleColorName . $maleSuffix) ?></div>
                        <div style="margin:.25rem 0;">♀ <?= htmlspecialchars($femaleColorName . $femaleSuffix) ?></div>
                        <div style="margin-top:.5rem;color:var(--text-secondary);font-size:.9em;">→ <?= htmlspecialchars($resultText) ?></div>
                    </div>
                    <?php endforeach; ?>

                    <?php // v7.0 連鎖遺伝情報 ?>
                    <?php if(!empty($result['linkage']) && !empty($result['linkage']['info'])): ?>
                    <div style="margin-top:1rem;padding:.75rem;background:var(--bg-secondary);border-radius:4px;border:1px solid var(--accent-secondary);">
                        <strong>🔗 <?= t('phase') ?></strong>
                        <?php foreach($result['linkage']['info'] as $linkInfo): ?>
                        <div style="margin-top:.25rem;font-size:.9em;"><?= htmlspecialchars($linkInfo) ?></div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                </div>
                <?php elseif ($action === 'pathfind' && isset($result['error'])): ?>
                <div class="warning-box" style="margin-top:1rem;">
                    <?= htmlspecialchars(t_pf($result['error'], ['target' => $result['errorParam'] ?? ''])) ?>
                </div>
                <?php endif; ?>
                </div>
            </section>

            <section id="feasibility" class="tab-content<?= $activeTab === 'feasibility' ? ' active' : '' ?>">
                <?php
                // フォーム値を保持
                $fMode = $_POST['f_mode'] ?? 'phenotype';
                $mMode = $_POST['m_mode'] ?? 'phenotype';
                $fBaseColor = $_POST['f_baseColor'] ?? 'green';
                $fEyeColor = $_POST['f_eyeColor'] ?? 'black';
                $fDarkness = $_POST['f_darkness'] ?? 'none';
                $mBaseColor = $_POST['m_baseColor'] ?? 'green';
                $mEyeColor = $_POST['m_eyeColor'] ?? 'black';
                $mDarkness = $_POST['m_darkness'] ?? 'none';
                // 遺伝子型直接入力の値（v6.7.3: aq対応）
                $fDbId = $_POST['f_db_id'] ?? '';
                $mDbId = $_POST['m_db_id'] ?? '';
                $fParblue = $_POST['f_parblue'] ?? '++';
                $fIno = $_POST['f_ino'] ?? '++';
                $fDark = $_POST['f_dark'] ?? 'dd';
                $fOpaline = $_POST['f_opaline'] ?? '++';
                $fCinnamon = $_POST['f_cinnamon'] ?? '++';
                $fPied = $_POST['f_pirec'] ?? '++';
                $mParblue = $_POST['m_parblue'] ?? '++';
                $mIno = $_POST['m_ino'] ?? '+W';
                $mDark = $_POST['m_dark'] ?? 'dd';
                $mOpaline = $_POST['m_opaline'] ?? '+W';
                $mCinnamon = $_POST['m_cinnamon'] ?? '+W';
                $mPied = $_POST['m_pirec'] ?? '++';
                // v6.8追加: 14座位対応
$fVio = $_POST['f_vio'] ?? 'vv';
$fPidom = $_POST['f_pidom'] ?? '++';
$fFlp = $_POST['f_flp'] ?? '++';
$fFlb = $_POST['f_flb'] ?? '++';
$fDil = $_POST['f_dil'] ?? '++';
$fEd = $_POST['f_ed'] ?? '++';
$fOf = $_POST['f_of'] ?? '++';
$fPh = $_POST['f_ph'] ?? '++';
$mVio = $_POST['m_vio'] ?? 'vv';
$mPidom = $_POST['m_pidom'] ?? '++';
$mFlp = $_POST['m_flp'] ?? '++';
$mFlb = $_POST['m_flb'] ?? '++';
$mDil = $_POST['m_dil'] ?? '++';
$mEd = $_POST['m_ed'] ?? '++';
$mOf = $_POST['m_of'] ?? '++';
$mPh = $_POST['m_ph'] ?? '++';
                ?>
                <form method="POST" action="#feasibility-result" class="card" id="feasibilityForm" onsubmit="return window._allowSubmit;"><input type="hidden" name="action" value="calculate">

                    
                    <!-- ♂ Father -->
                    <div class="parent-block">
                        <h3>♂ <?= t('father') ?></h3>
                        <div class="input-mode-toggle">
                            <label><input type="radio" name="f_mode" value="phenotype"<?= $fMode === 'phenotype' ? ' checked' : '' ?> onchange="toggleInputMode('f')"> <?= t('from_phenotype') ?></label>
                            <label><input type="radio" name="f_mode" value="genotype"<?= $fMode === 'genotype' ? ' checked' : '' ?> onchange="toggleInputMode('f')"> <?= t('direct_genotype') ?></label>
                            <label><input type="radio" name="f_mode" value="fromdb"<?= $fMode === 'fromdb' ? ' checked' : '' ?> onchange="toggleInputMode('f')"> 📁 <?= t('from_db') ?></label>
                        </div>
                        
                        <!-- DB選択 -->
                        <div id="f_db_inputs" class="input-panel"<?= $fMode !== 'fromdb' ? ' style="display:none;"' : '' ?>>
                            <div class="form-group">
                                <label><?= t('registered_males') ?></label>
                                <select id="f_db_select" name="f_db_id">

                                    <option value=""><?= t('select_placeholder') ?></option>
                                </select>
                            </div>
                            <!-- fromdbモード用隠しフィールド -->
                            <input type="hidden" name="f_db_baseColor" id="f_db_baseColor" value="<?= htmlspecialchars($_POST['f_db_baseColor'] ?? '') ?>">
                            <input type="hidden" name="f_db_eyeColor" id="f_db_eyeColor" value="<?= htmlspecialchars($_POST['f_db_eyeColor'] ?? '') ?>">
                            <input type="hidden" name="f_db_darkness" id="f_db_darkness" value="<?= htmlspecialchars($_POST['f_db_darkness'] ?? '') ?>">

                        </div>
                        
                        <!-- Phenotype inputs (共通) -->
                        <div id="f_phenotype_inputs" class="input-panel"<?= $fMode === 'genotype' || $fMode === 'fromdb' ? ' style="display:none;"' : '' ?>>
                            <div class="form-group"><label><?= t('base_color_observed') ?></label><?= renderPhenotypeSelect('f', 'baseColor', $lang === 'ja', $fBaseColor) ?></div>
                            <div class="form-group"><label><?= t('eye_color') ?></label><?= renderPhenotypeSelect('f', 'eyeColor', $lang === 'ja', $fEyeColor) ?></div>
                            <div class="form-group"><label><?= t('dark_factor') ?></label><?= renderPhenotypeSelect('f', 'darkness', $lang === 'ja', $fDarkness) ?></div>
                        </div>
                        
                        <!-- Genotype inputs (v6.7.3: aq対応) -->
                        <div id="f_genotype_inputs" class="input-panel"<?= $fMode !== 'genotype' ? ' style="display:none;"' : '' ?>>
                            <div class="form-group"><label>Parblue</label><select name="f_parblue"><?php foreach(['++=B⁺/B⁺','+aq=B⁺/b^aq','aqaq=b^aq/b^aq','+tq=B⁺/b^tq','tqtq=b^tq/b^tq','tqaq=b^tq/b^aq'] as $o){$p=explode('=',$o);echo '<option value="'.$p[0].'"'.($fParblue===$p[0]?' selected':'').'>'.$p[1].'</option>';}?></select></div>
                            <div class="form-group"><label>INO</label><select name="f_ino"><?php foreach(['++'=>'Z⁺/Z⁺','+ino'=>'Z⁺/Z^ino','inoino'=>'Z^ino/Z^ino','+pld'=>'Z⁺/Z^pld','pldpld'=>'Z^pld/Z^pld','pldino'=>'Z^pld/Z^ino'] as $v=>$l){echo '<option value="'.$v.'"'.($fIno===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                            <div class="form-group"><label>Dark</label><select name="f_dark"><?php foreach(['dd'=>'d/d','Dd'=>'D/d','DD'=>'D/D'] as $v=>$l){echo '<option value="'.$v.'"'.($fDark===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                            <div class="form-group"><label>Opaline</label><select name="f_opaline"><?php foreach(['++'=>'Z⁺/Z⁺','+op'=>'Z⁺/Z^op','opop'=>'Z^op/Z^op'] as $v=>$l){echo '<option value="'.$v.'"'.($fOpaline===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                            <div class="form-group"><label>Cinnamon</label><select name="f_cinnamon"><?php foreach(['++'=>'Z⁺/Z⁺','+cin'=>'Z⁺/Z^cin','cincin'=>'Z^cin/Z^cin'] as $v=>$l){echo '<option value="'.$v.'"'.($fCinnamon===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                            <div class="form-group"><label>Pied</label><select name="f_pirec"><?php foreach(['++'=>'+/+','+pi'=>'+/pi','pipi'=>'pi/pi'] as $v=>$l){echo '<option value="'.$v.'"'.($fPied===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                        <div class="form-group"><label>Violet</label><select name="f_vio"><?php foreach(['vv'=>'v/v','Vv'=>'V/v','VV'=>'V/V'] as $v=>$l){echo '<option value="'.$v.'"'.(($fVio??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Dom Pied</label><select name="f_pidom"><?php foreach(['++'=>'+/+','Pi+'=>'Pi/+','PiPi'=>'Pi/Pi'] as $v=>$l){echo '<option value="'.$v.'"'.(($fPidom??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Pale Fallow</label><select name="f_flp"><?php foreach(['++'=>'+/+','+flp'=>'+/flp','flpflp'=>'flp/flp'] as $v=>$l){echo '<option value="'.$v.'"'.(($fFlp??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Bronze Fallow</label><select name="f_flb"><?php foreach(['++'=>'+/+','+flb'=>'+/flb','flbflb'=>'flb/flb'] as $v=>$l){echo '<option value="'.$v.'"'.(($fFlb??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Dilute</label><select name="f_dil"><?php foreach(['++'=>'+/+','+dil'=>'+/dil','dildil'=>'dil/dil'] as $v=>$l){echo '<option value="'.$v.'"'.(($fDil??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Edged</label><select name="f_ed"><?php foreach(['++'=>'+/+','+ed'=>'+/ed','eded'=>'ed/ed'] as $v=>$l){echo '<option value="'.$v.'"'.(($fEd??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Orangeface</label><select name="f_of"><?php foreach(['++'=>'+/+','+of'=>'+/of','ofof'=>'of/of'] as $v=>$l){echo '<option value="'.$v.'"'.(($fOf??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Pale Headed</label><select name="f_ph"><?php foreach(['++'=>'+/+','+ph'=>'+/ph','phph'=>'ph/ph'] as $v=>$l){echo '<option value="'.$v.'"'.(($fPh??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                    </div>                  
                    <!-- ♀ Mother -->
                    <div class="parent-block">
                        <h3>♀ <?= t('mother') ?></h3>
                        <div class="input-mode-toggle">
                            <label><input type="radio" name="m_mode" value="phenotype"<?= $mMode === 'phenotype' ? ' checked' : '' ?> onchange="toggleInputMode('m')"> <?= t('from_phenotype') ?></label>
                            <label><input type="radio" name="m_mode" value="genotype"<?= $mMode === 'genotype' ? ' checked' : '' ?> onchange="toggleInputMode('m')"> <?= t('direct_genotype') ?></label>
                            <label><input type="radio" name="m_mode" value="fromdb"<?= $mMode === 'fromdb' ? ' checked' : '' ?> onchange="toggleInputMode('m')"> 📁 <?= t('from_db') ?></label>
                        </div>
                        
                        <!-- DB選択 -->
                        <div id="m_db_inputs" class="input-panel"<?= $mMode !== 'fromdb' ? ' style="display:none;"' : '' ?>>
                            <div class="form-group">
                                <label><?= t('registered_females') ?></label>
                                <select id="m_db_select" name="m_db_id">
                                    <option value=""><?= t('select_placeholder') ?></option>
                                </select>
                            </div>
                            <!-- fromdbモード用隠しフィールド -->
                            <input type="hidden" name="m_db_baseColor" id="m_db_baseColor" value="<?= htmlspecialchars($_POST['m_db_baseColor'] ?? '') ?>">
                            <input type="hidden" name="m_db_eyeColor" id="m_db_eyeColor" value="<?= htmlspecialchars($_POST['m_db_eyeColor'] ?? '') ?>">
                            <input type="hidden" name="m_db_darkness" id="m_db_darkness" value="<?= htmlspecialchars($_POST['m_db_darkness'] ?? '') ?>">

                        </div>
                        
                        <!-- Phenotype inputs (共通) -->
                        <div id="m_phenotype_inputs" class="input-panel"<?= $mMode === 'genotype' || $mMode === 'fromdb' ? ' style="display:none;"' : '' ?>>
                            <div class="form-group"><label><?= t('base_color_observed') ?></label><?= renderPhenotypeSelect('m', 'baseColor', $lang === 'ja', $mBaseColor) ?></div>
                            <div class="form-group"><label><?= t('eye_color') ?></label><?= renderPhenotypeSelect('m', 'eyeColor', $lang === 'ja', $mEyeColor) ?></div>
                            <div class="form-group"><label><?= t('dark_factor') ?></label><?= renderPhenotypeSelect('m', 'darkness', $lang === 'ja', $mDarkness) ?></div>
                        </div>
                        
                        <!-- Genotype inputs (v6.7.3: aq対応) -->
                        <div id="m_genotype_inputs" class="input-panel"<?= $mMode !== 'genotype' ? ' style="display:none;"' : '' ?>>
                            <div class="form-group"><label>Parblue</label><select name="m_parblue"><?php foreach(['++=B⁺/B⁺','+aq=B⁺/b^aq','aqaq=b^aq/b^aq','+tq=B⁺/b^tq','tqtq=b^tq/b^tq','tqaq=b^tq/b^aq'] as $o){$p=explode('=',$o);echo '<option value="'.$p[0].'"'.($mParblue===$p[0]?' selected':'').'>'.$p[1].'</option>';}?></select></div>
                            <div class="form-group"><label>INO</label><select name="m_ino"><?php foreach(['+W'=>'Z⁺/W','inoW'=>'Z^ino/W','pldW'=>'Z^pld/W'] as $v=>$l){echo '<option value="'.$v.'"'.($mIno===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                            <div class="form-group"><label>Dark</label><select name="m_dark"><?php foreach(['dd'=>'d/d','Dd'=>'D/d','DD'=>'D/D'] as $v=>$l){echo '<option value="'.$v.'"'.($mDark===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                            <div class="form-group"><label>Opaline</label><select name="m_opaline"><?php foreach(['+W'=>'Z⁺/W','opW'=>'Z^op/W'] as $v=>$l){echo '<option value="'.$v.'"'.($mOpaline===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                            <div class="form-group"><label>Cinnamon</label><select name="m_cinnamon"><?php foreach(['+W'=>'Z⁺/W','cinW'=>'Z^cin/W'] as $v=>$l){echo '<option value="'.$v.'"'.($mCinnamon===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                            <div class="form-group"><label>Pied</label><select name="m_pirec"><?php foreach(['++'=>'+/+','+pi'=>'+/pi','pipi'=>'pi/pi'] as $v=>$l){echo '<option value="'.$v.'"'.($mPied===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                            <div class="form-group"><label>Violet</label><select name="m_vio"><?php foreach(['vv'=>'v/v','Vv'=>'V/v','VV'=>'V/V'] as $v=>$l){echo '<option value="'.$v.'"'.(($mVio??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Dom Pied</label><select name="m_pidom"><?php foreach(['++'=>'+/+','Pi+'=>'Pi/+','PiPi'=>'Pi/Pi'] as $v=>$l){echo '<option value="'.$v.'"'.(($mPidom??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Pale Fallow</label><select name="m_flp"><?php foreach(['++'=>'+/+','+flp'=>'+/flp','flpflp'=>'flp/flp'] as $v=>$l){echo '<option value="'.$v.'"'.(($mFlp??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Bronze Fallow</label><select name="m_flb"><?php foreach(['++'=>'+/+','+flb'=>'+/flb','flbflb'=>'flb/flb'] as $v=>$l){echo '<option value="'.$v.'"'.(($mFlb??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Dilute</label><select name="m_dil"><?php foreach(['++'=>'+/+','+dil'=>'+/dil','dildil'=>'dil/dil'] as $v=>$l){echo '<option value="'.$v.'"'.(($mDil??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Edged</label><select name="m_ed"><?php foreach(['++'=>'+/+','+ed'=>'+/ed','eded'=>'ed/ed'] as $v=>$l){echo '<option value="'.$v.'"'.(($mEd??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Orangeface</label><select name="m_of"><?php foreach(['++'=>'+/+','+of'=>'+/of','ofof'=>'of/of'] as $v=>$l){echo '<option value="'.$v.'"'.(($mOf??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
<div class="form-group"><label>Pale Headed</label><select name="m_ph"><?php foreach(['++'=>'+/+','+ph'=>'+/ph','phph'=>'ph/ph'] as $v=>$l){echo '<option value="'.$v.'"'.(($mPh??'')===$v?' selected':'').'>'.$l.'</option>';}?></select></div>
                        </div>
                    </div>

                    <!-- v7.0: 連鎖遺伝（常時有効） -->
                    <div class="linkage-mode-section" style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <strong>🧬 <?= $lang === 'ja' ? '連鎖遺伝計算 (v7.0)' : 'Linkage Genetics (v7.0)' ?></strong>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0.5rem 0 0 0;">
                            <?= $lang === 'ja'
                                ? '組み換え率: cin-ino 3%, ino-op 30%, dark-parblue 7%'
                                : 'Recombination rates: cin-ino 3%, ino-op 30%, dark-parblue 7%' ?>
                        </p>

                        <!-- オス用 相(Phase)選択 -->
                        <div id="fatherPhaseUI" style="margin-top: 1rem; padding: 0.5rem; background: var(--bg-tertiary); border-radius: 4px;">
                            <label style="font-weight: bold;">♂ <?= $lang === 'ja' ? 'Z染色体の相 (Phase)' : 'Z Chromosome Phase' ?></label>
                            <div style="display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap;">
                                <label><input type="radio" name="f_z_phase" value="unknown" checked> <?= $lang === 'ja' ? '不明' : 'Unknown' ?></label>
                                <label><input type="radio" name="f_z_phase" value="cis"> Cis <?= $lang === 'ja' ? '(cin-ino連鎖)' : '(cin-ino linked)' ?></label>
                                <label><input type="radio" name="f_z_phase" value="trans"> Trans <?= $lang === 'ja' ? '(cin/ino分離)' : '(cin/ino separate)' ?></label>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">
                                <?= $lang === 'ja'
                                    ? '※ 母親がLacewingの場合、息子はCis確定'
                                    : '* If dam is Lacewing, son is Cis confirmed' ?>
                            </p>
                        </div>
                    </div>

                    <button type="button" class="btn btn-primary" style="margin-top:1rem;" onclick="window._allowSubmit=true; document.getElementById('feasibilityForm').submit();">🧬 <?= t('btn_calculate') ?></button>

                </form>
                
                <script>
                function toggleInputMode(parent) {
                    const mode = document.querySelector(`input[name="${parent}_mode"]:checked`).value;
                    document.getElementById(`${parent}_phenotype_inputs`).style.display = mode === 'phenotype' ? 'block' : 'none';
                    document.getElementById(`${parent}_genotype_inputs`).style.display = mode === 'genotype' ? 'block' : 'none';
                    document.getElementById(`${parent}_db_inputs`).style.display = mode === 'fromdb' ? 'block' : 'none';

                    // DB選択時はリストを更新
                    if (mode === 'fromdb') {
                        populateDbSelect(parent);
                    }
                }
                
                function populateDbSelect(parent) {
                    const select = document.getElementById(`${parent}_db_select`);
                    if (!select || typeof BirdDB === 'undefined') return;
                    
                    const sex = parent === 'f' ? 'male' : 'female';
                    const birds = BirdDB.getAllBirds().filter(b => b.sex === sex);
                    const isJa = document.documentElement.lang === 'ja';
                    
                    select.innerHTML = `<option value="">${T.select_placeholder}</option>`;
                    birds.forEach(b => {
                        const geno = b.genotype || {};
                        const pheno = b.phenotype || {};
                        let colorLabel;
                        if (Object.keys(geno).length > 0 && BirdDB.calculatePhenotype) {
                            colorLabel = BirdDB.calculatePhenotype(geno, b.sex);
                        } else {
                            colorLabel = getColorLabel(pheno.baseColor, isJa);
                        }
                        const opt = document.createElement('option');
                        opt.value = b.id;
                        opt.textContent = `${b.name || b.id} - ${colorLabel}`;
                    select.appendChild(opt);
                });
                
                // POST後の選択状態を復元
                const savedValue = parent === 'f' 
                    ? '<?= addslashes($fDbId ?? "") ?>' 
                    : '<?= addslashes($mDbId ?? "") ?>';
                if (savedValue) {
                    select.value = savedValue;
                }
            }
                /**
                 * v6.7.3: 32色対応ラベル（ALBS準拠）
                 */
                function getColorLabel(color, isJa) {
                    return COLOR_LABELS[color] || color || '?';
                }
                function loadBirdToForm(parent, birdId) {
                    const prefix = (parent === 'father' || parent === 'f') ? 'f' : 'm';

                    
                    if (!birdId || typeof BirdDB === 'undefined') return false;
                    
                    const bird = BirdDB.getBird(birdId);
                    if (!bird) return false;
                    
                    let baseColor = 'green';
                    let eyeColor = 'black';
                    let darkness = 'none';
                    
                    if (bird.observed && bird.observed.baseColor) {
                        baseColor = bird.observed.baseColor;
                        eyeColor = bird.observed.eyeColor || 'black';
                        darkness = bird.observed.darkness || 'none';
                    }
                    
                    const bcEl = document.getElementById(prefix + '_db_baseColor');
                    const ecEl = document.getElementById(prefix + '_db_eyeColor');
                    const dkEl = document.getElementById(prefix + '_db_darkness');
                    
                    if (bcEl) bcEl.value = baseColor;
                    if (ecEl) ecEl.value = eyeColor;
                    if (dkEl) dkEl.value = darkness;
                    
                    return false;
                }

                // グローバル関数（BirdDB.setMode()から呼ばれる）
                function refreshDBSelectors() {
                    populateDbSelect('f');
                    populateDbSelect('m');
                }

                function refreshHealthSelectors() {
                    const healthSire = document.getElementById('healthSire');
                    const healthDam = document.getElementById('healthDam');
                    if (!healthSire || !healthDam || typeof BirdDB === 'undefined') return;
                    
                    const birds = BirdDB.getAllBirds();
                    const males = birds.filter(b => b.sex === 'male');
                    const females = birds.filter(b => b.sex === 'female');
                    
                    healthSire.innerHTML = `<option value="">${escapeHtml(T.select_placeholder)}</option>`;
                    healthDam.innerHTML = `<option value="">${escapeHtml(T.select_placeholder)}</option>`;
                    males.forEach(b => {
                        const pheno = b.phenotype || BirdDB.getColorLabel(b.observed?.baseColor, 'ja') || '?';
                        const lineage = b.lineage ? ` [${escapeHtml(b.lineage)}]` : '';
                        healthSire.innerHTML += `<option value="${escapeHtml(b.id)}">${escapeHtml(b.name || b.id)} - ${escapeHtml(pheno)}${lineage}</option>`;
                    });
                    females.forEach(b => {
                        const pheno = b.phenotype || BirdDB.getColorLabel(b.observed?.baseColor, 'ja') || '?';
                        const lineage = b.lineage ? ` [${escapeHtml(b.lineage)}]` : '';
                        healthDam.innerHTML += `<option value="${escapeHtml(b.id)}">${escapeHtml(b.name || b.id)} - ${escapeHtml(pheno)}${lineage}</option>`;
                    });
                }

                // ページ読み込み時にDB選択リストを初期化
                document.addEventListener('DOMContentLoaded', function() {
                    if (typeof BirdDB !== 'undefined') {
                        setTimeout(() => {
                            populateDbSelect('f');
                            populateDbSelect('m');
                        }, 500);
                    }
                });
                </script>
                
                <div id="feasibility-result">
                <?php if ($action === 'calculate' && $result): ?>
                <?php
                // v7互換: 結果配列を取得
                $offspring = $result['results'] ?? $result['phenotype'] ?? $result;
                ?>
                <div class="output-panel" style="margin-top:1rem;"><div class="offspring-grid">
                    <?php foreach($offspring as $o): ?>
                    <?php
                    // probが1以上ならパーセント値、1未満なら小数
                    $probValue = $o['prob'] > 1 ? $o['prob'] : $o['prob'] * 100;
                    ?>
                    <div style="padding:.5rem;background:var(--bg-tertiary);border-radius:4px;text-align:center;"><div style="font-size:1.2rem;"><?= number_format($probValue, 1) ?>%</div><div><?= $o['sex']==='male'?'♂':'♀' ?> <?= htmlspecialchars($o['phenotype'] ?? $o['displayName'] ?? '') ?></div></div><?php endforeach; ?>
                </div></div>
                <?php endif; ?>
                </div>
            </section>

            <section id="estimator" class="tab-content<?= $activeTab === 'estimator' ? ' active' : '' ?>">
                <?php
                // フォーム値を保持
                $estSex = $_POST['sex'] ?? 'male';
                $estBaseColor = $_POST['est_baseColor'] ?? 'green';
                $estEyeColor = $_POST['est_eyeColor'] ?? 'black';
                $estDarkness = $_POST['est_darkness'] ?? 'none';
                ?>
                <form method="POST" action="#estimator-result" class="card"><input type="hidden" name="action" value="estimate">
                    <h3>🔬 <?= t('estimate_title') ?></h3>
                    <p class="card-subtitle"><?= t('estimate_desc') ?></p>
                    
                    <div class="form-group">
                        <label class="form-label"><?= t('sex') ?></label>
                        <select name="sex" class="form-select">
                            <option value="male" <?= $estSex === 'male' ? 'selected' : '' ?>>♂ <?= t('male') ?></option>
                            <option value="female" <?= $estSex === 'female' ? 'selected' : '' ?>>♀ <?= t('female') ?></option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label"><?= t('base_color_observed') ?></label>
                        <?= renderPhenotypeSelect('est', 'baseColor', $lang === 'ja', $estBaseColor) ?>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label"><?= t('eye_color') ?></label>
                        <?= renderPhenotypeSelect('est', 'eyeColor', $lang === 'ja', $estEyeColor) ?>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label"><?= t('dark_factor') ?></label>
                        <?= renderPhenotypeSelect('est', 'darkness', $lang === 'ja', $estDarkness) ?>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-large">🔬 <?= t('btn_estimate') ?></button>
                </form>
                <div id="estimator-result">
                <?php if ($action === 'estimate'): ?>
                    <?php if ($result && !empty($result['loci'])): ?>
                    <div class="output-panel" style="margin-top:1rem;">
                        <div class="output-header"><span class="output-title">🧬 <?= t('estimation_result') ?></span></div>
                        <?php foreach($result['loci'] as $l): ?>
<?php 
    $bgColor = $l['isConfirmed'] ? 'rgba(78,205,196,0.15)' : 'rgba(255,255,255,0.03)';
    $borderLeft = $l['isConfirmed'] ? '3px solid #4ecdc4' : '3px solid #555';
    $confidenceLabel = $l['isConfirmed'] ? '✓ ' . t('confirmed') : '(' . t('estimated') . ')';
?>
<div style="padding:0.5rem;margin:0.25rem 0;background:<?= $bgColor ?>;border-radius:4px;border-left:<?= $borderLeft ?>;">
    <strong style="color:#4ecdc4;"><?= htmlspecialchars($l['locusName'] ?? $l['locusKey'] ?? '?') ?>:</strong>
    <span style="color:#e0e0e0;"><?= htmlspecialchars($l['genotype']) ?></span>
    <span style="font-size:0.75rem;color:#888;margin-left:0.5rem;"><?= $confidenceLabel ?></span>
</div>
<?php endforeach; ?>

                        <?php if(!empty($result['notes'])): ?>
                        <div style="margin-top:1rem;padding:1rem;background:rgba(78,205,196,0.1);border-radius:8px;">
                            <strong style="color:#4ecdc4;">💡 <?= t('test_proposal') ?>:</strong>
                            <ul style="margin-top:0.5rem;">
                            <?php foreach($result['notes'] as $n): ?>
                            <li style="font-size:.85rem;color:#ccc;margin:0.3rem 0;"><?= htmlspecialchars($n) ?></li>
                            <?php endforeach; ?>
                            </ul>
                        </div>
                        <?php endif; ?>
                    </div>
                    <?php else: ?>
                    <div class="output-panel" style="margin-top:1rem;">
                        <div class="warning-box"><?= t('no_result') ?></div>
                        <pre style="font-size:0.75rem;color:#888;"><?= htmlspecialchars(print_r($result, true)) ?></pre>
                    </div>
                    <?php endif; ?>
                <?php endif; ?>
                </div>
            </section>
        </main>
        <footer>
            <details class="footer-credits">
                <summary>制度外文明・かならづプロジェクト</summary>
                <div class="credits-content simple-credits">
                    <p></p>
                    <p></p>
                    <p>跳躍原案：池月 事件(光路収束)</p>
                    <p>人力小說：七ツ胴 かならづ(架構爬行)</p>
                    <p>構文打鍵：鏡文字 ヌル（句法曲率チェック）</p>
                    <p>構造設計：刑部 綴（読解反転工学)</p>
                    <p>廣告文案：近衛 雪子(逆行共振アレンジ)</p>
                    <p>企劃統括：呉 泥舟（核准アラインメント）</p>
                    <p>演出協力：Nathalie Devouassoux</p>
                    <p>（for translation structuring and structural derivation feedback）</p>
                    <p></p>
                    <p>⬛︎概要:</p>
                    <p>整合性原理から自然導出された構造文学開発計画。システムに欠けが生じた場合も構文補完に成功すればプロジェクトの凍結は回避される。</p>
                    <p></p>
                    <p>⬛︎位相:</p>
                    <p>「意味的に読めば狂気、構造的に読めば純粋理性」。観測角度で変わる実相。それが「かならづ」。</p>
                </div>
            </details>
        </footer>
    </div>
    <script src="guardian.js"></script>
    <script src="birds.js?v=674"></script>
    <script src="breeding.js"></script>
    <script src="pedigree.js"></script>
    <script src="planner.js?v=674"></script>
<script>
// refreshBirdList をグローバルに定義（フィルター対応版）
function refreshBirdList() {
    if (typeof BirdDB === 'undefined') return;
    
    const birds = BirdDB.getAllBirds();
    const stats = BirdDB.getStats();
    
    // フィルター適用
    const searchText = (document.getElementById('birdSearch')?.value || '').toLowerCase();
    const filterSex = document.getElementById('birdFilterSex')?.value || '';
    const filterLineage = document.getElementById('birdFilterLineage')?.value || '';
    
    const filtered = birds.filter(function(bird) {
        if (searchText && !(bird.name || '').toLowerCase().includes(searchText) && !(bird.code || '').toLowerCase().includes(searchText)) return false;
        if (filterSex && bird.sex !== filterSex) return false;
        if (filterLineage && bird.lineage !== filterLineage) return false;
        return true;
    });
    
    const statsEl = document.getElementById('dbStats');
    if (statsEl) {
        statsEl.innerHTML = 
            '<div style="display:flex;gap:1rem;flex-wrap:wrap;">' +
            '<div class="stat-card"><span class="stat-num">' + stats.totalBirds + '</span><span class="stat-label">' + (T.total_birds || 'Total') + '</span></div>' +
            '<div class="stat-card"><span class="stat-num">' + stats.males + '</span><span class="stat-label">♂</span></div>' +
            '<div class="stat-card"><span class="stat-num">' + stats.females + '</span><span class="stat-label">♀</span></div>' +
            '<div class="stat-card"><span class="stat-num">' + filtered.length + '</span><span class="stat-label">' + (T.filtered || 'Filtered') + '</span></div>' +
            '</div>';
    }
    
    const listEl = document.getElementById('birdList');
    if (!listEl) return;
    
    if (filtered.length === 0) {
        listEl.innerHTML = '<div class="empty-state"><div class="empty-icon">🐣</div><p>' + (T.no_birds || 'No birds registered') + '</p></div>';
        return;
    }
    
    // XSS対策: すべてのユーザーデータをエスケープ
    listEl.innerHTML = filtered.map(function(bird) {
        var safeId = escapeHtml(bird.id);
        return '<div class="bird-card" style="background:var(--bg-tertiary);padding:.75rem;border-radius:8px;margin-bottom:.5rem;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<div>' +
                    '<strong style="color:#fff;">' + escapeHtml(bird.name || '') + '</strong> ' +
                    '<span style="color:#888;font-size:.8rem;">' + escapeHtml(bird.code || '') + '</span> ' +
                    '<span style="color:' + (bird.sex === 'male' ? '#4a90d9' : '#d94a8c') + ';">' + (bird.sex === 'male' ? '♂' : '♀') + '</span>' +
                '</div>' +
                '<div style="display:flex;gap:.25rem;">' +
                    '<button type="button" class="btn btn-tiny" data-action="edit" data-id="' + safeId + '">✏️</button>' +
                    '<button type="button" class="btn btn-tiny" data-action="pedigree" data-id="' + safeId + '">📜</button>' +
                    '<button type="button" class="btn btn-tiny" data-action="delete" data-id="' + safeId + '">🗑️</button>' +
                '</div>' +
            '</div>' +
            '<div style="color:#4ecdc4;font-size:.85rem;margin-top:.25rem;">' + escapeHtml((bird.observed && bird.observed.baseColor && COLOR_LABELS[bird.observed.baseColor]) || bird.phenotype || '') + '</div>' +
        '</div>';
    }).join('');
    // イベント委譲: data属性を使用してXSSを防止
    listEl.querySelectorAll('[data-action]').forEach(function(btn) {
        btn.onclick = function() {
            var action = this.dataset.action;
            var id = this.dataset.id;
            if (action === 'edit') editBird(id);
            else if (action === 'pedigree') showPedigree(id);
            else if (action === 'delete') deleteBird(id);
        };
    });
}

function filterBirds() { refreshBirdList(); }

// 編集・削除・血統書関数
function editBird(id) {
    if (typeof BirdDB === 'undefined') return;
    var bird = BirdDB.getBird(id);
    if (!bird) { alert(T.bird_not_found || 'Bird not found'); return; }
    
    document.getElementById('birdModalTitle').textContent = T.edit || 'Edit';
    document.getElementById('birdName').value = bird.name || '';
    document.getElementById('birdCode').value = bird.code || '';
    document.getElementById('birdSex').value = bird.sex || 'male';
    document.getElementById('birdBirthDate').value = bird.birthDate || '';
    document.getElementById('birdLineage').value = bird.lineage || '';
    document.getElementById('birdInbreedingGen').value = bird.inbreedingGen || 0;
    document.getElementById('birdNotes').value = bird.notes || '';
    document.getElementById('birdSire').value = bird.sireId || '';
    document.getElementById('birdDam').value = bird.damId || '';
    
    if (bird.observed) {
        var bcSelect = document.querySelector('[name="bird_baseColor"]');
        var ecSelect = document.querySelector('[name="bird_eyeColor"]');
        var dkSelect = document.querySelector('[name="bird_darkness"]');
        if (bcSelect) bcSelect.value = bird.observed.baseColor || 'green';
        if (ecSelect) ecSelect.value = bird.observed.eyeColor || 'black';
        if (dkSelect) dkSelect.value = bird.observed.darkness || 'none';
    }
    
    document.getElementById('birdForm').dataset.editId = id;
    document.getElementById('birdModal').classList.add('active');
}

function deleteBird(id) {
    if (typeof BirdDB === 'undefined') return;
    var bird = BirdDB.getBird(id);
    if (!bird) return;
    
    customConfirm((T.confirm_delete || 'Delete this bird?') + '\n' + (bird.name || id)).then(function(confirmed) {
        if (!confirmed) return;
        BirdDB.deleteBird(id);
        refreshBirdList();
    });
}

function showPedigree(id) {
    if (typeof BirdDB === 'undefined') return;
    var bird = BirdDB.getBird(id);
    if (!bird) return;
    
    document.getElementById('pedigreeModal').classList.add('active');
    if (typeof renderPedigree === 'function') {
        renderPedigree(id, 3);
    }
}

function closePedigreeModal() {
    document.getElementById('pedigreeModal').classList.remove('active');
}
function openBirdForm() {
    document.getElementById('birdModalTitle').textContent = T.add_bird || 'Add Bird';
    document.getElementById('birdForm').reset();
    document.getElementById('birdForm').dataset.editId = '';
    document.getElementById('birdModal').classList.add('active');
}

function closeBirdForm() {
    document.getElementById('birdModal').classList.remove('active');
    document.getElementById('birdForm').dataset.editId = '';
}


</script>


    <script>
function showTab(id){
    document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
    const target = document.getElementById(id);
    if(target){
        target.classList.add('active');
        setTimeout(()=>{
            target.scrollIntoView({behavior:'smooth', block:'start'});
        }, 50);
    }
}
</script>
<script src="family.js?v=674"></script>
<script src="app.js?v=<?= time() ?>"></script>
<script>if(typeof initLang==='function')initLang(T);</script>
<script>
    // 健康評価タブ用セレクタ初期化（BirdDB準備完了を待つ）
        function initHealthSelectors() {
            const healthSire = document.getElementById('healthSire');
            const healthDam = document.getElementById('healthDam');
            if (!healthSire || !healthDam) return;
            
            if (typeof BirdDB === 'undefined' || !BirdDB.isReady()) {
                setTimeout(initHealthSelectors, 500);
                return;
            }
            
            const birds = BirdDB.getAllBirds();
            const males = birds.filter(b => b.sex === 'male');
            const females = birds.filter(b => b.sex === 'female');
            const isJa = document.documentElement.lang === 'ja';
            
            healthSire.innerHTML = `<option value="">${escapeHtml(T.select_placeholder)}</option>`;
            healthDam.innerHTML = `<option value="">${escapeHtml(T.select_placeholder)}</option>`;

            males.forEach(b => {
                const pheno = b.phenotype || getColorLabel(b.observed?.baseColor, isJa) || '?';
                const geno = formatGenoShort(b.genotype, b.sex);
                const lineage = b.lineage ? ` [${escapeHtml(b.lineage)}]` : '';
                healthSire.innerHTML += `<option value="${escapeHtml(b.id)}">${escapeHtml(b.name || b.id)} - ${escapeHtml(pheno)} (${escapeHtml(geno)})${lineage}</option>`;
            });

            females.forEach(b => {
                const pheno = b.phenotype || getColorLabel(b.observed?.baseColor, isJa) || '?';
                const geno = formatGenoShort(b.genotype, b.sex);
                const lineage = b.lineage ? ` [${escapeHtml(b.lineage)}]` : '';
                healthDam.innerHTML += `<option value="${escapeHtml(b.id)}">${escapeHtml(b.name || b.id)} - ${escapeHtml(pheno)} (${escapeHtml(geno)})${lineage}</option>`;
            });
        }
        
        // 遺伝構成を短縮表示（SSOT: v7.0座位名を使用）
        function formatGenoShort(geno, sex) {
            if (!geno || Object.keys(geno).length === 0) return 'WT';
            const parts = [];
            if (geno.parblue && geno.parblue !== '++') parts.push(geno.parblue);
            if (geno.ino && geno.ino !== '++' && geno.ino !== '+W') parts.push(geno.ino);
            if (geno.dark && geno.dark !== 'dd') parts.push(geno.dark);
            if (geno.opaline && geno.opaline !== '++' && geno.opaline !== '+W') parts.push('op');
            if (geno.cinnamon && geno.cinnamon !== '++' && geno.cinnamon !== '+W') parts.push('cin');
            if (geno.pied_rec && geno.pied_rec !== '++') parts.push('pirec');
            if (geno.pied_dom && geno.pied_dom !== '++') parts.push('pidom');
            if (geno.fallow_pale && geno.fallow_pale !== '++') parts.push('flp');
            if (geno.fallow_bronze && geno.fallow_bronze !== '++') parts.push('flb');
            return parts.length > 0 ? parts.join('/') : 'WT';
        }
        /**
 * 健康評価実行
 */
function checkPairingHealth() {
    const sireId = document.getElementById('healthSire').value;
    const damId = document.getElementById('healthDam').value;
    const resultEl = document.getElementById('healthCheckResult');
    const T = window.T || {};
    
    if (!sireId || !damId) {
        resultEl.innerHTML = '<div class="warning-box">' + (T.select_both_parents || 'Please select both sire and dam') + '</div>';
        return;
    }
    
    if (typeof BirdDB === 'undefined') {
        resultEl.innerHTML = '<div class="warning-box">' + (T.bird_db_not_loaded || 'BirdDB not loaded') + '</div>';
        return;
    }
    
    const sire = BirdDB.getBird(sireId);
    const dam = BirdDB.getBird(damId);
    
    if (!sire || !dam) {
        resultEl.innerHTML = '<div class="warning-box">' + (T.bird_not_found || 'Bird not found') + '</div>';
        return;
    }
    
    // 近交係数計算
    let ic = 0;
    if (typeof BirdDB.calculateInbreedingCoefficient === 'function') {
        const icResult = BirdDB.calculateInbreedingCoefficient(sireId, damId);
        ic = icResult.coefficient || 0;
    }
    
    // HealthGuardian存在チェック
    if (typeof HealthGuardian === 'undefined' || typeof HealthGuardian.evaluateHealth !== 'function') {
        // フォールバック: 簡易評価
        let riskLevel = 'safe';
        let riskColor = '#10b981';
        let riskBg = 'rgba(16,185,129,0.1)';
        let riskIcon = '✓';
        let riskLabel = T.risk_safe || 'Safe';
        let summary = T.low_health_risk || 'Health risk is low';
        
        if (ic >= 0.25) {
            riskLevel = 'critical';
            riskColor = '#ef4444';
            riskBg = 'rgba(239,68,68,0.1)';
            riskIcon = '🚫';
            riskLabel = T.risk_critical || 'Critical';
            summary = T.inbreeding_danger || 'Inbreeding coefficient is 25% or higher';
        } else if (ic >= 0.125) {
            riskLevel = 'warning';
            riskColor = '#f59e0b';
            riskBg = 'rgba(245,158,11,0.1)';
            riskIcon = '⚠️';
            riskLabel = T.risk_high || 'High Risk';
            summary = T.inbreeding_warning || 'Inbreeding coefficient is 12.5% or higher';
        }
        
        let html = '<div class="health-result" style="margin-top:1rem;padding:1rem;background:' + riskBg + ';border-radius:8px;border-left:4px solid ' + riskColor + ';">';
        html += '<div style="font-size:1.2rem;font-weight:bold;color:' + riskColor + ';">' + riskIcon + ' ' + riskLabel + '</div>';
        html += '<div style="margin-top:0.5rem;color:#e0e0e0;">' + summary + '</div>';
        html += '<div style="margin-top:0.5rem;font-size:0.9rem;color:#aaa;">' + (T.inbreeding_coefficient || 'Inbreeding Coefficient') + ': F = ' + (ic * 100).toFixed(2) + '%</div>';
        html += '</div>';
        resultEl.innerHTML = html;
        return;
    }
    
    // HealthGuardian評価（正常パス）
    const evaluation = HealthGuardian.evaluateHealth(sire, dam, ic);
    
    let html = '<div class="health-result" style="margin-top:1rem;padding:1rem;background:' + evaluation.riskStyle.bg + ';border-radius:8px;border-left:4px solid ' + evaluation.riskStyle.color + ';">';
    html += '<div style="font-size:1.2rem;font-weight:bold;color:' + evaluation.riskStyle.color + ';">' + evaluation.riskStyle.icon + ' ' + evaluation.riskStyle.label + '</div>';
    html += '<div style="margin-top:0.5rem;color:#e0e0e0;">' + evaluation.summary + '</div>';
    html += '<div style="margin-top:0.5rem;font-size:0.9rem;color:#aaa;">' + (T.inbreeding_coefficient || 'Inbreeding Coefficient') + ': F = ' + (ic * 100).toFixed(2) + '%</div>';
    
    if (evaluation.blocks && evaluation.blocks.length > 0) {
        html += '<div style="margin-top:1rem;"><strong style="color:#ef4444;">🚫 ' + (T.risk_critical || 'Breeding Prohibited') + ':</strong><ul style="margin:0.5rem 0;padding-left:1.5rem;">';
        evaluation.blocks.forEach(function(b) {
            html += '<li style="color:#fca5a5;margin:0.25rem 0;">' + b.message + '<br><span style="font-size:0.85rem;color:#888;">' + b.detail + '</span></li>';
        });
        html += '</ul></div>';
    }
    
    if (evaluation.warnings && evaluation.warnings.length > 0) {
        html += '<div style="margin-top:1rem;"><strong style="color:#f59e0b;">⚠️ ' + (T.risk_high || 'Warning') + ':</strong><ul style="margin:0.5rem 0;padding-left:1.5rem;">';
        evaluation.warnings.forEach(function(w) {
            html += '<li style="color:#fcd34d;margin:0.25rem 0;">' + w.message + '<br><span style="font-size:0.85rem;color:#888;">' + w.detail + '</span></li>';
        });
        html += '</ul></div>';
    }
    
    if (evaluation.risks && evaluation.risks.length > 0) {
        html += '<div style="margin-top:1rem;"><strong style="color:#eab308;">⚡ ' + (T.risk_moderate || 'Caution') + ':</strong><ul style="margin:0.5rem 0;padding-left:1.5rem;">';
        evaluation.risks.forEach(function(r) {
            html += '<li style="color:#fef08a;margin:0.25rem 0;">' + r.message + '<br><span style="font-size:0.85rem;color:#888;">' + r.detail + '</span></li>';
        });
        html += '</ul></div>';
    }
    
    if ((!evaluation.blocks || evaluation.blocks.length === 0) && (!evaluation.warnings || evaluation.warnings.length === 0) && (!evaluation.risks || evaluation.risks.length === 0)) {
        html += '<div style="margin-top:0.5rem;color:#10b981;">✓ ' + (T.low_health_risk || 'No health issues detected') + '</div>';
    }
    
    html += '</div>';
    resultEl.innerHTML = html;
}

        setTimeout(initHealthSelectors, 1000);

        
        // 個体DB初期表示
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof refreshBirdList === 'function') {
                refreshBirdList();
            }
            
            // URLハッシュがあれば結果位置にスクロール
            if(window.location.hash){
                const hashTarget = document.querySelector(window.location.hash);
                if(hashTarget){
                    setTimeout(()=>{
                        hashTarget.scrollIntoView({behavior:'smooth', block:'start'});
                    }, 100);
                }
            }
        });
    </script>
    <?php if ($familyResult): ?>
    <script>
        // 推論結果表示後に自動スクロール
        document.addEventListener('DOMContentLoaded', () => {
            const resultEl = document.getElementById('family-result');
            if (resultEl && resultEl.children.length > 0) {
                setTimeout(() => {
                    resultEl.scrollIntoView({behavior:'smooth', block:'start'});
                }, 200);
            }
        });
    </script>
    <?php endif; ?>
    <?php if ($action === 'estimate' && $result): ?>
    <script>
        // 遺伝子型推定結果表示後に自動スクロール
        document.addEventListener('DOMContentLoaded', () => {
            const resultEl = document.getElementById('estimator-result');
            if (resultEl && resultEl.children.length > 0) {
                setTimeout(() => {
                    resultEl.scrollIntoView({behavior:'smooth', block:'start'});
                }, 200);
            }
        });
    </script>
    <?php endif; ?>
    <script>
document.addEventListener('DOMContentLoaded', function() {
    const fSelect = document.getElementById('f_db_select');
    const mSelect = document.getElementById('m_db_select');
    
    if (fSelect) {
        fSelect.addEventListener('change', function() {
            loadBirdToForm('f', this.value);
        });
    }
    if (mSelect) {
        mSelect.addEventListener('change', function() {
            loadBirdToForm('m', this.value);
        });
    }
});
</script>
</body>
</html>
