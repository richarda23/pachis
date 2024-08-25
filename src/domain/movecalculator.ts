import { BoardState } from "./boardState";
import { Colour } from "./player";
export type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
export type Move = {
    player: Colour,
    from: number,
    to: number
}
const getMoves = (player: Colour, boardState: BoardState, diceRoll: DiceRoll): Array<Move> => {
    const currentState = boardState.currentState;
    const startPosition = boardState._board.startPosition(player);



    return [];


}