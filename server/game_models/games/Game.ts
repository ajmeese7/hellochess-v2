const Notifications = require('react-notification-system-redux');
import Player from '../players/Player';
import Engine from '../../engine/Engine';
import AI from '../players/AI';
import Connection from '../../sockets/Connection';
import Room from '../rooms/Room';

abstract class Game {
    public static COLOR_SHORT_TO_LONG: any =
        {
            'w': 'white',
            'b': 'black',
            'r': 'red',
            'g': 'gold'
        };
    public static COLOR_LONG_TO_SHORT: any =
        {
            'white': 'w',
            'black': 'b',
            'red': 'r',
            'gold': 'g'
        };
    public white: Player = null;
    public black: Player = null;
    public gold: Player = null;
    public red: Player = null;
    engineInstance: Engine;
    io: any;
    numPlayers: number;
    gameType: string;
    gameRulesObj: any;
    times: any;
    _lastMove: any;
    _lastMoveTime: any;
    _lastTurn: string = 'b';
    _currentTurn: string;
    gameStarted: boolean = false;
    roomName: string;
    room: Room;
    time: any;
    connection: Connection;
    moveHistory: any[] = [];
    
    abstract addPlayer(player: Player, color: string): boolean;
    abstract removePlayer(color: string): boolean;
    abstract getGame(): any;
    abstract gameReady(): boolean;
    abstract outColor(): string;
    abstract newEngineInstance(roomName: string, io: any): void;
    abstract startGame(): any;
    abstract endAndSaveGame(draw) : boolean;
    abstract setPlayerResignByPlayerObj(player: Player);
    abstract removePlayerFromAllSeats(player: Player);
    abstract setPlayerOutByColor(color: string);
    
    setColorTime(color: string, time: number): void {
        this.times[color] = time;
    }
    
    get lastMoveTime() {
        return this._lastMoveTime;
    }
    
    set lastMoveTime(time) {
        this._lastMoveTime = time;
    }
    
    get lastMove() {
        return this._lastMove;
    }
    
    set lastMove(move) {
        this._lastMove = move;
    }
    
    removeColorTime(color: string): void {
        this.times[color] = 0;
    }
    
    getColorTime(color: string): number {
        return this.times[color];
    }
    
    getCurrentTimes() {
        let times = {...this.times};
        if (this.lastMoveTime) {
            let currentTurn = this.gameRulesObj.turn();
            let currentTime = times[currentTurn];
            let timeElapsed = Date.now() - this.lastMoveTime;
            let updatedTime = currentTime - timeElapsed;
            times[this.gameRulesObj.turn()] = updatedTime;
        }
        return times;
    }
    
    get fen(): string {
        return this.gameRulesObj.fen();
    }
    
    get lastTurn(): string {
        return this._lastTurn;
    }
    
    get currentTurn(): string {
        return this._currentTurn;
    }
    
    getTurn(): string {
        return this.gameRulesObj.turn();
    }
    
    setNextTurn(): void {
        this.gameRulesObj.nextTurn();
    }
    
    prevPlayerTime(): number {
        return this.times[this.lastTurn];
    }
    
    gameOver(): boolean {
        return this.gameRulesObj.game_over() || !this.white.alive || !this.black.alive;
    }
    
    getPlayer(playerColor: string) : Player {
        switch(playerColor) {
            case 'w':
                return this.white;
            case 'b':
                return this.black;
            case 'g':
                return this.gold;
            case 'r':
                return this.red;
        }
    }
    
    engineGo() {
        this.engineInstance.setPosition(this.gameRulesObj.fen());
        this.engineInstance.setTurn(this.gameRulesObj.turn());
        let playerTimeLeft = this.currentTurnTime();
        let currentPlayer = this.currentTurnPlayer();
        if(!currentPlayer) {
            return;
        }
        if(playerTimeLeft && currentPlayer.playerLevel) {
            this.engineInstance.go(playerTimeLeft, currentPlayer.playerLevel);
        }
    }
    
    killEngineInstance() {
        if(this.engineInstance) {
            this.engineInstance.kill();
        }
    }
    
    currentTurnPlayer(): Player {
        switch (this.gameRulesObj.turn()) {
            case 'w':
                return this.white;
            case 'b':
                return this.black;
            case 'g':
                return this.gold;
            case 'r':
                return this.red;
            default:
                return null;
        }
    }
    
    currentTurnTime() {
        return this.times[this.gameRulesObj.turn()];
    }
    
    makeMove(move: any, increment: number, moveTime: number): void {
        this._lastTurn = this.gameRulesObj.turn();
        let validMove = this.gameRulesObj.move(move);
        
        //set the last move made
        this._lastMove = move;
        
        if(validMove == null) {
            return;
        }
        
        // save the move to move history
        validMove.fen = this.gameRulesObj.fen();
        this.moveHistory.push(validMove);
        
        // calculate the lag between the time the player moved
        // and the time the server received the move
        let lag = Date.now() - moveTime;
        lag = Math.max(0, lag);
        lag = Math.min(lag, 1000);
        // calculate the time difference between the last move.
        // subtract any lag up to 1 second.
        let timeElapsed = Date.now() - this.lastMoveTime - lag;
        this.lastMoveTime = moveTime;
        
        //calculate the time increment and add it to the current players time
        let timeIncrement = increment * 1000;
        this.setColorTime(this._lastTurn, this.times[this._lastTurn] - timeElapsed + timeIncrement);
        
        //check to see if the game is over
        if (this.gameRulesObj.game_over()) {
            
            if (this.gameRulesObj.in_draw()) {
                
                this.endAndSaveGame(true);
                
            } else {
                this.setPlayerOutByColor(this.gameRulesObj.turn())
                this.endAndSaveGame(false);
            }
            
            return;
        }
        
        this._currentTurn = this.gameRulesObj.turn();
        // if the next player is an AI, start the engine
        if (this.currentTurnPlayer() instanceof AI) {
            setTimeout(() => this.engineGo(), 100); // add a small delay between AI's moving
        }
    }
    
    removePlayerByPlayerId(playerId: string) {
        if(this.white && playerId == this.white.playerId) {
            this.white = null;
        } else if(this.black && playerId == this.black.playerId) {
            this.black = null;
        } else if(this.gold && playerId == this.gold.playerId) {
            this.gold = null;
        } else if(this.red && playerId == this.red.playerId) {
            this.red = null;
        }
    }
    
    getMoveHistory() {
        return this.moveHistory;
    }
    
    abort() {
        if(this.engineInstance && typeof this.engineInstance.kill == 'function') {
            this.engineInstance.kill(); //stop any active engine
        }
        this.gameStarted = false;
        this.white = null;
        this.black = null;
        this.gold = null;
        this.red = null;
        let room: Room = this.connection.getRoomByName(this.roomName);
        
        if(!room) {
            return;
        }
        this.io.to(this.roomName).emit('update-room', room.getRoom());
    }
    
}

export default Game;