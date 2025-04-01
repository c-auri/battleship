import { Board } from "../model/Board"

/*
 * @param {Board} board
 * @param {Element[]} cells
 * @param {number} x
 * @param {number} y
 */
export function updateCell(board, cells, x, y) {
    const cell = getCell(cells, x, y)
    const state = board.getState(x, y)

    if (state === 'hit' || state === 'sunk') {
        cell.classList.add('cell--hit')
    }

    if (state === 'sunk') {
        clearCell(board, cells, cell)
    }
    
    if (state === 'water') {
        cell.classList.add('cell--water')
    }

    cell.classList.add('cell--cleared')
    cell.classList.remove('cell--clickable')
}

/*
 * @param {Element[]} cells
 * @param {number} x
 * @param {number} y
 */
function getCell(cells, x, y) {
    return cells.find(cell =>
        cell.getAttribute('data-x') === ''+x &&
        cell.getAttribute('data-y') === ''+y)
}

/**
 * Recursively updates sunken ships and uncovers the surrounding water.
 * @param {Board} board
 * @param {Element[]} cells
 * @param {Element} target
 */
function clearCell(board, cells, target) {
    if (target.classList.contains('cell--sunk')) {
        return
    }

    target.classList.add('cell--cleared')
    target.classList.remove('cell--clickable')

    if (target.classList.contains('cell--hit')) {
        target.classList.add('cell--sunk')
        const neighbors = cells.filter(cell => areNeighbors(target, cell))
        neighbors.forEach(neighbor => clearCell(board, cells, neighbor))
    } else if (!target.classList.contains('water')) {
        target.classList.add('cell--water')
    }
}

/*
 * @param {Element} thisCell
 * @param {Element} thisCell
 */
function areNeighbors(thisCell, thatCell) {
    const thisX = thisCell.getAttribute('data-x')
    const thisY = thisCell.getAttribute('data-y')
    const thatX = thatCell.getAttribute('data-x')
    const thatY = thatCell.getAttribute('data-y')

    return Math.abs(+thisX - +thatX) <= 1
        && Math.abs(+thisY - +thatY) <= 1
}
