import { prevent } from "../../func/dom";
import { useGame } from "../hooks/useGame";
import { CardView } from "./CardView";

export function CardBoard({ onClick }: { onClick: (i: number) => void }) {
    const { context } = useGame();
    return <div className="decks">
        {context.board.map((deck, i) => <ul key={i} className={"hand size-" + deck.length} onClick={prevent(() => onClick(i))}>
            {deck.map((card, j) => <li key={j}><CardView key={j} card={card} /></li>)}
        </ul>)}
    </div>
}