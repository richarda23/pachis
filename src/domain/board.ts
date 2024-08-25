import { Color } from "react-bootstrap/esm/types";
import { Player } from "./player"

type PlayerConditional = (player: Player) => boolean;
export type BoardCell = {
    isStart: PlayerConditional,
    isBlackSpot: boolean,
    position: number
}

const players: Player[] = [new Player("yellow"), new Player("blue"), new Player("red"), new Player("green")]
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

    startPosition(player: Color) {

    }

    get squares() {
        return [...this._squares]
    }
}

