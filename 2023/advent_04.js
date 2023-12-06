const parseNumbers = str => {
    const [win, act] = str.split('|');
    return {
        win: new Set(win.trim().split(/\s+/).map(s => s.trim())),
        act: act.trim().split(/\s+/).map(s => s.trim()),
    }
}

const cards = input => input
    .map(str => str.split(':'))
    .map(arr => ({
        card: arr[0].split(/\s+/)[1],
        numbers: parseNumbers(arr[1])
    }))
    .map(({card, numbers}) => ({
        card,
        wins: numbers.act.filter(v => numbers.win.has(v)).length
    }));

exports.part1 = input => cards(input)
    .map(({wins}) => wins > 0 ? 1 << wins - 1 : 0)
    .reduce((acc, v) => acc + v);

exports.part2 = input => cards(input)
    .map(({card, wins}) => ({
        card,
        copies: Array.from({length: wins}).map((_, i) => '' + (card - 0 + i + 1))
    }))
    .reduce((acc, c) => {
        const amount = 1 + (acc.copies[c.card] ?? 0);
        return {
            total: acc.total + amount,
            copies: {
                ...acc.copies,
                ...c.copies.reduce((cp, i) => ({...cp, [i]: (acc.copies[i] ?? 0) + amount}), {})
            }
        }
    }, {
        total: 0,
        copies: {}
    }).total;