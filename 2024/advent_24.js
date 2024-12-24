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
    const len = Object.keys(commands).filter(k => k.startsWith('z')).length;
    const match = (cmd, op, left, right) => cmd.cmd === op
        && (cmd.left === left && cmd.right === right || cmd.left === right && cmd.right === left);

    const ops = Object.values(commands);
    const key = (prefix, i) => prefix + (i < 10 ? '0' : '') + i;
    let iXOR, ziXOR, iAND1, iAND2, iOR, ix, iy, iz, z;
    let i;
    {
        i = 0;
        // z(0) = x(0) XOR y(0) ; <- iXOR
        iy = key('y', i);
        ix = key('x', i);
        iXOR = ops.find(cmd => match(cmd, 'XOR', ix, iy));
        iAND1 = ops.find(cmd => match(cmd, 'AND', ix, iy));
    }
    {
        i = 1;
        // xy(1) = x(1) XOR y(1)  ; <- iXOR
        // s(0)  = x(0) AND y(0)  ; <- iOR === iAND1
        // z(1)  = xy(1) XOR s(0) ; <- ziXOR
        ix = key('x', i);
        iy = key('y', i);
        iXOR = ops.find(cmd => match(cmd, 'XOR', ix, iy));
        iOR = iAND1;
        iAND1 = ops.find(cmd => match(cmd, 'AND', ix, iy));
        iAND2 = ops.find(cmd => match(cmd, 'AND', iOR.target, iXOR.target));
        ziXOR = ops.find(cmd => match(cmd, 'XOR', iOR.target, iXOR.target));
    }
    const result = [];
    while (++i < len - 1) {
        // xy(i) = x(i) XOR y(i)                            ; <- iXOR
        // z(i)  = xy(i) XOR s(i-1)                         ; <- ziXOR
        // s(i)  = (x(i) AND y(i)) OR (s(i-1) AND xy(i-1))  ; <- iOR
        ix = key('x', i);
        iy = key('y', i);
        iz = key('z', i);
        z = commands[iz];
        iXOR = ops.find(cmd => match(cmd, 'XOR', ix, iy));
        iOR = ops.find(cmd => match(cmd, 'OR', iAND1.target, iAND2.target));
        iAND1 = ops.find(cmd => match(cmd, 'AND', ix, iy));
        if (z.cmd !== 'XOR') {
            iAND2 = ops.find(cmd => match(cmd, 'AND', iOR.target, iXOR.target));
            ziXOR = ops.find(cmd => match(cmd, 'XOR', iOR.target, iXOR.target));
            if (ziXOR.target !== iz) {
                result.push(ziXOR.target, iz);
                commands[iz].target = ziXOR.target;
                ziXOR.target = iz;
            }
        } else {
            if (z.left !== iXOR.target && z.right !== iXOR.target) {
                if (z.left !== iOR.target && z.right !== iOR.target) {
                    console.log('unexpected', z, iXOR, iOR);
                    break;
                }
                const ciXOR = z.left === iOR.target ? z.right : z.left;
                commands[ciXOR].target = iXOR.target;
                iXOR.target = ciXOR;
                result.push(commands[ciXOR].target, ciXOR);
            } else if (z.left !== iOR.target && z.right !== iOR.target) {
                const ciOR = z.left === iXOR.target ? z.right : z.left;
                commands[ciOR].target = iOR.target;
                iOR.target = ciOR;
                result.push(commands[ciOR].target, ciOR);
            }
            iAND2 = ops.find(cmd => match(cmd, 'AND', iOR.target, iXOR.target));
            ziXOR = ops.find(cmd => match(cmd, 'XOR', iOR.target, iXOR.target));
        }
    }
    {
        iz = key('z', i);
        z = commands[iz];
        if (!match(z, 'OR', iAND1.target, iAND2.target)) {
            console.log('unexpected', z);
        }
    }
    return result.sort().join(',');
};