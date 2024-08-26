import { BoardState } from "./boardState";
import { Colour } from "./player";
export type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
export type Move = {
    player: Colour,
    from: number,
    to: number,
    isFirstMove: boolean // indicator that 2 counters are placed on initial roll
    toHome: boolean;// whether to is in home straight
}
const createMove = (player: Colour, from: number, to: number, isFirstMove: boolean = false, toHome: boolean = false): Move => {
    return {
        player, from, to, isFirstMove, toHome
    }
}
export const getMoves = (player: Colour, boardState: BoardState, diceRoll: DiceRoll): Array<Move> => {
    const startPosition = boardState._board.startPosition(player);

    // if we have all players at base and it's not a 5, we can't go
    if (boardState.isAllCountersAtBaseForPlayer(player) && diceRoll != 5) {
        return [];
    }
    if (boardState.isAllCountersAtBaseForPlayer(player) && diceRoll === 5) {
        if (boardState.isAvailable(player, startPosition)) {
            return [createMove(player, -1, startPosition, true)]
        }
    }

    if (boardState.isSomeCountersAtBase(player)) {
        // we have to move a piece on if we can
        if (diceRoll == 5) {
            if (boardState.isAvailable(player, startPosition)) {
                return [createMove(player, -1, startPosition)]
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

    return possibleMovers.map(pos => createMove(player, pos, pos + diceRoll))
}

export const calculateToSquare = (player: Colour, boardState: BoardState, pos: number, diceRoll: DiceRoll) => {
    let to;

    const progress = boardState.progress[player];
    const positions = boardState.currentState[player];
    const index = positions.findIndex(p => p === pos);

    if (index == -1) {
        throw new Error(`position ${[pos]} not found on board for ${player}`);
    }
    const currProgress = progress[index];

    // we're entering  or in home straight 
    if (currProgress + diceRoll === 76) {
        // we've got a player home
    }
    if (currProgress + diceRoll > 76) {
        // we can't move, it's too far
    }
    if (currProgress + diceRoll >= 68) {
        // we are moving into or within home straight.
    }
    // TODO represent home straight in board state

}
