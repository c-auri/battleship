export class Ship {
    static #MIN_LENGTH = 1
    static #MAX_LENGTH = 5

    static get minLength() {
        return Ship.#MIN_LENGTH
    }

    static get maxLength() {
        return Ship.#MAX_LENGTH
    }

    /** type {number} */
    #length

    /** type {number} */
    #numberOfHits

    /*
     * @param {number} lenght
     */
    constructor(length) {
        if (length < Ship.#MIN_LENGTH || length > Ship.#MAX_LENGTH) {
            throw new Error('Ship length out of bounds: ' + length)
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
