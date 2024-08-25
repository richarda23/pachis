import { describe, it, expect, beforeEach } from 'vitest';
import { BASE, BoardState, HOME } from './boardState';
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
            boardState.isValidMove(player, BASE, 4);
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
            boardState['_positions'][player] = [BASE, BASE, 10, 15]; // Two counters at base
        });

        it('should allow moving from base to start position', () => {
            expect(boardState.isValidMove(player, BASE, startPosition)).toBe(true);
        });
        it('should  allow moving to start if only 1 piece is already there', () => {
            boardState['_positions'].yellow = [BASE, startPosition, 6, 15];
            expect(boardState.isValidMove(player, BASE, startPosition)).toBe(true);
        });

        it('should not allow moving from a non-base position', () => {
            expect(boardState.isValidMove(player, 10, 15)).toBe(false);
        });

        it('should not allow moving to start if two pieces are already there', () => {
            boardState['_positions'][player] = [BASE, startPosition, startPosition, 15];
            expect(boardState.isValidMove(player, BASE, startPosition)).toBe(false);
        });

    });

    describe.each(allPlayers)('makeMove', (colour) => {
        let boardState: BoardState;
        let player: Colour;
        let startPosition: number;

        beforeEach(() => {
            boardState = new BoardState(2, board);
            player = colour as Colour;
            boardState['_positions'][player] = [BASE, BASE, 10, 15];
            startPosition = boardState._board.startPosition(player);
        });

        it('should append to history when a valid move is made', () => {
            const initialState = boardState.currentState;
            boardState.makeMove(player, BASE, startPosition); // Assuming 5 is a valid start position
            expect(boardState.previousMoves).toHaveLength(1);
            expect(boardState.previousMoves[0]).toEqual(initialState);
        });

        it('should update the position when a valid move is made', () => {
            boardState.makeMove(player, BASE, startPosition); // Assuming 5 is a valid start position
            expect(boardState.currentState[player]).toContain(startPosition);
            expect(boardState.currentState[player].filter(pos => pos === BASE)).toHaveLength(1);
        });

        it('should throw an error for an invalid move', () => {
            expect(() => {
                boardState.makeMove(player, 10, 9); // Moving backwards
            }).toThrow('invalid move');
        });

        it('should return an immutable copy of previousMoves', () => {
            // Make a valid move to add an entry to previousMoves
            boardState.makeMove(player, BASE, startPosition);

            // Get the previousMoves
            const previousMoves = boardState.previousMoves;

            //  modify the returned array
            previousMoves.push({ yellow: [1, 2, 3, 4], blue: [BASE, BASE, BASE, BASE], red: [BASE, BASE, BASE, BASE], green: [BASE, BASE, BASE, BASE] });

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
                    yellow: [BASE, BASE, BASE, BASE],
                    blue: [BASE, BASE, BASE, BASE],
                    red: [BASE, BASE, BASE, BASE],
                    green: [BASE, BASE, BASE, BASE]
                }, [player]: [BASE, BASE, 10, 15]
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

            boardState['_positions'][player] = [BASE, BASE, BASE, BASE];
            boardState.makeMove(player, BASE, startPosition);

            expect(boardState.isStartOfGame()).toBe(false);
        });
    });

    describe('isAllCountersAtBase', () => {
        let boardState: BoardState;

        beforeEach(() => {
            boardState = new BoardState(2, board);
        });

        it('should return true when all counters are attBase (BASE)', () => {
            expect(boardState.isAllCountersAtBase('yellow')).toBe(true);
            expect(boardState.isAllCountersAtBase('blue')).toBe(true);
            expect(boardState.isAllCountersAtBase('red')).toBe(true);
            expect(boardState.isAllCountersAtBase('green')).toBe(true);
        });

        it('should return false when any counter is not at Base', () => {
            boardState['_positions'].yellow = [BASE, BASE, BASE, 5];
            expect(boardState.isAllCountersAtBase('yellow')).toBe(false);

            boardState['_positions'].blue = [BASE, 10, BASE, BASE];
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

        it('should return true when all counters are at base (BASE)', () => {
            expect(boardState.isSomeCountersAtBase('yellow')).toBe(true);
            expect(boardState.isSomeCountersAtBase('blue')).toBe(true);
            expect(boardState.isSomeCountersAtBase('red')).toBe(true);
            expect(boardState.isSomeCountersAtBase('green')).toBe(true);
        });

        it('should return true when some counters are at base', () => {
            boardState['_positions'].yellow = [BASE, BASE, 5, 10];
            expect(boardState.isSomeCountersAtBase('yellow')).toBe(true);

            boardState['_positions'].blue = [BASE, 10, 15, 20];
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
            boardState['_positions'].yellow = [BASE, BASE, 5, BASE];
            expect(boardState.isAvailable('yellow', 5)).toBe(true);
        });

        it('should return false when the position has two counters', () => {
            boardState['_positions'].yellow = [BASE, BASE, 5, 5];
            expect(boardState.isAvailable('yellow', 5)).toBe(false);
        });

        it('should return true for different positions and players', () => {
            boardState['_positions'].yellow = [BASE, 10, BASE, BASE];
            boardState['_positions'].blue = [BASE, BASE, 15, BASE];
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
            boardState['_positions'].yellow = [BASE, 5, 10, BASE];
            expect(boardState.activeCounters('yellow')).toEqual([5, 10]);
        });

        it('should return all counters when none are at base', () => {
            boardState['_positions'].blue = [1, 2, 3, 4];
            expect(boardState.activeCounters('blue')).toEqual([1, 2, 3, 4]);
        });

        it('should not include counters at HOME position', () => {
            boardState['_positions'].red = [BASE, 5, HOME, 20];
            expect(boardState.activeCounters('red')).toEqual([5, 20]);
        });

        it('should work for different players', () => {
            boardState['_positions'].yellow = [BASE, 5, 10, BASE];
            boardState['_positions'].green = [1, 2, BASE, 4];
            expect(boardState.activeCounters('yellow')).toEqual([5, 10]);
            expect(boardState.activeCounters('green')).toEqual([1, 2, 4]);
        });
    });
});
