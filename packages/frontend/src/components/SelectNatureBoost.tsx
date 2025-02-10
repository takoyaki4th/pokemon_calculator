import { FC, useContext, useState } from "react";
import { MyOrEnemey } from "../types/MyOrEnemy";
import { EnemyPokeFormContext, MyPokeFormContext } from "./providers/PokeFormProvider";
import styled from "styled-components";
import { get_nature_boost } from "../utils/calcfunc";
import { NatureBoosted } from "../types/NatureBoosted";
import { MyMoveContext } from "./providers/MoveProvider";
import { Nature } from "../types/CalcConstant";

export const SelectNatureBoost:FC<{mode:MyOrEnemey}> = ({mode})=>{
    const {data,set_fn}=useContext((mode==="my" ? MyPokeFormContext:EnemyPokeFormContext));
    const {my_move:{damage_class}} = useContext(MyMoveContext);
    const nature_boosted:NatureBoosted = get_nature_boost(
        mode==="my" ? 
            damage_class==="physical" ? "ATTACK":"S_ATTACK"
            :
            damage_class==="physical" ? "DEFENSE":"S_DFENSE",
        data.nature
    );


    const handleX0_9 = ()=>{
        const get_nature = ():Nature=>{
            if(nature_boosted===0.9){
                if(mode==="my"){
                    return damage_class==="physical" ? "ようき" : "おくびょう";
                }else{
                    return "ようき";
                }
            }else{
                if(mode==="my"){
                    return damage_class==="physical" ? "ひかえめ" : "いじっぱり";
                }else{
                    return damage_class==="physical" ? "せっかち" : "むじゃき";
                }
            }
        }
       const nature:Nature=get_nature();
        set_fn({
            ...data,
            nature: nature
        });
    };

    const handleX1_1 = ()=>{
        const get_nature = ():Nature=>{
            if(nature_boosted===1.1){
                if(mode==="my"){
                    return damage_class==="physical" ? "ようき" : "おくびょう";
                }else{
                    return "ようき";
                }
            }else{
                if(mode==="my"){
                    return damage_class==="physical" ? "いじっぱり" : "ひかえめ";
                }else{
                    return damage_class==="physical" ? "わんぱく" : "おだやか";
                }
            }
        }
       const nature:Nature=get_nature();
        set_fn({
            ...data,
            nature: nature
        });
    };

    return(
        <SFlex>
            <SX0_9 nature_boosted={nature_boosted} onClick={handleX0_9}>x0.9</SX0_9>
            <SDiv>性格</SDiv>
            <SX1_1 nature_boosted={nature_boosted} onClick={handleX1_1}>x1.1</SX1_1>
        </SFlex>
    );
};

const SFlex = styled.div`
    display:flex;
    margin:10px 0 0 0;
    margin:20px;
`

const SDiv = styled.div`
    display:flex;
    align-items:center;
    height:30px;
    border:1px solid lightgray;
`

const SButton = {
    padding:'5px',
    border:'1px solid lightgray',
    boxShadow:'2px 2px 4px rgba(0,0,0,0.3)'
}

const SX0_9 = styled.button<{nature_boosted:NatureBoosted}>`
    color:${({nature_boosted}) => (nature_boosted!==0.9 ? "black" : "blue")};
    border-radius:10px 0 0 10px;
    ${SButton}
`
const SX1_1 = styled.button<{nature_boosted:NatureBoosted}>`
    color:${({nature_boosted}) => (nature_boosted!==1.1 ? "black" : "red")};
    border-radius:0 10px 10px 0;
    ${SButton}
`