import { useState, useEffect, memo} from "react";
import { wrapGet,isIndividualRange, isLevelRange, isEffortRange } from "../utils/functions"
import { Move } from "../types/Species";
import { calc_damage } from "../utils/calcfunc"
import { EffortRange, EffortValue, IndividualRange, IndividualValue, Pokemon } from "../types/Pokemon";
import { PokeData } from "../types/Calculator";

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
        <input type="number" name={name} step="8" min="0" max="252" inputMode="numeric" value={value} onChange={onChange}/>
        </>
    ) 
});

const Calculator:React.FC = memo(() => {
    const [min,setMin] = useState<number>(0);
    const [max,setMax] = useState<number>(0);
    const [my_poke,setMyPoke] = useState<Pokemon>(new Pokemon("攻撃側のポケモンが設定されていません"));
    const [enemy_poke,setEnemyPoke] = useState<Pokemon>(new Pokemon("防御側のポケモンが設定されていません"));
    const [my_move,setMyMove] = useState<Move>({
        id:0,
        name:"技が設定されていません",
        damage_class:"physical",
        power:0,
        type:"ノーマル"
    });
    const [enemy_poke_index,setEnemyPokeIndex] = useState<string>("34");
    const [my_move_index,setMyMoveIndex]=useState<string>("1");
    const [my_poke_form,setMyPokeForm]=useState<PokeData>({
        name:"ニックネーム",
        dex_number:1,
        nature:"わんぱく",
        level:50,
        individual:{attack:31,defense:31,s_attack:31,s_defense:31},
        effort:{attack:252,defense:0,s_attack:252,s_defense:0}
    });
    const [enemy_poke_form,setEnemyPokeForm]=useState<PokeData>({
        name:"ニックネーム",
        dex_number:1,
        nature:"わんぱく",
        level:50,
        individual:{attack:31,defense:31,s_attack:31,s_defense:31},
        effort:{attack:252,defense:0,s_attack:252,s_defense:0}
    })

    useEffect(() => {
        const build = async () =>{
            setMyPoke(await Pokemon.build(my_poke_form));

            setEnemyPoke(await Pokemon.build(enemy_poke_form));

            const response:Move = await wrapGet<Move>(`api/moves/${my_move_index}`);
            setMyMove(response);
        }

        build();
    },[my_move_index,my_poke_form,enemy_poke_form]);

    useEffect(()=>{
        const [min_damage,max_damage]=calc_damage(my_poke,enemy_poke,my_move);
        setMin(min_damage);
        setMax(max_damage); 
    },[my_move,my_poke,enemy_poke]); 

    //図鑑番号の変更
    const handleDexNumChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(isNaN(value_to_num)){
            throw Error(`値がlevelになりません`);
        }
        setMyPokeForm({
            ...my_poke_form,
            dex_number:value_to_num
        });
    };

    const handleEnemyDexNumChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(isNaN(value_to_num)){
            throw Error(`値がlevelになりません`);
        }
        setEnemyPokeForm({
            ...enemy_poke_form,
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
        setMyPokeForm({
            ...my_poke_form,
            level:value_to_num
        });
    }

    const handleEnemyLevelChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(!(isLevelRange(value_to_num))){
            throw Error(`値がlevelになりません`);
        } 
        setEnemyPokeForm({
            ...enemy_poke_form,
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
        setMyPokeForm({
            ...my_poke_form,
            individual:{
                ...my_poke_form.individual,
                [name]:value_to_num
            }
        });
    };

    const handleEnemyIndividualChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(!(isIndividualRange(value_to_num))){
            throw Error(`値がlevelになりません`);
        }
        setEnemyPokeForm({
            ...enemy_poke_form,
            individual:{
                ...enemy_poke_form.individual,
                [name]:value_to_num
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
        setMyPokeForm({
            ...my_poke_form,
            effort:{
                ...my_poke_form.effort,
                [name]:value_to_num
            }
        });
    };

    const handleEnemyEffortChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const { name, value } = e.target;
        const value_to_num = parseInt(value);
        if(!(isEffortRange(value_to_num))){
            throw Error("値が努力値になりません");
        }
        setEnemyPokeForm({
            ...enemy_poke_form,
            effort:{
                ...enemy_poke_form.effort,
                [name]:value_to_num
            }
        });
    };

    console.log("レンダリングされました");
 
    return(
        <div className="container">
            <div className="flex">
                <div className="border center">
                    <h3>攻撃ポケモン</h3>
                    <div>
                        <label>図鑑番号</label>
                        <input type="number" name="dex_number" step="10" min="1" max="151"inputMode="numeric" value={my_poke_form.dex_number} onChange={handleDexNumChange}/> 
                        <label>レベル</label>
                        <input type="number" name="level" step="10" min="1" max="100"inputMode="numeric" value={my_poke_form.level} onChange={handleLevelChange}/> 
                    </div>
                    <p>個体値</p>
                    <div>
                        <InputIndividual name="attack" value={my_poke_form.individual.attack} onChange={handleIndividualChange}/>
                        <InputIndividual name="defense" value={my_poke_form.individual.defense} onChange={handleIndividualChange}/>
                        <InputIndividual name="s_attack" value={my_poke_form.individual.s_attack} onChange={handleIndividualChange}/>
                        <InputIndividual name="s_defense" value={my_poke_form.individual.s_defense} onChange={handleIndividualChange}/>
                    </div>
                    <p>努力値</p>
                    <div>
                        <InputEffort name="attack" value={my_poke_form.effort.attack} onChange={handleEffortChange} />
                        <InputEffort name="defense" value={my_poke_form.effort.defense} onChange={handleEffortChange} />
                        <InputEffort name="s_attack" value={my_poke_form.effort.s_attack} onChange={handleEffortChange} />
                        <InputEffort name="s_defense" value={my_poke_form.effort.s_defense} onChange={handleEffortChange} />
                    </div>
                </div>
                <div className="border center">
                    <h3>防御ポケモン</h3>
                    <div>
                        <label>図鑑番号</label>
                        <input type="number" name="dex_number" step="10" min="1" max="151"inputMode="numeric" value={enemy_poke_form.dex_number} onChange={handleEnemyDexNumChange}/> 
                        <label>レベル</label>
                        <input type="number" name="level" step="10" min="1" max="100"inputMode="numeric" value={enemy_poke_form.level} onChange={handleEnemyLevelChange}/> 
                    </div>
                    <p>個体値</p>
                    <div>
                        <InputIndividual name="attack" value={enemy_poke_form.individual.attack} onChange={handleEnemyIndividualChange}/>
                        <InputIndividual name="defense" value={enemy_poke_form.individual.defense} onChange={handleEnemyIndividualChange}/>
                        <InputIndividual name="s_attack" value={enemy_poke_form.individual.s_attack} onChange={handleEnemyIndividualChange}/>
                        <InputIndividual name="s_defense" value={enemy_poke_form.individual.s_defense} onChange={handleEnemyIndividualChange}/>
                    </div>
                    <p>努力値</p>
                    <div>
                        <InputEffort name="attack" value={enemy_poke_form.effort.attack} onChange={handleEnemyEffortChange} />
                        <InputEffort name="defense" value={enemy_poke_form.effort.defense} onChange={handleEnemyEffortChange} />
                        <InputEffort name="s_attack" value={enemy_poke_form.effort.s_attack} onChange={handleEnemyEffortChange} />
                        <InputEffort name="s_defense" value={enemy_poke_form.effort.s_defense} onChange={handleEnemyEffortChange} />
                    </div>
                </div>
        
            </div>
            <div className="border">
                <label>使用技のID</label>
                <input type="number" name="move_index" step="1" min="1" max="100" inputMode="numeric" value={my_move_index} onChange={event => setMyMoveIndex(event.target.value)}/>
            </div>
 
            <div className="border">
                <div className="sprite-right">
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${enemy_poke.specie.DexNumber}.png`} alt={enemy_poke.specie.name} />
                </div>
                <div className="sprite-left">
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${my_poke_form.dex_number}.png`} alt={my_poke.specie.name} />
                </div>
            </div>
            <div className="border">
                <p>{my_poke.specie.name}の{my_move.name}攻撃!</p>
                <p>{enemy_poke.specie.name}に最小{min},最大{max}ダメージ!</p>
            </div>
        </div>
    )
});

export default Calculator;