const parse = input => input
    .map(str => /(?<d>[RDLU])\s(?<steps>\d+)\s(\(#(?<color>[0-9a-f]{6})\))/.exec(str).groups)
    .map(({d, steps, color}) => ({d, steps: steps - 0, color}))

const moveCodes = 'RDLU';
const moves = {
    'R': {dx: 1, dy: 0},
    'D': {dx: 0, dy: 1},
    'L': {dx: -1, dy: 0},
    'U': {dx: 0, dy: -1},
}

const mergeLines = (y, lines) =>
    [...lines].sort((a, b) => a.start - b.start === 0 ? a.end - b.end : a.start - b.start)
        .reduce(({width, result}, {start, end}) => {
                if (result.length < 1) {
                    return {width: width + (end - start + 1), result: [{y, start, end}]};
                }

                const line = result.pop();
                if (start === line.start) {
                    return end === line.end ? {width, result: [...result]} : {
                        width: width + (end - line.end),
                        result: [...result, {y, start: line.end, end}]
                    };
                } else if (start === line.end) {
                    return {width: width + end - start, result: [...result, {y, start: line.start, end}]}
                } else if (end === line.end) {
                    return {width, result: [...result, {y, start: line.start, end: start}]}
                } else if (start > line.start && end < line.end) {
                    return {width, result: [...result, {y, start: line.start, end: start}, {y, start: end, end: line.end}]}
                } else {
                    return {width: width + (end - start + 1), result: [...result, line, {y, start, end}]}
                }
            }, {width: 0, result: []}
        )

const buildLines = rows =>
    rows.reduce(({pos: {x, y}, lines}, {d, steps}) => {
            const nx = x + moves[d].dx * steps;
            const ny = y + moves[d].dy * steps;
            return ({
                pos: {x: nx, y: ny},
                lines: y === ny ?
                    [...lines, {y, start: Math.min(x, nx), end: Math.max(x, nx)}]
                    : lines
            })
        }, {pos: {x: 0, y: 0}, lines: []}
    ).lines

const groupLines = lines => Object.values(lines.reduce((acc, line) => ({...acc, [line.y]: [...(acc[line.y] ?? []), line]}), {}))

const countInside = rows =>
    groupLines(buildLines(rows))
        .sort((a, b) => a[0].y - b[0].y)
        .reduce(({width, value, ly, items}, lines) => {
            const y = lines[0].y;
            const merge = mergeLines(y, [...items, ...lines])
            return ({
                value: value + merge.width + (ly !== undefined ? (width * (y - ly - 1)) : 0),
                width: merge.result.map(({start, end}) => end - start + 1).reduce((acc, v) => acc + v, 0),
                items: merge.result,
                ly: y
            })
        }, {value: 0, width: 0, items: []})
        .value

exports.part1 = input =>
    countInside(parse(input));

exports.part2 = input =>
    countInside(parse(input)
        .map(row => row.color)
        .map(str => /(?<hex>.+)(?<code>.)/.exec(str).groups)
        .map(({hex, code}) => ({d: moveCodes.charAt(code), steps: parseInt(hex, 16)}))
    );