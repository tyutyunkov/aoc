const parse = input => input
    .map(row => row.split(''))

const findExpands = map => {
    const ey = Array.from({length: map.length})
        .map((_, i) => i)
        .filter(i => map[i].every(v => v === '.'));
    const ex = Array.from({length: map[0].length})
        .map((_, j) => j)
        .filter(j => Array.from({length: map.length})
            .map((_, i) => i)
            .every(i => map[i][j] === '.')
        );

    return {
        ex, ey
    }
}

const calculateDistances = (map, m = 2) => {
    const {ex,ey} = findExpands(map)
    const galaxies = map.reduce(({index, galaxies}, row, i) =>
            row.reduce(({index, galaxies}, cell, j) => cell === '#'
                    ? ({
                        galaxies: [...galaxies, {x: j, y: i}],
                        index: index + 1,
                    })
                    : ({index, galaxies}),
                {index, galaxies}),
        {index: 0, galaxies: []}
    ).galaxies;

    return galaxies.flatMap((g1, i) =>
        galaxies.slice(i + 1)
            .map(g2 => Math.abs(g2.x - g1.x)
                + Math.abs(g2.y - g1.y)
                + (m - 1) * (
                    ex.filter(x => Math.min(g1.x, g2.x) < x && x < Math.max(g1.x, g2.x)).length
                    + ey.filter(y => Math.min(g1.y, g2.y) < y && y < Math.max(g1.y, g2.y)).length
                )
            )
    )
        .reduce((acc, v) => acc + v, 0)
}

exports.part1 = input => calculateDistances(parse(input))

exports.part2 = input => calculateDistances(parse(input), 1000000)