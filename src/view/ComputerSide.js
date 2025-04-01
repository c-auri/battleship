import { attackComputer } from "../controller/Game"
import { updateCell } from "./Cells"
import { Board } from "../model/Board"
import { initializeShips, updateShips } from "./Ships"

const divBoard = document.querySelector('#computer-board')
const divShips = document.querySelector('#computer-ships')

/** @type {Element[]} cells */
let cells

/*
 * @param {Board} board
 */
export function initializeComputerSide(board) {
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

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
export function updateComputerSide(board, x, y) {
    updateCell(board, cells, x, y)
    updateShips(board.ships, divShips)
}

export function deactivateComputerSide() {
    cells.forEach(cell => cell.classList.remove('cell--clickable'))
}

/*
 * @param {Event} event
 */
function attack(event) {
    const cell = event.target

    if (!cell.classList.contains('cell--clickable')) {
        return
    }

    const x = cell.getAttribute('data-x')
    const y = cell.getAttribute('data-y')

    attackComputer(+x, +y)
}
