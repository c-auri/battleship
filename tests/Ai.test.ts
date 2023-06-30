import { findBestTargets } from "../src/AI";
import { Board } from "../src/ts/model/Board";
import { Ship } from "../src/ts/model/Ship";

describe('findTarget', () => {
    test('targets all neighbors of previous isolated hit', () => {
        const board = new Board()
        board.place(new Ship(3), 3, 3, 'vertical')
        board.attack(3, 3)
        expect(new Set(findBestTargets(board))).toEqual(new Set([
            { x: 3, y: 2 },
            { x: 3, y: 4 },
            { x: 2, y: 3 },
            { x: 4, y: 3 },
        ]))
    })
    test('ignores misses next to previous hit', () => {
        const board = new Board()
        board.place(new Ship(3), 3, 3, 'vertical')
        board.attack(3, 3)
        board.attack(2, 3)
        board.attack(3, 2)
        expect(new Set(findBestTargets(board))).toEqual(new Set([
            { x: 3, y: 4 },
            { x: 4, y: 3 },
        ]))
    })
})