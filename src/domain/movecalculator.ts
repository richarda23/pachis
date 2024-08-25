import { BoardState } from "./boardState";
import { Colour } from "./player";
export type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
export type Move = {
    player: Colour,
    from: number,
    to: number
}
export const getMoves = (player: Colour, boardState: BoardState, diceRoll: DiceRoll): Array<Move> => {
    const currentState = boardState.currentState;
    const startPosition = boardState._board.startPosition(player);

    // if we have all players at base and it's not a 5, we can't go
    if (boardState.isAllCountersAtBase(player) && diceRoll != 5) {
        return [];
    }

    if (boardState.isSomeCountersAtBase(player)) {
        // we have to move a piece on if we can
        if (diceRoll == 5) {
            if (boardState.isAvailable(player, startPosition)) {
                return [{ player, from: -1, to: startPosition }]
            } else {
                return []; // can't go
            }
        } else {
            return _calculateMoves(player, boardState, diceRoll)
        }
    } else {
        return _calculateMoves(player, boardState, diceRoll)
    }
}

const _calculateMoves = (player: Colour, boardState: BoardState, diceRoll: DiceRoll): Array<Move> => {
    const activeCounters = boardState.activeCounters(player);
    const possibleMovers = activeCounters.filter(pos => boardState.isAvailable(player, pos + diceRoll));
    return possibleMovers.map(pos => ({ player, from: pos, to: pos + diceRoll }))
}
