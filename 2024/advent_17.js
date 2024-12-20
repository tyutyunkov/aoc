const registerPattern = /(?<r>[A-C]):\s*(?<v>\d+)/;
const parse = input => {
    const [registers, program] = input.join('\n')
        .split('\n\n');

    return {
        registers: registers.split('\n')
            .map(register => registerPattern.exec(register).groups)
            .reduce((acc, {r, v}) => ({...acc, [r]: BigInt(v)}), {}),
        program: program.split(' ')[1].split(',').map(BigInt)
    }
}

const comboValue = (combo, registers) => {
    switch (combo) {
        case 0n:
        case 1n:
        case 2n:
        case 3n:
            return combo;
        case 4n:
            return registers['A'];
        case 5n:
            return registers['B'];
        case 6n:
            return registers['C'];
        case 7n:
        default:
            throw new Error('Unexpected combo value: ' + combo);
    }
}

const functions = {
    // adv
    0: (program, pointer, operand, registers, out) => {
        registers['A'] = registers['A'] >> comboValue(operand, registers);

        return pointer + 2;
    },
    // bxl
    1: (program, pointer, operand, registers, out) => {
        registers['B'] = registers['B'] ^ operand;
        return pointer + 2;
    },
    // bst
    2: (program, pointer, operand, registers, out) => {
        registers['B'] = comboValue(operand, registers) % 8n;
        return pointer + 2;
    },
    // jnz
    3: (program, pointer, operand, registers, out) => {
        return registers['A'] === 0n ? pointer + 2 : Number(operand);
    },
    // bxc
    4: (program, pointer, operand, registers, out) => {
        registers['B'] = registers['B'] ^ registers['C'];
        return pointer + 2;
    },
    // out
    5: (program, pointer, operand, registers, out) => {
        out.push(comboValue(operand, registers) % 8n);
        return pointer + 2;
    },
    // bdv
    6: (program, pointer, operand, registers, out) => {
        registers['B'] = registers['A'] >> comboValue(operand, registers);
        return pointer + 2;
    },
    // cdv
    7: (program, pointer, operand, registers, out) => {
        registers['C'] = registers['A'] >> comboValue(operand, registers);
        return pointer + 2;
    },
}

const launchProgram = (registers, program) => {
    let pointer = 0;
    const out = [];
    while (pointer < program.length) {
        const opcode = program[pointer];
        const operand = program[pointer + 1];
        pointer = functions[opcode](program, pointer, operand, registers, out);
    }
    return out;
}

exports.part1 = input => {
    const {registers, program} = parse(input);
    return launchProgram(registers, program).join(',');
};

exports.part2 = input => {
    const {program} = parse(input);

    const find = (a, v) => {
        let i = -1;
        while (++i < 1 << 3) {
            const registers = {A: a + BigInt(i), B: 0n, C: 0n};
            const [result] = launchProgram(registers, program);
            if (result === v) {
                return i;
            }
        }
    }

    let result = 0n;
    const copy = [...program];
    while (copy.length > 0) {
        result <<= 3n;
        const digit = copy.pop();
        const number = find(result, digit);
        if (number === undefined) {
            throw new Error('No candidates of A found for \'' + digit + '\'\n' +
                '\tcurrent A: ' + (result >> 3n) + '\n' +
                '\tcurrent tail: [' + launchProgram({A: result >> 3n, B: 0n, C: 0n}, program).join(',') + ']'
            );
        }
        result += BigInt(number);
    }

    return result;
}