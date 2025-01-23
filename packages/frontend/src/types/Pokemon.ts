import { Species } from "./Species";
import { Nature,NatureObj} from "./CalcConstant";
import { get_nature_boost, real_value } from "../utils/calcfunc"
import { IntRange } from "./IntRange";

//個体値
type IndividualRange=IntRange<32>;
export type IndividualValue={
    attack:IndividualRange;
    defense:IndividualRange;
    s_attack:IndividualRange; //特殊攻撃
    s_defense:IndividualRange;
}

//努力値
type EffortRange=IntRange<400>
export type EffortValue={
    attack:EffortRange;
    defense:EffortRange;
    s_attack:EffortRange;
    s_defense:EffortRange;
}

//ポケモンの個体の定義
export class Pokemon{
    specie:Species;
    level:IntRange<100>;
    effort:EffortValue;
    individual:IndividualValue;
    nature:Nature;
    constructor(dex_number:number,level:IntRange<100>,effort:EffortValue,indivisual:IndividualValue,nature:Nature) {
        this.specie={
            DexNumber:dex_number,
            name:"aaaaa",
            HP:20,
            Attack:130,
            Defense:120,
            sAttack:20,
            sDefense:20,
            Speed:20
        }
        this.level=level;
        this.effort={
            attack:252,
            defense:252,
            s_attack:252,
            s_defense:252
        }
        this.individual={
            attack:31,
            defense:31,
            s_attack:31,
            s_defense:31
        }
        this.nature=nature
    }

    attack(){
        const nature_boost=get_nature_boost("ATTACK",this.nature);
        return real_value(this.specie.Attack,this.individual.attack,this.effort.attack,this.level,nature_boost)
    }

    defense(){
        const nature_boost=get_nature_boost("DEFENSE",this.nature);
        return real_value(this.specie.Defense,this.individual.defense,this.effort.defense,this.level,nature_boost) 
    }

    s_attack(){
        const nature_boost=get_nature_boost("S_ATTACK",this.nature);
        return real_value(this.specie.sAttack,this.individual.s_attack,this.effort.s_attack,this.level,nature_boost)
    }

    s_defense(){
        const nature_boost=get_nature_boost("S_ATTACK",this.nature);
        return real_value(this.specie.sDefense,this.individual.s_defense,this.effort.s_defense,this.level,nature_boost)
    }
}