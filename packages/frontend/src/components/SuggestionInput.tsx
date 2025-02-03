import { useState,FC, memo, useContext, useEffect, useRef} from "react";
import { MyDexNumberContext,EnemyDexNumberContext} from "./providers/DexNumberProvider";
import { MyOrEnemey } from "../types/MyOrEnemy";
import { id_text } from "../types/id_text";
import poke_list from "../data/sv_poke_list.json"

const SuggestionInput:FC<{mode:MyOrEnemey}> = memo(({mode})=>{
    const {dex_number,setDexNumber}=useContext((mode==="my" ? MyDexNumberContext:EnemyDexNumberContext));
    const options = useRef<Array<id_text>>(poke_list.data);
    const [text, setText] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Array<id_text>>(poke_list.data);
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
        <label>ポケモン</label>
        <div className="suggestion-input">
        <input
            type="text" value={text}
            onFocus={() => setIsFocus(true)} 
            onBlur={handleInputBlur}  
            onChange={(e) => handleInputChange(e.target.value)}
        />
        {(isFocus || hasClick.current) && (
            <ul>
                {suggestions.map((suggestion,i) => (
                    <li key={suggestion.id} onMouseDown={handleLiMouseDown} onClick={()=>handleLiClick(suggestion)}>
                        {suggestion.name}
                    </li>
                ))}
            </ul>
        )}
        </div>
        </>
    );
});

export default SuggestionInput;