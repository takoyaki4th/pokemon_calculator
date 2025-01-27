import { useState, useEffect, memo } from "react";
import { wrapGet } from "../utils/functions"
import { Move } from "../types/Species";
import { calc_damage} from "../utils/calcfunc"
import { Pokemon } from "../types/Pokemon";


const Calculator = memo(() => {
    const [min,setMin] = useState<number>(0);
    const [max,setMax] = useState<number>(0);
    const [my_poke,setMyPoke] = useState<Pokemon>(new Pokemon("攻撃側のポケモンが設定されていません"));
    const [enemy_poke,setEnemyPoke] = useState<Pokemon>(new Pokemon("防御側のポケモンが設定されていません"));
    const [my_move,setMyMove] = useState<Move>({
        id:0,
        name:"技が設定されていません",
        damage_class:"physical",
        power:0,
        type:"ノーマル"
    });

    useEffect(() => {
        const build = async () =>{
        setMyPoke(await Pokemon.build(
            "攻撃ポケモン",
            3,
            "わんぱく",
            50,
            {attack:31,defense:31,s_attack:31,s_defense:31},
            {attack:252,defense:0,s_attack:0,s_defense:0},
        ));

        setEnemyPoke(await Pokemon.build(
            "防御ポケモン",
            151,
            "わんぱく",
            50,
            {attack:31,defense:31,s_attack:31,s_defense:31},
            {attack:252,defense:0,s_attack:252,s_defense:252},
        ));

        const response:Move = await wrapGet<Move>(`api/moves/5`);
        setMyMove(response);
        }

        build();
    },[]);

    useEffect(()=>{
        const [min_damage,max_damage]=calc_damage(my_poke,enemy_poke,my_move);
        setMin(min_damage);
        setMax(max_damage); 
    },[my_move,my_poke,enemy_poke]);
 
    return(
    <div className="container">
        <p>{my_poke.specie.name}の{my_move.name}攻撃!</p>
        <p>{enemy_poke.specie.name}に最小{min},最大{max}ダメージ!</p>
    </div>
    )
});

export default Calculator;