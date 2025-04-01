class Ship {
    static #MIN_LENGTH = 1
    static #MAX_LENGTH = 5

    static get minLength() {
        return Ship.#MIN_LENGTH
    }

    static get maxLength() {
        return Ship.#MAX_LENGTH
    }

    /** type {number} */
    #length

    /** type {number} */
    #numberOfHits

    /*
     * @param {number} lenght
     */
    constructor(length) {
        if (length < Ship.#MIN_LENGTH || length > Ship.#MAX_LENGTH) {
            throw new Error('Ship length out of bounds: ' + length)
        }
        this.#length = length
        this.#numberOfHits = 0
    }

    get length() {
        return this.#length
    }

    get isSunk() {
        return this.#length <= this.#numberOfHits
    }

    hit() {
        if (!this.isSunk) {
            this.#numberOfHits++
        }
    }
}

const gameOverDialog = document.getElementById('game-over-dialog')
const closeButton = document.getElementById('close-button')
const resultSpan = document.getElementById('result')
const newGameButton = document.getElementById('new-game-button')

closeButton.addEventListener('click', () => gameOverDialog?.close())
newGameButton.addEventListener('click', startNewGame)

/*
 * @param {boolean} playerWon
 */
function showGameOver(playerWon) {
    gameOverDialog?.showModal()
    resultSpan.textContent = playerWon ? 'You won!' : 'You lost!'
}

function startNewGame() {
    gameOverDialog?.close()
    initialize()
}

/*
 * @param {Ship[]} ships
 * @param {HTMLDivElement} divShips
 */
function initializeShips(ships, divShips) {
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
function updateShips(ships, divShips) {
    for (let id = 0; id < ships.length; id++) {
        if (ships[id].isSunk) {
            const divShip = divShips.querySelector(`.ship[data-id="${id}"`)
            divShip.classList.add('ship--sunk')
        }
    }
}

/*
 * @param {Board} board
 * @param {Element[]} cells
 * @param {number} x
 * @param {number} y
 */
function updateCell(board, cells, x, y) {
    const cell = getCell(cells, x, y)
    const state = board.getState(x, y)

    if (state === 'hit' || state === 'sunk') {
        cell.classList.add('cell--hit')
    }

    if (state === 'sunk') {
        clearCell(board, cells, cell)
    }

    if (state === 'water') {
        cell.classList.add('cell--water')
    }

    cell.classList.add('cell--cleared')
    cell.classList.remove('cell--clickable')
}

/*
 * @param {Element[]} cells
 * @param {number} x
 * @param {number} y
 */
function getCell(cells, x, y) {
    return cells.find(cell =>
        cell.getAttribute('data-x') === ''+x &&
        cell.getAttribute('data-y') === ''+y)
}

/**
 * Recursively updates sunken ships and uncovers the surrounding water.
 * @param {Board} board
 * @param {Element[]} cells
 * @param {Element} target
 */
function clearCell(board, cells, target) {
    if (target.classList.contains('cell--sunk')) {
        return
    }

    target.classList.add('cell--cleared')
    target.classList.remove('cell--clickable')

    if (target.classList.contains('cell--hit')) {
        target.classList.add('cell--sunk')
        const neighbors = cells.filter(cell => areNeighbors(target, cell))
        neighbors.forEach(neighbor => clearCell(board, cells, neighbor))
    } else if (!target.classList.contains('water')) {
        target.classList.add('cell--water')
    }
}

/*
 * @param {Element} thisCell
 * @param {Element} thisCell
 */
function areNeighbors(thisCell, thatCell) {
    const thisX = thisCell.getAttribute('data-x')
    const thisY = thisCell.getAttribute('data-y')
    const thatX = thatCell.getAttribute('data-x')
    const thatY = thatCell.getAttribute('data-y')

    return Math.abs(+thisX - +thatX) <= 1
        && Math.abs(+thisY - +thatY) <= 1
}

const divPlayerBoard = document.querySelector('#player-board')
const divPlayerShips = document.querySelector('#player-ships')

/* @type {Element[]} cells */
let playerCells

/*
 * @param {Board} board
 */
function initializePlayerSide(board) {
    divPlayerBoard.innerHTML = ''

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
            divPlayerBoard?.appendChild(cell)
        }
    }

    initializeShips(board.ships, divPlayerShips)

    cells = Array.from(divPlayerBoard.querySelectorAll('.cell'))
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function updatePlayerSide(board, x, y) {
    updateCell(board, cells, x, y)
    updateShips(board.ships, divPlayerShips)
}

