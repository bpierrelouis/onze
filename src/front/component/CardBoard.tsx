import { prevent } from "../../func/dom";
import { getRoundPattern } from "../../func/game";
import { Card, Pattern } from "../../types";
import { useGame } from "../hooks/useGame";
import { CardView } from "./CardView";

export function CardBoard({ onClick }: { onClick?: (i: number, after: boolean) => void }) {
    const { context } = useGame();
    const board = context.board;
    const roundPattern = getRoundPattern(context);

    const action = (index: number, after: boolean = true) => { onClick && onClick(index, after) }

    const pack = (cards: Card[], index: number) => {
        const isBrelan = roundPattern[index % roundPattern.length] === Pattern.BRELAN;
        if (isBrelan) {
            return brelan({ cards, onClick: () => action(index) })
        } else {
            return suit({ cards, onClick: (after: boolean) => action(index, after) })
        }
    }

    return <div id="board" className="playingCards row">
        {board.map(pack)}
    </div>
}

function brelan({ cards, onClick }: { cards: Card[], onClick: () => void }) {
    return <ul className="hand" onClick={prevent(onClick)}>
        {cards.map((card, i) => <li key={i}><CardView key={i} card={card} /></li>)}
    </ul>
}

function suit({ cards, onClick }: { cards: Card[], onClick: (after: boolean) => void }) {
    const copy = cards.slice(1, -1);
    return <ul className="hand">
        <li><CardView card={cards[0]} onClick={() => onClick(false)} /></li>
        {copy.map((card, i) => <li><CardView key={i} card={card} /></li>)}
        <li><CardView card={cards[cards.length - 1]} onClick={() => onClick(true)} /></li>
    </ul>
}