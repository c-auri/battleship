import { attackComputer } from "../Controller"
import { Board } from "../ts/model/Board"
import { initializeShips, updateShips } from "./Ships"
import { uncover } from "./Uncover"

const divSide = document.querySelector('#computer-side') as HTMLDivElement
const divBoard = document.querySelector('#computer-board') as HTMLDivElement
const divShips = document.querySelector('#computer-ships') as HTMLDivElement

let board: Board
let cells: Element[]
let playerIsActive: boolean

export function initializeComputer(board: Board) {
    divBoard.innerHTML = ''

    for (let y = 0; y < Board.Size; y++) {
        for (let x = 0; x < Board.Size; x++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.setAttribute('data-x', '' + x)
            cell.setAttribute('data-y', '' + y)
            cell.addEventListener('click', initializeAttack)
            divBoard?.appendChild(cell)
        }
    }

    initializeShips(board.ships, divShips)
    divSide.setAttribute('data-active', 'true')
    playerIsActive = true

    cells = Array.from(divBoard.querySelectorAll('.cell'))
}

export function playerWon() {
    return board.allAreSunk
}

export function setComputerTransparency(isTransparent: boolean) {
    if (isTransparent) {
        divSide.classList.add('transparent')
    } else {
        divSide.classList.remove('transparent')
    }
}

export function setPlayerActivity(isActive: boolean) {
    playerIsActive = isActive
    divSide.setAttribute('data-active', '' + isActive)
}

function initializeAttack(event: Event) {
    const cell = event.target as Element

    if (!playerIsActive || cell.classList.contains('cell--attacked')) {
        return
    }

    const x = cell.getAttribute('data-x') as string
    const y = cell.getAttribute('data-y') as string

    attackComputer(+x, +y)
}

export function updateComputerSide(board: Board, x: number, y: number) {
    const state = board.getState(x, y)
    const cell = getCell(x, y)

    if (state === 'hit' || state === 'sunk') {
        cell.classList.add('cell--ship')

        if (state === 'sunk') {
            uncover(board, cells, cell)
        }
    }

    if (state === 'miss') {
        cell.classList.add('water')
    }

    cell.classList.add('cell--attacked')
    updateShips(board.ships, divShips)
}

function getCell(x: number, y: number) {
    return cells.find(cell =>
        cell.getAttribute('data-x') === ''+x &&
        cell.getAttribute('data-y') === ''+y) as HTMLDivElement
}