import { initialize } from "../controller/Game"

const gameOverDialog = document.getElementById('game-over-dialog') as HTMLDialogElement
const closeButton = document.getElementById('close-button') as HTMLButtonElement
const resultSpan = document.getElementById('result') as HTMLSpanElement
const newGameButton = document.getElementById('new-game-button') as HTMLButtonElement

closeButton.addEventListener('click', () => gameOverDialog?.close())
newGameButton.addEventListener('click', startNewGame)

export function showGameOver(playerWon: boolean) {
    gameOverDialog?.showModal()
    resultSpan.textContent = playerWon ? 'You won!' : 'You lost!'
}

function startNewGame() {
    gameOverDialog?.close()
    initialize()
}