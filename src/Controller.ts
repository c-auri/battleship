import { computerWon, attackPlayer, initializePlayer, setPlayerOpacity } from './view/Player'
import { displayGameState, displayWinner } from './view/Display'
import { playerWon, initializeComputer, setComputerOpacity, setPlayerActivity } from './view/Computer'

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
    setPlayerOpacity(false)
    setComputerOpacity(true)
    setPlayerActivity(false)
    displayGameState('Computer turn')

    setTimeout(() => {
        gameIsOver = attackPlayer()

        if (!gameIsOver) {
            setPlayerOpacity(true)
            setComputerOpacity(false)
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
        displayWinner('Player')
        setPlayerActivity(false)
    }

    if (computerWon()) {
        displayWinner('Computer')
    }
}