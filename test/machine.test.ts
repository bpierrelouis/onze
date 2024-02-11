import { beforeEach, describe, expect, it } from "vitest";
import { InterpreterFrom, interpret } from "xstate";
import { GameMachine, GameModel, makeGame } from "../src/machine/GameMachine"
import { Card, CardSuit, CardValue, GameStates } from "../src/types";

describe("machine", () => {
    describe("putCard", () => {
        let machine: InterpreterFrom<typeof GameMachine>

        beforeEach(() => {
            machine = makeGame(GameStates.PLAY, {
                players: [
                    {
                        id: "1",
                        name: "1",
                        cards: [
                            Card.init(CardSuit.CLUBS, CardValue.AS),
                            Card.init(CardSuit.CLUBS, CardValue.SIX),
                            Card.joker
                        ],
                        hasPutCards: true,
                        score: 0,
                        position: 0
                    },
                    {
                        id: "2",
                        name: "2",
                        cards: [],
                        hasPutCards: false,
                        score: 0,
                        position: 1
                    }
                ],
                currentPlayer: "1",
                doesCurrentPlayerTakeCard: true,
                board: [
                    [
                        Card.init(CardSuit.CLUBS, CardValue.TWO),
                        Card.init(CardSuit.CLUBS, CardValue.THREE),
                        Card.init(CardSuit.CLUBS, CardValue.FOUR),
                        Card.init(CardSuit.CLUBS, CardValue.FIVE)
                    ],
                    [
                        Card.init(CardSuit.CLUBS, CardValue.TWO),
                        Card.init(CardSuit.DIAMS, CardValue.TWO),
                        Card.init(CardSuit.HEARTS, CardValue.TWO)
                    ]
                ],
                round: 2,
                hasPlayerJustPutCards: false
            })
        })

        it("should let put a card in a suit", () => {
            expect(machine.send(GameModel.events.putCard("1", 0, 0, undefined)).changed).toBe(true)
        })

        it("should let put a card in a suit", () => {
            expect(machine.send(GameModel.events.putCard("1", 1, 0, undefined)).changed).toBe(true)
        })

        it("should let put a joker at the end of a suit", () => {
            expect(machine.send(GameModel.events.putCard("1", 2, 0, true)).changed).toBe(true)
        })

        it("should let put a joker at the beginning of a suit", () => {
            expect(machine.send(GameModel.events.putCard("1", 2, 0, false)).changed).toBe(true)
        })
    })
})