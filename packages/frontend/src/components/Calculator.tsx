import { useState, useEffect, memo, useRef, FC, useContext} from "react";
import { wrapGet } from "../utils/functions"
import { Move } from "../types/Species";
import { calc_damage } from "../utils/calcfunc"
import { Pokemon } from "../types/Pokemon";
import { DamageResult, PokeData } from "../types/Calculator";
import { PokeForm } from "./PokeForm";
import axios from "axios";
import Options from "./Options";
import { MyPokeFormContext,EnemyPokeFormContext } from "./providers/GlobalState";

const Calculator:FC = memo(() => {
    const [damage_result,setDamageResult] = useState<DamageResult>({min:0,max:0,min_per:0,max_per:0});
    //攻撃ポケモン
    const my_poke = useRef<Pokemon>(new Pokemon("攻撃側のポケモンが設定されていません"));
    const {data:my_poke_form,set_fn:setMyPokeForm} = useContext(MyPokeFormContext);
    //防御ポケモン
    const enemy_poke = useRef<Pokemon>(new Pokemon("防御側のポケモンが設定されていません"));
    const {data:enemy_poke_form,set_fn:setEnemyPokeForm} = useContext(EnemyPokeFormContext);
    //技
    const move_array = useRef<string[]>(["つるのムチ"]);
    const my_move = useRef<Move>({
        id:0,
        name:"技が設定されていません",
        damage_class:"physical",
        power:0,
        type:"ノーマル"
    });
    const [move_form,setMoveForm] = useState<string>("つるのムチ");
    //チェックボックス
    const [checked, setChecked] = useState(false);

    useEffect(() =>{
        const build = async()=>{
            my_poke.current = await Pokemon.build(my_poke_form);
            try {
                const res_moves = await axios<Array<{name:string}>>(`api/moveLearnMap/dex_number/${my_poke_form.dex_number}`);
                const res_array = res_moves.data.map(move=> move.name);
                move_array.current = res_array;
                setMoveForm(move_array.current[0]);
            } catch (error) {
                console.log(error); 
            }
            setDamageResult(calc_damage(my_poke.current,enemy_poke.current,my_move.current,checked));
        }
        build();
    },[my_poke_form]);

    useEffect(() =>{
        const build = async()=>{
            enemy_poke.current = await Pokemon.build(enemy_poke_form);
            setDamageResult(calc_damage(my_poke.current,enemy_poke.current,my_move.current,checked));
        }
        build();
    },[enemy_poke_form]);

    useEffect(() =>{
        const build = async()=>{
            my_move.current = await wrapGet<Move>(`api/moves/name/${encodeURIComponent(move_form)}`);
            setDamageResult(calc_damage(my_poke.current,enemy_poke.current,my_move.current,checked));
        }
        build();
    },[move_form]);

    const criticalHandler = ()=>{
        setChecked(!checked);
        setDamageResult(calc_damage(my_poke.current,enemy_poke.current,my_move.current,!checked));
    };

    console.log("レンダリングされました");
 
    return(
        <div className="container">
            <div className="flex">
                <div className="center border">
                    <h3>攻撃ポケモン</h3>
                    <PokeForm key="my" mode="my"/>
                </div>
                <div className="center border">
                    <h3>防御ポケモン</h3>
                    <PokeForm key="enemy" mode="enemy"/>
                </div>
            </div>
            <div className="border">
                <label>使用技</label>
                <select name="move" value={move_form} onChange={event=>setMoveForm(event.target.value)}><Options array={move_array.current}/></select>
                <label>急所</label>
                <input type="checkbox" checked={checked} onChange={criticalHandler}/>
            </div>
 
            <div className="border">
                <div className="sprite-right">
                   <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${enemy_poke_form.dex_number}.png`} alt={enemy_poke.current.specie.name} />
                </div>
                <div className="sprite-left">
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${my_poke_form.dex_number}.png`} alt={my_poke.current.specie.name} />
                </div>
            </div>
            <div className="border">
                <p>{my_poke.current.specie.name}の{my_move.current.name}攻撃!</p>
                <p>{enemy_poke.current.specie.name}に{damage_result.min}〜{damage_result.max}ダメージ!</p>
                <p>{damage_result.min_per}%〜{damage_result.max_per}%</p>
            </div>
        </div>
    )
});

export default Calculator;