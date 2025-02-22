import { FC, memo, useContext, useState} from "react";
import { Nature, nature_key_array } from "../types/CalcConstant";
import { Options } from "./Options";
import SuggestionInput from "./SuggestionInput";
import { EnemyPokeFormContext, MyPokeFormContext } from "./providers/PokeFormProvider";
import { MyOrEnemey } from "../types/MyOrEnemy";
import styled from "styled-components";
import { title } from "../styles/styles"
import { InputEffort } from "./InputEffort";
import { InputIndividual } from "./InputIndividual";
import { InputLevel } from "./InputLevel";
import { SelectNatureBoost } from "./SelectNatureBoost";
import { MyMoveContext } from "./providers/MoveProvider";
import { SelectMove } from "./SelectMove";
import { RankForm } from "./RankForm";

export const PokeForm:FC<{mode:MyOrEnemey}> = memo(({mode})=>{
    const {data,set_fn}=useContext((mode==="my" ? MyPokeFormContext:EnemyPokeFormContext));
    const {my_move} = useContext(MyMoveContext);

    //性格の変更
    const handleNatureChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        const { value } = e.target;
        //型判定がないので注意
        const nature=value as Nature;
        set_fn({
            ...data,
            nature:nature
        });
    };

    const [ is_open,setIsOpen ] = useState<boolean>(false);

    return(
        <>
        <SContainer >
            <SuggestionInput key={mode+"_suggesution"}mode={mode}/>
            { mode === "my" ? <SelectMove/> :""}
            <SP>努力値</SP>
            <SFlexDiv>
                {
                    mode==="my" ?
                        my_move.damage_class==="physical" ? 
                            <InputEffort mode={mode} name="attack"/>
                            :
                            <InputEffort mode={mode} name="s_attack"/>
                        :
                        <>
                        <InputEffort mode={mode} name="hp" />
                        {my_move.damage_class==="physical" ?
                            <InputEffort mode={mode} name="defense"  />
                            :
                            <InputEffort mode={mode} name="s_defense"/>}
                        </>
                }
            </SFlexDiv>
        </SContainer>
        <RankForm mode={mode}/>
        <SelectNatureBoost mode={mode}/>
        <SButton mode={mode} onClick={()=>setIsOpen(!is_open)}>+   細かく設定する</SButton>
        <SDrawer is_open={is_open}>
            <InputLevel mode={mode} />
            <SP>性格</SP>
            <select name="nature" value={data.nature} onChange={handleNatureChange}><Options array={nature_key_array}/></select>
            <SP>個体値</SP>
            <SIndiviContainer>
                <InputIndividual mode={mode} name="attack" />
                <InputIndividual mode={mode} name="s_attack" />
                <InputIndividual mode={mode} name="speed" />
            </SIndiviContainer>
            <SIndiviContainer>
                <InputIndividual mode={mode} name="hp" />
                <InputIndividual mode={mode} name="defense" />
                <InputIndividual mode={mode} name="s_defense" />
            </SIndiviContainer>
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

const SContainer=styled.div`
    height:25vh;
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:space-around;
`

const SFlexDiv= styled.div`
    display:flex;
    align-items:center;
    flex-direction:column;

    @media(max-width:768px){
        margin-bottom:10px;
    }
`

const SIndiviContainer = styled.div`
    display:flex;
`

const SDrawer = styled.div<{is_open:boolean}>`
    display:${({is_open}) => (is_open ? "flex" : "none")};
    align-items:center;
    flex-direction:column;
`

const SP = styled.p`
    ${title}
`

const SButton = styled.button<{mode:MyOrEnemey}>`
    color: #808080;
    font-size:12px;
    padding:4px 0 0 0;
    width:80%;
    border:none;
    background-color:white;
    border-top:1px solid #808080;

`