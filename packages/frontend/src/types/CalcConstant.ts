//ステータス
const Stat={
    HP:"HP",
    ATTACK:"ATTACK",
    DEFNSE:"DEFENSE",
    S_ATTACK:"S_ATTACK",
    S_DEFENSE:"S_DFENSE",
    SPEED:"SPEED"
} as const;

//StatObjオブジェクトのキーのユニオンからキーに対応する値の一覧の型を作成して
//結果enumのような挙動をしている
export type Stat = typeof Stat[keyof typeof Stat]; 

type NatureObjType={
    boosted:Stat|null;
    lowered:Stat|null;
};

type NatureObjsType={
    [key:string]:NatureObjType;
};

//正確一覧とその補正値の一覧
export const NatureObjs:NatureObjsType={
    "さみしがり"    :   {   boosted:"ATTACK",   lowered:"DEFENSE"   },
    "いじっぱり"    :   {   boosted:"ATTACK",   lowered:"S_ATTACK"  },
    "やんちゃ"      :   {   boosted:"ATTACK",   lowered:"S_DFENSE"  },
    "ゆうかん"      :   {   boosted:"ATTACK",   lowered:"SPEED"     },

    "ずぶとい"      :   {   boosted:"DEFENSE",  lowered:"ATTACK"    },
    "わんぱく"      :   {   boosted:"DEFENSE",  lowered:"S_ATTACK"  },
    "のうてんき"    :   {   boosted:"DEFENSE",  lowered:"S_DFENSE"  },
    "のんき"        :   {   boosted:"DEFENSE",  lowered:"SPEED"     },

    "ひかえめ"      :   {   boosted:"S_ATTACK", lowered:"ATTACK"    },
    "おっとり"      :   {   boosted:"S_ATTACK", lowered:"DEFENSE"   },
    "うっかりや"    :   {   boosted:"S_ATTACK", lowered:"S_DFENSE"  },
    "れいせい"      :   {   boosted:"S_ATTACK", lowered:"SPEED"     },

    "おだやか"      :   {   boosted:"S_DFENSE", lowered:"ATTACK"    },
    "おとなしい"    :   {   boosted:"S_DFENSE", lowered:"DEFENSE"   },
    "しんちょう"    :   {   boosted:"S_DFENSE", lowered:"S_ATTACK"  },
    "なまいき"      :   {   boosted:"S_DFENSE", lowered:"SPEED"     },

    "おくびょう"    :   {   boosted:"SPEED",    lowered:"ATTACK"    },
    "せっかち"      :   {   boosted:"SPEED",    lowered:"DEFENSE"   },
    "ようき"        :   {   boosted:"SPEED",    lowered:"S_ATTACK"  }, 
    "むじゃき"      :   {   boosted:"SPEED",    lowered:"S_DFENSE"  },

    "まじめ"        :   {   boosted:null,       lowered:null        }
}as const;

//性格の名称の型 関数などの引数で受け取るときはこっちを使う
export type Nature=keyof typeof NatureObjs;

export const nature_key_array=Object.keys(NatureObjs);

//タイプと数字を紐付ける
export const TYPE_NUM={
    "ノーマル":0,
    "ほのお":1,
    "みず":2,
    "でんき":3,
    "くさ":4,
    "こおり":5,
    "かくとう":6,
    "どく":7,
    "じめん":8,
    "ひこう":9,
    "エスパー":10,
    "むし":11,
    "いわ":12,
    "ゴースト":13,
    "ドラゴン":14,
    "あく":15,
    "はがね":16,
    "フェアリー":17
}as const;

export type Type=keyof typeof TYPE_NUM;

type TypeAffinity= 0 | 1 |0.5| 2

//タイプ相性表
//TYPE_AFFINITY[TYPE["ノーマル"]][TYPE["かくとう"]]のようにして使う この例ではノーマルが格闘に殴ったときの弱点がでる
export const TYPE_AFFINITY:readonly (readonly TypeAffinity[])[]=[
   // 無   炎   水   電   草    氷   闘   毒   地   飛   超   虫    岩   霊   竜   悪   鋼   精
    [   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1, 0.5,   0,   1,   1, 0.5,   1], //無
    [   1, 0.5, 0.5,   1,   2,   2,   1,   1,   1,   1,   1,   2, 0.5,   1, 0.5,   1,   2,   1], //炎
    [   1,   2, 0.5,   1, 0.5,   1,   1,   1,   2,   1,   1,   1,   2,   1, 0.5,   1,   1,   1], //水
    [   1,   1,   2, 0.5, 0.5,   1,   1,   1,   0,   2,   1,   1,   1,   1, 0.5,   1,   1,   1], //電
    [   1, 0.5,   2,   1, 0.5,   1,   1, 0.5,   2, 0.5,   1, 0.5,   2,   1, 0.5,   1, 0.5,   1], //草
    [   1, 0.5, 0.5,   1,   2, 0.5,   1,   1,   2,   2,   1,   1,   1,   1,   2,   1, 0.5,   1], //氷
    [   2,   1,   1,   1,   1,   2,   1, 0.5,   1, 0.5, 0.5, 0.5,   2,   0,   1,   2,   2, 0.5], //闘
    [   1,   1,   1,   1,   2,   1,   1, 0.5, 0.5,   1,   1, 0.5, 0.5, 0.5,   1,   1,   0,   2], //毒
    [   1,   2,   1,   2, 0.5,   1,   1,   2,   1,   0,   1, 0.5,   2,   1,   1,   1,   2,   1], //地
    [   1,   1,   1, 0.5,   2,   1,   2,   1,   1,   1,   1,   2, 0.5,   1,   1,   1, 0.5,   1], //飛
    [   1,   1,   1,   1,   1,   1,   2,   2,   1,   1, 0.5,   1,   1,   1,   1,   0, 0.5,   1], //超
    [   1, 0.5,   1,   1,   1,   1, 0.5, 0.5,   1, 0.5,   1,   1,   1, 0.5,   1,   2, 0.5,   1], //虫
    [   1,   2,   1,   1,   1,   2, 0.5,   1, 0.5,   2,   1,   1,   1,   1,   1,   1, 0.5,   1], //岩
    [   0,   1,   1,   1,   1,   1,   1,   1,   1,   1,   2,   1,   1,   2,   1, 0.5,   1,   1], //霊
    [   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   2,   1, 0.5,   0], //竜
    [   1,   1,   1,   1,   1,   1, 0.5,   1,   1,   1,   2,   1,   1,   2,   1, 0.5,   1, 0.5], //悪
    [   1, 0.5, 0.5, 0.5,   1,   2,   1,   1,   1,   1,   1,   1,   2,   1,   1,   1, 0.5,   2], //鋼
    [   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   2,   1,   1,   2,   1,   1, 0.5,   1]  //精
]as const;