import { Board } from "./ts/model/Board"

type Candidate = { x: number, y: number, value: number }

export function findTarget(board: Board) {
    const candidates: Candidate[] = []

    for (let x = 0; x < Board.Size; x++) {
        for (let y = 0; y < Board.Size; y++) {
            if (board.getState(x, y) === 'unknown') {
                const value = evaluate(board, x, y)
                candidates.push({ x, y, value })
            }
        }
    }

    return pickAtRandom(selectBest(candidates))
}

function selectBest(candidates: Candidate[]) {
    const maxValue = Math.max(...candidates.map(c => c.value))
    const result = candidates.filter(c => c.value === maxValue)
    return result
}

function pickAtRandom(candidates: Candidate[]) {
    const maxIndex = candidates.length - 1
    const randomIndex = Math.round(Math.random() * (maxIndex))
    const result = candidates[randomIndex]

    return { x: result.x, y: result.y }
}

function evaluate(board: Board, x: number, y: number) {
    const directNeighbors = getDirectNeighbors(x, y)

    if (directNeighbors.some(neighbor => isHit(board, neighbor))) {
        return 100
    } else {
        return 1
    }
}

function getDirectNeighbors(x: number, y: number) {
    const result: { x: number, y: number }[] = []

    if (x > 0) {
        result.push({ x: x - 1, y: y })
    }

    if (x < Board.Size - 1) {
        result.push({ x: x + 1, y: y })
    }

    if (y > 0) {
        result.push({ x: x, y: y - 1 })
    }

    if (y < Board.Size - 1) {
        result.push({ x: x, y: y + 1 })
    }

    return result
}

function isHit(board: Board, coordinate: { x: number, y: number }) {
    return board.getState(coordinate.x, coordinate.y) === "hit"
}