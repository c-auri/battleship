import { computerWon, attackPlayer, initializeComputerBoard, toggleComputerBoard } from './view/ComputerBoard'
import { displayGameState } from './view/Display'
import { playerWon, initializePlayerBoard, togglePlayerBoard } from './view/PlayerBoard'

export function initialize() {
    initializeComputerBoard()
    initializePlayerBoard()
}

export function makeComputerMove() {
    togglePlayerBoard()
    toggleComputerBoard()
    displayGameState('Computer turn')

    setTimeout(() => {
        const gameIsOver = attackPlayer()

        if (!gameIsOver) {
            togglePlayerBoard()
            toggleComputerBoard()
            displayGameState('Player turn')
        } else {
            handleGameOver()
        }
    }, Math.random() * 1500)
}

export function handleGameOver() {
    if (playerWon() && computerWon()) {
        throw Error('Indecisive game result')
    }

    if (playerWon()) {
        displayGameState('Player won!')
    }

    if (computerWon()) {
        displayGameState('Computer won!')
    }
}