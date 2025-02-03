import { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react";

//型として定義しなければ使えないのでasを使って型を定義する
export const MyDexNumberContext = createContext(
    {} as {
        dex_number:number,
        setDexNumber:Dispatch<SetStateAction<number>>
    }
);

export const EnemyDexNumberContext = createContext(
    {} as {
        dex_number:number,
        setDexNumber:Dispatch<SetStateAction<number>>
    }
);

export const DexNumberProvider:FC<{children:ReactNode}> = (props) =>{ const { children } = props;

    const [my_dex_number,setMyDexNumber] = useState<number>(1);

    const [enemy_dex_number,setEnemyDexNumber] = useState<number>(1);

    return(
        <EnemyDexNumberContext.Provider value={{dex_number:enemy_dex_number,setDexNumber:setEnemyDexNumber}}>
            <MyDexNumberContext.Provider value={{dex_number:my_dex_number,setDexNumber:setMyDexNumber}}> 
                {children}
            </MyDexNumberContext.Provider>
        </EnemyDexNumberContext.Provider>
    );
};