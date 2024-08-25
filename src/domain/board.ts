import { Color } from "react-bootstrap/esm/types";
import { Colour, Player } from "./player"

type PlayerConditional = (player: Player) => boolean;
export type BoardCell = {
    isStart: PlayerConditional,
    isBlackSpot: boolean,
    position: number
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

                const cell: BoardCell = {
                    isStart: (player: Player) => player.colour === colour && j == 5
                        || player.colour === "blue" && j == 22
                        || player.colour === "red" && j == 39
                        || player.colour === "green" && j == 56,
                    isBlackSpot: j == 0 || j == 5 || j == 12,
                    position: i * 17 + j
                }
                squares.push(cell)
            }
        }
        this._squares = squares
    }

    startPosition(player: Colour) {
        return startingPositions[player];
    }

    get squares() {
        return [...this._squares]
    }
}

