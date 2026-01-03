<?php
require_once 'readme_lang.php';
$lang = getReadmeLang();
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>README - <?= rt('title') ?></title>
<style>
body{background:#0a0e14;color:#c8d0dc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:2rem;max-width:900px;margin:0 auto;line-height:1.7;font-size:15px}
h1{color:#4ecdc4;border-bottom:1px solid #2a3545;padding-bottom:.5rem}
h2{color:#00e5ff;margin-top:2.5rem;border-left:3px solid #00e5ff;padding-left:.75rem}
h3{color:#88c8c8;margin-top:1.5rem}
a{color:#00e5ff;text-decoration:none}
a:hover{text-decoration:underline}
code{background:#1a2535;padding:.15rem .4rem;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:.9em;color:#e8e8e8}
pre{background:#1a2535;padding:1rem;border-radius:6px;overflow-x:auto;border-left:3px solid #4ecdc4}
pre code{padding:0;background:none}
table{width:100%;border-collapse:collapse;margin:1rem 0}
th,td{border:1px solid #2a3545;padding:.5rem .75rem;text-align:left}
th{background:#1a2535;color:#4ecdc4}
tr:nth-child(even){background:rgba(255,255,255,.02)}
ul,ol{padding-left:1.5rem}
li{margin:.4rem 0}
hr{border:none;border-top:1px solid #2a3545;margin:2rem 0}
.footer{margin-top:3rem;padding-top:1rem;border-top:1px solid #2a3545;color:#666;font-size:.85rem;text-align:center}
.lang-switch{display:flex;gap:.5rem;margin-bottom:1.5rem;flex-wrap:wrap}
.lang-switch a{padding:.4rem .8rem;border-radius:6px;background:#1a2535;color:#888;font-size:.8rem}
.lang-switch a:hover{background:#2a3545;color:#4ecdc4;text-decoration:none}
.lang-switch a.active{background:linear-gradient(135deg,#00e5ff,#00ffc8);color:#000}
</style>
</head>
<body>

<div class="lang-switch">
<a href="?lang=ja" class="<?= $lang==='ja'?'active':'' ?>">日本語</a>
<a href="?lang=en" class="<?= $lang==='en'?'active':'' ?>">EN</a>
<a href="?lang=de" class="<?= $lang==='de'?'active':'' ?>">DE</a>
<a href="?lang=fr" class="<?= $lang==='fr'?'active':'' ?>">FR</a>
<a href="?lang=it" class="<?= $lang==='it'?'active':'' ?>">IT</a>
<a href="?lang=es" class="<?= $lang==='es'?'active':'' ?>">ES</a>
</div>

<h1>🦜 <?= rt('title') ?></h1>
<p><strong><?= rt('subtitle') ?></strong></p>
<p><?= rt('description') ?></p>

<hr>

<h2>✨ <?= rt('features') ?></h2>

<h3>🗂️ <?= rt('feat_db') ?></h3>
<ul>
<li><strong><?= rt('feat_db_1') ?></strong></li>
<li><strong><?= rt('feat_db_2') ?></strong></li>
<li><strong><?= rt('feat_db_3') ?></strong></li>
<li><strong><?= rt('feat_db_4') ?></strong></li>
</ul>

<h3>🛡️ <?= rt('feat_health') ?></h3>
<ul>
<li><strong><?= rt('feat_health_1') ?></strong></li>
<li><strong><?= rt('feat_health_2') ?></strong></li>
<li><strong><?= rt('feat_health_3') ?></strong></li>
</ul>

<h3>🎯 <?= rt('feat_planner') ?></h3>
<ul>
<li><strong><?= rt('feat_planner_1') ?></strong></li>
<li><strong><?= rt('feat_planner_2') ?></strong></li>
</ul>

<h3>🧭 <?= rt('feat_path') ?></h3>
<ul>
<li><strong><?= rt('feat_path_1') ?></strong></li>
<li><strong><?= rt('feat_path_2') ?></strong></li>
</ul>

<h3>🧬 <?= rt('feat_calc') ?></h3>
<ul>
<li><strong><?= rt('feat_calc_1') ?></strong></li>
<li><strong><?= rt('feat_calc_2') ?></strong></li>
<li><strong><?= rt('feat_calc_3') ?></strong></li>
</ul>

<h3>🔬 <?= rt('feat_estimate') ?></h3>
<ul>
<li><strong><?= rt('feat_estimate_1') ?></strong></li>
<li><strong><?= rt('feat_estimate_2') ?></strong></li>
<li><strong><?= rt('feat_estimate_3') ?></strong></li>
</ul>

<h3>👨‍👩‍👧‍👦 <?= rt('feat_family') ?></h3>
<ul>
<li><strong><?= rt('feat_family_1') ?></strong></li>
<li><strong><?= rt('feat_family_2') ?></strong></li>
<li><strong><?= rt('feat_family_3') ?></strong></li>
<li><strong><?= rt('feat_family_4') ?></strong></li>
</ul>

<h3>🌍 <?= rt('feat_lang') ?></h3>
<p><?= rt('feat_lang_list') ?></p>

<hr>

<h2>📁 <?= rt('files') ?></h2>
<pre><code>gene-forge/
├── index.php          # Main UI
├── genetics.php       # Genetics Engine (SSOT)
├── infer.php          # Family Inference API
├── lang.php           # Multilingual Dictionary
├── style.css          # Stylesheet
├── birds.js           # Bird DB (Demo Data)
├── family.js          # Family Tree UI
├── guardian.js        # Health Evaluation
├── breeding.js        # Breeding Validation
├── pedigree.js        # Pedigree Generation
├── planner.js         # Path Planner
└── app.js             # App Init</code></pre>

<hr>

<h2>🚀 <?= rt('quickstart') ?></h2>

<h3><?= rt('requirements') ?></h3>
<ul>
<li><?= rt('req_1') ?></li>
<li><?= rt('req_2') ?></li>
</ul>

<h3><?= rt('installation') ?></h3>
<pre><code>git clone https://github.com/YOUR_USERNAME/gene-forge.git
cd gene-forge
php -S localhost:8000</code></pre>
<p><?= rt('open_browser') ?></p>

<hr>

<h2>🎨 <?= rt('colors') ?></h2>
<table>
<tr><th><?= rt('col_category') ?></th><th><?= rt('col_count') ?></th><th><?= rt('col_example') ?></th></tr>
<tr><td>Green</td><td>3</td><td>Green, Dark Green, Olive</td></tr>
<tr><td>Aqua</td><td>3</td><td>Aqua, Aqua Dark, Aqua DD</td></tr>
<tr><td>Turquoise</td><td>3</td><td>Turquoise, Turquoise Dark, Turquoise DD</td></tr>
<tr><td>Seagreen</td><td>3</td><td>Seagreen, Seagreen Dark, Seagreen DD</td></tr>
<tr><td>INO</td><td>4</td><td>Lutino, Creamino, Creamino Seagreen, Pure White</td></tr>
<tr><td>Opaline</td><td>12</td><td>Opaline Green, Opaline Aqua, …</td></tr>
<tr><td>Cinnamon</td><td>12</td><td>Cinnamon Green, Cinnamon Aqua, …</td></tr>
<tr><td>Pallid</td><td>12</td><td>Pallid Green, Pallid Aqua, …</td></tr>
<tr><td>Violet</td><td>9</td><td>Violet Aqua, Violet Turquoise, …</td></tr>
<tr><td>Fallow</td><td>24</td><td>Pale Fallow Green, Bronze Fallow Aqua, …</td></tr>
<tr><td>Pied</td><td>24</td><td>Dominant Pied Green, Recessive Pied Aqua, …</td></tr>
<tr><td>Dilute</td><td>12</td><td>Dilute Green, Dilute Aqua, …</td></tr>
<tr><td>Edged</td><td>12</td><td>Edged Green, Edged Aqua, …</td></tr>
<tr><td>Orangeface</td><td>12</td><td>Orangeface Green, Yellowface Aqua, …</td></tr>
<tr><td>Pale Headed</td><td>12</td><td>Pale Headed Green, Pale Headed Aqua, …</td></tr>
<tr><td><strong>Tier 2</strong></td><td>150+</td><td>Opaline Cinnamon, Opaline Violet, …</td></tr>
<tr><td><strong>Tier 3</strong></td><td>∞</td><td>Dynamic generation</td></tr>
</table>

<hr>

<h2>🔬 <?= rt('genotypes') ?></h2>

<h3><?= rt('autosomal') ?></h3>
<table>
<tr><th><?= rt('col_locus') ?></th><th><?= rt('col_wildtype') ?></th><th><?= rt('col_mutant') ?></th></tr>
<tr><td>Parblue</td><td><code>++</code></td><td><code>+aq</code>, <code>aqaq</code>, <code>+tq</code>, <code>tqtq</code>, <code>tqaq</code></td></tr>
<tr><td>Dark</td><td><code>dd</code></td><td><code>Dd</code>, <code>DD</code></td></tr>
<tr><td>Violet</td><td><code>vv</code></td><td><code>Vv</code>, <code>VV</code></td></tr>
<tr><td>Dominant Pied</td><td><code>++</code></td><td><code>Pi+</code>, <code>PiPi</code></td></tr>
<tr><td>Recessive Pied</td><td><code>++</code></td><td><code>+pi</code>, <code>pipi</code></td></tr>
<tr><td>Dilute</td><td><code>++</code></td><td><code>+dil</code>, <code>dildil</code></td></tr>
<tr><td>Edged</td><td><code>++</code></td><td><code>+ed</code>, <code>eded</code></td></tr>
<tr><td>Orangeface</td><td><code>++</code></td><td><code>+of</code>, <code>ofof</code></td></tr>
<tr><td>Pale Headed</td><td><code>++</code></td><td><code>+ph</code>, <code>phph</code></td></tr>
<tr><td>Pale Fallow</td><td><code>++</code></td><td><code>+flp</code>, <code>flpflp</code></td></tr>
<tr><td>Bronze Fallow</td><td><code>++</code></td><td><code>+flb</code>, <code>flbflb</code></td></tr>
</table>

<h3><?= rt('sex_linked') ?></h3>
<table>
<tr><th><?= rt('col_locus') ?></th><th><?= rt('col_male_wt') ?></th><th><?= rt('col_male_mut') ?></th><th><?= rt('col_female_wt') ?></th><th><?= rt('col_female_mut') ?></th></tr>
<tr><td>INO</td><td><code>++</code></td><td><code>+ino</code>, <code>inoino</code>, <code>+pld</code>, <code>pldpld</code></td><td><code>+W</code></td><td><code>inoW</code>, <code>pldW</code></td></tr>
<tr><td>Opaline</td><td><code>++</code></td><td><code>+op</code>, <code>opop</code></td><td><code>+W</code></td><td><code>opW</code></td></tr>
<tr><td>Cinnamon</td><td><code>++</code></td><td><code>+cin</code>, <code>cincin</code></td><td><code>+W</code></td><td><code>cinW</code></td></tr>
</table>

<hr>

<h2>🧪 <?= rt('demo') ?></h2>
<p><?= rt('demo_desc') ?></p>

<h3><?= rt('demo_health') ?></h3>
<ul>
<li><?= rt('demo_health_1') ?></li>
<li><?= rt('demo_health_2') ?></li>
<li><?= rt('demo_health_3') ?></li>
</ul>

<h3><?= rt('demo_genetics') ?></h3>
<ul>
<li><?= rt('demo_genetics_1') ?></li>
<li><?= rt('demo_genetics_2') ?></li>
<li><?= rt('demo_genetics_3') ?></li>
</ul>

<h3><?= rt('demo_family') ?></h3>
<ul>
<li><?= rt('demo_family_1') ?></li>
<li><?= rt('demo_family_2') ?></li>
</ul>

<hr>

<h2>📜 <?= rt('license') ?></h2>
<p><strong><?= rt('license_desc') ?></strong></p>
<ul>
<li><?= rt('license_1') ?></li>
<li><?= rt('license_2') ?></li>
<li><?= rt('license_3') ?></li>
</ul>

<hr>

<h2>🤝 <?= rt('contrib') ?></h2>
<p><?= rt('contrib_desc') ?></p>
<p><?= rt('contrib_note') ?></p>
<ul>
<li><?= rt('contrib_1') ?></li>
<li><?= rt('contrib_2') ?></li>
<li><?= rt('contrib_3') ?></li>
<li><?= rt('contrib_4') ?></li>
</ul>

<hr>

<h2>👤 <?= rt('author') ?></h2>
<p><?= rt('author_1') ?><br><?= rt('author_2') ?></p>

<hr>

<h2>🙏 <?= rt('thanks') ?></h2>
<ul>
<li><?= rt('thanks_1') ?></li>
<li><?= rt('thanks_2') ?></li>
</ul>

<div class="footer">
<p><?= rt('footer_license') ?></p>
<p><?= rt('footer_quote') ?></p>
<p><em><?= rt('footer_project') ?></em></p>
</div>

</body>
</html>
