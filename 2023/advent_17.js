const parse = input => input
    .map(str => str.split('').map(v => v - 0))

const directions = [
    {type: 'n', dx: 0, dy: -1},
    {type: 'w', dx: -1, dy: 0},
    {type: 's', dx: 0, dy: 1},
    {type: 'e', dx: 1, dy: 0}
]
    .reduce((acc, i) => ({...acc, [i.type]: i}), {})

const turns = {
    'n': ['e', 'w'],
    's': ['e', 'w'],
    'w': ['n', 's'],
    'e': ['n', 's'],
}

const buildMoves = (d, count) => ({
    target: {dx: directions[d].dx * count, dy: directions[d].dy * count},
    items: Array.from({length: count})
        .map((_, i) => ({dx: directions[d].dx * (i + 1), dy: directions[d].dy * (i + 1)}))
});

const nextMoves_1 = ({d, steps}) => [
    ...(steps < 3 ? [{d, steps: steps + 1, path: buildMoves(d, 1)}] : []),
    ...turns[d].map(v => ({d: v, steps: 1, path: buildMoves(v, 1)}))
];

const nextMoves_2 = ({d, steps}) => [
    ...(steps < 10 ? [{d, steps: steps + 1, path: buildMoves(d, 1)}] : []),
    ...turns[d].map(v => ({d: v, steps: 4, path: buildMoves(v, 4)}))
]

const pathCost = (map, {x, y}, path) => path.items.reduce((acc, {dx, dy}) => acc + map[y + dy][x + dx].v, 0);

const findPath = (input, startMoves, nextMoves) => {
    const map = input.map(row => row.map(v => ({v, in: {}, level: Infinity})));
    const h = map.length - 1;
    const w = map[h].length - 1;

    const startPos = {x: 0, y: 0};
    const levels = new Set();
    startMoves.forEach(({d, steps}) => {
        const path = buildMoves(d, steps);
        const level = pathCost(map, startPos, path);
        map[startPos.y + path.target.dy][startPos.x + path.target.dx].in[`${d}${steps}`] = level;
        map[startPos.y + path.target.dy][startPos.x + path.target.dx].level = level;
        levels.add(level);
    })

    let moves = startMoves.map(({d, steps}) => ({
        pos: {x: startPos.x + directions[d].dx * steps, y: startPos.y + directions[d].dy * steps},
        move: {d, steps, key: `${d}${steps}`}
    }));

    let level = 0;
    while (level < map[h][w].level) {
        level = Math.min(...levels);
        levels.delete(level);
        moves = moves.flatMap(({pos: {x, y}, move}) => {
            if (level < map[y][x].in[move.key]) {
                return [{pos: {x, y}, move}]
            } else {
                const nMoves = nextMoves(move)
                    .map(({d, steps, path}) => ({move: {d, steps, key: `${d}${steps}`}, path}))
                    .filter(({move: {key}, path: {target: {dx, dy}}}) =>
                        y + dy >= 0 && y + dy <= h
                        && x + dx >= 0 && x + dx <= w
                        && map[y + dy][x + dx].in[key] === undefined
                    )
                nMoves.forEach(({path, move: {key}}) => {
                    const targetLevel = level + pathCost(map, {x, y}, path);
                    map[y + path.target.dy][x + path.target.dx].in[key] = targetLevel;
                    map[y + path.target.dy][x + path.target.dx].level = Math.min(map[y + path.target.dy][x + path.target.dx].level, targetLevel);
                    levels.add(targetLevel)
                })
                return nMoves.map(({path: {target: {dx, dy}}, move}) => ({pos: {x: x + dx, y: y + dy}, move}))
            }
        });
    }

    return map[h][w].level
}

exports.part1 = input => findPath(parse(input), [{d: 'e', steps: 1}, {d: 's', steps: 1}], nextMoves_1)
exports.part2 = input => findPath(parse(input), [{d: 'e', steps: 4}, {d: 's', steps: 4}], nextMoves_2)
