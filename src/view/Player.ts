import { Board } from "../ts/model/Board"
import { initializeShips, updateShips } from "./Ships"
import { uncover } from "./Uncover"

const divSide = document.querySelector('#player-side') as HTMLDivElement
const divBoard = document.querySelector('#player-board') as HTMLDivElement
const divShips = document.querySelector('#player-ships') as HTMLDivElement

let board: Board
let cells: Element[]

export function initializePlayer(shipLengths: number[]) {
    divBoard.innerHTML = ''
    board = new Board()
    board.randomize(shipLengths)

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.setAttribute('data-x', '' + x)
            cell.setAttribute('data-y', '' + y)
            if (board.isShip(x, y)) {
                cell.classList.add('cell--ship')
                cell.classList.add('cell--player')
            }
            divBoard?.appendChild(cell)
        }
    }

    initializeShips(board.ships, divShips)
    divSide.classList.add('transparent')

    cells = Array.from(divBoard.querySelectorAll('.cell'))
}

export function computerWon() {
    return board.allAreSunk
}

export function setPlayerTransparency(isTransparent: boolean) {
    if (isTransparent) {
        divSide.classList.add('transparent')
    } else {
        divSide.classList.remove('transparent')
    }
}

export function attackPlayer() {
    let x: number
    let y: number

    do {
        x = Math.round(Math.random() * 9)
        y = Math.round(Math.random() * 9)
    } while(board.gotAttacked(x, y))

    const wasHit = attack(x, y)
    updateShips(board.ships, divShips)

    return wasHit
}

function attack(x: number, y: number) {
    const cell = getCell(x, y)
    const response = board.attack(+x, +y)

    if (response.isShip) {
        cell.classList.add('cell--ship')
        cell.classList.add('cell--player')

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