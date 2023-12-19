import { prevent } from "../../func/dom";
import { useGame } from "../hooks/useGame";
import { CardView } from "./CardView";

export function CardBoard({ onClick }: { onClick?: (i: number) => void }) {
    const { context } = useGame();

    return <div id="board" className="playingCards row">
        {context.board.map((deck, i) => <ul key={i} className="hand" onClick={prevent(() => { onClick && onClick(i) })}>
            {deck.map((card, j) => <li key={j}><CardView key={j} card={card} /></li>)}
        </ul>)}
    </div>
}