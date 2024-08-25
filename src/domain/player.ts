export type Colour = "yellow" | "blue" | "red" | "green"

export class Player {
    private _colour: Colour
    public get colour(): Colour {
        return this._colour
    }

    constructor(colour: Colour) {
        this._colour = colour
    }
}