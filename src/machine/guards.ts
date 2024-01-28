import { check, currentPlayer, groupCard, getRoundPattern, getSelectedBoardPackAfterCardWasPlaced, getSelectedPattern } from "../func/game";
import { GameGuard } from "../types";

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
    let groups = groupCard(context, cards);
    let roundPattern = getRoundPattern(context);

    for (let i = 0; i < roundPattern.length; i++) {
        if (!check(groups[i], roundPattern[i])) {
            return false;
        }
    }
    return true;
}

export const canPutCard: GameGuard<"putCard"> = (context, event) => {
    let player = currentPlayer(context);

    const isNotHisTurn = context.currentPlayer !== event.playerId;
    const didNotDraw = !context.doesCurrentPlayerTakeCard;
    const didNotPutCards = !player.hasPutCards;
    const hasOneCardLeft = player.cards.length === 1;

    if (isNotHisTurn || didNotDraw || didNotPutCards || hasOneCardLeft) {
        return false;
    }

    const board = context.board;
    const roundPattern = getRoundPattern(context);

    const isTryingToCompleteHisOwnGame = event.to >= (board.length - roundPattern.length);

    if (context.hasPlayerJustPutCards && isTryingToCompleteHisOwnGame) {
        return false;
    }

    const pack = getSelectedBoardPackAfterCardWasPlaced(context, event);
    const pattern = getSelectedPattern(context, event);

    return check(pack, pattern);
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