import { Ship } from "../model/Ship";

export function initializeShips(ships: Ship[], divShips: HTMLDivElement) {
    divShips.innerHTML = ''

    for (let id = 0; id < ships.length; id++) {
        const divShip = document.createElement('div')
        divShip.classList.add('ship')
        divShip.setAttribute('data-id', ""+id)
        divShips.appendChild(divShip)

        for (let i = 0; i < ships[id].length; i++) {
            const square = document.createElement('div')
            square.classList.add('square')
            divShip.appendChild(square)
        }
    }
}

export function updateShips(ships: Ship[], divShips: HTMLDivElement) {
    for (let id = 0; id < ships.length; id++) {
        if (ships[id].isSunk) {
            const divShip = divShips.querySelector(`.ship[data-id="${id}"`) as HTMLDivElement
            divShip.classList.add('ship--sunk')
        }
    }
}