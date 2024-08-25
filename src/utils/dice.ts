/**
 * Generates a pseudo-random number between 1 and 6 (inclusive) using a seed.
 * @param seed A number used to initialize the random number generator.
 * @returns A number between 1 and 6, simulating a dice throw.
 */
export function throwDice(seed: number): number {
    // Create a simple pseudo-random number generator
    const rng = (seed: number) => {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    // Generate a number between 0 and 1
    const random = rng(seed);

    // Scale to 1-6 and round down
    return Math.floor(random * 6) + 1;
}
