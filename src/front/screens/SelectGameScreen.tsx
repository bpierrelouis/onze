import { QueryParams } from "../../types";
import { updateQueryParams } from "../func/url";
import { useGame } from "../hooks/useGame"

export function SelectGameScreen() {
    const { gameItems } = useGame();
    const selectGame = (gameId: string) => {
        updateQueryParams({ [QueryParams.GAMEID]: gameId });
        window.location.reload();
    };

    if (gameItems.length < 2) {
        return <></>
    }

    return <div>
        <h2>Liste des parties en cours :</h2>
        <ul>
            {gameItems.map((game, i) => <li key={i} onClick={() => selectGame(game.id)}>{game.numberOfPlayer}</li>)}
        </ul>
    </div>
}