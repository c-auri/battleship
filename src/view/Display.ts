const display = document.getElementById('display')
const gameState = document.getElementById('game-state')

export function displayGameState(state: string) {
    display?.classList.remove('display--won')
    display?.classList.remove('display--lost')
    gameState!.textContent = state
}

export function displayWinner(winner: 'Player' | 'Computer') {
    if (winner === "Player") {
        gameState!.textContent = 'You won!'
        display?.classList.add('display--won')
    } else {
        gameState!.textContent = 'You lost!'
        display?.classList.add('display--lost')
    }
}