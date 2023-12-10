const symbols = {
    '.': {},
    '|': {n: true, s: true},
    '-': {e: true, w: true},
    'L': {n: true, e: true},
    'J': {n: true, w: true},
    '7': {s: true, w: true},
    'F': {s: true, e: true},
    'S': {start: true}
}

const findStart = map => {
    const y = map.findIndex(row => row.some(cell => cell.start));
    const x = map[y].findIndex(cell => cell.start);
    return {x, y};
}

const fixStart = (map, {x, y}) => {
    const start = map[y][x];
    start.n = !!((map[y - 1] ?? [])[x] ?? {}).s;
    start.e = !!((map[y] ?? [])[x + 1] ?? {}).w;
    start.s = !!((map[y + 1] ?? [])[x] ?? {}).n;
    start.w = !!((map[y] ?? [])[x - 1] ?? {}).e;
}
const parse = input => input
    .map(str => str.split('').map(v => ({...symbols[v], v})))

exports.part1 = input => {
    const map = parse(input);
    const startPos = findStart(map);
    fixStart(map, startPos);

    let i = -1;
    let items = [startPos];
    while (items.length > 0) {
        ++i;
        items.forEach(({x, y}) => map[y][x].d = i);
        items = items
            .map(({x, y}) => ({x, y, ...map[y][x]}))
            .flatMap(({x, y, n, e, s, w}) => [
                !!n && {x, y: y - 1} || undefined,
                !!e && {x: x + 1, y} || undefined,
                !!s && {x, y: y + 1} || undefined,
                !!w && {x: x - 1, y} || undefined,
            ])
            .filter(v => v !== undefined)
            .filter(({x, y}) => map[y] !== undefined && map[y][x] !== undefined && map[y][x].d === undefined)
    }

    return i;
};

exports.part2 = input => {
    const map = parse(input);
    const startPos = findStart(map);
    fixStart(map, startPos);

    let items = [startPos];
    while (items.length > 0) {
        items.forEach(({x, y}) => map[y][x].wall = true);
        items = items
            .map(({x, y}) => ({x, y, ...map[y][x]}))
            .flatMap(({x, y, n, e, s, w}) => [
                !!n && {x, y: y - 1} || undefined,
                !!e && {x: x + 1, y} || undefined,
                !!s && {x, y: y + 1} || undefined,
                !!w && {x: x - 1, y} || undefined,
            ])
            .filter(v => v !== undefined)
            .filter(({x, y}) => map[y] !== undefined && map[y][x] !== undefined && !map[y][x].wall)
    }

    return map.reduce((acc, row) =>
            acc + row.reduce(
                ({inside, ln, ls, count}, {wall, n, s}) => {
                    if (!!wall) {
                        if ((n ?? ln) && (s ?? ls)) {
                            inside = !inside;
                            ln = false;
                            ls = false;
                        } else if (ln && !!n || ls && !!s) {
                            ln = false;
                            ls = false;
                        } else {
                            ln = n ?? ln;
                            ls = s ?? ls;
                        }
                    }

                    return ({
                        inside, ln, ls,
                        count: count + (inside && !wall ? 1 : 0)
                    });
                },
                {inside: false, ln: false, ls: false, count: 0}
            ).count,
        0)
};
