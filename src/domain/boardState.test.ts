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
            
            // Try to modify the returned array
            previousMoves.push({ yellow: [1, 2, 3, 4], blue: [-1, -1, -1, -1], red: [-1, -1, -1, -1], green: [-1, -1, -1, -1] });
            
            // Check that the original previousMoves in boardState hasn't changed
            expect(boardState.previousMoves).toHaveLength(1);
            expect(boardState.previousMoves).not.toEqual(previousMoves);
        });

        it('should return an immutable copy of currentState', () => {
            const initialState = boardState.currentState;
            
            // Try to modify the returned state
            initialState[player][0] = 999;
            
            // Check that the original state in boardState hasn't changed
            expect(boardState.currentState).toEqual({
                yellow: [-1, -1, 10, 15],
                blue: [-1, -1, -1, -1],
                red: [-1, -1, -1, -1],
                green: [-1, -1, -1, -1]
            });
            expect(boardState.currentState).not.toEqual(initialState);
        });
    });
});
