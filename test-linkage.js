/**
 * v7.0 連鎖遺伝テスト
 * Node.js で実行: node test-linkage.js
 */

// Mock LINKAGE_GROUPS (normally injected from PHP)
global.LINKAGE_GROUPS = {
    Z_chromosome: {
        loci: ['cinnamon', 'ino', 'opaline'],
        recombination: {
            cinnamon_ino: 0.03,
            ino_opaline: 0.30,
            cinnamon_opaline: 0.33,
        },
    },
    autosomal_1: {
        loci: ['dark', 'parblue'],
        recombination: {
            dark_parblue: 0.07,
        },
    },
};

// Load GeneticsEngine
const fs = require('fs');
const vm = require('vm');

const geneticsCode = fs.readFileSync('./genetics-engine.js', 'utf8');
const context = {
    console,
    LINKAGE_GROUPS: global.LINKAGE_GROUPS,
    window: {},
    GeneticsEngine: null
};
vm.createContext(context);
vm.runInContext(geneticsCode, context);

const GeneticsEngine = context.window.GeneticsEngine || context.GeneticsEngine;

console.log('\n=== v7.0 連鎖遺伝テスト ===\n');

// Test 1: ハプロタイプ変換
console.log('【Test 1】ハプロタイプ変換');
const maleGeno = {
    cinnamon: '+cin',  // cin スプリット
    ino: '+ino',       // ino スプリット
    opaline: '++',
    dark: 'dd',
    parblue: '++'
};

const haps = GeneticsEngine.genotypeToHaplotypes(maleGeno, 'male', 'cis');
console.log('入力:', JSON.stringify(maleGeno));
console.log('Z染色体ハプロタイプ:', GeneticsEngine.formatHaplotypeSet(haps.Z_chromosome, 'Z_chromosome'));
console.log('');

// Test 2: 配偶子頻度計算 (cis相)
console.log('【Test 2】配偶子頻度計算 (cis相 - cin/ino ダブルスプリット)');

// cis相: cin-ino が同一染色体上
const cisHaps = {
    haplotypes: [
        { cinnamon: 'cin', ino: 'ino', opaline: '+' },  // 変異連鎖
        { cinnamon: '+', ino: '+', opaline: '+' }       // 野生型
    ],
    phase: 'cis'
};

const cisGametes = GeneticsEngine.calculateGameteFrequencies(cisHaps, 'Z_chromosome');
console.log('cis相 配偶子頻度:');
cisGametes.forEach(g => {
    const hapStr = GeneticsEngine.formatHaplotype(g.haplotype, 'Z_chromosome');
    console.log(`  ${hapStr}: ${(g.frequency * 100).toFixed(2)}%`);
});

// 期待値確認
const cinInoLinked = cisGametes.find(g => g.haplotype.cinnamon === 'cin' && g.haplotype.ino === 'ino');
const wildtype = cisGametes.find(g => g.haplotype.cinnamon === '+' && g.haplotype.ino === '+');
const cinOnly = cisGametes.find(g => g.haplotype.cinnamon === 'cin' && g.haplotype.ino === '+');
const inoOnly = cisGametes.find(g => g.haplotype.cinnamon === '+' && g.haplotype.ino === 'ino');

// 期待値: cin-ino間3%組換え、opalineは両ハプロタイプで野生型なので影響なし
// 親型: (100% - 3%) / 2 = 48.5%
// 組換え型: 3% / 2 = 1.5%
console.log('\n期待値との比較:');
console.log(`  cin-ino連鎖: ${cinInoLinked ? (cinInoLinked.frequency * 100).toFixed(2) : 0}% (期待: ~48.5%)`);
console.log(`  野生型: ${wildtype ? (wildtype.frequency * 100).toFixed(2) : 0}% (期待: ~48.5%)`);
console.log(`  cin単独: ${cinOnly ? (cinOnly.frequency * 100).toFixed(2) : 0}% (期待: ~1.5%)`);
console.log(`  ino単独: ${inoOnly ? (inoOnly.frequency * 100).toFixed(2) : 0}% (期待: ~1.5%)`);
console.log('');

// Test 3: trans相の配偶子頻度
console.log('【Test 3】配偶子頻度計算 (trans相 - cin/ino が別染色体)');

const transHaps = {
    haplotypes: [
        { cinnamon: 'cin', ino: '+', opaline: '+' },   // cin のみ
        { cinnamon: '+', ino: 'ino', opaline: '+' }    // ino のみ
    ],
    phase: 'trans'
};

const transGametes = GeneticsEngine.calculateGameteFrequencies(transHaps, 'Z_chromosome');
console.log('trans相 配偶子頻度:');
transGametes.forEach(g => {
    const hapStr = GeneticsEngine.formatHaplotype(g.haplotype, 'Z_chromosome');
    console.log(`  ${hapStr}: ${(g.frequency * 100).toFixed(2)}%`);
});

