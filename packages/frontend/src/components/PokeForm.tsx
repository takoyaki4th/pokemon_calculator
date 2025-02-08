import { FC, memo, useContext, useState} from "react";
import { EffortRange, IndividualRange} from "../types/Pokemon";
import { isEffortRange, isIndividualRange, isLevelRange} from "../utils/functions";
import { nature_key_array } from "../types/CalcConstant";
import { Options } from "./Options";
import SuggestionInput from "./SuggestionInput";
import { EnemyPokeFormContext, MyPokeFormContext } from "./providers/PokeFormProvider";
import { MyOrEnemey } from "../types/MyOrEnemy";
import styled from "styled-components";
import { InputEffort } from "./InputEffort";
import { InputIndividual } from "./InputIndividual";

export const PokeForm:FC<{mode:MyOrEnemey}> = memo(({mode})=>{
    const {data,set_fn}=useContext((mode==="my" ? MyPokeFormContext:EnemyPokeFormContext));

    //levelの変更
    const handleLevelChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const value_to_num = parseInt(value);
        if(!(isLevelRange(value_to_num))){
            throw Error("値がlevelになりません");
        } 
        set_fn({
            ...data,
            level:value_to_num
        });
    };

    //個体値の変更
    const handleIndividualChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(!(isIndividualRange(value_to_num))){
            throw Error("値がlevelになりません");
        }
        //set_fnの中での型判定が効いていないのでこの文で判定する
        const indivi_value:IndividualRange = value_to_num;
        set_fn({
            ...data,
            individual:{
                ...data.individual,
                [name]:indivi_value
            }
        });
    };

    //性格の変更
    const handleNatureChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        const { value } = e.target;
        set_fn({
            ...data,
            nature:value
        });
    };

    const [ is_open,setIsOpen] = useState<boolean>(false);

    return(
        <>
        <SuggestionInput key={mode+"_suggesution"}mode={mode}/>
        <SP>性格</SP>
        <select name="nature" onChange={handleNatureChange}><Options array={nature_key_array}/></select>
        <SP>努力値</SP>
        <SFlexDiv>
            {
                mode==="my" ? 
                    <><InputEffort mode={mode} name="attack"/>
                    <InputEffort mode={mode} name="s_attack"/></>
                    :
                    <><InputEffort mode={mode} name="hp" />
                    <InputEffort mode={mode} name="defense"  />
                    <InputEffort mode={mode} name="s_defense"/></>
            }
        </SFlexDiv>
        <SButton onClick={()=>setIsOpen(!is_open)}>+   細かく設定する</SButton>
        <SDrawer is_open={is_open}>
            <label>Lv</label>
            <input type="number" name="level" step="10" min="1" max="100"inputMode="numeric" value={data.level} onChange={handleLevelChange}/> 
            <SP>個体値</SP>
            <InputIndividual mode={mode} name="attack" />
            <InputIndividual mode={mode} name="s_attack" />
            <InputIndividual mode={mode} name="speed" />
            <InputIndividual mode={mode} name="hp" />
            <InputIndividual mode={mode} name="defense" />
            <InputIndividual mode={mode} name="s_defense" />
            <SP>努力値</SP>
            <InputEffort mode={mode} name="attack" />
            <InputEffort mode={mode} name="s_attack" />
            <InputEffort mode={mode} name="speed" />
            <InputEffort mode={mode} name="hp" />
            <InputEffort mode={mode} name="defense" />
            <InputEffort mode={mode} name="s_defense" />
        </SDrawer>
        </>
    );
});            

const SFlexDiv= styled.div`
    display:flex;
    margin-bottom:7px;

    @media (max-width:768px){
        align-items:center;
        flex-direction:column;
    }
`

const SDrawer = styled.div<{is_open:boolean}>`
    display:${({is_open}) => (is_open ? "flex" : "none")};
    align-items:center;
    flex-direction:column;
`

const SP = styled.p`
    @media(max-width:768px){
        font-size:12px;
        font-weight:normal; 
        color:#808080;
    }
`

const SButton = styled.button`
    color: #808080;
    font-size:12px;
    padding:4px 0 0 0;
    width:80%;
    margin:auto 0 5px 0;
    border:none;
    background-color:white;
    border-top:1px solid #808080;
`