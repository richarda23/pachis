/**
 * A class representing a dice that generates pseudo-random numbers between 1 and 6 (inclusive) using a seed.
 */
export class Dice {
    private seed: number;

    /**
     * Creates a new Dice instance with the given seed.
     * @param seed A number used to initialize the random number generator.
     */
    constructor(seed: number) {
        this.seed = seed;
    }

    /**
     * Generates a pseudo-random number between 1 and 6 (inclusive).
     * @returns A number between 1 and 6, simulating a dice throw.
     */
    throw(): number {
        // Create a simple pseudo-random number generator
        const rng = (seed: number) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        // Generate a number between 0 and 1
        const random = rng(this.seed);

        // Update the seed for the next throw
        this.seed = Math.floor(random * 1000000);

        // Scale to 1-6 and round down
        return Math.floor(random * 6) + 1;
    }
}
