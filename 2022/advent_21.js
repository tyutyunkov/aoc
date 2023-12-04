const template = /(?<id>[a-z]+):\s*((?<value>\d+)|((?<left>\w+)\s*(?<op>[+\-*/])\s*(?<right>\w+)))/

const inputFile = process.argv[2] ?? 'input_21.test.txt';
const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd();

const calculate = (op, left, right) => {
    switch (op) {
        case '+':
            return left + right;
        case '-':
            return left - right;
        case '*':
            return left * right;
        case '/':
            return left / right;
        default:
            console.error(`unexpected operator: ${op}`)
    }

}

const defs = input.split('\n')
    .map(row => template.exec(row))
    .map(match => match.groups)
    .map(data => data.value !== undefined ? ({
        id: data.id,
        value: data.value - 0,
    }) : ({
        id: data.id,
        op: data.op,
        left: data.left,
        right: data.right,
    }))
    .reduce((acc, monkey) => ({...acc, [monkey.id]: monkey}), {});

const buildQueue = start => {
    const queue = [start];
    let i = -1;
    while (++i < queue.length) {
        const id = queue[i];
        const {left, right} = defs[id];
        if (defs[left].value === undefined) {
            queue.push(left);
        }
        if (defs[right].value === undefined) {
            queue.push(right);
        }
    }
    return queue.reverse();
}

const processQueue = (data, queue) => {
    queue.forEach(id => {
        const {op, left, right} = defs[id];
        data[id] = calculate(op, data[left], data[right]);
    });

}
const part1 = () => {
    const data = Object.values(defs).filter(({value}) => value !== undefined).reduce((acc, {id, value}) => ({...acc, [id]: value}), {});
    processQueue(data, buildQueue('root'));
    return data['root'];
}

const part2 = () => {
    const me = 'humn';
    const root = defs['root'];
    const data = Object.values(defs).filter(({value}) => value !== undefined).reduce((acc, {id, value}) => ({...acc, [id]: value}), {});

    const queue = buildQueue(root.id);
    processQueue(data, queue);

    const recalculateQueue = queue
        .reduce(({set, queue}, id) =>
            set.has(defs[id].left) || set.has(defs[id].right)
                ? ({
                    set: new Set(set).add(id),
                    queue: [...queue, id],
                })
                : ({
                    set,
                    queue,
                }), {set: new Set().add(me), queue: []})
        .queue;

    let delta = data[root.left] - data[root.right];
    let k = delta;
    while (delta !== 0) {
        data[me] += k;
        processQueue(data, recalculateQueue)
        const newDelta = data[root.left] - data[root.right];
        if (Math.sign(delta) !== Math.sign(newDelta)) {
            k = Math.ceil(-k / 2);
        } else if (Math.abs(newDelta) > Math.abs(delta)) {
            k = -k;
        } else {
            k = Math.ceil(k / 2)
        }
        delta = newDelta
    }


    return data[me];
}

console.log('part1', part1());
console.log('part2', part2());
