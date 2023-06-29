import { makeComputerMove } from "../Controller"
import { Board } from "../ts/model/Board"
import { Ship } from "../ts/model/Ship"

const divBoard = document.querySelector('#player-board') as HTMLDivElement
const board = new Board()
let cells: Element[]

export function initializePlayerBoard() {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.setAttribute('data-x', '' + x)
            cell.setAttribute('data-y', '' + y)
            cell.addEventListener('click', attack)
            divBoard?.appendChild(cell)
        }
    }

    cells = Array.from(divBoard.querySelectorAll('.cell'))

    board.place(new Ship(4), 4, 5, 'horizontal')
    board.place(new Ship(2), 2, 2, 'vertical')
}

export function togglePlayerBoard() {
    for (const cell of cells) {
        cell.classList.toggle('cell--inactive')
    }
}

function attack(event: Event) {
    const cell = event.target as Element

    if (cell.classList.contains('cell--inactive') || cell.classList.contains('cell--attacked')) {
        return
    }

    const x = cell.getAttribute('data-x') as string
    const y = cell.getAttribute('data-y') as string

    const response = board.attack(+x, +y)

    if (response.isShip) {
        cell.classList.add('ship')

        if (response.isSunk) {
            uncover(cell)
        }
    } else {
        cell.classList.add('water')
    }

    cell.classList.add('cell--attacked')

    if (board.allAreSunk) {
        uncoverBoard()
    } else {
        makeComputerMove()
    }
}

function uncoverBoard() {
    const remainingCells = cells.filter(cell => !cell.classList.contains('cell--attacked'))

    for (const cell of remainingCells) {
        cell.classList.add('water')
        cell.classList.add('cell--attacked')
    }
}

function uncover(target: Element) {
    if (target.classList.contains('ship--sunk')) {
        return
    }

    if (target.classList.contains('ship')) {
        target.classList.add('ship--sunk')
        const neighbors = cells.filter(cell => areNeighbors(target, cell))
        neighbors.forEach(neighbor => uncover(neighbor))
    } else {
        target.classList.add('water')
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