import { Pattern, Card, GameContext, Player, CardSuit, CardValue, GameEvent } from "../types";

export function currentPlayer(context: GameContext): Player {
    const player = context.players.find(p => p.id === context.currentPlayer)
    if (player === undefined) {
        throw new Error("Impossible de récupérer le joueur courant")
    }
    return player
}

export function shuffle<T>(array: Array<T>) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

export function getCardSymbole(card: Card): JSX.Element {
    if (card.suit === null) { return <>Joker</>; }
    switch (card.suit!) {
        case CardSuit.DIAMS: return <>&diams;</>;
        case CardSuit.SPADES: return <>&spades;</>;
        case CardSuit.CLUBS: return <>&clubs;</>;
        case CardSuit.HEARTS: return <>&hearts;</>;
    }
}

export function getCardClassName(card: Card): string {
    let className = "card ";
    if (card.suit === null) { return className + "little joker"; }
    className += "rank-" + card.value!.toLowerCase();
    className += " ";
    className += card.suit!;
    return className;
}

export function getRoundPattern(context: GameContext): Pattern[] {
    switch (context.round) {
        case 1: return [Pattern.BRELAN, Pattern.BRELAN];
        case 2: return [Pattern.SUITE, Pattern.BRELAN];
        case 3: return [Pattern.SUITE, Pattern.SUITE];
        case 4: return [Pattern.BRELAN, Pattern.BRELAN, Pattern.BRELAN];
        case 5: return [Pattern.SUITE, Pattern.BRELAN, Pattern.BRELAN];
        case 6: return [Pattern.SUITE, Pattern.SUITE, Pattern.BRELAN];
        default: return [];
    }
}

export function numberOfCardsNeeded(type: Pattern): number {
    return (type === Pattern.BRELAN) ? 3 : 4;
}

function isBrelan(cards: Card[]): boolean {
    const values = cards.map((c) => c.value);
    const suits = cards.map((c) => c.suit);

    // si toutes les cartes ont la meme hauteur
    if ((new Set(values)).size !== 1) { return false; }

    const suitsSet = new Set(suits);

    // si toutes les cartes sont des jokers
    if ((suitsSet.size === 1) && (suits[0] === null)) { return true; }

    // si les cartes sont de 3 couleurs differentes
    return suitsSet.size === 3;
}

function isSuite(cards: Card[]): boolean {
    if (cards.length < 4) { return false; }

    // si les cartes sont de même couleur + joker
    const suits = cards.map((c) => c.suit);
    const numberOfSuits = (new Set(suits)).size;
    if (!(numberOfSuits === 1 || (numberOfSuits === 2 && suits.includes(null)))) { return false }

    // si c'est les 4 premières cartes et qu'il y a 2 jokers
    if (cards.length === 4 && cards.filter((c) => !c.suit).length >= 2) { return false }

    const values = cards.map((c) => c.value);
    const cardValues = Object.values(CardValue);
    let indexOfValues: number[] = [];
    for (let v of values) {
        if (v === null) {
            const indexesLength = indexOfValues.length;
            if ((indexesLength === 0) || (indexOfValues[indexesLength - 1] === -1)) {
                indexOfValues.push(-1);
            } else {
                indexOfValues.push(indexOfValues[indexesLength - 1] + 1);
            }
        } else {
            indexOfValues.push(cardValues.indexOf(v));
        }
    }

    let lastIndexOfUnknowValue = indexOfValues.lastIndexOf(-1);
    while (lastIndexOfUnknowValue > -1) {
        indexOfValues[lastIndexOfUnknowValue] = indexOfValues[lastIndexOfUnknowValue + 1] - 1;
        lastIndexOfUnknowValue = indexOfValues.lastIndexOf(-1);
    }

    let expected = cards.map((_, i) => i + indexOfValues[0]);

    if (expected[cards.length - 1] === Object.values(CardValue).length) {
        expected[cards.length - 1] = 0;
    }

    return indexOfValues.every((v, i) => v === expected[i]);
}

export function check(cards: Card[], type: Pattern): boolean {
    return (type === Pattern.BRELAN) ? isBrelan(cards) : isSuite(cards);
}

export function groupCard(context: GameContext, cards: Card[]): Card[][] {
    let copy = cards.slice();
    const numberOfCards = getRoundPattern(context).map((t) => numberOfCardsNeeded(t));

    let list: Card[][] = [];

    for (let number of numberOfCards) {
        let sublist: Card[] = [];
        for (let i = 0; i < number; i++) {
            sublist.push(copy.shift()!);
        }
        list.push(sublist);
    }

    if (copy.length > 0) {
        list.push(copy);
    }

    return list;
}

export function getDeckScore(cards: Card[]): number {
    return cards.map((c) => c.score).reduce((sum, current) => sum + current, 0);
}

export function getSelectedPattern(context: GameContext, event: GameEvent<"putCard">): Pattern {
    const roundPattern = getRoundPattern(context);
    const numberOfCards = context.board.map((cards) => cards.length);

    var indexOfGroup = 0;
    var firstIndexOfGroup = numberOfCards[0];
    while (indexOfGroup < numberOfCards.length && firstIndexOfGroup < event.to) {
        indexOfGroup++;
        firstIndexOfGroup += numberOfCards[indexOfGroup];
    }
    return roundPattern[indexOfGroup % roundPattern.length];
}

export function getSelectedBoardPackAfterCardWasPlaced(context: GameContext, event: GameEvent<"putCard">): Card[] {
    let player = currentPlayer(context);
    let cardSelected = player.cards[event.from];
    let deckSelected = context.board[event.to];
    return event.after ? [...deckSelected, cardSelected] : [cardSelected, ...deckSelected];
}