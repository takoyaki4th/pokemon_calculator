import axios,{AxiosResponse} from 'axios';

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