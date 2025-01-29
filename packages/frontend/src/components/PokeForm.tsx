import { memo } from "react";
import { FormStatePair } from "../types/Calculator";
import { EffortRange, EffortValue, IndividualRange, IndividualValue } from "../types/Pokemon";
import { isEffortRange, isIndividualRange, isLevelRange } from "../utils/functions";

//個体値のコンポーネント
const InputIndividual:React.FC<{name:keyof IndividualValue,value:IndividualRange,onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}> = memo(({name,value,onChange}) => {
    return(
        <>
        <label>{ name==="attack" ? "攻撃" : name==="defense" ? "防御" : name==="s_attack" ? "特攻" : "特防" }</label>
        <input type="number" name={name} step="1" min="0" max="31" inputMode="numeric" value={value} onChange={onChange}/>
        </>
    ) 
});

//努力値のコンポーネント
const InputEffort:React.FC<{name:keyof EffortValue,value:EffortRange,onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void}> = memo(({name,value,onChange}) => {
    return(
        <>
        <label>{ name==="attack" ? "攻撃" : name==="defense" ? "防御" : name==="s_attack" ? "特攻" : "特防" }</label>
        <input className="effort-box" type="number" name={name} step="8" min="0" max="252" inputMode="numeric" value={value} onChange={onChange}/>
        </>
    ) 
});

export const PokeForm:React.FC<FormStatePair> = memo(({data,set_fn})=>{
    //図鑑番号の変更
    const handleDexNumChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(isNaN(value_to_num)){
            throw Error(`値がlevelになりません`);
        }
        set_fn({
            ...data,
            dex_number:value_to_num
        });
    };

    //levelの変更
    const handleLevelChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(!(isLevelRange(value_to_num))){
            throw Error(`値がlevelになりません`);
        } 
        set_fn({
            ...data,
            level:value_to_num
        });
    }

    //個体値の変更
    const handleIndividualChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(!(isIndividualRange(value_to_num))){
            throw Error(`値がlevelになりません`);
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
                [name]:value_to_num
            }
        });
    };

    return(
        <>
            <div>
                <label>図鑑番号</label>
                <input type="number" name="dex_number" step="10" min="1" max="151"inputMode="numeric" value={data.dex_number} onChange={handleDexNumChange}/> 
                <label>レベル</label>
                <input type="number" name="level" step="10" min="1" max="100"inputMode="numeric" value={data.level} onChange={handleLevelChange}/> 
            </div>
            <p>個体値</p>
            <div>
                <InputIndividual name="attack" value={data.individual.attack} onChange={handleIndividualChange}/>
                <InputIndividual name="defense" value={data.individual.defense} onChange={handleIndividualChange}/>
                <InputIndividual name="s_attack" value={data.individual.s_attack} onChange={handleIndividualChange}/>
                <InputIndividual name="s_defense" value={data.individual.s_defense} onChange={handleIndividualChange}/>
            </div>
            <p>努力値</p>
            <div>
                <InputEffort name="attack" value={data.effort.attack} onChange={handleEffortChange} />
                <InputEffort name="defense" value={data.effort.defense} onChange={handleEffortChange} />
                <InputEffort name="s_attack" value={data.effort.s_attack} onChange={handleEffortChange} />
                <InputEffort name="s_defense" value={data.effort.s_defense} onChange={handleEffortChange} />
            </div>
        </>
    )
});            

