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

    describe.each(['yellow', 'blue', 'red', 'green'])('when a 5 is thrown and there are counters at base', (colour) => {
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

        it('should not allow moving from a non-base position', () => {
            expect(boardState.isValidMove(player, 10, 15)).toBe(false);
        });

        it('should not allow moving to start if two pieces are already there', () => {
            boardState['_positions'][player] = [-1, startPosition, startPosition, 15];
            expect(boardState.isValidMove(player, -1, startPosition)).toBe(false);
        });

        it('should  allow moving to start if only 1 piece is already there', () => {
            boardState['_positions'].yellow = [-1, startPosition, 6, 15];
            expect(boardState.isValidMove(player, -1, startPosition)).toBe(true);
        });
    });
});
