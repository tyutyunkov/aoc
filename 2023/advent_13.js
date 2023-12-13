const parse = input => input
    .join('\n')
    .split('\n\n')
    .map(str => str.split('\n'))

const transpose = matrix => Array.from({length: matrix[0].length})
    .map((_, i) => matrix.map(row => row[i]).join(''));

const zip = (a, b) => a.map((k, i) => [k, b[i]]);
const lineDiff = (left, right) => zip(left.split(''), right.split(''))
    .filter(([l, r]) => l !== r).length

const mirrorDiff = (matrix, row) =>
    Array.from({length: Math.min(row, matrix.length - row - 2) + 1})
        .map((_, j) => lineDiff(matrix[row - j], matrix[row + j + 1]))
        .reduce((acc, v) => acc + v, 0)

const mirrorPosition = (matrix, d) => Array.from({length: matrix.length - 1})
    .map((_, i) => ({pos: i, diff: mirrorDiff(matrix, i)}))
    .filter(({diff}) => diff === d)
    .map(({pos}) => pos)[0] ?? -1;

const processRow = d => (matrix, i) => (mirrorPosition(matrix, d) + 1) * 100 + mirrorPosition(transpose(matrix), d) + 1

exports.part1 = input =>
    parse(input)
        .map(processRow(0))
        .reduce((acc, v) => acc + v, 0);

exports.part2 = input =>
    parse(input)
        .map(processRow(1))
        .reduce((acc, v) => acc + v, 0);
