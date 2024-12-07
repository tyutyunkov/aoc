const parse = input => input
    .map(row => row.split(':'))
    .map(([result, items]) => ({result: Number(result), items: items.trim().split(' ').map(Number)}))

exports.part1 = input => {
    const rows = parse(input);

    const check = (acc, row, test) => row.length === 0
        ? acc === test
        : check(acc + row[0], row.slice(1), test)
        || check(acc * row[0], row.slice(1), test)

    return rows
        .filter(row => check(row.items[0], row.items.slice(1), row.result))
        .map(row => row.result)
        .reduce((acc, v) => acc + v, 0);
};

exports.part2 = input => {
    const rows = parse(input);

    const check = (acc, row, test) => row.length === 0
        ? acc === test
        : check(acc + row[0], row.slice(1), test)
        || check(acc * row[0], row.slice(1), test)
        || check(Number(acc + '' + row[0]), row.slice(1), test)

    return rows
        .filter(row => check(row.items[0], row.items.slice(1), row.result))
        .map(row => row.result)
        .reduce((acc, v) => acc + v, 0);
};