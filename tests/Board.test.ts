import { Board } from "../src/ts/model/Board"
import { Ship } from "../src/ts/model/Ship"

describe('constructor', () => {
    test('does not throw', () => {
        expect(() => new Board()).not.toThrow()
    })
})

describe('place', () => {
    describe('throws an error', () => {
        test('when x coordinate is negative', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, -1, 3, 'horizontal'))
                .toThrow('Invalid coordinate')
        })
        test('when x coordinate is too large', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, 10, 3, 'horizontal'))
                .toThrow('Invalid coordinate')
        })
        test('when y coordinate is negative', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, 3, -1, 'horizontal'))
                .toThrow('Invalid coordinate')
        })
        test('when x coordinate is too large', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, 3, 10, 'horizontal'))
                .toThrow('Invalid coordinate')
        })
        test('when horizontal ship is placed too far right', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, 7, 3, 'horizontal'))
                .toThrow('Invalid position')
        })
        test('when vertical ship is placed too far down', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, 3, 7, 'vertical'))
                .toThrow('Invalid position')
        })
        test('when ship is placed on top of existing ship\s head', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 3, 3, 'horizontal')
            expect(() => board.place(newShip, 3, 3, 'vertical'))
                .toThrow('Can not place ship on top of another ship')
        })
        test('when ship is placed on top of existing ship\s body', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 3, 3, 'horizontal')
            expect(() => board.place(newShip, 5, 3, 'vertical'))
                .toThrow('Can not place ship on top of another ship')
        })
        test('when ship is placed on top of existing ship\'s tail', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 3, 3, 'horizontal')
            expect(() => board.place(newShip, 6, 3, 'vertical'))
                .toThrow('Can not place ship on top of another ship')
        })
    })
    describe('does not throw', () => {
        test('when horizontal ship is placed just on the edge', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, 6, 3, 'horizontal'))
                .not.toThrow()
        })
        test('when vertical ship is placed just on the edge', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, 3, 6, 'vertical'))
                .not.toThrow()
        })
    })
})

describe('receiveAttack', () => {
    describe('throws an error', () => {
        test('when given invalid coordinates', () => {
            const board = new Board()
            expect(() => board.attack(-1, 10))
                .toThrow('Invalid coordinate')
        })
        test('when given cell already received an attack', () => {
            const board = new Board()
            board.attack(3, 4)
            expect(() => board.attack(3, 4))
                .toThrow('Cell already received an attack')
        })
    })
    describe('responds is no ship', () => {
        test('for empty board', () => {
            const board = new Board()
            const response = board.attack(1, 3)
            expect(response.isShip).toBe(false)
        })
        test('when missing by a large margin', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'horizontal')
            const response = board.attack(7, 8)
            expect(response.isShip).toBe(false)
        })
        test('when hitting in front of head of a horizontal  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'horizontal')
            const response = board.attack(1, 3)
            expect(response.isShip).toBe(false)
        })
        test('when hitting in front of head of a vertical  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'vertical')
            const response = board.attack(2, 2)
            expect(response.isShip).toBe(false)
        })
        test('when hitting in back of tail of a horizontal  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'horizontal')
            const response = board.attack(5, 3)
            expect(response.isShip).toBe(false)
        })
        test('when hitting in back of tail of a vertical  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'vertical')
            const response = board.attack(2, 6)
            expect(response.isShip).toBe(false)
        })
        test('when hitting at the side of a horizontal  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'horizontal')

            for (let i = 0; i < 3; i++) {
                const rightResponse = board.attack(2 + i, 4)
                const leftResponse = board.attack(2 + i, 2)
                expect(leftResponse.isShip).toBe(false)
                expect(rightResponse.isShip).toBe(false)
            }
        })
        test('when hitting at the side of a vertical  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'vertical')

            for (let i = 0; i < 3; i++) {
                const rightResponse = board.attack(1, 3 + i)
                const leftResponse = board.attack(3, 3 + i)
                expect(leftResponse.isShip).toBe(false)
                expect(rightResponse.isShip).toBe(false)
            }
        })
    })
    describe('responds is ship', () => {
        test('when hitting placement coordinate of a ship', () => {
            const board = new Board()
            board.place(new Ship(2), 2, 3, 'vertical')
            const response = board.attack(2, 3)
            expect(response.isShip).toBe(true)
        })
        test('when hitting body of a horizontal  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'horizontal')
            const response = board.attack(3, 3)
            expect(response.isShip).toBe(true)
        })
        test('when hitting body of a vertical  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'vertical')
            const response = board.attack(2, 4)
            expect(response.isShip).toBe(true)
        })
        test('when hitting tail of a horizontal  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'horizontal')
            const response = board.attack(4, 3)
            expect(response.isShip).toBe(true)
        })
        test('when hitting tail of a vertical  ship', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'vertical')
            const response = board.attack(2, 5)
            expect(response.isShip).toBe(true)
        })
    })
    describe('responds is not sunk', () => {
        test('when missing a ship', () => {
            const board = new Board()
            board.place(new Ship(2), 2, 3, 'vertical')
            const response = board.attack(4, 5)
            expect(response.isSunk).toBe(false)
        })
        test('when hitting but not destroying a ship', () => {
            const board = new Board()
            board.place(new Ship(2), 2, 3, 'vertical')
            const response = board.attack(2, 3)
            expect(response.isSunk).toBe(false)
        })
    })
    describe('responds is sunk', () => {
        test('when sinking a ship', () => {
            const board = new Board()
            board.place(new Ship(2), 2, 3, 'vertical')
            board.attack(2, 3)
            const response = board.attack(2, 4)
            expect(response.isSunk).toBe(true)
        })
    })
})

describe('allAreSunk', () => {
    describe('returns false', () => {
        test('for empty board', () => {
            const board = new Board()
            expect(board.allAreSunk).toBe(false)
        })
        test('for non-empty board without attacks', () => {
            const board = new Board()
            board.place(new Ship(3), 1, 3, 'horizontal')
            expect(board.allAreSunk).toBe(false)
        })
        test('when previous attacks all missed', () => {
            const board = new Board()
            board.place(new Ship(3), 1, 3, 'horizontal')
            board.attack(2, 4)
            board.attack(5, 8)
            board.attack(1, 1)
            expect(board.allAreSunk).toBe(false)
        })
        test('when ship got hit but not destroyed', () => {
            const board = new Board()
            board.place(new Ship(3), 1, 3, 'horizontal')
            board.attack(1, 3)
            board.attack(1, 5)
            expect(board.allAreSunk).toBe(false)
        })
        test('when one ship got destroyed but another did not', () => {
            const board = new Board()
            board.place(new Ship(3), 1, 3, 'horizontal')
            board.place(new Ship(2), 6, 7, 'vertical')
            board.attack(1, 3)
            board.attack(1, 4)
            board.attack(1, 5)
            expect(board.allAreSunk).toBe(false)
        })
    })
    describe('returns true', () => {
        test('when the only ship got destroyed', () => {
            const board = new Board()
            board.place(new Ship(3), 1, 3, 'horizontal')
            board.attack(1, 3)
            board.attack(2, 3)
            board.attack(3, 3)
            expect(board.allAreSunk).toBe(true)
        })
    })
})