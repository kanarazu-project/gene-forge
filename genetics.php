<?php
/**
 * Agapornis Gene-Forge v6.8
 * 遺伝計算エンジン（ALBS準拠 310色対応版）
 * @author Shohei Taniguchi / Sirius
 * @license CC BY-NC-SA 4.0
 */
declare(strict_types=1);

final class AgapornisLoci
{
    public const LOCI = [
        'parblue' => ['name'=>['ja'=>'パーブルー','en'=>'Parblue'],'type'=>'AR_MULTI','sex_linked'=>false,'alleles'=>['+'=>0,'tq'=>1,'aq'=>2]],
        'dark' => ['name'=>['ja'=>'ダークファクター','en'=>'Dark Factor'],'type'=>'AID','sex_linked'=>false,'alleles'=>['d'=>0,'D'=>1]],
        'violet' => ['name'=>['ja'=>'バイオレット','en'=>'Violet'],'type'=>'AID','sex_linked'=>false,'alleles'=>['v'=>0,'V'=>1]],
        'fallow_pale' => ['name'=>['ja'=>'ペールファロー','en'=>'Pale Fallow'],'type'=>'AR','sex_linked'=>false,'alleles'=>['+'=>0,'flp'=>1]],
        'fallow_bronze' => ['name'=>['ja'=>'ブロンズファロー','en'=>'Bronze Fallow'],'type'=>'AR','sex_linked'=>false,'alleles'=>['+'=>0,'flb'=>1]],
        'pied_dom' => ['name'=>['ja'=>'ドミナントパイド','en'=>'Dominant Pied'],'type'=>'AD','sex_linked'=>false,'alleles'=>['+'=>0,'Pi'=>1]],
        'pied_rec' => ['name'=>['ja'=>'レセッシブパイド','en'=>'Recessive Pied'],'type'=>'AR','sex_linked'=>false,'alleles'=>['+'=>0,'pi'=>1]],
        'dilute' => ['name'=>['ja'=>'ダイリュート','en'=>'Dilute'],'type'=>'AR','sex_linked'=>false,'alleles'=>['+'=>0,'dil'=>1]],
        'edged' => ['name'=>['ja'=>'エッジド','en'=>'Edged'],'type'=>'AR','sex_linked'=>false,'alleles'=>['+'=>0,'ed'=>1]],
        'orangeface' => ['name'=>['ja'=>'オレンジフェイス','en'=>'Orangeface'],'type'=>'AR','sex_linked'=>false,'alleles'=>['+'=>0,'of'=>1]],
        'pale_headed' => ['name'=>['ja'=>'ペールヘッド','en'=>'Pale Headed'],'type'=>'AR','sex_linked'=>false,'alleles'=>['+'=>0,'ph'=>1]],
        'ino' => ['name'=>['ja'=>'INO','en'=>'INO'],'type'=>'SL_MULTI','sex_linked'=>true,'alleles'=>['+'=>0,'pld'=>1,'ino'=>2]],
        'opaline' => ['name'=>['ja'=>'オパーリン','en'=>'Opaline'],'type'=>'SLR','sex_linked'=>true,'alleles'=>['+'=>0,'op'=>1]],
        'cinnamon' => ['name'=>['ja'=>'シナモン','en'=>'Cinnamon'],'type'=>'SLR','sex_linked'=>true,'alleles'=>['+'=>0,'cin'=>1]],
    ];

    /**
     * Linkage Groups (v7.0)
     * 連鎖遺伝グループ定義
     *
     * Z染色体上の3座位（cinnamon, ino, opaline）は連鎖しており、
     * 独立分離ではなく組換え率に基づいた配偶子頻度で計算する。
     *
     * 組換え率:
     * - cinnamon-ino: 3% (ほぼ完全連鎖)
     * - ino-opaline: 30%
     * - cinnamon-opaline: 33%
     * - dark-parblue: 7% (常染色体連鎖)
     */
    public const LINKAGE_GROUPS = [
        'Z_chromosome' => [
            'loci' => ['cinnamon', 'ino', 'opaline'],
            'recombination' => [
                'cinnamon_ino' => 0.03,
                'cinnamon_opaline' => 0.33,
                'ino_opaline' => 0.30,
            ],
        ],
        'autosomal_1' => [
            'loci' => ['dark', 'parblue'],
            'recombination' => [
                'dark_parblue' => 0.07,
            ],
        ],
    ];

