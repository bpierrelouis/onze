import { prevent } from "../../func/dom"
import { useGame } from "../hooks/useGame"

type LobbyScreenProps = {}

export function LobbyScreen({ }: LobbyScreenProps) {
    const { send, context, can } = useGame()
    const startGame = () => send({ type: "start" })
    const canStart = can({ type: "start" })

    return <section className="center">
        <h2>Joueurs</h2>
        <form action="" onSubmit={prevent(startGame)}>
            <ul id="joueurs">
                {context.players.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
            <input type="submit" value="Commencer la partie" disabled={!canStart} />
        </form>
    </section>
}
