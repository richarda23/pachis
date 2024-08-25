import { it, expect, describe } from 'vitest';
import { Board } from './board';
import { Player, Colour } from './player';
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

describe('Board home run start positions', () => {
    const board = new Board();
    const players: Colour[] = ['yellow', 'blue', 'red', 'green'];

    describe.each(players)('for %s player', (colour) => {
        it('should have exactly one home run start position', () => {
            const player = new Player(colour);
            const homeRunStartPositions = board.squares.filter(square => square.isHomeRunStart(player));

            expect(homeRunStartPositions).toHaveLength(1);
            
            const homeRunStartPosition = homeRunStartPositions[0];
            expect(homeRunStartPosition.position % 17).toBe(0);
        });
    });
});
