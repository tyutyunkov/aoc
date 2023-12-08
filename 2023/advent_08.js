const parse = input => {
    const instructions = input[0].split('');
    const map = input.slice(2)
        .map(str => /(?<item>\w{3}) = \((?<L>\w{3}), (?<R>\w{3})\)/.exec(str).groups)
        .reduce((acc, {item, L, R,}) => ({...acc, [item]: {L, R}}), {})
    return {instructions, map};
}

const accountSteps = (start, data, predicate) => {
    let i = 0;
    let item = start;
    do {
        item = data.map[item][data.instructions[i++ % data.instructions.length]];
    } while (!predicate(item))
    return i;
}

const nod = (a, b) => a % b === 0 ? b : nod(b, a % b)
const nok = (a, b) => a * b / nod(a, b);

exports.part1 = input => accountSteps('AAA', parse(input), item => item === 'ZZZ');

exports.part2 = input => {
    const data = parse(input);
    const steps = Object.keys(data.map)
        .filter(key => key.endsWith('A'))
        .map(item => accountSteps(item, data, item => item.endsWith('Z')));

    return steps.slice(1).reduce((acc, v) => nok(acc, v), steps[0]);
};