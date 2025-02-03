import { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import { FormStatePair, PokeData } from "../../types/Calculator";

//型として定義しなければ使えないのでasを使って型を定義する
export const MyPokeFormContext = createContext(
    {} as FormStatePair
);

export const EnemyPokeFormContext = createContext(
    {} as FormStatePair
);

export const PokeFormProvider:FC<{children:ReactNode}> = (props) =>{
    const { children } = props;

    const [my_poke_form,setMyPokeForm] = useState<PokeData>({
        name:"ニックネーム",
        nature:"わんぱく",
        level:50,
        individual:{hp:31,attack:31,defense:31,s_attack:31,s_defense:31,speed:31},
        effort:{hp:0,attack:252,defense:0,s_attack:252,s_defense:0,speed:0}
    });

    const [enemy_poke_form,setEnemyPokeForm] = useState<PokeData>({
        name:"ニックネーム",
        nature:"わんぱく",
        level:50,
        individual:{hp:31,attack:31,defense:31,s_attack:31,s_defense:31,speed:31},
        effort:{hp:0,attack:252,defense:0,s_attack:252,s_defense:0,speed:0}
    });

    return(
        <EnemyPokeFormContext.Provider value={{data:enemy_poke_form,set_fn:setEnemyPokeForm}}>
            <MyPokeFormContext.Provider value={{data:my_poke_form,set_fn:setMyPokeForm}}> 
                {children}
            </MyPokeFormContext.Provider>
        </EnemyPokeFormContext.Provider>
    );
};