const pattern = (cards, withJoker) => {
    const repeats = cards.split('').reduce((acc, c) => ({...acc, [c]: (acc[c] ?? 0) + 1}), {});
    const jokers = withJoker ? repeats['J'] ?? 0 : 0;
    const stat = Object.entries(repeats)
        .filter(([v, _]) => !withJoker || v !== 'J')
        .reduce((acc, [v, c]) => ({...acc, [c]: [...(acc[c] ?? []), v]}), {});
    const maxRepeats = Object.keys(stat).reduce((acc, v) => Math.max(acc, v - 0), 0)
    switch (maxRepeats + jokers) {
        case 5:
            return 7;
        case 4:
            return 6;
        case 3:
            return (jokers === 0 && !!stat[2]) || (jokers === 1 && stat[2].length === 2) ? 5 : 4;
        case 2:
            return jokers === 0 && stat[2].length === 2 ? 3 : 2;
        case 1:
            return 1;
        default:
            return 0;
    }
}

const zip = (a, b) => a.map((k, i) => [k, b[i]]);
const parse = input => input
    .map(row => row.split(' '))

const cardsCompare = (cardValues) => (a, b) =>
    zip(
        a.split('').map(card => cardValues.indexOf(card)),
        b.split('').map(card => cardValues.indexOf(card))
    )
        .reduce((acc, [c1, c2]) => acc !== 0 ? acc : c1 - c2, 0)

const calculatePoints = withJoker => input => {
    const compare = withJoker
        ? cardsCompare(['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse())
        : cardsCompare(['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse());
    return parse(input)
        .map(([cards, points]) => ({cards, points, pattern: pattern(cards, withJoker)}))
        .sort((a, b) => a.pattern - b.pattern === 0 ? compare(a.cards, b.cards) : a.pattern - b.pattern)
        .reduce((acc, {points}, i) => acc + points * (i + 1), 0)

}

exports.part1 = calculatePoints(false)

exports.part2 = calculatePoints(true)