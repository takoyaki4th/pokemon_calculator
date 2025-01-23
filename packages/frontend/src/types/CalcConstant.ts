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

//正確の名前一覧
const NatureName={
    SAMISIGARI:"さみしがり",
    IJIPPARI:"いじっぱり",
    YANCHA:"やんちゃ",
    YUKAN:"ゆうかん",

    WANPAKU:"わんぱく",
    ZUBUTOI:"ずぶとい",
    NOOTENKI:"のうてんき",
    NONKI:"のんき",

    HIKAEME:"ひかえめ",
    OTTORI:"おっとり",
    UKKARIYA:"うっかりや",
    REISEI:"れいせい",

    ODAYAKA:"おだやか",
    OTONASI:"おとなしい",
    SINTYO:"しんちょう",
    NAMAIKI:"なまいき",

    OKUBYO:"おくびょう",
    SEKKATI:"せっかち",
    YOUKI:"ようき",
    MUJAKI:"むじゃき",

    MAJIME:"まじめ"
}as const;

type NatureName = typeof NatureName[keyof typeof NatureName]; 

type NatureType={
    name:NatureName;
    boosted:Stat;
    lowered:Stat;
};

type NatureObjType={
    [key:string]:NatureType;
};

//正確一覧とその補正値の一覧
export const NatureObj:NatureObjType={
    SAMISHIGARI:{   name:"さみしがり", boosted:"ATTACK",   lowered:"DEFENSE"   },
    IJIPPARI:   {   name:"やんちゃ",   boosted:"ATTACK",   lowered:"S_ATTACK"  },
    YANCHA  :   {   name:"ゆうかん",   boosted:"ATTACK",   lowered:"S_DFENSE"  },
    YUKAN   :   {   name:"ゆうかん",   boosted:"ATTACK",   lowered:"SPEED"     },

    ZUBUTOI :   {   name:"ずぶとい",   boosted:"DEFENSE",  lowered:"ATTACK"    },
    WANPAKU :   {   name:"わんぱく",   boosted:"DEFENSE",  lowered:"S_ATTACK"  },
    NOUTENKI:   {   name:"のうてんき", boosted:"DEFENSE",  lowered:"S_DFENSE"  },
    NONKI   :   {   name:"のんき",     boosted:"DEFENSE",  lowered:"SPEED"     },

    HIKAEME :   {   name:"ひかえめ",   boosted:"S_ATTACK", lowered:"ATTACK"    },
    OTTORI  :   {   name:"おっとり",   boosted:"S_ATTACK", lowered:"DEFENSE"   },
    UKKARIYA:   {   name:"うっかりや", boosted:"S_ATTACK", lowered:"S_DFENSE"  },
    REISEI  :   {   name:"れいせい",   boosted:"S_ATTACK", lowered:"SPEED"     },

    ODAYAKA :   {   name:"おだやか",   boosted:"S_DFENSE", lowered:"ATTACK"    },
    OTONASI :   {   name:"おとなしい", boosted:"S_DFENSE", lowered:"DEFENSE"   },
    SINTYO  :   {   name:"しんちょう", boosted:"S_DFENSE", lowered:"S_ATTACK"  },
    NAMAIKI :   {   name:"なまいき",   boosted:"S_DFENSE", lowered:"SPEED"     },

    OKUBYO  :   {   name:"おくびょう",  boosted:"SPEED",    lowered:"ATTACK"    },
    SEKKATI :   {   name:"せっかち",    boosted:"SPEED",    lowered:"DEFENSE"   },
    YOUKI   :   {   name:"ようき",      boosted:"SPEED",    lowered:"S_ATTACK"  }, 
    MUJAKI  :   {   name:"むじゃき",    boosted:"SPEED",    lowered:"S_DFENSE"  }

    //補正値なしも記載する
}as const;

export type Nature = typeof NatureObj[keyof typeof NatureObj]; 