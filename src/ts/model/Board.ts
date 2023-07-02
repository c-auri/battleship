import { Ship } from "./Ship"

export type State = "fog" | "water" | "hit" | "sunk"
interface Cell { shipId: number, isFog: boolean, isClear: boolean }

export type Orientation = 'horizontal' | 'vertical'

export class Board {
    static #SIZE = 10

    static get Size() {
        return Board.#SIZE
    }

    #ships: Ship[]
    #cells: Cell[][]

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

    randomize(lengths: number[]) {
        for (const length of lengths) {
            const ship = new Ship(length)
            let x: number
            let y: number
            let orientation: Orientation

            do {
                x = Math.round(Math.random() * 9)
                y = Math.round(Math.random() * 9)
                orientation = Math.random() > .5 ? 'horizontal' : 'vertical'
            } while(!this.#isValidPlacement(ship, x, y, orientation))

            this.place(ship, x, y, orientation)
        }
    }

    isShip(x: number, y: number) {
        return this.#cells[x][y].shipId >= 0
    }

    getState(x: number, y: number) {
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

    place(ship: Ship, x: number, y: number, orientation: Orientation) {
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

    attack(x: number, y: number) {
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

    #clear(x: number, y: number) {
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

    #getNeighbors(x: number, y: number) {
        const result: { x: number, y: number }[] = []

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

    #isValidPlacement(
        ship: Ship,
        x: number,
        y: number,
        orientation: Orientation
    ) {
        const isHorizontal = orientation === 'horizontal'
        if ((isHorizontal && x + ship.length > Board.#SIZE) ||
            (!isHorizontal && y + ship.length > Board.#SIZE)
        ) {
            return false
        }

        for (let i = -1; i <= ship.length; i++) {
            for (let j = -1; j <= +1; j++) {
                let cell: Cell

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

    #validateCoordinate(x: number, y: number) {
        if (x < 0 || y < 0 || x >= Board.#SIZE || y >= Board.#SIZE) {
            throw new Error(`Invalid coordinate: ${x}, ${y}`)
        }
    }
}