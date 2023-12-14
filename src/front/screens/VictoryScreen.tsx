import { prevent } from "../../func/dom"
import { currentPlayer } from "../../func/game"
import { GameStates } from "../../types"
import { ScoresBoard } from "../component/ScoresBoard";
import { useGame } from "../hooks/useGame"

export function VictoryScreen() {
    const { context, send, state } = useGame();
    const winner = currentPlayer(context);

    const restart = () => send({ type: "restart" });

    return <>
        <section className="box column" style={{ justifyContent: 'space-between' }}>
            <h2 className="flex" style={{ gap: '.5rem' }}>{winner.name} a gagné</h2>
            {state === GameStates.GAME_VICTORY && <button onClick={prevent(restart)} className="button">Rejouer</button>}
        </section>
        <ScoresBoard />
    </>
}
