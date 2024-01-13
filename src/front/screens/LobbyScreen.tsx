import { SelectGame } from "../component/SelectGame"
import { CurrentGamePlayers } from "../component/CurrentGamePlayers"

export function LobbyScreen() {
    return <div id="lobby">
        <CurrentGamePlayers />
        <SelectGame />
    </div>
}
