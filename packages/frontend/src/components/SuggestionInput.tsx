import { useState,FC, memo, useContext, useEffect, useRef} from "react";
import { MySpecieContext,EnemySpecieContext} from "./providers/SpecieProvider";
import { MyOrEnemey } from "../types/MyOrEnemy";
import { id_name } from "../types/id_text";
import poke_list from "../data/sv_poke_list.json"
import styled from "styled-components";
import { wrapGet } from "../utils/functions";
import { Move, Species } from "../types/Species";
import axios from "axios";
import { MyMoveContext } from "./providers/MoveProvider";
import { convertRomanToKana } from "../utils/roma_to_katakana";

const SuggestionInput:FC<{mode:MyOrEnemey}> = memo(({mode})=>{
    const {specie,setSpecie}=useContext((mode==="my" ? MySpecieContext:EnemySpecieContext));
    const {setMyMove,move_array} = useContext(MyMoveContext);

    const options = useRef<Array<id_name>>(poke_list.data);
    const [text, setText] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Array<id_name>>(poke_list.data);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        let current_pokemon=options.current.find((option)=>{
            return specie.DexNumber===option.id;
        }); 
        setText(current_pokemon ? current_pokemon.name : "");
    },[]);

    const [isFocus, setIsFocus] = useState(false); 
    const hasClick = useRef(false);

    const handleInputChange = (text:string) => {
        let matches:Array<id_name> = [];
        if (text.length > 0) {
            matches = options.current.filter((opt) => {
                let to_katakana_text = text.replace(/[\u3041-\u3096]/g, (match) => 
                    String.fromCharCode(match.charCodeAt(0) + 0x60)
                );
                to_katakana_text = convertRomanToKana(to_katakana_text);
                const regex = new RegExp(`${to_katakana_text}`, "gi");
                return opt.name.match(regex);
            });
            setSuggestions(matches);
        }else{
            setSuggestions(options.current);
        }
        setText(text);
    };

    const handleInputBlur = ()=>{
        let current_pokemon=options.current.find((option)=>{
            return specie.DexNumber===option.id;
        }); 
        setText(current_pokemon ? current_pokemon.name : "")
        setIsFocus(false);
    };

    const handleLiMouseDown = ()=>{
        hasClick.current=true;
        const listener = () =>{
            hasClick.current=false;
            document.removeEventListener('mouseup',listener,true);
        };
        document.addEventListener('mouseup',listener,true);
    };

    const handleLiClick = (suggestion:id_name)=>{
        const get_specie = async()=> {
            const res_specie = await wrapGet<Species>(`/api/Species/${suggestion.id}`);
            setSpecie(res_specie);
            if(mode==="my"){
                try {
                    const res_moves = await axios<Array<id_name>>(`api/moveLearnMap/dex_number/${suggestion.id}`);
                    const res_array = res_moves.data.map(({id,name})=> ({id,name}));
                    move_array.current = res_array;
                    const res_move = await wrapGet<Move>(`api/moves/id/${res_array[0].id}`);
                    setMyMove(res_move);
                } catch (error) {
                    console.log(error); 
                }
            }
        }
        get_specie();
        setText(suggestion.name);
        setIsFocus(false);
        hasClick.current=false;
    };

    return(
        <>
        <SDiv>
            <SInput
                ref={inputRef}
                type="text" value={text}
                onFocus={() => {
                    setIsFocus(true);
                    setText("");
                    setSuggestions(options.current);
                }} 
                onBlur={handleInputBlur}  
                onChange={(e) => handleInputChange(e.target.value)}
            />
            {(isFocus || hasClick.current) && (
                <SUl>
                    {suggestions.map((suggestion,i) => (
                        <SLi key={suggestion.id} onMouseDown={handleLiMouseDown} onClick={()=>handleLiClick(suggestion)}>
                            {suggestion.name}
                        </SLi>
                    ))}
                </SUl>
            )}
        </SDiv>
        </>
    );
});

const SDiv = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    position: relative;
    top:0;
    left:0;
`
const SInput = styled.input`
    width:80%;
`

const SUl = styled.ul`
    width: calc(80% - 16px);
    height: 250px;
    position: absolute;
    top: 100%;
    left: 10%;
    z-index:1;
    list-style-type: none;
    padding: 0 8px;
    margin:0;
    background-color: #F1F1F1;
    border: #707070 solid 1px;
    overflow: auto;
    border-radius:5px;
    font-size:18px;

    @media(max-width:768px){
        top:-1px;
        left:0;
        transform:translateY(-100%);
        width: calc(100% - 16px);
    }
`

const SLi = styled.li`
    padding:4px;

    @media(min-width:768px){
        &:hover{
            background-color: blue;
            color: white;
            cursor: default;
        }
    }
`

export default SuggestionInput;