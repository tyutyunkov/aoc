const parse = input => {
    const [towels, patterns] = input.join('\n').split('\n\n');
    return {
        towels: towels.split(',').map(towel => towel.trim()),
        patterns: patterns.split('\n')
    }
}

const cache = {'': 1};
const tryPattern = (towels, pattern) => cache[pattern] ??
    (cache[pattern] = towels.filter(towel => pattern.startsWith(towel))
            .map(candidate => tryPattern(towels, pattern.slice(candidate.length)))
            .reduce((acc, v) => acc + v, 0)
    );

exports.part1 = input => {
    const {towels, patterns} = parse(input);
    return patterns.filter(pattern => tryPattern(towels, pattern) > 0).length;
};

exports.part2 = input => {
    const {towels, patterns} = parse(input);
    return patterns.map(pattern => tryPattern(towels, pattern))
        .reduce((acc, v) => acc + v, 0);
};