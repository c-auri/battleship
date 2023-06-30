import { Board } from "./ts/model/Board"

type Candidate = { x: number, y: number, value: number }

export function findBestTargets(board: Board): { x: number, y: number }[] {
    const candidates: Candidate[] = []
    let best = -1

    for (let x = 0; x < Board.Size; x++) {
        for (let y = 0; y < Board.Size; y++) {
            if (board.getState(x, y) === 'unknown') {
                const value = evaluate(board, x, y)

                if (value > best) {
                    best = value
                }

                candidates.push({ x, y, value })
            }
        }
    }

    return candidates
        .filter(c => c.value === best)
        .map(({ x, y }) => ({ x, y }))
}

function evaluate(board: Board, x: number, y: number) {

    if (directNeighborIsHit(board, x, y)) {
        return 100
    } else {
        return 1
    }
}

function directNeighborIsHit(board: Board, x: number, y: number) {
    return x > 0 && isHit(board, { x: x - 1, y: y })
        || y > 0 && isHit(board, { x: x, y: y - 1 })
        || x < Board.Size - 1 && isHit(board, { x: x + 1, y: y })
        || y < Board.Size - 1 && isHit(board, { x: x, y: y + 1 })
}

function isHit(board: Board, coordinate: { x: number, y: number }) {
    return board.getState(coordinate.x, coordinate.y) === "hit"
}