const divComputerBoard = document.querySelector('#computer-board')
const divComputerShips = document.querySelector('#computer-ships')

/** @type {Element[]} cells */
let computerCells

/*
 * @param {Board} board
 */
function initializeComputerSide(board) {
    divComputerBoard.innerHTML = ''

    for (let y = 0; y < Board.Size; y++) {
        for (let x = 0; x < Board.Size; x++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.setAttribute('data-x', '' + x)
            cell.setAttribute('data-y', '' + y)
            cell.classList.add('cell--clickable')
            cell.addEventListener('click', attack)
            divComputerBoard?.appendChild(cell)
        }
    }

    initializeShips(board.ships, divComputerShips)

    computerCells = Array.from(divComputerBoard.querySelectorAll('.cell'))
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function updateComputerSide(board, x, y) {
    updateCell(board, computerCells, x, y)
    updateShips(board.ships, divComputerShips)
}

function deactivateComputerSide() {
    computerCells.forEach(cell => cell.classList.remove('cell--clickable'))
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

/*
 * @typedef {('fog'|'water'|'hit'|'sunk')} State
 */

/*
 * @typedef Cell
 * @type Object
 * @property {number} shipId
 * @property {boolean} isFog
 * @property {boolean} isClear
 */

/*
 * @typedef {('horitontal'| 'vertical')} Orientation
 */

/*
 * @typedef {} Board
 */
class Board {
    static #SIZE = 10

    static get Size() {
        return Board.#SIZE
    }

    /** @type {Ship[]} */
    #ships

    /** @type {Cell[][]} */
    #cells

    constructor() {
        this.#ships = []
        this.#cells = []

        for (let i = 0; i < Board.#SIZE; i++) {
            const row = []
            for (let j = 0; j < Board.#SIZE; j++) {
                row.push({ shipId: -1, isFog: true, isClear: false })
            }
            this.#cells.push(row)
        }
    }

    get ships() {
        return this.#ships
    }

    get allAreSunk() {
        return this.#ships.every(ship => ship.isSunk)
    }

    /*
     * @param {number[]} lengths
     */
    randomize(lengths) {
        for (const length of lengths) {
            const ship = new Ship(length)

            /** type {number} */
            let x
            /** type {number} */
            let y
            /** type {Orientation} */
            let orientation

            do {
                x = Math.round(Math.random() * 9)
                y = Math.round(Math.random() * 9)
                orientation = Math.random() > .5 ? 'horizontal' : 'vertical'
            } while(!this.#isValidPlacement(ship, x, y, orientation))

            this.place(ship, x, y, orientation)
        }
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    isShip(x, y) {
        return this.#cells[x][y].shipId >= 0
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    getState(x, y) {
        this.#validateCoordinate(x, y)

        const cell = this.#cells[x][y]

        if (cell.isFog) {
            return "fog"
        } else if (cell.shipId === -1) {
            return "water"
        } else if (this.#ships[cell.shipId].isSunk) {
            return "sunk"
        } else {
            return "hit"
        }
    }

    /*
     * @param {Ship} ship
     * @param {number} x
     * @param {number} y
     * @param {Orientation} orientation
     */
    place(ship, x, y, orientation) {
        this.#validateCoordinate(x, y)

        if (!this.#isValidPlacement(ship, x, y, orientation)) {
            throw new Error(`Invalid ship placement: ${x}, ${y}`)
        }

        this.#ships.push(ship)
        const id = this.#ships.length - 1

        for (let i = 0; i < ship.length; i++) {
            if (orientation === 'horizontal') {
                this.#cells[x + i][y].shipId = id
            } else {
                this.#cells[x][y + i].shipId = id
            }
        }
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    attack(x, y) {
        this.#validateCoordinate(x, y)

        const cell = this.#cells[x][y]

        if (!cell.isFog) {
            throw new Error(`Cell already received an attack: ${x}, ${y}`)
        }

        cell.isFog = false

        if (cell.shipId < 0) {
            return
        }

        const ship = this.#ships[cell.shipId]

        ship.hit()

        if (ship.isSunk) {
            this.#clear(x, y)
        }
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    #clear(x, y) {
        const cell = this.#cells[x][y]

        if (cell.isClear) {
            return
        }

        cell.isFog = false
        cell.isClear = true

        if (cell.shipId >= 0) {
            for (const neighbor of this.#getNeighbors(x, y)) {
                this.#clear(neighbor.x, neighbor.y)
            }
        }
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    #getNeighbors(x, y) {

        /** @typedef {x:number, y:number} */
        const result = []

        if (x > 0) {
            result.push({ x: x - 1, y: y })
        }

        if (x < Board.#SIZE - 1) {
            result.push({ x: x + 1, y: y })
        }

        if (y > 0) {
            result.push({ x: x, y: y - 1 })
        }

        if (y < Board.#SIZE - 1) {
            result.push({ x: x, y: y + 1 })
        }

        if (x > 0 && y > 0) {
            result.push({ x: x - 1, y: y - 1 })
        }

        if (x > 0 && y < Board.#SIZE - 1) {
            result.push({ x: x - 1, y: y + 1 })
        }

        if (x < Board.#SIZE - 1 && y < Board.#SIZE - 1) {
            result.push({ x: x + 1, y: y + 1 })
        }

        if (x < Board.#SIZE - 1 && y > 0) {
            result.push({ x: x + 1, y: y - 1 })
        }

        return result
    }

    /*
     * @param {Ship} ship
     * @param {number} x
     * @param {number} y
     * @param {Orientation} orientation
     */
    #isValidPlacement(ship, x, y, orientation) {
        const isHorizontal = orientation === 'horizontal'
        if ((isHorizontal && x + ship.length > Board.#SIZE) ||
            (!isHorizontal && y + ship.length > Board.#SIZE)
        ) {
            return false
        }

        for (let i = -1; i <= ship.length; i++) {
            for (let j = -1; j <= +1; j++) {
                let cell

                try {
                    if (isHorizontal) {
                        cell = this.#cells[x + i][y + j]
                    } else {
                        cell = this.#cells[x + j][y + i]
                    }
                } catch {
                    continue
                }

                if (cell?.shipId >= 0) {
                    return false
                }
            }
        }

        return true
    }

    /*
     * @param {number} x
     * @param {number} y
     */
    #validateCoordinate(x, y) {
        if (x < 0 || y < 0 || x >= Board.#SIZE || y >= Board.#SIZE) {
            throw new Error(`Invalid coordinate: ${x}, ${y}`)
        }
    }
}

/*
 * @typedef {Object} Candidate
 * @property {number} x
 * @property {number} y
 * @property {number} evaluation
 */

/**
 * Finds the best coordinates to attack for the current state of the board.
 *
 * This is done by evaluating the importance of all the remaining coordinates
 * and returning the ones with the highest evaluation.
 * @param {Board} board
 * @returns {{x: number, y: number}}
 */
function findBestTargets(board) {
    const candidates = []
    let bestEvaluation = -Infinity

    for (let x = 0; x < Board.Size; x++) {
        for (let y = 0; y < Board.Size; y++) {
            if (board.getState(x, y) === 'fog') {
                const evaluation = evaluate(board, x, y)
                bestEvaluation = Math.max(bestEvaluation, evaluation)
                candidates.push({ x, y, evaluation })
            }
        }
    }

    return candidates
        .filter(c => c.evaluation === bestEvaluation)
        .map(({ x, y }) => ({ x, y }))
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function evaluate(board, x, y) {
    if (mustBeWater(board, x, y)) {
        return -Infinity
    }

    if (directNeighborIsHit(board, x, y)) {
        return Infinity
    }

    return calculateTotalCapacity(board, x, y)
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function mustBeWater(board, x, y) {
    const smallestLength = Math.min(...getShipLengthsInPlay(board))

    return diagonalNeighborIsHit(board, x, y)
        || calculateCapacity(board, x, y, smallestLength) === 0
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function directNeighborIsHit(board, x, y) {
    return x > 0 && isHit(board, x - 1, y)
        || y > 0 && isHit(board, x, y - 1)
        || x < Board.Size - 1 && isHit(board, x + 1, y)
        || y < Board.Size - 1 && isHit(board, x, y + 1)
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function diagonalNeighborIsHit(board, x, y) {
    return x > 0 && y > 0 && isHit(board, x - 1, y - 1)
        || x > 0 && y < Board.Size - 1 && isHit(board, x - 1, y + 1)
        || y > 0 && x < Board.Size - 1 && isHit(board, x + 1, y - 1)
        || x < Board.Size - 1 && y < Board.Size - 1 && isHit(board, x + 1, y + 1)
}

/**
 * Calculates how many ways there are to fit any of the remaining ships
 * through the given coordinate, weighted by the length of the respective ship.
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function calculateTotalCapacity(board, x, y) {
    let capacity = 0

    for (const length of getShipLengthsInPlay(board)) {
        capacity += calculateCapacity(board, x, y, length)  * length
    }

    return capacity
}

/**
 * Calculates how many ways there are to fit a ship
 * with the given length through the given coordinate.
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 * @param {number} length
 */
function calculateCapacity(board, x, y, length) {
    if (length < Ship.minLength || length > Ship.maxLength) {
        throw new Error('Length out of bounds: ' + length)
    }

    const leftEnd = Math.max(0, x - length + 1)
    const topEnd = Math.max(0, y - length + 1)
    const rightEnd = Math.min(9, x + length - 1)
    const bottomEnd = Math.min(9, y + length - 1)

    let longest = 0
    let current = 0

    for (let i = leftEnd; i <= rightEnd; i++) {
        const state = board.getState(i, y)
        if (state === 'fog' || state === 'hit') {
            longest = ++current > longest ? current : longest
        } else {
            current = 0
        }
    }

    const horizontalCapacity = Math.max(0, longest - length + 1)

    longest = 0
    current = 0

    for (let j = topEnd; j <= bottomEnd; j++) {
        const state = board.getState(x, j)
        if (state === 'fog' || state === 'hit') {
            longest = ++current > longest ? current : longest
        } else {
            current = 0
        }
    }

    const verticalCapacity = Math.max(0, longest - length + 1)

    return Math.max(0, horizontalCapacity + verticalCapacity)
}

/*
 * @param {Board} board
 */
function getShipLengthsInPlay(board) {
    return board.ships.filter(s => !s.isSunk).map(s => s.length)
}

/*
 * @param {Board} board
 * @param {number} x
 * @param {number} y
 */
function isHit(board, x, y) {
    return board.getState(x, y) === "hit"
}

const shipLengths = [ 5, 4, 3, 3, 2, 2 ]

/** @type {Board} */
let playerBoard

/** @type {Board} */
let computerBoard

function initialize() {
    playerBoard = new Board()
    computerBoard = new Board()
    playerBoard.randomize(shipLengths)
    computerBoard.randomize(shipLengths)
    initializePlayerSide(playerBoard)
    initializeComputerSide(computerBoard)
}

/*
 * @param {number} x
 * @param {number} y
 */
function attackComputer(x, y) {
    computerBoard.attack(x, y)
    updateComputerSide(computerBoard, x, y)

    if (computerBoard.allAreSunk) {
        handleGameOver()
    } else {
        attackPlayer()
    }
}

function attackPlayer() {
    const bestTargets = findBestTargets(playerBoard)
    const { x, y } = pickAtRandom(bestTargets)
    playerBoard.attack(x, y)
    updatePlayerSide(playerBoard, x, y)

    if (playerBoard.allAreSunk) {
        handleGameOver()
    }
}

/*
 * @param {{a: number, b: number}} coordinates
 */
function pickAtRandom(coordinates) {
    const maxIndex = coordinates.length - 1
    const randomIndex = Math.round(Math.random() * maxIndex)
    const result = coordinates[randomIndex]

    return { x: result.x, y: result.y }
}

function handleGameOver() {
    if (playerBoard.allAreSunk && computerBoard.allAreSunk) {
        throw Error('Indecisive game result')
    }

    deactivateComputerSide()
    showGameOver(computerBoard.allAreSunk)
}

initialize()
