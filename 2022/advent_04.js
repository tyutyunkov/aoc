

let data = (await fetch('https://adventofcode.com/2022/day/4/input').then(resp => resp.text()))
    .split('\n')
    .filter(v => v !== '');

let assignment = data.map(row => row.split(','))
    .map(row => row.map(cell => cell.split('-').map(v => v - 0)))
    .map(row => row.sort((r1, r2) => r1[0] !== r2[0] ? r1[0] - r2[0] : r2[1] - r1[1]));

let fullyContain = row => row[0][0] <= row[1][0] && row[0][1] >= row[1][1];
let hasIntersection = row => row[1][0] <= row[0][1];

let part1 = assignment.filter(row => fullyContain(row));
let part2 = assignment.filter(row => hasIntersection(row));

console.log(part1.length);
console.log(part2.length);