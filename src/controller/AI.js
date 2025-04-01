import { Board } from "../model/Board"
import { Ship } from "../model/Ship"

/*
 * @typedef {Object} Candidate
 * @property {number} x
 * @property {number} y
 * @property {number} evaluation
 */

/**
 * Finds the best coordinates to attack for the current state of the board.
 *
 * This is done by evaluating the importance of all the remaining coordinates
 * and returning the ones with the highest evaluation.
 * @param {Board} board
 * @returns {{x: number, y: number}}
 */
export function findBestTargets(board) {
    const candidates = []
    let bestEvaluation = -Infinity

    for (let x = 0; x < Board.Size; x++) {
        for (let y = 0; y < Board.Size; y++) {
            if (board.getState(x, y) === 'fog') {
                const evaluation = evaluate(board, x, y)
                bestEvaluation = Math.max(bestEvaluation, evaluation)
                candidates.push({ x, y, evaluation })
            }
        }
    }

    return candidates
        .filter(c => c.evaluation === bestEvaluation)
        .map(({ x, y }) => ({ x, y }))
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function evaluate(board, x, y) {
    if (mustBeWater(board, x, y)) {
        return -Infinity
    }

    if (directNeighborIsHit(board, x, y)) {
        return Infinity
    }

    return calculateTotalCapacity(board, x, y)
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function mustBeWater(board, x, y) {
    const smallestLength = Math.min(...getShipLengthsInPlay(board))

    return diagonalNeighborIsHit(board, x, y)
        || calculateCapacity(board, x, y, smallestLength) === 0
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function directNeighborIsHit(board, x, y) {
    return x > 0 && isHit(board, x - 1, y)
        || y > 0 && isHit(board, x, y - 1)
        || x < Board.Size - 1 && isHit(board, x + 1, y)
        || y < Board.Size - 1 && isHit(board, x, y + 1)
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function diagonalNeighborIsHit(board, x, y) {
    return x > 0 && y > 0 && isHit(board, x - 1, y - 1)
        || x > 0 && y < Board.Size - 1 && isHit(board, x - 1, y + 1)
        || y > 0 && x < Board.Size - 1 && isHit(board, x + 1, y - 1)
        || x < Board.Size - 1 && y < Board.Size - 1 && isHit(board, x + 1, y + 1)
}

/**
 * Calculates how many ways there are to fit any of the remaining ships
 * through the given coordinate, weighted by the length of the respective ship.
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function calculateTotalCapacity(board, x, y) {
    let capacity = 0

    for (const length of getShipLengthsInPlay(board)) {
        capacity += calculateCapacity(board, x, y, length)  * length
    }

    return capacity
}

/**
 * Calculates how many ways there are to fit a ship
 * with the given length through the given coordinate.
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 * @param {number} length
 */
function calculateCapacity(board, x, y, length) {
    if (length < Ship.minLength || length > Ship.maxLength) {
        throw new Error('Length out of bounds: ' + length)
    }

    const leftEnd = Math.max(0, x - length + 1)
    const topEnd = Math.max(0, y - length + 1)
    const rightEnd = Math.min(9, x + length - 1)
    const bottomEnd = Math.min(9, y + length - 1)

    let longest = 0
    let current = 0

    for (let i = leftEnd; i <= rightEnd; i++) {
        const state = board.getState(i, y)
        if (state === 'fog' || state === 'hit') {
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
        if (state === 'fog' || state === 'hit') {
            longest = ++current > longest ? current : longest
        } else {
            current = 0
        }
    }

    const verticalCapacity = Math.max(0, longest - length + 1)

    return Math.max(0, horizontalCapacity + verticalCapacity)
}

/*
 * @param {Board} board
 */
function getShipLengthsInPlay(board) {
    return board.ships.filter(s => !s.isSunk).map(s => s.length)
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function isHit(board, x, y) {
    return board.getState(x, y) === "hit"
}
