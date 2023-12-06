var input = 'two1nine\n' +
    'eightwothree\n' +
    'abcone2threexyz\n' +
    'xtwone3four\n' +
    '4nineeightseven2\n' +
    'zoneight234\n' +
    '7pqrstsixteen';

// part1
input.split('\n')
    .filter(str => str !== '')
    .map(str => str.split('').filter(c => c >= '0' && c <= '9'))
    .map(arr => arr[0] + arr[arr.length - 1] - 0)
    .reduce((acc, i) => acc + i, 0)


// part2
const replace = [...[
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine'
].map((value, digit) => ({value, digit: digit + 1})),
    ...Array.from({length: 9}).map((_, digit) => ({digit: digit + 1, value: '' + (digit + 1)}))
];


var parseStr = str => {
    var digits = [];
    var i = 0;
    while (i < str.length) {
        const si = i;
        const dc = replace.find(dc => str.substring(si, si + dc.value.length) === dc.value);
        if (dc !== undefined) {
            digits.push(dc.digit);
        }
        ++i;
    }
    return digits
}

input.split('\n')
    .filter(str => str !== '')
    .map(parseStr)
    .map(arr => '' + arr[0] + arr[arr.length - 1])
    .reduce((acc, i) => acc + (i - 0), 0)
