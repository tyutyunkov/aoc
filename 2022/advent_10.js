const input =
    (await fetch('https://adventofcode.com/2022/day/10/input').then(resp => resp.text())).trimEnd()
        .split('\n');

const get = (stack, pos) => stack[pos] ?? get(stack, pos - 1);

const part1 = input.reduce((acc, command) => {
    const cycle = acc.cycle;
    if (command.startsWith('noop')) {
        return {
            ...acc,
            [cycle + 1]: get(acc, cycle),
            cycle: cycle + 1
        };
    } else {
        return {
            ...acc,
            [cycle + 1]: get(acc, cycle),
            [cycle + 2]: get(acc, cycle) + (command.split(' ')[1] - 0),
            cycle: cycle + 2
        }
    }
}, {'1': 1, cycle: 1});

console.log(Object.keys(part1).reduce((acc, v) => (v - 20) % 40 === 0 ? acc + part1[v] * v : acc, 0));

const part2 = Array.from({length: 6}).map((v, i) => i)
    .map(i => Array.from({length: 40}).map((v, j) => i * 40 + j + 1)
        .map((v, j) => Math.abs(part1[v] - j) <= 1 ? '#' : '.')
        .join('')
    )
    .join('\n')

console.log(part2);
