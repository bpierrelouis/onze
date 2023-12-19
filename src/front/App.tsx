import { GameStates } from "../types"
import { useGame } from "./hooks/useGame"
import { LobbyScreen } from "./screens/LobbyScreen"
import { LoginScreen } from "./screens/LoginScreen"
import { PlayScreen } from "./screens/PlayScreen"
import { VictoryScreen } from "./screens/VictoryScreen"

function App() {

    const { state, playerId } = useGame()

    if (!playerId) {
        return <LoginScreen />
    }

    return <>
        {state === GameStates.LOBBY && <LobbyScreen />}
        {[GameStates.ROUND_VICTORY, GameStates.GAME_VICTORY].includes(state) && <VictoryScreen />}

        {state === GameStates.PLAY && <PlayScreen />}
        <p id="copyright">&copy;2023-2024 BAELDE Pierre-Louis - <a href="https://github.com/bpierrelouis/onze" target="_blank">voir les sources et/ou les règles</a></p>
    </>
}

export default App
