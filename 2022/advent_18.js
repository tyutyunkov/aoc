const inputFile = process.argv[2] ?? 'input_18.test.txt';

const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd();

const coords = input.split('\n')
    .map(row => row.split(','))
    .map(row => ({x: row[0] - 0, y: row[1] - 0, z: row[2] - 0}))

const gi = (obj, i) => (obj[i] = obj[i] ?? {});
const get = (map, {x, y, z}) => gi(gi(map, x), y)[z] ?? 0
const set = (map, {x, y, z}, v) => gi(gi(map, x), y)[z] = v || 1;

const surrounds = ({x, y, z}) => ([
    {x: x - 1, y, z}, {x: x + 1, y, z},
    {x, y: y - 1, z}, {x, y: y + 1, z},
    {x, y, z: z - 1}, {x, y, z: z + 1},
])
const map = {};

const part1 = coords.reduce((count, c) => {
    set(map, c, 1);
    const free = 6 - surrounds(c).filter(c => get(map, c) === 1).length * 2;
    return count + free;
}, 0);

console.log(part1);

const getBorders = keys => keys.reduce(({min, max}, key) => ({min: Math.min(min, key - 1), max: Math.max(max, (key - 0) + 1)}), {min: Infinity, max: -Infinity});

const xl = getBorders(Object.keys(map));
const yl = getBorders(Object.values(map).flatMap(xr => Object.keys(xr)));
const zl = getBorders(Object.values(map).flatMap(xr => Object.values(xr).flatMap(yr => Object.keys(yr))));
const inBorders = ({x, y, z}) => x >= xl.min && x <= xl.max && y >= yl.min && y <= yl.max && z >= zl.min && z <= zl.max;
const queue = [{x: xl.min, y: yl.min, z: zl.min}];
while (queue.length > 0) {
    const item = queue.pop();
    set(map, item, 2)
    surrounds(item)
        .filter(c => inBorders(c))
        .filter(c => !get(map, c))
        .forEach(c => queue.push(c));
}

const part2 = coords.reduce((count, c) => {
    return count + surrounds(c).filter(c => get(map, c) === 2).length;
}, 0)

console.log(part2);