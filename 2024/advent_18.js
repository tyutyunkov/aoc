const parse = input => input
    .map(row => row.split(/,/).map(Number))
    .map(([x, y]) => ({x, y}))

const directions = [
    {dx: 0, dy: -1},
    {dx: 1, dy: 0},
    {dx: 0, dy: 1},
    {dx: -1, dy: 0}
]

const inMap = map => ({x, y}) => y < map.length && y >= 0 && x < map[y].length && x >= 0;

const config = {
    '': {
        width: 71,
        height: 71,
        limit: 1024,
    },
    'test': {
        width: 7,
        height: 7,
        limit: 12,
    }
}

const buildPath = map => {
    const start = {x: 0, y: 0},
        finish = {x: map[0].length - 1, y: map.length - 1};

    const work = [{...start, height: 0}];
    while (work.length > 0) {
        const {x, y, height} = work.shift();
        if (map[y][x].height <= height) {
            continue;
        }
        map[y][x].height = height;
        const next = directions
            .map(({dx, dy}) => ({x: x + dx, y: y + dy, height: height + 1}))
            .filter(inMap(map))
            .filter(({x, y}) => map[y][x].valid)
            .filter(({x, y}) => map[y][x].height > height);
        work.push(...next);
    }

    return map[finish.y][finish.x].height;
}

exports.part1 = (input, mode) => {
    const corrupted = parse(input);

    const {width, height, limit} = config[mode];
    const map = Array.from({length: height}, () =>
        Array.from({length: width}, () => ({valid: true, height: Infinity}))
    );
    corrupted.slice(0, limit)
        .forEach(({x, y}) => map[y][x].valid = false);

    return buildPath(map);
}

exports.part2 = (input, mode) => {
    const corrupted = parse(input);

    const {width, height} = config[mode];
    const map = Array.from({length: height}, () =>
        Array.from({length: width}, () => ({valid: true, height: Infinity}))
    );

    let i = -1;
    do {
        ++i;
        Array.from({length: height}, (_, y) => y)
            .forEach(y => Array.from({length: width}, (_, x) => x).forEach(x => map[y][x].height = Infinity));
        {
            const {x, y} = corrupted[i];
            map[y][x].valid = false;
        }
    } while (buildPath(map) !== Infinity);

    return `${corrupted[i].x},${corrupted[i].y}`;
};