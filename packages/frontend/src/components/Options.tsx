import { memo } from "react";

//オプションコンポーネント
const Options:React.FC<{array:string[]}> = memo(({array}) =>{
    const option_list = array.map((item)=>{
        return <option key={item} value={item}>{item}</option>
    });
    return <>{option_list}</>;
});

export default Options;
