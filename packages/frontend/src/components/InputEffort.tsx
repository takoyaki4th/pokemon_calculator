import { FC, memo, useContext, useEffect, useReducer, useRef, useState } from "react";
import { EffortRange, EffortValue } from "../types/Pokemon";
import { isEffortRange, statsToJa } from "../utils/functions";
import styled from "styled-components";
import { MyOrEnemey } from "../types/MyOrEnemy";
import { useNumInput } from "./hooks/useNumInput";
import { label } from "../styles/styles";

export const InputEffort: FC<{ mode: MyOrEnemey, name: keyof EffortValue }> = memo(({ mode, name }) => {
    const { inputRef, data, set_fn, withHandler } = useNumInput(mode);

    //努力値の変更
    const handleEffortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value_to_num = withHandler(e);
        if (!(isEffortRange(value_to_num))) {
            console.log("努力値に適さない値が入力されています");
            return
        };
        const effort_value: EffortRange = value_to_num;
        set_fn({
            ...data,
            effort: {
                ...data.effort,
                [name]: effort_value
            }
        });
    };

    const handleOnPrev = ()=>{
        set_fn((prev) => {
            const value = prev.effort[name]<=8 ? 0:prev.effort[name]-8;
            return({
                ...prev,
                effort:{
                    ...prev.effort,
                    [name]:value
                }
            })
        });
    };

    const handleOnNext = ()=>{
        set_fn((prev) => {
            //型判定がないので注意
            let value = prev.effort[name];
            if(value < 4){
                value = 4;
            }else if(value >= 244){
                value = 252;
            }else{
                value += 8;
            }
            return({
                ...prev,
                effort:{
                    ...prev.effort,
                    [name]:value
                }
            })
        });
    };

    return (
        <>
            <SDiv>
                <SLabel>{statsToJa(name)}</SLabel>
                <div>
                    <SButton onClick={handleOnPrev}>-</SButton>
                    <SInput ref={inputRef} name={name} inputMode="numeric" value={data.effort[name]} onChange={handleEffortChange} />
                    <SButton onClick={handleOnNext}>+</SButton>
                </div>
            </SDiv>
        </>
    );
});

const SDiv = styled.div`
    margin-top:12px;
    position:relative;
    z-index:0;
`

const SInput = styled.input`
    margin:5px 8px 0 8px;
    width:50px;
`

const SLabel = styled.label`
    ${label}
`

const SButton = styled.button`
    width:30px;
    height:30px;
    border-radius:15px;
    border:1px solid lightgray; 
    box-shadow:2px 2px 4px rgba(0,0,0,0.3);
`