import { findBestTargets } from "../src/AI";
import { Board } from "../src/ts/model/Board";
import { Ship } from "../src/ts/model/Ship";

describe('findTarget', () => {
    test('targets all neighbors of previous isolated hit', () => {
        const board = new Board()
        board.place(new Ship(3), 3, 3, 'vertical')
        board.attack(3, 3)
        expect(findBestTargets(board).sort(ascending)).toEqual([
            { x: 3, y: 2 },
            { x: 3, y: 4 },
            { x: 2, y: 3 },
            { x: 4, y: 3 },
        ].sort(ascending))
    })
    test('ignores misses next to previous hit', () => {
        const board = new Board()
        board.place(new Ship(3), 3, 3, 'vertical')
        board.attack(3, 3)
        board.attack(2, 3)
        board.attack(3, 2)
        expect(findBestTargets(board).sort(ascending)).toEqual([
            { x: 3, y: 4 },
            { x: 4, y: 3 },
        ].sort(ascending))
    })
    test('ignores diagonal neighbors of previous hit', () => {
        const board = new Board()
        board.place(new Ship(3), 3, 3, 'vertical')
        board.place(new Ship(2), 2, 0, 'vertical')
        board.attack(2, 1)
        board.attack(3, 3)

        expect(findBestTargets(board).sort(ascending)).toEqual([
            { x: 1, y: 1 },
            { x: 2, y: 0 },
            { x: 3, y: 1 },
            { x: 2, y: 3 },
            { x: 3, y: 4 },
            { x: 4, y: 3 },
        ].sort(ascending))
    })
    test('ignores side neighbors of previous hit streak', () => {
        const board = new Board()
        board.place(new Ship(3), 3, 3, 'vertical')
        board.attack(3, 3)
        board.attack(3, 4)
        expect(findBestTargets(board).sort(ascending)).toEqual([
            { x: 3, y: 2},
            { x: 3, y: 5},
        ].sort(ascending))
    })
    test('ignores diagonal neighbors of previous miss', () => {
        const board = new Board()
        board.attack(3, 3)
        expect(findBestTargets(board)).not.toContain({ x: 3, y: 2 })
        expect(findBestTargets(board)).not.toContain({ x: 3, y: 4 })
        expect(findBestTargets(board)).not.toContain({ x: 2, y: 3 })
        expect(findBestTargets(board)).not.toContain({ x: 4, y: 3 })
    })
    test('ignores coordinates that can not fit smallest ship (1)', () => {
        const board = new Board()
        board.place(new Ship(3), 0, 0, 'horizontal')

        for (let x = 0; x < Board.Size; x++) {
            for (let y = 0; y < Board.Size; y++) {
                if ((x + y) % 2 === 0 && !(x < 3 && y === 0)) {
                    board.attack(x, y)
                }
            }
        }

        expect(findBestTargets(board).sort(ascending)).toEqual([
            { x: 0, y: 0},
            { x: 1, y: 0},
            { x: 2, y: 0},
            { x: 3, y: 0},
        ].sort(ascending))
    })
    test('does not ignore end of ship if first coordinate after it is a miss', () => {
        const board = new Board()
        board.place(new Ship(2), 0, 0, 'horizontal')
        board.attack(0, 1)
        board.attack(1, 1)
        board.attack(2, 0)
        board.attack(0, 0)
        expect(findBestTargets(board)).toEqual([{ x: 1, y: 0 }])
    })
})

function ascending(a: { x: number, y: number }, b: { x: number, y: number }) {
    if (a.x === b.x && a.y === b.y) {
        return 0
    }

    if (a.x < b.x || a.x === b.x && a.y < b.y) {
        return -1
    }

    return 1
}