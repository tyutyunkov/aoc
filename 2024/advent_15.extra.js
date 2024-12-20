const replacement = {
    '#': '##',
    '.': '..',
    'O': '[]',
    '@': '@.'
}

const parse = input => {
    const [map, moves] = input.join('\n')
        .split('\n\n');
    return {
        map: map.split('\n').map(row => row.split('').flatMap(v => ((replacement ?? {})[v] ?? v).split(''))),
        moves: moves.replaceAll('\n', '').split('')
    }
}

const steps = {
    'W': {dx: 0, dy: -1},
    'd': {dx: 1, dy: 0},
    's': {dx: 0, dy: 1},
    'a': {dx: -1, dy: 0}
}

const step = ({x, y}, {dx, dy}) => ({x: x + dx, y: y + dy});

exports.part0 = input => {
    const {map} = parse(input);

    const get = ({x, y}) => map[y][x];
    const set = ({x, y}, v) => map[y][x] = v;

    const isWall = xy => get(xy) === '#';
    const isSpace = xy => get(xy) === '.';

    const isBox = xy => get(xy) === '[' || get(xy) === ']';
    const isBoxStart = xy => get(xy) === '[';
    const getBox = (xy) => !isBox(xy) ? [] : (isBoxStart(xy) ? [xy, step(xy, steps['d'])] : [step(xy, steps['a']), xy]);

    let robot = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})))
        .find(({x, y}) => map[y][x] === '@');

    const printMap = (move) => {
        console.clear();
        console.log('Move:', move);
        console.log(map.map(row => row.join('').replaceAll('.', ' ')).join('\n'));
    }

    const doMove = (robot, move) => {
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
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (key) {
        const char = key.toString().toLowerCase()[0];
        if (!steps[char]) {
            process.exit();
        }

        robot = doMove(robot, char);
        printMap(char);
    });

    printMap('start');

    return 0;
};