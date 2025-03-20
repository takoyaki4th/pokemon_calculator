import { Nature } from "./CalcConstant";
import { EffortValue, IndividualValue, LevelRange }from "./Pokemon"
import { Dispatch,SetStateAction } from "react";

export type PokeData = {
    name:string,
    nature:Nature,
    level:LevelRange,
    individual:IndividualValue,
    effort:EffortValue
};

export type FormStatePair = {
    data:PokeData,
    set_fn:Dispatch<SetStateAction<PokeData>>
};

export type DamageResult =  {
    min:number,
    max:number,
    min_per:number,
    max_per:number
}