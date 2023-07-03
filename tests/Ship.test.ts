import { Ship } from "../src/model/Ship"

describe('constructor', () => {
    describe('throws an error', () => {
        test('when provided length is too small', () => {
            expect(() => new Ship(0)).toThrow()
            expect(() => new Ship(-1)).toThrow()
        })
        test('when provided length is too large', () => {
            expect(() => new Ship(6)).toThrow()
        })
    })
})

describe('length', () => {
    test('returns length provided in constructor', () => {
        const length = 4
        const ship = new Ship(length)
        expect(ship.length).toBe(4)
    })
})

describe('isSunk', () => {
    describe('is false', () => {
        test('for a brand new ship', () => {
            const ship = new Ship(1)
            expect(ship.isSunk).toBe(false)
        })
        test('for a ship that has not gotten hit everywhere', () => {
            const ship = new Ship(3)
            ship.hit()
            expect(ship.isSunk).toBe(false)
        })
    })
    describe('is true', () => {
        test('once a ship got hit along all its length', () => {
            const ship = new Ship(3)
            ship.hit()
            expect(ship.isSunk).toBe(false)
            ship.hit()
            expect(ship.isSunk).toBe(false)
            ship.hit()
            expect(ship.isSunk).toBe(true)
        })
    })
})