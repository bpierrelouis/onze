import { ContextFrom, EventFrom } from "xstate"
import { GameModel } from "./machine/GameMachine"

export enum GameStates {
    LOBBY = "LOBBY",
    PLAY = "PLAY",
    ROUND_VICTORY = "ROUND_VICTORY",
    GAME_VICTORY = "GAME_VICTORY"
}

export enum QueryParams {
    GAMEID = "gameId"
}

export enum ServerErrors {
    AuthError
}

export const cardSuits = ["spades", "diams", "clubs", "hearts"];
export const cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export type GameCard = {
    suit: string,
    value: string
}

export type PlayerSession = {
    id: string,
    name: string,
    signature: string
}

export type Player = {
    id: string,
    name: string,
    cards: GameCard[],
    hasPutCards: boolean,
    score: number
}

export enum DeckType {
    BRELAN = "Brelan",
    SUITE = "Suite"
}

export type GameContext = ContextFrom<typeof GameModel>
export type GameEvents = EventFrom<typeof GameModel>
export type GameEvent<T extends GameEvents["type"]> = GameEvents & { type: T }
export type GameGuard<T extends GameEvents["type"]> = (
    context: GameContext,
    event: GameEvent<T>
) => boolean
export type GameAction<T extends GameEvents["type"]> = (
    context: GameContext,
    event: GameEvent<T>
) => Partial<GameContext>