import { check, currentPlayer, groupCard, roundType } from "../func/game";
import { DeckType, GameGuard } from "../types";

export const canJoin: GameGuard<"join"> = (context, event) => {
    return context.players.length < 2 && context.players.find(p => p.id === event.playerId) === undefined
}

export const canLeave: GameGuard<"leave"> = (context, event) => {
    return !!context.players.find(p => p.id === event.playerId)
}

export const canStartGame: GameGuard<"start"> = (context) => {
    return context.players.length === 2
}

export const canDrawTrashCard: GameGuard<"drawTrashCard"> = (context, event) => {
    if (!context.trashCard) {
        return false
    }
    if (event.playerId === context.currentPlayer) {
        return !context.doesCurrentPlayerTakeCard
    }
    return context.doesCurrentPlayerTakeCard
}

export const canDrawDeckCard: GameGuard<"drawDeckCard"> = (context, event) => {
    if (context.currentPlayer !== event.playerId) {
        return false;
    }
    return !context.doesCurrentPlayerTakeCard
}

export const canDropCard: GameGuard<"dropCard"> = (context, event) => {
    return (context.currentPlayer === event.playerId) && context.doesCurrentPlayerTakeCard
}

export const canPutCards: GameGuard<"putCards"> = (context, event) => {
    if (!((context.currentPlayer === event.playerId) && context.doesCurrentPlayerTakeCard)) {
        return false;
    }

    let player = currentPlayer(context);

    if (player.hasPutCards) {
        return false;
    }

    let cards = player.cards;
    let groups = groupCard(context.round, cards);
    let round = roundType(context.round);

    for (let i = 0; i < round.length; i++) {
        if (!check(groups[i], round[i])) {
            return false;
        }
    }
    return true;
}

export const canPutCard: GameGuard<"putCard"> = (context, event) => {
    if (!((context.currentPlayer === event.playerId) && context.doesCurrentPlayerTakeCard)) {
        return false;
    }

    if (!(!context.hasPlayerJustPutCards || (event.to < (context.board.length - roundType(context.round).length)))) {
        return false;
    }

    let player = currentPlayer(context);

    if (!(player.hasPutCards && player.cards.length > 1)) {
        return false;
    }

    const card = player.cards[event.from];
    const board = context.board[event.to];

    if (check(board, DeckType.BRELAN)) {
        return check([...board, card], DeckType.BRELAN);
    } else {
        return check([...board, card], DeckType.SUITE) || check([card, ...board], DeckType.SUITE);
    }
}

export const isWinningRoundDrop: GameGuard<"dropCard"> = (context, event) => {
    if (!canDropCard(context, event)) {
        return false;
    }
    let cards = currentPlayer(context).cards.slice();
    // suppression de la carte à jeter
    cards = cards.filter((_, i) => i !== event.index);
    // on regarde si le score de la main vaut 0
    let scores = cards.map((c) => c.score);
    let score = scores.reduce((sum, current) => sum + current, 0);
    return score === 0;
}

export const isWinningGameDrop: GameGuard<"dropCard"> = (context, event) => {
    return (context.round === 6) && isWinningRoundDrop(context, event);
}