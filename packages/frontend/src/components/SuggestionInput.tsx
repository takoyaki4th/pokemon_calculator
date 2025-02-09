import { useState,FC, memo, useContext, useEffect, useRef} from "react";
import { MyDexNumberContext,EnemyDexNumberContext} from "./providers/DexNumberProvider";
import { MyOrEnemey } from "../types/MyOrEnemy";
import { id_text } from "../types/id_text";
import poke_list from "../data/sv_poke_list.json"
import styled from "styled-components";

const SuggestionInput:FC<{mode:MyOrEnemey}> = memo(({mode})=>{
    const {dex_number,setDexNumber}=useContext((mode==="my" ? MyDexNumberContext:EnemyDexNumberContext));
    const options = useRef<Array<id_text>>(poke_list.data);
    const [text, setText] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Array<id_text>>(poke_list.data);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        let current_pokemon=options.current.find((option)=>{
            return dex_number===option.id;
        }); 
        setText(current_pokemon ? current_pokemon.name : "");

    },[]);

    const [isFocus, setIsFocus] = useState(false); 
    const hasClick = useRef(false);

    const handleInputChange = (text:string) => {
        let matches:Array<id_text> = [];
        if (text.length > 0) {
            matches = options.current.filter((opt) => {
                const regex = new RegExp(`${text}`, "gi");
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
            return dex_number===option.id;
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

    const handleLiClick = (suggestion:id_text)=>{
        setDexNumber(suggestion.id);
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
                    inputRef.current?.select();
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
    text-align:center;
    width:80%;
`

const SUl = styled.ul`
    width: 100%;
    height: 200px;
    position: absolute;
    top: 100%;
    left: 0;
    z-index:1;
    list-style-type: none;
    padding: 0;
    margin:0;
    background-color: #F1F1F1;
    border: #707070 solid 1px;
    overflow: auto;
`

const SLi = styled.li`
    padding:4px;

    &:hover{
        background-color: blue;
        color: white;
        cursor: default;
    }
`

export default SuggestionInput;