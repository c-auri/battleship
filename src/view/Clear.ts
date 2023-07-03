import { Board } from "../model/Board"

export function clear(board: Board, cells: Element[], target: Element) {
    if (target.classList.contains('cell--sunk')) {
        return
    }

    target.classList.add('cell--cleared')
    target.classList.remove('cell--clickable')

    if (target.classList.contains('cell--hit')) {
        target.classList.add('cell--sunk')
        const neighbors = cells.filter(cell => areNeighbors(target, cell))
        neighbors.forEach(neighbor => clear(board, cells, neighbor))
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