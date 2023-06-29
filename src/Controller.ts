import { computerWon, attackPlayer, initializePlayer, togglePlayerOpacity } from './view/Player'
import { displayGameState } from './view/Display'
import { playerWon, initializeComputer, toggleComputerOpacity, setPlayerActivity } from './view/Computer'

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
    togglePlayerOpacity()
    toggleComputerOpacity()
    setPlayerActivity(false)
    displayGameState('Computer turn')

    setTimeout(() => {
        gameIsOver = attackPlayer()

        if (!gameIsOver) {
            togglePlayerOpacity()
            toggleComputerOpacity()
            setPlayerActivity(true)
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
        setPlayerActivity(false)
    }

    if (computerWon()) {
        displayGameState('Computer won!')
    }
}