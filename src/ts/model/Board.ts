import { Ship } from "./Ship"

export interface Cell { shipId: number, gotAttacked: boolean }
export interface Response { isShip: boolean, isSunk: boolean }

export type Orientation = 'horizontal' | 'vertical'

export class Board {
    static #SIZE = 10

    #ships: Ship[]
    #cells: Cell[][]

    constructor() {
        this.#ships = []
        this.#cells = []

        for (let i = 0; i < Board.#SIZE; i++) {
            const row = []
            for (let j = 0; j < Board.#SIZE; j++) {
                row.push({ shipId: -1, gotAttacked: false })
            }
            this.#cells.push(row)
        }
    }

    get ships() {
        return this.#ships
    }

    get allAreSunk() {
        if (this.#ships.length === 0) {
            return false
        }

        return this.#ships.filter(ship => !ship.isSunk).length === 0
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

    gotAttacked(x: number, y: number) {
        return this.#cells[x][y].gotAttacked
    }

    place(ship: Ship, x: number, y: number, orientation: Orientation) {
        this.#validateCoordinate(x, y)

        if (!this.#isValidPlacement(ship, x, y, orientation)) {
            throw new Error('Invalid ship placement')
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

    attack(x: number, y: number): Response {
        this.#validateCoordinate(x, y)

        const cell = this.#cells[x][y]

        if (cell.gotAttacked) {
            throw new Error(`Cell already received an attack: ${x}, ${y}`)
        }

        cell.gotAttacked = true

        if (cell.shipId >= 0) {
            const ship = this.#ships[cell.shipId]
            ship.hit()
            return { isShip: true, isSunk: ship.isSunk }
        } else {
            return { isShip: false, isSunk: false }
        }
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