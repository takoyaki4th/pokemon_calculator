import { useState, useEffect, memo} from "react";
import { wrapGet } from "../utils/functions"
import { Move } from "../types/Species";
import { calc_damage } from "../utils/calcfunc"
import { Pokemon } from "../types/Pokemon";
import { DamageResult, PokeData } from "../types/Calculator";
import { PokeForm } from "./PokeForm";
import axios from "axios";
import Options from "./Options";

const Calculator:React.FC = memo(() => {
    const [damage_result,setDamageResult] = useState<DamageResult>({min:0,max:0,min_per:0,max_per:0});
    const [my_poke,setMyPoke] = useState<Pokemon>(new Pokemon("攻撃側のポケモンが設定されていません"));
    const [enemy_poke,setEnemyPoke] = useState<Pokemon>(new Pokemon("防御側のポケモンが設定されていません"));
    const [move_name,setMoveName] = useState<string>("つるのムチ");
    const [my_move,setMyMove] = useState<Move>({
        id:0,
        name:"技が設定されていません",
        damage_class:"physical",
        power:0,
        type:"ノーマル"
    });
    const [move_array,setMoveArray]=useState<string[]>(["つるのムチ"]);
    const [my_poke_form,setMyPokeForm]=useState<PokeData>({
        name:"ニックネーム",
        dex_number:5,
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
    });

    useEffect(() => {
        const build = async () =>{
            setMyPoke(await Pokemon.build(my_poke_form));

            setEnemyPoke(await Pokemon.build(enemy_poke_form));

            //axiosのエラーハンドリングをちゃんとする
            try {
                
                const res_moves = await axios<Array<{name:string}>>(`api/moveLearnMap/dex_number/${my_poke_form.dex_number}`);
                const res_array = res_moves.data.map(move=> move.name);
                setMoveArray(res_array);
            } catch (error) {
               console.log(error); 
            }
            setMyMove(await wrapGet<Move>(`api/moves/name/${encodeURIComponent(move_name)}`));
        }
        build();
    },[move_name,my_poke_form,enemy_poke_form]);

    useEffect(()=>{
        setDamageResult(calc_damage(my_poke,enemy_poke,my_move));
    },[my_move,my_poke,enemy_poke]); 

    console.log("レンダリングされました");
 
    return(
        <div className="container">
            <div className="flex">
                <div className="center border">
                    <h3>攻撃ポケモン</h3>
                    <PokeForm key="my" data={my_poke_form} set_fn={setMyPokeForm}/>
                </div>
                <div className="center border">
                    <h3>防御ポケモン</h3>
                    <PokeForm key="enemy" data={enemy_poke_form} set_fn={setEnemyPokeForm}/>
                </div>
            </div>
            <div className="border">
                <label>使用技のID</label>
                <select name="move" id="move" onChange={event=>setMoveName(event.target.value)}><Options array={move_array}/></select>
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
                <p>{enemy_poke.specie.name}に最小{damage_result.min},最大{damage_result.max}ダメージ!</p>
                <p>{damage_result.min_per}%〜{damage_result.max_per}%</p>
            </div>
        </div>
    )
});

export default Calculator;