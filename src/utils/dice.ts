import { DiceRoll } from "../domain/movecalculator";

/**
 * A class representing a dice that generates pseudo-random numbers between 1 and 6 (inclusive) using a seed.
 */
export class Dice {
    private seed: number;
    private rng: (seed: number) => number

    /**
     * Creates a new Dice instance with the given seed.
     * @param seed A number used to initialize the random number generator.
     */
    constructor(seed: number) {
        this.seed = seed;
        this.rng = (seed: number) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
    }

    /**
     * Generates a pseudo-random number between 1 and 6 (inclusive).
     * @returns A number between 1 and 6, simulating a dice throw.
     */
    throw(): DiceRoll {

        // Generate a number between 0 and 1
        const random = this.rng(this.seed)

        // Scale to 1-6 and round down
        return Math.floor(random * 6) + 1 as DiceRoll;
    }
}
