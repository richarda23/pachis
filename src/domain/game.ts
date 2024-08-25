import { Board } from "./board";
import { BoardState } from "./boardState";

export class Game {

    _numPlayers = 4;
    _boardDef: Board;
    private _boardState: BoardState;

    constructor(numPlayers: number = 4) {
        this._numPlayers = numPlayers;
        this._boardDef = new Board();
        this._boardState = new BoardState(numPlayers, this._boardDef);
    }
}