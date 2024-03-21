import Fastify from "fastify"
import FastifyStatic from "@fastify/static"
import FastifyWebsocket from "@fastify/websocket"
import { v4 } from "uuid"
import { sign, verify } from "./func/crypto"
import { resolve } from "path"
import { ServerErrors } from "../types"
import { ConnectionRepository } from "./repositories/ConnectionRepository"
import { GameRepository } from "./repositories/GameRepository"
import { GameModel } from "../machine/GameMachine"
import { publishGamesListToPlayers, publishMachine } from "./func/socket"
import { readFileSync } from "fs"
import FastifyView from "@fastify/view"
import ejs from "ejs"

const connections = new ConnectionRepository()
const games = new GameRepository(connections)
const env = process.env.NODE_ENV as "dev" | "prod"
let manifest = {}
try {
    const manifestData = readFileSync("./public/manifest.json")
    manifest = JSON.parse(manifestData.toLocaleString())
} catch (e) { }

const fastify = Fastify({ logger: true })

fastify.register(FastifyView, {
    engine: { ejs: ejs }
})
fastify.register(FastifyStatic, {
    root: resolve("./public")
})
fastify.register(FastifyWebsocket)

fastify.register(async (f) => {
    f.get("/ws", { websocket: true }, (connection, req) => {
        const query = req.query as Record<string, string>
        const playerId = query.id ?? ""
        const signature = query.signature ?? ""
        const playerName = query.name || "Ghost"
        const gameId = query.gameId

        if (!gameId) {
            connection.end()
            f.log.error("Pas de gameId")
            return;
        }

        if (!verify(playerId, signature)) {
            f.log.error("Erreur d'authentification")
            connection.socket.send(JSON.stringify({
                type: "error", code: ServerErrors.AuthError
            }))
            return;
        }

        const game = games.find(gameId) ?? games.create(gameId)
        connections.persist(playerId, gameId, connection)
        game.send(GameModel.events.join(playerId, playerName))
        publishMachine(game.state, connection)
        publishGamesListToPlayers(games, connections)

        connection.socket.onmessage = (rawMessage) => {
            const message = JSON.parse(rawMessage.toLocaleString())
            if (message.type !== "gameUpdate") { return }
            game.send(message.event)
            publishGamesListToPlayers(games, connections)
        }

        connection.socket.onclose = () => {
            connections.remove(playerId, gameId)
            game.send(GameModel.events.leave(playerId))
            games.clean(gameId)
            publishGamesListToPlayers(games, connections)
        }
    })
})

fastify.get("/", (_req, res) => {
    res.view("/templates/index.ejs", { manifest, env })
})

fastify.post("/api/players", (_req, res) => {
    const playerId = v4()
    const signature = sign(playerId)
    res.send({
        id: playerId,
        signature: signature
    })
})

fastify.listen({
    port: 80,
    host: "0.0.0.0"
}).catch((err) => {
    fastify.log.error(err)
    process.exit(1)
}).then(() => { })