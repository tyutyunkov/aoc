const parse = input => {
    const [times, distances] = input
        .map(row => row.split(':')[1].trim())
        .map(row => row.split(/\s+/));

    return times.map((time, i) => ({
            time: time - 0,
            distance: distances[i] - 0
        })
    );
}

const countBest = ({time, distance}) => {
    const x1 = Math.floor((time - Math.sqrt(time * time - 4 * distance)) / 2);
    const x2 = Math.ceil((time + Math.sqrt(time * time - 4 * distance)) / 2);
    return x2 - x1 - 1;
}

exports.part1 = input => parse(input).map(countBest).reduce((acc, v) => acc * v, 1);

exports.part2 = input => parse(input.map(row => row.replace(/\s+/g, ''))).map(countBest)[0];