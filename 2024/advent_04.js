exports.part1 = input => {
    const rows = input;

    const vertical = Array.from({length: rows[0].length}, (_, i) => i)
        .map(i => rows.map(row => row.charAt(i)).join(''));

    const diagonal = [
        ...Array.from({length: rows.length}, (_, i) => i)
            .map(i => rows.map((row, j) => row.charAt(i + j) || '').join('')),
        ...Array.from({length: rows[0].length - 1}, (_, i) => i)
            .map(i => rows.map((row, j) => row.charAt(j - i - 1) || '').join('')),
        ...Array.from({length: rows.length}, (_, i) => i)
            .map(i => rows.map((row, j) => row.charAt(i - j) || '').join('')),
        ...Array.from({length: rows[0].length - 1}, (_, i) => i)
            .map(i => rows.map((row, j) => row.charAt(row.length + i - j) || '').join(''))
    ];

    const countXmas = row => (row.split('XMAS').length - 1) + (row.split('SAMX').length - 1);

    return [
        ...rows,
        ...vertical,
        ...diagonal
    ]
        .map(countXmas)
        .reduce((acc, c) => acc + c, 0)
};

exports.part2 = input => {
    const rows = input.map(row => row.split(''));

    const get = (i, j) => (rows[i] || [])[j] || '.';

    const checkPattern = (i, j) =>
        get(i + 1, j + 1) === 'A'
        && (
            (get(i, j) === get(i + 2, j) && get(i, j + 2) === get(i + 2, j + 2))
            || (get(i, j) === get(i, j + 2) && get(i + 2, j) === get(i + 2, j + 2))
        )
        && (
            (get(i, j) === 'M' && get(i + 2, j + 2) === 'S')
            || (get(i, j) === 'S' && get(i + 2, j + 2) === 'M')
        )

    return Array.from({length: rows.length}, (_, i) => i)
        .flatMap(i => Array.from({length: rows[0].length}, (_, j) => j)
            .map(j => checkPattern(i, j) ? 1 : 0)
        )
        .reduce((acc, c) => acc + c, 0);
};