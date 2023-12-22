const parse = input => input
    .map(str => /(?<sx>\d+),(?<sy>\d+),(?<sz>\d+)~(?<ex>\d+),(?<ey>\d+),(?<ez>\d+)/.exec(str).groups)
    .map(({sx, sy, sz, ex, ey, ez}) => ({start: {x: sx - 0, y: sy - 0, z: sz - 0}, end: {x: ex - 0, y: ey - 0, z: ez - 0}}))
    .map(({start, end}, id) => ({
        id, start, end,
        axis: {
            x: start.x !== end.x,
            y: start.y !== end.y,
            z: start.z !== end.z,
        },
        items: Array.from({length: end.x - start.x + 1}).map((_, dx) => dx)
            .flatMap(dx => Array.from({length: end.y - start.y + 1}).map((_, dy) => dy)
                .flatMap(dy => Array.from({length: end.z - start.z + 1}).map((_, dz) => dz)
                    .map(dz => ({x: start.x + dx, y: start.y + dy, z: start.z + dz}))
                )
            )
    }))
    .sort((a, b) => a.start.z - b.start.z);

const buildMap = lines => {
    const map = [];
    const {maxX, maxY} = lines.reduce(({maxX, maxY}, {end: {x, y}}) => ({maxX: Math.max(maxX, x), maxY: Math.max(maxY, y)}), {maxX: 0, maxY: 0});
    Array.from({length: maxX + 1}).map((_, x) => x)
        .forEach(x => {
                map[x] = []
                Array.from({length: maxY + 1}).map((_, y) => y).forEach(y => map[x][y] = [])
            }
        );

    lines.forEach(line => {
        const targetZ = line.items.map(({x, y}) => map[x][y].length).reduce((maxZ, z) => Math.max(maxZ, z));
        const dz = line.start.z - (targetZ === 0 ? 1 : targetZ);
        line.items.forEach(item => {
            item.z -= dz;
            map[item.x][item.y][item.z] = line.id;
        });
        line.start.z -= dz;
        line.end.z -= dz;
    });

    return map;
}

const buildConnections = (lines, map) => {
    const connections = lines.reduce((acc, {id}) => ({...acc, [id]: {in: [], out: []}}), {})
    lines.forEach(({id, items}) => {
        const connected = items.map(({x, y, z}) => map[x][y][z + 1]).filter(v => v !== undefined).filter(v => v !== id)
        connections[id].out = [...new Set(connected)];
        connected.forEach(v => connections[v].in.push(id))
    })
    lines.forEach(({id}) => {
        connections[id].in = [...new Set(connections[id].in)]
    })

    return connections;
}

exports.part1 = input => {
    const lines = parse(input)
    const map = buildMap(lines);
    const connections = buildConnections(lines, map)
    return lines.filter(({id}) => !connections[id].out.some(cid => connections[cid].in.length === 1)).length;
};

exports.part2 = input => {
    const lines = parse(input);
    const map = buildMap(lines);
    const connections = buildConnections(lines, map)

    return lines.map(({id}) => {
        const fall = new Set([id]);
        const work = [id];
        while (work.length > 0) {
            const cur = work.shift();
            const next = connections[cur].out.filter(line => connections[line].in.filter(item => !fall.has(item)).length === 0)
            work.push(...next.filter(item => !fall.has(item)))
            next.forEach(item => fall.add(item))
        }

        return fall.size - 1;
    })
        .reduce((acc, v) => acc + v)
};