/*
 * @param {Ship[]} ships
 * @param {HTMLDivElement} divShips
 */
export function initializeShips(ships, divShips) {
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

/*
 * @param {Ship[]} ships
 * @param {HTMLDivElement} divShips
 */
export function updateShips(ships, divShips) {
    for (let id = 0; id < ships.length; id++) {
        if (ships[id].isSunk) {
            const divShip = divShips.querySelector(`.ship[data-id="${id}"`)
            divShip.classList.add('ship--sunk')
        }
    }
}
