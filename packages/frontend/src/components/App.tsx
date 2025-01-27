import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PokeDex from "./PokeDex";
import Calculator from "./Calculator";

export const App = () => {
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator/>}></Route>
        <Route path="/poke-dex" element={<PokeDex />}></Route>
      </Routes>
    </Router>
  );
};