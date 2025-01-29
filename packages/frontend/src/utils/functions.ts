import axios,{AxiosResponse} from 'axios';
import { IntRange } from '../types/IntRange';
import { EffortRange, EffortValue, IndividualRange, LevelRange } from '../types/Pokemon';

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
  value = Math.floor(value);
  return value>=1 && value <= 100;
}

export const isIndividualRange = (value:number): value is IndividualRange =>{
  value = Math.floor(value);
  return value >=0 && value <= 31;
}

export const isEffortRange = (value:number):value is EffortRange =>{
  value = Math.floor(value);
  return value >=0 && value <= 252;
}