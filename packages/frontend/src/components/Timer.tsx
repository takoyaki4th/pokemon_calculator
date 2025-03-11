import { FC, useState } from "react";
import {startTimer,stopTimer,resetTimer} from "../utils/timer"
import styled from "styled-components";

export const Timer:FC=()=>{
    const [isStart,setIsStart] = useState(true);
    const [elapsedTime,setElapsedTime]=useState("00:00:00:00"); 

    const handleOnStartStop = () =>{
        if(isStart){
            setIsStart(false);
            startTimer(setElapsedTime);
        }else{
            setIsStart(true);
            stopTimer();
        }
    };

    return (
        <>
            <StartStopButton type="button" onClick={handleOnStartStop}><p id="Timer">{elapsedTime}</p>{isStart ? 'Start': 'Stop' }</StartStopButton>
            <button type="button" onClick={ () => setElapsedTime(resetTimer())}>取消</button>
        </>
    )
}

const StartStopButton=styled.button`
    font-size: 30px;
    width: 45%;
`