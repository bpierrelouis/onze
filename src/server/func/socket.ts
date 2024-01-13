import { InterpreterFrom } from "xstate";
import { GameMachine } from "../../machine/GameMachine";
import { ConnectionRepository } from "../repositories/ConnectionRepository";
import { SocketStream } from "@fastify/websocket"
import { GameRepository } from "../repositories/GameRepository";
import { GameItem } from "../../types";

export function publishMachineToPlayers(
    machine: InterpreterFrom<typeof GameMachine>["state"],
    connections: ConnectionRepository,
    gameId: string
) {
    for (const player of machine.context.players) {
        const connection = connections.find(player.id, gameId)
        if (connection) {
            publishMachine(machine, connection)
        }
    }
}

export function publishMachine(
    machine: InterpreterFrom<typeof GameMachine>["state"],
    connection: SocketStream
) {
    connection.socket.send(JSON.stringify({
        type: "gameUpdate",
        state: machine.value,
        context: machine.context
    }))
}

export function publishGamesListToPlayers(
    gameRepository: GameRepository,
    connectionRepository: ConnectionRepository
) {
    const games: string[] = gameRepository.findAllUnstartedGames();
    const connections: SocketStream[][] = games.map((gameId) => connectionRepository.findAll(gameId));
    const gameItems: GameItem[] = games.map((id, index) => {
        return { id: id, numberOfPlayer: connections[index].length }
    })
    connections.flatMap((array) => array).forEach((connection) => publishGamesList(gameItems, connection));
}

function publishGamesList(
    gameItems: GameItem[],
    connection: SocketStream
) {
    connection.socket.send(JSON.stringify({
        type: "gamesList",
        gameItems: gameItems
    }))
}