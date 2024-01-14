import { prevent } from "../../func/dom"
import { currentPlayer } from "../../func/game"
import { GameStates, Player } from "../../types"
import { CardBoard } from "../component/CardBoard";
import { ScoresBoard } from "../component/ScoresBoard";
import { useGame } from "../hooks/useGame"

export function VictoryScreen() {
    const { context, send, state } = useGame();
    const restart = () => send({ type: "restart" });

    const isGameVictory = state === GameStates.GAME_VICTORY;
    const byScore = (a: Player, b: Player) => a.score - b.score;
    const winner = isGameVictory ? context.players.sort(byScore)[0] : currentPlayer(context);

    return <div id="play" className="row">
        <section className="box column">
            <h2>{winner.name} a gagné</h2>
            {isGameVictory && <button onClick={prevent(restart)} className="button">Rejouer</button>}
        </section>
        <ScoresBoard />
        <CardBoard />
    </div>
}
