const isDigit = c => c >= '0' && c <= '9';

let id = 0;
const parseRows = input => input
    .map(str => str.split('')
        .reduce((acc, v, i) => {
            let value = acc.value;
            if (isDigit(v)) {
                value = !value || !value.number ? {id: ++id, number: true, value: 0} : value;
                value.value = value.value * 10 + (v - 0);
            } else if (v !== '.') {
                value = {symbol: true, gear: v === '*'};
            } else {
                value = {symbol: false};
            }
            return {
                row: [...acc.row, value],
                value,
            }
        }, {
            row: [],
            value: {}
        }).row
    );

const deltas = [
    {di: -1, dj: -1},
    {di: -1, dj: 0},
    {di: -1, dj: 1},
    {di: 0, dj: -1},
    {di: 0, dj: 1},
    {di: 1, dj: -1},
    {di: 1, dj: 0},
    {di: 1, dj: 1},
]

exports.part1 = input => {
    let rows = parseRows(input);
    return rows.flatMap((row, i) =>
        row.flatMap(({symbol}, j) =>
            !symbol
                ? []
                : deltas.map(({di, dj}) => ((rows[i + di] ?? [])[j + dj] ?? {}))
                    .filter(({number}) => !!number)
        )
            .reduce(
                ({ids, values}, v) =>
                    !!ids[v.id]
                        ? {ids, values}
                        : {ids: {...ids, [v.id]: true}, values: [...values, v.value]},
                {ids: {}, values: []}
            )
            .values
    )
        .reduce((acc, v) => acc + v);
}

exports.part2 = input => {
    let rows = parseRows(input);
    return rows
        .flatMap((row, i) =>
            row.map(({gear}, j) => {
                    if (!gear) {
                        return undefined;
                    } else {
                        const parts = deltas.map(({di, dj}) => ((rows[i + di] ?? [])[j + dj] ?? {}))
                            .filter(({number}) => !!number)
                            .reduce(
                                ({ids, values}, v) =>
                                    !!ids[v.id]
                                        ? {ids, values}
                                        : {ids: {...ids, [v.id]: true}, values: [...values, v.value]},
                                {ids: {}, values: []}
                            )
                            .values;
                        return parts.length === 2 ? parts[0] * parts[1] : undefined;
                    }
                }
            )
                .filter(v => v !== undefined)
        )
        .reduce((acc, v) => acc + v);
};
