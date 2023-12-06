const part1Limits = {
    red: 12,
    green: 13,
    blue: 14
}
const colors = ['red', 'green', 'blue']

const games = input => input
    .map(str => str.split(':'))
    .map(arr => ({
        id: arr[0].substring('Game '.length) - 0,
        sets: arr[1].split(';')
            .map(set => set.split(',')
                .map(str => str.trim())
                .map(str => str.split(' '))
                .map(cube => ({color: cube[1], count: cube[0] - 0}))
                .reduce((acc, {color, count}) => ({
                    ...acc,
                    [color]: Math.max(acc[color] ?? 0, count)
                }), {})
            )
    }));

exports.part1 = input => games(input)
    .filter(
        ({sets}) =>
            sets.every(set => Object.keys(part1Limits).every(color => (set[color] || 0) <= part1Limits[color]))
    )
    .map(({id}) => id)
    .reduce((acc, v) => acc + v, 0)

exports.part2 = input =>
    games(input).map(({sets}) =>
        sets.reduce((acc, v) =>
                colors.reduce((res, c) => ({
                    ...res,
                    [c]: Math.max(acc[c] ?? 0, v[c] ?? 0)
                }), {})
            , {}))
        .map(min => colors.reduce((res, v) => res * min[v], 1))
        .reduce((acc, v) => acc + v, 0)