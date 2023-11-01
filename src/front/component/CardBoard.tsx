import { prevent } from "../../func/dom";
import { useGame } from "../hooks/useGame";
import { CardView } from "./CardView";
import { TrashCard } from "./TrashCard";

export function CardBoard({ trashClick, onClick }: { trashClick: () => void, onClick: (i: number) => void }) {
    const { context, send } = useGame();
    return <>
        <div className="decks">
            <TrashCard card={context.trashCard} onClick={trashClick} />
            <div className="card back" onClick={prevent(() => send({ type: "drawDeckCard" }))}></div>
        </div>
        <div className="decks">
            {context.board.map((deck, i) => <ul key={i} className={"hand size-" + deck.length} onClick={prevent(() => onClick(i))}>
                {deck.map((card, j) => <li key={j}><CardView key={j} card={card} /></li>)}
            </ul>)}
        </div>
    </>
}