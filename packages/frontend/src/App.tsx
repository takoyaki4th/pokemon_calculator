import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { Species } from "./types/Species";
import { my_poke,calc_damage, enemy_poke, my_move } from "./utils/calcfunc"

export const App = () => {
  const [imageurl, setImageUrl] = useState<string>("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png");
  const [DexNumber,setDexNumber] = useState<number>(1);
  const [specie, setSpecie] = useState<Species>({
    DexNumber: 1,
    name: "フシギダネ",
    HP: 20,
    Attack: 20,
    Defense: 20,
    sAttack: 20,
    sDefense: 29,
    Speed: 20
  });

  useEffect(() => {
    const GetSpecie = async () => {
      try {
        const response: AxiosResponse<Array<Species>> = await axios.get(`/api/Species/${DexNumber}`);
        setSpecie(response.data[0]);
        setImageUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${DexNumber}.png`);
        console.log(specie);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios Error:", error.message);
        } else {
          console.error("Error", error);
        }
      }
    }
    GetSpecie();
  }, [DexNumber]);

  //0以上,または図鑑の最大値を超えたときの処理を追記する 
  const handleOnPrev = ()=>{
    setDexNumber((prevDexNumber) => prevDexNumber - 1);
  };

  const handleOnNext = ()=>{
    setDexNumber((prevDexNumber) => prevDexNumber + 1);
  }

  const [min,max]=calc_damage(my_poke,enemy_poke,my_move,true)

  return (
    <div id="container">
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
      </div>
      <div>
        <button onClick={handleOnPrev}>Prev-page</button>
        <button onClick={handleOnNext}>Next-page</button>
      </div>
      <div>
        <p>{my_move.name}の△△攻撃!</p>
        <p>〇〇に最小{min},最大{max}ダメージ!</p>
      </div>
    </div>
  );
};