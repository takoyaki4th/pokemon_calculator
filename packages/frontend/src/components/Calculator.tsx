import { useState, FC, useContext} from "react";
import { calc_damage } from "../utils/calcfunc"
import { EnemyPokeFormContext, MyPokeFormContext } from "./providers/PokeFormProvider";
import { EnemySpecieContext, MySpecieContext } from "./providers/SpecieProvider";
import styled from "styled-components";
import { WrapPokeForm } from "./WrapPokeForm";
import { MyMoveContext} from "./providers/MoveProvider";

const Calculator:FC = () => {
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

    console.log("レンダリングされました");
 
    return(
        <SContainer>
            <SBorder>
                <p><SSpan>{min}</SSpan> 〜 <SSpan>{max}</SSpan> ダメージ！！</p>
                <p><SSpan>{min_per}%</SSpan> 〜 <SSpan>{max_per}%</SSpan></p>
            </SBorder>             
            <SFlexDiv>
                <WrapPokeForm mode="my" />
                <WrapPokeForm mode="enemy"/>
            </SFlexDiv>
            <SBorder>
                <div>
                   <label>急所</label>
                    <input type="checkbox" checked={critical} onChange={()=>setCritical(!critical)}/>
                </div>
            </SBorder>
        </SContainer>
    );
};

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