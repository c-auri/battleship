import { Board } from "./ts/model/Board"

type Candidate = { x: number, y: number, value: number }

export function findTarget(board: Board) {
    const candidates: Candidate[] = []

    for (let x = 0; x < Board.Size; x++) {
        for (let y = 0; y < Board.Size; y++) {
            if (board.getState(x, y) === 'unknown') {
                candidates.push({ x, y, value: 1 })
            }
        }
    }

    return pickAtRandom(selectBest(candidates))
}

function selectBest(candidates: Candidate[]) {
    const maxValue = Math.max(...candidates.map(c => c.value))
    return candidates.filter(c => c.value === maxValue)
}

function pickAtRandom(candidates: Candidate[]) {
    const maxIndex = candidates.length - 1
    const randomIndex = Math.round(Math.random() * (maxIndex))
    const result = candidates[randomIndex]

    return { x: result.x, y: result.y }
}