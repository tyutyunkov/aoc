const inputFile = process.argv[2] ?? 'input_22.txt';
const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd()
    .split('\n\n');

const map = input[0].split('\n')
    .map(row => [...row]);

const rows = map.length;
const rowsInfo = map
    .map(row => row.reduce(({first, last}, v, i) => ({
                first: first === undefined && (v === '.' || v === '#') ? i : first,
                last: first !== undefined && v === ' ' && i < last ? i : last,
            }),
            {first: undefined, last: row.length - 1})
    );

const cols = rowsInfo.reduce((max, {last}) => Math.max(max, last + 1), 0);

const colsInfo = Array.from({length: cols}, (_, i) => i)
    .map(col => map.reduce(({first, last}, _, i) => ({
                first: first === undefined && rowsInfo[i].first <= col && rowsInfo[i].last >= col ? i : first,
                last: first !== undefined && (rowsInfo[i].first > col || rowsInfo[i].last < col) && i < last ? i - 1 : last,
            }),
            {first: undefined, last: map.length - 1})
    );

const actions = [];
const template = /(?<steps>\d+)(?<rd>[LR]|$)/g
let data;
while ((data = template.exec(input[1])) !== null) {
    const {steps, rd} = data.groups;
    actions.push({steps: steps - 0, rd})
}

const rotate = (direction, rotate) => rotate === 'R'
    ? (direction + 1) % 4
    : (rotate === 'L'
            ? (direction + 3) % 4
            : direction
    );

