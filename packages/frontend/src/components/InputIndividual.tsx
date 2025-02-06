import { FC, memo } from "react";
import { IndividualRange, IndividualValue } from "../types/Pokemon";
import { statsToJa } from "../utils/functions";

export const InputIndividual:FC<{name:keyof IndividualValue,value:IndividualRange,onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}> = memo(({name,value,onChange}) => {
    return(
        <>
        <label>{statsToJa(name)}</label>
        <input type="number" name={name} step="1" min="0" max="31" inputMode="numeric" value={value} onChange={onChange}/>
        </>
    ); 
});

