const parse = input => input[0].split(',').map(str => str.trim())

const hash = str => str.split('')
    .map(c => c.charCodeAt(0))
    .reduce((acc, c) => (acc + c) * 17 % 256, 0);

exports.part1 = input => parse(input).map(hash).reduce((acc, v) => acc + v, 0);

exports.part2 = input =>
    Object.entries(
        parse(input)
            .map(str => /(?<s>\w+)(?<op>[=-])(?<len>\d+)?/.exec(str).groups)
            .reduce((acc, {s, op, len}) => {
                const hashValue = hash(s);
                const box = acc[hashValue] ?? [];
                return op === '-'
                    ? ({...acc, [hashValue]: box.filter(v => v.s !== s)})
                    : (!box.some(v => v.s === s)
                            ? ({...acc, [hashValue]: [...box, {s, len}]})
                            : ({...acc, [hashValue]: box.map(v => v.s === s ? {s, len} : v)})
                    );
            }, {})
    )
        .flatMap(([i, box]) => box.map(({len}, j) => (i - 0 + 1) * (j + 1) * len))
        .reduce((acc, v) => acc + v, 0);