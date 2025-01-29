import { Species } from "./Species";
import { Nature} from "./CalcConstant";
import { get_nature_boost, real_value } from "../utils/calcfunc"
import { IntRange } from "./IntRange";
import { wrapGet } from "../utils/functions";
import { PokeData } from "./Calculator";


//level
export type LevelRange=IntRange<101>;

//個体値
export type IndividualRange=IntRange<32>;
export type IndividualValue={
    attack:IndividualRange;
    defense:IndividualRange;
    s_attack:IndividualRange; //特殊攻撃
    s_defense:IndividualRange;
}

//努力値
export type EffortRange=IntRange<253>
export type EffortValue={
    attack:EffortRange;
    defense:EffortRange;
    s_attack:EffortRange;
    s_defense:EffortRange;
}

//ポケモンの個体の定義
export class Pokemon{
    name:string;
    specie:Species;
    level:LevelRange;
    effort:EffortValue;
    individual:IndividualValue;
    nature:Nature;

    //これではなくbuildメソッドの方からクラスを作成する
    constructor(
        name:string,
        nature:Nature="まじめ",
        level:LevelRange=50,
        individual:IndividualValue = {attack:31,defense:31,s_attack:31,s_defense:31},
        effort:EffortValue = {attack:252,defense:0,s_attack:252,s_defense:0}
        ) {
        this.name = name
        this.nature = nature
        this.specie={
            name:"コンストラクタでPokemonインスタンスを作成しないでください\nbuild関数を使ってください",
            DexNumber:0,
            HP:0,
            Attack:0,
            Defense:0,
            sAttack:0,
            sDefense:0,
            Speed:0,
            type1:"ノーマル",
            type2:"ノーマル",
        }
        this.effort = effort
        this.level = level;
        this.individual = individual
    }

    //これを使ってインスタンスを生成する(コンストラクタではasyncが使えないため)
    static async build(poke_data:PokeData){
        const pokemon = new Pokemon(poke_data.name,poke_data.nature,poke_data.level,poke_data.individual,poke_data.effort);
        pokemon.specie = await wrapGet(`/api/Species/${poke_data.dex_number}`);
        return pokemon;
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