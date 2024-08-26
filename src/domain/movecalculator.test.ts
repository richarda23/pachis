import { DiceRoll, getMoves } from './movecalculator';
import { BoardState } from './boardState';
import { Board } from './board';
import { Colour } from './player';
import { describe, it, expect, beforeEach, vi } from 'vitest';


describe('getMoves', () => {
    let board: Board;
    let boardState: BoardState;
    const players: Colour[] = ['yellow', 'blue', 'red', 'green'];

    beforeEach(() => {
        board = new Board();
        boardState = new BoardState(4, board);
    });

    describe.each(players)('for player %s', (player) => {
        describe('when all counters are at base', () => {
            it('should return no valid moves if dice roll is not 5', () => {
                [1, 2, 3, 4, 6].forEach(roll => {
                    const moves = getMoves(player, boardState, roll as DiceRoll);
                    expect(moves).toHaveLength(0);
                });
            });
            it('should return a move with firstMove == true if dice roll is 5', () => {
                const moves = getMoves(player, boardState, 5);
                expect(moves).toHaveLength(1);
                expect(moves[0].isFirstMove).toBeTruthy();
            });
        });

        describe('when some counters are at base', () => {
            it('should return only 1 valid move for a throw of 5', () => {
                // Move one counter out of base
                boardState._positions[player][0] = 5;

                const moves = getMoves(player, boardState, 5);
                expect(moves).toHaveLength(1);
                expect(moves[0]).toEqual({
                    player,
                    from: -1,
                    to: board.startPosition(player),
                    isFirstMove: false,
                    toHome: false,
                });
            });

            it('should return an empty array if the start position is not available', () => {
                // Move one counter out of base
                boardState._positions[player][0] = 5;

                // Place two counters of another player on the start position
                const otherPlayer = player === 'yellow' ? 'blue' : 'yellow';
                const startPosition = board.startPosition(player);
                boardState._positions[otherPlayer][0] = startPosition;
                boardState._positions[otherPlayer][1] = startPosition;

                // Mock isAvailable method to return false for the start position
                const isAvailableSpy = vi.spyOn(boardState, 'isAvailable').mockReturnValue(false);

                const moves = getMoves(player, boardState, 5);
                expect(moves).toHaveLength(0);

                expect(isAvailableSpy).toHaveBeenCalledWith(player, startPosition);

                isAvailableSpy.mockRestore();
            });
        });

        describe('when all counters are in play', () => {
            it('should return 4 possible moves when all counters can move', () => {
                const diceRoll: DiceRoll = 3;
                boardState._positions[player] = [10, 20, 30, 40];

                // Mock isAvailable to always return true
                const isAvailableSpy = vi.spyOn(boardState, 'isAvailable').mockReturnValue(true);

                const moves = getMoves(player, boardState, diceRoll);

                expect(moves).toHaveLength(4);
                expect(moves).toEqual(expect.arrayContaining([
                    { player, from: 10, to: 13, isFirstMove: false, toHome: false, },
                    { player, from: 20, to: 23, isFirstMove: false, toHome: false, },
                    { player, from: 30, to: 33, isFirstMove: false, toHome: false, },
                    { player, from: 40, to: 43, isFirstMove: false, toHome: false, }
                ]));

                isAvailableSpy.mockRestore();
            });

            it('should return fewer moves when some counters cannot move', () => {
                const diceRoll: DiceRoll = 3;
                boardState._positions[player] = [10, 20, 30, 40];

                // Mock isAvailable to return false for some positions
                const isAvailableSpy = vi.spyOn(boardState, 'isAvailable').mockImplementation(
                    (_, position) => position !== 23 && position !== 33
                );

                const moves = getMoves(player, boardState, diceRoll);

                expect(moves).toHaveLength(2);
                expect(moves).toEqual(expect.arrayContaining([
                    { player, from: 10, to: 13, isFirstMove: false, toHome: false },
                    { player, from: 40, to: 43, isFirstMove: false, toHome: false }
                ]));

                isAvailableSpy.mockRestore();
            });

            it('should return no moves when no counters can move', () => {
                const diceRoll: DiceRoll = 3;
                boardState._positions[player] = [10, 20, 30, 40];

                // Mock isAvailable to always return false
                const isAvailableSpy = vi.spyOn(boardState, 'isAvailable').mockReturnValue(false);

                const moves = getMoves(player, boardState, diceRoll);
                expect(moves).toHaveLength(0);
                isAvailableSpy.mockRestore();
            });
        });
    });
});
