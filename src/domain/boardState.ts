import { Board } from "./board";
import { Colour } from "./player";
import { cloneDeep } from "lodash";

type Positions = Record<Colour, number[]>

const BASE = -1;
export class BoardState {
    _previousMoves = new Array<Positions>();
    _board: Board;
    // -1 = base, 75 = home
    _positions: Positions = {
        "yellow": [BASE, BASE, BASE, BASE],
        "blue": [BASE, BASE, BASE, BASE],
        "red": [BASE, BASE, BASE, BASE],
        "green": [BASE, BASE, BASE, BASE],
    }

    constructor(numPlayers: number, board: Board) {
        this._board = board
    }

    get previousMoves() {
        return this._previousMoves.map(p => cloneDeep(p));
    }
    // get a copy of current state
    get currentState(): Positions {
        return cloneDeep(this._positions)
    }
    // makes a valid move
    // asserts that the move is valid
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
            throw new Error(`invalid move: Can only move max of 6 but was ${from} to ${to} `);
        }
        if (!
            currState[player].some(pos => pos === from)) {
            throw new Error(`Moving from invalid position ${from} but counters are at ${currState[player].join(",")} `);
        }
        // if we have thrown a 5, and we have any counters still at base, we can only move to start position, 
        if (currState[player].find(pos => pos === BASE)) {
            const boardStart = this._board.startPosition(player);
            if (from != BASE) {
                return false;
            }
            if (to != boardStart) {
                return false;
            }
            // already have two players on start.
            // TODO what if it's a different player
            if (currState[player].filter(pos => pos === boardStart).length == 2) {
                return false;
            }
            return true;
        }
        return true;
    }

    isStartOfGame() {
        return this._previousMoves.length === 0;
    }

    isAllCountersAtBase(player: Colour) {
        return this._positions[player].every(pos => pos === BASE)
    }

}