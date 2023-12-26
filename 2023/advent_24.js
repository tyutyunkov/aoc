const parse = input => input
    .map(str => str.split('@').map(str => str.trim()))
    .map(([xyz, dxyz]) => ({xyz: xyz.split(/,\s*/).map(v => v - 0), dxyz: dxyz.split(/,s*/).map(v => v - 0)}))
    .map(({xyz: [x, y, z], dxyz: [dx, dy, dz]}) => ({x, y, z, dx, dy, dz}))

exports.part1 = input => {
    const lines = parse(input);
    const borders = {min: 200000000000000, max: 400000000000000}
    // const borders = {min: 7, max: 27}
    const {min, max} = borders;

    let result = 0;
    for (let i = 0; i < lines.length - 1; ++i) {
        const line1 = lines[i];
        const x1 = line1.x, y1 = line1.y, dx1 = line1.dx, dy1 = line1.dy;
        for (let j = i + 1; j < lines.length; ++j) {
            const line2 = lines[j];
            const x2 = line2.x, y2 = line2.y, dx2 = line2.dx, dy2 = line2.dy;
            if (dx1 * dy2 === dy1 * dx2) {
                continue;
            }
            const t2 = (y2 * dx1 - x2 * dy1 - y1 * dx1 + x1 * dy1) / (dx2 * dy1 - dy2 * dx1);
            const t1 = (y2 + dy2 * t2 - y1) / dy1;
            if (t2 < 0 || t1 < 0) {
                continue
            }
            const x = x2 + dx2 * t2;
            const y = y2 + dy2 * t2;
            if (x < min || x > max || y < min || y > max) {
                continue
            }
            ++result;
        }
    }
    return result;
};

const crossLinesXY = (line0, line1, dx, dy) => {
    const x0 = line0.x, y0 = line0.y, dx0 = line0.dx - dx, dy0 = line0.dy - dy,
        x1 = line1.x, y1 = line1.y, dx1 = line1.dx - dx, dy1 = line1.dy - dy;
    if (dx0 * dy1 === dy0 * dx1) {
        return undefined;
    }
    const t1 = Math.round((y1 * dx0 - x1 * dy0 - y0 * dx0 + x0 * dy0) / (dx1 * dy0 - dy1 * dx0));
    return Math.round(dy0 !== 0 ? (y1 + dy1 * t1 - y0) / dy0 : (x1 + dx1 * t1 - x0) / dx0);
}

const tryDxDy = (lines, dx, dy) => {
    const line0 = lines[0], line1 = lines[1];
    const t0 = crossLinesXY(lines[0], lines[1], dx, dy);
    if (t0 === undefined) {
        return false;
    }

    for (let j = 1; j < lines.length; ++j) {
        const t = crossLinesXY(lines[0], lines[j], dx, dy);
        if (t === undefined || t !== t0) {
            return false;
        }
    }
    return true;
}
const verifyDz = (lines, dx, dy, dz) => {
    const line1 = lines[0];
    const x1 = line1.x, y1 = line1.y, dx1 = line1.dx - dx, dy1 = line1.dy - dy;
    for (let j = 1; j < lines.length; ++j) {
        const line2 = lines[j];
        const x2 = line2.x, y2 = line2.y, dx2 = line2.dx - dx, dy2 = line2.dy - dy;
        if (dx1 * dy2 === dy1 * dx2) {
            continue;
        }
        const t2 = Math.round((y2 * dx1 - x2 * dy1 - y1 * dx1 + x1 * dy1) / (dx2 * dy1 - dy2 * dx1));
        const t1 = Math.round(dy1 !== 0 ? (y2 + dy2 * t2 - y1) / dy1 : (x2 + dx2 * t2 - x1) / dx1);
        const z1 = line1.z + (line1.dz - dz) * t1;
        const z2 = line2.z + (line2.dz - dz) * t2;
        if (z1 !== z2) {
            return false;
        }
    }
    return true;
}

exports.part2 = input => {
    const lines = parse(input);

    const minDx = Math.min(...lines.map(({dx}) => dx)) - 100
    const maxDx = Math.max(...lines.map(({dx}) => dx)) + 100
    const minDy = Math.min(...lines.map(({dy}) => dy)) - 100
    const maxDy = Math.max(...lines.map(({dy}) => dy)) + 100
    const minDz = Math.min(...lines.map(({dz}) => dz)) - 100
    const maxDz = Math.max(...lines.map(({dz}) => dz)) + 100

    const solve = () => {
        for (let dx = minDx; dx <= maxDx; ++dx) {
            for (let dy = minDy; dy <= maxDy; ++dy) {
                if (!tryDxDy(lines, dx, dy)) {
                    continue;
                }
                for (let dz = minDz; dz <= maxDz; ++dz) {
                    if (verifyDz(lines, dx, dy, dz)) {
                        return ({dx, dy, dz});
                    }
                }
            }
        }
    }

    const solution = solve();
    const t = crossLinesXY(lines[0], lines[1], solution.dx, solution.dy);
    return ['x', 'y', 'z'].map(c => lines[0][c] + t * (lines[0]['d' + c] - solution['d' + c]))
        .reduce((acc, v) => acc + v);
};

exports.part2b = input => {
    const lines = parse(input);

    const names = [
        ['x', 'dx', 'y', 'dy'],
        ['y', 'dy', 'z', 'dz'],
        ['z', 'dz', 'x', 'dx'],
    ]

    const buildRow = (i, j, [xn, dxn, yn, dyn]) => {
        const line1 = lines[i], line2 = lines[j];
        const x1 = line1[xn], y1 = line1[yn], dx1 = line1[dxn], dy1 = line1[dyn];
        const x2 = line2[xn], y2 = line2[yn], dx2 = line2[dxn], dy2 = line2[dyn];
        const a = dx2 - dx1,
            b = dy2 - dy1,
            c = x2 - x1,
            d = y2 - y1,
            e = x2 * dy2 - y2 * dx2 - x1 * dy1 + y1 * dx1;
        return [[-b, a, d, -c], -e];
    }

    const findSolution = names => {
        const [xn, dxn, yn, dyn] = names;
        const matrix = [];
        const results = [];
        const i = 0;
        let j = 0;
        while (matrix.length < 4) {
            const [vars, result] = buildRow(i, ++j, names);
            matrix.push(vars);
            results.push(result)
        }

        const math = require('mathjs')
        const solution = math.lusolve(math.lup(matrix), results);
        const values = solution.valueOf();
        return ({[xn]: Math.round(values[0]), [yn]: Math.round(values[1]), [dxn]: Math.round(values[2]), [dyn]: Math.round(values[3])})
    }

    const solution = names.map(names => findSolution(names))
        .reduce((acc, v) => ({...acc, ...v}), {});

    return solution.x + solution.y + solution.z;
}