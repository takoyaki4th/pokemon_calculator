import { FC, memo } from "react";
import { MyOrEnemey } from "../types/MyOrEnemy";
import { useNumInput } from "./hooks/useNumInput";
import { isLevelRange } from "../utils/functions";
import { LevelRange } from "../types/Pokemon";
import styled from "styled-components";

export const InputLevel:FC<{mode:MyOrEnemey}> = memo(({mode})=>{
    const {inputRef,data,set_fn,withHandler}=useNumInput(mode);

    //levelの変更
    const handleLevelChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        let value_to_num = withHandler(e);
        if(value_to_num==0) value_to_num=1;

        if(!(isLevelRange(value_to_num))){
            console.log("Lvに適さない値が入力されています");
            return;
        }; 
        const level_value:LevelRange = value_to_num;

        set_fn({
            ...data,
            level:level_value
        });
    };

    return (
        <SDiv>
            <SLabel>Lv</SLabel>
            <SInput ref={inputRef} type="text" name="level" inputMode="numeric" value={data.level} onChange={handleLevelChange}/>
        </SDiv>
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
    padding:0 2px;
    position:absolute;
    border-radius:5px;
    top:-5px;
    left:50%;
    transform:translateX(-50%);
    white-space:nowrap;
`