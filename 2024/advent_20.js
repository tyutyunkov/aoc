const parse = input => input
    .map(row => row.split('').map(v => ({wall: v === '#', start: v === 'S', end: v === 'E'})));

const directions = {
    n: {dx: 0, dy: -1},
    e: {dx: 1, dy: 0},
    s: {dx: 0, dy: 1},
    w: {dx: -1, dy: 0}
}
const inMap = (map, {x, y}) => x >= 0 && x < map[0].length && y >= 0 && y < map.length;

const fillPath = map => {
    const start = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
        .find(({x, y}) => map[y][x].start);

    const work = [{...start, height: 0}];
    while (work.length > 0) {
        const {x, y, height} = work.shift();
        if (map[y][x].height <= height) {
            continue;
        }
        map[y][x].height = height;
        const next = Object.values(directions)
            .map(({dx, dy}) => ({x: x + dx, y: y + dy, height: height + 1}))
            .filter(({x, y}) => inMap(map, {x, y}))
            .filter(({x, y}) => !map[y][x].wall)
            .filter(({x, y}) => map[y][x].height === undefined || map[y][x].height > height);
        work.push(...next);
    }
    return map;
}

const countCheats = (map, limit, threshold) => {
    const cheats = Array.from({length: limit * 2 + 1}, (_, dy) => dy - limit)
        .flatMap(dy => Array.from({length: (limit - Math.abs(dy)) * 2 + 1},
            (_, dx) => ({dx: dx - limit + Math.abs(dy), dy}))
        )

    return Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
        .filter(({x, y}) => !map[y][x].wall)
        .flatMap(({x, y}) => cheats
            .map(({dx, dy}) => ({cx: x + dx, cy: y + dy, d: Math.abs(dx) + Math.abs(dy)}))
            .filter(({cx, cy}) => inMap(map, {x: cx, y: cy}))
            .filter(({cx, cy}) => !map[cy][cx].wall)
            .map(({cx, cy, d}) => map[y][x].height - map[cy][cx].height - d)
            .filter(cut => cut >= threshold)
        )
        .length;
}

exports.part1 = input => countCheats(fillPath(parse(input)), 2, 100);

exports.part2 = input => countCheats(fillPath(parse(input)), 20, 100);