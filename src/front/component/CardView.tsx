import { Card } from "../../types";
import { prevent } from "../../func/dom";
import { getCardClassName, getCardSymbole } from "../../func/game";

export function CardView({ card, active, onClick }: { card: Card, active?: boolean, onClick?: () => void }) {
    return <div onClick={prevent(onClick)} className={getCardClassName(card) + (active ? " active" : "")}>
        <span className="rank">{card.value ?? "-"}</span>
        <span className="suit">{getCardSymbole(card)}</span>
    </div>
}