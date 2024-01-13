import { v4 } from "uuid";
import { getGameId, setGameId } from "../func/url";
import { useGame } from "../hooks/useGame"
import { GameItem } from "../../types";

export function SelectGame() {
    const { gameItems } = useGame();

    const gameId = getGameId();
    const currentGameItem = gameItems.find((item) => item.id === gameId);
    const gameItemsFiltered = gameItems.filter((item) => item.id !== gameId);

    const canChangeGame = gameItemsFiltered.length > 0;
    const canCreateNewGame = (currentGameItem?.numberOfPlayer ?? 0) > 1;

    if (!canChangeGame && !canCreateNewGame) {
        return <></>;
    }

    return <section className="box column">
        <h2>Autres Parties</h2>
        {canChangeGame && <ul className="column">
            {gameItemsFiltered.map((gameItem, i) => <Cell key={i} gameItem={gameItem} />)}
        </ul>}
        {canCreateNewGame && <button className="button" onClick={newGame}>Créer une partie</button>}
    </section>;
}

function Cell({ gameItem }: { gameItem: GameItem }) {
    const text = gameItem.numberOfPlayer + " joueur" + (gameItem.numberOfPlayer > 1 ? "s" : "");
    return <li className="cell" onClick={() => changeGame(gameItem.id)}>{text}</li>;
}

function changeGame(gameId: string) {
    setGameId(gameId);
    window.location.reload();
}
function newGame() {
    changeGame(v4());
}