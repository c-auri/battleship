import { Board } from '../model/Board'
import { findBestTargets } from './AI'
import { initializePlayerSide, updatePlayerSide } from '../view/PlayerSide'
import { initializeComputerSide, deactivateComputerSide, updateComputerSide } from '../view/ComputerSide'
import { showGameOver } from '../view/GameOver'

const shipLengths = [ 5, 4, 3, 3, 2, 2 ]

let playerBoard: Board
let computerBoard: Board

export function initialize() {
    playerBoard = new Board()
    computerBoard = new Board()
    playerBoard.randomize(shipLengths)
    computerBoard.randomize(shipLengths)
    initializePlayerSide(playerBoard)
    initializeComputerSide(computerBoard)
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

function attackPlayer() {
    const bestTargets = findBestTargets(playerBoard)
    const { x, y } = pickAtRandom(bestTargets)
    playerBoard.attack(x, y)
    updatePlayerSide(playerBoard, x, y)

    if (playerBoard.allAreSunk) {
        handleGameOver()
    }
}

function pickAtRandom(coordinates: { x: number, y: number }[]) {
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
