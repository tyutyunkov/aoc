const inputFile = process.argv[2] ?? 'input_17.test.txt';
const input = [...require('fs').readFileSync(inputFile, 'utf8').trimEnd()];
const wide = 7;

const emptyRow = Array.from({length: wide}, () => '.')
const get = (data, x, y) => (data[y] ?? [])[x] ?? '.';
const set = (data, x, y, symbol) => (data[y] = data[y] ?? [...emptyRow])[x] = symbol;
const figureDefs = [
    {
        height: 1,
        weight: 4,
        template:
            [
                ['@', '@', '@', '@']
            ],
        canMove: (data, {x, y}) =>
            x < wide - 3 &&
            get(data, x, y) === '.' &&
            get(data, x + 1, y) === '.' &&
            get(data, x + 2, y) === '.' &&
            get(data, x + 3, y) === '.'
    },
    {
        height: 3,
        weight: 3,
        template:
            [
                ['.', '@', '.'],
                ['@', '@', '@'],
                ['.', '@', '.'],
            ],
        canMove: (data, {x, y}) =>
            x < wide - 2 &&
            get(data, x + 1, y) === '.' &&
            get(data, x, y + 1) === '.' &&
            get(data, x + 2, y + 1) === '.' &&
            get(data, x + 1, y + 2) === '.'
    },
    {
        height: 3,
        weight: 3,
        template:
            [
                ['.', '.', '@'],
                ['.', '.', '@'],
                ['@', '@', '@'],
            ],
        canMove: (data, {x, y}) =>
            x < wide - 2 &&
            get(data, x, y) === '.' &&
            get(data, x + 1, y) === '.' &&
            get(data, x + 2, y) === '.' &&
            get(data, x + 2, y + 1) === '.' &&
            get(data, x + 2, y + 2) === '.'

    },
    {
        height: 4,
        weight: 1,
        template:
            [
                ['@'],
                ['@'],
                ['@'],
                ['@'],
            ],
        canMove: (data, {x, y}) =>
            x < wide &&
            get(data, x, y) === '.' &&
            get(data, x, y + 1) === '.' &&
            get(data, x, y + 2) === '.' &&
            get(data, x, y + 3) === '.'
    },
    {
        height: 2,
        weight: 2,
        template:
            [
                ['@', '@'],
                ['@', '@'],
            ],

        canMove: (data, {x, y}) =>
            x < wide - 1 &&
            get(data, x, y) === '.' &&
            get(data, x + 1, y) === '.' &&
            get(data, x, y + 1) === '.' &&
            get(data, x + 1, y + 1) === '.'
    }
];

const fillFigure = (data, figure, {x, y}) => {
    figure.template.slice().reverse()
        .forEach((line, dy) => {
            line.forEach((s, dx) => set(data, x + dx, y + dy, s === '@' ? '#' : get(data, x + dx, y + dy)));
        })
}

const moveSide = ({x, y}, move) => ({x: move === '<' ? Math.max(0, x - 1) : Math.min(wide - 1, x + 1), y});
const moveDown = ({x, y}) => ({x, y: y - 1});

const log = state => console.log('height:', state.height, '\n', state.data.slice().reverse()
    .map(row => '|' + row.join('') + '|')
    .join('\n')
);

const getHeight = limit => {
    /// helpers
    let curFigure = 0;
    const figures = (function* () {
        while (true) {
            const res = figureDefs[curFigure];
            curFigure = (curFigure + 1) % figureDefs.length
            // console.log(curFigure)
            yield res;
        }
    })();
    const nextFigure = () => figures.next().value

    let curInput = 0;
    const inputGen = (function* () {
        while (true) {
            const res = input[curInput];
            // console.log(curInput)
            curInput = (curInput + 1) % input.length;
            yield res;
        }
    })()
    const nextMove = () => inputGen.next().value;

    const indexes = {};
    /// logic
    let state = {
        data: [Array.from({length: wide}, _ => '#')],
        height: 0,
        heights: {}
    }
    let template;
    let i = -1;
    while (++i < limit) {
        if (curFigure === 0) {
            (indexes[curInput] = indexes[curInput] ?? []).push(i);

            if (indexes[curInput].length > 4) {
                if (state.heights[indexes[curInput][1]] - state.heights[indexes[curInput][0]] ===
                    state.heights[indexes[curInput][2]] - state.heights[indexes[curInput][1]]) {
                    template = indexes[curInput];
                    break;
                }
            }
        }
        const figure = nextFigure();
        let pos = {x: 2, y: state.height + 1};

        pos = Array.from({length: 3})
            .reduce((cur, move) => {
                const res = moveSide(cur, nextMove());
                // console.log(cur, move, res)
                return res.x === cur.x || !figure.canMove(state.data, res) ? cur : res;
            }, pos)

        while (true) {
            let newPos = moveSide(pos, nextMove());
            if (figure.canMove(state.data, newPos)) {
                pos = newPos;
            }
            newPos = moveDown(pos);
            if (!figure.canMove(state.data, newPos)) {
                break;
            }
            pos = newPos;
        }

        state.height = Math.max(state.height, pos.y + figure.height - 1);
        state.heights[i] = state.height;
        fillFigure(state.data, figure, pos);
    }
    if (!template) {
        return state.height;
    }

    const start = template[0];
    const period = template[1] - template[0];
    const repeats = Math.floor((limit - start) / period);
    const remain = limit - start - repeats * period - 1;
    return (state.heights[template[1]] - state.heights[template[0]]) * repeats + (state.heights[template[0] + remain]);
}

console.log('part1', getHeight(2022));
console.log('part1', getHeight(1000000000000));