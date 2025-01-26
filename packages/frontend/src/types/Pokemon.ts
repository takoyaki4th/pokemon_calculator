import axios, { AxiosResponse } from "axios";
import { Species } from "./Species";
import { Nature} from "./CalcConstant";
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
    name:string;
    specie:Species;
    level:IntRange<100>;
    effort:EffortValue;
    individual:IndividualValue;
    nature:Nature;

    //これではなくbuildメソッドの方からクラスを作成する
    constructor(
        name:string,
        nature:Nature="まじめ",
        level:IntRange<100>=50,
        indivisual:IndividualValue = {attack:31,defense:31,s_attack:31,s_defense:31},
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
        this.individual = indivisual
    }

    //これを使ってインスタンスを生成する(コンストラクタではasyncが使えないため)
    static async build(
        name:string,
        dex_number:number,
        nature:Nature = "まじめ",
        level:IntRange<100> = 50,
        indivisual:IndividualValue = {attack:31,defense:31,s_attack:31,s_defense:31},
        effort:EffortValue = {attack:252,defense:0,s_attack:252,s_defense:0}
        ){
        const pokemon = new Pokemon(name,nature,level,indivisual,effort);
        try {
            const response: AxiosResponse<Array<Species>> = await axios.get(`/api/Species/${dex_number}`);
            pokemon.specie =response.data[0];
            if(pokemon.specie===undefined){
                throw Error("specieがundefinedです")
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.message);
            } else {
            console.error("Error", error);
            }
        }
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