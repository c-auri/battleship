import { Ship } from "./Ship"

/*
 * @typedef {('fog'|'water'|'hit'|'sunk')} State
 */

/*
 * @typedef Cell
 * @type Object
 * @property {number} shipId
 * @property {boolean} isFog
 * @property {boolean} isClear
 */

/*
 * @typedef {('horitontal'| 'vertical')} Orientation
 */

/*
 * @typedef {} Board
 */
export class Board {
    static #SIZE = 10

    static get Size() {
        return Board.#SIZE
    }

    /** @type {Ship[]} */
    #ships

    /** @type {Cell[][]} */
    #cells

    constructor() {
        this.#ships = []
        this.#cells = []

        for (let i = 0; i < Board.#SIZE; i++) {
            const row = []
            for (let j = 0; j < Board.#SIZE; j++) {
                row.push({ shipId: -1, isFog: true, isClear: false })
            }
            this.#cells.push(row)
        }
    }

    get ships() {
        return this.#ships
    }

    get allAreSunk() {
        return this.#ships.every(ship => ship.isSunk)
    }

    /*
     * @param {number[]} lengths
     */
    randomize(lengths) {
        for (const length of lengths) {
            const ship = new Ship(length)

            /** type {number} */
            let x
            /** type {number} */
            let y
            /** type {Orientation} */
            let orientation

            do {
                x = Math.round(Math.random() * 9)
                y = Math.round(Math.random() * 9)
                orientation = Math.random() > .5 ? 'horizontal' : 'vertical'
            } while(!this.#isValidPlacement(ship, x, y, orientation))

            this.place(ship, x, y, orientation)
        }
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    isShip(x, y) {
        return this.#cells[x][y].shipId >= 0
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    getState(x, y) {
        this.#validateCoordinate(x, y)

        const cell = this.#cells[x][y]

        if (cell.isFog) {
            return "fog"
        } else if (cell.shipId === -1) {
            return "water"
        } else if (this.#ships[cell.shipId].isSunk) {
            return "sunk"
        } else {
            return "hit"
        }
    }

    /*
     * @param {Ship} ship
     * @param {number} x
     * @param {number} y
     * @param {Orientation} orientation
     */
    place(ship, x, y, orientation) {
        this.#validateCoordinate(x, y)

        if (!this.#isValidPlacement(ship, x, y, orientation)) {
            throw new Error(`Invalid ship placement: ${x}, ${y}`)
        }

        this.#ships.push(ship)
        const id = this.#ships.length - 1

        for (let i = 0; i < ship.length; i++) {
            if (orientation === 'horizontal') {
                this.#cells[x + i][y].shipId = id
            } else {
                this.#cells[x][y + i].shipId = id
            }
        }
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    attack(x, y) {
        this.#validateCoordinate(x, y)

        const cell = this.#cells[x][y]

        if (!cell.isFog) {
            throw new Error(`Cell already received an attack: ${x}, ${y}`)
        }

        cell.isFog = false

        if (cell.shipId < 0) {
            return
        }

        const ship = this.#ships[cell.shipId]

        ship.hit()

        if (ship.isSunk) {
            this.#clear(x, y)
        }
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    #clear(x, y) {
        const cell = this.#cells[x][y]

        if (cell.isClear) {
            return
        }

        cell.isFog = false
        cell.isClear = true

        if (cell.shipId >= 0) {
            for (const neighbor of this.#getNeighbors(x, y)) {
                this.#clear(neighbor.x, neighbor.y)
            }
        }
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    #getNeighbors(x, y) {

        /** @typedef {x:number, y:number} */
        const result = []

        if (x > 0) {
            result.push({ x: x - 1, y: y })
        }

        if (x < Board.#SIZE - 1) {
            result.push({ x: x + 1, y: y })
        }

        if (y > 0) {
            result.push({ x: x, y: y - 1 })
        }

        if (y < Board.#SIZE - 1) {
            result.push({ x: x, y: y + 1 })
        }

        if (x > 0 && y > 0) {
            result.push({ x: x - 1, y: y - 1 })
        }

        if (x > 0 && y < Board.#SIZE - 1) {
            result.push({ x: x - 1, y: y + 1 })
        }

        if (x < Board.#SIZE - 1 && y < Board.#SIZE - 1) {
            result.push({ x: x + 1, y: y + 1 })
        }

        if (x < Board.#SIZE - 1 && y > 0) {
            result.push({ x: x + 1, y: y - 1 })
        }

        return result
    }

    /*
     * @param {Ship} ship
     * @param {number} x
     * @param {number} y
     * @param {Orientation} orientation
     */
    #isValidPlacement(ship, x, y, orientation) {
        const isHorizontal = orientation === 'horizontal'
        if ((isHorizontal && x + ship.length > Board.#SIZE) ||
            (!isHorizontal && y + ship.length > Board.#SIZE)
        ) {
            return false
        }

        for (let i = -1; i <= ship.length; i++) {
            for (let j = -1; j <= +1; j++) {
                let cell

                try {
                    if (isHorizontal) {
                        cell = this.#cells[x + i][y + j]
                    } else {
                        cell = this.#cells[x + j][y + i]
                    }
                } catch {
                    continue
                }

                if (cell?.shipId >= 0) {
                    return false
                }
            }
        }

        return true
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    #validateCoordinate(x, y) {
        if (x < 0 || y < 0 || x >= Board.#SIZE || y >= Board.#SIZE) {
            throw new Error(`Invalid coordinate: ${x}, ${y}`)
        }
    }
}
