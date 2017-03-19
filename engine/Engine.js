var spawn = require('child_process').spawn;
const {fourComputers} = require('../server/sockets/data');
const {ab2str} = require('../server/utils/utils');


module.exports = class Engine {

    constructor(path, roomName, socket) {
        this.roomName = roomName;
        this.socket = socket;
        this.engine = spawn(path);
        this.engine.stdout.on('data', this.onBestMove.bind(this));
        this.numOut = 0;
        this.mode = 0;
        this.sendUci();
    }

    onBestMove(data) {
    }
    
    setMode(mode) {
        this.mode = mode;
    }

    colorToTurnNumber(color) {
        if (!color)
            return '0';
        color = color.charAt(0);
        let turn;
        switch(color) {
            case 'w':
                turn = '0';
                break;
            case 'b':
                turn = '1';
                break;
            case 'g':
                turn = '2';
                break;
            case 'r':
                turn = '3';
                break;
            default:
                turn = '0';
        }
        return turn;
    }

    setPosition(fen) { }

    setTurn(turnColor) { }

    setOut(colorOut) { }

    setDepth(depth) {
        this.depth = depth;
    }
    
    sendUci() {
        this.engine.stdin.write("uci\n");
    }
    
    setOption(name, value) {
        this.engine.stdin.write(
            "setoption name " + name + " value " + value + "\n"
        );
    }
    

    adjustDepth(timeLeft) { }

    go(timeLeft) {
        let depth = this.depth;
        if (timeLeft) {
            depth = this.adjustDepth(timeLeft);
        }
        this.timeLeft = timeLeft;
        console.log("engine go depth", depth, "timeLeft", timeLeft);
        if(this.mode == 0) {
            this.engine.stdin.write("go depth " + depth + "\n");
        } else {
            this.engine.stdin.write("go depth 4\n");
        }
        
    }

    kill() {
        console.log("killing engine", this.roomName);
        this.engine.stdin.pause();
        this.engine.kill();
    }
}