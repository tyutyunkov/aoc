const input =
    require('fs').readFileSync('input_14.txt', 'utf8')
    // require('fs').readFileSync('input_14.test.txt', 'utf8')
        // (await fetch('https://adventofcode.com/2022/day/14/input').then(resp => resp.text()))
        .trimEnd();

const buildSeq = (c1, c2) => Array.from({length: Math.abs(c1 - c2) + 1}, (v, i) => Math.min(c1, c2) + i);
const buildPath = (p1, p2) =>
    p1[0] === p2[0]
        ? buildSeq(p1[1], p2[1]).map(v => [p1[0], v])
        : buildSeq(p1[0], p2[0]).map(v => [v, p1[1]])

const data = {};
input.split('\n')
    .forEach(line =>
        line.split('->')
            .map(v => v.trim().split(',').map(c => c - 0))
            .reduce((prev, cur) => {
                    buildPath(prev, cur)
                        .forEach(p => (data[p[0]] = data[p[0]] ?? {})[p[1]] = '#');
                    return cur;
                }
            )
    );

const originalMap = {
    data,
}

const updateAxis = map => {
    map.axisX = Object.keys(map.data)
        .map(v => v - 0)
        .reduce(({min, max}, i) => ({
            min: Math.min(min, i),
            max: Math.max(max, i),
        }), {min: Infinity, max: 0});
    map.axisY = Object.values(map.data)
        .reduce(({min, max}, row) => ({
            min: 0,
            max: Object.keys(row)
                .map(v => v - 0)
                .reduce((acc, i) => Math.max(acc, i), max)
        }), {min: 0, max: 0})
    Array.from({length: map.axisX.max - map.axisX.min + 1}, (v, i) => map.axisX.min + i).forEach(v => map.data[v] = map.data[v] ?? {})
}
updateAxis(originalMap);

const drawMap = map => {
    Array.from({length: map.axisY.max - map.axisY.min + 1}, (v, i) => map.axisY.min + i)
        .forEach(y => {
            console.log(
                ' '.repeat(('' + map.axisY.max).length - ('' + y).length) + y + ' ' +
                Array.from({length: map.axisX.max - map.axisX.min + 1}, (v, i) => map.axisX.min + i)
                    .map(x => map.data[x][y] ?? '.')
                    .join('')
            )
        })
}

const cloneMap = map => {
    const data = Object.keys(map.data)
        .reduce((acc, key) => ({
                ...acc,
                [key]: {...map.data[key]}
            }),
            {});

    return {
        data,
        axisX: map.axisX,
        axisY: map.axisY,
        isFree: (x, y) => !(data[x] = data[x] ?? {})[y],
        setWall: (x, y) => (data[x] = data[x] ?? {})[y] = '#',
        setSand: (x, y) => (data[x] = data[x] ?? {})[y] = 'o',
    };
};

const putSand1 = map => {
    let c = [500, 0];
    while (true) {
        const next = [[c[0], c[1] + 1], [c[0] - 1, c[1] + 1], [c[0] + 1, c[1] + 1]].find(x => map.isFree(x[0], x[1]));
        if (next === undefined) {
            if (!map.isFree(c[0], c[1])) {
                return false;
            } else {
                map.setSand(c[0], c[1]);
                return true;
            }
        }
        if (next[0] < map.axisX.min || next[0] > map.axisX.max || next[1] > map.axisY.max) {
            return false;
        }
        c = next;
    }
}
const putSand2 = map => {
    let c = [500, 0];
    while (true) {
        const next = [[c[0], c[1] + 1], [c[0] - 1, c[1] + 1], [c[0] + 1, c[1] + 1]].find(x => map.isFree(x[0], x[1]));
        if (next === undefined) {
            if (!map.isFree(c[0], c[1])) {
                return false;
            } else {
                map.setSand(c[0], c[1]);
                return true;
            }
        } else if (next[1] > map.axisY.max) {
            map.setSand(next[0], next[1]);
            map.setWall(next[0], next[1] + 1);
            return true;
        }
        c = next;
    }
}

let part1 = 0;
const map1 = cloneMap(originalMap);
while (putSand1(map1)) {
    part1++;
}
console.log(part1);

let part2 = 0;
const map2 = cloneMap(originalMap);
while (putSand2(map2)) {
    part2++;
}
updateAxis(map2);
// drawMap(map2);
console.log(part2);
