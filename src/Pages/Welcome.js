import React, { useEffect, useState } from 'react'
import Manager from '../Components/GameManager';
import { NewGameData } from '../Components/GameManager';
import { useLocation, useNavigate } from 'react-router-dom';

import './Welcome.css';

function Welcome() {
   
    const [loadedData, setLoadedData] = useState( JSON.parse( localStorage.getItem("GameData") ) )
    const [PlayerName, setPlayerName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    var firstTime = loadedData == null;

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

        , [loadedData,PlayerName,navigate,location,firstTime]);


        const Continue = () => {
            NewGameData.Player.name = PlayerName;
            localStorage.setItem("GameData", JSON.stringify(NewGameData));
            setLoadedData( NewGameData );
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