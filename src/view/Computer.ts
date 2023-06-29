import { handleGameOver, makeComputerMove } from "../Controller"
import { Board } from "../ts/model/Board"
import { initializeShips, updateShips } from "./Ships"
import { uncover } from "./Uncover"

const divSide = document.querySelector('#computer-side') as HTMLDivElement
const divBoard = document.querySelector('#computer-board') as HTMLDivElement
const divShips = document.querySelector('#computer-ships') as HTMLDivElement

let board: Board
let cells: Element[]

export function initializeComputer(shipLengths: number[]) {
    divBoard.innerHTML = ''
    board = new Board()
    board.randomize(shipLengths)

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

    initializeShips(board.ships, divShips)
    divSide.setAttribute('data-active', 'true')

    cells = Array.from(divBoard.querySelectorAll('.cell'))
}

export function playerWon() {
    return board.allAreSunk
}

export function setComputerOpacity(isOpaque: boolean) {
    if (isOpaque) {
        divSide.classList.add('opaque')
    } else {
        divSide.classList.remove('opaque')
    }
}

export function setPlayerActivity(value: boolean) {
    divSide.setAttribute('data-active', '' + value)
}

function attack(event: Event) {
    const cell = event.target as Element

    if (divSide.getAttribute('data-active') === "false" || cell.classList.contains('cell--attacked')) {
        return
    }

    const x = cell.getAttribute('data-x') as string
    const y = cell.getAttribute('data-y') as string

    const response = board.attack(+x, +y)

    if (response.isShip) {
        cell.classList.add('cell--ship')

        if (response.isSunk) {
            uncover(board, cells, cell)
        }
    } else {
        cell.classList.add('water')
    }

    cell.classList.add('cell--attacked')
    updateShips(board.ships, divShips)

    if (board.allAreSunk) {
        handleGameOver()
    } else {
        makeComputerMove()
    }
}