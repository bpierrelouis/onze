import { prevent } from "../../func/dom";
import { currentPlayer } from "../../func/game";
import { useGame } from "../hooks/useGame"
import { TrashCard } from "./TrashCard";

export function DrawCard({ selected, setSelected }: { selected?: number, setSelected: (i?: number) => void }) {
    const { context, send, can } = useGame();
    const player = currentPlayer(context);

    const trashClick = () => {
        if (can({ type: "drawTrashCard" })) {
            send({ type: "drawTrashCard" });
        } else if (selected !== undefined) {
            send({ type: "dropCard", index: selected });
            setSelected(undefined);
        }
    }

    return <section id="draw" className="playingCards box column">
        <h2>{player.name} doit {context.doesCurrentPlayerTakeCard ? "jeter" : "piocher"}</h2>
        <div className="row">
            <TrashCard card={context.trashCard} onClick={trashClick} />
            <div className="card back" onClick={prevent(() => send({ type: "drawDeckCard" }))}></div>
        </div>
    </section>
}