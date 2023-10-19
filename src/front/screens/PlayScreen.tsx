import { useState } from "react"
import { useGame } from "../hooks/useGame"
import { Board } from "../component/Board"
import { PlayerHand } from "../component/PlayerHand"

export function PlayScreen() {
    const { send, can } = useGame();
    const [selected, setSelected] = useState<number>();

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
    }

    return <div className="playingCards">
        <Board trashClick={trashClick} onClick={putCard} />
        <PlayerHand selected={selected} setSelected={setSelected} />
    </div>
}