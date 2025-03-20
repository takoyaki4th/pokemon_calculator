import { Dispatch, SetStateAction } from "react";

let elapsedTime=0;
let timerInterval:NodeJS.Timer;

export function timeToString(time:number , mode:string=":") {
  const diffInHrs = time / 3600000;
  const hh = Math.floor(diffInHrs);

  const diffInMin = (diffInHrs - hh) * 60;
  const mm = Math.floor(diffInMin);

  const diffInSec = (diffInMin - mm) * 60;
  const ss = Math.floor(diffInSec);

  const diffInMs = (diffInSec - ss) * 100;
  const ms = Math.floor(diffInMs);

  const formattedHH = hh.toString().padStart(2, "0");
  const formattedMM = mm.toString().padStart(2, "0");
  const formattedSS = ss.toString().padStart(2, "0");
  const formattedMS = ms.toString().padStart(2, "0");
  if(mode === "ja"){
      return `${formattedHH}時間${formattedMM}分${formattedSS}.${formattedMS}秒`;
  }else{
      return `${formattedHH}:${formattedMM}:${formattedSS}:${formattedMS}`;
  }
}

export function getElapsedTime(){
  return elapsedTime;
}

export function startTimer(setElapsedTime:Dispatch<SetStateAction<string>>,) {
  const startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      setElapsedTime(timeToString(elapsedTime));
  }, 10);
}

export function stopTimer() {
  clearInterval(timerInterval);
}

export function resetTimer() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  return timeToString(elapsedTime);
}
