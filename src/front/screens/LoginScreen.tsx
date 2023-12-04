import { v4 } from "uuid"
import { PlayerSession, QueryParams } from "../../types"
import { saveSession } from "../func/session"
import { updateQueryParams, urlSearchParams } from "../func/url"
import { useGame } from "../hooks/useGame"
import { FormEvent, useState } from "react"

type LoginScreenProps = {}

export function LoginScreen({ }: LoginScreenProps) {
    const { connect } = useGame()
    const [error, setError] = useState("")

    const onSelect = async (name: string) => {
        const response: PlayerSession = await fetch("/api/players", { method: "POST" }).then(r => r.json())
        const player = saveSession({
            ...response,
            name
        })
        const gameId = urlSearchParams().get(QueryParams.GAMEID) ?? v4()
        connect(player, gameId)
        updateQueryParams({ [QueryParams.GAMEID]: gameId })
    }
    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        const name = new FormData(e.currentTarget as HTMLFormElement).get("name")
        if (!name || name.toString().trim() === "") {
            setError("Vous devez choisir un pseudo")
            return;
        }
        onSelect(name.toString())
    }

    return <section className="form box column">
        <h2>Votre pseudo</h2>
        <form action="" onSubmit={onSubmit} className="column">
            <div className="inputBox">
                <input type="text" name="name" required /> <i>pseudo</i>
            </div>
            {error && <p className="error">{error}</p>}
            <input type="submit" value="Choisir" className="button" />
        </form>
    </section>
}
