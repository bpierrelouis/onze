import { currentPlayer } from "../../func/game"
import { useGame } from "../hooks/useGame"

export function GameInfo() {
    const { context } = useGame()
    const player = currentPlayer(context)
    return <h2 className="flex" style={{ gap: '.5rem' }}>Au tour de {player.name} de {context.doesCurrentPlayerTakeCard ? "jeter" : "piocher"}</h2>
}