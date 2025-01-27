import { useState,useEffect, useCallback, memo } from "react";
import { Species } from "../types/Species";
import { wrapGet } from "../utils/functions";

const PokeDex = memo(() => {
    const [imageurl, setImageUrl] = useState<string>("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png");
    const [DexNumber,setDexNumber] = useState<number>(1);
    const [specie, setSpecie] = useState<Species>({
        DexNumber: 0,
        name: "ポケモンが設定されていません",
        HP: 0,
        Attack: 0,
        Defense: 0,
        sAttack: 0,
        sDefense: 0,
        Speed: 0,
        type1:"ノーマル",
        type2:null
    });

    useEffect(() => {
    const GetSpecie = async () => {
        const response=await wrapGet<Species>(`/api/Species/${DexNumber}`);
        setSpecie(response);
        setImageUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${DexNumber}.png`);
    }
    GetSpecie();
    }, [DexNumber]);

    //0以上,または図鑑の最大値を超えたときの処理を追記する 
    const handleOnPrev = useCallback(()=>{
        setDexNumber((prevDexNumber) => prevDexNumber - 1);
    },[]);

    const handleOnNext = useCallback(()=>{
        setDexNumber((prevDexNumber) => prevDexNumber + 1);
    },[]);

    return(
        <div className="container">
            <p>No.{specie.DexNumber}</p>
            <h1>{specie.name}</h1>
            <img src={imageurl} alt={specie.name} />
            <div>
                <span>HP:{specie.HP}</span>
                <span>攻撃:{specie.Attack}</span>
                <span>防御:{specie.Defense}</span>
                <span>特攻:{specie.sDefense}</span>
                <span>特防:{specie.sAttack}</span>
                <span>速さ:{specie.Speed}</span>
                <span>タイプ:{specie.type1},{specie.type2}</span>
            </div>
            <div>
                <button onClick={handleOnPrev}>Prev-page</button>
                <button onClick={handleOnNext}>Next-page</button>
            </div> 
        </div>
    );
});

export default PokeDex;