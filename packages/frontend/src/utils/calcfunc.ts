import { Stat,Nature,NatureObjs, TYPE_AFFINITY, TYPE_NUM, Type } from "../types/CalcConstant"
import { EffortRange, IndividualRange, LevelRange, Pokemon } from "../types/Pokemon"
import { Move } from "../types/Species"
import { DamageResult } from "../types/Calculator"
import { NatureBoosted } from "../types/NatureBoosted"
import { Corrections } from "../types/Corrections"
import { Rank } from "../types/Rank"

const MULTIPLIER_BASE=4096
const MULTIPLIER_1_5X=6144
const MULTIPLIER_2_X=8192

const IS_0_NUMBER = -1 //効果がないようだとか絶対にダメージがゼロにならないと行けないときに使う

//statに応じた性格補正値を返す
export const get_nature_boost=(stat:Stat,nature:Nature):NatureBoosted => {
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

export const real_value=(base_stat:number,individual:IndividualRange,effort:EffortRange,level:LevelRange,nature_boost:NatureBoosted)=>{
    return Math.floor(((base_stat*2+individual+effort/4)*(level/100)+5)*nature_boost)
}

//ランク補正計算
const rank_maltiple = (current_at_or_de:number,rank:Rank)=>{
    let rank_boost=1;
    if(rank<0){
        rank_boost=2/(2-rank)
    }else{
        rank_boost=(2+rank)/2
    }
    return  Math.floor(current_at_or_de*rank_boost)
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
    let type_multiple=TYPE_AFFINITY[ TYPE_NUM[move_type] ][ TYPE_NUM[defender_type1] ];
    if(type_multiple==0) return IS_0_NUMBER;
    current_damage*=type_multiple;
    if(defender_type2!==null){
        type_multiple=TYPE_AFFINITY[ TYPE_NUM[move_type] ][ TYPE_NUM[defender_type2]];
        if(type_multiple==0) return IS_0_NUMBER;

        current_damage*=type_multiple;
    }
    return Math.floor(current_damage);
}

//ダメージ計算のメインの部分
/////攻撃,威力など補正値も入れる
export const calc_damage = (attacker:Pokemon,defender:Pokemon,move:Move,corrections:Corrections):DamageResult=>{
    let final_attack=0;
    let final_defense=0;
    let nature_boost:NatureBoosted=1;

    //技が特殊か物理かで最終攻撃と防御を決める
    if(move.damage_class=="physical"){
        nature_boost=get_nature_boost("ATTACK",attacker.nature);
        final_attack=real_value(
            attacker.specie.Attack,
            attacker.individual.attack,
            attacker.effort.attack,
            attacker.level,
            nature_boost
        );

        nature_boost=get_nature_boost("DEFENSE",defender.nature);
        final_defense=real_value(
            defender.specie.Defense,
            defender.individual.defense,
            defender.effort.defense,
            defender.level,
            nature_boost
        );
    }else if(move.damage_class=="special"){
        nature_boost=get_nature_boost("S_ATTACK",attacker.nature);
        final_attack=real_value(
            attacker.specie.sAttack,
            attacker.individual.s_attack,
            attacker.effort.s_attack,
            attacker.level,
            nature_boost
        );

        nature_boost=get_nature_boost("S_DFENSE",defender.nature);
        final_defense=real_value(
            defender.specie.sDefense,
            defender.individual.s_defense,
            defender.effort.s_defense,
            defender.level,
            nature_boost
        );
    }else if(move.damage_class=="status"){
        throw Error("変化技です");
    }else{
        throw Error("技がおかしいです");
    }

    const defender_hp = real_value_hp(defender.specie.HP,defender.individual.hp,defender.effort.hp,defender.level);
    final_attack = rank_maltiple(final_attack,corrections.attacker_rank)
    final_defense = rank_maltiple(final_defense,corrections.defender_rank)

    const final_power=move.power;   //技の最終威力
    const level_value=Math.floor(attacker.level*2/5)+2;  //levelに関する式

    //level式×最終威力×最終攻撃力×最終防御力
    const damage=Math.floor(final_power*level_value*final_attack/final_defense);
    let final_damage=Math.floor((damage/50))+2; //倍率補正なしの最終ダメージ

    //ここから倍率計算
    if(corrections.critical){
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
    if(min!=IS_0_NUMBER && min<1){
        min=1;
        if(max<1) max=1;
    }else if(min===IS_0_NUMBER){
        min=0;
        if(max===IS_0_NUMBER) max=0;
    }
    
    //ダメージの％化
    const min_per = Math.round(min/defender_hp*1000)/10;
    const max_per = Math.round(max/defender_hp*1000)/10;

    return {min,max,min_per,max_per}
}