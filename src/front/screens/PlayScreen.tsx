import { useState } from "react"
import { useGame } from "../hooks/useGame"
import { CardBoard } from "../component/CardBoard"
import { PlayerHand } from "../component/PlayerHand"
import { currentPlayer } from "../../func/game";
import { TrashCard } from "../component/TrashCard";
import { prevent } from "../../func/dom";

export function PlayScreen() {
    const { send, can, context } = useGame();
    const [selected, setSelected] = useState<number>();
    const player = currentPlayer(context)

    const trashClick = () => {
        if (can({ type: "drawTrashCard" })) {
            send({ type: "drawTrashCard" });
        } else if (selected !== undefined) {
            send({ type: "dropCard", index: selected });
            setSelected(undefined);
        }
    }

    const putCard = (i: number) => {
        if (selected === undefined) {
            return;
        }
        send({ type: "putCard", from: selected, to: i });
        setSelected(undefined);
    }

    return <div className="playingCards">
        <section>
            <h2>{player.name} doit {context.doesCurrentPlayerTakeCard ? "jeter" : "piocher"}</h2>
            <TrashCard card={context.trashCard} onClick={trashClick} />
            <div className="card back" onClick={prevent(() => send({ type: "drawDeckCard" }))}></div>
        </section>
        <CardBoard onClick={putCard} />
        <PlayerHand selected={selected} setSelected={setSelected} />
    </div>
}