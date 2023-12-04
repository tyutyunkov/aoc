const inputFile = process.argv[2] ?? 'input_25.test.txt';
const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd().split('\n')

const digits = {
    '=': -2,
    '-': -1,
    '0': 0,
    '1': 1,
    '2': 2,
}

const snafu = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '=',
    '4': '-'
}

const fromSNAFU = value => [...value].reverse()
    .reduce(({v, pow}, d) => ({
        v: v + digits[d] * pow,
        pow: pow * 5
    }), {v: 0, pow: 1})
    .v

const toSNAFU = value => {
    let result = '';
    let v = value;
    while (v > 0) {
        let digit = snafu[v % 5];
        result = digit + result;
        v = (v - digits[digit]) / 5;
    }
    return result;
}

const part1 = () => toSNAFU(
    input.map(line => fromSNAFU(line))
        .reduce((acc, v) => acc + v, 0)
);

let data = part1();
console.log('part1', data, fromSNAFU(data));