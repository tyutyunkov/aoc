const {not} = require('../utils/predicates');

const parse = input => {
    const parts = input.join('\n').split('\n\n');

    return {
        rules: parts[0].split('\n')
            .map(row => row.split('|')).reduce((acc, [left, right]) => ({
                ...acc,
                [left]: [...(acc[left] || []), right]
            }), {}),
        order: parts[1].split('\n').map(row => row.split(','))
    }
}

const rulesValidator = rules => row => row.reduce((valid, value, i) => valid && row.slice(0, i).filter(item => (rules[value] || []).indexOf(item) !== -1).length === 0, true);
const rulesComparator = rules => (a, b) =>
    (rules[a] || []).indexOf(b) !== -1
        ? -1
        : (rules[b] || []).indexOf(a) !== -1
            ? 1 : 0;

exports.part1 = input => {
    const {rules, order} = parse(input);

    return order.filter(rulesValidator(rules))
        .map(row => row[Math.floor(row.length / 2)])
        .map(Number)
        .reduce((acc, v) => acc + v);
};

exports.part2 = input => {
    const {rules, order} = parse(input);

    return order.filter(not(rulesValidator(rules)))
        .map(row => row.sort(rulesComparator(rules)))
        .map(row => row[Math.floor(row.length / 2)])
        .map(Number)
        .reduce((acc, v) => acc + v)
};