import { computerWon, attackPlayer, initializePlayerBoard, toggleComputerBoard } from './view/PlayerBoard'
import { displayGameState } from './view/Display'
import { playerWon, initializeComputerBoard, togglePlayerBoard } from './view/ComputerBoard'

const buttonStart = document.getElementById('start-over')
let gameIsOver = false

buttonStart?.addEventListener('click', () => initialize())

export function initialize() {
    const shipLengths = [ 5, 4, 3, 3, 2, 2 ]
    initializePlayerBoard(shipLengths)
    initializeComputerBoard(shipLengths)
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