export type Species={
    DexNumber:number;
    name:string;
    HP:number;
    Attack:number;
    Defense:number;
    sAttack:number;
    sDefense:number;
    Speed:number;
}

type DamageClass="physical"|"special"|"status"
export type Move={
    id:number
    name:string
    damage_class:DamageClass //特殊攻撃か通常攻撃か,変化技か
    power:number    //技の威力
}
