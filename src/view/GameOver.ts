import { initialize } from "../controller/Game"

const newGameButton = document.getElementById('new-game-button') as HTMLButtonElement
const gameOverDialog = document.getElementById('game-over-dialog') as HTMLDialogElement
const resultSpan = document.getElementById('result') as HTMLSpanElement

newGameButton.addEventListener('click', startNewGame)

export function showGameOver(playerWon: boolean) {
    gameOverDialog?.showModal()
    resultSpan.textContent = playerWon ? 'You won!' : 'You lost!'
}

function startNewGame() {
    gameOverDialog?.close()
    initialize()
}