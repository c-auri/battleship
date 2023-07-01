import { Board } from "./ts/model/Board"
import { Ship } from "./ts/model/Ship"

type Candidate = { x: number, y: number, evaluation: number }

/**
 * Finds the best candidates to attack in the next round.
 *
 * This is done by evaluating the importance of all the remaining coordinates
 * and returning the ones with the highest evaluation.
 */
export function findBestTargets(board: Board): { x: number, y: number }[] {
    const candidates: Candidate[] = []
    let bestEvaluation = -Infinity

    for (let x = 0; x < Board.Size; x++) {
        for (let y = 0; y < Board.Size; y++) {
            if (board.getState(x, y) === 'unknown') {
                const evaluation = evaluate(board, x, y)

                if (evaluation > bestEvaluation) {
                    bestEvaluation = evaluation
                }

                candidates.push({ x, y, evaluation })
            }
        }
    }

    return candidates
        .filter(c => c.evaluation === bestEvaluation)
        .map(({ x, y }) => ({ x, y }))
}

/**
 * Estimates the importance of the given coordinate.
 *
 * First checks whether it is impossible for the coordinate to hold a ship
 * or whether there have been hits in the direct neighborhood.
 * If neither is the case, then it estimates the importance
 * based on the capacity of the coordinate to hold one of the remaining ships.
 */
function evaluate(board: Board, x: number, y: number) {
    const lengthsInPlayDescending = board.ships
        .filter(s => !s.isSunk)
        .map(s => s.length)
        .sort()
        .reverse()

    const smallestLengthInPlay = lengthsInPlayDescending.slice(-1)[0]

    if (!fits(board, x, y, smallestLengthInPlay) ||
        diagonalNeighborIsHit(board, x, y)
    ) {
        return -Infinity
    }

    if (directNeighborIsHit(board, x, y)) {
        return Infinity
    }

    let capacity = 0

    for (const length of lengthsInPlayDescending) {
        capacity += calculateCapacity(board, x, y, length)  * length
    }

    return capacity
}

/**
 * Checks whether the given coordinate can hold a ship of the given length.
 */
function fits(board: Board, x: number, y: number, length: number) {
    return calculateCapacity(board, x, y, length) > 0
}

/**
 * Calculates how many ways there are to fit a ship
 * with the given length through the given coordinate.
 */
function calculateCapacity(
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

    const horizontalCapacity = Math.max(0, longest - length + 1)

    longest = 0
    current = 0

    for (let j = topEnd; j <= bottomEnd; j++) {
        const state = board.getState(x, j)
        if (state === 'unknown' || state === 'hit') {
            longest = ++current > longest ? current : longest
        } else {
            current = 0
        }
    }

    const verticalCapacity = Math.max(0, longest - length + 1)

    return Math.max(0, horizontalCapacity + verticalCapacity)
}

function diagonalNeighborIsHit(board: Board, x: number, y: number) {
    return x > 0 && y > 0 && isHit(board, x - 1, y - 1)
        || x > 0 && y < Board.Size - 1 && isHit(board, x - 1, y + 1)
        || y > 0 && x < Board.Size - 1 && isHit(board, x + 1, y - 1)
        || x < Board.Size - 1 && y < Board.Size - 1 && isHit(board, x + 1, y + 1)
}

function directNeighborIsHit(board: Board, x: number, y: number) {
    return x > 0 && isHit(board, x - 1, y)
        || y > 0 && isHit(board, x, y - 1)
        || x < Board.Size - 1 && isHit(board, x + 1, y)
        || y < Board.Size - 1 && isHit(board, x, y + 1)
}

function isHit(board: Board, x: number, y: number) {
    return board.getState(x, y) === "hit"
}