// test map
const cubeSize = 50;
const part2Transform = {
    tx: (x, y, nx, d) => {
        if (nx > rowsInfo[y].last) {
            if (y < cubeSize) { // 2 -> 5
                return {
                    nx: 2 * cubeSize - 1,
                    ny: 3 * cubeSize - 1 - y,
                    nd: rotate(rotate(d, 'R'), 'R'),
                }
            } else if (y < 2 * cubeSize) { // 3 -> 2
                return {
                    nx: cubeSize + y,
                    ny: cubeSize - 1,
                    nd: rotate(d, 'L'),

                }
            } else if (y < 3 * cubeSize) { // 5 -> 2
                return {
                    nx: 3 * cubeSize - 1,
                    ny: cubeSize - 1 - (y - 2 * cubeSize),
                    nd: rotate(rotate(d, 'L'), 'L'),
                }
            } else if (y < 4 * cubeSize) { // 6 -> 5
                return {
                    nx: y - 2 * cubeSize,
                    ny: 3 * cubeSize - 1,
                    nd: rotate(d, 'L'),
                }
            } else {
                console.error('unexpected part x>', x, y);
                return {nx: x, ny: y, nd: d}
            }
        }
        if (nx < rowsInfo[y].first) {
            if (y < cubeSize) { // 1 -> 4
                return {
                    nx: 0,
                    ny: 2 * cubeSize + (cubeSize - 1 - y),
                    nd: rotate(rotate(d, 'L'), 'L'),
                }
            } else if (y < 2 * cubeSize) { // 3 -> 4
                return {
                    nx: y - cubeSize,
                    ny: 2 * cubeSize,
                    nd: rotate(d, 'L'),
                }
            } else if (y < 3 * cubeSize) { // 4 -> 1
                return {
                    nx: cubeSize,
                    ny: cubeSize - 1 - (y - 2 * cubeSize),
                    nd: rotate(rotate(d, 'R'), 'R'),
                }
            } else if (y < 4 * cubeSize) { // 6 -> 1
                return {
                    nx: y - 2 * cubeSize,
                    ny: 0,
                    nd: rotate(rotate(rotate(d, 'R'), 'R'), 'R'),
                }
            } else {
                console.error('unexpected part x<', x, y);
                return {nx: x, ny: y, nd: d}
            }
        }
        return {nx, ny: y, nd: d};
    },
    ty: (x, y, ny, d) => {
        if (ny > colsInfo[x].last) {
            if (x < cubeSize) { // 6 -> 2
                return {
                    nx: x + 2 * cubeSize,
                    ny: 0,
                    nd: d,
                }
            } else if (x < 2 * cubeSize) { // 5 -> 6
                return {
                    nx: cubeSize - 1,
                    ny: x + 2 * cubeSize,
                    nd: rotate(d, 'R'),
                }
            } else if (x < 3 * cubeSize) { // 2 -> 3
                return {
                    nx: 2 * cubeSize - 1,
                    ny: x - cubeSize,
                    nd: rotate(d, 'R'),
                }
            } else {
                console.error('unexpected part y>', x, y);
                return {nx: x, ny: y, nd: d}
            }
        }
        if (ny < colsInfo[x].first) {
            if (x < cubeSize) { // 4 -> 3
                return {
                    nx: cubeSize,
                    ny: cubeSize + x,
                    nd: rotate(d, 'R'),
                }
            } else if (x < 2 * cubeSize) { // 1 -> 6
                return {
                    nx: 0,
                    ny: 2 * cubeSize + x,
                    nd: rotate(rotate(rotate(d, 'L'), 'L'), 'L'),
                }
            } else if (x < 3 * cubeSize) { // 2 -> 6
                return {
                    nx: x - 2 * cubeSize,
                    ny: 4 * cubeSize - 1,
                    nd: d,
                }
            } else {
                console.error('unexpected part y<', x, y);
                return {nx: x, ny: y, nd: d}
            }
        }
        return {nx: x, ny, nd: d};
    },
}
// const cubeSize = 4;
// const part2Transform = {
//     tx: (x, y, nx, d) => {
//         if (nx > rowsInfo[y].last) {
//             if (y < cubeSize) {
//                 const ny = rows - y - 1;
//                 return {
//                     nx: rowsInfo[ny].last,
//                     ny,
//                     nd: rotate(rotate(d, 'R'), 'R'),
//                 }
//             } else if (y < 2 * cubeSize) {
//                 const ny = 2 * cubeSize;
//                 return {
//                     nx: rowsInfo[ny].last - (y - cubeSize),
//                     ny,
//                     nd: rotate(d, 'R'),
//
//                 }
//             } else if (y < 3 * cubeSize) {
//                 const ny = rows - y - 1;
//                 return {
//                     nx: rowsInfo[ny].last,
//                     ny,
//                     nd: rotate(rotate(d, 'R'), 'R'),
//                 }
//             } else {
//                 console.error('unexpected part');
//                 return {nx: x, ny: y, nd: d}
//             }
//         }
//         if (nx < rowsInfo[y].first) {
//             if (y < cubeSize) {
//                 const ny = cubeSize;
//                 return {
//                     nx: cubeSize + x,
//                     ny,
//                     nd: rotate(d, 'L'),
//                 }
//             } else if (y < 2 * cubeSize) {
//                 const ny = cols - 1;
//                 return {
//                     nx: rowsInfo[ny].last - (x - cubeSize),
//                     ny,
//                     nd: rotate(d, 'R'),
//
//                 }
//             } else if (y < 3 * cubeSize) {
//                 const ny = 2 * cubeSize - 1;
//                 return {
//                     nx: 3 * cubeSize - (y - 2 * cubeSize),
//                     ny,
//                     nd: rotate(rotate(d, 'R'), 'R'),
//                 }
//             } else {
//                 console.error('unexpected part');
//                 return {nx: x, ny: y, nd: d}
//             }
//         }
//         return {nx, ny: y, nd: d};
//     },
//     ty: (x, y, ny, d) => {
//         if (ny > colsInfo[x].last) {
//             if (x < cubeSize) {
//                 const ny = cols - 1;
//                 return {
//                     nx: 3 * cubeSize - y,
//                     ny,
//                     nd: rotate(rotate(d, 'R'), 'R'),
//                 }
//             } else if (x < 2 * cubeSize) {
//                 const ny = cols - 1 - (x - cubeSize);
//                 return {
//                     nx: rowsInfo[ny].first,
//                     ny,
//                     nd: rotate(d, 'L'),
//                 }
//             } else if (x < 3 * cubeSize) {
//                 const ny = 2 * cubeSize - 1;
//                 return {
//                     nx: cubeSize - 1 - (x - 2 * cubeSize),
//                     ny,
//                     nd: rotate(rotate(d, 'R'), 'R'),
//                 }
//             } else if (x < 4 * cubeSize) {
//                 const ny = cubeSize + (cols - 1 - x);
//                 return {
//                     nx: 0,
//                     ny,
//                     nd: rotate(d, 'L'),
//                 }
//             } else {
//                 console.error('unexpected part');
//                 return {nx: x, ny: y, nd: d}
//             }
//         }
//         if (ny < colsInfo[x].first) {
//             if (x < cubeSize) {
//                 const ny = 0;
//                 return {
//                     nx: rowsInfo[ny].last - y,
//                     ny,
//                     nd: rotate(rotate(d, 'R'), 'R'),
//                 }
//             } else if (x < 2 * cubeSize) {
//                 const ny = x - cubeSize;
//                 return {
//                     nx: rowsInfo[ny].first,
//                     ny,
//                     nd: rotate(d, 'R'),
//                 }
//             } else if (x < 3 * cubeSize) {
//                 const ny = cubeSize;
//                 return {
//                     nx: 4 * cubeSize - x,
//                     ny,
//                     nd: rotate(rotate(d, 'R'), 'R'),
//                 }
//             } else if (x < 4 * cubeSize) {
//                 const ny = 2 * cubeSize - (x - 3 * cubeSize) - -1;
//                 return {
//                     nx: rowsInfo[ny].last,
//                     ny,
//                     nd: rotate(d, 'L'),
//                 }
//             } else {
//                 console.error('unexpected part');
//                 return {nx: x, ny: y, nd: d}
//             }
//         }
//         return {nx: x, ny, nd: d};
//     },
// }

