import { createContext, Dispatch, FC, MutableRefObject, ReactNode, SetStateAction, useRef, useState } from "react";
import { Move } from "../../types/Species";
import { id_name } from "../../types/id_text";

export const MyMoveContext = createContext(
    {} as {
        my_move:Move,
        setMyMove:Dispatch<SetStateAction<Move>>,
        move_array:MutableRefObject<Array<id_name>>
    }
);

export const MoveProvider:FC<{children:ReactNode}> = (props)=>{
    const {children}=props;

    const move_array = useRef<Array<id_name>>([{id:0,name:"つるのムチ"}]);
    const [my_move,setMyMove] = useState<Move>({
        id:0,
        name:"技が設定されていません",
        damage_class:"physical",
        power:0,
        type:"ノーマル"
    });

    return(
        <MyMoveContext.Provider value={{my_move,setMyMove,move_array}}>
            {children}
        </MyMoveContext.Provider>
    );
};
