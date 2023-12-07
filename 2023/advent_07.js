const pattern = cards => {
    const repeats = cards.split('')
        .reduce((acc, c) => ({...acc, [c]: (acc[c] ?? 0) + 1}), {});
    const stat = Object.entries(repeats)
        .reduce((acc, [v, c]) => ({...acc, [c]: [...(acc[c] ?? []), v]}), {});
    const maxRepeats = Object.keys(stat).reduce((acc, v) => Math.max(acc, v - 0), 0)
    switch (maxRepeats) {
        case 5:
            return 7;
        case 4:
            return 6;
        case 3:
            return !!stat[2] ? 5 : 4;
        case 2:
            return stat[2].length === 2 ? 3 : 2;
        case 1:
            return 1;
        default:
            return 0;
    }
}

const patternWithJoker = cards => {
    const repeats = cards.split('')
        .reduce((acc, c) => ({...acc, [c]: (acc[c] ?? 0) + 1}), {});
    const jokers = repeats['J'] ?? 0;
    const stat = Object.entries(repeats)
        .filter(([v, _]) => v !== 'J')
        .reduce((acc, [v, c]) => ({...acc, [c]: [...(acc[c] ?? []), v]}), {});
    const maxRepeats = Object.keys(stat).reduce((acc, v) => Math.max(acc, v - 0), 0)
    switch (maxRepeats + jokers) {
        case 5:
            return 7;
        case 4:
            return 6;
        case 3: {
            if (jokers === 0) {
                return !!stat[2] ? 5 : 4;
            }
            if (jokers === 1) {
                return stat[2].length === 2 ? 5 : 4;
            }
            return 4;
        }
        case 2: {
            if (jokers === 0) {
                return stat[2].length === 2 ? 3 : 2;
            }
            return 2;
        }
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

exports.part1 = input => {
    const compare = cardsCompare(['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse());
    const rows = parse(input)
        .map(([cards, points]) => ({cards, points, pattern: pattern(cards)}));
    rows.sort((a, b) => a.pattern - b.pattern === 0 ? compare(a.cards, b.cards) : a.pattern - b.pattern)
    return rows.reduce((acc, {points}, i) => acc + points * (i + 1), 0);
};

exports.part2 = input => {
    const compare = cardsCompare(['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse());
    const rows = parse(input)
        .map(([cards, points]) => ({cards, points, pattern: patternWithJoker(cards)}));
    rows.sort((a, b) => a.pattern - b.pattern === 0 ? compare(a.cards, b.cards) : a.pattern - b.pattern)
    return rows.reduce((acc, {points}, i) => acc + points * (i + 1), 0);
};