const part1Transform = {
    tx: (x, y, nx, d) => {
        if (nx > rowsInfo[y].last) {
            return {
                nx: rowsInfo[y].first,
                ny: y,
                nd: d
            };
        }
        if (nx < rowsInfo[y].first) {
            return {
                nx: rowsInfo[y].last,
                ny: y,
                nd: d
            };
        }
        return {nx, ny: y, nd: d};
    },
    ty: (x, y, ny, d) => {
        if (ny > colsInfo[x].last) {
            return {
                nx: x,
                ny: colsInfo[x].first,
                nd: d
            };
        }
        if (ny < colsInfo[x].first) {
            return {
                nx: x,
                ny: colsInfo[x].last,
                nd: d
            };
        }
        return {nx: x, ny, nd: d};
    },

}

const move = (transform, rx, ry, d) => {
    const dx = -(d - 1) % 2;
    const dy = -(d - 2) % 2;
    let nx = rx + dx;
    let ny = ry + dy;
    if (ny === ry) {
        return transform.tx(rx, ry, nx, d);
    }
    if (nx === rx) {
        return transform.ty(rx, ry, ny, d);
    }
    console.error('unexpected move');
    return ({nx, ny, nd: d});
}

const partX = transform =>
    actions.reduce(({x, y, d}, {steps, rd}) => {
        let i = -1;
        let rx = x, ry = y;
        // console.log(rx, ry, d)
        while (++i < steps) {
            const {nx, ny, nd} = move(transform, rx, ry, d);
            if (map[ny][nx] === '.') {
                rx = nx;
                ry = ny;
                d = nd;
                // console.log(rx, ry, d)
            } else if (map[ny][nx] !== '#') {
                console.error('unexpected position', `(${rx}, ${ry})`, `(${nx}, ${ny})`, d)
                process.exit();
            }
        }
        return ({
            x: rx, y: ry, d: rotate(d, rd)
        })
    }, {
        x: rowsInfo[0].first,
        y: 0,
        d: 0,
    })

const score = position => 1000 * (position.y + 1) + 4 * (position.x + 1) + position.d;

// console.log('part1', score(partX(part1Transform)));
console.log('part2', score(partX(part2Transform)));

console.log(rows, cols)