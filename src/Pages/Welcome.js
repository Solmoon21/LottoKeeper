import React, { useEffect, useState } from 'react'
import Manager from '../Components/GameManager';
import { NewGameData } from '../Components/GameManager';
import { useLocation, useNavigate } from 'react-router-dom';

import './Welcome.css';

function Welcome() {
    var loadedData = JSON.parse( localStorage.getItem("GameData") ) ;
    var firstTime = loadedData == null;

    const [PlayerName, setPlayerName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

        useEffect(
            () => {
                setTimeout(
                    () => {
                        if(!firstTime){
                            Manager.GameData = loadedData;
                            navigate( location.state.Mode === 'Player' ? '/player' : '/operator' )
                        }
                    }
                , 3_000)
            }

        , [loadedData]);


        const Continue = () => {
            NewGameData.Player.name = PlayerName;
            localStorage.setItem("GameData", JSON.stringify(NewGameData));
            navigate('/welcome', {
                state : {
                    Mode : location.state.Mode
                }
            }  );
        }

  return (
    <div className='parent'> 
        {firstTime ?
            (
                <div className='child'>
                    <input type='text' placeholder='Player Name' onChange={e => setPlayerName(e.target.value) }/>
                    <button onClick={Continue}>Continue</button>
                </div>
            ) : 
            (
                <div className='child'>
                    Welcome {location.state.Mode === 'Player' ?  loadedData.Player.name : 'Admin' }
                </div>
            )
        }
        
    </div>
  )
}

export default Welcome