const parse = input => input
    .map(str => str.split('').map(v => ({v, beams: {}})))

const beamFlow = (item, {dx, dy}) => {
    switch (item) {
        case '.':
            return [{dx, dy}];
        case '/':
            return [{dx: -dy, dy: -dx}];
        case '\\':
            return [{dx: dy, dy: dx}];
        case '|':
            return dx !== 0 ? [{dx: 0, dy: -1}, {dx: 0, dy: 1}] : [{dx, dy}]
        case '-':
            return dx !== 1 ? [{dx: -1, dy: 0}, {dx: 1, dy: 0}] : [{dx, dy}]
        default:
            return [];
    }
}

const cloneArray = arr => [...arr.map(row => [...row.map(({v}) => ({v, beams: {}}))])];
const energize = (map, start, beam) => {
    const rows = cloneArray(map);
    const beamKey = ({dx, dy}) => dx === 0 ? (dy === 1 ? 'v' : '^') : (dx === 1 ? '>' : '<');
    const work = [{pos: start, beam,}]
    while (work.length > 0) {
        const {pos: {x, y}, beam} = work.shift();
        const key = beamKey(beam);
        const cell = rows[y][x];
        if (!!cell.beams[key]) {
            continue;
        }
        cell.beams[key] = true;
        const beams = beamFlow(cell.v, beam)
            .map(({dx, dy}) => ({pos: {x: x + dx, y: y + dy}, beam: {dx, dy}}))
            .filter(({pos: {x, y}}) => y >= 0 && y < rows.length && x >= 0 && x < rows[y].length)
        work.push(...beams)
    }

    return rows;
}

const countEnergized = map => map.flatMap(row => row.map(cell => Object.keys(cell.beams).length > 0))
    .filter(v => !!v)
    .length;

exports.part1 = input => countEnergized(energize(parse(input), {x: 0, y: 0}, {dx: 1, dy: 0}));

exports.part2 = input => {
    const rows = parse(input);
    return [
        ...Array.from({length: rows.length}).map((_, i) => i)
            .flatMap(y => ([
                {start: {x: 0, y}, beam: {dx: 1, dy: 0}},
                {start: {x: rows[y].length - 1, y}, beam: {dx: -1, dy: 0}}
            ])),
        ...Array.from({length: rows[0].length}).map((_, i) => i)
            .flatMap(x => ([
                {start: {x, y: 0}, beam: {dx: 0, dy: 1}},
                {start: {x, y: rows.length - 1}, beam: {dx: 0, dy: -1}}
            ]))
    ]
        .map(({start, beam}) => countEnergized(energize(rows, start, beam)))
        .reduce((acc, v) => Math.max(acc, v), 0)

    // Do something with rows for part 2

    return 0;
};