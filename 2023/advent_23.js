const parse = input => input.map(str => str.split(''))

const moves = [{id: '^', dx: 0, dy: -1}, {id: '>', dx: 1, dy: 0}, {id: 'v', dx: 0, dy: 1}, {id: '<', dx: -1, dy: 0},]
const nextMoves = moves
    .reduce((acc, {id, dx, dy}) => ({...acc, [id]: moves.filter(move => move.dx !== -dx || move.dy !== -dy)}), {});

const getKey = ({x, y}) => `${x}:${y}`
const buildGraph = (map, ignoreDirections) => {
    const graph = {};

    const start = {x: 1, y: 0}
    const end = {x: map[map.length - 1].length - 2, y: map.length - 1}

    const checkDirection = (move, x, y) => ignoreDirections ? map[y][x] !== '#' : (map[y][x] === '.' || map[y][x] === move)

    graph[getKey(start)] = {path: 0, edges: {}};
    graph[getKey(end)] = {path: -1, edges: {}}
    const work = [{move: 'v', key: getKey(start), pos: start}];
    while (work.length > 0) {
        const {move, key, pos: {x, y}} = work.shift();

        let w = 0;
        let tx = x, ty = y;
        let moves = [{move, pos: {x, y}}];
        do {
            ++w;
            const {move, pos: {x, y}} = moves[0];
            tx = x;
            ty = y;
            moves = nextMoves[move]
                .map(({id, dx, dy}) => ({move: id, pos: {x: tx + dx, y: ty + dy}}))
                .filter(({move, pos: {x, y}}) => y < map.length && checkDirection(move, x, y))
        } while (moves.length === 1)

        if (moves.length === 0) {
            --w;
        }

        const target = getKey({x: tx, y: ty});
        graph[key].edges[target] = Math.max(w, graph[key].edges[target] ?? 0);
        if (graph[target] === undefined) {
            graph[target] = {path: -1, edges: {}};
            work.push(...moves.map(v => ({...v, key: target})));
        }
        if (ignoreDirections) {
            graph[target].edges[key] = Math.max(w, graph[target].edges[key] ?? 0);
        }
    }

    return graph;
}

const traverseGraph = (graph, {w, path}) => {
    const last = path[path.length - 1];
    graph[last].path = Math.max(graph[last].path, w);
    Object.keys(graph[last].edges)
        .filter(target => path.indexOf(target) === -1)
        .forEach(target => traverseGraph(graph, {w: w + graph[last].edges[target], path: [...path, target]}))
}

const processInput = (input, ignoreDirections) => {
    const map = parse(input);

    const start = {x: 1, y: 0}
    const end = {x: map[map.length - 1].length - 2, y: map.length - 1}

    const graph = buildGraph(map, ignoreDirections);
    traverseGraph(graph, {w: 0, path: [getKey(start)]});

    return graph[getKey(end)].path;
}

exports.part1 = input => processInput(input, false)
exports.part2 = input => processInput(input, true)