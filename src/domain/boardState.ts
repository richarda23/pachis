import { Board } from "./board";
import { Colour } from "./player";
import { cloneDeep } from "lodash";

type Positions = Record<Colour, number[]>
type Progress = Record<Colour, number[]>

export const BASE = -1;
export const HOME = 100;
export class BoardState {
    _previousMoves = new Array<Positions>();
    _board: Board;
    // -1 = base, 75 = home
    _positions: Positions = {
        "yellow": [BASE, BASE, BASE, BASE],
        "blue": [BASE, BASE, BASE, BASE],
        "red": [BASE, BASE, BASE, BASE],
        "green": [BASE, BASE, BASE, BASE],

    };
    _progress: Progress = {
        "yellow": [0, 0, 0, 0],
        "blue": [0, 0, 0, 0],
        "red": [0, 0, 0, 0],
        "green": [0, 0, 0, 0],
    };

    constructor(numPlayers: number, board: Board) {
        this._board = board
    }

    get previousMoves() {
        return this._previousMoves.map(p => cloneDeep(p));
    }
    /**
     *  get a copy of current state
     */
    get currentState(): Positions {
        return cloneDeep(this._positions)
    }

    /**
     *  get a copy of current state
     */
    get progress(): Progress {
        return cloneDeep(this._progress)
    }

    /**  
      makes a valid move. asserts that the move is valid
    */
    makeMove(player: Colour, from: number, to: number, progress: number) {
        if (!this.isValidMove(player, from, to)) {
            throw new Error(`invalid move!!! ${player} from ${from} to ${to} `)
        }
        this._previousMoves.push(this.currentState);
        const counterToMove = this._positions[player].findIndex(pos => pos === from);
        this._positions[player][counterToMove] = to;
        this._progress[player][counterToMove] += progress;
    }
    /** comment  */
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
        return this._previousMoves.length === 0 && this.isAllCountersAtBase();
    }

    // all of a player's counters are at base
    isAllCountersAtBaseForPlayer(player: Colour): boolean {
        return this._positions[player].every(pos => pos === BASE)
    }

    // all counters are at base
    isAllCountersAtBase(): boolean {
        return Object.values(this._positions).flat().every(pos => pos === BASE)
    }

    // at least one of a player's counters is at base
    isSomeCountersAtBase(player: Colour): boolean {
        return this._positions[player].some(pos => pos === BASE)
    }

    // a position is available if it is occupied by 0 or 1 counters. 
    // if 2 counters are at the position, the position is unavailable to move to
    isAvailable(player: Colour, position: number): boolean {
        const countersAtPosition = Object.values(this._positions)
            .flat()
            .filter(pos => pos === position)
            .length;
        return countersAtPosition < 2;
    }
    // gets an array of active counters (counters not at base or HOME)
    activeCounters(player: Colour): number[] {
        //TODO include test for 'Home' position
        return this._positions[player].filter(pos => pos != BASE && pos != HOME);
    }

}
