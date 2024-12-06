const parse = input => input
    .map(row => row.split('').map(value => ({value})));

const directions = [
    {dx: 0, dy: -1},
    {dx: 1, dy: 0},
    {dx: 0, dy: 1},
    {dx: -1, dy: 0}
]

const doStep = (map, pos) => {
    let next = {x: pos.x + directions[pos.di].dx, y: pos.y + directions[pos.di].dy};
    if (next.x < 0 || next.x >= map[0].length || next.y < 0 || next.y >= map.length) {
        return false;
    } else if (map[next.y][next.x].value === '#') {
        pos.di = (pos.di + 1) % 4;
    } else {
        pos.x = next.x;
        pos.y = next.y;
    }
    return true;
}

const drawPath = (map, start) => {
    let pos = {...start, di: 0};
    do {
        map[pos.y][pos.x].value = 'X';
    } while (doStep(map, pos));

    return map;
}

exports.part1 = input => {
    const map = parse(input);

    const start = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[0].length}, (_, x) => ({x, y})))
        .filter(({x, y}) => map[y][x].value === '^')[0];

    return drawPath(map, start).reduce((acc, row) => acc + row.filter(({value}) => value === 'X').length, 0);
};

exports.part2 = input => {
    const map = parse(input);

    const start = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[0].length}, (_, x) => ({x, y})))
        .filter(({x, y}) => map[y][x].value === '^')[0];

    const copyMap = originalMap => originalMap.map(row => row.map(({value}) => ({value})));

    const checkCycle = (originalMap, obstacle) => {
        if (originalMap[obstacle.y][obstacle.x].value !== '.') {
            return false;
        }
        const map = copyMap(originalMap);

        map[obstacle.y][obstacle.x].value = '#';

        let pos = {...start, di: 0};
        do {
            if (map[pos.y][pos.x].value === 'X' && map[pos.y][pos.x].di === pos.di) {
                return true;
            }
            map[pos.y][pos.x].value = 'X';
            map[pos.y][pos.x].di = map[pos.y][pos.x].di ?? pos.di;
        } while (doStep(map, pos));

        return false;
    };

    const path = drawPath(copyMap(map), start);

    return Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[0].length}, (_, x) => ({x, y})))
        .filter(({x, y}) => path[y][x].value === 'X')
        .filter(({x, y}) => checkCycle(map, {x, y})).length;
};