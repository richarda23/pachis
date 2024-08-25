import { Color } from "react-bootstrap/esm/types";
import { Colour, Player } from "./player"

type PlayerConditional = (player: Player) => boolean;
export type BoardCell = {
    readonly isStart: PlayerConditional,
    readonly isBlackSpot: boolean,
    readonly position: number,
    readonly isHomeRunStart: PlayerConditional
}

const players: Player[] = [new Player("yellow"), new Player("blue"), new Player("red"), new Player("green")]

const startingPositions: Record<Colour, number> = {
    "yellow": 5,
    "blue": 22,
    "red": 39,
    "green": 56,
}
export class Board {
    _squares: BoardCell[]

    constructor() {
        const squares: BoardCell[] = []
        for (let i = 0; i < 4; i++) {
            const colour = players[i].colour;

            for (let j = 0; j < 17; j++) {
                const position = i * 17 + j;
                const cell: BoardCell = {
                    isStart: (player: Player) => player.colour === colour && j == 5,
                    isBlackSpot: j == 0 || j == 5 || j == 12,
                    position: position,
                    isHomeRunStart: (player: Player) => player.colour === colour && j == 0
                }
                squares.push(cell)
            }
        }
        this._squares = squares
    }

    startPosition(player: Colour) {
        return startingPositions[player];
    }

    boardCellAt(position: number): BoardCell {
        if (position < 0 || position > 67) {
            throw new Error("invalid position, must be on the board")
        }
        return { ...this._squares[position] }
    }

    get squares() {
        return [...this._squares]
    }
}

