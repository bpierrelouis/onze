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

// export const cardSuits = ["spades", "diams", "clubs", "hearts"];
// export const cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export enum CardSuit {
    SPADES = "spades",
    DIAMS = "diams",
    CLUBS = "clubs",
    HEARTS = "hearts"
}
export enum CardValue {
    AS = "A",
    TWO = "2",
    THREE = "3",
    FOUR = "4",
    FIVE = "5",
    SIX = "6",
    SEVEN = "7",
    HEIGHT = "8",
    NINE = "9",
    TEN = "10",
    JACK = "J",
    QUEEN = "Q",
    KING = "K"
}

export class Card {
    score: number;
    value: CardValue | null;
    suit: CardSuit | null;

    private constructor(score: number, suit: CardSuit | null = null, value: CardValue | null = null) {
        this.score = score;
        this.value = value;
        this.suit = suit;
    }

    public static get joker(): Card { return new Card(30); }

    public static init(suit: CardSuit, value: CardValue): Card {
        let score = Object.values(CardValue).indexOf(value) + 1;
        if (score > 10) { score = 10 }
        else if ([2, 3].includes(score)) { score = 0 }
        return new Card(score, suit, value);
    }

    public static get54CardsDeck(): Card[] {
        var deck: Card[] = [];
        for (let i = 0; i < 2; i++) {
            deck.push(Card.joker);
        }
        Object.values(CardSuit).forEach((suit) => {
            Object.values(CardValue).forEach((value) => {
                deck.push(Card.init(suit, value));
            })
        });
        return deck;
    }
}

export type PlayerSession = {
    id: string,
    name: string,
    signature: string
}

export type Player = {
    id: string,
    name: string,
    cards: Card[],
    hasPutCards: boolean,
    score: number,
    position?: number
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