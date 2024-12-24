const registerPattern = /(?<id>[x-z]\d\d):\s*(?<value>[01])/;
const commandPattern = /(?<left>\w{3})\s*(?<cmd>OR|AND|XOR)\s*(?<right>\w{3})\s*->\s*(?<target>\w{3})/;

const parse = input => {
    const [registers, commands] = input.join('\n')
        .split('\n\n');

    return {
        registers: registers.split('\n')
            .map(register => registerPattern.exec(register).groups)
            .reduce((acc, {id, value}) => ({...acc, [id]: Number(value)}), {}),
        commands: commands.split('\n')
            .map(operation => commandPattern.exec(operation).groups)
            .map(({left, cmd, right, target}) => ({left, cmd, right, target}))
            .reduce((acc, cmd) => ({...acc, [cmd.target]: cmd}), {})
    }
}

const operations = {
    AND: (left, right) => left & right,
    OR: (left, right) => left | right,
    XOR: (left, right) => left ^ right
}

exports.part1 = input => {
    const {registers, commands} = parse(input);
    const value = register => registers[register] ??= operations[commands[register].cmd](value(commands[register].left), value(commands[register].right))

    return Object.keys(commands)
        .filter(key => key.startsWith('z'))
        .map(key => BigInt(value(key)) << BigInt(key.substring(1)))
        .reduce((acc, value) => acc + value, 0n);
}

exports.part2 = input => {
    const {commands} = parse(input);
    const io = ['x', 'y', 'z'];
    const len = Object.keys(commands).filter(k => k.startsWith('z')).length;
    const match = (cmd, op, left, right) => cmd.cmd === op
        && (cmd.left === left && cmd.right === right || cmd.left === right && cmd.right === left);

    const ops = Object.values(commands);
    const key = (prefix, i) => prefix + (i < 10 ? '0' : '') + i;
    const print = ({cmd, left, right, target}) => `${left} ${cmd} ${right} -> ${target}`;

    const swaps = [];
    const swap = (a, b) => {
        swaps.push(a, b);
        commands[a].target = b;
        commands[b].target = a;
        const tmp = commands[a];
        commands[a] = commands[b];
        commands[b] = tmp;
    }

    let iXOR, ziXOR, iAND1, iAND2, iOR, ix, iy, iz, z;
    let i;
    {
        i = 0;
        // z(0) = x(0) XOR y(0) ; <- iXOR
        [ix, iy, iz] = io.map(v => key(v, i));
        iXOR = ops.find(cmd => match(cmd, 'XOR', ix, iy));
        iAND1 = ops.find(cmd => match(cmd, 'AND', ix, iy));
        if (iXOR.target !== iz) {
            if (iAND1.target !== iz) {
                throw new Error('Unexpected at ' + i + ':\n\t' + print(iXOR) + '\n\t' + print(iAND1));
            }
            swap(iXOR.target, iAND1.target);
        }
    }
    while (++i < len - 1) {
        // xy(i) = x(i) XOR y(i)                            ; <- iXOR
        // z(i)  = xy(i) XOR s(i-1)                         ; <- ziXOR
        // s(i)  = (x(i) AND y(i)) OR (s(i-1) AND xy(i-1))  ; <- iOR
        [ix, iy, iz] = io.map(v => key(v, i));
        z = commands[iz];
        iXOR = ops.find(cmd => match(cmd, 'XOR', ix, iy));
        iOR = iAND2 !== undefined ? ops.find(cmd => match(cmd, 'OR', iAND1.target, iAND2.target)) : iAND1;
        iAND1 = ops.find(cmd => match(cmd, 'AND', ix, iy));
        if (z.cmd !== 'XOR') {
            iAND2 = ops.find(cmd => match(cmd, 'AND', iOR.target, iXOR.target));
            ziXOR = ops.find(cmd => match(cmd, 'XOR', iOR.target, iXOR.target));
            swap(ziXOR.target, iz);
        } else {
            if (z.left !== iXOR.target && z.right !== iXOR.target) {
                if (z.left !== iOR.target && z.right !== iOR.target) {
                    throw new Error('Unexpected at ' + i + ':\n\tiXOR: ' + print(iXOR) + '\n\tiOR:' + print(iOR) + '\n\tz:' + print(z));
                }
                swap(iXOR.target, z.left === iOR.target ? z.right : z.left);
            } else if (z.left !== iOR.target && z.right !== iOR.target) {
                swap(iOR.target, z.left === iXOR.target ? z.right : z.left);
            }
            iAND2 = ops.find(cmd => match(cmd, 'AND', iOR.target, iXOR.target));
            ziXOR = ops.find(cmd => match(cmd, 'XOR', iOR.target, iXOR.target));
        }
    }
    {
        iz = key('z', i);
        z = commands[iz];
        if (!match(z, 'OR', iAND1.target, iAND2.target)) {
            throw new Error('Unexpected at ' + i + ':\n\tiAND1: ' + print(iAND1) + '\n\tiAND2:' + print(iAND2) + '\n\tz:' + print(z));
        }
    }
    return swaps.sort().join(',');
};