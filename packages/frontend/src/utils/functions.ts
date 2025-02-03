import axios,{AxiosResponse} from 'axios';
import { EffortRange, IndividualRange, LevelRange } from '../types/Pokemon';
import { useContext } from 'react'; 
import { EnemyPokeFormContext, MyPokeFormContext } from '../components/providers/GlobalState';
import { MyOrEnemey } from '../types/MyOrEnemy';

export async function wrapGet<T>(url:string):Promise<T>{
    try {
        const response:AxiosResponse<Array<T>> = await axios.get(url);
        if(response.data[0]===undefined){
          throw Error("取得データがundefinedでした");
        }
        return response.data[0];
    } catch (error) {
        if(axios.isAxiosError(error)){
            console.error("Axios Error:",error.message);
        }else{
            console.error("Error",error); 
        }
        throw error;
    }
}

/*
export async function Post(url:string, sendedData:object, func:function) {
  try {
    const options = {
      method: 'POST',
      headers: {},
      data: sendedData ? sendedData : null,
    };

    if (sendedData) {
      options.headers['Content-Type'] = 'application/json';
    }

    const response = await axios(url, options);
    func(response.data);

  } catch (error) {
    console.error("Error:", error);
  }
}
*/

export const isLevelRange = (value:number): value is LevelRange =>{
  return value>=1 && value <= 100;
}

export const isIndividualRange = (value:number): value is IndividualRange =>{
  return value >=0 && value <= 31;
}

export const isEffortRange = (value:number):value is EffortRange =>{
  return value >=0 && value <= 252;
}

//型判定やらなんやらなんもされてないから要注意
export const statsToJa = (stat:string):string=>{
  let str;
  switch (stat){
    case "hp":
      str="HP";
      break;
    case "attack":
      str="攻撃";
      break;
    case "defense":
      str="防御";
      break;
    case "s_attack":
      str="特攻";
      break;
    case "s_defense":
      str="特防";
      break;
    case "speed":
      str="素早さ";
      break;
    default:
      str = "name属性がおかしいです";
  } 
  return str;
}