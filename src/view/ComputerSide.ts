import { attackComputer } from "../controller/Game"
import { updateCell } from "./Cells"
import { Board } from "../model/Board"
import { initializeShips, updateShips } from "./Ships"

const divBoard = document.querySelector('#computer-board') as HTMLDivElement
const divShips = document.querySelector('#computer-ships') as HTMLDivElement

let cells: Element[]

export function initializeComputerSide(board: Board) {
    divBoard.innerHTML = ''

    for (let y = 0; y < Board.Size; y++) {
        for (let x = 0; x < Board.Size; x++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.setAttribute('data-x', '' + x)
            cell.setAttribute('data-y', '' + y)
            cell.classList.add('cell--clickable')
            cell.addEventListener('click', attack)
            divBoard?.appendChild(cell)
        }
    }

    initializeShips(board.ships, divShips)

    cells = Array.from(divBoard.querySelectorAll('.cell'))
}

export function updateComputerSide(board: Board, x: number, y: number) {
    updateCell(board, cells, x, y)
    updateShips(board.ships, divShips)
}

export function deactivateComputerSide() {
    cells.forEach(cell => cell.classList.remove('cell--clickable'))
}

function attack(event: Event) {
    const cell = event.target as Element

    if (!cell.classList.contains('cell--clickable')) {
        return
    }

    const x = cell.getAttribute('data-x') as string
    const y = cell.getAttribute('data-y') as string

    attackComputer(+x, +y)
}