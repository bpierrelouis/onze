import { beforeEach, describe, expect, it } from "vitest";
import { check } from "../src/func/game"
import { Card, CardSuit, CardValue, DeckType, GameStates } from "../src/types";
import { InterpreterFrom } from "xstate";
import { GameMachine, GameModel, makeGame } from "../src/machine/GameMachine";
import { canPutCards } from "../src/machine/guards";

it("should be suit", () => {
    let cards = [
        Card.init(CardSuit.DIAMS, CardValue.JACK),
        Card.init(CardSuit.DIAMS, CardValue.QUEEN),
        Card.init(CardSuit.DIAMS, CardValue.KING),
        Card.init(CardSuit.DIAMS, CardValue.AS)
    ];
    expect(check(cards, DeckType.SUITE)).toBe(true);

    cards = [
        Card.init(CardSuit.DIAMS, CardValue.AS),
        Card.init(CardSuit.DIAMS, CardValue.TWO),
        Card.init(CardSuit.DIAMS, CardValue.THREE),
        Card.init(CardSuit.DIAMS, CardValue.FOUR)
    ];
    expect(check(cards, DeckType.SUITE)).toBe(true);

    cards = [
        Card.init(CardSuit.DIAMS, CardValue.JACK),
        Card.init(CardSuit.DIAMS, CardValue.QUEEN),
        Card.joker,
        Card.init(CardSuit.DIAMS, CardValue.AS)
    ];
    expect(check(cards, DeckType.SUITE)).toBe(true);

    cards = [
        Card.joker,
        Card.init(CardSuit.DIAMS, CardValue.QUEEN),
        Card.joker,
        Card.init(CardSuit.DIAMS, CardValue.AS)
    ];
    expect(check(cards, DeckType.SUITE)).toBe(true);
})

it("should be brelan", () => {
    let cards = [
        Card.init(CardSuit.CLUBS, CardValue.AS),
        Card.init(CardSuit.HEARTS, CardValue.AS),
        Card.init(CardSuit.SPADES, CardValue.AS)
    ];
    expect(check(cards, DeckType.BRELAN)).toBe(true);

    cards = [
        Card.joker,
        Card.joker,
        Card.joker
    ];
    expect(check(cards, DeckType.BRELAN)).toBe(true);
})