let input = (await fetch('https://adventofcode.com/2022/day/8/input').then(resp => resp.text())).trimEnd();
//
// let input =
//     '30373\n' +
//     '25512\n' +
//     '65332\n' +
//     '33549\n' +
//     '35390';
let data = input.split('\n')
    .map(line => ([...line]).map(h => h - 0).map(h => ({h})));

let ii = Array.from({length: data.length}).map((v, i) => i);
let ij = Array.from({length: data[0].length}).map((v, j) => j);

let isShorter = (i, j, h) => data[i][j].h < h

let map = data.map((row, i) =>
    row.map(({h}, j) => ({
            h,
            up: ii.slice(0, i).reverse().find(k => !isShorter(k, j, h)) ?? -1,
            left: ij.slice(0, j).reverse().find(k => !isShorter(i, k, h)) ?? -1,
            down: ii.slice(i + 1).find(k => !isShorter(k, j, h)) ?? ii.length,
            right: ij.slice(j + 1).find(k => !isShorter(i, k, h)) ?? ij.length,
        })
    )
);

let map1 = map.map(row =>
    row.map(({up, left, down, right}) =>
        ({visible: up === -1 || left === -1 || down === ii.length || right === ij.length})
    )
);

let part1 = map1.reduce((acc, row, i) =>
        acc + row.reduce((s, {visible}, j) => s + (visible ? 1 : 0), 0),
    0);

console.log(part1);

let map2 = map.map((row, i) =>
    row.map(({up, left, down, right}) => ({
        up: Math.max(0, up),
        left: Math.max(0, left),
        down: Math.min(ii.length  - 1, down),
        right: Math.min(ij.length  - 1, right)
    }))
        .map(({up, left, down, right}, j) => (i - up) * (j - left) * (down - i) * (right - j)), 0);

let part2 = map2.reduce((acc, row) =>
        Math.max(acc, row.reduce((s, score) => Math.max(s, score))),
    0);

console.log(part2);
