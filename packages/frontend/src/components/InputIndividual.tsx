import { FC, memo, useContext } from "react";
import { IndividualRange, IndividualValue } from "../types/Pokemon";
import { isIndividualRange, statsToJa } from "../utils/functions";
import styled from "styled-components";
import { useNumInput } from "./hooks/useNumInput";
import { MyOrEnemey } from "../types/MyOrEnemy";

export const InputIndividual:FC<{mode:MyOrEnemey,name:keyof IndividualValue}> = memo(({mode,name}) => {
    const {inputRef,data,set_fn,withHandler}=useNumInput(mode);

    //努力値の変更
    const handleIndividualChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let value_to_num = withHandler(e);
        if(!(isIndividualRange(value_to_num))){
            console.log("個体値に適さない値が入力されています");
            return 
        };
        const individual_value:IndividualRange = value_to_num;
        set_fn({
            ...data,
            individual:{
                ...data.individual,
                [name]:individual_value 
            }
        });
    };

    return(
        <>
        <SDiv>
            <SLabel>{statsToJa(name)}</SLabel>
            <SInput ref={inputRef} name={name} inputMode="numeric" value={data.individual[name]} onChange={handleIndividualChange}/>
        </SDiv>
        </>
    ); 
});

const SDiv = styled.div`
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
