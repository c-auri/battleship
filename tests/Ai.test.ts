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