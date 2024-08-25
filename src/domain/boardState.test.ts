import { describe, it, expect } from 'vitest';
import { BoardState } from './boardState';
import { Player } from './player';
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

    it('should throw an error when moving more than 6 spaces', () => {
        const boardState = new BoardState(2, board);
        const player = 'yellow';
        
        expect(() => {
            boardState.isValidMove(player, -1, 6);
        }).toThrow("Can only move max of 6 but was -1 to 6");
    });

    it('should not throw an error for a valid move', () => {
        const boardState = new BoardState(2, board);
        const player = 'yellow';
        
        expect(() => {
            boardState.isValidMove(player, -1, 4);
        }).not.toThrow();
    });

    describe('when a 5 is thrown and there are counters at base', () => {
        let boardState: BoardState;
        let player: Colour;
        let startPosition: number;

        beforeEach(() => {
            boardState = new BoardState(2, board);
            player = 'yellow';
            startPosition = board.startPosition(player);
            boardState['_positions'].yellow = [-1, -1, 10, 15]; // Two counters at base
        });

        it('should allow moving from base to start position', () => {
            expect(boardState.isValidMove(player, -1, startPosition)).toBe(true);
        });

        it('should not allow moving from a non-base position', () => {
            expect(boardState.isValidMove(player, 10, 15)).toBe(false);
        });

        it('should not allow moving to a position other than start', () => {
            expect(boardState.isValidMove(player, -1, startPosition + 1)).toBe(false);
        });

        it('should not allow moving to start if two pieces are already there', () => {
            boardState['_positions'].yellow = [-1, startPosition, startPosition, 15];
            expect(boardState.isValidMove(player, -1, startPosition)).toBe(false);
        });
    });
});
