const parse = input => input
    .map(row => row.split(''));

// move priorities:
//  < => v<<, v => <v, ^ => <, > => v
const moves = {
    '^': {dx: 0, dy: -1, p: 2},
    '>': {dx: 1, dy: 0, p: 3},
    'v': {dx: 0, dy: 1, p: 1},
    '<': {dx: -1, dy: 0, p: 0}
}
const available = function (x, y) {
    return Object.values(this).some(xy => xy.x === x && xy.y === y);
}

const numPad = {
    'A': {x: 2, y: 3},
    '0': {x: 1, y: 3},
    '1': {x: 0, y: 2},
    '2': {x: 1, y: 2},
    '3': {x: 2, y: 2},
    '4': {x: 0, y: 1},
    '5': {x: 1, y: 1},
    '6': {x: 2, y: 1},
    '7': {x: 0, y: 0},
    '8': {x: 1, y: 0},
    '9': {x: 2, y: 0},
}
numPad.available = available.bind(numPad);

const actionPad = {
    '<': {x: 0, y: 1},
    '>': {x: 2, y: 1},
    '^': {x: 1, y: 0},
    'v': {x: 1, y: 1},
    'A': {x: 2, y: 0},
}
actionPad.available = available.bind(actionPad);

const calculateActions = (code, pad) => code.reduce((acc, current) => {
    const mx = pad[current].x - pad[acc.position].x,
        my = pad[current].y - pad[acc.position].y;

    const path = Object.entries(moves)
        .sort(([k1, a], [k2, b]) => a.p - b.p)
        .map(([d, {dx, dy}]) => dx === 0
            ? (Math.sign(my) === Math.sign(dy) ? ({d, count: Math.abs(my)}) : ({d, count: 0}))
            : (Math.sign(mx) === Math.sign(dx) ? ({d, count: Math.abs(mx)}) : ({d, count: 0}))
        )
        .filter(({count}) => count > 0)
    const [p1, p2] = path
    if (p2 !== undefined && !pad.available(pad[acc.position].x + moves[p1.d].dx * p1.count, pad[acc.position].y + moves[p1.d].dy * p1.count)) {
        path.reverse()
    }

    acc.actions.push(...path.flatMap(({d, count}) => new Array(count).fill(d)), 'A');
    acc.position = current;
    return acc;
}, {actions: [], position: 'A'})
    .actions

const groupActions = actions => actions
    .reduce(({groups, prefix}, action) => ({
            prefix: action === 'A' ? '' : prefix + action,
            groups: action === 'A' ? {...groups, [prefix + action]: (groups[prefix + action] ?? 0) + 1} : groups
        }),
        {groups: {}, prefix: ''}
    )
    .groups
const mergeActions = (acc, actions, count) => Object.entries(actions)
    .reduce((acc, [k, v]) => ({...acc, [k]: (acc[k] ?? 0) + v * count}), acc);

const actionsCount = (code, robots = 2) =>
    Object.entries(
        Array.from({length: robots})
            .reduce((acc, _) => Object.entries(acc)
                    .reduce((acc, [actions, count]) =>
                            mergeActions(acc, groupActions(calculateActions(actions.split(''), actionPad)), count),
                        {}),
                groupActions(calculateActions(code, numPad)))
    )
        .map(([k, v]) => v * k.length)
        .reduce((acc, v) => acc + v, 0)

exports.part1 = input => parse(input)
    .map(code => Number(code.slice(0, 3).join('')) * actionsCount(code, 2))
    .reduce((acc, v) => acc + v, 0);

exports.part2 = input => parse(input)
    .map(code => Number(code.slice(0, 3).join('')) * actionsCount(code, 25))
    .reduce((acc, v) => acc + v, 0);