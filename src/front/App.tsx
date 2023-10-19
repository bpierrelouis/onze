import { GameStates } from "../types"
import { GameInfo } from "./component/GameInfo"
import { useGame } from "./hooks/useGame"
import { LobbyScreen } from "./screens/LobbyScreen"
import { LoginScreen } from "./screens/LoginScreen"
import { PlayScreen } from "./screens/PlayScreen"
import { VictoryScreen } from "./screens/VictoryScreen"

function App() {

    const { state, playerId } = useGame()
    const showBoard = state !== GameStates.LOBBY

    if (!playerId) {
        return <LoginScreen />
    }

    return <>
        {state === GameStates.LOBBY && <LobbyScreen />}
        {state === GameStates.PLAY && <GameInfo />}
        {state === GameStates.VICTORY && <VictoryScreen />}

        {showBoard && <PlayScreen />}
    </>
}

export default App
