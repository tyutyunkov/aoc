let sum = arr => arr.reduce((acc, i) => acc + i);
let res = (await fetch('https://adventofcode.com/2022/day/2/input').then(resp => resp.text()))
    .split("\n")
    .filter(v => v !== '')
    .map(i => ([i.charCodeAt(0) - 64, i.charCodeAt(2) - 87]));

let scores1 = res.map(i => i[1] + (i[1] - i[0] + 4) % 3 * 3);
console.log(sum(scores1))

let scores2 = res.map(i => (i[1] + 2) % 3 * 3 + (i[0] + i[1]) % 3 + 1)
console.log(sum(scores2))