    public const COLOR_DEFINITIONS = [
        // 基底色（12色）
        'green'=>['ja'=>'グリーン','en'=>'Green','albs'=>'Green','genotype'=>['parblue'=>'++','dark'=>'dd'],'eye'=>'black','category'=>'green'],
        'darkgreen'=>['ja'=>'ダークグリーン','en'=>'Dark Green','albs'=>'Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd'],'eye'=>'black','category'=>'green'],
        'olive'=>['ja'=>'オリーブ','en'=>'Olive','albs'=>'Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD'],'eye'=>'black','category'=>'green'],
        'aqua'=>['ja'=>'アクア','en'=>'Aqua','albs'=>'Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd'],'eye'=>'black','category'=>'aqua'],
        'aqua_dark'=>['ja'=>'アクアダーク','en'=>'Aqua Dark','albs'=>'Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd'],'eye'=>'black','category'=>'aqua'],
        'aqua_olive'=>['ja'=>'アクアオリーブ','en'=>'Aqua Olive','albs'=>'Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD'],'eye'=>'black','category'=>'aqua'],
        'turquoise'=>['ja'=>'ターコイズ','en'=>'Turquoise','albs'=>'Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd'],'eye'=>'black','category'=>'turquoise'],
        'turquoise_dark'=>['ja'=>'ターコイズダーク','en'=>'Turquoise Dark','albs'=>'Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd'],'eye'=>'black','category'=>'turquoise'],
        'turquoise_olive'=>['ja'=>'ターコイズオリーブ','en'=>'Turquoise Olive','albs'=>'Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD'],'eye'=>'black','category'=>'turquoise'],
        'seagreen'=>['ja'=>'シーグリーン','en'=>'Seagreen','albs'=>'Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd'],'eye'=>'black','category'=>'seagreen'],
        'seagreen_dark'=>['ja'=>'シーグリーンダーク','en'=>'Seagreen Dark','albs'=>'Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd'],'eye'=>'black','category'=>'seagreen'],
        'seagreen_olive'=>['ja'=>'シーグリーンオリーブ','en'=>'Seagreen Olive','albs'=>'Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD'],'eye'=>'black','category'=>'seagreen'],
        // INO（4色）
        'lutino'=>['ja'=>'ルチノー','en'=>'Lutino','albs'=>'Lutino','genotype'=>['parblue'=>'++','ino'=>'inoino'],'eye'=>'red','category'=>'ino'],
        'creamino'=>['ja'=>'クリーミノ','en'=>'Creamino','albs'=>'Creamino Par-Blue','genotype'=>['parblue'=>'aqaq','ino'=>'inoino'],'eye'=>'red','category'=>'ino'],
        'creamino_seagreen'=>['ja'=>'クリーミノシーグリーン','en'=>'Creamino Seagreen','albs'=>'Seagreen Creamino','genotype'=>['parblue'=>'tqaq','ino'=>'inoino'],'eye'=>'red','category'=>'ino'],
        'pure_white'=>['ja'=>'ピュアホワイト','en'=>'Pure White','albs'=>'Whitefaced Creamino','genotype'=>['parblue'=>'tqtq','ino'=>'inoino'],'eye'=>'red','category'=>'ino'],
        // Pallid（12色）
        'pallid_green'=>['ja'=>'パリッドグリーン','en'=>'Pallid Green','albs'=>'Australian Cinnamon Green','genotype'=>['parblue'=>'++','dark'=>'dd','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_darkgreen'=>['ja'=>'パリッドダークグリーン','en'=>'Pallid Dark Green','albs'=>'Australian Cinnamon Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_olive'=>['ja'=>'パリッドオリーブ','en'=>'Pallid Olive','albs'=>'Australian Cinnamon Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_aqua'=>['ja'=>'パリッドアクア','en'=>'Pallid Aqua','albs'=>'Australian Cinnamon Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_aqua_dark'=>['ja'=>'パリッドアクアダーク','en'=>'Pallid Aqua Dark','albs'=>'Australian Cinnamon Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_aqua_olive'=>['ja'=>'パリッドアクアオリーブ','en'=>'Pallid Aqua Olive','albs'=>'Australian Cinnamon Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_turquoise'=>['ja'=>'パリッドターコイズ','en'=>'Pallid Turquoise','albs'=>'Australian Cinnamon Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_turquoise_dark'=>['ja'=>'パリッドターコイズダーク','en'=>'Pallid Turquoise Dark','albs'=>'Australian Cinnamon Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_turquoise_olive'=>['ja'=>'パリッドターコイズオリーブ','en'=>'Pallid Turquoise Olive','albs'=>'Australian Cinnamon Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_seagreen'=>['ja'=>'パリッドシーグリーン','en'=>'Pallid Seagreen','albs'=>'Australian Cinnamon Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_seagreen_dark'=>['ja'=>'パリッドシーグリーンダーク','en'=>'Pallid Seagreen Dark','albs'=>'Australian Cinnamon Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        'pallid_seagreen_olive'=>['ja'=>'パリッドシーグリーンオリーブ','en'=>'Pallid Seagreen Olive','albs'=>'Australian Cinnamon Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','ino'=>'pldpld'],'eye'=>'black','category'=>'pallid'],
        // Cinnamon（12色）
        'cinnamon_green'=>['ja'=>'シナモングリーン','en'=>'Cinnamon Green','albs'=>'American Cinnamon Green','genotype'=>['parblue'=>'++','dark'=>'dd','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_darkgreen'=>['ja'=>'シナモンダークグリーン','en'=>'Cinnamon Dark Green','albs'=>'American Cinnamon Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_olive'=>['ja'=>'シナモンオリーブ','en'=>'Cinnamon Olive','albs'=>'American Cinnamon Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_aqua'=>['ja'=>'シナモンアクア','en'=>'Cinnamon Aqua','albs'=>'American Cinnamon Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_aqua_dark'=>['ja'=>'シナモンアクアダーク','en'=>'Cinnamon Aqua Dark','albs'=>'American Cinnamon Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_aqua_olive'=>['ja'=>'シナモンアクアオリーブ','en'=>'Cinnamon Aqua Olive','albs'=>'American Cinnamon Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_turquoise'=>['ja'=>'シナモンターコイズ','en'=>'Cinnamon Turquoise','albs'=>'American Cinnamon Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_turquoise_dark'=>['ja'=>'シナモンターコイズダーク','en'=>'Cinnamon Turquoise Dark','albs'=>'American Cinnamon Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_turquoise_olive'=>['ja'=>'シナモンターコイズオリーブ','en'=>'Cinnamon Turquoise Olive','albs'=>'American Cinnamon Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_seagreen'=>['ja'=>'シナモンシーグリーン','en'=>'Cinnamon Seagreen','albs'=>'American Cinnamon Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_seagreen_dark'=>['ja'=>'シナモンシーグリーンダーク','en'=>'Cinnamon Seagreen Dark','albs'=>'American Cinnamon Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        'cinnamon_seagreen_olive'=>['ja'=>'シナモンシーグリーンオリーブ','en'=>'Cinnamon Seagreen Olive','albs'=>'American Cinnamon Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','cinnamon'=>'cincin'],'eye'=>'black','category'=>'cinnamon'],
        // Opaline（12色）
        'opaline_green'=>['ja'=>'オパーリングリーン','en'=>'Opaline Green','albs'=>'Opaline Green','genotype'=>['parblue'=>'++','dark'=>'dd','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_darkgreen'=>['ja'=>'オパーリンダークグリーン','en'=>'Opaline Dark Green','albs'=>'Opaline Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_olive'=>['ja'=>'オパーリンオリーブ','en'=>'Opaline Olive','albs'=>'Opaline Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_aqua'=>['ja'=>'オパーリンアクア','en'=>'Opaline Aqua','albs'=>'Opaline Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_aqua_dark'=>['ja'=>'オパーリンアクアダーク','en'=>'Opaline Aqua Dark','albs'=>'Opaline Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_aqua_olive'=>['ja'=>'オパーリンアクアオリーブ','en'=>'Opaline Aqua Olive','albs'=>'Opaline Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_turquoise'=>['ja'=>'オパーリンターコイズ','en'=>'Opaline Turquoise','albs'=>'Opaline Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_turquoise_dark'=>['ja'=>'オパーリンターコイズダーク','en'=>'Opaline Turquoise Dark','albs'=>'Opaline Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_turquoise_olive'=>['ja'=>'オパーリンターコイズオリーブ','en'=>'Opaline Turquoise Olive','albs'=>'Opaline Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_seagreen'=>['ja'=>'オパーリンシーグリーン','en'=>'Opaline Seagreen','albs'=>'Opaline Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_seagreen_dark'=>['ja'=>'オパーリンシーグリーンダーク','en'=>'Opaline Seagreen Dark','albs'=>'Opaline Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        'opaline_seagreen_olive'=>['ja'=>'オパーリンシーグリーンオリーブ','en'=>'Opaline Seagreen Olive','albs'=>'Opaline Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','opaline'=>'opop'],'eye'=>'black','category'=>'opaline'],
        // Violet（8色）- parblue系のみ視覚発現
        'violet_aqua'=>['ja'=>'バイオレットアクア','en'=>'Violet Aqua','albs'=>'Violet Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','violet'=>'Vv'],'eye'=>'black','category'=>'violet'],
        'violet_aqua_dark'=>['ja'=>'バイオレットアクアダーク','en'=>'Violet Aqua Dark','albs'=>'Violet Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','violet'=>'Vv'],'eye'=>'black','category'=>'violet'],
        'violet_aqua_olive'=>['ja'=>'バイオレットアクアオリーブ','en'=>'Violet Aqua Olive','albs'=>'Violet Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','violet'=>'Vv'],'eye'=>'black','category'=>'violet'],
        'violet_turquoise'=>['ja'=>'バイオレットターコイズ','en'=>'Violet Turquoise','albs'=>'Violet Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','violet'=>'Vv'],'eye'=>'black','category'=>'violet'],
        'violet_turquoise_dark'=>['ja'=>'バイオレットターコイズダーク','en'=>'Violet Turquoise Dark','albs'=>'Violet Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','violet'=>'Vv'],'eye'=>'black','category'=>'violet'],
        'violet_turquoise_olive'=>['ja'=>'バイオレットターコイズオリーブ','en'=>'Violet Turquoise Olive','albs'=>'Violet Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','violet'=>'Vv'],'eye'=>'black','category'=>'violet'],
        'violet_seagreen'=>['ja'=>'バイオレットシーグリーン','en'=>'Violet Seagreen','albs'=>'Violet Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','violet'=>'Vv'],'eye'=>'black','category'=>'violet'],
        'violet_seagreen_dark'=>['ja'=>'バイオレットシーグリーンダーク','en'=>'Violet Seagreen Dark','albs'=>'Violet Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','violet'=>'Vv'],'eye'=>'black','category'=>'violet'],
        'violet_seagreen_olive'=>['ja'=>'バイオレットシーグリーンオリーブ','en'=>'Violet Seagreen Olive','albs'=>'Violet Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','violet'=>'Vv'],'eye'=>'black','category'=>'violet'],
        // Pale Fallow（12色）
        'fallow_pale_green'=>['ja'=>'ペールファローグリーン','en'=>'Pale Fallow Green','albs'=>'Pale Fallow Green','genotype'=>['parblue'=>'++','dark'=>'dd','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_darkgreen'=>['ja'=>'ペールファローダークグリーン','en'=>'Pale Fallow Dark Green','albs'=>'Pale Fallow Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_olive'=>['ja'=>'ペールファローオリーブ','en'=>'Pale Fallow Olive','albs'=>'Pale Fallow Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_aqua'=>['ja'=>'ペールファローアクア','en'=>'Pale Fallow Aqua','albs'=>'Pale Fallow Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_aqua_dark'=>['ja'=>'ペールファローアクアダーク','en'=>'Pale Fallow Aqua Dark','albs'=>'Pale Fallow Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_aqua_olive'=>['ja'=>'ペールファローアクアオリーブ','en'=>'Pale Fallow Aqua Olive','albs'=>'Pale Fallow Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        
                'fallow_pale_turquoise'=>['ja'=>'ペールファローターコイズ','en'=>'Pale Fallow Turquoise','albs'=>'Pale Fallow Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_turquoise_dark'=>['ja'=>'ペールファローターコイズダーク','en'=>'Pale Fallow Turquoise Dark','albs'=>'Pale Fallow Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_turquoise_olive'=>['ja'=>'ペールファローターコイズオリーブ','en'=>'Pale Fallow Turquoise Olive','albs'=>'Pale Fallow Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_seagreen'=>['ja'=>'ペールファローシーグリーン','en'=>'Pale Fallow Seagreen','albs'=>'Pale Fallow Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_seagreen_dark'=>['ja'=>'ペールファローシーグリーンダーク','en'=>'Pale Fallow Seagreen Dark','albs'=>'Pale Fallow Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],
        'fallow_pale_seagreen_olive'=>['ja'=>'ペールファローシーグリーンオリーブ','en'=>'Pale Fallow Seagreen Olive','albs'=>'Pale Fallow Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','fallow_pale'=>'flpflp'],'eye'=>'red','category'=>'fallow_pale'],

        // Bronze Fallow（12色）
        'fallow_bronze_green'=>['ja'=>'ブロンズファローグリーン','en'=>'Bronze Fallow Green','albs'=>'Bronze Fallow Green','genotype'=>['parblue'=>'++','dark'=>'dd','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_darkgreen'=>['ja'=>'ブロンズファローダークグリーン','en'=>'Bronze Fallow Dark Green','albs'=>'Bronze Fallow Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_olive'=>['ja'=>'ブロンズファローオリーブ','en'=>'Bronze Fallow Olive','albs'=>'Bronze Fallow Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_aqua'=>['ja'=>'ブロンズファローアクア','en'=>'Bronze Fallow Aqua','albs'=>'Bronze Fallow Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_aqua_dark'=>['ja'=>'ブロンズファローアクアダーク','en'=>'Bronze Fallow Aqua Dark','albs'=>'Bronze Fallow Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_aqua_olive'=>['ja'=>'ブロンズファローアクアオリーブ','en'=>'Bronze Fallow Aqua Olive','albs'=>'Bronze Fallow Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_turquoise'=>['ja'=>'ブロンズファローターコイズ','en'=>'Bronze Fallow Turquoise','albs'=>'Bronze Fallow Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_turquoise_dark'=>['ja'=>'ブロンズファローターコイズダーク','en'=>'Bronze Fallow Turquoise Dark','albs'=>'Bronze Fallow Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_turquoise_olive'=>['ja'=>'ブロンズファローターコイズオリーブ','en'=>'Bronze Fallow Turquoise Olive','albs'=>'Bronze Fallow Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_seagreen'=>['ja'=>'ブロンズファローシーグリーン','en'=>'Bronze Fallow Seagreen','albs'=>'Bronze Fallow Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_seagreen_dark'=>['ja'=>'ブロンズファローシーグリーンダーク','en'=>'Bronze Fallow Seagreen Dark','albs'=>'Bronze Fallow Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        'fallow_bronze_seagreen_olive'=>['ja'=>'ブロンズファローシーグリーンオリーブ','en'=>'Bronze Fallow Seagreen Olive','albs'=>'Bronze Fallow Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','fallow_bronze'=>'flbflb'],'eye'=>'red','category'=>'fallow_bronze'],
        // Dominant Pied（12色）
        'pied_dom_green'=>['ja'=>'ドミナントパイドグリーン','en'=>'Dominant Pied Green','albs'=>'Pied Green','genotype'=>['parblue'=>'++','dark'=>'dd','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_darkgreen'=>['ja'=>'ドミナントパイドダークグリーン','en'=>'Dominant Pied Dark Green','albs'=>'Pied Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_olive'=>['ja'=>'ドミナントパイドオリーブ','en'=>'Dominant Pied Olive','albs'=>'Pied Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_aqua'=>['ja'=>'ドミナントパイドアクア','en'=>'Dominant Pied Aqua','albs'=>'Pied Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_aqua_dark'=>['ja'=>'ドミナントパイドアクアダーク','en'=>'Dominant Pied Aqua Dark','albs'=>'Pied Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_aqua_olive'=>['ja'=>'ドミナントパイドアクアオリーブ','en'=>'Dominant Pied Aqua Olive','albs'=>'Pied Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_turquoise'=>['ja'=>'ドミナントパイドターコイズ','en'=>'Dominant Pied Turquoise','albs'=>'Pied Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_turquoise_dark'=>['ja'=>'ドミナントパイドターコイズダーク','en'=>'Dominant Pied Turquoise Dark','albs'=>'Pied Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_turquoise_olive'=>['ja'=>'ドミナントパイドターコイズオリーブ','en'=>'Dominant Pied Turquoise Olive','albs'=>'Pied Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_seagreen'=>['ja'=>'ドミナントパイドシーグリーン','en'=>'Dominant Pied Seagreen','albs'=>'Pied Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_seagreen_dark'=>['ja'=>'ドミナントパイドシーグリーンダーク','en'=>'Dominant Pied Seagreen Dark','albs'=>'Pied Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        'pied_dom_seagreen_olive'=>['ja'=>'ドミナントパイドシーグリーンオリーブ','en'=>'Dominant Pied Seagreen Olive','albs'=>'Pied Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'pied_dom'],
        // Recessive Pied（12色）
        'pied_rec_green'=>['ja'=>'レセッシブパイドグリーン','en'=>'Recessive Pied Green','albs'=>'Recessive Pied Green','genotype'=>['parblue'=>'++','dark'=>'dd','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_darkgreen'=>['ja'=>'レセッシブパイドダークグリーン','en'=>'Recessive Pied Dark Green','albs'=>'Recessive Pied Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_olive'=>['ja'=>'レセッシブパイドオリーブ','en'=>'Recessive Pied Olive','albs'=>'Recessive Pied Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_aqua'=>['ja'=>'レセッシブパイドアクア','en'=>'Recessive Pied Aqua','albs'=>'Recessive Pied Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_aqua_dark'=>['ja'=>'レセッシブパイドアクアダーク','en'=>'Recessive Pied Aqua Dark','albs'=>'Recessive Pied Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_aqua_olive'=>['ja'=>'レセッシブパイドアクアオリーブ','en'=>'Recessive Pied Aqua Olive','albs'=>'Recessive Pied Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_turquoise'=>['ja'=>'レセッシブパイドターコイズ','en'=>'Recessive Pied Turquoise','albs'=>'Recessive Pied Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_turquoise_dark'=>['ja'=>'レセッシブパイドターコイズダーク','en'=>'Recessive Pied Turquoise Dark','albs'=>'Recessive Pied Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_turquoise_olive'=>['ja'=>'レセッシブパイドターコイズオリーブ','en'=>'Recessive Pied Turquoise Olive','albs'=>'Recessive Pied Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_seagreen'=>['ja'=>'レセッシブパイドシーグリーン','en'=>'Recessive Pied Seagreen','albs'=>'Recessive Pied Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_seagreen_dark'=>['ja'=>'レセッシブパイドシーグリーンダーク','en'=>'Recessive Pied Seagreen Dark','albs'=>'Recessive Pied Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        'pied_rec_seagreen_olive'=>['ja'=>'レセッシブパイドシーグリーンオリーブ','en'=>'Recessive Pied Seagreen Olive','albs'=>'Recessive Pied Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','pied_rec'=>'pipi'],'eye'=>'black','category'=>'pied_rec'],
        // Dilute（12色）
        'dilute_green'=>['ja'=>'ダイリュートグリーン','en'=>'Dilute Green','albs'=>'Dilute Green','genotype'=>['parblue'=>'++','dark'=>'dd','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_darkgreen'=>['ja'=>'ダイリュートダークグリーン','en'=>'Dilute Dark Green','albs'=>'Dilute Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_olive'=>['ja'=>'ダイリュートオリーブ','en'=>'Dilute Olive','albs'=>'Dilute Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_aqua'=>['ja'=>'ダイリュートアクア','en'=>'Dilute Aqua','albs'=>'Dilute Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_aqua_dark'=>['ja'=>'ダイリュートアクアダーク','en'=>'Dilute Aqua Dark','albs'=>'Dilute Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_aqua_olive'=>['ja'=>'ダイリュートアクアオリーブ','en'=>'Dilute Aqua Olive','albs'=>'Dilute Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_turquoise'=>['ja'=>'ダイリュートターコイズ','en'=>'Dilute Turquoise','albs'=>'Dilute Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_turquoise_dark'=>['ja'=>'ダイリュートターコイズダーク','en'=>'Dilute Turquoise Dark','albs'=>'Dilute Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_turquoise_olive'=>['ja'=>'ダイリュートターコイズオリーブ','en'=>'Dilute Turquoise Olive','albs'=>'Dilute Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_seagreen'=>['ja'=>'ダイリュートシーグリーン','en'=>'Dilute Seagreen','albs'=>'Dilute Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_seagreen_dark'=>['ja'=>'ダイリュートシーグリーンダーク','en'=>'Dilute Seagreen Dark','albs'=>'Dilute Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        'dilute_seagreen_olive'=>['ja'=>'ダイリュートシーグリーンオリーブ','en'=>'Dilute Seagreen Olive','albs'=>'Dilute Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','dilute'=>'dildil'],'eye'=>'black','category'=>'dilute'],
        // Orangefaced（12色）- parblue系はYellowfaced
        'orangefaced_green'=>['ja'=>'オレンジフェイスグリーン','en'=>'Orangefaced Green','albs'=>'Orangefaced Green','genotype'=>['parblue'=>'++','dark'=>'dd','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'orangefaced_darkgreen'=>['ja'=>'オレンジフェイスダークグリーン','en'=>'Orangefaced Dark Green','albs'=>'Orangefaced Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'orangefaced_olive'=>['ja'=>'オレンジフェイスオリーブ','en'=>'Orangefaced Olive','albs'=>'Orangefaced Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'yellowfaced_aqua'=>['ja'=>'イエローフェイスアクア','en'=>'Yellowfaced Aqua','albs'=>'Yellowfaced Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'yellowfaced_aqua_dark'=>['ja'=>'イエローフェイスアクアダーク','en'=>'Yellowfaced Aqua Dark','albs'=>'Yellowfaced Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'yellowfaced_aqua_olive'=>['ja'=>'イエローフェイスアクアオリーブ','en'=>'Yellowfaced Aqua Olive','albs'=>'Yellowfaced Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'yellowfaced_turquoise'=>['ja'=>'イエローフェイスターコイズ','en'=>'Yellowfaced Turquoise','albs'=>'Yellowfaced Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'yellowfaced_turquoise_dark'=>['ja'=>'イエローフェイスターコイズダーク','en'=>'Yellowfaced Turquoise Dark','albs'=>'Yellowfaced Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'yellowfaced_turquoise_olive'=>['ja'=>'イエローフェイスターコイズオリーブ','en'=>'Yellowfaced Turquoise Olive','albs'=>'Yellowfaced Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'yellowfaced_seagreen'=>['ja'=>'イエローフェイスシーグリーン','en'=>'Yellowfaced Seagreen','albs'=>'Yellowfaced Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'yellowfaced_seagreen_dark'=>['ja'=>'イエローフェイスシーグリーンダーク','en'=>'Yellowfaced Seagreen Dark','albs'=>'Yellowfaced Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        'yellowfaced_seagreen_olive'=>['ja'=>'イエローフェイスシーグリーンオリーブ','en'=>'Yellowfaced Seagreen Olive','albs'=>'Yellowfaced Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','orangeface'=>'ofof'],'eye'=>'black','category'=>'orangeface'],
        // Edged（12色）
        'edged_green'=>['ja'=>'エッジドグリーン','en'=>'Edged Green','albs'=>'Edged Dilute Green','genotype'=>['parblue'=>'++','dark'=>'dd','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_darkgreen'=>['ja'=>'エッジドダークグリーン','en'=>'Edged Dark Green','albs'=>'Edged Dilute Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_olive'=>['ja'=>'エッジドオリーブ','en'=>'Edged Olive','albs'=>'Edged Dilute Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_aqua'=>['ja'=>'エッジドアクア','en'=>'Edged Aqua','albs'=>'Edged Dilute Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_aqua_dark'=>['ja'=>'エッジドアクアダーク','en'=>'Edged Aqua Dark','albs'=>'Edged Dilute Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_aqua_olive'=>['ja'=>'エッジドアクアオリーブ','en'=>'Edged Aqua Olive','albs'=>'Edged Dilute Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_turquoise'=>['ja'=>'エッジドターコイズ','en'=>'Edged Turquoise','albs'=>'Edged Dilute Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_turquoise_dark'=>['ja'=>'エッジドターコイズダーク','en'=>'Edged Turquoise Dark','albs'=>'Edged Dilute Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_turquoise_olive'=>['ja'=>'エッジドターコイズオリーブ','en'=>'Edged Turquoise Olive','albs'=>'Edged Dilute Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_seagreen'=>['ja'=>'エッジドシーグリーン','en'=>'Edged Seagreen','albs'=>'Edged Dilute Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_seagreen_dark'=>['ja'=>'エッジドシーグリーンダーク','en'=>'Edged Seagreen Dark','albs'=>'Edged Dilute Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        'edged_seagreen_olive'=>['ja'=>'エッジドシーグリーンオリーブ','en'=>'Edged Seagreen Olive','albs'=>'Edged Dilute Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','edged'=>'eded'],'eye'=>'black','category'=>'edged'],
        // Pale Headed（12色）
        'paleheaded_green'=>['ja'=>'ペールヘッドグリーン','en'=>'Pale Headed Green','albs'=>'Pale Headed Green','genotype'=>['parblue'=>'++','dark'=>'dd','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_darkgreen'=>['ja'=>'ペールヘッドダークグリーン','en'=>'Pale Headed Dark Green','albs'=>'Pale Headed Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_olive'=>['ja'=>'ペールヘッドオリーブ','en'=>'Pale Headed Olive','albs'=>'Pale Headed Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_aqua'=>['ja'=>'ペールヘッドアクア','en'=>'Pale Headed Aqua','albs'=>'Pale Headed Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_aqua_dark'=>['ja'=>'ペールヘッドアクアダーク','en'=>'Pale Headed Aqua Dark','albs'=>'Pale Headed Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_aqua_olive'=>['ja'=>'ペールヘッドアクアオリーブ','en'=>'Pale Headed Aqua Olive','albs'=>'Pale Headed Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_turquoise'=>['ja'=>'ペールヘッドターコイズ','en'=>'Pale Headed Turquoise','albs'=>'Pale Headed Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_turquoise_dark'=>['ja'=>'ペールヘッドターコイズダーク','en'=>'Pale Headed Turquoise Dark','albs'=>'Pale Headed Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_turquoise_olive'=>['ja'=>'ペールヘッドターコイズオリーブ','en'=>'Pale Headed Turquoise Olive','albs'=>'Pale Headed Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_seagreen'=>['ja'=>'ペールヘッドシーグリーン','en'=>'Pale Headed Seagreen','albs'=>'Pale Headed Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_seagreen_dark'=>['ja'=>'ペールヘッドシーグリーンダーク','en'=>'Pale Headed Seagreen Dark','albs'=>'Pale Headed Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
        'paleheaded_seagreen_olive'=>['ja'=>'ペールヘッドシーグリーンオリーブ','en'=>'Pale Headed Seagreen Olive','albs'=>'Pale Headed Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','pale_headed'=>'phph'],'eye'=>'black','category'=>'pale_headed'],
            // ============================================================
        // TIER 2: Opaline + INO（4色）#157-160
        // ============================================================
        'opaline_lutino'=>['ja'=>'オパーリンルチノー','en'=>'Opaline Lutino','albs'=>'Opaline Lutino','genotype'=>['parblue'=>'++','opaline'=>'opop','ino'=>'inoino'],'eye'=>'red','category'=>'tier2_opaline_ino','tier'=>2],
        'opaline_creamino'=>['ja'=>'オパーリンクリーミノ','en'=>'Opaline Creamino','albs'=>'Opaline Creamino Par-Blue','genotype'=>['parblue'=>'aqaq','opaline'=>'opop','ino'=>'inoino'],'eye'=>'red','category'=>'tier2_opaline_ino','tier'=>2],
        'opaline_creamino_seagreen'=>['ja'=>'オパーリンクリーミノシーグリーン','en'=>'Opaline Creamino Seagreen','albs'=>'Opaline Seagreen Creamino','genotype'=>['parblue'=>'tqaq','opaline'=>'opop','ino'=>'inoino'],'eye'=>'red','category'=>'tier2_opaline_ino','tier'=>2],
        'opaline_pure_white'=>['ja'=>'オパーリンピュアホワイト','en'=>'Opaline Pure White','albs'=>'Opaline Whitefaced Creamino','genotype'=>['parblue'=>'tqtq','opaline'=>'opop','ino'=>'inoino'],'eye'=>'red','category'=>'tier2_opaline_ino','tier'=>2],
        // ============================================================
        // TIER 2: Opaline + Cinnamon（12色）#161-172
        // ============================================================
        'opaline_cinnamon_green'=>['ja'=>'オパーリンシナモングリーン','en'=>'Opaline Cinnamon Green','albs'=>'Opaline American Cinnamon Green','genotype'=>['parblue'=>'++','dark'=>'dd','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_darkgreen'=>['ja'=>'オパーリンシナモンダークグリーン','en'=>'Opaline Cinnamon Dark Green','albs'=>'Opaline American Cinnamon Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_olive'=>['ja'=>'オパーリンシナモンオリーブ','en'=>'Opaline Cinnamon Olive','albs'=>'Opaline American Cinnamon Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_aqua'=>['ja'=>'オパーリンシナモンアクア','en'=>'Opaline Cinnamon Aqua','albs'=>'Opaline American Cinnamon Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_aqua_dark'=>['ja'=>'オパーリンシナモンアクアダーク','en'=>'Opaline Cinnamon Aqua Dark','albs'=>'Opaline American Cinnamon Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_aqua_olive'=>['ja'=>'オパーリンシナモンアクアオリーブ','en'=>'Opaline Cinnamon Aqua Olive','albs'=>'Opaline American Cinnamon Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_turquoise'=>['ja'=>'オパーリンシナモンターコイズ','en'=>'Opaline Cinnamon Turquoise','albs'=>'Opaline American Cinnamon Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_turquoise_dark'=>['ja'=>'オパーリンシナモンターコイズダーク','en'=>'Opaline Cinnamon Turquoise Dark','albs'=>'Opaline American Cinnamon Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_turquoise_olive'=>['ja'=>'オパーリンシナモンターコイズオリーブ','en'=>'Opaline Cinnamon Turquoise Olive','albs'=>'Opaline American Cinnamon Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_seagreen'=>['ja'=>'オパーリンシナモンシーグリーン','en'=>'Opaline Cinnamon Seagreen','albs'=>'Opaline American Cinnamon Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_seagreen_dark'=>['ja'=>'オパーリンシナモンシーグリーンダーク','en'=>'Opaline Cinnamon Seagreen Dark','albs'=>'Opaline American Cinnamon Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        'opaline_cinnamon_seagreen_olive'=>['ja'=>'オパーリンシナモンシーグリーンオリーブ','en'=>'Opaline Cinnamon Seagreen Olive','albs'=>'Opaline American Cinnamon Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','opaline'=>'opop','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_opaline_cinnamon','tier'=>2],
        // ============================================================
        // TIER 2: Opaline + Pallid（12色）#173-184
        // ============================================================
        'opaline_pallid_green'=>['ja'=>'オパーリンパリッドグリーン','en'=>'Opaline Pallid Green','albs'=>'Opaline Australian Cinnamon Green','genotype'=>['parblue'=>'++','dark'=>'dd','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_darkgreen'=>['ja'=>'オパーリンパリッドダークグリーン','en'=>'Opaline Pallid Dark Green','albs'=>'Opaline Australian Cinnamon Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_olive'=>['ja'=>'オパーリンパリッドオリーブ','en'=>'Opaline Pallid Olive','albs'=>'Opaline Australian Cinnamon Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_aqua'=>['ja'=>'オパーリンパリッドアクア','en'=>'Opaline Pallid Aqua','albs'=>'Opaline Australian Cinnamon Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_aqua_dark'=>['ja'=>'オパーリンパリッドアクアダーク','en'=>'Opaline Pallid Aqua Dark','albs'=>'Opaline Australian Cinnamon Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_aqua_olive'=>['ja'=>'オパーリンパリッドアクアオリーブ','en'=>'Opaline Pallid Aqua Olive','albs'=>'Opaline Australian Cinnamon Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_turquoise'=>['ja'=>'オパーリンパリッドターコイズ','en'=>'Opaline Pallid Turquoise','albs'=>'Opaline Australian Cinnamon Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_turquoise_dark'=>['ja'=>'オパーリンパリッドターコイズダーク','en'=>'Opaline Pallid Turquoise Dark','albs'=>'Opaline Australian Cinnamon Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_turquoise_olive'=>['ja'=>'オパーリンパリッドターコイズオリーブ','en'=>'Opaline Pallid Turquoise Olive','albs'=>'Opaline Australian Cinnamon Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_seagreen'=>['ja'=>'オパーリンパリッドシーグリーン','en'=>'Opaline Pallid Seagreen','albs'=>'Opaline Australian Cinnamon Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_seagreen_dark'=>['ja'=>'オパーリンパリッドシーグリーンダーク','en'=>'Opaline Pallid Seagreen Dark','albs'=>'Opaline Australian Cinnamon Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        'opaline_pallid_seagreen_olive'=>['ja'=>'オパーリンパリッドシーグリーンオリーブ','en'=>'Opaline Pallid Seagreen Olive','albs'=>'Opaline Australian Cinnamon Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','opaline'=>'opop','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_opaline_pallid','tier'=>2],
        // ============================================================
        // TIER 2: Opaline + Violet（8色）#185-192
        // ============================================================
        'opaline_violet_aqua'=>['ja'=>'オパーリンバイオレットアクア','en'=>'Opaline Violet Aqua','albs'=>'Opaline Violet Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','opaline'=>'opop','violet'=>'Vv'],'eye'=>'black','category'=>'tier2_opaline_violet','tier'=>2],
        'opaline_violet_aqua_dark'=>['ja'=>'オパーリンバイオレットアクアダーク','en'=>'Opaline Violet Aqua Dark','albs'=>'Opaline Violet Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','opaline'=>'opop','violet'=>'Vv'],'eye'=>'black','category'=>'tier2_opaline_violet','tier'=>2],
        'opaline_violet_aqua_olive'=>['ja'=>'オパーリンバイオレットアクアオリーブ','en'=>'Opaline Violet Aqua Olive','albs'=>'Opaline Violet Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','opaline'=>'opop','violet'=>'Vv'],'eye'=>'black','category'=>'tier2_opaline_violet','tier'=>2],
        'opaline_violet_turquoise'=>['ja'=>'オパーリンバイオレットターコイズ','en'=>'Opaline Violet Turquoise','albs'=>'Opaline Violet Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','opaline'=>'opop','violet'=>'Vv'],'eye'=>'black','category'=>'tier2_opaline_violet','tier'=>2],
        'opaline_violet_turquoise_dark'=>['ja'=>'オパーリンバイオレットターコイズダーク','en'=>'Opaline Violet Turquoise Dark','albs'=>'Opaline Violet Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','opaline'=>'opop','violet'=>'Vv'],'eye'=>'black','category'=>'tier2_opaline_violet','tier'=>2],
        'opaline_violet_turquoise_olive'=>['ja'=>'オパーリンバイオレットターコイズオリーブ','en'=>'Opaline Violet Turquoise Olive','albs'=>'Opaline Violet Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','opaline'=>'opop','violet'=>'Vv'],'eye'=>'black','category'=>'tier2_opaline_violet','tier'=>2],
        'opaline_violet_seagreen'=>['ja'=>'オパーリンバイオレットシーグリーン','en'=>'Opaline Violet Seagreen','albs'=>'Opaline Violet Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','opaline'=>'opop','violet'=>'Vv'],'eye'=>'black','category'=>'tier2_opaline_violet','tier'=>2],
        'opaline_violet_seagreen_dark'=>['ja'=>'オパーリンバイオレットシーグリーンダーク','en'=>'Opaline Violet Seagreen Dark','albs'=>'Opaline Violet Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','opaline'=>'opop','violet'=>'Vv'],'eye'=>'black','category'=>'tier2_opaline_violet','tier'=>2],
        'opaline_violet_seagreen_olive'=>['ja'=>'オパーリンバイオレットシーグリーンオリーブ','en'=>'Opaline Violet Seagreen Olive','albs'=>'Opaline Violet Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','opaline'=>'opop','violet'=>'Vv'],'eye'=>'black','category'=>'tier2_opaline_violet','tier'=>2],

        // ============================================================
        // TIER 2: Opaline + Pied Dom（12色）#193-204
        // ============================================================
        'opaline_pied_dom_green'=>['ja'=>'オパーリンドミナントパイドグリーン','en'=>'Opaline Dominant Pied Green','albs'=>'Opaline Pied Green','genotype'=>['parblue'=>'++','dark'=>'dd','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_darkgreen'=>['ja'=>'オパーリンドミナントパイドダークグリーン','en'=>'Opaline Dominant Pied Dark Green','albs'=>'Opaline Pied Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_olive'=>['ja'=>'オパーリンドミナントパイドオリーブ','en'=>'Opaline Dominant Pied Olive','albs'=>'Opaline Pied Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_aqua'=>['ja'=>'オパーリンドミナントパイドアクア','en'=>'Opaline Dominant Pied Aqua','albs'=>'Opaline Pied Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_aqua_dark'=>['ja'=>'オパーリンドミナントパイドアクアダーク','en'=>'Opaline Dominant Pied Aqua Dark','albs'=>'Opaline Pied Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_aqua_olive'=>['ja'=>'オパーリンドミナントパイドアクアオリーブ','en'=>'Opaline Dominant Pied Aqua Olive','albs'=>'Opaline Pied Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_turquoise'=>['ja'=>'オパーリンドミナントパイドターコイズ','en'=>'Opaline Dominant Pied Turquoise','albs'=>'Opaline Pied Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_turquoise_dark'=>['ja'=>'オパーリンドミナントパイドターコイズダーク','en'=>'Opaline Dominant Pied Turquoise Dark','albs'=>'Opaline Pied Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_turquoise_olive'=>['ja'=>'オパーリンドミナントパイドターコイズオリーブ','en'=>'Opaline Dominant Pied Turquoise Olive','albs'=>'Opaline Pied Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_seagreen'=>['ja'=>'オパーリンドミナントパイドシーグリーン','en'=>'Opaline Dominant Pied Seagreen','albs'=>'Opaline Pied Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_seagreen_dark'=>['ja'=>'オパーリンドミナントパイドシーグリーンダーク','en'=>'Opaline Dominant Pied Seagreen Dark','albs'=>'Opaline Pied Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        'opaline_pied_dom_seagreen_olive'=>['ja'=>'オパーリンドミナントパイドシーグリーンオリーブ','en'=>'Opaline Dominant Pied Seagreen Olive','albs'=>'Opaline Pied Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','opaline'=>'opop','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_opaline_pied_dom','tier'=>2],
        // ============================================================
        // TIER 2: Opaline + Orangefaced（12色）#205-216
        // ============================================================
        'opaline_orangefaced_green'=>['ja'=>'オパーリンオレンジフェイスグリーン','en'=>'Opaline Orangefaced Green','albs'=>'Opaline Orangefaced Green','genotype'=>['parblue'=>'++','dark'=>'dd','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_orangefaced_darkgreen'=>['ja'=>'オパーリンオレンジフェイスダークグリーン','en'=>'Opaline Orangefaced Dark Green','albs'=>'Opaline Orangefaced Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_orangefaced_olive'=>['ja'=>'オパーリンオレンジフェイスオリーブ','en'=>'Opaline Orangefaced Olive','albs'=>'Opaline Orangefaced Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_yellowfaced_aqua'=>['ja'=>'オパーリンイエローフェイスアクア','en'=>'Opaline Yellowfaced Aqua','albs'=>'Opaline Yellowfaced Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_yellowfaced_aqua_dark'=>['ja'=>'オパーリンイエローフェイスアクアダーク','en'=>'Opaline Yellowfaced Aqua Dark','albs'=>'Opaline Yellowfaced Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_yellowfaced_aqua_olive'=>['ja'=>'オパーリンイエローフェイスアクアオリーブ','en'=>'Opaline Yellowfaced Aqua Olive','albs'=>'Opaline Yellowfaced Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_yellowfaced_turquoise'=>['ja'=>'オパーリンイエローフェイスターコイズ','en'=>'Opaline Yellowfaced Turquoise','albs'=>'Opaline Yellowfaced Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_yellowfaced_turquoise_dark'=>['ja'=>'オパーリンイエローフェイスターコイズダーク','en'=>'Opaline Yellowfaced Turquoise Dark','albs'=>'Opaline Yellowfaced Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_yellowfaced_turquoise_olive'=>['ja'=>'オパーリンイエローフェイスターコイズオリーブ','en'=>'Opaline Yellowfaced Turquoise Olive','albs'=>'Opaline Yellowfaced Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_yellowfaced_seagreen'=>['ja'=>'オパーリンイエローフェイスシーグリーン','en'=>'Opaline Yellowfaced Seagreen','albs'=>'Opaline Yellowfaced Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_yellowfaced_seagreen_dark'=>['ja'=>'オパーリンイエローフェイスシーグリーンダーク','en'=>'Opaline Yellowfaced Seagreen Dark','albs'=>'Opaline Yellowfaced Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        'opaline_yellowfaced_seagreen_olive'=>['ja'=>'オパーリンイエローフェイスシーグリーンオリーブ','en'=>'Opaline Yellowfaced Seagreen Olive','albs'=>'Opaline Yellowfaced Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','opaline'=>'opop','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_opaline_orangeface','tier'=>2],
        // ============================================================
        // TIER 2: Opaline + Edged（12色）#217-228
        // ============================================================
        'opaline_edged_green'=>['ja'=>'オパーリンエッジドグリーン','en'=>'Opaline Edged Green','albs'=>'Opaline Edged Dilute Green','genotype'=>['parblue'=>'++','dark'=>'dd','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_darkgreen'=>['ja'=>'オパーリンエッジドダークグリーン','en'=>'Opaline Edged Dark Green','albs'=>'Opaline Edged Dilute Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_olive'=>['ja'=>'オパーリンエッジドオリーブ','en'=>'Opaline Edged Olive','albs'=>'Opaline Edged Dilute Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_aqua'=>['ja'=>'オパーリンエッジドアクア','en'=>'Opaline Edged Aqua','albs'=>'Opaline Edged Dilute Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_aqua_dark'=>['ja'=>'オパーリンエッジドアクアダーク','en'=>'Opaline Edged Aqua Dark','albs'=>'Opaline Edged Dilute Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_aqua_olive'=>['ja'=>'オパーリンエッジドアクアオリーブ','en'=>'Opaline Edged Aqua Olive','albs'=>'Opaline Edged Dilute Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_turquoise'=>['ja'=>'オパーリンエッジドターコイズ','en'=>'Opaline Edged Turquoise','albs'=>'Opaline Edged Dilute Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_turquoise_dark'=>['ja'=>'オパーリンエッジドターコイズダーク','en'=>'Opaline Edged Turquoise Dark','albs'=>'Opaline Edged Dilute Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_turquoise_olive'=>['ja'=>'オパーリンエッジドターコイズオリーブ','en'=>'Opaline Edged Turquoise Olive','albs'=>'Opaline Edged Dilute Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_seagreen'=>['ja'=>'オパーリンエッジドシーグリーン','en'=>'Opaline Edged Seagreen','albs'=>'Opaline Edged Dilute Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_seagreen_dark'=>['ja'=>'オパーリンエッジドシーグリーンダーク','en'=>'Opaline Edged Seagreen Dark','albs'=>'Opaline Edged Dilute Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        'opaline_edged_seagreen_olive'=>['ja'=>'オパーリンエッジドシーグリーンオリーブ','en'=>'Opaline Edged Seagreen Olive','albs'=>'Opaline Edged Dilute Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','opaline'=>'opop','edged'=>'eded'],'eye'=>'black','category'=>'tier2_opaline_edged','tier'=>2],
        // ============================================================
        // TIER 2: Violet + Pied Dom（8色）#229-236
        // ============================================================
        'violet_pied_dom_aqua'=>['ja'=>'バイオレットドミナントパイドアクア','en'=>'Violet Dominant Pied Aqua','albs'=>'Violet Pied Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','violet'=>'Vv','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_violet_pied_dom','tier'=>2],
        'violet_pied_dom_aqua_dark'=>['ja'=>'バイオレットドミナントパイドアクアダーク','en'=>'Violet Dominant Pied Aqua Dark','albs'=>'Violet Pied Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','violet'=>'Vv','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_violet_pied_dom','tier'=>2],
        'violet_pied_dom_aqua_olive'=>['ja'=>'バイオレットドミナントパイドアクアオリーブ','en'=>'Violet Dominant Pied Aqua Olive','albs'=>'Violet Pied Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','violet'=>'Vv','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_violet_pied_dom','tier'=>2],
        'violet_pied_dom_turquoise'=>['ja'=>'バイオレットドミナントパイドターコイズ','en'=>'Violet Dominant Pied Turquoise','albs'=>'Violet Pied Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','violet'=>'Vv','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_violet_pied_dom','tier'=>2],
        'violet_pied_dom_turquoise_dark'=>['ja'=>'バイオレットドミナントパイドターコイズダーク','en'=>'Violet Dominant Pied Turquoise Dark','albs'=>'Violet Pied Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','violet'=>'Vv','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_violet_pied_dom','tier'=>2],
        'violet_pied_dom_turquoise_olive'=>['ja'=>'バイオレットドミナントパイドターコイズオリーブ','en'=>'Violet Dominant Pied Turquoise Olive','albs'=>'Violet Pied Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','violet'=>'Vv','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_violet_pied_dom','tier'=>2],
        'violet_pied_dom_seagreen'=>['ja'=>'バイオレットドミナントパイドシーグリーン','en'=>'Violet Dominant Pied Seagreen','albs'=>'Violet Pied Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','violet'=>'Vv','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_violet_pied_dom','tier'=>2],
        'violet_pied_dom_seagreen_dark'=>['ja'=>'バイオレットドミナントパイドシーグリーンダーク','en'=>'Violet Dominant Pied Seagreen Dark','albs'=>'Violet Pied Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','violet'=>'Vv','pied_dom'=>'Pi+'],'eye'=>'black','category'=>'tier2_violet_pied_dom','tier'=>2],
        // ============================================================
        // TIER 2: Violet + Edged（8色）#237-244
        // ============================================================
        'violet_edged_aqua'=>['ja'=>'バイオレットエッジドアクア','en'=>'Violet Edged Aqua','albs'=>'Violet Edged Dilute Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','violet'=>'Vv','edged'=>'eded'],'eye'=>'black','category'=>'tier2_violet_edged','tier'=>2],
        'violet_edged_aqua_dark'=>['ja'=>'バイオレットエッジドアクアダーク','en'=>'Violet Edged Aqua Dark','albs'=>'Violet Edged Dilute Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','violet'=>'Vv','edged'=>'eded'],'eye'=>'black','category'=>'tier2_violet_edged','tier'=>2],
        'violet_edged_aqua_olive'=>['ja'=>'バイオレットエッジドアクアオリーブ','en'=>'Violet Edged Aqua Olive','albs'=>'Violet Edged Dilute Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','violet'=>'Vv','edged'=>'eded'],'eye'=>'black','category'=>'tier2_violet_edged','tier'=>2],
        'violet_edged_turquoise'=>['ja'=>'バイオレットエッジドターコイズ','en'=>'Violet Edged Turquoise','albs'=>'Violet Edged Dilute Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','violet'=>'Vv','edged'=>'eded'],'eye'=>'black','category'=>'tier2_violet_edged','tier'=>2],
        'violet_edged_turquoise_dark'=>['ja'=>'バイオレットエッジドターコイズダーク','en'=>'Violet Edged Turquoise Dark','albs'=>'Violet Edged Dilute Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','violet'=>'Vv','edged'=>'eded'],'eye'=>'black','category'=>'tier2_violet_edged','tier'=>2],
        'violet_edged_turquoise_olive'=>['ja'=>'バイオレットエッジドターコイズオリーブ','en'=>'Violet Edged Turquoise Olive','albs'=>'Violet Edged Dilute Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','violet'=>'Vv','edged'=>'eded'],'eye'=>'black','category'=>'tier2_violet_edged','tier'=>2],
        'violet_edged_seagreen'=>['ja'=>'バイオレットエッジドシーグリーン','en'=>'Violet Edged Seagreen','albs'=>'Violet Edged Dilute Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','violet'=>'Vv','edged'=>'eded'],'eye'=>'black','category'=>'tier2_violet_edged','tier'=>2],
        'violet_edged_seagreen_dark'=>['ja'=>'バイオレットエッジドシーグリーンダーク','en'=>'Violet Edged Seagreen Dark','albs'=>'Violet Edged Dilute Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','violet'=>'Vv','edged'=>'eded'],'eye'=>'black','category'=>'tier2_violet_edged','tier'=>2],
        // ============================================================
        // TIER 2: Pied Dom + Cinnamon（12色）#245-256
        // ============================================================
        'pied_dom_cinnamon_green'=>['ja'=>'ドミナントパイドシナモングリーン','en'=>'Dominant Pied Cinnamon Green','albs'=>'Pied American Cinnamon Green','genotype'=>['parblue'=>'++','dark'=>'dd','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_darkgreen'=>['ja'=>'ドミナントパイドシナモンダークグリーン','en'=>'Dominant Pied Cinnamon Dark Green','albs'=>'Pied American Cinnamon Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_olive'=>['ja'=>'ドミナントパイドシナモンオリーブ','en'=>'Dominant Pied Cinnamon Olive','albs'=>'Pied American Cinnamon Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_aqua'=>['ja'=>'ドミナントパイドシナモンアクア','en'=>'Dominant Pied Cinnamon Aqua','albs'=>'Pied American Cinnamon Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_aqua_dark'=>['ja'=>'ドミナントパイドシナモンアクアダーク','en'=>'Dominant Pied Cinnamon Aqua Dark','albs'=>'Pied American Cinnamon Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_aqua_olive'=>['ja'=>'ドミナントパイドシナモンアクアオリーブ','en'=>'Dominant Pied Cinnamon Aqua Olive','albs'=>'Pied American Cinnamon Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_turquoise'=>['ja'=>'ドミナントパイドシナモンターコイズ','en'=>'Dominant Pied Cinnamon Turquoise','albs'=>'Pied American Cinnamon Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_turquoise_dark'=>['ja'=>'ドミナントパイドシナモンターコイズダーク','en'=>'Dominant Pied Cinnamon Turquoise Dark','albs'=>'Pied American Cinnamon Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_turquoise_olive'=>['ja'=>'ドミナントパイドシナモンターコイズオリーブ','en'=>'Dominant Pied Cinnamon Turquoise Olive','albs'=>'Pied American Cinnamon Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_seagreen'=>['ja'=>'ドミナントパイドシナモンシーグリーン','en'=>'Dominant Pied Cinnamon Seagreen','albs'=>'Pied American Cinnamon Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_seagreen_dark'=>['ja'=>'ドミナントパイドシナモンシーグリーンダーク','en'=>'Dominant Pied Cinnamon Seagreen Dark','albs'=>'Pied American Cinnamon Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        'pied_dom_cinnamon_seagreen_olive'=>['ja'=>'ドミナントパイドシナモンシーグリーンオリーブ','en'=>'Dominant Pied Cinnamon Seagreen Olive','albs'=>'Pied American Cinnamon Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','pied_dom'=>'Pi+','cinnamon'=>'cincin'],'eye'=>'black','category'=>'tier2_pied_dom_cinnamon','tier'=>2],
        // ============================================================
        // TIER 2: Pied Dom + Pallid（12色）#257-268
        // ============================================================
        'pied_dom_pallid_green'=>['ja'=>'ドミナントパイドパリッドグリーン','en'=>'Dominant Pied Pallid Green','albs'=>'Pied Australian Cinnamon Green','genotype'=>['parblue'=>'++','dark'=>'dd','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_darkgreen'=>['ja'=>'ドミナントパイドパリッドダークグリーン','en'=>'Dominant Pied Pallid Dark Green','albs'=>'Pied Australian Cinnamon Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_olive'=>['ja'=>'ドミナントパイドパリッドオリーブ','en'=>'Dominant Pied Pallid Olive','albs'=>'Pied Australian Cinnamon Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_aqua'=>['ja'=>'ドミナントパイドパリッドアクア','en'=>'Dominant Pied Pallid Aqua','albs'=>'Pied Australian Cinnamon Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_aqua_dark'=>['ja'=>'ドミナントパイドパリッドアクアダーク','en'=>'Dominant Pied Pallid Aqua Dark','albs'=>'Pied Australian Cinnamon Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_aqua_olive'=>['ja'=>'ドミナントパイドパリッドアクアオリーブ','en'=>'Dominant Pied Pallid Aqua Olive','albs'=>'Pied Australian Cinnamon Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_turquoise'=>['ja'=>'ドミナントパイドパリッドターコイズ','en'=>'Dominant Pied Pallid Turquoise','albs'=>'Pied Australian Cinnamon Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_turquoise_dark'=>['ja'=>'ドミナントパイドパリッドターコイズダーク','en'=>'Dominant Pied Pallid Turquoise Dark','albs'=>'Pied Australian Cinnamon Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_turquoise_olive'=>['ja'=>'ドミナントパイドパリッドターコイズオリーブ','en'=>'Dominant Pied Pallid Turquoise Olive','albs'=>'Pied Australian Cinnamon Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_seagreen'=>['ja'=>'ドミナントパイドパリッドシーグリーン','en'=>'Dominant Pied Pallid Seagreen','albs'=>'Pied Australian Cinnamon Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_seagreen_dark'=>['ja'=>'ドミナントパイドパリッドシーグリーンダーク','en'=>'Dominant Pied Pallid Seagreen Dark','albs'=>'Pied Australian Cinnamon Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        'pied_dom_pallid_seagreen_olive'=>['ja'=>'ドミナントパイドパリッドシーグリーンオリーブ','en'=>'Dominant Pied Pallid Seagreen Olive','albs'=>'Pied Australian Cinnamon Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','pied_dom'=>'Pi+','ino'=>'pldpld'],'eye'=>'black','category'=>'tier2_pied_dom_pallid','tier'=>2],
        // ============================================================
        // TIER 2: Pied Dom + Orangefaced（12色）#269-280
        // ============================================================
        'pied_dom_orangefaced_green'=>['ja'=>'ドミナントパイドオレンジフェイスグリーン','en'=>'Dominant Pied Orangefaced Green','albs'=>'Pied Orangefaced Green','genotype'=>['parblue'=>'++','dark'=>'dd','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_orangefaced_darkgreen'=>['ja'=>'ドミナントパイドオレンジフェイスダークグリーン','en'=>'Dominant Pied Orangefaced Dark Green','albs'=>'Pied Orangefaced Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_orangefaced_olive'=>['ja'=>'ドミナントパイドオレンジフェイスオリーブ','en'=>'Dominant Pied Orangefaced Olive','albs'=>'Pied Orangefaced Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_yellowfaced_aqua'=>['ja'=>'ドミナントパイドイエローフェイスアクア','en'=>'Dominant Pied Yellowfaced Aqua','albs'=>'Pied Yellowfaced Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_yellowfaced_aqua_dark'=>['ja'=>'ドミナントパイドイエローフェイスアクアダーク','en'=>'Dominant Pied Yellowfaced Aqua Dark','albs'=>'Pied Yellowfaced Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_yellowfaced_aqua_olive'=>['ja'=>'ドミナントパイドイエローフェイスアクアオリーブ','en'=>'Dominant Pied Yellowfaced Aqua Olive','albs'=>'Pied Yellowfaced Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_yellowfaced_turquoise'=>['ja'=>'ドミナントパイドイエローフェイスターコイズ','en'=>'Dominant Pied Yellowfaced Turquoise','albs'=>'Pied Yellowfaced Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_yellowfaced_turquoise_dark'=>['ja'=>'ドミナントパイドイエローフェイスターコイズダーク','en'=>'Dominant Pied Yellowfaced Turquoise Dark','albs'=>'Pied Yellowfaced Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_yellowfaced_turquoise_olive'=>['ja'=>'ドミナントパイドイエローフェイスターコイズオリーブ','en'=>'Dominant Pied Yellowfaced Turquoise Olive','albs'=>'Pied Yellowfaced Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_yellowfaced_seagreen'=>['ja'=>'ドミナントパイドイエローフェイスシーグリーン','en'=>'Dominant Pied Yellowfaced Seagreen','albs'=>'Pied Yellowfaced Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_yellowfaced_seagreen_dark'=>['ja'=>'ドミナントパイドイエローフェイスシーグリーンダーク','en'=>'Dominant Pied Yellowfaced Seagreen Dark','albs'=>'Pied Yellowfaced Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        'pied_dom_yellowfaced_seagreen_olive'=>['ja'=>'ドミナントパイドイエローフェイスシーグリーンオリーブ','en'=>'Dominant Pied Yellowfaced Seagreen Olive','albs'=>'Pied Yellowfaced Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','pied_dom'=>'Pi+','orangeface'=>'ofof'],'eye'=>'black','category'=>'tier2_pied_dom_orangeface','tier'=>2],
        // ============================================================
        // TIER 2: Pied Dom + Edged（12色）#281-292
        // ============================================================
        'pied_dom_edged_green'=>['ja'=>'ドミナントパイドエッジドグリーン','en'=>'Dominant Pied Edged Green','albs'=>'Pied Edged Dilute Green','genotype'=>['parblue'=>'++','dark'=>'dd','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_darkgreen'=>['ja'=>'ドミナントパイドエッジドダークグリーン','en'=>'Dominant Pied Edged Dark Green','albs'=>'Pied Edged Dilute Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_olive'=>['ja'=>'ドミナントパイドエッジドオリーブ','en'=>'Dominant Pied Edged Olive','albs'=>'Pied Edged Dilute Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_aqua'=>['ja'=>'ドミナントパイドエッジドアクア','en'=>'Dominant Pied Edged Aqua','albs'=>'Pied Edged Dilute Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_aqua_dark'=>['ja'=>'ドミナントパイドエッジドアクアダーク','en'=>'Dominant Pied Edged Aqua Dark','albs'=>'Pied Edged Dilute Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_aqua_olive'=>['ja'=>'ドミナントパイドエッジドアクアオリーブ','en'=>'Dominant Pied Edged Aqua Olive','albs'=>'Pied Edged Dilute Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_turquoise'=>['ja'=>'ドミナントパイドエッジドターコイズ','en'=>'Dominant Pied Edged Turquoise','albs'=>'Pied Edged Dilute Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_turquoise_dark'=>['ja'=>'ドミナントパイドエッジドターコイズダーク','en'=>'Dominant Pied Edged Turquoise Dark','albs'=>'Pied Edged Dilute Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_turquoise_olive'=>['ja'=>'ドミナントパイドエッジドターコイズオリーブ','en'=>'Dominant Pied Edged Turquoise Olive','albs'=>'Pied Edged Dilute Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_seagreen'=>['ja'=>'ドミナントパイドエッジドシーグリーン','en'=>'Dominant Pied Edged Seagreen','albs'=>'Pied Edged Dilute Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_seagreen_dark'=>['ja'=>'ドミナントパイドエッジドシーグリーンダーク','en'=>'Dominant Pied Edged Seagreen Dark','albs'=>'Pied Edged Dilute Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        'pied_dom_edged_seagreen_olive'=>['ja'=>'ドミナントパイドエッジドシーグリーンオリーブ','en'=>'Dominant Pied Edged Seagreen Olive','albs'=>'Pied Edged Dilute Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','pied_dom'=>'Pi+','edged'=>'eded'],'eye'=>'black','category'=>'tier2_pied_dom_edged','tier'=>2],
        // ============================================================
        // TIER 2: Orangefaced + INO（4色）#293-296
        // ============================================================
        'orangefaced_lutino'=>['ja'=>'オレンジフェイスルチノー','en'=>'Orangefaced Lutino','albs'=>'Orangefaced Lutino','genotype'=>['parblue'=>'++','orangeface'=>'ofof','ino'=>'inoino'],'eye'=>'red','category'=>'tier2_orangeface_ino','tier'=>2],
        'yellowfaced_creamino'=>['ja'=>'イエローフェイスクリーミノ','en'=>'Yellowfaced Creamino','albs'=>'Yellowfaced Creamino Par-Blue','genotype'=>['parblue'=>'aqaq','orangeface'=>'ofof','ino'=>'inoino'],'eye'=>'red','category'=>'tier2_orangeface_ino','tier'=>2],
        'yellowfaced_creamino_seagreen'=>['ja'=>'イエローフェイスクリーミノシーグリーン','en'=>'Yellowfaced Creamino Seagreen','albs'=>'Yellowfaced Seagreen Creamino','genotype'=>['parblue'=>'tqaq','orangeface'=>'ofof','ino'=>'inoino'],'eye'=>'red','category'=>'tier2_orangeface_ino','tier'=>2],
        'yellowfaced_pure_white'=>['ja'=>'イエローフェイスピュアホワイト','en'=>'Yellowfaced Pure White','albs'=>'Yellowfaced Whitefaced Creamino','genotype'=>['parblue'=>'tqtq','orangeface'=>'ofof','ino'=>'inoino'],'eye'=>'red','category'=>'tier2_orangeface_ino','tier'=>2],
        // ============================================================
        // TIER 2: Orangefaced + Edged（12色）#297-308
        // ============================================================
        'orangefaced_edged_green'=>['ja'=>'オレンジフェイスエッジドグリーン','en'=>'Orangefaced Edged Green','albs'=>'Orangefaced Edged Dilute Green','genotype'=>['parblue'=>'++','dark'=>'dd','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'orangefaced_edged_darkgreen'=>['ja'=>'オレンジフェイスエッジドダークグリーン','en'=>'Orangefaced Edged Dark Green','albs'=>'Orangefaced Edged Dilute Medium Green','genotype'=>['parblue'=>'++','dark'=>'Dd','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'orangefaced_edged_olive'=>['ja'=>'オレンジフェイスエッジドオリーブ','en'=>'Orangefaced Edged Olive','albs'=>'Orangefaced Edged Dilute Dark Green','genotype'=>['parblue'=>'++','dark'=>'DD','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'yellowfaced_edged_aqua'=>['ja'=>'イエローフェイスエッジドアクア','en'=>'Yellowfaced Edged Aqua','albs'=>'Yellowfaced Edged Dilute Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'dd','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'yellowfaced_edged_aqua_dark'=>['ja'=>'イエローフェイスエッジドアクアダーク','en'=>'Yellowfaced Edged Aqua Dark','albs'=>'Yellowfaced Edged Dilute Medium Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'Dd','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'yellowfaced_edged_aqua_olive'=>['ja'=>'イエローフェイスエッジドアクアオリーブ','en'=>'Yellowfaced Edged Aqua Olive','albs'=>'Yellowfaced Edged Dilute Dark Par-Blue','genotype'=>['parblue'=>'aqaq','dark'=>'DD','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'yellowfaced_edged_turquoise'=>['ja'=>'イエローフェイスエッジドターコイズ','en'=>'Yellowfaced Edged Turquoise','albs'=>'Yellowfaced Edged Dilute Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'dd','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'yellowfaced_edged_turquoise_dark'=>['ja'=>'イエローフェイスエッジドターコイズダーク','en'=>'Yellowfaced Edged Turquoise Dark','albs'=>'Yellowfaced Edged Dilute Medium Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'Dd','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'yellowfaced_edged_turquoise_olive'=>['ja'=>'イエローフェイスエッジドターコイズオリーブ','en'=>'Yellowfaced Edged Turquoise Olive','albs'=>'Yellowfaced Edged Dilute Dark Whitefaced Par-Blue','genotype'=>['parblue'=>'tqtq','dark'=>'DD','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'yellowfaced_edged_seagreen'=>['ja'=>'イエローフェイスエッジドシーグリーン','en'=>'Yellowfaced Edged Seagreen','albs'=>'Yellowfaced Edged Dilute Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'dd','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'yellowfaced_edged_seagreen_dark'=>['ja'=>'イエローフェイスエッジドシーグリーンダーク','en'=>'Yellowfaced Edged Seagreen Dark','albs'=>'Yellowfaced Edged Dilute Medium Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'Dd','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
        'yellowfaced_edged_seagreen_olive'=>['ja'=>'イエローフェイスエッジドシーグリーンオリーブ','en'=>'Yellowfaced Edged Seagreen Olive','albs'=>'Yellowfaced Edged Dilute Dark Seagreen Par-Blue','genotype'=>['parblue'=>'tqaq','dark'=>'DD','orangeface'=>'ofof','edged'=>'eded'],'eye'=>'black','category'=>'tier2_orangeface_edged','tier'=>2],
]; // COLOR_DEFINITIONS終了

    /**
     * Tier2色を動的生成
     */
    public static function generateTier2Color(array $factors, string $baseKey): array
    {
        $base = self::COLOR_DEFINITIONS[$baseKey] ?? null;
        if (!$base) return [];
        
        $ja = '';
        $en = '';
        $genotype = $base['genotype'];
        $eye = $base['eye'];
        
        // 因子を優先順に処理
        $priority = ['opaline','cinnamon','pallid','fallow_pale','fallow_bronze','dilute','edged','violet','pied_dom','pied_rec','orangeface','pale_headed','ino'];
        
        foreach ($priority as $factor) {
            if (!in_array($factor, $factors)) continue;
            
            switch ($factor) {
                case 'opaline':
                    $ja .= 'オパーリン';
                    $en .= 'Opaline ';
                    $genotype['opaline'] = 'opop';
                    break;
                case 'cinnamon':
                    $ja .= 'シナモン';
                    $en .= 'Cinnamon ';
                    $genotype['cinnamon'] = 'cincin';
                    break;
                case 'pallid':
                    $ja .= 'パリッド';
                    $en .= 'Pallid ';
                    $genotype['ino'] = 'pldpld';
                    break;
                case 'violet':
                    $ja .= 'バイオレット';
                    $en .= 'Violet ';
                    $genotype['violet'] = 'Vv';
                    break;
                case 'pied_dom':
                    $ja .= 'ドミナントパイド';
                    $en .= 'Dominant Pied ';
                    $genotype['pied_dom'] = 'Pi+';
                    break;
                case 'orangeface':
                    $isParblue = ($genotype['parblue'] ?? '++') !== '++';
                    $ja .= $isParblue ? 'イエローフェイス' : 'オレンジフェイス';
                    $en .= $isParblue ? 'Yellowfaced ' : 'Orangefaced ';
                    $genotype['orangeface'] = 'ofof';
                    break;
                case 'edged':
                    $ja .= 'エッジド';
                    $en .= 'Edged ';
                    $genotype['edged'] = 'eded';
                    break;
                case 'ino':
                    $genotype['ino'] = 'inoino';
                    $eye = 'red';
                    break;
            }
        }
        
        $ja .= $base['ja'];
        $en .= $base['en'];
        
        return [
            'ja' => $ja,
            'en' => trim($en),
            'genotype' => $genotype,
            'eye' => $eye,
            'category' => 'tier2_generated',
        ];
    }
    
    /**
     * 全色取得（Tier1 + キャッシュ済みTier2）
     */
    public static function getAllColors(): array
    {
        return self::COLOR_DEFINITIONS;
    }
    
    /**
     * 色数取得
     */
    public static function getColorCount(): int
    {
        return count(self::COLOR_DEFINITIONS);
    }
    
    /**
     * カテゴリ別にグループ化
     */
    public static function groupedByCategory(): array
    {
        $grouped = [];
        foreach (self::COLOR_DEFINITIONS as $key => $def) {
            $cat = $def['category'] ?? 'other';
            $grouped[$cat][$key] = $def;
        }
        return $grouped;
    }

    /**
     * カテゴリラベル取得
     */
        public static function categoryLabel(string $category, bool $isJa = true): string
    {
        $labels = [
            'green' => ['ja' => 'グリーン系', 'en' => 'Green Series'],
            'aqua' => ['ja' => 'アクア系', 'en' => 'Aqua Series'],
            'turquoise' => ['ja' => 'ターコイズ系', 'en' => 'Turquoise Series'],
            'seagreen' => ['ja' => 'シーグリーン系', 'en' => 'Seagreen Series'],
            'ino' => ['ja' => 'INO系', 'en' => 'INO Series'],
            'pallid' => ['ja' => 'パリッド系', 'en' => 'Pallid Series'],
            'cinnamon' => ['ja' => 'シナモン系', 'en' => 'Cinnamon Series'],
            'opaline' => ['ja' => 'オパーリン系', 'en' => 'Opaline Series'],
            'violet' => ['ja' => 'バイオレット系', 'en' => 'Violet Series'],
            'fallow_pale' => ['ja' => 'ペールファロー系', 'en' => 'Pale Fallow Series'],
            'fallow_bronze' => ['ja' => 'ブロンズファロー系', 'en' => 'Bronze Fallow Series'],
            'pied_dom' => ['ja' => 'ドミナントパイド系', 'en' => 'Dominant Pied Series'],
            'pied_rec' => ['ja' => 'レセッシブパイド系', 'en' => 'Recessive Pied Series'],
            'dilute' => ['ja' => 'ダイリュート系', 'en' => 'Dilute Series'],
            'orangeface' => ['ja' => 'オレンジ/イエローフェイス系', 'en' => 'Orange/Yellowfaced Series'],
            'edged' => ['ja' => 'エッジド系', 'en' => 'Edged Series'],
            'pale_headed' => ['ja' => 'ペールヘッド系', 'en' => 'Pale Headed Series'],
            'tier2_opaline_ino' => ['ja' => 'オパーリン+INO系', 'en' => 'Opaline + INO'],
            'tier2_opaline_cinnamon' => ['ja' => 'オパーリン+シナモン系', 'en' => 'Opaline + Cinnamon'],
            'tier2_opaline_pallid' => ['ja' => 'オパーリン+パリッド系', 'en' => 'Opaline + Pallid'],
            'tier2_opaline_violet' => ['ja' => 'オパーリン+バイオレット系', 'en' => 'Opaline + Violet'],
            'tier2_opaline_pied_dom' => ['ja' => 'オパーリン+ドミナントパイド系', 'en' => 'Opaline + Dominant Pied'],
            'tier2_opaline_orangeface' => ['ja' => 'オパーリン+オレンジフェイス系', 'en' => 'Opaline + Orangefaced'],
            'tier2_opaline_edged' => ['ja' => 'オパーリン+エッジド系', 'en' => 'Opaline + Edged'],
            'tier2_violet_pied_dom' => ['ja' => 'バイオレット+ドミナントパイド系', 'en' => 'Violet + Dominant Pied'],
            'tier2_violet_edged' => ['ja' => 'バイオレット+エッジド系', 'en' => 'Violet + Edged'],
            'tier2_pied_dom_cinnamon' => ['ja' => 'ドミナントパイド+シナモン系', 'en' => 'Dominant Pied + Cinnamon'],
            'tier2_pied_dom_pallid' => ['ja' => 'ドミナントパイド+パリッド系', 'en' => 'Dominant Pied + Pallid'],
            'tier2_pied_dom_orangeface' => ['ja' => 'ドミナントパイド+オレンジフェイス系', 'en' => 'Dominant Pied + Orangefaced'],
            'tier2_pied_dom_edged' => ['ja' => 'ドミナントパイド+エッジド系', 'en' => 'Dominant Pied + Edged'],
            'tier2_orangeface_ino' => ['ja' => 'オレンジフェイス+INO系', 'en' => 'Orangefaced + INO'],
            'tier2_orangeface_edged' => ['ja' => 'オレンジフェイス+エッジド系', 'en' => 'Orangefaced + Edged'],
            'tier3_dynamic' => ['ja' => '複合色（動的生成）', 'en' => 'Complex (Dynamic)'],
        ];
        return $labels[$category][$isJa ? 'ja' : 'en'] ?? $category;
    }
    /**
     * 全カテゴリラベル取得
     */
    public static function categoryLabels(bool $isJa = true): array
    {
        $cats = array_unique(array_column(self::COLOR_DEFINITIONS, 'category'));
        $result = [];
        foreach ($cats as $cat) {
            $result[$cat] = self::categoryLabel($cat, $isJa);
        }
        return $result;
    }

    /**
     * 色ラベル一覧（key => label）
     */
    public static function labels(bool $isJa = true): array
    {
        $result = [];
        foreach (self::COLOR_DEFINITIONS as $key => $def) {
            $result[$key] = $isJa ? $def['ja'] : $def['en'];
        }
        return $result;
    }

    /**
     * ラベル→キー逆引き
     */
    public static function labelToKey(bool $isJa = true): array
    {
        $result = [];
        foreach (self::COLOR_DEFINITIONS as $key => $def) {
            $label = $isJa ? $def['ja'] : $def['en'];
            $result[$label] = $key;
        }
        return $result;
    }

    /**
     * カテゴリ別キー一覧
     */
    public static function groupedKeys(): array
    {
        $result = [];
        foreach (self::COLOR_DEFINITIONS as $key => $def) {
            $cat = $def['category'] ?? 'other';
            $result[$cat][] = $key;
        }
        return $result;
    }
        /**
     * Tier 3: 遺伝子型から動的に色名を生成
     * @param array $genotype 遺伝子型配列
     * @param bool $isJa 日本語フラグ
     * @return array ['ja'=>string, 'en'=>string, 'eye'=>string]
     */
    public static function generateColorName(array $genotype, bool $isJa = true): array
    {
        $parts_ja = [];
        $parts_en = [];
        $eye = 'black';
        
        $hasIno = isset($genotype['ino']) && in_array($genotype['ino'], ['inoino', 'inoW']);
        $parblue = $genotype['parblue'] ?? '++';
        $isParblue = $parblue !== '++';
        $dark = $genotype['dark'] ?? 'dd';
        
        if (isset($genotype['opaline']) && in_array($genotype['opaline'], ['opop', 'opW'])) {
            $parts_ja[] = 'オパーリン';
            $parts_en[] = 'Opaline';
        }
        if (!$hasIno && isset($genotype['cinnamon']) && in_array($genotype['cinnamon'], ['cincin', 'cinW'])) {
            $parts_ja[] = 'シナモン';
            $parts_en[] = 'Cinnamon';
        }
        if (!$hasIno && isset($genotype['ino']) && in_array($genotype['ino'], ['pldpld', 'pldW'])) {
            $parts_ja[] = 'パリッド';
            $parts_en[] = 'Pallid';
        }
        if (!$hasIno && isset($genotype['fallow_pale']) && $genotype['fallow_pale'] === 'flpflp') {
            $parts_ja[] = 'ペールファロー';
            $parts_en[] = 'Pale Fallow';
            $eye = 'red';
        }
        if (!$hasIno && isset($genotype['fallow_bronze']) && $genotype['fallow_bronze'] === 'flbflb') {
            $parts_ja[] = 'ブロンズファロー';
            $parts_en[] = 'Bronze Fallow';
            $eye = 'red';
        }
        if (!$hasIno && isset($genotype['dilute']) && $genotype['dilute'] === 'dildil') {
            $parts_ja[] = 'ダイリュート';
            $parts_en[] = 'Dilute';
        }
        if (!$hasIno && isset($genotype['edged']) && $genotype['edged'] === 'eded') {
            $parts_ja[] = 'エッジド';
            $parts_en[] = 'Edged';
        }
        if ($isParblue && isset($genotype['violet']) && in_array($genotype['violet'], ['Vv', 'VV'])) {
            $parts_ja[] = 'バイオレット';
            $parts_en[] = 'Violet';
        }
        if (isset($genotype['pied_dom']) && in_array($genotype['pied_dom'], ['Pi+', 'PiPi'])) {
            $parts_ja[] = 'ドミナントパイド';
            $parts_en[] = 'Dominant Pied';
        }
        if (isset($genotype['pied_rec']) && $genotype['pied_rec'] === 'pipi') {
            $parts_ja[] = 'レセッシブパイド';
            $parts_en[] = 'Recessive Pied';
        }
        if (isset($genotype['orangeface']) && $genotype['orangeface'] === 'ofof') {
            if ($isParblue) {
                $parts_ja[] = 'イエローフェイス';
                $parts_en[] = 'Yellowfaced';
            } else {
                $parts_ja[] = 'オレンジフェイス';
                $parts_en[] = 'Orangefaced';
            }
        }
        if (isset($genotype['pale_headed']) && $genotype['pale_headed'] === 'phph') {
            $parts_ja[] = 'ペールヘッド';
            $parts_en[] = 'Pale Headed';
        }
        
        if ($hasIno) {
            $eye = 'red';
            switch ($parblue) {
                case 'tqtq':
                    $parts_ja[] = 'ピュアホワイト';
                    $parts_en[] = 'Pure White';
                    break;
                case 'tqaq':
                    $parts_ja[] = 'クリーミノシーグリーン';
                    $parts_en[] = 'Creamino Seagreen';
                    break;
                case 'aqaq':
                    $parts_ja[] = 'クリーミノ';
                    $parts_en[] = 'Creamino';
                    break;
                default:
                    $parts_ja[] = 'ルチノー';
                    $parts_en[] = 'Lutino';
            }
        } else {
            $baseNames = [
                '++' => ['dd' => ['ja' => 'グリーン', 'en' => 'Green'], 'Dd' => ['ja' => 'ダークグリーン', 'en' => 'Dark Green'], 'DD' => ['ja' => 'オリーブ', 'en' => 'Olive']],
                'aqaq' => ['dd' => ['ja' => 'アクア', 'en' => 'Aqua'], 'Dd' => ['ja' => 'アクアダーク', 'en' => 'Aqua Dark'], 'DD' => ['ja' => 'アクアオリーブ', 'en' => 'Aqua Olive']],
                'tqtq' => ['dd' => ['ja' => 'ターコイズ', 'en' => 'Turquoise'], 'Dd' => ['ja' => 'ターコイズダーク', 'en' => 'Turquoise Dark'], 'DD' => ['ja' => 'ターコイズオリーブ', 'en' => 'Turquoise Olive']],
                'tqaq' => ['dd' => ['ja' => 'シーグリーン', 'en' => 'Seagreen'], 'Dd' => ['ja' => 'シーグリーンダーク', 'en' => 'Seagreen Dark'], 'DD' => ['ja' => 'シーグリーンオリーブ', 'en' => 'Seagreen Olive']],
            ];
            $baseName = $baseNames[$parblue][$dark] ?? $baseNames['++']['dd'];
            $parts_ja[] = $baseName['ja'];
            $parts_en[] = $baseName['en'];
        }
        
        return [
            'ja' => implode('', $parts_ja),
            'en' => implode(' ', $parts_en),
            'eye' => $eye,
        ];
    }

    /**
     * 遺伝子型から色キーを逆引き
     */
    public static function findColorKey(array $genotype): ?string
    {
        foreach (self::COLOR_DEFINITIONS as $key => $def) {
            if (self::genotypeMatches($def['genotype'], $genotype)) {
                return $key;
            }
        }
        return null;
    }

    private static function genotypeMatches(array $defGeno, array $targetGeno): bool
    {
        // INO系かどうか判定
        $isIno = (isset($targetGeno['ino']) && in_array($targetGeno['ino'], ['inoino', 'inoW'])) ||
                 (isset($defGeno['ino']) && in_array($defGeno['ino'], ['inoino', 'inoW']));
        
        // 性連鎖座位のヘミ接合対応マッピング
        $slEquivalents = [
            'opop' => 'opW',
            'cincin' => 'cinW',
            'inoino' => 'inoW',
            'pldpld' => 'pldW',
        ];
        
        foreach ($defGeno as $locus => $value) {
            if (!isset($targetGeno[$locus])) {
                return false;
            }
            $targetVal = $targetGeno[$locus];
            // 完全一致 or ヘミ接合等価
            if ($targetVal !== $value) {
                $equiv = $slEquivalents[$value] ?? null;
                if ($equiv === null || $targetVal !== $equiv) {
                    return false;
                }
            }
        }
        $wildTypes = ['++', '+W', 'dd'];
        foreach ($targetGeno as $locus => $value) {
            if (!isset($defGeno[$locus])) {
                // INO系なら dark は無視
                if ($isIno && $locus === 'dark') {
                    continue;
                }
                if (!in_array($value, $wildTypes)) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * 遺伝子型から色情報を解決（Tier1/2 → Tier3フォールバック）
     * @param array $genotype 遺伝子型配列
     * @return array 色定義配列
     */
    public static function resolveColor(array $genotype): array
    {
        // 1. 定義済み色を検索（Tier1/2）
        $key = self::findColorKey($genotype);
        if ($key !== null) {
            $color = self::COLOR_DEFINITIONS[$key];
            $color['key'] = $key;
            $color['tier'] = $color['tier'] ?? 1;
            return $color;
        }
        
        // 2. Tier 3: 動的生成
        $generated = self::generateColorName($genotype);
        return [
            'key' => null,
            'ja' => $generated['ja'],
            'en' => $generated['en'],
            'albs' => $generated['en'],
            'genotype' => $genotype,
            'eye' => $generated['eye'],
            'category' => 'tier3_dynamic',
            'tier' => 3,
        ];
    }
}

/**
 * FamilyEstimatorV3 - 一族マップからの遺伝子型推論エンジン
 * @version 6.8
 */
class FamilyEstimatorV3
{
    private array $familyMap;
    private array $targetBird;
    private string $targetPosition;

    /**
     * 家族情報から遺伝子型を推論
     * 
     * @param array $familyMap 家族マップ
     * @param string $targetPosition 推論対象の位置
     * @return array 推論結果
     */
    public function estimate(array $familyMap, string $targetPosition): array
    {
        $this->familyMap = $familyMap;
        $this->targetPosition = $targetPosition;
        $this->targetBird = $this->getBirdAt($targetPosition);

        if (empty($this->targetBird)) {
            return ['error' => '推論対象の個体が見つかりません: ' . $targetPosition];
        }

        if (empty($this->targetBird['sex'])) {
            return ['error' => '推論対象の性別が必要です'];
        }

        $results = [];
        $notes = [];
        $confidenceSum = 0;

        // v6.8対応: AgapornisLoci::LOCI の全座位を処理
        foreach (AgapornisLoci::LOCI as $locusKey => $config) {
            $inference = $this->inferLocus($locusKey, $config);
            $results[] = $inference;
            $confidenceSum += $inference['topProbability'];
            
            if (!empty($inference['note'])) {
                $notes[] = $inference['note'];
            }
        }

        // テスト交配提案を生成
        $testBreedings = $this->generateTestBreedingProposals($results);

        return [
            'success' => true,
            'target' => [
                'position' => $targetPosition,
                'sex' => $this->targetBird['sex'],
                'phenotype' => $this->targetBird['phenotype'] ?? [],
            ],
            'loci' => $results,
            'notes' => $notes,
            'testBreedings' => $testBreedings,
            'overallConfidence' => round($confidenceSum / count(AgapornisLoci::LOCI), 1),
        ];
    }

    /**
     * 位置から個体を取得
     */
    private function getBirdAt(string $position): ?array
    {
        // offspring_N 形式
        if (preg_match('/^offspring_(\d+)$/', $position, $m)) {
            $idx = (int)$m[1];
            return $this->familyMap['offspring'][$idx] ?? null;
        }
        // それ以外は直接キー
        return $this->familyMap[$position] ?? null;
    }

    /**
     * 単一座位の推論
     */
    private function inferLocus(string $locusKey, array $config): array
    {
        $sex = $this->targetBird['sex'];
        $isSexLinked = $config['sex_linked'] ?? false;

        // ===== 証拠収集 =====
        $selfEvidence = $this->getSelfEvidence($locusKey);
        $parentEvidence = $this->getParentEvidence($locusKey);
        $grandparentEvidence = $this->getGrandparentEvidence($locusKey);
        $offspringEvidence = $this->getOffspringEvidence($locusKey);
        $siblingEvidence = $this->getSiblingEvidence($locusKey);

        // ===== 確率計算 =====
        $candidates = $this->calculateProbabilities(
            $locusKey, $config, $sex, $isSexLinked,
            $selfEvidence, $parentEvidence, $grandparentEvidence,
            $offspringEvidence, $siblingEvidence
        );

        return $this->formatLocusResult($locusKey, $config, $candidates);
    }

    /**
     * 自身の表現型から証拠を抽出
     */
    private function getSelfEvidence(string $locusKey): array
    {
        $pheno = $this->targetBird['phenotype'] ?? [];
        $genotype = $this->targetBird['genotype'][$locusKey] ?? null;
        $tentative = $this->targetBird['tentativeGeno'][$locusKey] ?? null;

        return [
            'expressedAllele' => $this->detectAlleleFromPhenotype($locusKey, $pheno),
            'knownGenotype' => $genotype,
            'tentativeGeno' => $tentative,
        ];
    }

    /**
     * 親からの証拠
     */
    private function getParentEvidence(string $locusKey): array
    {
        $evidence = ['sire' => null, 'dam' => null];
        $parents = $this->getParentsOf($this->targetPosition);

        foreach (['sire', 'dam'] as $parentType) {
            $parent = $parents[$parentType] ?? null;
            if ($parent) {
                $evidence[$parentType] = [
                    'expressedAllele' => $this->detectAlleleFromPhenotype($locusKey, $parent['phenotype'] ?? []),
                    'knownGenotype' => $parent['genotype'][$locusKey] ?? null,
                    'tentativeGeno' => $parent['tentativeGeno'][$locusKey] ?? null,
                    'sex' => $parent['sex'] ?? ($parentType === 'sire' ? 'male' : 'female'),
                ];
            }
        }

        return $evidence;
    }

    /**
     * 祖父母からの証拠
     */
    private function getGrandparentEvidence(string $locusKey): array
    {
        $evidence = [];
        $gpPositions = [
            'sire_sire', 'sire_dam', 'dam_sire', 'dam_dam',
            'sire_sire_sire', 'sire_sire_dam', 'sire_dam_sire', 'sire_dam_dam',
            'dam_sire_sire', 'dam_sire_dam', 'dam_dam_sire', 'dam_dam_dam'
        ];

        foreach ($gpPositions as $pos) {
            $gp = $this->familyMap[$pos] ?? null;
            if ($gp) {
                $evidence[$pos] = [
                    'expressedAllele' => $this->detectAlleleFromPhenotype($locusKey, $gp['phenotype'] ?? []),
                    'knownGenotype' => $gp['genotype'][$locusKey] ?? null,
                ];
            }
        }

        return $evidence;
    }

    /**
     * 指定位置の親を取得
     */
    private function getParentsOf(string $position): array
    {
        // 子供の親
        if (strpos($position, 'offspring') === 0) {
            return [
                'sire' => $this->familyMap['sire'] ?? null,
                'dam' => $this->familyMap['dam'] ?? null,
            ];
        }

        // sireの親
        if ($position === 'sire') {
            return [
                'sire' => $this->familyMap['sire_sire'] ?? null,
                'dam' => $this->familyMap['sire_dam'] ?? null,
            ];
        }

        // damの親
        if ($position === 'dam') {
            return [
                'sire' => $this->familyMap['dam_sire'] ?? null,
                'dam' => $this->familyMap['dam_dam'] ?? null,
            ];
        }

        // sire_sireの親
        if ($position === 'sire_sire') {
            return [
                'sire' => $this->familyMap['sire_sire_sire'] ?? null,
                'dam' => $this->familyMap['sire_sire_dam'] ?? null,
            ];
        }

        // sire_damの親
        if ($position === 'sire_dam') {
            return [
                'sire' => $this->familyMap['sire_dam_sire'] ?? null,
                'dam' => $this->familyMap['sire_dam_dam'] ?? null,
            ];
        }

        // dam_sireの親
        if ($position === 'dam_sire') {
            return [
                'sire' => $this->familyMap['dam_sire_sire'] ?? null,
                'dam' => $this->familyMap['dam_sire_dam'] ?? null,
            ];
        }

        // dam_damの親
        if ($position === 'dam_dam') {
            return [
                'sire' => $this->familyMap['dam_dam_sire'] ?? null,
                'dam' => $this->familyMap['dam_dam_dam'] ?? null,
            ];
        }

        return ['sire' => null, 'dam' => null];
    }

    /**
     * 子孫からの証拠（最強の拘束）
     */
    private function getOffspringEvidence(string $locusKey): array
    {
        $evidence = ['count' => 0, 'recessiveCount' => 0, 'recessiveAllele' => null, 'offspring' => []];

        // sire/damの場合のみ子孫証拠を収集
        if ($this->targetPosition !== 'sire' && $this->targetPosition !== 'dam') {
            return $evidence;
        }

        $offspring = $this->familyMap['offspring'] ?? [];
        $evidence['count'] = count($offspring);

        foreach ($offspring as $child) {
            $allele = $this->detectAlleleFromPhenotype($locusKey, $child['phenotype'] ?? []);
            $evidence['offspring'][] = [
                'sex' => $child['sex'] ?? 'unknown',
                'allele' => $allele,
            ];
            if ($allele) {
                $evidence['recessiveCount']++;
                $evidence['recessiveAllele'] = $allele;
            }
        }

        return $evidence;
    }

    /**
     * 兄弟からの証拠
     */
    private function getSiblingEvidence(string $locusKey): array
    {
        $evidence = ['count' => 0, 'recessiveCount' => 0, 'recessiveAllele' => null];

        // 子供の場合のみ兄弟証拠を収集
        if (strpos($this->targetPosition, 'offspring') !== 0) {
            return $evidence;
        }

        $targetIdx = (int)str_replace('offspring_', '', $this->targetPosition);
        $offspring = $this->familyMap['offspring'] ?? [];

        foreach ($offspring as $idx => $child) {
            if ($idx === $targetIdx) continue;

            $evidence['count']++;
            $allele = $this->detectAlleleFromPhenotype($locusKey, $child['phenotype'] ?? []);
            if ($allele) {
                $evidence['recessiveCount']++;
                $evidence['recessiveAllele'] = $allele;
            }
        }

        return $evidence;
    }

    /**
     * 表現型からアレルを検出
     * v6.8: COLOR_DEFINITIONSベースの検出
     */
    private function detectAlleleFromPhenotype(string $locusKey, array $phenotype): ?string
    {
        $baseColor = strtolower($phenotype['baseColor'] ?? '');
        $eyeColor = strtolower($phenotype['eyeColor'] ?? 'black');

        // COLOR_DEFINITIONSから遺伝子型を取得
        $colorDef = AgapornisLoci::COLOR_DEFINITIONS[$baseColor] ?? null;
        if ($colorDef && isset($colorDef['genotype'][$locusKey])) {
            $geno = $colorDef['genotype'][$locusKey];
            // ホモ接合の劣性アレルを返す
            if ($this->isHomozygousRecessive($locusKey, $geno)) {
                return $this->extractRecessiveAllele($locusKey, $geno);
            }
        }

        // フォールバック: 従来の文字列マッチング
        return $this->detectAlleleByPattern($locusKey, $baseColor, $eyeColor);
    }

    /**
     * ホモ接合劣性かどうか判定
     */
    private function isHomozygousRecessive(string $locusKey, string $genotype): bool
    {
        $recessivePatterns = [
            'parblue' => ['aqaq', 'tqtq', 'tqaq'],
            'ino' => ['inoino', 'inoW', 'pldpld', 'pldW'],
            'opaline' => ['opop', 'opW'],
            'cinnamon' => ['cincin', 'cinW'],
            'dark' => ['DD', 'Dd'], // 優性なので逆
            'violet' => ['VV', 'Vv'],
            'fallow_pale' => ['flpflp'],
            'fallow_bronze' => ['flbflb'],
            'pied_dom' => ['Pi+', 'PiPi'],
            'pied_rec' => ['pipi'],
            'dilute' => ['dildil'],
            'edged' => ['eded'],
            'orangeface' => ['ofof'],
            'pale_headed' => ['phph'],
        ];

        return in_array($genotype, $recessivePatterns[$locusKey] ?? []);
    }

    /**
     * 劣性アレルを抽出
     */
    private function extractRecessiveAllele(string $locusKey, string $genotype): string
    {
        // 遺伝子型からアレルを抽出
        $alleleMap = [
            'aqaq' => 'aq', 'tqtq' => 'tq', 'tqaq' => 'tq/aq',
            'inoino' => 'ino', 'inoW' => 'ino', 'pldpld' => 'pld', 'pldW' => 'pld',
            'opop' => 'op', 'opW' => 'op',
            'cincin' => 'cin', 'cinW' => 'cin',
            'DD' => 'D', 'Dd' => 'D',
            'VV' => 'V', 'Vv' => 'V',
            'flpflp' => 'flp', 'flbflb' => 'flb',
            'Pi+' => 'Pi', 'PiPi' => 'Pi',
            'pipi' => 'pi',
            'dildil' => 'dil',
            'eded' => 'ed',
            'ofof' => 'of',
            'phph' => 'ph',
        ];

        return $alleleMap[$genotype] ?? $genotype;
    }

    /**
     * パターンマッチングによるアレル検出（フォールバック）
     */
    private function detectAlleleByPattern(string $locusKey, string $baseColor, string $eyeColor): ?string
    {
        switch ($locusKey) {
            case 'parblue':
                if (strpos($baseColor, 'aqua') !== false) return 'aq';
                if (strpos($baseColor, 'turquoise') !== false) return 'tq';
                if (strpos($baseColor, 'seagreen') !== false) return 'tq/aq';
                break;

            case 'ino':
                if (strpos($baseColor, 'lutino') !== false) return 'ino';
                if (strpos($baseColor, 'creamino') !== false) return 'ino';
                if (strpos($baseColor, 'pure_white') !== false) return 'ino';
                if (strpos($baseColor, 'pallid') !== false) return 'pld';
                if ($eyeColor === 'red') return 'ino';
                break;

            case 'opaline':
                if (strpos($baseColor, 'opaline') !== false) return 'op';
                break;

            case 'cinnamon':
                if (strpos($baseColor, 'cinnamon') !== false) return 'cin';
                break;

            case 'fallow_pale':
                if (strpos($baseColor, 'fallow_pale') !== false) return 'flp';
                break;

            case 'fallow_bronze':
                if (strpos($baseColor, 'fallow_bronze') !== false) return 'flb';
                break;

            case 'pied_dom':
                if (strpos($baseColor, 'pied_dom') !== false) return 'Pi';
                break;

            case 'pied_rec':
                if (strpos($baseColor, 'pied_rec') !== false) return 'pi';
                break;

            case 'dilute':
                if (strpos($baseColor, 'dilute') !== false) return 'dil';
                break;

            case 'edged':
                if (strpos($baseColor, 'edged') !== false) return 'ed';
                break;

            case 'orangeface':
                if (strpos($baseColor, 'orangeface') !== false || strpos($baseColor, 'yellowface') !== false) return 'of';
                break;

            case 'pale_headed':
                if (strpos($baseColor, 'paleheaded') !== false) return 'ph';
                break;
        }

        return null;
    }

    /**
     * 確率計算
     */
    private function calculateProbabilities(
        string $locusKey,
        array $config,
        string $sex,
        bool $isSexLinked,
        array $selfEvidence,
        array $parentEvidence,
        array $grandparentEvidence,
        array $offspringEvidence,
        array $siblingEvidence
    ): array {
        $candidates = [];
        $alleles = array_keys($config['alleles'] ?? ['+' => 0]);

        // 遺伝子型の全候補を生成
        if ($isSexLinked && $sex === 'female') {
            // メスはヘミ接合（ZW）
            foreach ($alleles as $a) {
                $geno = $a . 'W';
                $candidates[$geno] = ['genotype' => $geno, 'probability' => 100 / count($alleles)];
            }
        } else {
            // オスまたは常染色体（ホモ/ヘテロ）
            foreach ($alleles as $a1) {
                foreach ($alleles as $a2) {
                    $pair = [$a1, $a2];
                    sort($pair);
                    $geno = implode('', $pair);
                    if (!isset($candidates[$geno])) {
                        $candidates[$geno] = ['genotype' => $geno, 'probability' => 0];
                    }
                    $candidates[$geno]['probability'] += 100 / (count($alleles) * count($alleles));
                }
            }
        }

        // 1. 自己証拠による拘束
        if ($selfEvidence['knownGenotype']) {
            // 既知の遺伝子型があれば確定
            foreach ($candidates as $geno => &$data) {
                $data['probability'] = ($geno === $selfEvidence['knownGenotype']) ? 100 : 0;
            }
        } elseif ($selfEvidence['expressedAllele']) {
            // 表現型が出ている → その遺伝子型を含む候補のみ
            $allele = $selfEvidence['expressedAllele'];
            foreach ($candidates as $geno => &$data) {
                if (strpos($geno, $allele) === false && $geno !== $allele . 'W') {
                    $data['probability'] = 0;
                }
            }
        }

        // 2. 親証拠による拘束
        $candidates = $this->applyParentConstraint($candidates, $parentEvidence, $locusKey, $sex, $isSexLinked);

        // 3. 子孫証拠による拘束（最強）
        $candidates = $this->applyOffspringConstraint($candidates, $offspringEvidence, $locusKey, $sex, $isSexLinked);

        // 4. 兄弟証拠による拘束
        $candidates = $this->applySiblingConstraint($candidates, $siblingEvidence, $parentEvidence, $locusKey);

        // 正規化
        $total = array_sum(array_column($candidates, 'probability'));
        if ($total > 0) {
            foreach ($candidates as &$data) {
                $data['probability'] = round($data['probability'] / $total * 100, 1);
            }
        }

        // 確率順にソート
        uasort($candidates, fn($a, $b) => $b['probability'] <=> $a['probability']);

        return $candidates;
    }


    /**
     * 親拘束の適用（改善版）
     */
    private function applyParentConstraint(array $candidates, array $parentEvidence, string $locusKey, string $sex, bool $isSexLinked): array
    {
        $sire = $parentEvidence['sire'] ?? null;
        $dam = $parentEvidence['dam'] ?? null;

        if (!$sire && !$dam) return $candidates;

        // ===== 新規追加: 既知遺伝子型による完全拘束 =====
        $sireAlleles = $sire ? $this->extractAllelesFromGenotype($sire['knownGenotype'] ?? null, $locusKey) : null;
        $damAlleles = $dam ? $this->extractAllelesFromGenotype($dam['knownGenotype'] ?? null, $locusKey) : null;

        if ($sireAlleles !== null || $damAlleles !== null) {
            foreach ($candidates as $geno => &$data) {
                if (!$this->canInheritGenotype($geno, $sireAlleles, $damAlleles, $sex, $isSexLinked)) {
                    $data['probability'] = 0;
                }
            }
        }

        // ===== 既存ロジック: 伴性遺伝の特殊ケース =====
        if ($isSexLinked) {
            if ($sex === 'female' && $sire && $sire['expressedAllele']) {
                $fatherAllele = $sire['expressedAllele'];
                foreach ($candidates as $geno => &$data) {
                    if (strpos($geno, $fatherAllele) === false) {
                        $data['probability'] = 0;
                    }
                }
            }
            if ($sex === 'male' && $dam && $dam['expressedAllele']) {
                $motherAllele = $dam['expressedAllele'];
                foreach ($candidates as $geno => &$data) {
                    if (strpos($geno, $motherAllele) === false) {
                        $data['probability'] *= 0.5;
                    }
                }
            }
        }

        // ===== 既存ロジック: 両親野生型表現 =====
        if ($sire && !$sire['expressedAllele'] && $dam && !$dam['expressedAllele']) {
            foreach ($candidates as $geno => &$data) {
                if ($this->isHomozygousRecessive($locusKey, $geno)) {
                    $data['probability'] *= 0.25;
                }
            }
        }

        return $candidates;
    }

/**
 * 遺伝子型からアレルペアを抽出
 */
private function extractAllelesFromGenotype(?string $genotype, string $locusKey): ?array
{
    if (!$genotype) return null;
    
    // ヘミ接合（メス伴性）
    if (strpos($genotype, 'W') !== false) {
        $allele = str_replace('W', '', $genotype);
        return [$allele];
    }
    
    // ホモ接合パターン
    $homoPatterns = [
        '++' => ['+', '+'],
        'aqaq' => ['aq', 'aq'],
        'tqtq' => ['tq', 'tq'],
        'inoino' => ['ino', 'ino'],
        'pldpld' => ['pld', 'pld'],
        'opop' => ['op', 'op'],
        'cincin' => ['cin', 'cin'],
        'DD' => ['D', 'D'],
        'dd' => ['d', 'd'],
        'VV' => ['V', 'V'],
        'vv' => ['v', 'v'],
        'flpflp' => ['flp', 'flp'],
        'flbflb' => ['flb', 'flb'],
        'PiPi' => ['Pi', 'Pi'],
        'pipi' => ['pi', 'pi'],
        'dildil' => ['dil', 'dil'],
        'eded' => ['ed', 'ed'],
        'ofof' => ['of', 'of'],
        'phph' => ['ph', 'ph'],
    ];
    
    if (isset($homoPatterns[$genotype])) {
        return $homoPatterns[$genotype];
    }
    
    // ヘテロ接合パターン
    $heteroPatterns = [
        '+aq' => ['+', 'aq'],
        '+tq' => ['+', 'tq'],
        'tqaq' => ['tq', 'aq'],
        '+ino' => ['+', 'ino'],
        '+pld' => ['+', 'pld'],
        '+op' => ['+', 'op'],
        '+cin' => ['+', 'cin'],
        'Dd' => ['D', 'd'],
        'Vv' => ['V', 'v'],
        '+flp' => ['+', 'flp'],
        '+flb' => ['+', 'flb'],
        'Pi+' => ['Pi', '+'],
        '+pi' => ['+', 'pi'],
        '+dil' => ['+', 'dil'],
        '+ed' => ['+', 'ed'],
        '+of' => ['+', 'of'],
        '+ph' => ['+', 'ph'],
    ];
    
    if (isset($heteroPatterns[$genotype])) {
        return $heteroPatterns[$genotype];
    }
    
    return null;
}

/**
 * 子の遺伝子型が親から遺伝可能か判定
 */
private function canInheritGenotype(string $childGeno, ?array $sireAlleles, ?array $damAlleles, string $sex, bool $isSexLinked): bool
{
    $childAlleles = $this->extractAllelesFromGenotype($childGeno, '');
    if (!$childAlleles) return true;
    
    if ($isSexLinked) {
        if ($sex === 'female') {
            if ($sireAlleles !== null) {
                $fromSire = false;
                foreach ($sireAlleles as $sa) {
                    if (in_array($sa, $childAlleles)) {
                        $fromSire = true;
                        break;
                    }
                }
                if (!$fromSire) return false;
            }
        } else {
            if ($sireAlleles !== null && $damAlleles !== null) {
                $possible = false;
                foreach ($sireAlleles as $sa) {
                    foreach ($damAlleles as $da) {
                        $pair = [$sa, $da];
                        sort($pair);
                        $testGeno = implode('', $pair);
                        if ($testGeno === $childGeno || $this->genotypeEquivalent($testGeno, $childGeno)) {
                            $possible = true;
                            break 2;
                        }
                    }
                }
                if (!$possible) return false;
            }
        }
    } else {
        if ($sireAlleles !== null && $damAlleles !== null) {
            $possible = false;
            foreach ($sireAlleles as $sa) {
                foreach ($damAlleles as $da) {
                    $pair = [$sa, $da];
                    sort($pair);
                    $testGeno = implode('', $pair);
                    if ($testGeno === $childGeno || $this->genotypeEquivalent($testGeno, $childGeno)) {
                        $possible = true;
                        break 2;
                    }
                }
            }
            if (!$possible) return false;
        } elseif ($sireAlleles !== null) {
            $hasFromSire = false;
            foreach ($sireAlleles as $sa) {
                if (strpos($childGeno, $sa) !== false) {
                    $hasFromSire = true;
                    break;
                }
            }
            if (!$hasFromSire) return false;
        } elseif ($damAlleles !== null) {
            $hasFromDam = false;
            foreach ($damAlleles as $da) {
                if (strpos($childGeno, $da) !== false) {
                    $hasFromDam = true;
                    break;
                }
            }
            if (!$hasFromDam) return false;
        }
    }
    
    return true;
}

/**
 * 遺伝子型の等価判定（表記揺れ対応）
 */
private function genotypeEquivalent(string $g1, string $g2): bool
{
    $normalize = function($g) {
        $g = str_replace(['++'], ['+/+'], $g);
        $parts = explode('/', $g);
        if (count($parts) === 1) {
            $chars = str_split($g);
            sort($chars);
            return implode('', $chars);
        }
        sort($parts);
        return implode('/', $parts);
    };
    
    return $normalize($g1) === $normalize($g2);
}


    /**
     * 子孫拘束の適用（最強の拘束）
     */
    private function applyOffspringConstraint(array $candidates, array $offspringEvidence, string $locusKey, string $sex, bool $isSexLinked): array
    {
        if ($offspringEvidence['count'] === 0) return $candidates;

        // 子に劣性形質が出た → 親は必ずその対立遺伝子を持つ
        if ($offspringEvidence['recessiveCount'] > 0 && $offspringEvidence['recessiveAllele']) {
            $allele = $offspringEvidence['recessiveAllele'];
            foreach ($candidates as $geno => &$data) {
                if (strpos($geno, $allele) === false) {
                    $data['probability'] = 0;
                }
            }
        }

        // 統計的拘束: N羽に劣性なし → スプリットでない確率が上がる
        if ($offspringEvidence['recessiveCount'] === 0 && $offspringEvidence['count'] >= 5) {
            $n = $offspringEvidence['count'];
            // 両親がスプリットなら25%で劣性が出る
            // N羽全員野生型の確率 = 0.75^N
            $probNoRecessive = pow(0.75, $n);
            foreach ($candidates as $geno => &$data) {
                // ヘテロ（スプリット）の確率を下げる
                if ($this->isHeterozygous($geno)) {
                    $data['probability'] *= $probNoRecessive;
                }
            }
        }

        return $candidates;
    }

    /**
     * 兄弟拘束の適用
     */
    private function applySiblingConstraint(array $candidates, array $siblingEvidence, array $parentEvidence, string $locusKey): array
    {
        if ($siblingEvidence['count'] === 0) return $candidates;

        // 兄弟に劣性形質 → 両親はスプリット確定 → 自分も2/3でスプリット
        if ($siblingEvidence['recessiveCount'] > 0 && $siblingEvidence['recessiveAllele']) {
            $allele = $siblingEvidence['recessiveAllele'];
            foreach ($candidates as $geno => &$data) {
                // 野生型ホモの確率は1/3、スプリットの確率は2/3
                if ($geno === '++' || $geno === '+W') {
                    $data['probability'] *= (1/3);
                } elseif (strpos($geno, $allele) !== false && strpos($geno, '+') !== false) {
                    $data['probability'] *= (2/3);
                }
            }
        }

        return $candidates;
    }

    /**
     * ヘテロ接合かどうか判定
     */
    private function isHeterozygous(string $genotype): bool
    {
        if (strpos($genotype, 'W') !== false) return false; // ヘミ接合
        if (strlen($genotype) < 2) return false;
        
        // +を含むヘテロ
        if (strpos($genotype, '+') !== false && $genotype !== '++') {
            return true;
        }
        
        // 異なるアレルのヘテロ
        $chars = str_split($genotype);
        return count(array_unique($chars)) > 1;
    }

    /**
     * 結果のフォーマット
     */
    private function formatLocusResult(string $locusKey, array $config, array $candidates): array
    {
        $candidateList = [];
        foreach ($candidates as $geno => $data) {
            if ($data['probability'] > 0) {
                $candidateList[] = [
                    'genotype' => $geno,
                    'probability' => $data['probability'],
                ];
            }
        }

        $topCandidate = reset($candidateList);
        $isConfirmed = $topCandidate && $topCandidate['probability'] >= 99;

        // 座位名を取得（v6.8対応: nameは配列）
        $locusName = $config['name'] ?? $locusKey;
        if (is_array($locusName)) {
            $locusName = $locusName['ja'] ?? $locusName['en'] ?? $locusKey;
        }

        return [
            'locusKey' => $locusKey,
            'locusName' => $locusName,
            'topGenotype' => $topCandidate['genotype'] ?? '?',
            'topProbability' => $topCandidate['probability'] ?? 0,
            'isConfirmed' => $isConfirmed,
            'candidates' => $candidateList,
            'note' => $this->generateNote($locusKey, $candidateList, $isConfirmed),
        ];
    }

    /**
     * 注釈を生成
     */
    private function generateNote(string $locusKey, array $candidates, bool $isConfirmed): string
    {
        if ($isConfirmed) {
            return '';
        }

        if (count($candidates) <= 1) {
            return '';
        }

        $top = $candidates[0] ?? null;
        if ($top && $top['probability'] < 50) {
            return "{$locusKey}: 複数の可能性あり（テスト交配推奨）";
        }

        return '';
    }

    /**
     * テスト交配提案を生成
     */
    private function generateTestBreedingProposals(array $results): array
    {
        $proposals = [];
        $sex = $this->targetBird['sex'];

        foreach ($results as $result) {
            if ($result['isConfirmed']) continue;
            if ($result['topProbability'] >= 90) continue;

            $locusKey = $result['locusKey'];
            $candidates = $result['candidates'];

            if (count($candidates) < 2) continue;

            // スプリット確認用のテスト交配
            $proposal = $this->proposeTestBreeding($locusKey, $candidates, $sex);
            if ($proposal) {
                $proposals[] = $proposal;
            }
        }

        return $proposals;
    }

    /**
     * 特定座位のテスト交配を提案
     */
    private function proposeTestBreeding(string $locusKey, array $candidates, string $sex): ?array
    {
        $isSexLinked = (AgapornisLoci::LOCI[$locusKey]['sex_linked'] ?? false);

        // 伴性遺伝座位の場合
        if ($isSexLinked) {
            if ($sex === 'male') {
                // オスのスプリット確認 → 発現メスと交配
                return [
                    'locus' => $locusKey,
                    'recommendation' => "発現メス（{$locusKey}）と交配",
                    'expectedResult' => '娘に発現 → スプリット確定',
                    'minOffspring' => 5,
                ];
            } else {
                // メスは表現型で確定するのでテスト不要
                return null;
            }
        }

        // 常染色体劣性の場合
        return [
            'locus' => $locusKey,
            'recommendation' => "発現個体（{$locusKey}ホモ）と交配",
            'expectedResult' => '子に発現 → スプリット確定',
            'minOffspring' => 8,
        ];
    }

    /**
     * 空の結果を生成
     */
    private function createEmptyResult(string $locusKey): array
    {
        return [
            'locusKey' => $locusKey,
            'locusName' => $locusKey,
            'topGenotype' => '?',
            'topProbability' => 0,
            'isConfirmed' => false,
            'candidates' => [],
            'note' => '座位情報が見つかりません',
        ];
    }
}




