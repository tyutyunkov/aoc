const pattern = /Sensor at x=(?<sX>-?\d+), y=(?<sY>-?\d+): closest beacon is at x=(?<bX>-?\d+), y=(?<bY>-?\d+)/;

const inputFile = process.argv[2] ?? 'input_15.test.txt';
const target = (process.argv[3] ?? 10) - 0;

const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd();

const sensors = input.split('\n')
    .map(line => pattern.exec(line))
    .map(match => match.groups)
    .map(({sX, sY, bX, bY}) => ({
        x: sX - 0,
        y: sY - 0,
        d: Math.abs(sX - bX) + Math.abs(sY - bY),
        beacon: {x: bX - 0, y: bY - 0},
    }));

const buildExcludes = line => sensors.map(({x, y, d}) => {
    const dist = d - Math.abs(y - line) + 1;
    return dist >= 0 ? [x - dist + 1, x + dist - 1] : [0, -Infinity]
})
    .filter(l => l[0] <= l[1])
    .sort((a, b) => a[0] - b[0] !== 0 ? a[0] - b[0] : a[1] - b[1])
    .reduce((acc, cur) => {
        const last = acc.pop() ?? cur;
        if (last[1] < cur[0]) {
            acc.push(last);
            acc.push(cur);
        } else {
            acc.push([last[0], Math.max(last[1], cur[1])]);
        }
        return acc;
    }, []);

const length = excludes => excludes.reduce((acc, ex) => acc + ex[1] - ex[0], 0);

const excludes1 = buildExcludes(target)
const part1 = length(excludes1);
console.log(part1)

const lowX = process.argv[4] ?? 0;
const highX = process.argv[5] ?? 20;
const limitExcludes = (excludes, low, high) =>
    excludes.map(ex => [Math.max(ex[0], low), Math.min(ex[1], high)])
        .filter(ex => ex[0] <= ex[1]);

const part2Coords =
    Array.from({length: Math.max(target - lowX - 1, highX - target - 1)})
        .flatMap((_, i) => [target - i - 1, target + i + 1])
        .reduce((acc, y, ind, arr) => {
            const ex = limitExcludes(buildExcludes(y), lowX, highX);
            const l = length(ex);
            if (l < highX - lowX) {
                arr.splice(ind);
                const x = ex[0][1] + 1;
                ex.length === 2 && l - highX + lowX === 1 || console.error(`more than one solution: y=${y}, x=${x}`);
                return {x, y}
            }
        }, undefined);

const part2 = part2Coords.x * highX + part2Coords.y;
console.log(part2);