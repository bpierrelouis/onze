import { prevent } from "../../func/dom"
import { useGame } from "../hooks/useGame"

type LobbyScreenProps = {}

export function LobbyScreen({ }: LobbyScreenProps) {
    const { send, context, can } = useGame()
    const startGame = () => send({ type: "start" })
    const canStart = can({ type: "start" })

    return <div>
        {context.players.map(p => <div key={p.id} className="player">{p.name}</div>)}
        <p>
            <button disabled={!canStart} className="button" onClick={prevent(startGame)}>Démarrer</button>
        </p>
    </div>
}
