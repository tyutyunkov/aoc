const template = /Blueprint (?<id>\d+): Each ore robot costs (?<oreCostOre>\d+) ore. Each clay robot costs (?<clayCostOre>\d+) ore. Each obsidian robot costs (?<obsidianCostOre>\d+) ore and (?<obsidianCostClay>\d+) clay. Each geode robot costs (?<geodeCostOre>\d+) ore and (?<geodeCostObsidian>\d+) obsidian\./;

const inputFile = process.argv[2] ?? 'input_19.test.txt';
const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd();

const blueprints = input.split('\n')
    .map(row => template.exec(row))
    .map(match => match.groups)
    .map(bp => ({
        id: bp.id - 0,
        ore: {
            type: 'ore',
            ore: bp.oreCostOre - 0,
        },
        clay: {
            type: 'clay',
            ore: bp.clayCostOre - 0,
        },
        obsidian: {
            type: 'obsidian',
            ore: bp.obsidianCostOre - 0,
            clay: bp.obsidianCostClay - 0,
        },
        geode: {
            type: 'geode',
            ore: bp.geodeCostOre - 0,
            obsidian: bp.geodeCostObsidian - 0,
        }
    }));

const resNames = ['ore', 'clay', 'obsidian', 'geode'];
const stateEx = {
    income: {
        ore: 1,
        clay: 0,
        obsidian: 0,
        geode: 0,
    },
    resources: resNames.reduce((acc, res) => ({...acc, [res]: 0}), {}),
}

const isAvailable = (bp, res) => Object.entries(bp)
    .filter(entry => resNames.indexOf(entry[0]) > -1)
    .reduce((acc, entry) => acc && res[entry[0]] >= entry[1], true)

const noop = state => ({
    t: state.t - 1,
    next: state.next,
    income: state.income,
    resources: resNames
        .map(name => ({[name]: (state.resources[name] ?? 0) + (state.income[name] ?? 0)}))
        .reduce((acc, res) => ({...acc, ...res}), {}),
})
const build = (state, bp) => ({
    t: state.t - 1,
    income: {
        ...state.income,
        [bp.type]: (state.income[bp.type] ?? 0) + 1,
    },
    resources: resNames
        .reduce((acc, res) => ({
            ...acc,
            [res]: (state.resources[res] ?? 0) + (state.income[res] ?? 0) - (bp[res] ?? 0),
        }), {}),
    next: undefined,
})

const setNext = (state, next) => ({
    ...state,
    next,
})

// const estimate = (bp, state) => {
// // const estimate = (bp, income, resources) => {
//     console.log(state);
//     const t = 24;
//
//     const {income, resources} = state;
//     //
//     // const rOre = Math.max(0, bp.geode.ore - (resources.ore ?? 0)) / (income.ore ?? 0);
//     // const rObsidian = Math.max(0, bp.geode.obsidian - (resources.obsidian ?? 0)) / (income.obsidian ?? 0);
//     // console.log('ore', rOre);
//     // console.log('obsidian', rObsidian);
//     // const amount = t / Math.max(rOre, rObsidian);
//     // console.log('total', amount);
//     //
//     //
//     //
//     // // return;
//     //
//     //
//     // console.log(income.ore / bp.ore.ore);
//     // console.log(income.ore / bp.clay.ore);
//     // console.log(income.ore / bp.obsidian.ore, (income.clay ?? 0) / bp.obsidian.clay);
//     // console.log(income.ore / bp.geode.ore, (income.obsidian ?? 0) / bp.geode.obsidian);
//     //
//     const stat = resNames.reduce((stat, res) => ({
//         ...stat,
//         [res]: resNames.filter(r => !!bp[res][r]).map(r => (income[r] ?? 0) / bp[res][r]),//.reduce((min, i) => Math.min(min, i), Infinity),
//     }), {})
//     console.log(stat)
//     const stat2 = resNames.reduce((stat, res) => ({
//         ...stat,
//         [res]: resNames.filter(r => !!bp[res][r]).map(r => bp[res][r] / ((income[r] ?? 0) + 1)),//.reduce((min, i) => Math.min(min, i), Infinity),
//     }), {})
//     console.log(stat2)
//     const stat3 = resNames.reduce((stat, res) => ({
//         ...stat,
//         [res]: resNames.filter(r => !!bp[res][r]).reduce((acc, r) => ({...acc, [r]: bp[res][r] / ((income[r] ?? 0))}), {}),//.reduce((min, i) => Math.min(min, i), Infinity),
//     }), {})
//     console.log(stat3)
//     Math.max(stat3.geode)
//
//     console.log('ore', Math.max(stat3.clay.ore, stat3.obsidian.ore, stat3.geode.ore));
//     console.log('clay', stat3.obsidian.clay);
//     console.log('obsidian', stat3.geode.obsidian);
//
//     console.log();
//     console.log();
//
// }
//
// estimate(blueprints[0], {income: {ore: 1}, resources: {}});
// // estimate(blueprints[0], {income: {ore: 1, clay: 1}, resources: {}});
// // estimate(blueprints[0], {income: {ore: 1, clay: 2}, resources: {}});
// estimate(blueprints[0], {income: {ore: 1, clay: 3}, resources: {}});
// estimate(blueprints[0], {income: {ore: 1, clay: 4, obsidian: 1}, resources: {}});
// estimate(blueprints[0], {income: {ore: 1, clay: 5, obsidian: 1}, resources: {}});
// // estimate(blueprints[0], {income: {ore: 1, clay: 6, obsidian: 1}, resources: {}});
// estimate(blueprints[0], {income: {ore: 1, clay: 4, obsidian: 2}, resources: {}});
// // estimate(blueprints[0], {income: {ore: 1, clay: 1}, resources: {}});
// // const estimate = (state, bp) => {
// //     let result = state.resources.geode +
// //         (state.income.geode + 1) * state.t;
// //
//     (state.resources.ore + state.t * state.income.ore) / bp.ore.ore;
//     (state.resources.ore + state.t * state.income.ore) / bp.clay.ore;
//
//     return result;
// }

