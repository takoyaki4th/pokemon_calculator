import { FC, useState } from "react";
import {startTimer,stopTimer,resetTimer} from "../utils/timer"
import styled from "styled-components";
import { white_box } from "../styles/styles";

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
        <SDiv>
            <StartStopButton type="button" onClick={handleOnStartStop}><SSpan>{elapsedTime}</SSpan>{isStart ? 'Start': 'Stop' }</StartStopButton>
            <SButton type="button" onClick={ () => setElapsedTime(resetTimer())}>Reset</SButton>
        </SDiv>
    )
}

const SSpan=styled.span`
    font-size:30px;
`

const SDiv=styled.div`
    position:relative;
`
const SButton=styled.button`
    position:absolute;
    top:50%;
    left:-5px;
    transform:translate(-100%,-50%);
    ${white_box}
`

const StartStopButton=styled.button`
    font-size: 18px;
    width: 60vw;
    display:flex;
    flex-direction:column;
    ${white_box}
`