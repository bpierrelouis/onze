function urlSearchParams() {
    return new URL(window.location.href).searchParams
}

function updateQueryParams(
    params: Record<string, string>
) {
    const url = new URL(window.location.href)
    Object.keys(params).forEach((key) => {
        url.searchParams.set(key, params[key])
    })
    history.replaceState(null, "", url)
}

export function getGameId(): string | null {
    return urlSearchParams().get("gameId")
}

export function setGameId(gameId: string) {
    updateQueryParams({ ["gameId"]: gameId })
}