// return;
// const part1value = bp => {
//     const queue = [{
//         income: {...stateEx.income},
//         resources: {...stateEx.resources},
//         t: 24
//     }];
//     let best = {geode: 0}
//     while (queue.length > 0) {
//         const state = queue.pop();
//         // console.log(state)
//         if (state.t === 0) {
//             if (state.resources.geode > best.geode) {
//                 console.log('best', state);
//             }
//             best.geode = Math.max(best.geode, state.resources.geode)
//             continue;
//         }
//
//         // if (state.resources.geode + (state.income.geode + 1) * (state.t + 1) <= best.geode) {
//         //     console.log(state)
//         //     continue;
//         // }
//
//         if (isAvailable(bp.geode, state.resources)) {
//             queue.push(build(state, bp.geode))
//             // continue;
//         }
//         const nextGeode = (st) => {
//             return Math.max(
//                 Math.ceil(Math.max(0, bp.geode.ore - st.resources.ore) / st.income.ore),
//                 Math.ceil(Math.max(0, bp.geode.obsidian - st.resources.obsidian) / st.income.obsidian),
//             )
//         }
//         if (isAvailable(bp.obsidian, state.resources)) {
//             if (!state.income.obsidian) {
//                 queue.push(build(state, bp.obsidian));
//                 continue;
//             }
//             // console.log(nextGeode(build(state, bp.obsidian)));
//             // return
//             const oreTurns1 = Math.ceil(Math.max(0, bp.geode.ore - state.resources.ore + bp.obsidian.ore - state.income.ore) / state.income.ore);
//             const obsTurns1 = Math.ceil(Math.max(0, bp.geode.obsidian - state.resources.obsidian - state.income.obsidian) / (state.income.obsidian + 1));
//
//             const oreTurns2 = Math.ceil(Math.max(0, bp.geode.ore - state.resources.ore - state.income.ore) / state.income.ore);
//             const obsTurns2 = Math.ceil(Math.max(0, bp.geode.obsidian - state.resources.obsidian - state.income.obsidian) / state.income.obsidian);
//
//             const n1 = Math.max(oreTurns1, obsTurns1);
//             const n2 = Math.max(oreTurns2, obsTurns2);
//             console.log(n1, n2, nextGeode(build(state, bp.obsidian)), nextGeode(noop(state)))
//             if (n1 <= n2) {
//                 queue.push(build(state, bp.obsidian));
//                 continue;
//             }
//         }
//
//         if (isAvailable(bp.clay, state.resources)) {
//             if (!state.income.clay) {
//                 queue.push(build(state, bp.clay))
//                 continue;
//             }
//             const obsOre1 = Math.ceil(Math.max(0, bp.obsidian.ore - state.resources.ore - state.income.ore + bp.clay.ore) / state.income.ore);
//             const geoOre1 = Math.ceil(Math.max(0, bp.geode.ore - state.resources.ore - state.income.ore + bp.clay.ore) / state.income.ore);
//             const obsClay1 = Math.ceil(Math.max(0, bp.obsidian.clay - state.resources.clay - state.income.clay) / (state.income.clay + 1));
//
//             const obsOre2 = Math.ceil(Math.max(0, bp.obsidian.ore - state.resources.ore - state.income.ore) / state.income.ore);
//             const geoOre2 = Math.ceil(Math.max(0, bp.geode.ore - state.resources.ore - state.income.ore) / state.income.ore);
//             const obsClay2 = Math.ceil(Math.max(0, bp.obsidian.clay - state.resources.clay - state.income.clay) / state.income.clay);
//
//             // console.log(obsOre1, obsOre2, obsClay1, obsClay2);
//             if (Math.max(obsOre1, obsClay1) <= Math.max(obsOre2, obsClay2)) {
//                 queue.push(build(state, bp.clay));
//                 continue;
//             }
//         }
//
//         if (isAvailable(bp.ore, state.resources)) {
//             queue.push(build(state, bp.ore));
//         }
//         queue.push(noop(state));
//     }
//     return bp.id * best.geode;
// }

