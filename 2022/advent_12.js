// const input = (require('fs').readFileSync('input_12.txt', 'utf8')).trim();
const input = (await fetch('https://adventofcode.com/2022/day/12/input').then(resp => resp.text())).trimEnd();
// input = 'Sabqponm\n' +
//     'abcryxxl\n' +
//     'accszExk\n' +
//     'acctuvwj\n' +
//     'abdefghi'

const mapRows = input.split('\n');

const startPos = mapRows.reduce((acc, row, i) => acc === undefined && row.indexOf('S') >= 0 ? {i, j: row.indexOf('S')} : acc, undefined);
const endPos = mapRows.reduce((acc, row, i) => acc === undefined && row.indexOf('E') >= 0 ? {i, j: row.indexOf('E')} : acc, undefined);

mapRows[startPos.i] = mapRows[startPos.i].replace('S', 'a');//substring(0, startPos.j) + 'a' + mapRows[startPos.i].substring(startPos.j + 1);
mapRows[endPos.i] = mapRows[endPos.i].replace('E', 'z');//substring(0, endPos.j) + 'z' + mapRows[endPos.i].substring(endPos.j + 1);

const map = mapRows.map(row =>
    [...row].map(c => c.charCodeAt(0) - 'a'.charCodeAt(0))
        .map(h => ({h}))
);

const map1 = [...map.map(row => [...row.map(({h}) => ({h}))])]

const createMoves = (i, j) => [{j: j - 1, i}, {j: j + 1, i}, {j, i: i - 1}, {j, i: i + 1}]
    .filter(({i, j}) => i >= 0 && j >= 0 && i < map.length && j < map[i].length);

map1[startPos.i][startPos.j] = {step: 0, h: 0};

const part1 = [startPos];
while (part1.length > 0) {
    const {i, j} = part1.shift();
    const {step, h} = map1[i][j];

    createMoves(i, j)
        .map(({i, j}) => {
            if ((map1[i][j].step ?? Infinity) > step + 1 && map1[i][j].h <= h + 1) {
                map1[i][j].step = step + 1;
                return {i, j}
            }
        })
        .filter(v => v !== undefined)
        .forEach(item => part1.push(item));
}

console.log(map1[endPos.i][endPos.j].step);

const map2 = [...map.map(row => [...row.map(({h}) => ({h}))])]

map2[endPos.i][endPos.j] = {step: 0, h: 25};
const part2 = [endPos];
while (part2.length > 0) {
    const {i, j} = part2.shift();
    const {step, h} = map2[i][j];

    createMoves(i, j)
        .map(({i, j}) => {
            if ((map2[i][j].step ?? Infinity) > step + 1 && map2[i][j].h >= h - 1) {
                map2[i][j].step = step + 1;
                return {i, j}
            }
        })
        .filter(v => v !== undefined)
        .forEach(item => part2.push(item));
}

const part2answer = map2.reduce((acc, row) =>
        row.reduce((acc, {h, step}) =>
                h === 0 && step !== undefined ? Math.min(acc, step) : acc,
            acc),
    Infinity);
console.log(part2answer);