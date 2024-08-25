import { Board } from "./board";
import { Colour } from "./player";

type Positions = Record<Colour, number[]>

export class BoardState {
    _previousMoves = new Array<BoardState>();
    _board: Board;
    // -1 = base, 75 = home
    _y: number[] = [-1, -1, -1, -1];
    _b: number[] = [-1, -1, -1, -1];
    _r: number[] = [-1, -1, -1, -1];
    _g: number[] = [-1, -1, -1, -1];

    constructor(numPlayers: number, board: Board) {
        this._board = board
    }

    // get a copy of current state
    get currentState(): Positions {
        return {
            "yellow": [...this._y],
            "blue": [...this._b],
            "red": [...this._r],
            "green": [...this._g],
        }
    }

    makeMove(player: Colour, from: number, to: number) {

    }

    isValidMove(player: Colour, from: number, to: number): boolean {
        // assertions
        if (to <= from || to - from > 6) {
            throw new Error(`Can only move max of 6 but was ${from} to ${to} `);
        }
        if (!this.currentState[player].some(pos => pos === from)) {
            throw new Error(`Moving from invalid position ${from} but counters are at ${this.currentState[player].join(",")} `);
        }
        // if we have thrown a 5, and we have someone home, we can only move to start
        if (to - from === 5 && this.currentState[player].find(pos => pos === -1)) {

        }

        return true;
    }

}