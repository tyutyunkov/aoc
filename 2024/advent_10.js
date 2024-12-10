const parse = input => input
    .map(row => row.split('').map(Number))

const directions = [
    {dx: 0, dy: -1},
    {dx: 1, dy: 0},
    {dx: 0, dy: 1},
    {dx: -1, dy: 0}
]

const distinctXY = arr => Array.from(new Set(arr.map(({x, y}) => x + ',' + y)))
    .map(xy => xy.split(',').map(Number))
    .map(([x, y]) => ({x, y}));

const inMap = (map, {x, y}) => x >= 0 && x < map[0].length && y >= 0 && y < map.length;
const trail = (map, xy) => map[xy.y][xy.x] === 9
    ? [xy]
    : directions
        .map(({dx, dy}) => ({x: xy.x + dx, y: xy.y + dy}))
        .filter(xy => inMap(map, xy))
        .filter(({x, y}) => map[y][x] === map[xy.y][xy.x] + 1)
        .flatMap(xy => trail(map, xy))

const findValues = (map, value) => Array.from({length: map.length}, (_, y) => y)
    .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
    .filter(({x, y}) => map[y][x] === value);

exports.part1 = input => {
    const map = parse(input);

    return findValues(map, 0)
        .map(xy => trail(map, xy, {}))
        .map(distinctXY)
        .map(routes => routes.length)
        .reduce((acc, v) => acc + v, 0);
};

exports.part2 = input => {
    const map = parse(input);

    return findValues(map, 0)
        .map(xy => trail(map, xy))
        .map(routes => routes.length)
        .reduce((acc, v) => acc + v, 0);
};