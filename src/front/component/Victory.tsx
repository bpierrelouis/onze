import { prevent } from "../../func/dom"

type VictoryProps = {
    name: string,
    onRestart?: () => void
}

export function Victory({ name, onRestart }: VictoryProps) {
    return <div className="flex" style={{ justifyContent: 'space-between' }}>
        <h2 className="flex" style={{ gap: '.5rem' }}>Bravo, {name} a gagné</h2>
        <button onClick={prevent(onRestart)} className="button">Rejouer</button>
    </div>
}