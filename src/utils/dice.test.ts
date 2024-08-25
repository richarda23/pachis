import { test, expect } from 'vitest';
import { Dice } from './dice';

test('Dice.throw() returns a number between 1 and 6', () => {
    const dice = new Dice(12345);
    for (let i = 0; i < 100; i++) {
        const result = dice.throw();
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
        expect(Number.isInteger(result)).toBe(true);
    }
});

test('Dice instances with the same seed produce the same first throw', () => {
    const seed = 12345;
    const dice1 = new Dice(seed);
    const dice2 = new Dice(seed);
    expect(dice1.throw()).toBe(dice2.throw());
});

test('Dice instances with different seeds produce different first throws', () => {
    const dice1 = new Dice(1);
    const dice2 = new Dice(2);
    expect(dice1.throw()).not.toBe(dice2.throw());
});


