let input = (await fetch('https://adventofcode.com/2022/day/5/input').then(resp => resp.text()))
let inputParts = input.split('\n\n');

let init = inputParts[0].split('\n').reverse();
let si = init[0].split(' ').filter(v => v !== '').map(v => v - 1);
let moves = inputParts[1].split('\n')
    .filter(v => v !== '')
    .map(row => row.split(' '))
    .map(row => ({count: row[1] - 0, from: row[3] - 1, to: row[5] - 1}));

let stacks = init.slice(1)
    .reduce((acc, row) => acc.map((s, i) => [...s, row.charAt(i * 4 + 1)]),
        si.map(r => ([])))
    .map(stack => stack.filter(v => v !== ' '));

let stacks1 = stacks.map(stack => [...stack]);
moves.forEach(({count, from, to}) => {
    stacks1[from].splice(-count).reverse()
        .forEach(v => stacks1[to].push(v))
});

let stacks2 = stacks.map(stack => [...stack]);
moves.forEach(({count, from, to}) => {
    stacks2[from].splice(-count)
        .forEach(v => stacks2[to].push(v))
});

let part1 = stacks1.map(stack => stack.at(-1)).join('')
let part2 = stacks2.map(stack => stack.at(-1)).join('')

console.log(part1);
console.log(part2);