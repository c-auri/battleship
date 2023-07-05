import { Board } from "../model/Board"

export function updateCell(board: Board, cells: Element[], x: number, y: number) {
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

function getCell(cells: Element[], x: number, y: number) {
    return cells.find(cell =>
        cell.getAttribute('data-x') === ''+x &&
        cell.getAttribute('data-y') === ''+y) as HTMLDivElement
}

/**
 * Recursively updates sunken ships and uncovers the surrounding water.
 */
function clearCell(board: Board, cells: Element[], target: Element) {
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

function areNeighbors(thisCell: Element, thatCell: Element) {
    const thisX = thisCell.getAttribute('data-x') as string
    const thisY = thisCell.getAttribute('data-y') as string
    const thatX = thatCell.getAttribute('data-x') as string
    const thatY = thatCell.getAttribute('data-y') as string

    return Math.abs(+thisX - +thatX) <= 1
        && Math.abs(+thisY - +thatY) <= 1
}