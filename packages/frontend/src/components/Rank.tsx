import { FC, memo } from "react";
import { MyOrEnemey } from "../types/MyOrEnemy";
import { EffortValue } from "../types/Pokemon";
import styled from "styled-components";

export const Rank:FC<{ mode: MyOrEnemey, name: keyof EffortValue }> = memo(({ mode, name }) => {

    return(
        <SDiv>
            <button>-</button>
            <div>±0</div>
            <button>+</button>
        </SDiv>
    );
});

const SDiv = styled.div`
    display:flex;
`