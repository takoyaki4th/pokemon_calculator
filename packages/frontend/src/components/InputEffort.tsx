import { FC, memo, useContext, useEffect, useReducer, useRef, useState } from "react";
import { EffortRange, EffortValue } from "../types/Pokemon";
import { isEffortRange, statsToJa } from "../utils/functions";
import styled from "styled-components";
import { MyOrEnemey } from "../types/MyOrEnemy";
import { useNumInput } from "./hooks/useNumInput";

export const InputEffort:FC<{mode:MyOrEnemey,name:keyof EffortValue}> = memo(({mode,name}) => {
    const {inputRef,data,set_fn,withHandler}=useNumInput(mode);

    //努力値の変更
    const handleEffortChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let value_to_num = withHandler(e);
        if(!(isEffortRange(value_to_num))){
            console.log("努力値に適さない値が入力されています");
            return 
        };
        const effort_value:EffortRange = value_to_num;
        set_fn({
            ...data,
            effort:{
                ...data.effort,
                [name]: effort_value
            }
        });
    };
        
    return(
        <>
        <SDiv>
            <SLabel>{statsToJa(name)}</SLabel>
            <SInput ref={inputRef} name={name} inputMode="numeric" value={data.effort[name]} onChange={handleEffortChange}/>
        </SDiv>
        </>
    ); 
});

const SDiv=styled.div`
    margin-top:10px;
    position:relative;
    z-index:0;
`

const SInput=styled.input`
    margin-top:5px;
    width:50px;
`

const SLabel = styled.label`
    background-color:white; 
    padding:0 4px;
    position:absolute;
    border-radius:5px;
    top:-5px;
    left:50%;
    transform:translateX(-50%);
    white-space:nowrap;
`