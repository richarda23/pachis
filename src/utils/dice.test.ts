import { test, expect } from 'vitest';
import { throwDice } from './dice';

test('throwDice returns a number between 1 and 6', () => {
    for (let i = 0; i < 100; i++) {
        const result = throwDice(i);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
        expect(Number.isInteger(result)).toBe(true);
    }
});

test('throwDice returns consistent results for the same seed', () => {
    const seed = 12345;
    const result1 = throwDice(seed);
    const result2 = throwDice(seed);
    expect(result1).toBe(result2);
});

test('throwDice returns different results for different seeds', () => {
    const result1 = throwDice(1);
    const result2 = throwDice(2);
    expect(result1).not.toBe(result2);
});
