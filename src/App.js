import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import PlayerIndex from "./Components/Player/PlayerIndex"
import Welcome from "./Pages/Welcome";
import OperatorIndex from "./Components/Operator/OperatorIndex";

import './App.css';

function App() {
    const navigate = useNavigate();

    return(
        <>
            <div className="Nav-Button-Container">
                
                <button onClick={ () => navigate('/welcome', {
                    state : {
                        Mode : 'Player',
                    }
                }) } >Player</button>

                <button onClick={ () => navigate('/welcome', {
                    state : {
                        Mode : 'Operator',
                    }
                }) } >Operator</button>

            </div>
        
            <div className="Content-Box">

                <Routes>
                    <Route path="/player" element={ <PlayerIndex/> } />
                    <Route path="/welcome" element={ <Welcome/> } />
                    <Route path="/operator" element={ <OperatorIndex/> } />
                </Routes>
            
            </div>
        </>
    );
}

export default App;
