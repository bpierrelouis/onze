import { currentPlayer } from "../../func/game"
import { Victory } from "../component/Victory"
import { useGame } from "../hooks/useGame"

export function VictoryScreen() {
    const { context, send } = useGame()
    const winner = currentPlayer(context);
    const restart = () => send({ type: "restart" })

    return <div>
        <Victory name={winner.name} onRestart={restart} />
    </div>
}