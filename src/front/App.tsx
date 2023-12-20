import { GameStates } from "../types"
import { Copyright } from "./component/Copyright"
import { useGame } from "./hooks/useGame"
import { LobbyScreen } from "./screens/LobbyScreen"
import { LoginScreen } from "./screens/LoginScreen"
import { PlayScreen } from "./screens/PlayScreen"
import { VictoryScreen } from "./screens/VictoryScreen"

function App() {

    const { state, playerId } = useGame()

    if (!playerId) {
        return <><LoginScreen /><Copyright /></>
    }

    return <>
        {state === GameStates.LOBBY && <LobbyScreen />}
        {[GameStates.ROUND_VICTORY, GameStates.GAME_VICTORY].includes(state) && <VictoryScreen />}

        {state === GameStates.PLAY && <PlayScreen />}
        <Copyright />
    </>
}

export default App
