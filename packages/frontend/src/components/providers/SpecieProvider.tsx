import { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import { Species } from "../../types/Species";

//型として定義しなければ使えないのでasを使って型を定義する
export const MySpecieContext = createContext(
    {} as {
        specie:Species,
        setSpecie:Dispatch<SetStateAction<Species>>
    }
);

export const EnemySpecieContext = createContext(
    {} as {
        specie:Species,
        setSpecie:Dispatch<SetStateAction<Species>>
    }
);

export const SpecieProvider:FC<{children:ReactNode}> = (props) =>{ const { children } = props;

    const initial_value:Species = {
        DexNumber:1,
        name:"ポケモンの情報を取得できていません",
        HP:45,Attack:49,Defense:49,sAttack:65,sDefense:65,Speed:45,
        type1:"どく",type2:"くさ",
    };

    const [my_specie,setMySpece] = useState<Species>(initial_value);

    const [enemy_specie,setEnemySpecie] = useState<Species>(initial_value);

    return(
        <EnemySpecieContext.Provider value={{specie:enemy_specie,setSpecie:setEnemySpecie}}>
            <MySpecieContext.Provider value={{specie:my_specie,setSpecie:setMySpece}}> 
                {children}
            </MySpecieContext.Provider>
        </EnemySpecieContext.Provider>
    );
};