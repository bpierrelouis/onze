import { prevent } from "../../func/dom";
import { useGame } from "../hooks/useGame";
import { CardView } from "./CardView";

export function CardBoard({ onClick }: { onClick?: (i: number) => void }) {
    const { context } = useGame();
    const action = (i: number) => {
        return prevent(() => { onClick && onClick(i) })
    }

    return <div id="board" className="playingCards row">
        {context.board.map((deck, i) => <ul key={i} className="hand" onClick={action(i)}>
            {deck.map((card, j) => <li key={j}><CardView key={j} card={card} /></li>)}
        </ul>)}
    </div>
}