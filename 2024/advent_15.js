const parse = (input, replacement) => {
    const [map, moves] = input.join('\n')
        .split('\n\n');
    return {
        map: map.split('\n').map(row => row.split('').flatMap(v => ((replacement ?? {})[v] ?? v).split(''))),
        moves: moves.replaceAll('\n', '').split('')
    }
}

const steps = {
    '^': {dx: 0, dy: -1},
    '>': {dx: 1, dy: 0},
    'v': {dx: 0, dy: 1},
    '<': {dx: -1, dy: 0}
}

const step = ({x, y}, {dx, dy}) => ({x: x + dx, y: y + dy});

exports.part1 = input => {
    const {map, moves} = parse(input);

    const get = ({x, y}) => map[y][x];
    const set = ({x, y}, v) => map[y][x] = v;

    const robot = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
        .find(({x, y}) => map[y][x] === '@');

    moves.reduce((robot, move) => {
            const dxy = steps[move];
            const next = step(robot, dxy);
            switch (get(next)) {
                case '.':
                    set(next, '@');
                    set(robot, '.');
                    return next;
                case '#':
                    return robot;
                case 'O':
                    const boxes = [next];
                    let check;
                    while (get(check = step(boxes[boxes.length - 1], dxy)) === 'O') {
                        boxes.push(check);
                    }
                    if (get(check) === '#') {
                        return robot;
                    }

                    boxes.map(box => step(box, dxy))
                        .forEach(box => set(box, 'O'));
                    set(next, '@');
                    set(robot, '.');
                    return next;
                default:
                    throw new Error('Unexpected value: ' + get(next));

            }
        },
        robot
    )

    return map.flatMap((row, y) => row.map((cell, x) => cell === 'O' ? y * 100 + x : 0))
        .reduce((acc, v) => acc + v, 0)
}

const part2InputReplacement = {
    '#': '##',
    '.': '..',
    'O': '[]',
    '@': '@.'
}

exports.part2 = input => {
    const {map, moves} = parse(input, part2InputReplacement);

    const get = ({x, y}) => map[y][x];
    const set = ({x, y}, v) => map[y][x] = v;

    const isWall = xy => get(xy) === '#';
    const isSpace = xy => get(xy) === '.';

    const isBox = xy => get(xy) === '[' || get(xy) === ']';
    const isBoxStart = xy => get(xy) === '[';
    const getBox = (xy) => !isBox(xy) ? [] : (isBoxStart(xy) ? [xy, step(xy, steps['>'])] : [step(xy, steps['<']), xy]);

    const robot = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
        .find(({x, y}) => map[y][x] === '@');

    moves.reduce((robot, move) => {
            const dxy = steps[move];
            const next = step(robot, dxy);
            if (isSpace(next)) {
                set(next, get(robot));
                set(robot, '.');
                return next;
            } else if (isWall(next)) {
                return robot;
            } else if (isBox(next)) {
                if (dxy.dy === 0) {
                    const boxes = [];
                    let check = next;
                    while (isBox(check)) {
                        boxes.push(check);
                        check = step(check, dxy);
                    }
                    if (isWall(check)) {
                        return robot;
                    }
                    boxes.reverse().forEach(box => set(step(box, dxy), get(box)));
                } else {
                    const lines = [];
                    let line = getBox(next);
                    while (line.length > 0) {
                        lines.push(line);
                        if (line.some(xy => isWall(step(xy, dxy)))) {
                            return robot;
                        }
                        line = line.flatMap(xy => getBox(step(xy, dxy)))
                    }
                    lines.reverse().forEach(line => {
                        line.forEach(cell => set(step(cell, dxy), map[cell.y][cell.x]));
                        line.forEach(cell => set(cell, '.'))
                    })
                }
                set(next, get(robot));
                set(robot, '.');
                return next;
            } else {
                throw new Error('Unexpected value: ' + get(next));
            }
        },
        robot
    )

    return map.flatMap((row, y) => row.map((_, x) => isBoxStart({x, y}) ? y * 100 + x : 0))
        .reduce((acc, v) => acc + v, 0)
};