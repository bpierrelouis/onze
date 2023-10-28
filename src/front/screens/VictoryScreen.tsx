import { prevent } from "../../func/dom"
import { currentPlayer } from "../../func/game"
import { isLastRound } from "../../machine/guards"
import { useGame } from "../hooks/useGame"

export function VictoryScreen() {
    const { context, send } = useGame()
    const winner = currentPlayer(context);
    const lastRound: boolean = isLastRound(context)
    const buttonAction = () => send({ type: (lastRound ? "restart" : "continue") })
    const buttonTitle = lastRound ? "Rejour" : "Continuer"

    return <div className="flex" style={{ justifyContent: 'space-between' }}>
        <h2 className="flex" style={{ gap: '.5rem' }}>{winner.name} a gagné</h2>
        <button onClick={prevent(buttonAction)} className="button">{buttonTitle}</button>
    </div>
}
