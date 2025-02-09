import { useState, useEffect, memo, useRef, FC, useContext} from "react";
import { wrapGet } from "../utils/functions"
import { Move, Species } from "../types/Species";
import { calc_damage } from "../utils/calcfunc"
import { DamageResult } from "../types/Calculator";
import axios from "axios";
import { Options } from "./Options";
import { EnemyPokeFormContext, MyPokeFormContext } from "./providers/PokeFormProvider";
import { EnemyDexNumberContext, MyDexNumberContext } from "./providers/DexNumberProvider";
import styled from "styled-components";
import { WrapPokeForm } from "./WrapPokeForm";

const Calculator:FC = memo(() => {
    const [damage_result,setDamageResult] = useState<DamageResult>({min:0,max:0,min_per:0,max_per:0});
    //攻撃ポケモン
    const {dex_number:my_dex_number} = useContext(MyDexNumberContext);
    const my_specie_value = useRef<Species>({
        name:"ポケモンが設定されていません",
        DexNumber:0,HP:0,Attack:0,Defense:0,sAttack:0,sDefense:0,Speed:0,
        type1:"ノーマル",type2:"ノーマル",
    });
    const {data:my_poke_form} = useContext(MyPokeFormContext);

    //防御ポケモン
    const {dex_number:enemy_dex_number} = useContext(EnemyDexNumberContext);
    const enemy_specie_value = useRef<Species>({
        name:"ポケモンが設定されていません",
        DexNumber:0,HP:0,Attack:0,Defense:0,sAttack:0,sDefense:0,Speed:0,
        type1:"ノーマル",type2:"ノーマル",
    });
    const {data:enemy_poke_form} = useContext(EnemyPokeFormContext);

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
        <SContainer>
            <SBorder>
                <p><SSpan>{damage_result.min}</SSpan> 〜 <SSpan>{damage_result.max}</SSpan> ダメージ！！</p>
                <p><SSpan>{damage_result.min_per}%</SSpan> 〜 <SSpan>{damage_result.max_per}%</SSpan></p>
            </SBorder>             
            <SFlexDiv>
                <WrapPokeForm mode="my" name={my_specie_value.current.name}/>
                <WrapPokeForm mode="enemy" name={enemy_specie_value.current.name}/>
            </SFlexDiv>
            <SBorder>
                <div>
                <label>使用技</label>
                <select name="move" value={move_name} onChange={event=>setMoveName(event.target.value)}><Options array={move_array.current}/></select>
                <label>急所</label>
                <input type="checkbox" checked={critical} onChange={()=>setCritical(!critical)}/>

                </div>
            </SBorder>
        </SContainer>
    );
});

const SContainer = styled.div`
    margin: auto;
    width: calc(100vw -4px);
    height:calc100vh;
    max-width: 1000px;
    display: flex;
    align-items: center;
    flex-direction: column;
`

const SFlexDiv = styled.div`
    display:flex;
    width:100%;

    @media(min-width:767px) {
        justify-content:center;
    }
`
const SBorder = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    width:90%;
    border:1px solid lightgray;
    padding:10px;
    margin:5px;
    background-color:white;
    box-shadow:2px 2px 5px rgba(0,0,0,0.3);
    border-radius:10px;
`

const SSpan = styled.span`
    font-size:20px;
`

export default Calculator;