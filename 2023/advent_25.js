const parse = input => input
    .map(str => str.split(/:\s+/))
    .map(([from, to]) => ({from, to: to.split(/\s+/)}))

// https://en.wikipedia.org/wiki/Stoer%E2%80%93Wagner_algorithm
const minimalCut = input => {
    const names = Object.keys(input);
    const graph = names.reduce((graph, v) => ({
        ...graph,
        [v]: {
            edges: input[v].edges.reduce((edges, u) => ({...edges, [u]: 1}), {}),
            cuts: [v]
        }
    }), {});

    let best = {value: Infinity, cut: []};
    const n = Object.keys(graph).length;
    let i = 0;
    while (names.length > 1) {
        ++i;
        const A = new Set();
        const dist = {};
        let s = names[0], t = names[0];
        let value = Infinity;
        while (A.size < names.length) {
            // todo: [tve] optimize
            const {v, h} = Object.entries(dist).reduce((acc, [v, h]) => acc.h < h ? {v, h} : acc, {v: t, h: 0})
            s = t;
            t = v;
            value = h;
            A.add(t);
            delete dist[t];
            Object.keys(graph[t].edges)
                .filter(v => !A.has(v))
                .forEach(v => dist[v] = (dist[v] ?? 0) + graph[t].edges[v]);
        }
        if (value < best.value) {
            best = {value, cut: graph[t].cuts}
        }
        Object.keys(graph[t].edges)
            .filter(u => u !== t)
            .forEach(u => {
                graph[s].edges[u] = (graph[s].edges[u] ?? 0) + graph[t].edges[u];
                graph[u].edges[s] = graph[s].edges[u];
                delete graph[u].edges[t];
            })

        graph[s].cuts.push(...graph[t].cuts);
        names.splice(names.indexOf(t), 1)
        delete graph[t];
    }
    return best;
}

exports.part1 = input => {
    const connections = parse(input);
    const edges = connections.flatMap(({from, to}) => to.map(v => ({from, to: v})))
    const graph = edges.reduce((graph, {from, to}) => ({
        ...graph,
        [from]: {edges: [...(graph[from] ?? {edges: []}).edges, to]},
        [to]: {edges: [...(graph[to] ?? {edges: []}).edges, from]}
    }), {});

    const {cut, value} = minimalCut(graph)
    value === 3 || console.error('Removed not 3 edges: ', value);
    return cut.length * (Object.keys(graph).length - cut.length);
};
