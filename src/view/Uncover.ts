import { Board } from "../ts/model/Board"

export function uncover(board: Board, cells: Element[], target: Element) {
    if (target.classList.contains('ship--sunk')) {
        return
    }

    if (target.classList.contains('ship')) {
        target.classList.add('ship--sunk')
        const neighbors = cells.filter(cell => areNeighbors(target, cell))
        neighbors.forEach(neighbor => uncover(board, cells, neighbor))
    } else if (!target.classList.contains('water')) {
        target.classList.add('water')
        const coordinates = getCoordinates(target)
        const response = board.attack(coordinates.x, coordinates.y)

        if (response.isShip || response.isSunk) {
            throw Error('Uncovered unexpected ship')
        }
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

function getCoordinates(cell: Element) {
    return {
        x: +(cell.getAttribute('data-x') as string),
        y: +(cell.getAttribute('data-y') as string)
    }
}