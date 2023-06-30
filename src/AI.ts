import { Board } from "./ts/model/Board"

export function findTarget(board: Board) {
    let x: number
    let y: number

    do {
        x = Math.round(Math.random() * 9)
        y = Math.round(Math.random() * 9)
    } while(board.gotAttacked(x, y))

    return { x, y }
}