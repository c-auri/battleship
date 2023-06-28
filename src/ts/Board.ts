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

    get allAreSunk() {
        if (this.#ships.length === 0) {
            return false
        }

        return this.#ships.filter(ship => !ship.isSunk).length === 0
    }

    place(ship: Ship, x: number, y: number, orientation: Orientation) {
        this.#validateCoordinate(x, y)
        this.#validatePlacement(ship, x, y, orientation)

        this.#ships.push(ship)
        const id = this.#ships.length - 1

        for (let i = 0; i < ship.length; i++) {
            if (orientation === 'horizontal') {
                this.#cells[x][y + i].shipId = id
            } else {
                this.#cells[x + i][y].shipId = id
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

    #validateCoordinate(x: number, y: number) {
        if (x < 0 || y < 0 || x >= Board.#SIZE || y >= Board.#SIZE) {
            throw new Error(`Invalid coordinate: ${x}, ${y}`)
        }
    }

    #validatePlacement(
        ship: Ship,
        x: number,
        y: number,
        orientation: Orientation
    ) {
        if ((orientation === 'horizontal' && x + ship.length >= Board.#SIZE) ||
            (orientation === 'vertical' && y + ship.length >= Board.#SIZE)
        ) {
                throw new Error('Invalid position')
        }
    }
}