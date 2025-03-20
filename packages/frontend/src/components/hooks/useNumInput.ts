import { HTMLInputAutoCompleteAttribute, useContext, useEffect, useRef, useState } from "react";
import { EnemyPokeFormContext, MyPokeFormContext } from "../providers/PokeFormProvider";
import { MyOrEnemey } from "../../types/MyOrEnemy";
import { isEffortRange } from "../../utils/functions";
import { PokeData } from "../../types/Calculator";

type UseNumInputReturn ={
    inputRef:React.RefObject<HTMLInputElement>;
    data:PokeData;
    set_fn:React.Dispatch<React.SetStateAction<PokeData>>;
    withHandler:(e:React.ChangeEvent<HTMLInputElement>)=>number;
};

export const useNumInput = (mode:MyOrEnemey):UseNumInputReturn=>{
    const {data,set_fn}=useContext((mode==="my" ? MyPokeFormContext:EnemyPokeFormContext));

    const inputRef = useRef<HTMLInputElement>(null);
    const isSelect = useRef<boolean>(false);
    //再レンダリングを起こすためのfire変数
    const [fire,setFire] = useState<boolean>(false);

    useEffect(()=>{
        if(isSelect.current) {
            const input =inputRef.current;
            input?.select();
            isSelect.current=false;
        }
    },[fire]);

    const withHandler = (e:React.ChangeEvent<HTMLInputElement>):number=>{
        const {value} = e.target;
        let value_to_num = parseInt(value);
        if(value===""){
            isSelect.current = true;
            value_to_num = 0;
            setFire(!fire);
        };
        return value_to_num
    }

    return {inputRef,data,set_fn,withHandler};
}