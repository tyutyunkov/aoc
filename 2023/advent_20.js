const parse = input => input
    .map(str => /(?<type>[%&])?(?<id>\w+)\s+->\s+(?<out>.+)/.exec(str).groups)
    .map(({id, type, out}) => ({
            id,
            type,
            out: out.split(/\s*,\s*/),
            in: []
        })
    )
    .reduce((acc, v) => ({...acc, [v.id]: v}), {});

const process = (modules, search, limit = 100_000) => {
    const state = Object.values(modules)
        .filter(({type}) => type !== undefined)
        .reduce((state, {id, type}) => type === '%'
            ? ({...state, [id]: {out: false}})
            : ({...state, [id]: {in: modules[id].in.reduce((acc, v) => ({...acc, [v]: false}), {})}}), {});

    const counter = {low: 0, high: 0};
    let steps = 0;
    while (++steps <= limit) {
        const signals = [{from: 'button', target: 'broadcaster', signal: false}];
        const send = (module, signal) => module.out.forEach(target => signals.push({from: module.id, target, signal}));
        while (signals.length > 0) {
            const {from, target, signal} = signals.shift();
            !signal && ++counter.low || ++counter.high;
            if (!!search && signal === search.signal && target === search.id) {
                // todo: [tve] should we await for the end of the cycle?
                return {counter, steps};
            }
            const module = modules[target];
            if (module === undefined) {
            } else if (module.type === '%') {
                if (!signal) {
                    state[target].out = !state[target].out;
                    send(module, state[target].out);
                }
            } else if (module.type === '&') {
                state[target].in[from] = signal;
                send(module, !Object.values(state[target].in).every(v => v));
            } else {
                send(module, signal);
            }
        }
    }
    if (steps > limit) {
        console.error('Process was interrupted')
    }
    return {counter, steps};
}

exports.part1 = input => {
    const modules = parse(input);
    Object.values(modules)
        .forEach(({id, out}) => out.filter(module => modules[module] !== undefined).forEach(module => modules[module].in.push(id)))

    const {counter: {low, high}} = process(modules, null, 1_000);

    return low * high;
};

const hcf = (a, b) => a % b === 0 ? b : hcf(b, a % b)
const lcm = (a, b) => a * b / hcf(a, b);

exports.part2 = input => {
    const modules = parse(input);
    modules['rx'] = {id: 'rx', in: [], out: []}; // virtual rx

    Object.values(modules)
        .forEach(({id, out}) => out.filter(module => modules[module] !== undefined).forEach(module => modules[module].in.push(id)))

    modules['rx'].in.length === 1 || console.error('Unexpected rx inputs') && process.exit(-1);
    modules[modules['rx'].in[0]].type === '&' || console.error('Unexpected type of rx input') && process.exit(-2);

    const rxInput = modules[modules['rx'].in[0]];

    return rxInput.in.map(id => process(modules, {id, signal: false}))
        .map(({steps}) => steps)
        .reduce((acc, v) => lcm(acc, v))
}
