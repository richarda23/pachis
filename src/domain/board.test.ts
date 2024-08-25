import { it, expect } from 'vitest';
import { Board } from './board';
import { Player } from './player';
it("creates board with start positions", () => {
    const board = new Board();
    expect(board.squares.filter(c => c.isStart(new Player("yellow")))).toHaveLength(1);
    expect(board.squares.filter(c => c.isStart(new Player("blue")))).toHaveLength(1);
    expect(board.squares.filter(c => c.isStart(new Player("red")))).toHaveLength(1);
    expect(board.squares.filter(c => c.isStart(new Player("green")))).toHaveLength(1);
    expect(board.squares.find(c => c.isStart(new Player("yellow")))?.position).toBe(5);
    expect(board.squares.find(c => c.isStart(new Player("blue")))?.position).toBe(22);
    expect(board.squares.find(c => c.isStart(new Player("red")))?.position).toBe(39);
    expect(board.squares.find(c => c.isStart(new Player("green")))?.position).toBe(56);
})