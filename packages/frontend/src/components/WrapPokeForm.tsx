import { FC } from "react";
import { PokeImage } from "./PokeImage";
import { PokeForm } from "./PokeForm";
import { MyOrEnemey } from "../types/MyOrEnemy";
import styled from "styled-components";

export const WrapPokeForm:FC<{mode:MyOrEnemey}> = ({mode})=>{
    return(
        <SDiv mode={mode}>
            <PokeImage key={mode+"_image"} mode={mode} />
            <PokeForm key={mode+"_form"} mode={mode}/>
        </SDiv>
    );
};

const SDiv=styled.div<{mode:MyOrEnemey}>`
    border-radius:13px 3px 13px 3px;
    box-shadow:2px 3px 6px rgba(0,0,0,0.5);
    padding: 5px 3px 15px 3px;
    margin:0 10px;
    display:flex;
    align-items:center;
    flex-direction:column;
    width:290px;
    background-color: #FFFFFF;
    justify-cotent:space-between;

    @media(max-width:768px) {
        margin:6px;
        width: calc(50% - 12px);
    }
`