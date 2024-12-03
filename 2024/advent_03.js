const pattern1 = /mul\((?<a>\d+),(?<b>\d+)\)/g;
const pattern2 = /((?<enable>do)\(\))|((?<disable>don't)\(\))|((?<mul>mul)\((?<a>\d+),(?<b>\d+)\))/g;

function* matchGenerator(input, pattern) {
    let match;
    while ((match = pattern.exec(input)) !== null) {
        yield match.groups;
    }
}

exports.part1 = input => Array.from(matchGenerator(input, pattern1))
    .reduce((acc, {a, b}) => acc + a * b, 0);

exports.part2 = input => Array.from(matchGenerator(input, pattern2))
    .reduce(({enabled, result}, {enable, disable, a, b}) => {
        if (enable) {
            return {enabled: true, result};
        } else if (disable) {
            return {enabled: false, result};
        } else {
            return {enabled, result: enabled ? result + a * b : result};
        }
    }, {enabled: true, result: 0})
    .result;
