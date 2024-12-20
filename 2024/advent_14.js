const pattern = /p=(?<x>-?\d+),(?<yx>-?\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)/;

const parse = input => input
    .map(row => pattern.exec(row).groups)
    .map(({x, yx, vx, vy}) => ({
        x: Number(x),
        y: Number(yx),
        vx: Number(vx),
        vy: Number(vy)
    }));

const teleport = (borders, {x, y, vx, vy}) => ({
    x: (borders.x + x + vx) % borders.x,
    y: (borders.y + y + vy) % borders.y,
    vx,
    vy
})

const borders = {x: 101, y: 103}
const center = {x: (borders.x - 1) / 2, y: (borders.y - 1) / 2}
const quadrants = [
    {start: {x: 0, y: 0}, end: center},
    {start: {x: center.x + 1, y: 0}, end: {x: borders.x, y: center.y}},
    {start: {x: 0, y: center.y + 1}, end: {x: center.x, y: borders.y}},
    {start: {x: center.x + 1, y: center.y + 1}, end: borders}
]

exports.part1 = input => {
    const iterations = 100;

    const robots = parse(input);

    const stat = Array.from({length: iterations})
        .reduce((robots) => robots.map(robot => teleport(borders, robot)), robots)
        .reduce((acc, robot) => {
            const key = robot.x + ',' + robot.y;
            acc[key] = (acc[key] ?? 0) + 1;
            return acc;
        }, {});

    return quadrants.map(({start, end}) => {
        let count = 0;
        for (let y = start.y; y < end.y; ++y) {
            for (let x = start.x; x < end.x; ++x) {
                const key = x + ',' + y;
                count += stat[key] ?? 0;
            }
        }
        return count;
    })
        .reduce((acc, v) => acc * v, 1)
};

exports.part2 = input => {
    const iterations = 100000;

    const coords = Array.from({length: borders.y}, (_, y) => borders.y - y - 1)
        .flatMap(y => Array.from({length: borders.x}, (_, x) => ({x, y})));
    const emptyMap = coords.reduce((acc, {x, y}) => {
        acc[y] = acc[y] ?? [];
        acc[y][x] = ' ';
        return acc;
    }, []);
    // todo: impl

    const drawMap = (borders, robots) => {
        const map = emptyMap.map(row => row.slice());
        robots.forEach(robot => {
            map[robot.y] = map[robot.y] ?? [];
            map[robot.y][robot.x] = '#';
        })
        console.log(map.map(row => row.join('')).join('\n'));
    }

    let robots = parse(input);
    for (let i = 0; i < iterations; ++i) {
        if (robots.reduce((acc, {x}) => x === 30 ? acc + 1 : acc, 0) > 10) {
            console.log(i)
            drawMap(borders, robots);
        }
        robots = robots.map(robot => teleport(borders, robot));
    }
    return 0;
};