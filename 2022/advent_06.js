/// JS
let input = (await fetch('https://adventofcode.com/2022/day/6/input').then(resp => resp.text())).trimEnd();

let searchDistinctBlock = (input, length) => [...input]
    .reduce(({frame, chars, count, res}, v, i, arr) => {
        if (frame.length >= length) {
            let c = frame.shift();
            chars[c]--;
            count -= (chars[c] === 0 ? 1 : 0)
        }
        frame.push(v);
        chars[v] = (chars[v] || 0) + 1;
        count += (chars[v] === 1 ? 1 : 0);
        if (count === length) {
            arr.splice(i + 1);
        }
        return ({frame, chars, count, res: res + 1});
    }, {frame: [], chars: {}, count: 0, res: 0})
    .res;

console.log('part1', searchDistinctBlock(input, 4))
console.log('part2', searchDistinctBlock(input, 14))
