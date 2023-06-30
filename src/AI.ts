import { Board } from "./ts/model/Board"

type Candidate = { x: number, y: number, value: number }

const rim = Board.Size - 1

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
    if (diagonalNeighborIsHit(board, x, y)) {
        return -1
    } else if (directNeighborIsHit(board, x, y)) {
        return 100
    } else if (directNeighborIsMiss(board, x, y)) {
        return 0
    } else {
        return 1
    }
}

function diagonalNeighborIsHit(board: Board, x: number, y: number) {
    return x > 0 && y > 0 && isHit(board, { x: x - 1, y: y - 1 })
        || x > 0 && y < rim && isHit(board, { x: x - 1, y: y + 1 })
        || y > 0 && x < rim && isHit(board, { x: x + 1, y: y - 1 })
        || x < rim && y < rim && isHit(board, { x: x + 1, y: y + 1 })
}

function directNeighborIsHit(board: Board, x: number, y: number) {
    return x > 0 && isHit(board, { x: x - 1, y: y })
        || y > 0 && isHit(board, { x: x, y: y - 1 })
        || x < rim && isHit(board, { x: x + 1, y: y })
        || y < rim && isHit(board, { x: x, y: y + 1 })
}

function directNeighborIsMiss(board: Board, x: number, y: number) {
    return x > 0 && isMiss(board, { x: x - 1, y: y })
        || y > 0 && isMiss(board, { x: x, y: y - 1 })
        || x < rim && isMiss(board, { x: x + 1, y: y })
        || y < rim && isMiss(board, { x: x, y: y + 1 })
}

function isHit(board: Board, coordinate: { x: number, y: number }) {
    return board.getState(coordinate.x, coordinate.y) === "hit"
}

function isMiss(board: Board, coordinate: { x: number, y: number }) {
    return board.getState(coordinate.x, coordinate.y) === "miss"
}