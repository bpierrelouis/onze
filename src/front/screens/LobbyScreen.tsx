import { prevent } from "../../func/dom"
import { useGame } from "../hooks/useGame"

type LobbyScreenProps = {}

export function LobbyScreen({ }: LobbyScreenProps) {
    const { send, context, can } = useGame()
    const startGame = () => send({ type: "start" })
    const canStart = can({ type: "start" })

    return <section className="form box column">
        <h2>Joueurs</h2>
        <form action="" onSubmit={prevent(startGame)} className="column">
            <ul id="joueurs" className="column">
                {context.players.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
            {canStart && <input type="submit" value="Commencer la partie" className="button" />}
        </form>
    </section>
}
