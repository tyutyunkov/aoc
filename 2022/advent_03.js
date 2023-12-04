let sum = arr => arr.reduce((acc, v) => acc + v, 0);
let priority = s => s.charCodeAt(0) - (s.charCodeAt(0) > 96 ? 96 : 38);
let intersect = (a, b) => [...a].filter(v => b.has(v));

let input = (await fetch('https://adventofcode.com/2022/day/3/input').then(resp => resp.text()));

let rows = input.split("\n")
    .filter(v => v !== '')
    .map(v => Array.from(v));

let part1 = rows
    .map(row => ({first: new Set(row.slice(0, row.length / 2)), second: new Set(row.slice(-row.length / 2))}))
    .flatMap(({first, second}) => intersect(first, second))
    .map(priority);

let part2 = Array.from({length: rows.length / 3})
    .map((v, i) => ([new Set(rows[i * 3]), new Set(rows[i * 3 + 1]), new Set(rows[i * 3 + 2])]))
    .flatMap(group => [...group.reduce((acc, v) => new Set(intersect(acc, v)))])
    .map(priority);

console.log(sum(part1));
console.log(sum(part2));