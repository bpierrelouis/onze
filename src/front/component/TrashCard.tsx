import { prevent } from "../../func/dom";
import { GameCard } from "../../types";
import { Card } from "./Card";

export function TrashCard({ card, onClick }: { card: GameCard | null, onClick: () => void }) {
    return <>
        {card && <Card card={card} onClick={onClick} />}
        {!card && <div className="card empty" onClick={prevent(onClick)}></div>}
    </>
}