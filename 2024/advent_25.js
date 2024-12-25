const isLock = data => data.startsWith('#');
const parseSchema = data => data.split('\n').map(row => row.split(''))
    .reduce((acc, row) => row.reduce((acc, cell, j) => {
        acc[j] = (acc[j] ?? 0) + (cell === '#' ? 1 : 0);
        return acc
    }, acc), [])
const parse = input => input.join('\n').split('\n\n')
    .reduce(({locks, keys}, schema) => ({
        locks: isLock(schema) ? [...locks, parseSchema(schema)] : locks,
        keys: isLock(schema) ? keys : [...keys, parseSchema(schema)]
    }), {locks: [], keys: []})

const size = 7;
exports.part1 = input => {
    const {locks, keys} = parse(input);
    return locks.reduce((acc, lock) => keys.reduce((acc, key) => acc + (key.every((v, i) => v + lock[i] <= size) ? 1 : 0), acc), 0)
};
