import { useState, useEffect, memo} from "react";
import { wrapGet } from "../utils/functions"
import { Move } from "../types/Species";
import { calc_damage } from "../utils/calcfunc"
import { Pokemon } from "../types/Pokemon";
import { PokeData } from "../types/Calculator";
import { PokeForm } from "./PokeForm";

const Calculator:React.FC = memo(() => {
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
    const [my_move_index,setMyMoveIndex]=useState<string>("1");
    const [my_poke_form,setMyPokeForm]=useState<PokeData>({
        name:"ニックネーム",
        dex_number:1,
        nature:"わんぱく",
        level:50,
        individual:{hp:31,attack:31,defense:31,s_attack:31,s_defense:31,speed:31},
        effort:{hp:0,attack:252,defense:0,s_attack:252,s_defense:0,speed:0}
    });
    const [enemy_poke_form,setEnemyPokeForm]=useState<PokeData>({
        name:"ニックネーム",
        dex_number:1,
        nature:"わんぱく",
        level:50,
        individual:{hp:31,attack:31,defense:31,s_attack:31,s_defense:31,speed:31},
        effort:{hp:0,attack:252,defense:0,s_attack:252,s_defense:0,speed:0}
    })

    useEffect(() => {
        const build = async () =>{
            setMyPoke(await Pokemon.build(my_poke_form));

            setEnemyPoke(await Pokemon.build(enemy_poke_form));

            const response:Move = await wrapGet<Move>(`api/moves/${my_move_index}`);
            setMyMove(response);
        }

        build();
    },[my_move_index,my_poke_form,enemy_poke_form]);

    useEffect(()=>{
        const [min_damage,max_damage]=calc_damage(my_poke,enemy_poke,my_move);
        setMin(min_damage);
        setMax(max_damage); 
    },[my_move,my_poke,enemy_poke]); 

    console.log("レンダリングされました");
 
    return(
        <div className="container">
            <div className="flex">
                <div className="center border">
                    <h3>攻撃ポケモン</h3>
                    <PokeForm data={my_poke_form} set_fn={setMyPokeForm}/>
                </div>
                <div className="center border">
                    <h3>防御ポケモン</h3>
                    <PokeForm key="enemy" data={enemy_poke_form} set_fn={setEnemyPokeForm}/>
                </div>
            </div>
            <div className="border">
                <label>使用技のID</label>
                <input type="number" name="move_index" step="1" min="1" max="100" inputMode="numeric" value={my_move_index} onChange={event => setMyMoveIndex(event.target.value)}/>
            </div>
 
            <div className="border">
                <div className="sprite-right">
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${enemy_poke.specie.DexNumber}.png`} alt={enemy_poke.specie.name} />
                </div>
                <div className="sprite-left">
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${my_poke_form.dex_number}.png`} alt={my_poke.specie.name} />
                </div>
            </div>
            <div className="border">
                <p>{my_poke.specie.name}の{my_move.name}攻撃!</p>
                <p>{enemy_poke.specie.name}に最小{min},最大{max}ダメージ!</p>
            </div>
        </div>
    )
});

export default Calculator;