import { IntRange }from "../types/IntRange"
import { Stat,Nature,NatureObj } from "../types/CalcConstant"
import { Pokemon } from "../types/Pokemon"
import { Move } from "../types/Species"

const MULTIPLIER_BASE=4096
const MULTIPLIER_1_5X=6144
const MULTIPLIER_2_X=8192

//statに応じた正確補正値を返す
export const get_nature_boost=(stat:Stat,nature:Nature) => {
    if(nature.boosted==stat){
        return 1.1  //x1.1倍の補正を返す
    }else if(nature.lowered==stat){
        return 0.9  
    }else{
        return 1
    }
}

//ステータス実数値計算
export const real_value=(base_stat:number,individual:IntRange<32>,effort:number,level:number,nature_boost:number)=>{
    return Math.floor(((base_stat*2+individual+effort/4)*(level/100)+5)*nature_boost)
}

export const my_poke=new Pokemon(
    445,50,
    {attack:252,defense:0,s_attack:0,s_defense:0},
    {attack:31,defense:31,s_attack:31,s_defense:31},
    NatureObj.WANPAKU
)

export const enemy_poke=new Pokemon(
    488,50,
    {attack:252,defense:332,s_attack:252,s_defense:252},
    {attack:31,defense:31,s_attack:31,s_defense:31},
    NatureObj.WANPAKU
)

export const my_move:Move={
    id:444,
    name:"ストーンエッジ",
    damage_class:"physical",
    power:100
}

//5捨5超入
const round_5_rule = (num:number)=>{
    const integer_part=Math.floor(num);
    const decimal_part=num-integer_part;
    if(decimal_part>0.5){
        return integer_part+1;
    }else{
        return integer_part;
    }
}

//ダメージ計算のメインの部分
/////攻撃,威力など補正値も入れる
export const calc_damage = (attacker:Pokemon,defender:Pokemon,move:Move,critical:boolean=false):number[]=>{
    let final_attack=0;
    let final_defense=0;

    //技が特殊か物理かで最終攻撃と防御を決める
    if(move.damage_class=="physical"){
        final_attack=attacker.attack();
        final_defense=defender.defense();
    }else if(move.damage_class=="special"){
        final_attack=attacker.s_attack();
        final_defense=defender.s_defense();
    }else if(move.damage_class=="status"){
        throw Error("変化技です");
    }else{
        throw Error("技がおかしいです");
    }

    const final_power=move.power;   //技の最終威力
    const level_value=Math.floor(attacker.level*2/5)+2;  //levelに関する式

    //level式×最終威力×最終攻撃力×最終防御力
    const damage=Math.floor(final_power*level_value*final_attack/final_defense);
    let final_damage=Math.floor((damage/50))+2; //倍率補正なしの最終ダメージ

    //ここから倍率計算
    if(critical){
        final_damage=round_5_rule(final_damage*MULTIPLIER_1_5X/MULTIPLIER_BASE);    //急所
    }
    let min = Math.floor(final_damage*85/100);  //乱数による最大値と最小値で分岐させる
    let max = final_damage

    return [min,max]
}