import { Board } from "../ts/model/Board"
import { Ship } from "../ts/model/Ship"

const divBoard = document.querySelector('#computer-board') as HTMLDivElement
const board = new Board()

export function initializeComputerBoard() {
    board.place(new Ship(4), 4, 5, 'horizontal')
    board.place(new Ship(2), 2, 2, 'vertical')

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.setAttribute('data-x', '' + x)
            cell.setAttribute('data-y', '' + y)
            if (board.isShip(x, y)) {
                cell.classList.add('ship')
                cell.classList.add('ship--player')
            }
            divBoard?.appendChild(cell)
        }
    }
}