// const part1value = bp => {
//     const queue = [{
//         income: {...stateEx.income},
//         resources: {...stateEx.resources},
//         t: 24
//     }];
//
//     let state = queue.pop();
//
//     if (isAvailable(bp.clay, state)) {
//         if (!state.income.clay) {
//             // todo:
//         } else {
//             Math.max(0, bp.obsidian.clay - state.resources.clay) / state.income.clay;
//             Math.max(0, bp.obsidian.ore - state.resources.ore) / state.income.ore;
//             bp.obsidian.ore / state.income.ore;
//             bp.obsidian.clay / state.income.clay;
//
//             1 + Math.max(0, bp.obsidian.clay - state.resources.clay - state.income.clay) / (state.income.clay + 1);
//             1 + Math.max(0, bp.obsidian.ore - state.resources.ore + bp.clay.ore) / state.income.ore;
//             bp.obsidian.clay / (state.income.clay + 1);
//
//         }
//     }
//
//     const tt = state => {
//         (bp.geode.ore - state.resources.ore) / state.income.ore;
//         (bp.geode.obsidian - state.resources.obsidian) / state.resources.obsidian;
//     }
//
//
//     let geode = 0;
//     return bp.id * geode;
// }


const partXvalue = (bp, t) => {
    const queue = [{
        income: {...stateEx.income},
        resources: {...stateEx.resources},
        next: undefined,
        t,
    }];
    // let best = [];
    let geode = 0;
    while (queue.length > 0) {
        const state = queue.pop();
        if (state.t === 0) {
            geode = Math.max(geode, state.resources.geode)
            continue;
        }

        if (state.next === undefined) {
            const next = [];
            const turns = ({resources, income}, bp) =>
                resNames.filter(res => !!bp[res])
                    .map(res => Math.ceil(Math.max(0, bp[res] - resources[res]) / income[res]))
                    .reduce((max, t) => Math.max(max, t), 0)


            /// check geode
            {
                if (state.t - 1 > turns(state, bp.geode)) {
                    next.push('geode');
                }
            }

            /// check obsidian
            {
                const bt = turns(state, bp.obsidian);
                /*&& turns(build(state, bp.obsidian), bp.geode) < state.t - 1*/
                if (state.income.obsidian < bp.geode.obsidian
                    && state.t - 2 > bt) {

                    // const obs1 = (state.t * state.income.obsidian + state.resources.obsidian) / bp.geode.obsidian;
                    // const obs2 = (state.t * state.income.obsidian + state.resources.obsidian + (state.t - bt - 1)) / bp.geode.obsidian;
                    // const ore1 = (state.t * state.income.ore + state.resources.ore) / bp.geode.ore;
                    // const ore2 = (state.t * state.income.ore + state.resources.ore - bp.obsidian.ore) / bp.geode.ore;
                    // if (Math.min(obs2, ore2) >= Math.min(obs1, ore1)) {
                        next.push('obsidian');
                    // }
                }
            }

            /// check clay
            {
                if (state.income.clay < bp.obsidian.clay && state.income.obsidian < bp.geode.obsidian && state.t > t / 4) {
                    // if ()


                    // if (turns(build(build(state, bp.clay), bp.obsidian), bp.geode) <= turns(state, bp.geode)
                    //     /* || turns(build(state, bp.clay), bp.geode) <= turns(state, bp.geode)*/) {
                        // if (1 + turns(build(state, bp.clay), bp.obsidian) <= turns(state, bp.obsidian)
                        //     && 1 + turns(build(state, bp.clay), bp.geode) <= turns(state, bp.geode)) {
                        next.push('clay');
                    // }
                    // next.push('clay');
                }
            }

            /// check ore
            {

                if (state.income.ore < Math.max(bp.clay.ore, bp.obsidian.ore, bp.geode.ore)) {
                    // if (state.t > t / 2) {
                        next.push('ore')
                    // }
                }
                //     const oreTurns = turns(state, bp.ore);
                //     if (state.t > oreTurns) {
                //         const remain = state.t - oreTurns;
                //
                //         const newSt = Array.from({length: oreTurns})
                //             .reduce((st) => noop(st), state);
                //
                //         [bp.clay, bp.obsidian, bp.geode]
                //             .map(bp => ({before: turns(state, bp), after: turns(newSt, bp)}))
                //             .filter(stat =>)
                //     }
            }
            // turns(state, bp.ore);

            // turns()

            if (next.length === 0) {
                queue.push(noop(state))
            } else {
                next.forEach(next => queue.push(setNext(state, next)));
            }
        } else if (isAvailable(bp[state.next], state.resources)) {
            queue.push(build(state, bp[state.next]));
        } else {
            queue.push(noop(state));
        }
    }

    // console.log(best)
    return geode;
}

const part1 = Object.values(blueprints)
    // .slice(0, 1)
    .map(bp => bp.id * partXvalue(bp, 24))
    .reduce((acc, v) => acc + v, 0)
console.log('part1', part1);
//
const part2 = Object.values(blueprints)
    .slice(0, 3)
    .map(bp => partXvalue(bp, 32))
    .sort((a, b) => b - a)
    .reduce((acc, v) => acc * v, 1)
console.log('part2', part2);
