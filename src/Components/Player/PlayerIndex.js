import React, { useRef, useState } from 'react'
import Manager, { PrizePerHit } from '../GameManager';
import { GameStates } from '../GameManager';
import { useNavigate } from 'react-router-dom';

import * as Util from '../../Utils/Utils'

import './PlayerIndex.css'

const defaultGuesses = ['1','2','3','4','5'];

function PlayerIndex() {
    const [numberOfGames, setNumberOfGames] = useState(0)
    const [generatedNumbers, setGeneratedNumbers] = useState([]);
    const [guesses, setGuesses] = useState(defaultGuesses);
    const [view, setView] = useState(false);
    const [pastGames, setPastGames] = useState([]);
    const [isSorted, setIsSorted] = useState(false);
    const inputBoxRef = useRef(null);

    const navigate = useNavigate();

    const CreateNumbers = () => {
        var randomNumbers = [];
        for(let i=0; i<5; i++){
            randomNumbers.push(Math.floor( Math.random() * ( 39 ) + 1 ));
        }        
        setGeneratedNumbers(randomNumbers);
        console.log(randomNumbers);
    }

    const StartRound = () => {

        if(numberOfGames == 0){
            Manager.save();
            Manager.CurrentGameState = GameStates.LOBBY;
            setView(false);
            navigate('/player');
            return;
        }

        Manager.CurrentGameState = GameStates.PLAYING;
        CreateNumbers();
        setGuesses(defaultGuesses);
    }

    const PrepareGame = () => {
        const couponPrice = numberOfGames * 500;
        if(Manager.GameData.Player.balance < couponPrice){
            inputBoxRef.current.classList.add('error');
           
            setTimeout(
                () => {
                    inputBoxRef.current.classList.remove('error');
                }
            , 500)
            return;
        }
        Manager.GameData.Player.balance -= couponPrice;
        Manager.GameData.Operator.balance += couponPrice;

        Manager.save();
        StartRound();
    }

    const handleGuessChange = (x, value) => {
        

        const regex = /^(?:[1-9]|[1-3][0-9])$/
        
        if(value.length && !regex.test(value)) return;

        var temp = []
        guesses.map(  
           (value,index) => temp[index] = value
        );
        temp[x] = value;
        setGuesses(temp);

    }

    const FinishRound = () => {
        let voucher = Util.Voucher( guesses.map(value => Number(value)), generatedNumbers )

        let prizeMoney = voucher.Matches * PrizePerHit;
        Manager.GameData.Operator.balance -= prizeMoney;
        Manager.GameData.Player.balance += prizeMoney;

        var coupon = {
            Generated : generatedNumbers,
            Guess : guesses.map(value => Number(value)),
            ByPlayer : true
        };

        Manager.GameData.History.push(coupon);
        Manager.CurrentGameState = GameStates.FINISH;

        Manager.save();

        setNumberOfGames(prev => prev - 1)
        
    }

    const View = () => {
        const PlayerOnly = Manager.GameData.History.filter(
            coupon => coupon.ByPlayer
        );
        setPastGames(PlayerOnly);
        setView(!view);
    }

    const sortViaMatch = () => {
        setIsSorted(!isSorted);
        if(isSorted){
            View();
            setView(true);
        }
        else{
            const sorted = [...pastGames].sort(
                (a,b) => {
                    let matchA = Util.Voucher(a.Generated, a.Guess).Matches;
                    let matchB = Util.Voucher(b.Generated, b.Guess).Matches;
                    return matchA - matchB;
                }
            )
            setPastGames(sorted);
        }
    }

    return (
        <div className='parent' >
            {Manager.CurrentGameState == GameStates.LOBBY &&
                <div>
                    <div className='childP'>
                        <h1>Username : {Manager.GameData.Player.name}</h1>
                        <h1>Balance : {Manager.GameData.Player.balance}</h1>
                        <input ref={inputBoxRef} type='number' placeholder='Number of Games' onChange={e => setNumberOfGames(e.target.value)} />
                        <button onClick={PrepareGame}>Play</button>
                        <button onClick={View}>
                            {view? 'Close History' : 'View History'}
                        </button>
                    
                    
                    {view && 
                        <>
                        <h2>History</h2>
                        <table>
                            <thead>
                                <th>No.</th>
                                <th onClick={()=> sortViaMatch() } >Number of Matches</th>
                                <th>Prize</th>
                            </thead>
                            <tbody>
                                {pastGames.map( (game, index) => {
                                        let voucher = Util.Voucher(game.Generated, game.Guess);
                                        return (
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{voucher.Matches}</td>
                                                <td>{voucher.Prize}</td>
                                            </tr>
                                        )
                                    }
                                    )}
                            </tbody>
                        </table>
                        </>
                    }
                    </div>
                    
                </div>
            }
            {Manager.CurrentGameState == GameStates.PLAYING && numberOfGames > 0 &&
                <div className='childP'>
                    <h2>Pick Your Numbers</h2>
                    {[0,1,2,3,4].map( 
                        x => {
                            return (
                                <input type='text' key={x} value={guesses[x]} onChange={(e) => handleGuessChange(x,e.target.value) }   />
                            )
                        }
                    )}
                    <button onClick={FinishRound}>Finish</button>
                </div>
            }
            {Manager.CurrentGameState == GameStates.FINISH && 
                <div className='childP'>
                    <h1>Your Guess : {guesses.toString()}</h1>
                    <h1>Actual : {generatedNumbers.toString()}</h1>
                    <button onClick={StartRound}>Continue</button>
                </div>
            }
            
        </div>
    );
}

export default PlayerIndex;