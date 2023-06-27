export class Ship {
    static #MIN_LENGTH = 1
    static #MAX_LENGTH = 4

    #length: number
    #numberOfHits: number

    constructor(length: number) {
        if (length < Ship.#MIN_LENGTH || length > Ship.#MAX_LENGTH) {
            throw new Error('Ship length out of bounds')
        }
        this.#length = length
        this.#numberOfHits = 0
    }

    get length() {
        return this.#length
    }

    get isSunk() {
        return this.#length <= this.#numberOfHits
    }

    hit() {
        if (!this.isSunk) {
            this.#numberOfHits++
        }
    }
}