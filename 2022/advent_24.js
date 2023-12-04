const inputFile = process.argv[2] ?? 'input_24.test.txt';
const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd()

const blizzardDefs = {
    '^': ({x, y}) => ({x, y: y - 1}),
    '>': ({x, y}) => ({x: x + 1, y}),
    '<': ({x, y}) => ({x: x - 1, y}),
    'v': ({x, y}) => ({x, y: y + 1}),
}
const moves = [
    ({x, y}) => ({x, y}),
    ({x, y}) => ({x, y: y - 1}),
    ({x, y}) => ({x: x + 1, y}),
    ({x, y}) => ({x: x - 1, y}),
    ({x, y}) => ({x, y: y + 1}),
]

const initMap = input.split('\n')
    .map(row => [...row].map(i => i === '#' ? {wall: true,} : {blizzards: i === '.' ? [] : [i]}))

const start = {x: initMap[0].findIndex(i => !i.wall), y: 0};
const target = {x: initMap[initMap.length - 1].findIndex(i => !i.wall), y: initMap.length - 1};

const move = (map, {x, y}) => {
    if (y === 0) {
        return {x, y: map.length - 2};
    } else if (y === map.length - 1) {
        return {x, y: 1};
    } else if (x === 0) {
        return {x: map[y].length - 2, y};
    } else if (x === map[y].length - 1) {
        return {x: 1, y};
    } else {
        return {x, y};
    }
}

const isAvailableMove = (map, {x, y}) => x >= 0 && y >= 0
    && y < map.length && x < map[y].length
    && (!map[y][x].wall && map[y][x].blizzards.length === 0);

const turn = map => {
    const newMap = map.map(row => row.map(({wall}) => (wall ? {wall} : {blizzards: []})));
    map.forEach((row, y) => {
        row.forEach(({wall, blizzards}, x) => {
            (blizzards ?? []).map(blizzard => ({blizzard, pos: move(map, blizzardDefs[blizzard]({x, y}))}))
                .forEach(({blizzard, pos}) => {
                    newMap[pos.y][pos.x].blizzards.push(blizzard)
                })
        })
    })
    return newMap;
}

const maps = [initMap];
const getTurnMap = time => time < maps.length ? maps[time] : (maps[time] = turn(getTurnMap(time - 1)))

const drawMap = map => {
    console.log(
        map.map(row =>
            row.map(({wall, blizzards}) => wall
                ? '#'
                : (blizzards.length > 1 ? blizzards.length : blizzards[0] ?? '.')
            ).join('')
        ).join('\n')
    )
}

const route = (time, from, to) => {
    const targets = [];
    const queue = [{
        time,
        pos: from,
        target: to,
    }]

    while (queue.length > 0) {
        let state = queue.shift();
        const distance = Math.abs(state.pos.x - state.target.x) + Math.abs(state.pos.y - state.target.y);
        if (distance === 0) {
            return state.time;
        }

        const map = getTurnMap(state.time + 1);
        const positions = (targets[state.time + 1] = targets[state.time + 1] ?? {});
        moves.map(move => move(state.pos))
            .filter(pos => isAvailableMove(map, pos))
            .filter(({x, y}) => !positions[`${x}:${y}`])
            .forEach(pos => {
                positions[`${pos.x}:${pos.y}`] = true;
                queue.push({
                    time: state.time + 1,
                    pos,
                    target: state.target,
                })
            });

    }

    return Infinity;}

const part1 = () => {
    return route(0, start, target);
}

const part2 = () => {
    return route(route(route(0, start, target), target, start), start, target);
}

console.log('part1', part1())
console.log('part2', part2())