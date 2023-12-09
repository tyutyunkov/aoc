const parse = input => input
    .map(str => str.split(' ').map(v => v - 0))

const diffRow = row => row.slice(1)
    .reduce(({c, diff}, v) => ({
            c: v,
            diff: [...diff, v - c]
        }),
        {c: row[0], diff: []}
    ).diff

const buildDiffs = row => {
    const diffs = [row];
    let diff = row;
    do {
        diff = diffRow(diff);
        diffs.push(diff)
    } while (diff.some(v => v !== 0))
    return diffs;
}

exports.part1 = input =>
    parse(input).map(buildDiffs)
        .map(diffs => diffs.reduceRight((acc, r) => acc + r[r.length - 1], 0))
        .reduce((acc, v) => acc + v, 0);

exports.part2 = input =>
    parse(input).map(buildDiffs)
        .map(diffs => diffs.reduceRight((acc, r) => r[0] - acc, 0))
        .reduce((acc, v) => acc + v, 0);