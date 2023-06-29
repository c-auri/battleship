import { computerWon, attackPlayer, initializePlayer, togglePlayerBoard } from './view/Player'
import { displayGameState } from './view/Display'
import { playerWon, initializeComputer, toggleComputerBoard } from './view/Computer'

const buttonStart = document.getElementById('start-over')
let gameIsOver = false

buttonStart?.addEventListener('click', () => initialize())

export function initialize() {
    const shipLengths = [ 5, 4, 3, 3, 2, 2 ]
    initializePlayer(shipLengths)
    initializeComputer(shipLengths)
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
        displayGameState('Player won!')
    }

    if (computerWon()) {
        displayGameState('Computer won!')
    }
}