import { computerWon, attackPlayer, initializeComputerBoard, toggleComputerBoard } from './view/ComputerBoard'
import { displayGameState } from './view/Display'
import { playerWon, initializePlayerBoard, togglePlayerBoard } from './view/PlayerBoard'

const buttonStart = document.getElementById('start-over')
let gameIsOver = false

buttonStart?.addEventListener('click', () => initialize())

export function initialize() {
    initializeComputerBoard()
    initializePlayerBoard()
    displayGameState('Player turn')
}

export function makeComputerMove() {
    togglePlayerBoard()
    toggleComputerBoard()
    displayGameState('Computer turn')

    setTimeout(() => {
        gameIsOver = attackPlayer()

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
        togglePlayerBoard()
        displayGameState('Player won!')
    }

    if (computerWon()) {
        displayGameState('Computer won!')
    }
}