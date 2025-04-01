import { initialize } from "../controller/Game"

const gameOverDialog = document.getElementById('game-over-dialog')
const closeButton = document.getElementById('close-button')
const resultSpan = document.getElementById('result')
const newGameButton = document.getElementById('new-game-button')

closeButton.addEventListener('click', () => gameOverDialog?.close())
newGameButton.addEventListener('click', startNewGame)

/*
 * @param {boolean} playerWon
 */
export function showGameOver(playerWon) {
    gameOverDialog?.showModal()
    resultSpan.textContent = playerWon ? 'You won!' : 'You lost!'
}

function startNewGame() {
    gameOverDialog?.close()
    initialize()
}