const transCinIno = transGametes.find(g => g.haplotype.cinnamon === 'cin' && g.haplotype.ino === 'ino');
const transCinOnly = transGametes.find(g => g.haplotype.cinnamon === 'cin' && g.haplotype.ino === '+');
const transInoOnly = transGametes.find(g => g.haplotype.cinnamon === '+' && g.haplotype.ino === 'ino');
const transWild = transGametes.find(g => g.haplotype.cinnamon === '+' && g.haplotype.ino === '+');

// trans相: cin と ino が別染色体上 → 組換えで連鎖型が出現
// 親型: 48.5% (cin単独), 48.5% (ino単独)
// 組換え型: 1.5% (cin-ino連鎖), 1.5% (野生型)
console.log('\n期待値との比較 (trans相):');
console.log(`  cin単独: ${transCinOnly ? (transCinOnly.frequency * 100).toFixed(2) : 0}% (期待: ~48.5%)`);
console.log(`  ino単独: ${transInoOnly ? (transInoOnly.frequency * 100).toFixed(2) : 0}% (期待: ~48.5%)`);
console.log(`  cin-ino連鎖(組換え): ${transCinIno ? (transCinIno.frequency * 100).toFixed(2) : 0}% (期待: ~1.5%)`);
console.log(`  野生型(組換え): ${transWild ? (transWild.frequency * 100).toFixed(2) : 0}% (期待: ~1.5%)`);
console.log('');

// Test 4: 相の推定
console.log('【Test 4】相の推定');
const inferredCis = GeneticsEngine.inferPhase(cisHaps);
const inferredTrans = GeneticsEngine.inferPhase(transHaps);
console.log(`  cis入力 → 推定: ${inferredCis}`);
console.log(`  trans入力 → 推定: ${inferredTrans}`);
console.log('');

// Test 5: dark-parblue 常染色体連鎖
console.log('【Test 5】常染色体連鎖 (dark-parblue, 7%)');

const autoHaps = {
    haplotypes: [
        { dark: 'D', parblue: 'aq' },   // D-aq 連鎖
        { dark: 'd', parblue: '+' }     // 野生型
    ],
    phase: 'cis'
};

const autoGametes = GeneticsEngine.calculateGameteFrequencies(autoHaps, 'autosomal_1');
console.log('配偶子頻度:');
autoGametes.forEach(g => {
    const hapStr = GeneticsEngine.formatHaplotype(g.haplotype, 'autosomal_1');
    console.log(`  ${hapStr}: ${(g.frequency * 100).toFixed(2)}%`);
});
console.log('');

// Test 6: メスのヘミ接合
console.log('【Test 6】メスのヘミ接合（組換えなし）');

const femaleGeno = {
    cinnamon: 'cinW',
    ino: 'inoW',
    opaline: '+W'
};

const femaleHaps = GeneticsEngine.genotypeToHaplotypes(femaleGeno, 'female');
const femaleGametes = GeneticsEngine.calculateGameteFrequencies(femaleHaps.Z_chromosome, 'Z_chromosome');
console.log('メス配偶子:');
femaleGametes.forEach(g => {
    const hapStr = GeneticsEngine.formatHaplotype(g.haplotype, 'Z_chromosome');
    console.log(`  ${hapStr}: ${(g.frequency * 100).toFixed(2)}%`);
});
console.log('');

// 結果サマリー
console.log('=== テスト結果サマリー ===');
const tests = [
    { name: 'ハプロタイプ変換', pass: haps.Z_chromosome.haplotypes.length === 2 },
    { name: 'cis配偶子頻度 (親型48.5%)', pass: Math.abs((cinInoLinked?.frequency || 0) - 0.485) < 0.01 },
    { name: 'cis配偶子頻度 (組換え1.5%)', pass: Math.abs((cinOnly?.frequency || 0) - 0.015) < 0.005 },
    { name: 'trans配偶子頻度 (親型48.5%)', pass: Math.abs((transCinOnly?.frequency || 0) - 0.485) < 0.01 },
    { name: 'trans配偶子頻度 (組換え1.5%)', pass: Math.abs((transCinIno?.frequency || 0) - 0.015) < 0.005 },
    { name: '相推定', pass: inferredCis === 'cis' && inferredTrans === 'trans' },
    { name: '常染色体連鎖 (親型46.5%)', pass: Math.abs((autoGametes[0]?.frequency || 0) - 0.465) < 0.01 },
    { name: 'メスヘミ接合', pass: femaleGametes.length === 1 && femaleGametes[0].frequency === 1.0 },
];

let passCount = 0;
tests.forEach(t => {
    const status = t.pass ? '✓ PASS' : '✗ FAIL';
    console.log(`  ${status}: ${t.name}`);
    if (t.pass) passCount++;
});

console.log(`\n結果: ${passCount}/${tests.length} テスト通過`);

if (passCount === tests.length) {
    console.log('\n🎉 全テスト通過！連鎖遺伝計算は正常に動作しています。');
    process.exit(0);
} else {
    console.log('\n⚠️ 一部テストが失敗しました。');
    process.exit(1);
}
