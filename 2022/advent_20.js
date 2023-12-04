const inputFile = process.argv[2] ?? 'input_20.test.txt';
const input = require('fs').readFileSync(inputFile, 'utf8').trimEnd();

const original = input.split('\n')
    .map(row => row - 0)
    .map((v, i) => ({v, i}))

const decrypt = encrypted => Array.from({length: encrypted.length}, (_, i) => i)
    .reduce((data, i) => {
        const j = data.findIndex(v => v.i === i);
        let newJ = (j + data[j].v) % (data.length - 1);
        while (newJ < 0) {
            newJ += Math.ceil(Math.abs(newJ) / (data.length - 1)) * (data.length - 1);
        }
        if (newJ === j) {
            return data;
        } else if (newJ < j) {
            return [...data.slice(0, newJ), data[j], ...data.slice(newJ, j), ...data.slice(j + 1)];
        } else {
            return [...data.slice(0, j), ...data.slice(j + 1, newJ + 1), data[j], ...data.slice(newJ + 1)];
        }
    }, encrypted);

const part1 = () => {
    const decrypted = decrypt(original);
    const i0 = decrypted.findIndex(({v}) => v === 0);
    return decrypted[(i0 + 1000) % decrypted.length].v + decrypted[(i0 + 2000) % decrypted.length].v + decrypted[(i0 + 3000) % decrypted.length].v;
}

const part2 = () => {
    const decrypted = Array.from({length: 10})
        .reduce(data => decrypt(data), original.map(({v, i}) => ({v: v * 811589153, i})));
    const i0 = decrypted.findIndex(({v}) => v === 0);
    return decrypted[(i0 + 1000) % decrypted.length].v + decrypted[(i0 + 2000) % decrypted.length].v + decrypted[(i0 + 3000) % decrypted.length].v;
}

console.log('part1', part1());
console.log('part2', part2());
