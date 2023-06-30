import { findTarget } from "../src/AI";
import { Board } from "../src/ts/model/Board";
import { Ship } from "../src/ts/model/Ship";

describe('findTarget', () => {
    describe('returns ship coordinate', () => {
        test('when previous hit has only one unknown neighbor', () => {
            const board = new Board()
            board.place(new Ship(3), 0, 0, 'horizontal')
            board.attack(0, 0)
            board.attack(0, 1)
            expect(findTarget(board)).toEqual({ x: 1, y: 0 })
        })
    })
})