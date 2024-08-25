import { DiceRoll, getMoves } from './movecalculator';
import { BoardState } from './boardState';
import { Board } from './board';
import { Colour } from './player';
import { describe, it, expect, beforeEach } from 'vitest';


describe('getMoves', () => {
    let board: Board;
    let boardState: BoardState;

    beforeEach(() => {
        board = new Board();
        boardState = new BoardState(4, board);
    });

    const testForAllPlayers = (testFn: (player: Colour) => void) => {
        const players: Colour[] = ['yellow', 'blue', 'red', 'green'];
        players.forEach(player => {
            testFn(player);
        });
    };

    describe('when all counters are at base', () => {
        it('should return no valid moves if dice roll is not 5', () => {
            testForAllPlayers((player) => {
                [1, 2, 3, 4, 6].forEach(roll => {
                    const moves = getMoves(player, boardState, roll as DiceRoll);
                    expect(moves).toHaveLength(0);
                });
            });
        });
    });

    describe('when some counters are at base', () => {
        it('should return only 1 valid move for a throw of 5', () => {
            testForAllPlayers((player) => {
                // Move one counter out of base
                boardState.currentState[player][0] = 5;

                const moves = getMoves(player, boardState, 5);
                expect(moves).toHaveLength(1);
                expect(moves[0]).toEqual({
                    player,
                    from: -1,
                    to: board.startPosition(player)
                });
            });
        });
    });
});
