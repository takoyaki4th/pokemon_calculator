import { FC, memo } from "react";
import { EffortRange, EffortValue } from "../types/Pokemon";
import { statsToJa } from "../utils/functions";
import styled from "styled-components";

export const InputEffort:FC<{name:keyof EffortValue,value:EffortRange,onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}> = memo(({name,value,onChange}) => {
    return(
        <>
        <label>{statsToJa(name)}</label>
        <SInput type="number" name={name} step="8" min="0" max="252" inputMode="numeric" value={value} onChange={onChange}/>
        </>
    ); 
});

const SInput=styled.input`
    width:50px;
`