import { createModel } from "xstate/lib/model"
import { GameCard, GameContext, GameStates, Player } from "../types"
import { InterpreterFrom, interpret } from "xstate"
import { canDrawDeckCard, canDrawTrashCard, canDropCard, canJoin, canLeave, canPutCard, canPutCards, canStartGame, isWinningDrop } from "./guards"
import { drawDeckCard, drawTrashCard, dropCard, joinGame, leaveGame, moveCard, putCard, putCards, startGame, switchPlayer } from "./actions"

export const GameModel = createModel({
    players: [] as Player[],
    currentPlayer: null as null | Player["id"],
    doesCurrentPlayerTakeCard: false as boolean,
    trashCard: null as GameCard | null,
    deck: [] as GameCard[],
    board: [] as GameCard[][],
    round: 0 as number,
    hasPlayerJustPutCards: false as boolean
}, {
    events: {
        join: (playerId: Player["id"], name: Player["name"]) => ({ playerId, name }),
        leave: (playerId: Player["id"]) => ({ playerId }),
        start: () => ({}),
        drawTrashCard: (playerId: Player["id"]) => ({ playerId }),
        drawDeckCard: (playerId: Player["id"]) => ({ playerId }),
        dropCard: (playerId: Player["id"], index: number) => ({ playerId, index }),
        moveCard: (playerId: Player["id"], from: number, to: number) => ({ playerId, from, to }),
        putCards: (playerId: Player["id"]) => ({ playerId }),
        putCard: (playerId: Player["id"], from: number, to: number) => ({ playerId, from, to }),
        restart: () => ({})
    }
})

export const GameMachine = GameModel.createMachine({
    predictableActionArguments: true,
    id: "game",
    context: GameModel.initialContext,
    initial: GameStates.LOBBY,
    states: {
        [GameStates.LOBBY]: {
            on: {
                join: {
                    cond: canJoin,
                    target: GameStates.LOBBY,
                    actions: [GameModel.assign(joinGame)]
                },
                leave: {
                    cond: canLeave,
                    target: GameStates.LOBBY,
                    actions: [GameModel.assign(leaveGame)]
                },
                start: {
                    cond: canStartGame,
                    target: GameStates.PLAY,
                    actions: [GameModel.assign(startGame)]
                }
            }
        },
        [GameStates.PLAY]: {
            on: {
                drawTrashCard: {
                    cond: canDrawTrashCard,
                    target: GameStates.PLAY,
                    actions: [GameModel.assign(drawTrashCard)]
                },
                drawDeckCard: {
                    cond: canDrawDeckCard,
                    target: GameStates.PLAY,
                    actions: [GameModel.assign(drawDeckCard)]
                },
                dropCard: [
                    {
                        cond: isWinningDrop,
                        target: GameStates.VICTORY,
                        actions: [GameModel.assign(dropCard)]
                    }, {
                        cond: canDropCard,
                        target: GameStates.PLAY,
                        actions: [GameModel.assign(dropCard), GameModel.assign(switchPlayer)]
                    }
                ],
                moveCard: {
                    target: GameStates.PLAY,
                    actions: [GameModel.assign(moveCard)]
                },
                putCards: {
                    cond: canPutCards,
                    target: GameStates.PLAY,
                    actions: [GameModel.assign(putCards)]
                },
                putCard: {
                    cond: canPutCard,
                    target: GameStates.PLAY,
                    actions: [GameModel.assign(putCard)]
                }
            }
        },
        [GameStates.VICTORY]: {
            on: {
                restart: {
                    target: GameStates.LOBBY,
                    actions: []
                }
            }
        }
    }
})

export function makeGame(state: GameStates = GameStates.LOBBY, context: Partial<GameContext> = {}): InterpreterFrom<typeof GameMachine> {
    const machine = interpret(
        GameMachine.withContext({
            ...GameModel.initialContext,
            ...context
        })
    ).start()
    machine.state.value = state
    return machine
}