import { Nature } from "./CalcConstant";
import { EffortValue, IndividualValue, LevelRange }from "./Pokemon"

export type PokeData = {
    name:string,
    dex_number:number,
    nature:Nature,
    level:LevelRange,
    individual:IndividualValue,
    effort:EffortValue
};

export type FormStatePair = {
    data:PokeData,
    set_fn:(form_data:PokeData)=>void
};