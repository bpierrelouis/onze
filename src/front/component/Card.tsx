import { GameCard } from "../../types";
import { prevent } from "../../func/dom"
import { className, symbole } from "../../func/game";

export function Card({ card, active, onClick }: { card: GameCard, active?: boolean, onClick?: () => void }) {
    return <div onClick={prevent(onClick)} className={className(card) + (active ? " active" : "")}>
        <span className="rank">{card.value}</span>
        <span className="suit">{symbole(card)}</span>
    </div>
}