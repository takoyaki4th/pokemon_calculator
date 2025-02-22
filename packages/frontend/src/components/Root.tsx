import { FC } from "react";
import styled from "styled-components";
import { WrapPokeForm } from "./WrapPokeForm";
import { Calculator } from "./Calculator";

const Root:FC = () => {
    console.log("レンダリングされました");
 
    return(
        <SContainer>
            <Calculator/>
            <SFlexDiv>
                <WrapPokeForm mode="my" />
                <WrapPokeForm mode="enemy"/>
            </SFlexDiv>
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
    align-items:flex-start;

    @media(min-width:767px) {
        justify-content:center;
    }
`


export default Root;