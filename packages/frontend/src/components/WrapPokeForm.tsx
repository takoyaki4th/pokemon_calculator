import { FC } from "react";
import { PokeImage } from "./PokeImage";
import { PokeForm } from "./PokeForm";
import { MyOrEnemey } from "../types/MyOrEnemy";
import styled from "styled-components";

export const WrapPokeForm:FC<{mode:MyOrEnemey,name:string}> = ({mode,name})=>{
    return(
        <SDiv>
            <PokeImage key={mode} mode={mode} name={name}/>
            <PokeForm key={mode} mode={mode}/>
        </SDiv>
    );
};

const SDiv=styled.div`
    border:1px solid #000;
    padding:5px;
    margin:5px;
    display:flex;
    align-items:center;
    flex-direction:column;
`