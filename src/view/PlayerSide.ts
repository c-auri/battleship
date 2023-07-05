import { updateCell } from "./Cells"
import { Board } from "../model/Board"
import { initializeShips, updateShips } from "./Ships"

const divBoard = document.querySelector('#player-board') as HTMLDivElement
const divShips = document.querySelector('#player-ships') as HTMLDivElement

let cells: Element[]

export function initializePlayerSide(board: Board) {
    divBoard.innerHTML = ''

    for (let y = 0; y < Board.Size; y++) {
        for (let x = 0; x < Board.Size; x++) {
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

    cells = Array.from(divBoard.querySelectorAll('.cell'))
}

export function updatePlayerSide(board: Board, x: number, y: number) {
    updateCell(board, cells, x, y)
    updateShips(board.ships, divShips)
}