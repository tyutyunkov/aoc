const parse = input => input
    .map(row => row.split(''))

exports.part1_2 = input => {
    const map = parse(input);

    const antennas = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
        .reduce((acc, {x, y}) => map[y][x] === '.' ? acc : ({
            ...acc,
            [map[y][x]]: [...(acc[map[y][x]] ?? []), {x, y}]
        }), {});

    const inMap = ({x, y}) => x >= 0 && x < map[0].length && y >= 0 && y < map.length;
    const check = xy => {
        return Object.values(antennas)
            .some(group => group.some(a => {
                if (a.x === xy.x && a.y === xy.y) {
                    return false;
                }
                const b1 = {x: a.x + (a.x - xy.x), y: a.y + (a.y - xy.y)};
                const b2 = {x: xy.x - 2 * (a.x - xy.x), y: xy.y - 2 * (a.y - xy.y)};
                return inMap(b1) && map[b1.y][b1.x] === map[a.y][a.x]
                    || inMap(b2) && map[b2.y][b2.x] === map[a.y][a.x];
            }))
    }

    return Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
        .filter(check)
        .length;
}

exports.part1 = input => {
    const map = parse(input);

    const antennas = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
        .reduce((acc, {x, y}) => map[y][x] === '.' ? acc : ({
            ...acc,
            [map[y][x]]: [...(acc[map[y][x]] ?? []), {x, y}]
        }), {});

    const inMap = ({x, y}) => x >= 0 && x < map[0].length && y >= 0 && y < map.length;

    Object.values(antennas)
        .forEach(group => {
            for (let i = 0; i < group.length; ++i) {
                for (let j = 0; j < group.length; ++j) {
                    if (i === j) {
                        continue;
                    }
                    const a = group[i], b = group[j];
                    let t = {x: b.x + (b.x - a.x), y: b.y + (b.y - a.y)};
                    if (inMap(t)) {
                        map[t.y][t.x] = '#';
                    }
                }
            }
        })

    return map.flatMap(row => row.map(item => item === '#'))
        .reduce((acc, v) => acc + (v ? 1 : 0), 0);
};

exports.part2 = input => {
    const map = parse(input);

    const antennas = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
        .reduce((acc, {x, y}) => map[y][x] === '.' ? acc : ({
            ...acc,
            [map[y][x]]: [...(acc[map[y][x]] ?? []), {x, y}]
        }), {});

    const inMap = ({x, y}) => x >= 0 && x < map[0].length && y >= 0 && y < map.length;

    Object.values(antennas)
        .forEach(group => {
            for (let i = 0; i < group.length; ++i) {
                for (let j = 0; j < group.length; ++j) {
                    if (i === j) {
                        continue;
                    }
                    const a = group[i], b = group[j];
                    const dx = b.x - a.x, dy = b.y - a.y;
                    let k = 0, t;
                    while (inMap(t = {x: b.x + k * dx, y: b.y + k * dy})) {
                        map[t.y][t.x] = '#';
                        ++k;
                    }
                }
            }
        })

    return map.flatMap(row => row.map(item => item === '#'))
        .reduce((acc, v) => acc + (v ? 1 : 0), 0);
};