<?php
/**
 * infer.php - 家系図推論APIエンドポイント
 * Agapornis Gene-Forge v6.7.5
 * 
 * FamilyEstimatorV3 を呼び出して遺伝子型を推論する
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONSリクエスト（プリフライト）への対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'genetics.php';

try {
    // POSTデータを取得
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    $targetPosition = $input['target'] ?? null;
    $birds = $input['birds'] ?? [];
    
    if (!$targetPosition) {
        throw new Exception('target position is required');
    }
    
    if (empty($birds)) {
        throw new Exception('birds data is required');
    }
    
    // birds配列をfamilyMap形式に変換
    $familyMap = [
        'name' => 'Family Inference',
        'offspring' => [],
    ];
    
    foreach ($birds as $bird) {
        $position = $bird['position'] ?? null;
        if (!$position) continue;
        
        // phenotypeを正規化
        $phenotype = $bird['phenotype'] ?? [];
        if (is_array($phenotype)) {
            $normalizedPhenotype = [
                'baseColor' => $phenotype['baseColor'] ?? 'green',
                'eyeColor' => $phenotype['eyeColor'] ?? 'black',
                'darkness' => $phenotype['darkness'] ?? 'none',
            ];
        } else {
            // 文字列の場合（後方互換）
            $normalizedPhenotype = [
                'baseColor' => (string)$phenotype,
                'eyeColor' => 'black',
                'darkness' => 'none',
            ];
        }
        
        // 後方互換マッピング適用
        $normalizedPhenotype['baseColor'] = mapLegacyColorName($normalizedPhenotype['baseColor']);
        
        $birdData = [
            'sex' => $bird['sex'] ?? 'unknown',
            'name' => $bird['name'] ?? '',
            'phenotype' => $normalizedPhenotype,
            'genotype' => $bird['genotype'] ?? [],
            'tentativeGeno' => $bird['tentativeGeno'] ?? [],
        ];
        
        // offspring_N 形式の場合
        if (preg_match('/^offspring_(\d+)$/', $position, $m)) {
            $idx = (int)$m[1];
            $familyMap['offspring'][$idx] = $birdData;
        } else {
            // sire, dam, sire_sire, etc.
            $familyMap[$position] = $birdData;
        }
    }
    
    // FamilyEstimatorV3 で推論実行
    $estimator = new FamilyEstimatorV3();
    $result = $estimator->estimate($familyMap, $targetPosition);
    
    // 成功フラグを追加（既にある場合は上書きしない）
    if (!isset($result['success'])) {
        $result['success'] = true;
    }
    
    // 結果を整形して返す
    if (isset($result['loci']) && is_array($result['loci'])) {
        $possibleGenotypes = [];
        
        foreach ($result['loci'] as $locus) {
            if (!empty($locus['candidates'])) {
                foreach ($locus['candidates'] as $candidate) {
                    $possibleGenotypes[] = [
                        'locus' => $locus['locusKey'],
                        'genotype' => [$locus['locusKey'] => $candidate['genotype']],
                        'probability' => $candidate['probability'] / 100,
                    ];
                }
            }
        }
        
        $result['possibleGenotypes'] = $possibleGenotypes;
        
        // 確定アレルを抽出
        $confirmedAlleles = [];
        foreach ($result['loci'] as $locus) {
            if ($locus['isConfirmed'] ?? false) {
                $confirmedAlleles[$locus['locusKey']] = $locus['topGenotype'];
            }
        }
        $result['confirmedAlleles'] = $confirmedAlleles;
    }
    
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}
