const input =
    // (await fetch('https://adventofcode.com/2022/day/9/input').then(resp => resp.text())).trimEnd()
    ('R 4\n' +
    'U 4\n' +
    'L 3\n' +
    'D 1\n' +
    'R 4\n' +
    'D 1\n' +
    'L 5\n' +
    'R 2'
    )
    .split('\n')
    .map(row => row.split(' '))
    .map(row => ({direction: row[0], steps: row[1] - 0}));

const createRope = length => Array.from({length}).map(v => ({x: 0, y: 0}));

const adjustItem = (item, pos) => {
    const moveX = Math.abs(pos.x - item.x) > 1;
    const moveY = Math.abs(pos.y - item.y) > 1;
    return {
        x: moveX ? pos.x - Math.sign(pos.x - item.x) : (moveY ? pos.x : item.x),
        y: moveY ? pos.y - Math.sign(pos.y - item.y) : (moveX ? pos.y : item.y)
    }
}
const moveItem = ({x, y}, direction) => {
    switch (direction) {
        case 'L':
            return {x: x - 1, y};
        case 'R':
            return {x: x + 1, y};
        case 'U':
            return {x, y: y + 1};
        case 'D':
            return {x, y: y - 1};
        default:
            return {x, y};
    }
}

const move = (rope, direction) => {
    return rope.slice(1)
        .reduce((acc, item) => ([...acc, adjustItem(item, acc.at(-1))]), [moveItem(rope[0], direction)])
}

const go = (actions, rope) => actions.reduce(({rope, stat}, {direction, steps}) => {
    return Array.from({length: steps})
        .reduce(({rope, stat}) => {
            const newRope = move(rope, direction);
            const tail = newRope.at(-1);
            stat.add(`${tail.x}:${tail.y}`);
            return {rope: newRope, stat};
        }, {rope, stat});
}, {rope, stat: new Set()});

console.log(go(input, createRope(2)).stat.size);

console.log(go(input, createRope(10)).stat.size);
