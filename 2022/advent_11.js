const input =
    require('fs').readFileSync('input_11.txt', 'utf8')
    // require('fs').readFileSync('input_11_.txt', 'utf8')
        // (await fetch('https://adventofcode.com/2022/day/11/input').then(resp => resp.text()))
        .trimEnd();

const getOp = op => {
    switch (op) {
        case '+':
            return (left, right) => left + right;
        case '*':
            return (left, right) => left * right;
        default:
            console.error('unexpected operation');
            return 0;
    }
}
const getValue = (def, item) => def === 'old' ? item : BigInt(def - 0);
const getTest = def => {
    console.assert(def.startsWith('divisible by'));
    const testValue = BigInt(def.substring('divisible by'.length + 1).trim() - 0);
    return {
        testValue,
        test: item => item % testValue === 0n
    };
}

const monkeys = input.split('\n\n')
    .map(monkey => monkey.split('\n'))
    .map(monkey => {
        const id = monkey[0].substring('Monkey '.length + 1, monkey[0].length - 2);
        const items = monkey[1].substring('  Starting items: '.length)
            .split(',')
            .map(item => BigInt(item.trim() - 0));
        const opData = monkey[2].substring('  Operation: new = '.length).trim().split(' ');
        const op = item => getOp(opData[1])(getValue(opData[0], item), getValue(opData[2], item));
        const {test, testValue} = getTest(monkey[3].substring('  Test: '.length));
        const moveToTrue = monkey[4].substring(monkey[4].lastIndexOf(' ') + 1);
        const moveToFalse = monkey[5].substring(monkey[5].lastIndexOf(' ') + 1);
        const moveTo = passed => passed ? moveToTrue : moveToFalse;
        const move = item => moveTo(test(item));
        return {
            id,
            items,
            op,
            move,
            testValue
        }
    })
    .reduce((acc, monkey) => ({...acc, [monkey.id]: monkey}), {});

const cloneMonkeys = monkeys => Object.values(monkeys)
    .reduce((acc, {id, items, op, move, testValue}) => ({
        ...acc,
        [id]: {
            id,
            items: [...items],
            op,
            move,
            testValue
        }
    }), {})

const doRound = (monkeys, worry, stat) => {
    Object.values(monkeys)
        .forEach(monkey => {
            while (monkey.items.length > 0) {
                const newItem = worry(monkey.op(monkey.items.shift()));
                stat[monkey.id] = (stat[monkey.id] ?? 0) + 1;
                monkeys[monkey.move(newItem)].items.push(newItem);
            }
        })
}

const valueOfMostActive = stat => {
    const sorted = Object.values(stat)
        .sort((a, b) => b - a);

    return sorted[0] * sorted[1];
}

const part1Stat = {}
const monkeys1 = cloneMonkeys(monkeys);
Array.from({length: 20})
    .forEach(() => doRound(monkeys1, v => v / 3n, part1Stat))
console.log(valueOfMostActive(part1Stat));

const part2Stat = {}
const monkeys2 = cloneMonkeys(monkeys);
const divisor = Object.values(monkeys2)
    .reduce((acc, {testValue}) => acc * testValue, 1n);
Array.from({length: 10000})
    .forEach(() => doRound(monkeys2, v => v % divisor, part2Stat))
console.log(valueOfMostActive(part2Stat));