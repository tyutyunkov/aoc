const parse = input => ({
    seeds: input[0].split(':')[1].trim().split(' '),
    maps: input.slice(2).reduce(({maps, buf}, row) => {
        let map;
        if (buf === undefined) {
            row.endsWith('map:') || console.error('Unexpected input') && process.exit(1);
            const [src, _, dst] = row.split(' ')[0].split('-');
            map = {src, dst, ranges: []}
            return ({
                buf: map,
                maps: {
                    ...maps,
                    [src]: map,
                }
            })
        } else if (row === '') {
            return ({maps})
        } else {
            const [dst, src, len] = row.split(' ').map(v => v - 0);
            map = buf;
            map.ranges.push({src, dst, len,})
            return ({buf: map, maps})
        }
    }, {
        buf: undefined,
        maps: {}
    }).maps
})

const convert = ({type, value}, maps) => {
    const map = maps[type];
    if (!map) {
        return ({type, value});
    }
    const range = map.ranges.find(({src, len}) => value >= src && value < src + len);
    if (!range) {
        return ({type: map.dst, value: value});
    } else {
        return ({type: map.dst, value: range.dst + value - range.src})
    }
}

const convertRange = (range, maps) => {
    const type = range.type;
    const map = maps[type];
    if (!map) {
        return ({type, range});
    }

    return map.ranges.reduce((acc, r) =>
        acc.flatMap(range => {
            if (range.type !== type) {
                return [range];
            }
            if (r.src <= range.start) {
                if (r.src + r.len < range.start) {
                    return [range];
                } else if (range.start + range.length <= r.src + r.len) {
                    return [{start: r.dst + range.start - r.src, length: range.length, type: map.dst}];
                } else {
                    return [
                        {start: r.dst + range.start - r.src, length: r.src + r.len - range.start, type: map.dst},
                        {start: r.src + r.len, length: range.start + range.length - (r.src + r.len), type: range.type}
                    ];
                }
            } else {
                if (range.start + range.length < r.src) {
                    return [range]
                } else if (range.start + range.length <= r.src + r.len) {
                    return [
                        {start: range.start, length: r.src - range.start, type: range.type},
                        {start: r.dst, length: range.start + range.length - r.src, type: map.dst}
                    ];
                } else {
                    return [
                        {start: range.start, length: r.src - range.start, type: range.type},
                        {start: r.dst, length: r.len, type: map.dst},
                        {start: r.src + r.len, length: range.start + range.length - (r.src + r.len), type: range.type}
                    ]
                }
            }
        }), [range])
        .map(range => {
            if (range.type === type) {
                return {start: range.start, length: range.length, type: map.dst};
            } else {
                return range;
            }
        });
}

exports.part1 = input => {
    const map = parse(input);
    console.dir(map)
    return Object.keys(map.maps)
        .reduce(
            items => items.map(item => convert(item, map.maps)),
            map.seeds.map(value => ({type: 'seed', value: value - 0}))
        )
        .map(({value}) => value)
        .reduce((acc, v) => Math.min(acc, v))
};

exports.part2 = input => {
    const map = parse(input);

    const seeds = Array.from({length: map.seeds.length / 2})
        .map((_, i) => ({start: map.seeds[2 * i] - 0, length: map.seeds[2 * i + 1] - 0}))
        .map(({start, length}) => ({type: 'seed', start, length}));

    return Object.keys(map.maps)
        .reduce(
            items => items.flatMap(item => convertRange(item, map.maps)),
            seeds
        )
        .map(({start}) => start)
        .reduce((acc, v) => Math.min(acc, v))
};