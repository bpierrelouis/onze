import { useState } from "react";
import { GameCard } from "../../types";
import { getSession } from "../func/session";
import { useGame } from "../hooks/useGame";
import { Card } from "./Card";
import { prevent } from "../../func/dom";
import { groupCard } from "../../func/game";

export function PlayerHand({ selected, setSelected }: { selected?: number, setSelected: (i?: number) => void }) {
    const { context, send, can } = useGame();
    const idPlayer = getSession()!.id;
    const player = context.players.find((p) => p.id === idPlayer)!;

    const [showOneDeck, setShowOneDeck] = useState<boolean>();

    const choseCard = (i: number) => {
        if (i === selected) {
            setSelected(undefined);
            return;
        }
        if (selected === undefined) {
            setSelected(i);
            return;
        }
        send({ type: "moveCard", from: selected, to: i });
        setSelected(undefined);
    }

    const cardElement = (i: number, card: GameCard) => <li key={i}><Card key={i} card={card} active={i === selected} onClick={() => choseCard(i)} /></li>;

    let playerHand = [];
    if (showOneDeck || player.hasPutCards) {
        playerHand.push(<ul key={0} className="hand">{player.cards.map((c, i) => cardElement(i, c))}</ul>);

    } else {
        const groups = groupCard(context.round, player.cards);

        let i = 0;
        groups.forEach((group) => {
            playerHand.push(<ul key={i} className={"hand size-" + group.length} >{group.map((c) => {
                let element = cardElement(i, c);
                i++;
                return element;
            })}</ul>);
        });
    }

    return <>
        {!player.hasPutCards && <>
            <button onClick={prevent(() => setShowOneDeck(!showOneDeck))}>{showOneDeck ? "Séparer" : "Regrouper"} le paquet</button>
            {(can({ type: "putCards" }) && !showOneDeck) && <button onClick={prevent(() => send({ type: "putCards" }))}>Poser</button>}
        </>}
        <div id="player" className="decks">{playerHand}</div>
    </>
}