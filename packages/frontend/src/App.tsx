import axios, { AxiosResponse } from "axios";
import { wrapGet } from "./utils/functions"
import { useState, useEffect } from "react";
import { Species,Move } from "./types/Species";
import { calc_damage} from "./utils/calcfunc"
import { Pokemon } from "./types/Pokemon";

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
    Speed: 20,
    type1:"ドラゴン",
    type2:null
  });

  const [min,setMin] = useState<number>(0);
  const [max,setMax] = useState<number>(0);
  const [my_poke,setMyPoke] = useState<Pokemon>(new Pokemon("攻撃側のポケモンが設定されていません"));
  const [enemy_poke,setEnemyPoke] = useState<Pokemon>(new Pokemon("防御側のポケモンが設定されていません"));
  const [my_move,setMyMove] = useState<Move>({
    id:0,
    name:"技が設定されていません",
    damage_class:"physical",
    power:0,
    type:"ノーマル"
  });

  useEffect(() => {
    const GetSpecie = async () => {
      const response=await wrapGet<Species>(`/api/Species/${DexNumber}`);
      setSpecie(response);
      setImageUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${DexNumber}.png`);
    }
    GetSpecie();
  }, [DexNumber]);

  useEffect(() => {
    const build = async () =>{
      setMyPoke(await Pokemon.build(
        "攻撃ポケモン",
        3,
        "わんぱく",
        50,
        {attack:31,defense:31,s_attack:31,s_defense:31},
        {attack:252,defense:0,s_attack:0,s_defense:0},
      ));

      setEnemyPoke(await Pokemon.build(
        "防御ポケモン",
        151,
        "わんぱく",
        50,
        {attack:31,defense:31,s_attack:31,s_defense:31},
        {attack:252,defense:0,s_attack:252,s_defense:252},
      ));

      const response:Move = await wrapGet<Move>(`api/moves/5`);
      setMyMove(response);
   }

    build();
  },[]);

  useEffect(()=>{
      const [min_damage,max_damage]=calc_damage(my_poke,enemy_poke,my_move);
      setMin(min_damage);
      setMax(max_damage); 
  },[my_move,my_poke,enemy_poke]);
  
  //0以上,または図鑑の最大値を超えたときの処理を追記する 
  const handleOnPrev = ()=>{
    setDexNumber((prevDexNumber) => prevDexNumber - 1);
  };

  const handleOnNext = ()=>{
    setDexNumber((prevDexNumber) => prevDexNumber + 1);
  };

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
        <span>タイプ:{specie.type1},{specie.type2}</span>
      </div>
      <div>
        <button onClick={handleOnPrev}>Prev-page</button>
        <button onClick={handleOnNext}>Next-page</button>
      </div>
      <div>
        <p>{my_poke.specie.name}の{my_move.name}攻撃!</p>
        <p>{enemy_poke.specie.name}に最小{min},最大{max}ダメージ!</p>
      </div>
    </div>
  );
};