import { FC, memo, useContext, useEffect, useRef } from "react";
import { id_name } from "../types/id_text";
import axios from "axios";
import { MyMoveContext } from "./providers/MoveProvider";
import { wrapGet } from "../utils/functions";
import { Move } from "../types/Species";
import { MySpecieContext } from "./providers/SpecieProvider";
import styled from "styled-components";

//性格もidで操作するようにしたらOptionコンポーネントとして切り出す
const MoveOptions:FC<{array:Array<id_name>}> = memo(({array})=> {
    const option_list = array.map((item)=>{
        return <option key={item.id} value={item.id}>{item.name}</option>
    });
    return <>{option_list}</>;
}); 


export const SelectMove:FC = ()=>{
    const {specie:my_specie} = useContext(MySpecieContext);
    const {my_move,setMyMove,move_array} = useContext(MyMoveContext);

    useEffect(()=>{
        const get_specie = async()=>{
            try {
                const res_moves = await axios<Array<id_name>>(`api/moveLearnMap/dex_number/${my_specie.DexNumber}`);
                const res_array = res_moves.data.map(({id,name})=> ({id,name}));
                move_array.current = res_array;
                const res = await wrapGet<Move>(`api/moves/id/${res_array[0].id}`);
                setMyMove(res);
            } catch (error) {
                console.log(error); 
            }
        };
        get_specie();
    },[]);

    const handleMoveChange = (value:string)=>{
        const build = async()=>{
            const res = await wrapGet<Move>(`api/moves/id/${value}`);
            setMyMove(res);
        };
        build();
    };

    return(
        <>
        <SLabel>使用技</SLabel>
        <SSelect name="move" value={my_move.id} onChange={event=>handleMoveChange(event.target.value)}><MoveOptions array={move_array.current}/></SSelect>
        </>
    );
};

const SLabel = styled.label`
    margin:20px;
    @media(max-width:768px){
        font-size:12px;
        font-weight:normal; 
        color:#808080;
        margin:5px 0;
    }
`

const SSelect = styled.select`
    text-align:center;

    @media(max-width:768px){
        font-size:15px
    }
`