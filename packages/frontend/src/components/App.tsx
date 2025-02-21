import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PokeDex from "./PokeDex";
import Calculator from "./Calculator";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body{
    font-weight:bold;
    background-color:#f3f6f9;
    padding-bottom:100px;
  }

  input{
    font-size:18px;
    border-radius: 10px;
    padding:6px 2px;
    border: 1px solid lightgray;
    box-shadow:inset 1px 1px 4px rgba(0,0,0,0.3);
    text-align:center;
  }
    
  select{
    font-size:18px;
    border-radius: 10px;
    background-color:white;
    padding:5px;
    border: 1px solid lightgray;
    box-shadow:inset 1px 1px 4px rgba(0,0,0,0.3);
    text-align:center;
  }

  @media(max-width:768px){
    body{
      font-size:15px;  
      padding:0 2px 0 2px;
    }
  }  
`

export const App = () => {
 
  return (
    <>
    <Router>
      <GlobalStyle/>
      <Routes>
        <Route path="/" element={<Calculator/>}></Route>
        <Route path="/poke-dex/" element={<PokeDex />}></Route>
      </Routes>
    </Router>
    </>
  );
};