const pattern = /Valve (?<id>[A-Z]+) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<valves>[A-Z, ]+)/;

const inputFile = process.argv[2] ?? 'input_16.test.txt';
const startId = 'AA';
const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd();

const map =
    input.split('\n')
        .map(row => pattern.exec(row))
        .map(match => match.groups)
        .map(({id, rate, valves}) => ({id, rate: rate - 0, valves: valves.split(',').map(value => value.trim())}))
        .reduce((map, tunnel) => ({
            ...map,
            [tunnel.id]: tunnel
        }), {});

Object.values(map)
    .forEach(v => {
        v.routes = {
            ...Object.keys(map).reduce((acc, key) => ({...acc, [key]: {path: [], weight: Infinity, target: map[key]}}), {}),
            ...v.valves.reduce((acc, valve) => ({...acc, [valve]: {path: [valve], weight: 1.0 / map[valve].rate, target: map[valve]}}), {}),
            [v.id]: {path: [], weight: Infinity, target: v}
        }
    })

Array.from({length: Object.keys(map).length}, (_, i) => i + 1)
    .forEach(len => Object.values(map).forEach(src => {
            Object.values(src.routes)
                .filter(({path}) => path.length === len)
                .forEach(route => {
                    route.target.valves
                        .filter(valve => valve !== src.id)
                        .forEach(valve => {
                            const path = [...route.path, valve];
                            if (src.routes[valve].path.length === 0) {
                                src.routes[valve].path = path;
                                src.routes[valve].weight = path.length / map[valve].rate;
                            }
                        })
                })
        })
    );
Object.values(map)
    .forEach(valve => {
        valve.routesMap = valve.routes;
        valve.routes = Object.values(valve.routesMap)
            .sort((a, b) => a.weight === b.weight ? 0 : (a.weight < b.weight ? -1 : 1))
    })
const sumRate = Object.values(map).reduce((acc, {rate}) => acc + rate, 0);

const part1 = () => {
    let best = {value: 0};
    const queue = [{
        value: 0,
        rate: 0,
        open: new Set(),
        pos: map[startId],
        t: 30,
    }];

    const estimateMove = (v, rate, t, route) => {
        const steps = route.path.length + 1;
        if (t < steps) {
            return v + rate * t;
        }
        return (
            v + rate * t // current
            + route.target.rate * Math.max(0, t - steps) // item
            + (sumRate - rate - route.target.rate) * Math.max(0, t - steps)
        )
    }

    const noop = (state) => ({
        value: state.value + state.rate,
        rate: state.rate,
        open: state.open,
        pos: state.pos,
        t: state.t - 1,
    })
    const move = (state, route) => ({
        value: state.value + state.rate * route.path.length,
        rate: state.rate,
        open: state.open,
        pos: route.target,
        t: state.t - route.path.length,
    })
    const open = (state) => ({
        value: state.value + state.rate,
        rate: state.rate + state.pos.rate,
        open: new Set(state.open).add(state.pos.id),
        pos: state.pos,
        t: state.t - 1,
    })

    while (queue.length > 0) {
        const state = queue.pop();
        if (state.t === 0) {
            if (best.value < state.value) {
                best = state;
            }
            continue;
        }
        if (!state.open.has(state.pos.id) && state.pos.rate > 0) {
            queue.push(open(state))
            continue;
        }

        const next = [...state.pos.routes]
            .filter(route => !state.open.has(route.target.id) && route.weight < Infinity)
            .filter(route => route.path.length + 1 < state.t)
            .filter(route => estimateMove(state.value, state.rate, state.t, route) >= best.value)
            .sort((a, b) => estimateMove(state.value, state.rate, state.t, a) - estimateMove(state.value, state.rate, state.t, b))
        if (next.length === 0) {
            queue.push(Array.from({length: state.t}).reduce(st => noop(st), state));
        } else {
            next.forEach(route => queue.push(move(state, route)));
        }
    }
    return best.value;
}

