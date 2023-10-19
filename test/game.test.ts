import { beforeEach, describe, expect, it } from "vitest";
import { check } from "../src/func/game"
import { DeckType, GameStates } from "../src/types";
import { InterpreterFrom } from "xstate";
import { GameMachine, GameModel, makeGame } from "../src/machine/GameMachine";
import { canPutCards } from "../src/machine/guards";

it("should be suit", () => {
    const cards = [{ value: "J", suit: "diams" }, { value: "Q", suit: "diams" }, { value: "K", suit: "diams" }, { value: "A", suit: "diams" }];
    expect(check(cards, DeckType.SUITE)).toBe(true);
})

it("should be brelan", () => {
    const cards = [{ value: "J", suit: "diams" }, { value: "J", suit: "spades" }, { value: "J", suit: "clubs" }];
    expect(check(cards, DeckType.BRELAN)).toBe(true);
})

describe("putCards", () => {
    let machine: InterpreterFrom<typeof GameMachine>

    beforeEach(() => {
        machine = makeGame(GameStates.PLAY, {
            players: [{
                id: "1",
                name: "1",
                cards: [{ value: "J", suit: "diams" }, { value: "J", suit: "spades" }, { value: "J", suit: "clubs" }, { value: "2", suit: "diams" }, { value: "2", suit: "spades" }, { value: "2", suit: "clubs" }],
                hasPutCards: false
            }, {
                id: "2",
                name: "2",
                cards: [],
                hasPutCards: false
            }],
            currentPlayer: "1",
            doesCurrentPlayerTakeCard: true
        })
    })

    it("should let put cards", () => {
        expect(canPutCards(machine.state.context, GameModel.events.putCards("1"))).toBe(true)
    })
    it("should not let put cards", () => {
        expect(canPutCards(machine.state.context, GameModel.events.putCards("2"))).toBe(false)
    })
})