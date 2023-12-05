export const GameStates = {
    LOBBY : 1, // ask number of sections
    PLAYING : 2,
    FINISH : 3
}

export const PrizePerHit = 5;

export var NewGameData = {
    Operator : { balance : 0 },
    Player : {
        name : '',
        balance : 10_000
    },
    History : []
}


class GameManager {
    constructor() {
        this._currentGameState = GameStates.LOBBY
        this._gameData = null;
    }

    get CurrentGameState() {
        return this._currentGameState;
    }

    set CurrentGameState(newState){
        this._currentGameState = newState;
    }

    get GameData() {
        return this._gameData;
    }

    set GameData(newData) {
        this._gameData = newData;
    }

    save() {
        localStorage.setItem("GameData", JSON.stringify(this._gameData));    
    }

}

var Manager = new GameManager(); 
export default Manager;