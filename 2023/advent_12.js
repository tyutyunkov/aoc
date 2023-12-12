const parse = input => input
    .map(row => row.split(' '))
    .map(([data, pattern]) => ({
        data: data,
        pattern: pattern.split(',').map(v => v - 0)
    }))

const makeCopies = ({data, pattern}) => ({
    data: Array.from({length: 4}).reduce(acc => acc + '?' + data, data),
    pattern: Array.from({length: 5}).reduce(acc => [...acc, ...pattern], []),
})

const sum = arr => arr.reduce((acc, v) => acc + v, 0)
const sumL = arr => sum(arr.map(v => v.length))

const cache = {};

const fillGroup = (group, pattern) => {
    const key = `${group}:${pattern.join('-')}`;
    if (cache[key] !== undefined) {
        return cache[key];
    }
    return (cache[key] = fillGroupRaw(group, pattern));
}

const fillGroupRaw = (group, pattern) => {
    if (group.length < sum(pattern) + pattern.length - 1) {
        return 0;
    }
    if (pattern.length === 0) {
        return group.indexOf('#') === -1 ? 1 : 0
    }

    if (pattern.length === 1) {
        if (group.indexOf('#') === -1) {
            return group.length - pattern[0] + 1;
        }

        const {min, max} = group.split('')
            .reduce((acc, v, i) => v !== '#'
                    ? acc
                    : ({
                        min: Math.min(i, acc.min),
                        max: Math.max(i, acc.max)
                    }),
                {
                    min: group.length - 1,
                    max: 0
                })
        if (max - min > pattern[0]) {
            return 0;
        }
        return Math.min(min, group.length - pattern[0]) - Math.max(0, max - pattern[0] + 1) + 1;
    }

    const tryShift = group.charAt(0) === '#' ? 0 : fillGroup(group.substring(1), pattern)
    const tryGroup = group.charAt(pattern[0]) === '#' ? 0 : fillGroup(group.substring(pattern[0] + 1), pattern.slice(1));
    return tryShift + tryGroup;
}

const tryGroups = (groups, pattern) => {
    const key = `${groups.join('.')}:${pattern.join('-')}`;
    if (cache[key] !== undefined) {
        return cache[key];
    }
    return (cache[key] = tryGroupsRaw(groups, pattern));
}
const tryGroupsRaw = (groups, pattern) => {
    if (groups.length === 1) {
        return fillGroup(groups[0], pattern)
    }
    let gl = sumL(groups) + groups.length - 1;
    let pl = sum(pattern) + pattern.length - 1;
    if (gl < pl) {
        return 0;
    }

    const group = groups[0];
    let result = 0;
    if (group.indexOf('#') === -1) {
        result += tryGroups(groups.slice(1), pattern);
    }

    let i = 0;
    let tpl = 0;
    while (++i <= pattern.length) {
        tpl += pattern[i - 1] + (i > 1 ? 1 : 0);
        if (tpl > group.length) {
            break;
        }
        result += fillGroup(group, pattern.slice(0, i)) * tryGroups(groups.slice(1), pattern.slice(i))
    }
    return result;
}

const processRow = ({data, pattern}) => tryGroups(data.split(/\.+/), pattern)

exports.part1 = input => parse(input)
    .map(processRow)
    .reduce((acc, v) => acc + v, 0);

exports.part2 = input => parse(input).map(makeCopies)
    .map(processRow)
    .reduce((acc, v) => acc + v, 0);
