import './styles.scss'
import { Ship } from './ts/model/Ship'
import { Board } from './ts/model/Board'

const divBoard = document.querySelector('.board')
const board = new Board()
const cells = Array.from(document.querySelectorAll('.cell'))

board.place(new Ship(4), 4, 5, 'horizontal')


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