import { initialize } from "../controller/Game"

const resultSpan = document.getElementById('result') as HTMLSpanElement
const newGameButton = document.getElementById('new-game') as HTMLButtonElement

newGameButton?.addEventListener('click', initialize)

export function showGameOver(playerWon: boolean) {
    newGameButton.classList.remove('hidden')
    resultSpan.classList.remove('hidden')
    resultSpan.textContent = playerWon ? 'You won!' : 'You lost!'
}

export function hideGameOver() {
    newGameButton.classList.add('hidden')
    resultSpan.classList.add('hidden')
}
