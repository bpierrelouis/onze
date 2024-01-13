import { prevent } from "../../func/dom"
import { currentPlayer } from "../../func/game"
import { GameStates } from "../../types"
import { CardBoard } from "../component/CardBoard";
import { ScoresBoard } from "../component/ScoresBoard";
import { useGame } from "../hooks/useGame"

export function VictoryScreen() {
    const { context, send, state } = useGame();
    const winner = currentPlayer(context);

    const isGameVictory = state === GameStates.GAME_VICTORY;
    const restart = () => send({ type: "restart" });

    return <div id="play" className="row">
        <section className="box column">
            <h2 className="flex" style={{ gap: '.5rem' }}>{winner.name} a gagné</h2>
            {isGameVictory && <button onClick={prevent(restart)} className="button">Rejouer</button>}
        </section>
        <ScoresBoard />
        <CardBoard />
    </div>
}
