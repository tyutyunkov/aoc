const parse = input => input
    .map(str => str.split('').map(v => ({v, h: -1})))

const moves = [
    {dx: 0, dy: -1},
    {dx: -1, dy: 0},
    {dx: 0, dy: 1},
    {dx: 1, dy: -0},

]

const fillMap = (map, steps) => {
    const center = (map.length - 1) / 2
    map[center][center].h = 0;

    let i = 0;
    let positions = [{x: center, y: center}]
    while (++i <= steps) {
        const newPositions = []
        positions.forEach(({x, y}) => moves
            .map(({dx, dy}) => ({x: x + dx, y: y + dy}))
            .filter(({x, y}) => y >= 0 && y < map.length
                && x >= 0 && x < map[y].length
                && map[y][x].v !== '#' && map[y][x].h === -1)
            .forEach(({x, y}) => {
                if (map[y][x].h === -1) {
                    newPositions.push({x, y});
                    map[y][x].h = i;
                }
            })
        );

        positions = newPositions;
    }
}

const countItems = (map, mod) => countItemsSector(map, mod, 0, 0, map.length);
const countItemsSector = (map, mod, sx, sy, size) =>
    Array.from(({length: size}))
        .map((_, y) => sy * size + y)
        .map(y => Array.from({length: size})
            .map((_, x) => sx * size + x)
            .filter(x => map[y][x].h > -1 && map[y][x].h % 2 === mod).length
        )
        .reduce((acc, v) => acc + v)

exports.part1 = input => {
    const map = parse(input);
    fillMap(map, 64)
    return countItems(map, 0)
};

exports.part2 = input => {
    const steps = 26501365;
    const map = parse(input);

    const size = map.length;
    size === 131 || console.error('Unexpected map') && process.exit(-2)
    const center = (size - 1) / 2;
    (steps - center) % size === 0 || console.error('It will not work') && process.exit(-3);

    const shift = 2;
    const prepareSteps = size * 2 + center;

    const extendedMap = Array.from({length: shift * 2 + 1})
        .flatMap(_ => map.map(row => Array.from({length: shift * 2 + 1}).flatMap(_ => row.map(v => ({...v})))))
    fillMap(extendedMap, prepareSteps)

    const cycle = (steps - center) / size / 2;

    return (1 + 4 * cycle * (cycle - 1)) * countItemsSector(extendedMap, 1, shift, shift, size)
        + (4 * cycle * cycle) * countItemsSector(extendedMap, 1, shift + 1, shift, size)
        + (2 * cycle - 1) * (
            countItemsSector(extendedMap, 1, shift - 1, shift - 1, size)
            + countItemsSector(extendedMap, 1, shift + 1, shift - 1, size)
            + countItemsSector(extendedMap, 1, shift + 1, shift + 1, size)
            + countItemsSector(extendedMap, 1, shift - 1, shift + 1, size)
        )
        + 2 * cycle * (
            countItemsSector(extendedMap, 1, shift - 2, shift - 1, size)
            + countItemsSector(extendedMap, 1, shift + 1, shift - 2, size)
            + countItemsSector(extendedMap, 1, shift + 2, shift + 1, size)
            + countItemsSector(extendedMap, 1, shift - 1, shift + 2, size)
        )
        + countItemsSector(extendedMap, 1, shift, shift - 2, size)
        + countItemsSector(extendedMap, 1, shift + 2, shift, size)
        + countItemsSector(extendedMap, 1, shift, shift + 2, size)
        + countItemsSector(extendedMap, 1, shift - 2, shift, size)
};