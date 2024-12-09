const parse = input => input[0];

exports.part1 = input => {
    const data = parse(input);

    const blocks = data.split('').reduce((acc, num, i) => [...acc, ...Array.from({length: num}, _ => i % 2 === 0 ? i / 2 : '.')], [])

    let i = 0;
    let j = blocks.length - 1;
    while (i < j) {
        if (blocks[i] !== '.') {
            ++i;
        } else if (blocks[j] === '.') {
            --j;
        } else {
            blocks[i] = blocks[j];
            blocks[j] = '.';
            ++i;
            --j;
        }
    }

    return blocks.map((v, i) => v === '.' ? 0 : v * i)
        .reduce((acc, v) => acc + v, 0);
};

exports.part2 = input => {
    const data = parse(input);

    let blocks = data.split('').reduce((acc, len, i) => [...acc, {
        file: i % 2 === 0,
        id: i % 2 === 0 ? i / 2 : -1,
        len: Number(len)
    }], [])
        .filter(({len}) => len !== 0);

    let j = blocks.length - 1;
    while (j >= 0) {
        const file = blocks[j];
        if (file.file) {
            let i = 0;
            while (i < j) {
                const block = blocks[i];
                if (block.file) {
                    ++i;
                } else if (block.len >= file.len) {
                    blocks[j] = {file: false, len: file.len};
                    blocks = [...blocks.slice(0, i), file, {file: false, len: block.len - file.len}, ...blocks.slice(i + 1)];
                    ++j;
                    break;
                } else {
                    ++i;
                }
            }
        }
        --j;
    }

    return blocks.reduce((acc, {id, file, len}) => [...acc, ...Array.from({length: len}, _ => file ? id : '.')], [])
        .map((v, i) => v === '.' ? 0 : v * i)
        .reduce((acc, v) => acc + v, 0)
};