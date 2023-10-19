import { check, currentPlayer, getTwoDecksShuffled, numberOfCardsNeeded, roundType } from "../func/game";
import { DeckType, GameAction, GameCard, GameContext } from "../types";

export const joinGame: GameAction<"join"> = (context, event) => ({
    players: [...context.players, { id: event.playerId, name: event.name, cards: [], hasPutCards: false, score: 0 }]
})

export const leaveGame: GameAction<"leave"> = (context, event) => ({
    players: context.players.filter(p => p.id !== event.playerId)
})

export const switchPlayer = (context: GameContext) => ({
    currentPlayer: context.players.find(p => p.id !== context.currentPlayer)!.id,
    doesCurrentPlayerTakeCard: false,
    hasPlayerJustPutCards: false
})

export const startGame = (context: GameContext) => {
    let gameDeck = getTwoDecksShuffled();
    let players = context.players;

    for (let i = 0; i < 11; i++) {
        players.forEach((p) => p.cards.push(gameDeck.pop()!));
    }

    let trashCard = gameDeck.pop();
    let randomPlayer = players[Math.floor(Math.random() * context.players.length)]!.id;

    //TODO: à supprimer
    let pl = players.find((p) => p.name === "PL")!;
    randomPlayer = pl.id;
    pl.cards = [{ suit: "spades", value: "A" }, { suit: "diams", value: "A" }, { suit: "clubs", value: "A" }, { suit: "spades", value: "A" }, { suit: "diams", value: "A" }, { suit: "clubs", value: "A" }, { suit: "hearts", value: "A" }];

    return {
        players: players,
        currentPlayer: randomPlayer,
        doesCurrentPlayerTakeCard: false,
        trashCard: trashCard,
        deck: gameDeck,
        board: [],
        round: context.round + 1
    }
}

export const drawTrashCard: GameAction<"drawTrashCard"> = (context, event) => {
    let players = context.players;
    let player = players.find((p) => p.id === event.playerId)!;
    player.cards.push(context.trashCard!);

    return {
        players: players,
        doesCurrentPlayerTakeCard: true,
        trashCard: null
    }
}

export const drawDeckCard: GameAction<"drawDeckCard"> = (context: GameContext) => {
    let player = currentPlayer(context);
    player.cards.push(context.deck.pop()!);
    return {
        doesCurrentPlayerTakeCard: true
    }
}

export const dropCard: GameAction<"dropCard"> = (context, { index }) => {
    let player = currentPlayer(context);
    let card = player.cards[index];
    player.cards = player.cards.filter((_, i) => i !== index);
    if (context.trashCard !== null) {
        context.deck.unshift(context.trashCard);
    }
    return {
        trashCard: card
    }
}

export const moveCard: GameAction<"moveCard"> = (context, event) => {
    let cards = context.players.find((p) => p.id === event.playerId)!.cards;
    // recuperation de la carte
    let card = cards[event.from];
    // suppression de la carte
    cards.splice(event.from, 1);
    // insertion de la carte devant celle cliquee
    cards.splice(event.to - (event.to > event.from ? 1 : 0), 0, card);
    return {};
}

export const putCards: GameAction<"putCards"> = (context, event) => {
    let board: GameCard[][] = [];
    let player = currentPlayer(context);
    let cards = [...player.cards];

    for (let type of roundType(context.round)) {
        let numberOfCards = numberOfCardsNeeded(type);
        board.push(cards.slice(0, numberOfCards));
        cards = cards.slice(numberOfCards);
    }

    return {
        players: [
            ...context.players.filter((p) => p.id !== event.playerId),
            {
                ...player,
                cards: cards,
                hasPutCards: true
            }
        ],
        board: [...context.board, ...board],
        hasPlayerJustPutCards: true
    };
}

export const putCard: GameAction<"putCard"> = (context, event) => {
    let player = currentPlayer(context);
    let playerCards = player.cards.slice();
    const card = playerCards[event.from];
    let boardCards = context.board[event.to].slice();

    if (check([card, ...boardCards], DeckType.SUITE)) {
        boardCards.unshift(card);
    } else {
        boardCards.push(card);
    }

    playerCards = playerCards.filter((_, i) => i !== event.from);
    let board = context.board.slice();
    board[event.to] = boardCards;

    return {
        players: [
            ...context.players.filter((p) => p.id !== event.playerId),
            {
                ...player,
                cards: playerCards
            }
        ],
        board: board
    };
}

export const calculateScores: GameAction<"dropCard"> = (context, event) => {
    console.log("scores")
    return {};
}