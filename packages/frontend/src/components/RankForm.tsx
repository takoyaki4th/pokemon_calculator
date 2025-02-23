import { FC, memo, useContext } from "react";
import { MyOrEnemey } from "../types/MyOrEnemy";
import styled from "styled-components";
import { CorrectionsContext } from "./providers/CorrectionsProvider";
import { MyMoveContext } from "./providers/MoveProvider";
import { Rank } from "../types/Rank";
import { title } from "../styles/styles";

export const RankForm:FC<{ mode: MyOrEnemey}> = memo(({ mode }) => {
    const {corrections, setCorrections} = useContext(CorrectionsContext);
    const {my_move:{damage_class}} = useContext(MyMoveContext);
    const correction_key = mode==="my" ? "attacker_rank" : "defender_rank";

    const handleOnPrev = ()=>{
        const current_value = corrections[correction_key]
        const value = current_value===-6 ? -6 : current_value-1 as Rank
        setCorrections({
            ...corrections,
            [correction_key]:value
        })
    };
 
    const handleOnNext = ()=>{
        const current_value = corrections[correction_key]
        const value = current_value===6 ? 6 : current_value+1 as Rank
        setCorrections({
            ...corrections,
            [correction_key]:value
        })
    };
    
    return(
        <>
        <SSpan>
            {
                damage_class==="physical" ? 
                    mode==="my" ? "攻撃":"防御"
                    :
                    mode==="my" ? "特攻":"特防"
            }
            ランク
        </SSpan>
        <SDiv>
            <SPrevButton onClick={handleOnPrev}/>
            <SButtonSpan>{corrections[correction_key]}</SButtonSpan>
            <SNextButton onClick={handleOnNext}/>
        </SDiv>
        </>
    );
});

const SDiv = styled.div`
    display:flex;
    align-items:center;
`
const SSpan = styled.span`
    ${title}
`

const button = {
    width:'20px',
    height:'23px',
    border:'1px solid lightgray',
    backgroundColor:'gray',
};

const SButtonSpan = styled.span`
    padding:0 7px;
`

const SNextButton = styled.button`
    ${button}
    clip-path: polygon(100% 50%, 0% 0%, 0% 100%);
`
const SPrevButton = styled.button`
    ${button}
    clip-path: polygon(0% 50%, 100% 0%, 100% 100%);
`