import { prevent } from "../../func/dom"
import { useGame } from "../hooks/useGame"

export function CurrentGamePlayers() {
    const { send, context, can } = useGame()
    const startGame = () => send({ type: "start" })
    const canStart = can({ type: "start" })

    return <section className="box column">
        <h2>Joueurs</h2>
        <ul id="joueurs" className="column">
            {context.players.map(p => <li key={p.id} className="cell">{p.name}</li>)}
        </ul>
        {canStart && <button className="button" onClick={prevent(startGame)}>Commencer la partie</button>}
    </section>
}