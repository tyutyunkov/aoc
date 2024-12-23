const parse = input => input
    .map(row => row.split('-'))
    .reduce((acc, [a, b]) => {
        (acc[a] = acc[a] ?? new Set()).add(b);
        (acc[b] = acc[b] ?? new Set()).add(a);
        return acc;
    }, {})

exports.part1 = input => {
    const connections = parse(input);
    return input.map(row => row.split('-'))
        .flatMap(([a, b]) => Array.from(connections[a])
            .filter(c => c !== b)
            .filter(c => connections[b].has(c))
            .map(c => [a, b, c]))
        .filter(group => group.some(key => key.startsWith('t')))
        .length / 3;
};

exports.part2 = input => {
    const connections = parse(input);
    const groups = {}
    input.map(row => row.split('-').sort())
        .forEach(([a, b]) => {
            groups[a] = groups[a] ?? [];
            groups[a].filter(group => group.every(key => connections[key].has(b)))
                .forEach(group => group.push(b));
            groups[a].push([a, b])
        })

    return Object.values(groups)
        .flatMap(group => group)
        .reduce((max, group) => max.length > group.length ? max : group, [])
        .sort()
        .join(',');
}
