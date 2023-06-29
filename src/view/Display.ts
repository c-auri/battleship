const gameState = document.getElementById('game-state')

export function displayGameState(state: string) {
    gameState!.textContent = state
}