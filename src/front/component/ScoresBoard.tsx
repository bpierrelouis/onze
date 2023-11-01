import { useGame } from "../hooks/useGame"

export function ScoresBoard() {
    const { context } = useGame();
    let players = context.players;
    players.sort((p1, p2) => p1.score - p2.score);
    return <ol id="scores">{players.map((p, i) =>
        <li key={i}>{p.name}: {p.score}</li>
    )}
    </ol>
}