/// unified solution
const partX = (count, time) => {
    let best = {value: 0};
    const tick = state => ({
        value: state.value + state.rate,
        rate: state.nrate,
        nrate: state.nrate,
        open: state.open,
        closed: state.closed,
        targets: state.targets,
        workers: state.workers.map(w => (state.busy.has(w.id) ? w : {
            id: w.id,
            pos: (w.route ?? []).length > 0 ? w.route[0] : w.pos,
            route: (w.route ?? []).slice(1),
            target: w.target,
        })),
        busy: new Set(),
        t: state.t - 1,
    })

    const del = (set, item) => {
        const res = new Set(set);
        res.delete(item);
        return res;
    }

    const open = state => {
        const toOpen = state.workers.filter(({pos, target}) => target !== undefined && pos === target.id && state.closed.has(pos));
        if (toOpen.length === 0) {
            return state;
        }
        const busy = new Set(toOpen.map(({id}) => id));
        return ({
            ...state,
            nrate: state.nrate + toOpen.map(({pos}) => map[pos].rate).reduce((acc, v) => acc + v, 0),
            open: toOpen.reduce((acc, {pos}) => acc.add(pos), new Set(state.open)),
            closed: toOpen.reduce((acc, {pos}) => del(acc, pos), new Set(state.closed)),
            workers: state.workers.map(w => ({
                ...w,
                target: busy.has(w.id) ? undefined : w.target,
            })),
            busy,
        });
    }

    const move = (state, worker, route) => ({
        ...state,
        targets: del(state.targets, route.target.id),
        workers: [
            ...state.workers.filter(({id}) => id !== worker.id),
            {
                id: worker.id,
                pos: worker.pos,
                route: [...route.path],
                target: route.target,
            }
        ],
    });

    const estimate = state => {
        let res = state.value + state.rate + state.nrate * (state.t - 1);
        res += state.workers.filter(w => w.target !== undefined).reduce((acc, w) => acc + w.target.rate * Math.max(0, state.t - w.route.length), 0)
        res += [...state.targets].map(id =>
            state.workers.map(w => map[id].rate * Math.max(0, state.t - (w.target === undefined ? (map[w.pos].routesMap[id].path.length + 1) : (map[w.target.id].routesMap[id].path.length + w.route.length + 2))))
                .reduce((acc, v) => Math.max(acc, v), 0)
        ).reduce((acc, v) => acc + v, 0)
        return res;
    }

    const step = state => {
        if (state.t === 0) {
            if (best.value < state.value) {
                best = state;
                // console.log(best.value)
            }
            return best;
        }

        state = open(state);
        if (estimate(state) < best.value) {
            return best;
        }
        if (state.targets.size === 0) {
            return step(tick(state));
        }

        const worker = state.workers.find(({id, target}) => !state.busy.has(id) && target === undefined);
        if (worker === undefined) {
            return step(tick(state));
        } else {
            const next = [...state.targets].map(id => map[worker.pos].routesMap[id]).sort((a, b) => a.weight - b.weight)
            if (next.length === 0) {
                return best;
            }
            return next.reduce((acc, route, i, arr) => {
                    let newState = move(state, worker, route)
                    if (estimate(newState) < best.value) {
                        arr.splice(i); // break
                        return best;
                    }
                    newState = step(newState);
                    return newState.value > best.value ? newState : best
                }, best);
        }
    }
    step({
        value: 0,
        rate: 0,
        nrate: 0,
        open: new Set(),
        closed: new Set(Object.values(map).filter(({rate}) => rate > 0).map(({id}) => id)),
        targets: new Set(Object.values(map).filter(({rate}) => rate > 0).map(({id}) => id)),
        workers: Array.from({length: count ?? 2}).map((_, i) => ({id: `el${i}`, pos: startId, route: [], target: undefined})),
        busy: new Set(),
        t: time ?? 26,
    });
    return best.value;
}

(process.argv[3] ?? 'part1old,part1,part2,part3,part4').split(',')
    .forEach(arg => {
        switch (arg) {
            case 'part1old':
                console.log('part1 (old):', part1());
                break;
            case 'part1':
                console.log('part1:', partX(1, 30));
                break;
            case 'part2':
                console.log('part2:', partX(2, 26));
                break;
            case 'part3':
                console.log('part3:', partX(3, 26));
                break;
            case 'part4':
                console.log('part4:', partX(4, 18));
                break;
        }
    })