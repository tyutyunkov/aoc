const input =
    (await fetch('https://adventofcode.com/2022/day/13/input').then(resp => resp.text()))
        .trimEnd();

const pairs = input.split('\n\n')
    .map(pair => pair.split('\n'))
    .map(pair => ({left: JSON.parse(pair[0]), right: JSON.parse(pair[1])}));

const compare = (left, right) =>
    Array.from({length: Math.max(left.length, right.length)})
        .map((v, i) => i)
        .reduce((acc, i, _, array) => {
            if (acc !== undefined) {
                return acc;
            }
            let compareItem;
            if (left.length <= i) {
                compareItem = true;
            } else if (right.length <= i) {
                compareItem = false;
            } else if (Array.isArray(left[i]) || Array.isArray(right[i])) {
                compareItem = compare(
                    Array.isArray(left[i]) ? left[i] : [left[i]],
                    Array.isArray(right[i]) ? right[i] : [right[i]]
                );
            } else {
                compareItem = left[i] < right[i]
                    ? true
                    : (left[i] > right[i] ? false : undefined);
            }
            return compareItem;
        }, undefined);

const part1 = pairs.reduce((acc, {left, right}, i) => compare(left, right) === true ? acc + i + 1 : acc, 0)
console.log(part1);

const dividers = [[[2]], [[6]]];
const packets = []
    .concat(pairs.flatMap(({left, right}) => ([left, right])))
    .concat(dividers)
    .sort((left, right) => {
        const cmp = compare(left, right);
        return cmp === true ? -1 : (cmp === false ? 1 : 0);
    });
const part2 = (packets.indexOf(dividers[0]) + 1) * (packets.indexOf(dividers[1]) + 1);
console.log(part2);
