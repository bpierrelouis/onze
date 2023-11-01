import { DeckType, Card, GameContext, Player, CardSuit, CardValue } from "../types";

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

export function roundType(round: GameContext["round"]): DeckType[] {
    switch (round) {
        case 1: return [DeckType.BRELAN, DeckType.BRELAN];
        case 2: return [DeckType.SUITE, DeckType.BRELAN];
        case 3: return [DeckType.SUITE, DeckType.SUITE];
        case 4: return [DeckType.BRELAN, DeckType.BRELAN, DeckType.BRELAN];
        case 5: return [DeckType.SUITE, DeckType.BRELAN, DeckType.BRELAN];
        case 6: return [DeckType.SUITE, DeckType.SUITE, DeckType.BRELAN];
        default: return [];
    }
}

export function numberOfCardsNeeded(type: DeckType): number {
    return (type === DeckType.BRELAN) ? 3 : 4;
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
    if (!((numberOfSuits === 1) || (numberOfSuits === 2 && suits.includes(null)))) { return false; }

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

export function check(cards: Card[], type: DeckType): boolean {
    return (type === DeckType.BRELAN) ? isBrelan(cards) : isSuite(cards);
}

export function groupCard(round: GameContext["round"], cards: Card[]): Card[][] {
    let copy = cards.slice();
    const numberOfCards = roundType(round).map((t) => numberOfCardsNeeded(t));

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