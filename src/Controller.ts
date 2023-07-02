import { initializePlayerSide, setPlayerTransparency, updatePlayerSide } from './view/PlayerSide'
import { displayGameState, displayWinner } from './view/Display'
import { initializeComputer, setComputerTransparency, setPlayerActivity, updateComputerSide } from './view/ComputerSide'
import { Board } from './ts/model/Board'
import { findBestTargets } from './AI'

const shipLengths = [ 5, 4, 3, 3, 2, 2 ]

let playerBoard: Board
let computerBoard: Board

const buttonStart = document.getElementById('start-over')
buttonStart?.addEventListener('click', () => initialize())

export function initialize() {
    playerBoard = new Board()
    computerBoard = new Board()
    playerBoard.randomize(shipLengths)
    computerBoard.randomize(shipLengths)
    initializePlayerSide(playerBoard)
    initializeComputer(computerBoard)
    displayGameState('Player turn')
}

export function attackComputer(x: number, y: number) {
    computerBoard.attack(x, y)
    updateComputerSide(computerBoard, x, y)

    if (computerBoard.allAreSunk) {
        handleGameOver()
    } else {
        attackPlayer()
    }
}

export function attackPlayer() {
    setPlayerTransparency(false)
    setComputerTransparency(true)
    setPlayerActivity(false)
    displayGameState('Computer turn')

    const bestTargets = findBestTargets(playerBoard)
    const { x, y } = pickAtRandom(bestTargets)
    attack(playerBoard, x, y)
    updatePlayerSide(playerBoard, x, y)

    if (playerBoard.allAreSunk) {
        handleGameOver()
    } else {
        setPlayerTransparency(true)
        setComputerTransparency(false)
        setPlayerActivity(true)
        displayGameState('Player turn')
    }
}

function pickAtRandom(coordinates: { x: number, y: number }[]) {
    const maxIndex = coordinates.length - 1
    const randomIndex = Math.round(Math.random() * maxIndex)
    const result = coordinates[randomIndex]

    return { x: result.x, y: result.y }
}

export function attack(board: Board, x: number, y: number) {
    board.attack(x, y)

    if (board.allAreSunk) {
        handleGameOver()
    }
}

export function handleGameOver() {
    if (playerBoard.allAreSunk && computerBoard.allAreSunk) {
        throw Error('Indecisive game result')
    }

    if (computerBoard.allAreSunk) {
        displayWinner('Player')
    }

    if (playerBoard.allAreSunk) {
        displayWinner('Computer')
    }

    setPlayerActivity(false)
    setPlayerTransparency(false)
    setComputerTransparency(false)
}
