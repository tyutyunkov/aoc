const parse = input => input

const next = num => {
    const a = ((num * 64) ^ num) & 0xFFFFFF
    const b = (Math.floor(a / 32) ^ a) & 0xFFFFFF
    return ((b * 2048) ^ b) & 0xFFFFFF;
}
const sequence = num => {
    let current = num;
    return {
        next: () => {
            current = next(current);
            return current;
        }
    }
}

const length = 2000;

exports.part1 = input => {
    return parse(input)
        .map(num => Array.from({length}).reduce(acc => next(acc), num))
        .reduce((acc, v) => acc + v, 0);
};

exports.part2 = input => {
    const prices = parse(input)
        .map(sequence)
        .map(seq => Array.from({length}, _ => seq.next() % 10)
            .reduce((acc, v) => {
                if (acc.prev !== undefined) {
                    acc.diffs.push(String.fromCharCode(74 + v - acc.prev));
                }
                acc.prev = v;
                acc.prices.push(v)
                return acc;
            }, {prev: undefined, prices: [], diffs: []})
        )
        .map(({prices, diffs}) => ({prices: prices.join(''), diffs: diffs.join('')}));

    const getPrice = (seq, pattern) => {
        const pos = seq.diffs.indexOf(pattern);
        return pos === -1 ? 0 : Number(seq.prices.at(pos + 4));
    }

    // it was enough to check patters only from the first sequence
    let i = 0, maxPrice = 0;
    while (i < length - 4 - 1) {
        const pattern = prices[0].diffs.slice(i, i + 4);
        const price = prices.map(seq => getPrice(seq, pattern)).reduce((acc, v) => acc + v, 0);
        if (price > maxPrice) {
            maxPrice = price;
        }
        ++i;
    }
    return maxPrice;
};

exports.part2b = input => {
    const buyers = parse(input)
        .map(sequence)
        .map(seq => Array.from({length}, _ => seq.next() % 10)
            .reduce((acc, v) => {
                if (acc.prev !== undefined) {
                    acc.diffs.push(String.fromCharCode(74 + v - acc.prev));
                }
                acc.prev = v;
                acc.prices.push(v)
                return acc;
            }, {prev: undefined, prices: [], diffs: []})
        )
        .map(({prices, diffs}) => {
            return diffs.reduce((acc, v, i) => {
                acc.pattern.push(v);
                if (acc.pattern.length < 4) {
                    return acc;
                }
                acc.prices[acc.pattern.join('')] ??= prices[i + 1];
                acc.pattern.shift();
                return acc;
            }, {prices: {}, pattern: []})
        })
        .map(({prices}) => prices);

    const cache = {};
    return buyers.reduce((max, prices) => Object.keys(prices)
            .map(pattern => cache[pattern] ??= buyers.map(buyer => buyer[pattern] ?? 0).reduce((acc, v) => acc + v, 0))
            .reduce((acc, v) => Math.max(acc, v), max),
        0
    );
};