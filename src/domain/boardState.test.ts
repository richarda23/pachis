import { describe, it, expect, beforeEach } from 'vitest';
import { BoardState } from './boardState';
import { Colour, Player } from './player';
import { Board } from './board';

describe('BoardState', () => {
    const players = [
        new Player('yellow'),
        new Player('blue'),
        new Player('red'),
        new Player('green')
    ];
    const board = new Board();

    it('should throw an error when moving from an invalid position', () => {
        const boardState = new BoardState(2, board);
        const player = 'yellow';

        expect(() => {
            boardState.isValidMove(player, 10, 12);
        }).toThrow("Moving from invalid position 10 but counters are at -1,-1,-1,-1");
    });

    it('should not throw an error for a valid move', () => {
        const boardState = new BoardState(2, board);
        const player = 'yellow';

        expect(() => {
            boardState.isValidMove(player, -1, 4);
        }).not.toThrow();
    });

    const allPlayers: Colour[] = ['yellow', 'blue', 'red', 'green'];

    describe.each(allPlayers)('when a 5 is thrown and there are counters at base', (colour) => {
        let boardState: BoardState;
        let player: Colour;
        let startPosition: number;

        beforeEach(() => {
            boardState = new BoardState(2, board);
            player = colour as Colour;
            startPosition = board.startPosition(player);
            boardState['_positions'][player] = [-1, -1, 10, 15]; // Two counters at base
        });

        it('should allow moving from base to start position', () => {
            expect(boardState.isValidMove(player, -1, startPosition)).toBe(true);
        });
        it('should  allow moving to start if only 1 piece is already there', () => {
            boardState['_positions'].yellow = [-1, startPosition, 6, 15];
            expect(boardState.isValidMove(player, -1, startPosition)).toBe(true);
        });

        it('should not allow moving from a non-base position', () => {
            expect(boardState.isValidMove(player, 10, 15)).toBe(false);
        });

        it('should not allow moving to start if two pieces are already there', () => {
            boardState['_positions'][player] = [-1, startPosition, startPosition, 15];
            expect(boardState.isValidMove(player, -1, startPosition)).toBe(false);
        });

    });

    describe.each(allPlayers)('makeMove', (colour) => {
        let boardState: BoardState;
        let player: Colour;
        let startPosition: number;

        beforeEach(() => {
            boardState = new BoardState(2, board);
            player = colour as Colour;
            boardState['_positions'][player] = [-1, -1, 10, 15];
            startPosition = boardState._board.startPosition(player);
        });

        it('should append to history when a valid move is made', () => {
            const initialState = boardState.currentState;
            boardState.makeMove(player, -1, startPosition); // Assuming 5 is a valid start position
            expect(boardState.previousMoves).toHaveLength(1);
            expect(boardState.previousMoves[0]).toEqual(initialState);
        });

        it('should update the position when a valid move is made', () => {
            boardState.makeMove(player, -1, startPosition); // Assuming 5 is a valid start position
            expect(boardState.currentState[player]).toContain(startPosition);
            expect(boardState.currentState[player].filter(pos => pos === -1)).toHaveLength(1);
        });

        it('should throw an error for an invalid move', () => {
            expect(() => {
                boardState.makeMove(player, 10, 9); // Moving backwards
            }).toThrow('invalid move');
        });

        it('should return an immutable copy of previousMoves', () => {
            // Make a valid move to add an entry to previousMoves
            boardState.makeMove(player, -1, startPosition);

            // Get the previousMoves
            const previousMoves = boardState.previousMoves;

            //  modify the returned array
            previousMoves.push({ yellow: [1, 2, 3, 4], blue: [-1, -1, -1, -1], red: [-1, -1, -1, -1], green: [-1, -1, -1, -1] });

            // Check that the original previousMoves in boardState hasn't changed
            expect(boardState.previousMoves).toHaveLength(1);
            expect(boardState.previousMoves).not.toEqual(previousMoves);
        });

        it('should return an immutable copy of currentState', () => {
            const initialState = boardState.currentState;

            // Try to modify the returned state
            initialState[player][0] = 12;

            // Check that the original state in boardState hasn't changed
            expect(boardState.currentState).toEqual({
                ...{
                    yellow: [-1, -1, -1, -1],
                    blue: [-1, -1, -1, -1],
                    red: [-1, -1, -1, -1],
                    green: [-1, -1, -1, -1]
                }, [player]: [-1, -1, 10, 15]
            });
            expect(boardState.currentState).not.toEqual(initialState);
        });
    });

    describe('isStartOfGame', () => {
        it('should return true when no moves have been made', () => {
            const boardState = new BoardState(2, board);
            expect(boardState.isStartOfGame()).toBe(true);
        });

        it('should return false after a move has been made', () => {
            const boardState = new BoardState(2, board);
            const player = 'yellow';
            const startPosition = board.startPosition(player);

            boardState['_positions'][player] = [-1, -1, -1, -1];
            boardState.makeMove(player, -1, startPosition);

            expect(boardState.isStartOfGame()).toBe(false);
        });
    });

    describe('isAllCountersAtBase', () => {
        let boardState: BoardState;

        beforeEach(() => {
            boardState = new BoardState(2, board);
        });

        it('should return true when all counters are attBase (-1)', () => {
            expect(boardState.isAllCountersAtBase('yellow')).toBe(true);
            expect(boardState.isAllCountersAtBase('blue')).toBe(true);
            expect(boardState.isAllCountersAtBase('red')).toBe(true);
            expect(boardState.isAllCountersAtBase('green')).toBe(true);
        });

        it('should return false when any counter is not at Base', () => {
            boardState['_positions'].yellow = [-1, -1, -1, 5];
            expect(boardState.isAllCountersAtBase('yellow')).toBe(false);

            boardState['_positions'].blue = [-1, 10, -1, -1];
            expect(boardState.isAllCountersAtBase('blue')).toBe(false);
        });

        it('should return false when all counters are out of Base', () => {
            boardState['_positions'].red = [1, 2, 3, 4];
            expect(boardState.isAllCountersAtBase('red')).toBe(false);
        });
    });

    describe('isSomeCountersAtBase', () => {
        let boardState: BoardState;

        beforeEach(() => {
            boardState = new BoardState(2, board);
        });

        it('should return true when all counters are at base (-1)', () => {
            expect(boardState.isSomeCountersAtBase('yellow')).toBe(true);
            expect(boardState.isSomeCountersAtBase('blue')).toBe(true);
            expect(boardState.isSomeCountersAtBase('red')).toBe(true);
            expect(boardState.isSomeCountersAtBase('green')).toBe(true);
        });

        it('should return true when some counters are at base', () => {
            boardState['_positions'].yellow = [-1, -1, 5, 10];
            expect(boardState.isSomeCountersAtBase('yellow')).toBe(true);

            boardState['_positions'].blue = [-1, 10, 15, 20];
            expect(boardState.isSomeCountersAtBase('blue')).toBe(true);
        });

        it('should return false when no counters are at base', () => {
            boardState['_positions'].red = [1, 2, 3, 4];
            expect(boardState.isSomeCountersAtBase('red')).toBe(false);

            boardState['_positions'].green = [5, 10, 15, 20];
            expect(boardState.isSomeCountersAtBase('green')).toBe(false);
        });
    });

    describe('isAvailable', () => {
        let boardState: BoardState;

        beforeEach(() => {
            boardState = new BoardState(2, board);
        });

        it('should return true when the position is empty', () => {
            expect(boardState.isAvailable('yellow', 5)).toBe(true);
        });

        it('should return true when the position has one counter', () => {
            boardState['_positions'].yellow = [-1, -1, 5, -1];
            expect(boardState.isAvailable('yellow', 5)).toBe(true);
        });

        it('should return false when the position has two counters', () => {
            boardState['_positions'].yellow = [-1, -1, 5, 5];
            expect(boardState.isAvailable('yellow', 5)).toBe(false);
        });

        it('should return true for different positions and players', () => {
            boardState['_positions'].yellow = [-1, 10, -1, -1];
            boardState['_positions'].blue = [-1, -1, 15, -1];
            expect(boardState.isAvailable('yellow', 10)).toBe(true);
            expect(boardState.isAvailable('yellow', 15)).toBe(true);
            expect(boardState.isAvailable('blue', 15)).toBe(true);
            expect(boardState.isAvailable('red', 20)).toBe(true);
        });
    });

    describe('activeCounters', () => {
        let boardState: BoardState;

        beforeEach(() => {
            boardState = new BoardState(2, board);
        });

        it('should return an empty array when all counters are at base', () => {
            expect(boardState.activeCounters('yellow')).toEqual([]);
        });

        it('should return only the active counters', () => {
            boardState['_positions'].yellow = [-1, 5, 10, -1];
            expect(boardState.activeCounters('yellow')).toEqual([5, 10]);
        });

        it('should return all counters when none are at base', () => {
            boardState['_positions'].blue = [1, 2, 3, 4];
            expect(boardState.activeCounters('blue')).toEqual([1, 2, 3, 4]);
        });

        it('should not include counters at HOME position', () => {
            boardState['_positions'].red = [-1, 5, 75, 20]; // Assuming 75 is the HOME position
            expect(boardState.activeCounters('red')).toEqual([5, 20]);
        });

        it('should work for different players', () => {
            boardState['_positions'].yellow = [-1, 5, 10, -1];
            boardState['_positions'].green = [1, 2, -1, 4];
            expect(boardState.activeCounters('yellow')).toEqual([5, 10]);
            expect(boardState.activeCounters('green')).toEqual([1, 2, 4]);
        });
    });
});
