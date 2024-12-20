const directions = {
    n: {dir: 'n', dx: 0, dy: -1},
    s: {dir: 's', dx: 0, dy: 1},
    e: {dir: 'e', dx: 1, dy: 0},
    w: {dir: 'w', dx: -1, dy: 0},
}

const parse = input => input
    .map(row => row.split('').map(v => ({
        v,
        level: Infinity,
        levels: Object.keys(directions).reduce((acc, dir) => ({...acc, [dir]: {value: Infinity, input: []}}), {})
    })));

const scoreDif = (a, b) => (Math.abs(directions[a].dx-directions[b].dx) | Math.abs(directions[a].dy-directions[b].dy)) * 1000;

const traverse =  (map, start, finish) => {
    map[start.y][start.x].levels = {
        e: {value: 0, input: []},
        s: {value: 1000, input: []},
        w: {value: 1000, input: []},
        n: {value: 1000, input: []},
    };

    const work = [start];
    while (work.length > 0) {
        const {x, y} = work.shift();
        const {levels} = map[y][x];
        const next =
            Object.values(directions)
                .map(({dir, dx, dy}) => ({dir, x: x + dx, y: y + dy}))
                .filter(({x, y}) => map[y][x].v !== '#')
                .map(next => {
                    next.score = Math.min(...Object.keys(levels).map(dir => 1 + scoreDif(next.dir, dir) + levels[dir].value));
                    next.moves = Object.keys(map[next.y][next.x].levels).filter(key => map[next.y][next.x].levels[key].value >= next.score + scoreDif(next.dir, key))
                    return next;
                })
                .filter(({moves}) => moves.length > 0)

        const filtered = next.filter(({x, y, dir, score, moves}) =>
            moves.some(key => map[y][x].levels[key].value > score + scoreDif(dir, key)));
        next.forEach(({x, y, dir, score, moves}) => {
            moves.forEach(key => {
                const level = map[y][x].levels[key];
                const value = score + scoreDif(dir, key);
                if (level.value > value) {
                    level.value = value;
                    level.input = [dir];
                } else {
                    level.input.push(dir);
                }
            })
        })
        work.push(...filtered)
    }

    return Math.min(...Object.values(map[finish.y][finish.x].levels).map(({value}) => value));
};

exports.part1 = input => {
    const map = parse(input);

    const coords = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})));
    const start = coords.find(({x, y}) => map[y][x].v === 'S');
    const finish = coords.find(({x, y}) => map[y][x].v === 'E');

    return traverse(map, start, finish);
};

exports.part2 = input => {
    const map = parse(input);

    const coords = Array.from({length: map.length}, (_, y) => y)
        .flatMap(y => Array.from({length: map[y].length}, (_, x) => ({x, y})));
    const start = coords.find(({x, y}) => map[y][x].v === 'S');
    const finish = coords.find(({x, y}) => map[y][x].v === 'E');

    const target = traverse(map, start, finish);
    const work = [{...finish, target}]
    while (work.length > 0) {
        const {x, y, target} = work.shift();
        if (map[y][x].v === 'O') {
            continue;
        }
        map[y][x].v = 'O';

        const {levels} = map[y][x];
        const prev = Object.entries(levels)
            .flatMap(([key, {input}]) => {
                return input.map(dir => ({dir, x: x - directions[dir].dx, y: y - directions[dir].dy}))
                    .filter(({dir, x, y}) => map[y][x].levels[dir].value + scoreDif(dir, key) + 1 === target)
                    .map(({dir, x, y}) => ({x, y, target: map[y][x].levels[dir].value}))
            })
        work.push(...prev)
    }

    return map.reduce((acc, row) => row.reduce((acc, {v}) => acc + (v === 'O' ? 1 : 0), acc), 0);
};