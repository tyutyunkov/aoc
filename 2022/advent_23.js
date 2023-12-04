const inputFile = process.argv[2] ?? 'input_23.test.txt';
const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd()

const directions = ['N', 'S', 'W', 'E'];
const directionChecks = {
    'N': [{x: -1, y: -1}, {x: 0, y: -1}, {x: +1, y: -1}],
    'S': [{x: -1, y: +1}, {x: 0, y: +1}, {x: +1, y: +1}],
    'W': [{x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: +1}],
    'E': [{x: +1, y: -1}, {x: +1, y: 0}, {x: +1, y: +1}],
}
const directionMove = {
    'N': {x: 0, y: -1},
    'S': {x: 0, y: +1},
    'W': {x: -1, y: 0},
    'E': {x: +1, y: 0},
}
const surround = Array.from({length: 3}, (_, y) => y - 1)
    .flatMap(y => Array.from({length: 3}, (_, x) => x - 1).filter(x => x !== 0 || y !== 0).map(x => ({x, y})));

const set = (map, x, y, s) => (map[y] = map[y] ?? {})[x] = s;
const get = (map, x, y) => (map[y] ?? {})[x] ?? '.';
const isFree = (map, x, y) => get(map, x, y) === '.';
const isElf = (map, x, y) => get(map, x, y) === '#';

const isAvailable = (map, x, y, ds) => ds.find(move => !isFree(map, +x + move.x, +y + move.y)) === undefined

const init = input.split('\n')
    .reduce((map, row, j) => ({
        ...map,
        [j]: [...row].reduce((line, s, i) => ({
            ...line,
            [i]: s,
        }), {}),
    }), {})

const initState = init => ({
    map: Object.keys(init)
        .reduce((acc, y) => ({...acc, [y]: {...init[y]}}), {}),
    elves: Object.keys(init)
        .flatMap(y => Object.keys(init[y]).map(x => ({x: +x, y: +y})))
        .filter(({x, y}) => isElf(init, x, y)),
    directions: [...directions],
    round: 0,
});

const round = state => {
    const map = state.map;
    const moves = state.elves.map(elf => {
        if (isAvailable(map, elf.x, elf.y, surround)) {
            return {
                from: elf,
                to: elf,
            }
        }
        const move = state.directions.find(d => isAvailable(map, elf.x, elf.y, directionChecks[d]))
        return move === undefined
            ? {
                from: elf,
                to: elf,
            }
            : {
                from: elf,
                to: {x: +elf.x + directionMove[move].x, y: +elf.y + directionMove[move].y},
            };

    })
    state.directions.push(state.directions.shift())
    const moveStat = moves.reduce((stat, move) => ({
            ...stat,
            [move.to.y]: {
                ...(stat[move.to.y] ?? {}),
                [move.to.x]: ((stat[move.to.y] ?? {})[move.to.x] ?? 0) + 1
            }
        }),
        {}
    );
    state.elves = moves.map(move => {
        if (move.to.x === move.from.x && move.to.y === move.from.y) {
            return move.to;
        }
        if (moveStat[move.to.y][move.to.x] > 1) {
            return move.from;
        }
        set(map, move.from.x, move.from.y, '.');
        set(map, move.to.x, move.to.y, '#');
        return move.to;
    });
    state.moved = moves.filter(move => move.from.x !== move.to.x || move.from.y !== move.to.y).length;
    return state
}

const borders = elves => elves.reduce(({axisX, axisY}, {x, y}) => ({
        axisX: {min: Math.min(axisX.min, x), max: Math.max(axisX.max, x)},
        axisY: {min: Math.min(axisY.min, y), max: Math.max(axisY.max, y)},
    }),
    {
        axisX: {min: Infinity, max: -Infinity},
        axisY: {min: Infinity, max: -Infinity},
    })

const drawMap = (map, elves) => {
    const {axisX, axisY} = borders(elves)

    console.log(
        Array.from({length: axisY.max - axisY.min + 1}, (_, i) => axisY.min + i)
            .map(y => Array.from({length: axisX.max - axisX.min + 1}, (_, i) => axisX.min + i)
                .map(x => get(map, x, y))
                .join('')
            )
            .join('\n')
    );

}

const part1 = () => {
    const state = initState(init);

    Array.from({length: 10})
        .forEach(() => round(state));

    drawMap(state.map, state.elves);

    const {axisX, axisY} = borders(state.elves)
    return (axisY.max - axisY.min + 1) * (axisX.max - axisX.min + 1) - state.elves.length
}

const part2 = () => {
    const state = initState(init);

    while (state.moved === undefined || state.moved > 0) {
        round(state);
        state.round++;
    }
    drawMap(state.map, state.elves);

    return state.round;
}

// console.log('part1', part1());
console.log('part2', part2());
