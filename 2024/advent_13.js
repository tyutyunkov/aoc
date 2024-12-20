const pattern = /Button A: X\+(?<ax>\d+), Y\+(?<ay>\d+)\s*Button B: X\+(?<bx>\d+), Y\+(?<by>\d+)\s*Prize: X=(?<px>\d+), Y=(?<py>\d+)/;

const parse = input => input.join('\n')
    .split('\n\n')
    .map(block => pattern.exec(block).groups)
    .map(({ax, ay, bx, by, px, py}) => ({
        ax: Number(ax),
        ay: Number(ay),
        bx: Number(bx),
        by: Number(by),
        px: Number(px),
        py: Number(py)
    }));

const findIntersection = ({ax, ay, bx, by, px, py}) => {
    const b = Math.round((py - px * ay / ax) / (by - bx * ay / ax));
    const a = Math.round((px - b * bx) / ax);

    return ax * a + bx * b === px && ay * a + by * b === py && a >= 0 && b >= 0 ? {a, b} : null;
};

exports.part1 = input =>
    parse(input)
        .map(findIntersection)
        .filter(x => x !== null)
        .map(({a, b}) => 3 * a + b)
        .reduce((acc, v) => acc + v, 0);

exports.part2 = input =>
    parse(input)
        .map(({ax, ay, bx, by, px, py}) => ({
            ax, ay, bx, by, px: px + 10000000000000, py: py + 10000000000000
        }))
        .map(findIntersection)
        .filter(x => x !== null)
        .map(({a, b}) => 3 * a + b)
        .reduce((acc, v) => acc + v, 0);
