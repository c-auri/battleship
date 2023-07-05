import { initialize } from "../controller/Game"

const gameOverDialog = document.getElementById('game-over-dialog') as HTMLDialogElement
const resultSpan = document.getElementById('result') as HTMLSpanElement

gameOverDialog.addEventListener('close', initialize)


export function showGameOver(playerWon: boolean) {
    gameOverDialog?.showModal()
    resultSpan.textContent = playerWon ? 'You won!' : 'You lost!'
}