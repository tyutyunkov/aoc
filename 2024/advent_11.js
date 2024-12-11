const parse = input => input[0].split(' ').map(Number);

const add = (acc, k, v) => acc[k] = (acc[k] ?? 0) + v;

const stonesToMap = stones => stones.reduce((acc, v) => ({...acc, [v]: (acc[v] ?? 0) + 1}), {});
const blink = stones => Object.entries(stones)
    .reduce((acc, [k, v]) => {
        if (k === '0') {
            add(acc, 1, v)
        } else if (k.length % 2 === 0) {
            add(acc, Number(k.slice(0, k.length / 2)), v)
            add(acc, Number(k.slice(k.length / 2)), v)
        } else {
            add(acc, k * 2024, v)
        }
        return acc;
    }, {});

exports.part1 = input => Object.values(
    Array.from({length: 25}).reduce(blink, stonesToMap(parse(input)))
).reduce((acc, v) => acc + v, 0);

exports.part2 = input => Object.values(
    Array.from({length: 75}).reduce(blink, stonesToMap(parse(input)))
).reduce((acc, v) => acc + v, 0);