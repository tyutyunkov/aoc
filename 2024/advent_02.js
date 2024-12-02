const parse = input => input
    .map(row => row.split(/\s+/).map(Number))

const isDiffSafe = (a, b) => Math.abs(a - b) > 0 && Math.abs(a - b) < 4;
const isIncSafe = (a, b, inc) => inc === undefined || inc === Math.sign(a - b);

const isSafe = row => row.slice(1)
    .reduce(
        ({safe, value, inc}, v) => ({
            safe: safe && isIncSafe(v, value, inc) && isDiffSafe(v, value),
            value: v,
            inc: Math.sign(v - value)
        }),
        {safe: true, value: row[0], inc: undefined}
    )
    .safe;

exports.part1 = input => parse(input).filter(isSafe).length;

function isSafeE(row) {
    return Array.from(({length: row.length}))
        .map((_, i) => i)
        .map(i => ([...row.slice(0, i), ...row.slice(i + 1)]))
        .some(isSafe);
}

exports.part2 = input => parse(input).filter(row => isSafe(row) || isSafeE(row)).length;