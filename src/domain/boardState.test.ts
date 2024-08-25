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
});
