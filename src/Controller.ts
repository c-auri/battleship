import { attackPlayer, initializeComputerBoard, toggleComputerBoard } from './view/ComputerBoard'
import { initializePlayerBoard, togglePlayerBoard } from './view/PlayerBoard'

export function initialize() {
    initializeComputerBoard()
    initializePlayerBoard()
}

export function makeComputerMove() {
    togglePlayerBoard()
    toggleComputerBoard()

    setTimeout(() => {
        const gameIsOver = attackPlayer()

        if (!gameIsOver) {
            togglePlayerBoard()
            toggleComputerBoard()
        }
    }, Math.random() * 1000)
}