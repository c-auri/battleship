import { Board } from "../ts/model/Board"
import { Ship } from "../ts/model/Ship"
import { uncover } from "./Uncover"

const divBoard = document.querySelector('#computer-board') as HTMLDivElement
const board = new Board()
let cells: Element[]

export function initializeComputerBoard() {
    board.place(new Ship(4), 4, 5, 'horizontal')
    board.place(new Ship(2), 2, 2, 'vertical')

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.classList.add('cell--inactive')
            cell.setAttribute('data-x', '' + x)
            cell.setAttribute('data-y', '' + y)
            if (board.isShip(x, y)) {
                cell.classList.add('ship')
                cell.classList.add('ship--player')
            }
            divBoard?.appendChild(cell)
        }
    }

    cells = Array.from(divBoard.querySelectorAll('.cell'))
}

export function computerWon() {
    return board.allAreSunk
}

export function toggleComputerBoard() {
    for (const cell of cells) {
        cell.classList.toggle('cell--inactive')
    }
}

export function attackPlayer() {
    let x: number
    let y: number

    do {
        x = Math.round(Math.random() * 9)
        y = Math.round(Math.random() * 9)
    } while(board.gotAttacked(x, y))

    return attack(x, y)
}

function attack(x: number, y: number) {
    const cell = getCell(x, y)
    const response = board.attack(+x, +y)

    if (response.isShip) {
        cell.classList.add('ship')
        cell.classList.add('ship--player')

        if (response.isSunk) {
            uncover(board, cells, cell)
        }
    } else {
        cell.classList.add('water')
    }

    cell.classList.add('cell--attacked')

    return board.allAreSunk
}

function getCell(x: number, y: number) {
    return cells.find(cell =>
        cell.getAttribute('data-x') === ''+x &&
        cell.getAttribute('data-y') === ''+y) as HTMLDivElement
}