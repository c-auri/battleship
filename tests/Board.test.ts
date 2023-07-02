import { Board } from "../src/ts/model/Board"
import { Ship } from "../src/ts/model/Ship"

describe('constructor', () => {
    test('does not throw', () => {
        expect(() => new Board()).not.toThrow()
    })
})

describe('allAreSunk', () => {
    describe('returns true', () => {
        test('for empty board', () => {
            const board = new Board()
            expect(board.allAreSunk).toBe(true)
        })
        test('when the only ship got destroyed', () => {
            const board = new Board()
            board.place(new Ship(3), 1, 3, 'horizontal')
            board.attack(1, 3)
            board.attack(2, 3)
            board.attack(3, 3)
            expect(board.allAreSunk).toBe(true)
        })
    })
    describe('returns false', () => {
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
})

describe('place', () => {
    describe('throws an error', () => {
        test('when coordinates are out of bounds', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, -1, 3, 'horizontal'))
                .toThrow('Invalid coordinate')
            expect(() => board.place(ship, 10, 3, 'horizontal'))
                .toThrow('Invalid coordinate')
            expect(() => board.place(ship, 3, -1, 'horizontal'))
                .toThrow('Invalid coordinate')
            expect(() => board.place(ship, 3, 10, 'horizontal'))
                .toThrow('Invalid coordinate')
        })
        test('when horizontal ship is placed too far right', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, 7, 3, 'horizontal'))
                .toThrow('Invalid ship placement')
        })
        test('when vertical ship is placed too far down', () => {
            const board = new Board()
            const ship = new Ship(4)
            expect(() => board.place(ship, 3, 7, 'vertical'))
                .toThrow('Invalid ship placement')
        })
        test('when ship is placed on top of existing ship\s head', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 3, 3, 'horizontal')
            expect(() => board.place(newShip, 3, 3, 'vertical'))
                .toThrow('Invalid ship placement')
        })
        test('when ship is placed on top of existing ship\s body', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 3, 3, 'horizontal')
            expect(() => board.place(newShip, 5, 3, 'vertical'))
                .toThrow('Invalid ship placement')
        })
        test('when ship is placed on top of existing ship\'s tail', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 3, 3, 'horizontal')
            expect(() => board.place(newShip, 6, 3, 'vertical'))
                .toThrow('Invalid ship placement')
        })
        test('when horizontal ship is placed directly above to existing ship', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 5, 3, 'vertical')
            expect(() => board.place(newShip, 2, 2, 'horizontal'))
                .toThrow('Invalid ship placement')
        })
        test('when horizontal ship is placed directly below to existing ship', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 5, 3, 'vertical')
            expect(() => board.place(newShip, 3, 7, 'horizontal'))
                .toThrow('Invalid ship placement')
        })
        test('when horizontal ship is placed directly left to existing ship', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 5, 3, 'vertical')
            expect(() => board.place(newShip, 1, 4, 'horizontal'))
                .toThrow('Invalid ship placement')
        })
        test('when horizontal ship is placed directly right to existing ship', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 5, 3, 'vertical')
            expect(() => board.place(newShip, 6, 4, 'horizontal'))
                .toThrow('Invalid ship placement')
        })
        test('when vertical ship is placed directly above existing ship', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 3, 6, 'horizontal')
            expect(() => board.place(newShip, 4, 2, 'vertical'))
                .toThrow('Invalid ship placement')
        })
        test('when vertical ship is placed directly below existing ship', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 3, 3, 'horizontal')
            expect(() => board.place(newShip, 4, 4, 'vertical'))
                .toThrow('Invalid ship placement')
        })
        test('when vertical ship is placed directly left to existing ship', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 2, 2, 'horizontal')
            expect(() => board.place(newShip, 1, 0, 'vertical'))
                .toThrow('Invalid ship placement')
        })
        test('when vertical ship is placed directly right to existing ship', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 2, 2, 'horizontal')
            expect(() => board.place(newShip, 6, 0, 'vertical'))
                .toThrow('Invalid ship placement')
        })
        test('when ship is placed into cross neighborhood of existing ship', () => {
            const board = new Board()
            const existingShip = new Ship(4)
            const newShip = new Ship(4)
            board.place(existingShip, 2, 2, 'horizontal')
            expect(() => board.place(newShip, 6, 3, 'vertical'))
                .toThrow('Invalid ship placement')
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
        test('when ship is placed in top left corner', () => {
            const board = new Board()
            expect(() => board.place(new Ship(3), 0, 0, 'horizontal'))
        })
        test('when ship is placed in top right corner', () => {
            const board = new Board()
            expect(() => board.place(new Ship(3), 9, 0, 'vertical'))
        })
        test('when ship is placed in bottom left corner', () => {
            const board = new Board()
            expect(() => board.place(new Ship(3), 9, 9, 'horizontal'))
        })
        test('when ship is placed in bottom right corner', () => {
            const board = new Board()
            expect(() => board.place(new Ship(3), 9, 7, 'vertical'))
        })
    })
})

describe('getState', () => {
    describe('throws an error', () => {
        test('when coordinates are out of bounds', () => {
            const board = new Board()
            expect(() => board.getState(-1, 0)).toThrow('Invalid coordinate')
            expect(() => board.getState(0, -1)).toThrow('Invalid coordinate')
            expect(() => board.getState(Board.Size, 0)).toThrow('Invalid coordinate')
            expect(() => board.getState(0, Board.Size)).toThrow('Invalid coordinate')
        })
    })
    describe('returns unknown', () => {
        test('when nothing has been attacked yet', () => {
            const board = new Board()
            expect(board.getState(2, 2)).toBe('unknown')
        })
        test('when coordinate has not been attacked', () => {
            const board = new Board()
            board.place(new Ship(3), 2, 3, 'horizontal')
            board.attack(7, 8)
            expect(board.getState(2, 3)).toBe('unknown')
        })
    })
    describe('returns miss', () => {
        test('if coordinate was attacked before and there is no ship there', () => {
            const board = new Board()
            board.attack(2, 2)
            expect(board.getState(2, 2)).toBe('miss')
        })
    })
    describe('returns hit', () => {
        test('if coordinate was attacked before and there is a ship there', () => {
            const board = new Board()
            board.place(new Ship(2), 2, 2, 'horizontal')
            board.attack(2, 2)
            expect(board.getState(2, 2)).toBe('hit')
        })
    })
    describe('returns sunk', () => {
        test('if coordinate was attacked before and there is a sunken ship there', () => {
            const board = new Board()
            board.place(new Ship(2), 2, 2, 'horizontal')
            board.attack(2, 2)
            board.attack(3, 2)
            expect(board.getState(2, 2)).toBe('sunk')
            expect(board.getState(3, 2)).toBe('sunk')
        })
    })
})

describe('attack', () => {
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
})