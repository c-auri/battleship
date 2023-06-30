export class Ship {
    static #MIN_LENGTH = 1
    static #MAX_LENGTH = 5

    static get minLength() {
        return Ship.#MIN_LENGTH
    }

    static get maxLength() {
        return Ship.#MAX_LENGTH
    }

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