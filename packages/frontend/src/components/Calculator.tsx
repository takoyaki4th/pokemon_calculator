import { useState, useEffect, memo, useRef, FC, useContext} from "react";
import { wrapGet } from "../utils/functions"
import { Move, Species } from "../types/Species";
import { calc_damage } from "../utils/calcfunc"
import { DamageResult, PokeData } from "../types/Calculator";
import { PokeForm } from "./PokeForm";
import axios from "axios";
import Options from "./Options";
import { EnemyPokeFormContext, MyPokeFormContext } from "./providers/PokeFormProvider";
import { EnemyDexNumberContext, MyDexNumberContext } from "./providers/DexNumberProvider";
import { Link } from "react-router-dom";

const Calculator:FC = memo(() => {
    const [damage_result,setDamageResult] = useState<DamageResult>({min:0,max:0,min_per:0,max_per:0});
    //攻撃ポケモン
    const {dex_number:my_dex_number,setDexNumber:setMyDexNumber} = useContext(MyDexNumberContext);
    const my_specie_value = useRef<Species>({
        name:"ポケモンが設定されていません",
        DexNumber:0,HP:0,Attack:0,Defense:0,sAttack:0,sDefense:0,Speed:0,
        type1:"ノーマル",type2:"ノーマル",
    });
    const {data:my_poke_form,set_fn:setMyPokeForm} = useContext(MyPokeFormContext);

    //防御ポケモン
    const {dex_number:enemy_dex_number,setDexNumber:setEnemyDexNumber} = useContext(EnemyDexNumberContext);
    const enemy_specie_value = useRef<Species>({
        name:"ポケモンが設定されていません",
        DexNumber:0,HP:0,Attack:0,Defense:0,sAttack:0,sDefense:0,Speed:0,
        type1:"ノーマル",type2:"ノーマル",
    });
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
    const [move_name,setMoveName] = useState<string>("つるのムチ");
    //チェックボックス
    const [critical, setCritical] = useState(false);

    const calcAndSetDamage = ()=>{
        const attacker = {
            specie:my_specie_value.current,
            ...my_poke_form
        };
        const defender = {
            specie:enemy_specie_value.current,
            ...enemy_poke_form
        };
        setDamageResult(calc_damage(attacker,defender,my_move.current,critical));
    };

    useEffect(()=>{
        const get_specie = async()=>{
            my_specie_value.current = await wrapGet(`/api/Species/${my_dex_number}`);
            try {
                const res_moves = await axios<Array<{name:string}>>(`api/moveLearnMap/dex_number/${my_dex_number}`);
                const res_array = res_moves.data.map(move=> move.name);
                move_array.current = res_array;
                setMoveName(res_array[0]);
                calcAndSetDamage();
            } catch (error) {
                console.log(error); 
            }
        };
        get_specie();
    },[my_dex_number]);

    useEffect(()=>{
        const get_specie = async()=>{
            enemy_specie_value.current = await wrapGet(`/api/Species/${enemy_dex_number}`);
            calcAndSetDamage();
        };
        get_specie();
    },[enemy_dex_number]);

    useEffect(() =>{
        const build = async()=>{
            my_move.current = await wrapGet<Move>(`api/moves/name/${encodeURIComponent(move_name)}`);
            calcAndSetDamage();
        };
        build();
    },[move_name]);

    useEffect(() => {
        calcAndSetDamage();
    },[my_poke_form,enemy_poke_form,critical]);

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
                <select name="move" value={move_name} onChange={event=>setMoveName(event.target.value)}><Options array={move_array.current}/></select>
                <label>急所</label>
                <input type="checkbox" checked={critical} onChange={()=>setCritical(!critical)}/>
            </div>
 
            <div className="border">
                <div className="sprite-right">
                    <Link to={`/poke-dex/?id=${enemy_dex_number}`}>
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${enemy_dex_number}.png`} alt={enemy_specie_value.current.name} />
                    </Link>
                </div>
                <div className="sprite-left">
                    <Link to={`/poke-dex/?id=${my_dex_number}`}>
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${my_dex_number}.png`} alt={my_specie_value.current.name} />
                    </Link>
                </div>
            </div>
            <div className="border">
                <p>{my_specie_value.current.name}の{my_move.current.name}攻撃!</p>
                <p>{enemy_specie_value.current.name}に{damage_result.min}〜{damage_result.max}ダメージ!</p>
                <p>{damage_result.min_per}%〜{damage_result.max_per}%</p>
            </div>
        </div>
    )
});

export default Calculator;