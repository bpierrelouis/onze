import { useMemo, useState } from "react"
import { useGame } from "../hooks/useGame"
import { CardBoard } from "../component/CardBoard"
import { PlayerHand } from "../component/PlayerHand"
import { DrawCard } from "../component/DrawCard";
import { ScoresBoard } from "../component/ScoresBoard";
import { getSession } from "../func/session";

export function PlayScreen() {
    const { send, context } = useGame();
    const [selected, setSelected] = useState<number>();

    const idPlayer = getSession()!.id;
    const player = context.players.find((p) => p.id === idPlayer)!;

    const isJokerSelected = useMemo(() => {
        if (!selected) { return undefined }
        return player.cards[selected].isJoker;
    }, [selected]);

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
        <CardBoard isJokerSelected={isJokerSelected} onClick={putCard} />
        <PlayerHand selected={selected} setSelected={setSelected} />
    </div>
}