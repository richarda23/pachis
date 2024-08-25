import { test, expect } from 'vitest';


test("is sum", () => {
    expect(1 + 1).toBe(2);
    expect(5 + 5).toBe(10);
})

test("is sum1", () => {
    expect(1 + 1).toBe(2);
    expect(5 + 5).toBe(10);
})

test("multiplication of integers", () => {
    expect(2 * 2).toBe(4);
    expect(3 * 4).toBe(12);
    expect(5 * 5).toBe(25);
    expect(0 * 100).toBe(0);
    expect(-2 * 3).toBe(-6);
})
