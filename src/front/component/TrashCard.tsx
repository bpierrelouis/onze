import { prevent } from "../../func/dom";
import { Card } from "../../types";
import { CardView } from "./CardView";

export function TrashCard({ card, onClick }: { card: Card | null, onClick: () => void }) {
    return <>
        {card && <CardView card={card} onClick={onClick} />}
        {!card && <div className="card empty" onClick={prevent(onClick)}></div>}
    </>
}