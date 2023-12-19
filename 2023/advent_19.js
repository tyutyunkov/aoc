const buildCondition = ({part, compare, value}) => ({
    part,
    compare,
    value: value - 0,
    test: item => compare === '<' ? item[part] < value : item[part] > value
})

const parse = input => {
    const [wRows, iRows] = input.join('\n').split('\n\n');
    return ({
        workflows: wRows.split('\n')
            .map(str => /(?<id>\w+)\{(?<rules>.+)}/.exec(str).groups)
            .map(({id, rules}) => ({
                    id,
                    rules: rules.split(',')
                        .map(str => str.split(':'))
                        .map(([condition, target]) => target === undefined
                            ? ({
                                condition: {test: () => true},
                                target: condition
                            }) : ({
                                condition: buildCondition(/(?<part>[xmas])(?<compare>[<>])(?<value>\d+)/.exec(condition).groups),
                                target
                            }))
                })
            ).reduce((acc, {id, rules}) => ({...acc, [id]: rules}), {}),
        items: iRows.split('\n')
            .map(str => /\{x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)}/.exec(str).groups)
            .map(({x, m, a, s}) => ({x: x - 0, m: m - 0, a: a - 0, s: s - 0}))
    })
}

const applyWorkflow = (workflow, item) => workflow.find(({condition: {test}}) => test(item)).target

exports.part1 = input => {
    const {workflows, items} = parse(input);
    return items.filter(item => {
        let wId = 'in';
        while (wId !== 'A' && wId !== 'R') {
            wId = applyWorkflow(workflows[wId], item);
        }
        return wId === 'A';
    })
        .map(({x, m, a, s}) => x + m + a + s)
        .reduce((acc, v) => acc + v)
};


const values = {min: 1, max: 4000};
const keys = 'xmas'.split('');
const paths = {
    'A': [keys.reduce((acc, v) => ({...acc, [v]: values}), {})],
    'R': [],
};

const getPaths = (workflows, wid) => paths[wid] !== undefined ? paths[wid] : (paths[wid] = buildPaths(workflows, wid))

const buildPaths = (workflows, wid) => {
    const result = [];
    const rules = workflows[wid];
    const limits = keys.reduce((acc, v) => ({...acc, [v]: values}), {});
    let i = -1;
    while (++i < rules.length) {
        const {condition, target} = rules[i];
        let success;
        let paths;
        if (condition.compare === undefined) {
            paths = getPaths(workflows, target);
            success = {...limits};
        } else {
            const partLimit = splitLimit(limits[condition.part], condition);
            if (partLimit.success !== undefined) {
                paths = getPaths(workflows, target);
                success = {...limits, [condition.part]: partLimit.success};
            }

            if (partLimit.fail === undefined) {
                i = rules.length;
            }

            limits[condition.part] = partLimit.fail;
            if (partLimit.success === undefined) {
                continue;
            }
        }

        paths.map(path => mergeLimits(path, success))
            .filter(path => !path.unreachable)
            .forEach(path => result.push(path))
    }

    return result;
}

const splitLimit = (limit, condition) => {
    const successLimit = condition.compare === '<'
        ? {min: limit.min, max: Math.min(limit.max, condition.value - 1)}
        : {min: Math.max(limit.min, condition.value + 1), max: limit.max}
    const failLimit = condition.compare === '<'
        ? {min: Math.max(condition.value, limit.min), max: limit.max}
        : {min: limit.min, max: Math.min(condition.value, limit.max)};

    return {
        success: successLimit.min < successLimit.max ? successLimit : undefined,
        fail: failLimit.min < failLimit.max ? failLimit : undefined,
    }
}

const mergeLimits = (limits1, limits2) =>
    keys
        .map(v => ({v, limits: {min: Math.max(limits1[v].min, limits2[v].min), max: Math.min(limits1[v].max, limits2[v].max)}}))
        .map(({v, limits}) => ({v, limits: limits.min < limits.max ? limits : undefined}))
        .reduce((acc, {v, limits}) => ({
            ...acc,
            unreachable: acc.unreachable || limits === undefined,
            [v]: limits,
        }), {unreachable: false});

exports.part2 = input =>
    getPaths(parse(input).workflows, 'in')
        .map(path => keys.map(v => path[v]).map(({min, max}) => max - min + 1).reduce((acc, v) => acc * v, 1))
        .reduce((acc, v) => acc + v);