import { createContext } from "react";
import { Corrections } from "../../types/Corrections";
import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";

export const CorrectionsContext = createContext(
    {} as {
        corrections:Corrections,
        setCorrections:Dispatch<SetStateAction<Corrections>>,
    }
);

export const CorrectionsProvider:FC<{children:ReactNode}> = (props)=>{
    const {children}=props;

    const [corrections,setCorrections] = useState<Corrections>({
        critical:false,
        attacker_rank:0,
        defender_rank:0
    });

    return(
        <CorrectionsContext.Provider value={{corrections,setCorrections}}>
            {children}
        </CorrectionsContext.Provider>
    );
};
