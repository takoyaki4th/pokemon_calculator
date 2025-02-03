import { FC, memo, useContext, useEffect } from "react";
import { EffortRange, EffortValue, IndividualRange, IndividualValue } from "../types/Pokemon";
import { isEffortRange, isIndividualRange, isLevelRange, statsToJa } from "../utils/functions";
import { nature_key_array } from "../types/CalcConstant";
import Options from "./Options";
import SuggestionInput from "./SuggestionInput";
import { EnemyPokeFormContext, MyPokeFormContext } from "./providers/GlobalState";
import { MyOrEnemey } from "../types/MyOrEnemy";

//個体値のコンポーネント
const InputIndividual:FC<{name:keyof IndividualValue,value:IndividualRange,onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}> = memo(({name,value,onChange}) => {
    return(
        <>
        <label>{statsToJa(name)}</label>
        <input type="number" name={name} step="1" min="0" max="31" inputMode="numeric" value={value} onChange={onChange}/>
        </>
    ); 
});

//努力値のコンポーネント
const InputEffort:FC<{name:keyof EffortValue,value:EffortRange,onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}> = memo(({name,value,onChange}) => {
    return(
        <>
        <label>{statsToJa(name)}</label>
        <input className="effort-box" type="number" name={name} step="8" min="0" max="252" inputMode="numeric" value={value} onChange={onChange}/>
        </>
    ); 
});

export const PokeForm:FC<{mode:MyOrEnemey}> = memo(({mode})=>{
    console.log(mode);
    const {data,set_fn}=useContext((mode==="my" ? MyPokeFormContext:EnemyPokeFormContext));

    //図鑑番号の変更
    const handleDexNumChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const { value } = e.target;
        const value_to_num = parseInt(value);
        if(isNaN(value_to_num)){
            throw Error("値がlevelになりません");
        }
        set_fn({
            ...data,
            dex_number:value_to_num
        });
    };

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

    //努力値の変更
    const handleEffortChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(!(isEffortRange(value_to_num))){
            throw Error("値が努力値になりません");
        }
        //set_fnの中での型判定が効いていないのでこの文で判定する
        const indivi_value:EffortRange = value_to_num;
        set_fn({
            ...data,
            effort:{
                ...data.effort,
                [name]:indivi_value
            }
        });
    };

    //性格の変更
    const handleNatureChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        const { name, value } = e.target;
        set_fn({
            ...data,
            nature:value
        });
    };

    return(
        <>
        <div className="flex mb-5">
            <SuggestionInput mode={mode}/>
        </div>
        <div>
            <label>レベル</label>
            <input type="number" name="level" step="10" min="1" max="100"inputMode="numeric" value={data.level} onChange={handleLevelChange}/> 
            <label>性格</label>
            <select name="nature" onChange={handleNatureChange}><Options array={nature_key_array}/></select>
        </div>
        <p>個体値</p>
        <div>
            <InputIndividual name="attack" value={data.individual.attack} onChange={handleIndividualChange}/>
            <InputIndividual name="defense" value={data.individual.defense} onChange={handleIndividualChange}/>
            <InputIndividual name="s_attack" value={data.individual.s_attack} onChange={handleIndividualChange}/>
            <InputIndividual name="s_defense" value={data.individual.s_defense} onChange={handleIndividualChange}/>
        </div>
        <div>
            <InputIndividual name="hp" value={data.individual.hp} onChange={handleIndividualChange}/>
            <InputIndividual name="speed" value={data.individual.speed} onChange={handleIndividualChange}/>
        </div>
        <p>努力値</p>
        <div>
            <InputEffort name="attack" value={data.effort.attack} onChange={handleEffortChange} />
            <InputEffort name="defense" value={data.effort.defense} onChange={handleEffortChange} />
            <InputEffort name="s_attack" value={data.effort.s_attack} onChange={handleEffortChange} />
            <InputEffort name="s_defense" value={data.effort.s_defense} onChange={handleEffortChange} />
        </div>
        <div className="mb-5">
            <InputEffort name="hp" value={data.effort.hp} onChange={handleEffortChange}/>
            <InputEffort name="speed" value={data.effort.speed} onChange={handleEffortChange}/>
        </div>
        </>
    );
});            