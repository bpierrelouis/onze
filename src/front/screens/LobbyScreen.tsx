import { prevent } from "../../func/dom"
import { useGame } from "../hooks/useGame"
import { SelectGameScreen } from "./SelectGameScreen"

export function LobbyScreen() {
    const { send, context, can } = useGame()
    const startGame = () => send({ type: "start" })
    const canStart = can({ type: "start" })

    return <>
        <SelectGameScreen />
        <section className="form box column">
            <h2>Joueurs</h2>
            <form action="" onSubmit={prevent(startGame)} className="column">
                <ul id="joueurs" className="column">
                    {context.players.map(p => <li key={p.id}>{p.name}</li>)}
                </ul>
                {canStart && <input type="submit" value="Commencer la partie" className="button" />}
            </form>
        </section>
    </>
}
