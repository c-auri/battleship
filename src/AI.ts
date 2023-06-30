import { Board } from "./ts/model/Board"

type Coordinate = { x: number, y: number }

export function findTarget(board: Board) {
    const candidates: Coordinate[] = []

    for (let x = 0; x < Board.Size; x++) {
        for (let y = 0; y < Board.Size; y++) {
            if (board.getState(x, y) === 'unknown') {
                candidates.push({ x, y })
            }
        }
    }

    return pickAtRandom(candidates)
}

function pickAtRandom(coordinates: Coordinate[]) {
    const maxIndex = coordinates.length - 1
    const randomIndex = Math.round(Math.random() * (maxIndex))
    return coordinates[randomIndex]
}