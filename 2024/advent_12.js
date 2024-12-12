const parse = input => input.map(row => row.split('').map(v => ({v})));

const directions = [
    {dir: 'n', dx: 0, dy: -1},
    {dir: 'e', dx: 1, dy: 0},
    {dir: 's', dx: 0, dy: 1},
    {dir: 'w', dx: -1, dy: 0}
];

const inMap = (map, x, y) => x >= 0 && x < map[0].length && y >= 0 && y < map.length;
const fillRegion = (map, x, y, region) => {
    if (map[y][x].region !== undefined) {
        return region;
    }
    region.coords.push({x, y});
    map[y][x].region = region;
    directions.map(({dx, dy}) => ({x: x + dx, y: y + dy}))
        .filter(({x, y}) => inMap(map, x, y))
        .filter(({x, y}) => map[y][x].v === region.value)
        .forEach(({x, y}) => fillRegion(map, x, y, region));
    return region;
}

const buildRegions = map => map.flatMap((row, y) =>
    row.flatMap((cell, x) =>
        cell.region === undefined ? [fillRegion(map, x, y, {id: `${x}:${y}`, value: cell.v, coords: []})] : []
    )
)

const area = (map, region) => region.coords.length;
const perimeter = (map, region) => region.coords.map(xy =>
    directions.map(({dx, dy}) => ({x: xy.x + dx, y: xy.y + dy}))
        .filter(({x, y}) => !inMap(map, x, y) || map[xy.y][xy.x].region.id !== map[y][x].region.id)
        .length
)
    .reduce((acc, v) => acc + v, 0)
const perimeterBySides = (map, region) => {
    const fenceMap = [];
    const fence = [];
    region.coords.forEach((xy) => {
        directions.map(({dir, dx, dy}) => ({x: xy.x + dx, y: xy.y + dy, dir}))
            .filter(({x, y}) => !inMap(map, x, y) || map[xy.y][xy.x].region.id !== map[y][x].region.id)
            .forEach(({dir, x, y}) => {
                const fenceY = fenceMap[y + 1] = fenceMap[y + 1] ?? [];
                (fenceY[x + 1] = fenceY[x + 1] ?? {})[dir] = true;
                fence.push({x: x + 1, y: y + 1, dir});
            })
    })

    const cleanupFence = (x, y, dir) => {
        fenceMap[y][x][dir] = false;
        directions.map(({dx, dy}) => ({x: x + dx, y: y + dy}))
            .filter(({x, y}) => fenceMap[y] && fenceMap[y][x])
            .forEach(({x, y}) => fenceMap[y][x][dir] && cleanupFence(x, y, dir));
    }

    return fence.reduce((count, {x, y, dir}) => {
        if (fenceMap[y][x][dir]) {
            cleanupFence(x, y, dir);
            return count + 1;
        } else {
            return count;
        }
    }, 0)
}

exports.part1 = input => {
    const map = parse(input);
    return buildRegions(map)
        .reduce((acc, region) => ([...acc, {
            value: region.value,
            area: area(map, region),
            perimeter: perimeter(map, region),
        }]), [])
        .map(({area, perimeter}) => area * perimeter)
        .reduce((acc, v) => acc + v, 0);
};

exports.part2 = input => {
    const map = parse(input);
    return buildRegions(map)
        .reduce((acc, region) => ([...acc, {
            value: region.value,
            area: area(map, region),
            perimeter: perimeterBySides(map, region),
        }]), [])
        .map(({area, perimeter}) => area * perimeter)
        .reduce((acc, v) => acc + v, 0);
};