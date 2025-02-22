import { FC, useContext, useState } from "react";
import { EnemySpecieContext, MySpecieContext } from "./providers/SpecieProvider";
import { EnemyPokeFormContext, MyPokeFormContext } from "./providers/PokeFormProvider";
import { MyMoveContext } from "./providers/MoveProvider";
import { calc_damage } from "../utils/calcfunc";
import styled from "styled-components";
import checkIcon from "../assets/check.svg"

export const Calculator:FC= ()=>{
    //攻撃ポケモン
    const {specie:my_specie} = useContext(MySpecieContext);
    const {data:my_poke_form} = useContext(MyPokeFormContext);

    //防御ポケモン
    const {specie:enemy_specie} = useContext(EnemySpecieContext);
    const {data:enemy_poke_form} = useContext(EnemyPokeFormContext);

    //技
    const {my_move} = useContext(MyMoveContext);

    //チェックボックス
    const [critical, setCritical] = useState(false);

    //コンポーネント分けたほうが良いかも
    const attacker = {
        ...my_poke_form,
        specie:my_specie
    };
    const defender = {
        ...enemy_poke_form,
        specie:enemy_specie
    };
    const {min,max,min_per,max_per} = calc_damage(attacker,defender,my_move,critical);

    return(
        <>
            <SBorder>
                <p><SSpan>{min}</SSpan> 〜 <SSpan>{max}</SSpan> ダメージ！！</p>
                <p><SSpan>{min_per}%</SSpan> 〜 <SSpan>{max_per}%</SSpan></p>
            </SBorder>             
            <SDiv>
                <SCheckBox type="checkbox" checked={critical} onChange={()=>setCritical(!critical)}/>
                <label>急所</label>
            </SDiv>
        </>
    );
 
};

const SBorder = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    width:90%;
    border:1px solid lightgray;
    padding:10px;
    margin:50px 5px 5px 5px;
    background-color:white;
    box-shadow:2px 2px 5px rgba(0,0,0,0.3);
    border-radius:10px;
`

const SSpan = styled.span`
    font-size:20px;
`
const SDiv = styled.div`
    padding:5px;
    display:flex;
    justify-content:center;
`

const SCheckBox = styled.input.attrs({ type: "checkbox" })`
    appearance:none;
    width:19px;
    height:19px;
    margin-right:5px;
    border:1px solid black;    
    border-radius:3px;
    box-shadow:none;
    position:relative;

    &:checked{
        border:none;
        background-color:blue;
        background-image:url(${checkIcon});
        background-no-repeat;
        background-position:0 1px;
    }
`