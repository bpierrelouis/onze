import { useGame } from "../hooks/useGame"

export function ScoresBoard() {
    const { context } = useGame();
    let players = context.players;
    players.sort((p1, p2) => p1.position! - p2.position!);

    return <table id="scores">
        <thead>
            <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Cards</th>
            </tr>
        </thead>
        <tbody>
            {players.map((p, i) =>
                <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.score}</td>
                    <td>{p.cards.length}</td>
                </tr>
            )}
        </tbody>
    </table>
}