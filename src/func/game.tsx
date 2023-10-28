import { DeckType, GameCard, GameContext, Player, cardSuits, cardValues } from "../types";

export function currentPlayer(context: GameContext): Player {
    const player = context.players.find(p => p.id === context.currentPlayer)
    if (player === undefined) {
        throw new Error("Impossible de récupérer le joueur courant")
    }
    return player
}

function getDeck() {
    let deck = [] as GameCard[];

    for (let suit of cardSuits) {
        for (let value of cardValues) {
            let card = { suit: suit, value: value };
            deck.push(card);
        }
    }

    return deck;
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
export function getTwoDecksShuffled(): GameCard[] {
    return shuffle([...getDeck(), ...getDeck()]);
}

export function symbole(card: GameCard) {
    switch (card.suit) {
        case "diams": return <>&diams;</>;
        case "spades": return <>&spades;</>;
        case "clubs": return <>&clubs;</>;
        case "hearts": return <>&hearts;</>;
    }
}
export function className(card: GameCard) {
    let className = "card rank-";
    className += card.value.toLowerCase();
    className += " ";
    className += card.suit;
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

function isBrelan(cards: GameCard[]): boolean {
    const values = cards.map((c) => c.value);
    const suits = cards.map((c) => c.suit);

    if ((new Set(values)).size !== 1) {
        return false;
    }
    return (new Set(suits)).size === cards.length;
}

function isSuite(cards: GameCard[]): boolean {
    const suits = cards.map((c) => c.suit);
    const values = cards.map((c) => c.value);
    const valueIndexes = values.map((v) => cardValues.indexOf(v));

    if ((new Set(suits)).size !== 1) {
        return false;
    }

    let expected = cards.map((_, i) => i + valueIndexes[0]);

    if (expected[cards.length - 1] === cardValues.length) {
        expected[cards.length - 1] = 0;
    }

    return valueIndexes.every((v, i) => v === expected[i]);
}

export function check(cards: GameCard[], type: DeckType): boolean {
    return (type === DeckType.BRELAN) ? isBrelan(cards) : isSuite(cards);
}

export function groupCard(round: GameContext["round"], cards: GameCard[]): GameCard[][] {
    let copy = cards.slice();
    const numberOfCards = roundType(round).map((t) => numberOfCardsNeeded(t));

    let list: GameCard[][] = [];

    for (let number of numberOfCards) {
        let sublist: GameCard[] = [];
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

export function getScore(card: GameCard): number {
    let value = cardValues.indexOf(card.value) + 1;
    if ([2, 3].includes(value)) { return 0; }
    if (value > 10) { return 10; }
    return value;
}

export function getDeckScore(cards: GameCard[]): number {
    return cards.map((c) => getScore(c)).reduce((sum, current) => sum + current, 0);
}