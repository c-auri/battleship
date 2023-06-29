import { Board } from "../ts/model/Board"
import { Ship } from "../ts/model/Ship"

const divBoard = document.querySelector('#computer-board') as HTMLDivElement
const board = new Board()

export function initializeComputerBoard() {
    board.place(new Ship(4), 4, 5, 'horizontal')
    board.place(new Ship(2), 2, 2, 'vertical')

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.setAttribute('data-x', '' + j)
            cell.setAttribute('data-y', '' + i)
            if (board.isShip(j, i)) {
                cell.classList.add('ship')
                cell.classList.add('ship--player')
            }
            divBoard?.appendChild(cell)
        }
    }
}