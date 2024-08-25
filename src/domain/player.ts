export type Colour = "yellow" | "blue" | "red" | "green"

export class Player {
    private colour: Colour

    constructor(colour: Colour) {
        this.colour = colour
    }
}