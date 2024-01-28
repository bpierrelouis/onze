import { useState } from "react"
import { useGame } from "../hooks/useGame"
import { CardBoard } from "../component/CardBoard"
import { PlayerHand } from "../component/PlayerHand"
import { DrawCard } from "../component/DrawCard";
import { ScoresBoard } from "../component/ScoresBoard";

export function PlayScreen() {
    const { send } = useGame();
    const [selected, setSelected] = useState<number>();

    const putCard = (index: number, after: boolean) => {
        if (selected === undefined) {
            return;
        }
        send({ type: "putCard", from: selected, to: index, after });
        setSelected(undefined);
    }

    return <div id="play" className="row">
        <DrawCard selected={selected} setSelected={setSelected} />
        <ScoresBoard />
        <CardBoard onClick={putCard} />
        <PlayerHand selected={selected} setSelected={setSelected} />
    </div>
}