import { Species } from "./Species";
import { Nature} from "./CalcConstant";
import { IntRange } from "./IntRange";


//level
export type LevelRange=IntRange<101>;

//個体値
export type IndividualRange=IntRange<32>;
export type IndividualValue={
    hp:IndividualRange;
    attack:IndividualRange;
    defense:IndividualRange;
    s_attack:IndividualRange; //特殊攻撃
    s_defense:IndividualRange;
    speed:IndividualRange;
}

//努力値
export type EffortRange=IntRange<253>
export type EffortValue={
    hp:EffortRange;
    attack:EffortRange;
    defense:EffortRange;
    s_attack:EffortRange;
    s_defense:EffortRange;
    speed:EffortRange;
}

export type Pokemon={
    specie:Species,
    name:string,
    level:LevelRange,
    effort:EffortValue,
    individual:IndividualValue,
    nature:Nature
}