import { Board } from "./ts/model/Board"
import { Ship } from "./ts/model/Ship"

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
    const descendingLengths = board.ships
        .filter(s => !s.isSunk)
        .map(s => s.length)
        .sort()
        .reverse()

    if (diagonalNeighborIsHit(board, x, y) ||
        !fits(board, x, y, descendingLengths.slice(-1)[0])
    ) {
        return -1
    } else if (directNeighborIsHit(board, x, y)) {
        return 100
    } else {
        let numberOfFits = 0

        for (const length of descendingLengths) {
            numberOfFits += fits(board, x, y, length) ? length : 0
        }

        return numberOfFits
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

function isHit(board: Board, coordinate: { x: number, y: number }) {
    return board.getState(coordinate.x, coordinate.y) === "hit"
}

function fits(
    board: Board,
    x: number,
    y: number,
    length: number
) {
    if (length < Ship.minLength || length > Ship.maxLength) {
        throw new Error('Length out of bounds')
    }

    const leftEnd = Math.max(0, x - length + 1)
    const topEnd = Math.max(0, y - length + 1)
    const rightEnd = Math.min(9, x + length - 1)
    const bottomEnd = Math.min(9, y + length - 1)

    let longest = 0
    let current = 0

    for (let i = leftEnd; i <= rightEnd; i++) {
        const state = board.getState(i, y)
        if (state === 'unknown' || state === 'hit') {
            longest = ++current > longest ? current : longest
        } else {
            current = 0
        }
    }

    current = 0

    for (let j = topEnd; j <= bottomEnd; j++) {
        const state = board.getState(x, j)
        if (state === 'unknown' || state === 'hit') {
            longest = ++current > longest ? current : longest
        } else {
            current = 0
        }
    }

    return longest >= length
}