import './styles.scss'
import { Ship } from './ts/model/Ship'
import { Board } from './ts/model/Board'

const divBoard = document.querySelector('.board')
const board = new Board()
board.place(new Ship(4), 4, 5, 'horizontal')
board.place(new Ship(2), 2, 2, 'vertical')


for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('data-x', '' + j)
        cell.setAttribute('data-y', '' + i)
        cell.addEventListener('click', attack)
        divBoard?.appendChild(cell)
    }
}

const cells = Array.from(document.querySelectorAll('.cell'))

function attack(event: Event) {
    const cell = event.target as Element

    if (cell.classList.contains('cell--attacked')) {
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