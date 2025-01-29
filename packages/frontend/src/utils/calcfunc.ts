import { Stat,Nature,NatureObjs, TYPE_AFFINITY, TYPE_NUM, Type } from "../types/CalcConstant"
import { EffortRange, IndividualRange, LevelRange, Pokemon } from "../types/Pokemon"
import { Move } from "../types/Species"
import { DamageResult } from "../types/Calculator"

const MULTIPLIER_BASE=4096
const MULTIPLIER_1_5X=6144
const MULTIPLIER_2_X=8192

//statに応じた正確補正値を返す
export const get_nature_boost=(stat:Stat,nature:Nature) => {
    if(NatureObjs[nature].boosted==stat){
        return 1.1  //x1.1倍の補正を返す
    }else if(NatureObjs[nature].lowered==stat){
        return 0.9  
    }else{
        return 1
    }
}

//ステータス実数値計算
export const real_value_hp=(base_stat:number,individual:IndividualRange,effort:EffortRange,level:LevelRange)=>{
    return Math.floor((base_stat*2+individual+effort/4)*(level/100)+10+level)
}

export const real_value=(base_stat:number,individual:IndividualRange,effort:EffortRange,level:LevelRange,nature_boost:number)=>{
    return Math.floor(((base_stat*2+individual+effort/4)*(level/100)+5)*nature_boost)
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

//タイプ一致補正
const calc_type_match=(current_damage:number,move_type:Type,attacker_type1:Type,attacker_type2:Type|null)=>{
    if(move_type===attacker_type1 || move_type===attacker_type2){
        return round_5_rule(current_damage*MULTIPLIER_1_5X/MULTIPLIER_BASE);
    }
    return round_5_rule(current_damage)
}

//タイプ相性補正
const calc_type_affinity=(current_damage:number,move_type:Type,defender_type1:Type,defender_type2:Type|null=null)=>{
    current_damage*=TYPE_AFFINITY[ TYPE_NUM[move_type] ][ TYPE_NUM[defender_type1] ];
    if(defender_type2!==null){
        current_damage*=TYPE_AFFINITY[ TYPE_NUM[move_type] ][ TYPE_NUM[defender_type2]]
    }
    return Math.floor(current_damage);
}

//ダメージ計算のメインの部分
/////攻撃,威力など補正値も入れる
export const calc_damage = (attacker:Pokemon,defender:Pokemon,move:Move,critical:boolean=false):DamageResult=>{
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
    let max = final_damage;

    //タイプ一致
    min = calc_type_match(min,move.type,attacker.specie.type1,attacker.specie.type2);
    max = calc_type_match(max,move.type,attacker.specie.type1,attacker.specie.type2);

    //タイプ相性    
    min = calc_type_affinity(min,move.type,defender.specie.type1,defender.specie.type2);
    max = calc_type_affinity(max,move.type,defender.specie.type1,defender.specie.type2);

    //ダメージが1以下なら1にする処理を追記
    if(min<1){
        min=1;
        if(max<1) max=1;
    }
    
    //ダメージの％化
    const min_per = Math.round(min/defender.hp()*1000)/10;
    const max_per = Math.round(max/defender.hp()*1000)/10;

    return {min,max,min_per,max_per}
}