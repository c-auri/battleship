import { Board } from "../ts/model/Board"
import { initializeShips, updateShips } from "./Ships"
import { uncover } from "./Uncover"

const divSide = document.querySelector('#player-side') as HTMLDivElement
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
    divSide.classList.add('transparent')

    cells = Array.from(divBoard.querySelectorAll('.cell'))
}

export function setPlayerTransparency(isTransparent: boolean) {
    if (isTransparent) {
        divSide.classList.add('transparent')
    } else {
        divSide.classList.remove('transparent')
    }
}

export function updatePlayerSide(board: Board, x: number, y: number) {
    updateCell(board, x, y)
    updateShips(board.ships, divShips)
}

function updateCell(board: Board, x: number, y: number) {
    const cell = getCell(x, y)
    const state = board.getState(x, y)

    if (state === 'hit' || state === 'sunk') {
        cell.classList.add('cell--ship')
        cell.classList.add('cell--player')

        if (state === 'sunk') {
            uncover(board, cells, cell)
        }
    } else if (state === 'water') {
        cell.classList.add('water')
    }

    cell.classList.add('cell--cleared')
}

function getCell(x: number, y: number) {
    return cells.find(cell =>
        cell.getAttribute('data-x') === ''+x &&
        cell.getAttribute('data-y') === ''+y) as HTMLDivElement
}