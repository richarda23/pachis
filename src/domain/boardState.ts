import { Board } from "./board";
import { Colour } from "./player";

type Positions = Record<Colour, number[]>

export class BoardState {
    _previousMoves = new Array<Positions>();
    _board: Board;
    // -1 = base, 75 = home
    _positions: Positions = {
        "yellow": [-1, -1, -1, -1],
        "blue": [-1, -1, -1, -1],
        "red": [-1, -1, -1, -1],
        "green": [-1, -1, -1, -1],
    }

    constructor(numPlayers: number, board: Board) {
        this._board = board
    }

    // get a copy of current state
    get currentState(): Positions {
        return {
            "yellow": [...this._positions.yellow],
            "blue": [...this._positions.blue],
            "red": [...this._positions.red],
            "green": [...this._positions.green],
        }
    }

    makeMove(player: Colour, from: number, to: number) {
        if (!this.isValidMove(player, from, to)) {
            throw new Error(`invalid move!!! ${player} from ${from} to ${to} `)
        }
        this._previousMoves.push(this.currentState);
        const counterToMove = this._positions[player].findIndex(pos => pos === from);
        this._positions[player][counterToMove] = to;

    }

    isValidMove(player: Colour, from: number, to: number): boolean {
        // assertions

        const currState = this.currentState;
        if (to <= from) {
            throw new Error(`Can only move max of 6 but was ${from} to ${to} `);
        }
        if (!
            currState[player].some(pos => pos === from)) {
            throw new Error(`Moving from invalid position ${from} but counters are at ${currState[player].join(",")} `);
        }
        // if we have thrown a 5, and we have any counters still at base, we can only move to start position, 
        if (currState[player].find(pos => pos === -1)) {
            const boardStart = this._board.startPosition(player);
            if (from != -1) {
                return false;
            }
            if (to != boardStart) {
                return false;
            }

            if (currState[player].filter(pos => pos === boardStart).length == 2) {
                return false;
            }
            return true;
        }
        return true;
    }

}