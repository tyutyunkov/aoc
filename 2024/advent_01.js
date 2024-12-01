const parse = input => input
    .map(row => row.split(/\s+/).map(Number))
    .map(([l, r]) => ({l, r}));

exports.part1 = input => {
    const {left, right} = parse(input)
        .reduce(({left, right}, {l, r}) => ({
            left: [...left, l],
            right: [...right, r]
        }), {left: [], right: []});

    left.sort();
    right.sort();

    return Array.from({length: left.length})
        .map((_, i) => Math.abs(left[i] - right[i]))
        .reduce((acc, v) => acc + v, 0);
};

exports.part2 = input => {
    const {left, right} = parse(input)
        .reduce(({left, right}, {l, r}) => ({
            left: [...left, l],
            right: {...right, [r]: (right[r] ?? 0) + 1}
        }), {left: [], right: {}});

    return left.reduce((acc, v) => acc + v * (right[v] ?? 0), 0);
};