import axios,{AxiosResponse} from 'axios';

/*
export async function Get<T>(url:string):Promise<T>{
    try {
        const response:AxiosResponse<T> = await axios.get(url);
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            console.error("Axios Error:",error.message);
        }else{
            console.error("Error",error); 
        }
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