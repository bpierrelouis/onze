import { GameStates } from "../types"
import { GameInfo } from "./component/GameInfo"
import { ScoresBoard } from "./component/ScoresBoard"
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
        {[GameStates.ROUND_VICTORY, GameStates.GAME_VICTORY].includes(state) && <VictoryScreen />}

        {showBoard && <>
            <PlayScreen />
            <ScoresBoard />
        </>}
    </>
}

export default App
